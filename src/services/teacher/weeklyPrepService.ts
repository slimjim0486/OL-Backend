// Weekly Prep Service — Generates full-week material packages from teacher memory/context
import {
  WeeklyPrepStatus,
  MaterialStatus,
  MaterialType,
  AgentInteractionType,
  Prisma,
} from '@prisma/client';
import { prisma } from '../../config/database.js';
import { genAI, TEACHER_CONTENT_SAFETY_SETTINGS } from '../../config/gemini.js';
import { config } from '../../config/index.js';
import { agentMemoryService } from './agentMemoryService.js';
import { contextAssemblerService } from './contextAssemblerService.js';
import { contentGenerationService } from './contentGenerationService.js';
import { reinforcementService } from './reinforcementService.js';
import { logger } from '../../utils/logger.js';
import { TeacherPlanRequiredError, hasTeacherTierAccess } from '../../middleware/teacherPlanGate.js';

// ============================================
// TYPES
// ============================================

export interface WeeklyPrepOptions {
  triggeredBy?: 'manual' | 'scheduled' | 'chat';
  weekStartDate?: Date; // defaults to upcoming Monday
}

interface PlanDay {
  dayOfWeek: number; // 0-4
  date: string; // ISO
  subjects: Array<{
    subject: string;
    topic: string;
    standards?: string[];
    materials: Array<{
      type: string; // maps to MaterialType
      title: string;
      description: string;
    }>;
  }>;
}

interface WeeklyPlan {
  days: PlanDay[];
  weekSummary: string;
  totalMaterialCount: number;
}

interface MaterialGenerationOptions {
  feedbackNote?: string;
}

interface RegenerateMaterialOptions {
  feedbackNote?: string;
  titleOverride?: string;
  subjectOverride?: string;
}

const PENDING_REVIEW_STATUSES: MaterialStatus[] = [
  MaterialStatus.GENERATED,
  MaterialStatus.EDITED,
];

const REVIEWABLE_STATUSES: MaterialStatus[] = [
  MaterialStatus.APPROVED,
  ...PENDING_REVIEW_STATUSES,
];

// ============================================
// INITIATING A WEEKLY PREP
// ============================================

async function initiateWeeklyPrep(
  teacherId: string,
  opts?: WeeklyPrepOptions
): Promise<{ prepId: string; weekLabel: string }> {
  const agent = await agentMemoryService.getAgent(teacherId);
  if (!agent) throw new Error('Agent not initialized.');
  if (!agent.onboardingComplete) throw new Error('Please complete onboarding first.');

  const weekStart = normalizeWeekStartDate(opts?.weekStartDate || getNextMonday());
  const weekEnd = getDayAfter(weekStart);
  const weekLabel = formatWeekLabel(weekStart);

  // Check for duplicate
  const existing = await prisma.agentWeeklyPrep.findFirst({
    where: {
      agentId: agent.id,
      weekStartDate: {
        gte: weekStart,
        lt: weekEnd,
      },
      status: { notIn: [WeeklyPrepStatus.FAILED] },
    },
  });
  if (existing) {
    return { prepId: existing.id, weekLabel: existing.weekLabel };
  }

  await enforceWeeklyPrepCreationAccess(teacherId, agent.id, weekStart, weekEnd);

  const prep = await prisma.agentWeeklyPrep.create({
    data: {
      agentId: agent.id,
      weekLabel,
      weekStartDate: weekStart,
      schoolYear: getCurrentSchoolYear(),
      status: WeeklyPrepStatus.GENERATING,
      triggeredBy: opts?.triggeredBy || 'manual',
    },
  });

  return { prepId: prep.id, weekLabel };
}

// ============================================
// PLAN GENERATION (Step 1 of job)
// ============================================

async function generateWeeklyPlan(prepId: string): Promise<void> {
  const prep = await prisma.agentWeeklyPrep.findUniqueOrThrow({
    where: { id: prepId },
    include: { agent: true },
  });

  const context = await contextAssemblerService.assembleContext(
    prep.agent.teacherId,
    'WEEKLY_PREP'
  );

  const additionalContext = contextAssemblerService.buildAdditionalContextString(context);

  const prompt = buildPlanningPrompt(prep.weekLabel, prep.weekStartDate, additionalContext);

  const model = genAI.getGenerativeModel({
    model: config.gemini.models.flash,
    safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8000,
      responseMimeType: 'application/json',
    },
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const planTokens = result.response.usageMetadata?.totalTokenCount || 2000;

  let plan: WeeklyPlan;
  try {
    plan = JSON.parse(text);
  } catch {
    logger.error('Failed to parse weekly plan JSON', { prepId, text: text.substring(0, 500) });
    await prisma.agentWeeklyPrep.update({
      where: { id: prepId },
      data: { status: WeeklyPrepStatus.FAILED },
    });
    throw new Error('Failed to parse weekly plan from AI');
  }

  // Create AgentMaterial records in PENDING status
  const materialRecords: Prisma.AgentMaterialCreateManyInput[] = [];
  let totalCount = 0;

  for (const day of plan.days) {
    let sortOrder = 0;
    const dayDate = new Date(day.date);

    for (const subjectBlock of day.subjects) {
      for (const mat of subjectBlock.materials) {
        materialRecords.push({
          weeklyPrepId: prepId,
          dayOfWeek: day.dayOfWeek,
          dayDate,
          sortOrder: sortOrder++,
          subject: subjectBlock.subject.toUpperCase(),
          materialType: mapToMaterialType(mat.type),
          title: mat.title,
          description: mat.description,
          planContext: {
            topic: subjectBlock.topic,
            standards: subjectBlock.standards || [],
            notes: mat.description,
          } as any,
          status: MaterialStatus.PENDING,
        });
        totalCount++;
      }
    }
  }

  await prisma.agentMaterial.createMany({ data: materialRecords });

  await prisma.agentWeeklyPrep.update({
    where: { id: prepId },
    data: {
      plan: plan as any,
      totalMaterials: totalCount,
      planTokensUsed: planTokens,
      totalTokensUsed: planTokens,
    },
  });

  logger.info('Weekly plan generated', { prepId, totalMaterials: totalCount, planTokens });
}

// ============================================
// MATERIAL GENERATION (Step 2 of job)
// ============================================

async function generateMaterials(prepId: string): Promise<void> {
  const prep = await prisma.agentWeeklyPrep.findUniqueOrThrow({
    where: { id: prepId },
    include: { agent: true },
  });

  const pendingMaterials = await prisma.agentMaterial.findMany({
    where: { weeklyPrepId: prepId, status: MaterialStatus.PENDING },
    orderBy: [{ dayOfWeek: 'asc' }, { sortOrder: 'asc' }],
  });

  // Load classroom context once for differentiation
  const snapshot = await agentMemoryService.getFullMemorySnapshot(prep.agent.teacherId);
  const studentGroups = extractStudentGroups(snapshot?.classrooms || []);

  let generatedCount = 0;
  let failedCount = 0;
  let materialTokens = 0;

  for (const material of pendingMaterials) {
    try {
      await prisma.agentMaterial.update({
        where: { id: material.id },
        data: { status: MaterialStatus.GENERATING },
      });

      const result = await generateSingleMaterial(material, prep.agent.teacherId);

      // Generate differentiated versions if student groups exist
      let differentiated: any = null;
      if (studentGroups.length > 0 && result.content) {
        try {
          differentiated = await generateDifferentiatedVersions(
            result.content,
            material.materialType,
            studentGroups
          );
        } catch (err) {
          logger.warn('Differentiation failed, skipping', { materialId: material.id, error: (err as Error).message });
        }
      }

      await prisma.agentMaterial.update({
        where: { id: material.id },
        data: {
          content: result.content as any,
          differentiatedContent: differentiated as any,
          status: MaterialStatus.GENERATED,
          tokensUsed: result.tokensUsed,
          modelUsed: result.modelUsed,
          generatedAt: new Date(),
        },
      });

      materialTokens += result.tokensUsed;
      generatedCount++;

      // Update prep progress
      await prisma.agentWeeklyPrep.update({
        where: { id: prepId },
        data: {
          generatedCount,
          materialTokensUsed: materialTokens,
          totalTokensUsed: { increment: result.tokensUsed },
        },
      });
    } catch (err) {
      logger.error('Material generation failed', { materialId: material.id, error: (err as Error).message });
      await prisma.agentMaterial.update({
        where: { id: material.id },
        data: { status: MaterialStatus.FAILED },
      });
      failedCount++;
      await prisma.agentWeeklyPrep.update({
        where: { id: prepId },
        data: { failedCount },
      });
    }
  }

  // Mark prep as READY
  await prisma.agentWeeklyPrep.update({
    where: { id: prepId },
    data: {
      status: WeeklyPrepStatus.READY,
      generatedCount,
      failedCount,
    },
  });

  // Record interaction
  await agentMemoryService.recordInteraction(prep.agentId, {
    type: AgentInteractionType.WEEKLY_PREP,
    summary: `Generated weekly prep: ${prep.weekLabel} (${generatedCount} materials)`,
    input: prep.weekLabel,
    outputType: 'weekly_prep',
    outputId: prepId,
    tokensUsed: prep.planTokensUsed + materialTokens,
    modelUsed: config.gemini.models.flash,
  });

  logger.info('Weekly prep materials generated', { prepId, generatedCount, failedCount, materialTokens });
}

// ============================================
// SINGLE MATERIAL GENERATION
// ============================================

async function generateSingleMaterial(
  material: any,
  teacherId: string,
  opts?: MaterialGenerationOptions
): Promise<{ content: any; tokensUsed: number; modelUsed: string }> {
  const planCtx = (material.planContext as any) || {};
  const prompt = buildMaterialPrompt(
    material.materialType,
    material.title,
    material.subject,
    planCtx,
    opts
  );

  const model = genAI.getGenerativeModel({
    model: config.gemini.models.flash,
    safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
    generationConfig: {
      temperature: 0.65,
      maxOutputTokens: getMaterialTokenLimit(material.materialType),
      responseMimeType: 'application/json',
    },
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const tokensUsed = result.response.usageMetadata?.totalTokenCount || 1000;

  let content: any;
  try {
    content = JSON.parse(text);
  } catch {
    // Fall back to text content
    content = { rawContent: text, title: material.title };
  }

  return { content, tokensUsed, modelUsed: config.gemini.models.flash };
}

// ============================================
// DIFFERENTIATION
// ============================================

async function generateDifferentiatedVersions(
  baseContent: any,
  materialType: MaterialType,
  studentGroups: Array<{ name: string; level: string; count: number }>
): Promise<any> {
  const prompt = `You are a differentiation specialist. Given this base educational material and student groups, create differentiated versions.

BASE MATERIAL:
${JSON.stringify(baseContent, null, 2)}

STUDENT GROUPS:
${studentGroups.map((g) => `- ${g.name}: ${g.level} level (${g.count} students)`).join('\n')}

Create differentiated versions in this JSON structure:
{
  "above": { /* Version for above-grade-level students — more challenging, extended thinking */ },
  "onLevel": { /* Version for on-level students — same core content, clear scaffolding */ },
  "below": { /* Version for below-grade-level students — simplified, more support */ },
  "ellScaffolding": { /* ELL supports — vocabulary pre-teaching, sentence frames, visual aids */ }
}

Each version should maintain the same topic and learning objective but adjust complexity, vocabulary, and scaffolding. Return ONLY valid JSON.`;

  const model = genAI.getGenerativeModel({
    model: config.gemini.models.flash,
    safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
    generationConfig: {
      temperature: 0.5,
      maxOutputTokens: 6000,
      responseMimeType: 'application/json',
    },
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  return JSON.parse(text);
}

// ============================================
// CRUD / QUERY
// ============================================

async function getWeeklyPrep(prepId: string, teacherId: string) {
  const agent = await agentMemoryService.getAgent(teacherId);
  if (!agent) throw new Error('Agent not found');

  const prep = await prisma.agentWeeklyPrep.findFirst({
    where: { id: prepId, agentId: agent.id },
    include: {
      materials: {
        orderBy: [{ dayOfWeek: 'asc' }, { sortOrder: 'asc' }],
      },
      audioUpdate: true,
    },
  });
  if (!prep) throw new Error('Weekly prep not found');
  await enforceWeeklyPrepAccess(teacherId, agent.id, prep.id);
  return prep;
}

async function getWeeklyPrepList(
  teacherId: string,
  opts?: { page?: number; limit?: number }
) {
  const agent = await agentMemoryService.getAgent(teacherId);
  if (!agent) return { preps: [], total: 0 };

  const hasPro = await hasTeacherTierAccess(teacherId, 'PROFESSIONAL');
  if (!hasPro) {
    const [firstPrep, allWeekCount] = await Promise.all([
      prisma.agentWeeklyPrep.findFirst({
        where: {
          agentId: agent.id,
          status: { notIn: [WeeklyPrepStatus.FAILED] },
        },
        orderBy: [{ weekStartDate: 'asc' }, { createdAt: 'asc' }],
        include: {
          _count: { select: { materials: true } },
        },
      }),
      prisma.agentWeeklyPrep.count({
        where: {
          agentId: agent.id,
          status: { notIn: [WeeklyPrepStatus.FAILED] },
        },
      }),
    ]);

    return {
      preps: firstPrep ? [firstPrep] : [],
      total: firstPrep ? 1 : 0,
      lockedWeeks: Math.max(0, allWeekCount - (firstPrep ? 1 : 0)),
    };
  }

  const page = opts?.page || 1;
  const limit = opts?.limit || 10;

  const [preps, total] = await Promise.all([
    prisma.agentWeeklyPrep.findMany({
      where: { agentId: agent.id },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        _count: { select: { materials: true } },
      },
    }),
    prisma.agentWeeklyPrep.count({ where: { agentId: agent.id } }),
  ]);

  return { preps, total };
}

async function getWeeklyPrepProgress(prepId: string, teacherId: string) {
  const agent = await agentMemoryService.getAgent(teacherId);
  if (!agent) throw new Error('Agent not found');
  await enforceWeeklyPrepAccess(teacherId, agent.id, prepId);

  const prep = await prisma.agentWeeklyPrep.findFirst({
    where: { id: prepId, agentId: agent.id },
    select: {
      id: true,
      status: true,
      totalMaterials: true,
      generatedCount: true,
      approvedCount: true,
      failedCount: true,
    },
  });
  if (!prep) throw new Error('Weekly prep not found');
  return prep;
}

// ============================================
// APPROVE / EDIT / REGENERATE
// ============================================

async function approveMaterial(materialId: string, teacherId: string): Promise<void> {
  const material = await verifyMaterialOwnership(materialId, teacherId);

  await prisma.agentMaterial.update({
    where: { id: materialId },
    data: { status: MaterialStatus.APPROVED, approvedAt: new Date() },
  });

  const agent = await agentMemoryService.getAgent(teacherId);
  if (agent) {
    await reinforcementService.recordApprovalSignal(agent.id, {
      contentType: mapWeeklyMaterialToContentType(material.materialType),
      subject: material.subject,
    });
  }

  await refreshWeeklyPrepReviewStatus(material.weeklyPrepId);
}

async function approveAllMaterials(prepId: string, teacherId: string): Promise<number> {
  const agent = await agentMemoryService.getAgent(teacherId);
  if (!agent) throw new Error('Agent not found');
  await enforceWeeklyPrepAccess(teacherId, agent.id, prepId);

  const prep = await prisma.agentWeeklyPrep.findFirst({
    where: { id: prepId, agentId: agent.id },
  });
  if (!prep) throw new Error('Weekly prep not found');

  const materialsToApprove = await prisma.agentMaterial.findMany({
    where: {
      weeklyPrepId: prepId,
      status: { in: PENDING_REVIEW_STATUSES },
    },
    select: { id: true, materialType: true, subject: true },
  });

  const result = await prisma.agentMaterial.updateMany({
    where: {
      weeklyPrepId: prepId,
      status: { in: PENDING_REVIEW_STATUSES },
    },
    data: { status: MaterialStatus.APPROVED, approvedAt: new Date() },
  });
  await refreshWeeklyPrepReviewStatus(prepId);

  // Reinforcement: record approvals per material so we can learn content-type/subject patterns.
  for (const m of materialsToApprove) {
    await reinforcementService.recordApprovalSignal(
      agent.id,
      {
        contentType: mapWeeklyMaterialToContentType(m.materialType),
        subject: m.subject,
      },
      { skipAggregate: true }
    );
  }
  await reinforcementService.maybeAutoAggregate(agent.id);

  return result.count;
}

async function updateMaterial(
  materialId: string,
  teacherId: string,
  editedContent: any,
  teacherNotes?: string
): Promise<void> {
  const material = await verifyMaterialOwnership(materialId, teacherId);

  await prisma.agentMaterial.update({
    where: { id: materialId },
    data: {
      editedContent: editedContent as any,
      teacherNotes,
      status: MaterialStatus.EDITED,
    },
  });

  const agent = await agentMemoryService.getAgent(teacherId);
  if (agent) {
    const baseline = material.editedContent ?? material.content;
    const originalText = materialContentToText(baseline);
    const editedText = materialContentToText(editedContent);
    await reinforcementService.recordEditSignals(agent.id, originalText, editedText, {
      contentType: mapWeeklyMaterialToContentType(material.materialType),
      subject: material.subject,
    });
  }

  await refreshWeeklyPrepReviewStatus(material.weeklyPrepId);
}

async function regenerateMaterial(
  materialId: string,
  teacherId: string,
  opts?: RegenerateMaterialOptions
): Promise<void> {
  const material = await verifyMaterialOwnership(materialId, teacherId);
  const titleOverride = normalizeMaterialTitle(opts?.titleOverride);
  const subjectOverride = normalizeMaterialSubject(opts?.subjectOverride);

  const nextTitle = titleOverride || material.title;
  const nextSubject = subjectOverride || material.subject;
  const teacherFeedback = buildRegenerationFeedbackNote(
    opts?.feedbackNote,
    material.title,
    nextTitle,
    material.subject,
    nextSubject
  );

  await prisma.agentMaterial.update({
    where: { id: materialId },
    data: { status: MaterialStatus.REGENERATING },
  });

  try {
    const result = await generateSingleMaterial(
      { ...material, title: nextTitle, subject: nextSubject },
      teacherId,
      { feedbackNote: teacherFeedback }
    );

    await prisma.agentMaterial.update({
      where: { id: materialId },
      data: {
        content: result.content as any,
        title: nextTitle,
        subject: nextSubject,
        status: MaterialStatus.GENERATED,
        tokensUsed: { increment: result.tokensUsed },
        modelUsed: result.modelUsed,
        generatedAt: new Date(),
        editedContent: Prisma.JsonNull,
      },
    });

    // Update prep token count
    await prisma.agentWeeklyPrep.update({
      where: { id: material.weeklyPrepId },
      data: {
        materialTokensUsed: { increment: result.tokensUsed },
        totalTokensUsed: { increment: result.tokensUsed },
      },
    });
    await refreshWeeklyPrepReviewStatus(material.weeklyPrepId);
  } catch (err) {
    await prisma.agentMaterial.update({
      where: { id: materialId },
      data: { status: MaterialStatus.FAILED },
    });
    throw err;
  }

  const agent = await agentMemoryService.getAgent(teacherId);
  if (agent) {
    await reinforcementService.recordRegenerationSignal(agent.id, teacherFeedback, {
      contentType: mapWeeklyMaterialToContentType(material.materialType),
      subject: nextSubject,
    });
  }
}

interface FinalizeWeeklyPrepResult {
  finalized: boolean;
  status: WeeklyPrepStatus;
  approvedCount: number;
  pendingCount: number;
  reviewableCount: number;
  pendingMaterials: Array<{
    id: string;
    title: string;
    subject: string;
    materialType: MaterialType;
    dayOfWeek: number;
    status: MaterialStatus;
  }>;
}

async function finalizeWeeklyPrep(
  prepId: string,
  teacherId: string
): Promise<FinalizeWeeklyPrepResult> {
  const agent = await agentMemoryService.getAgent(teacherId);
  if (!agent) throw new Error('Agent not found');
  await enforceWeeklyPrepAccess(teacherId, agent.id, prepId);

  const prep = await prisma.agentWeeklyPrep.findFirst({
    where: { id: prepId, agentId: agent.id },
  });
  if (!prep) throw new Error('Weekly prep not found');

  const [approvedCount, pendingCount, reviewableCount, pendingMaterials] = await Promise.all([
    prisma.agentMaterial.count({
      where: { weeklyPrepId: prepId, status: MaterialStatus.APPROVED },
    }),
    prisma.agentMaterial.count({
      where: { weeklyPrepId: prepId, status: { in: PENDING_REVIEW_STATUSES } },
    }),
    prisma.agentMaterial.count({
      where: { weeklyPrepId: prepId, status: { in: REVIEWABLE_STATUSES } },
    }),
    prisma.agentMaterial.findMany({
      where: { weeklyPrepId: prepId, status: { in: PENDING_REVIEW_STATUSES } },
      orderBy: [{ dayOfWeek: 'asc' }, { sortOrder: 'asc' }],
      select: {
        id: true,
        title: true,
        subject: true,
        materialType: true,
        dayOfWeek: true,
        status: true,
      },
    }),
  ]);

  if (pendingCount > 0 || reviewableCount === 0) {
    const nextStatus = reviewableCount > 0 ? WeeklyPrepStatus.REVIEWING : prep.status;
    if (prep.status !== nextStatus || prep.approvedCount !== approvedCount) {
      await prisma.agentWeeklyPrep.update({
        where: { id: prepId },
        data: { status: nextStatus, approvedCount },
      });
    }

    return {
      finalized: false,
      status: nextStatus,
      approvedCount,
      pendingCount,
      reviewableCount,
      pendingMaterials,
    };
  }

  await prisma.agentWeeklyPrep.update({
    where: { id: prepId },
    data: {
      status: WeeklyPrepStatus.APPROVED,
      approvedCount,
    },
  });

  return {
    finalized: true,
    status: WeeklyPrepStatus.APPROVED,
    approvedCount,
    pendingCount: 0,
    reviewableCount,
    pendingMaterials: [],
  };
}

// ============================================
// HELPERS
// ============================================

async function verifyMaterialOwnership(materialId: string, teacherId: string) {
  const agent = await agentMemoryService.getAgent(teacherId);
  if (!agent) throw new Error('Agent not found');

  const material = await prisma.agentMaterial.findUnique({
    where: { id: materialId },
    include: { weeklyPrep: { select: { id: true, agentId: true } } },
  });
  if (!material || material.weeklyPrep.agentId !== agent.id) {
    throw new Error('Material not found');
  }
  await enforceWeeklyPrepAccess(teacherId, agent.id, material.weeklyPrep.id);
  return material;
}

function getNextMonday(): Date {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 1=Mon, ...
  const daysUntilMonday = day === 0 ? 1 : day === 1 ? 7 : 8 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + daysUntilMonday);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function normalizeWeekStartDate(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

function getDayAfter(date: Date): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + 1);
  return next;
}

async function enforceWeeklyPrepCreationAccess(
  teacherId: string,
  agentId: string,
  weekStart: Date,
  weekEnd: Date
): Promise<void> {
  const hasPro = await hasTeacherTierAccess(teacherId, 'PROFESSIONAL');
  if (hasPro) return;

  const hasAnotherWeek = await prisma.agentWeeklyPrep.findFirst({
    where: {
      agentId,
      status: { notIn: [WeeklyPrepStatus.FAILED] },
      NOT: {
        weekStartDate: {
          gte: weekStart,
          lt: weekEnd,
        },
      },
    },
    select: { id: true },
  });

  if (hasAnotherWeek) {
    throw new TeacherPlanRequiredError(
      'PROFESSIONAL',
      'Teacher Pro is required to generate Week 2 and beyond. Your first weekly calendar remains free.'
    );
  }
}

async function enforceWeeklyPrepAccess(
  teacherId: string,
  agentId: string,
  prepId: string
): Promise<void> {
  const hasPro = await hasTeacherTierAccess(teacherId, 'PROFESSIONAL');
  if (hasPro) return;

  const firstPrep = await prisma.agentWeeklyPrep.findFirst({
    where: {
      agentId,
      status: { notIn: [WeeklyPrepStatus.FAILED] },
    },
    orderBy: [{ weekStartDate: 'asc' }, { createdAt: 'asc' }],
    select: { id: true },
  });

  if (!firstPrep) return;

  if (firstPrep.id !== prepId) {
    throw new TeacherPlanRequiredError(
      'PROFESSIONAL',
      'Teacher Pro is required to access Week 2 and beyond. Your first weekly calendar remains free.'
    );
  }
}

function formatWeekLabel(date: Date): string {
  return `Week of ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
}

function getCurrentSchoolYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  return month >= 7 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
}

function mapToMaterialType(type: string): MaterialType {
  const map: Record<string, MaterialType> = {
    warm_up: MaterialType.WARM_UP,
    warmup: MaterialType.WARM_UP,
    'warm-up': MaterialType.WARM_UP,
    lesson: MaterialType.LESSON,
    worksheet: MaterialType.WORKSHEET,
    exit_ticket: MaterialType.EXIT_TICKET,
    'exit-ticket': MaterialType.EXIT_TICKET,
    quiz: MaterialType.QUIZ,
    flashcards: MaterialType.FLASHCARDS,
    activity: MaterialType.ACTIVITY,
    homework: MaterialType.HOMEWORK,
  };
  return map[type.toLowerCase()] || MaterialType.ACTIVITY;
}

function getMaterialTokenLimit(type: MaterialType): number {
  switch (type) {
    case MaterialType.WARM_UP:
    case MaterialType.EXIT_TICKET:
      return 2000;
    case MaterialType.QUIZ:
    case MaterialType.FLASHCARDS:
      return 3000;
    case MaterialType.LESSON:
      return 6000;
    case MaterialType.WORKSHEET:
    case MaterialType.ACTIVITY:
    case MaterialType.HOMEWORK:
      return 4000;
    default:
      return 3000;
  }
}

function extractStudentGroups(classrooms: any[]): Array<{ name: string; level: string; count: number }> {
  const groups: Array<{ name: string; level: string; count: number }> = [];
  for (const cr of classrooms) {
    const crGroups = cr.studentGroups as any[];
    if (Array.isArray(crGroups)) {
      for (const g of crGroups) {
        groups.push({
          name: g.name || 'Group',
          level: g.level || 'mixed',
          count: g.count || 0,
        });
      }
    }
  }
  return groups;
}

function mapWeeklyMaterialToContentType(type: MaterialType): string {
  switch (type) {
    case MaterialType.QUIZ:
      return 'quiz';
    case MaterialType.FLASHCARDS:
      return 'flashcard';
    case MaterialType.LESSON:
      return 'lesson';
    // Most weekly materials are "lesson-like" in how teachers edit them (structure, scaffolding, tone).
    default:
      return 'lesson';
  }
}

function normalizeMaterialTitle(title?: string): string | undefined {
  const normalized = String(title || '').trim();
  if (!normalized) return undefined;
  return normalized.slice(0, 200);
}

function normalizeMaterialSubject(subject?: string): string | undefined {
  const raw = String(subject || '').trim();
  if (!raw) return undefined;
  const cleaned = raw
    .replace(/[^\w\s/-]+/g, '')
    .replace(/[\s/-]+/g, '_')
    .toUpperCase();
  if (!cleaned) return undefined;

  if (cleaned === 'ELA' || cleaned === 'LANGUAGE_ARTS') {
    return 'ENGLISH';
  }
  return cleaned.slice(0, 80);
}

function buildRegenerationFeedbackNote(
  feedbackNote: string | undefined,
  previousTitle: string,
  nextTitle: string,
  previousSubject: string,
  nextSubject: string
): string | undefined {
  const normalizedFeedback = String(feedbackNote || '').trim();
  const parts: string[] = [];

  if (nextTitle !== previousTitle) {
    parts.push(`Update title from "${previousTitle}" to "${nextTitle}".`);
  }
  if (nextSubject !== previousSubject) {
    parts.push(`Update subject from "${previousSubject}" to "${nextSubject}".`);
  }
  if (normalizedFeedback) {
    parts.push(normalizedFeedback);
  }

  return parts.length > 0 ? parts.join(' ') : undefined;
}

async function refreshWeeklyPrepReviewStatus(prepId: string): Promise<void> {
  const [approvedCount, pendingCount, reviewableCount] = await Promise.all([
    prisma.agentMaterial.count({
      where: { weeklyPrepId: prepId, status: MaterialStatus.APPROVED },
    }),
    prisma.agentMaterial.count({
      where: { weeklyPrepId: prepId, status: { in: PENDING_REVIEW_STATUSES } },
    }),
    prisma.agentMaterial.count({
      where: { weeklyPrepId: prepId, status: { in: REVIEWABLE_STATUSES } },
    }),
  ]);

  const nextStatus =
    pendingCount === 0 && reviewableCount > 0
      ? WeeklyPrepStatus.APPROVED
      : WeeklyPrepStatus.REVIEWING;

  await prisma.agentWeeklyPrep.update({
    where: { id: prepId },
    data: {
      approvedCount,
      status: nextStatus,
    },
  });
}

function materialContentToText(content: any): string {
  if (content == null) return '';
  if (typeof content === 'string') return content;
  try {
    return JSON.stringify(content, null, 2);
  } catch {
    return String(content);
  }
}

// ============================================
// PROMPT BUILDERS
// ============================================

function buildPlanningPrompt(weekLabel: string, weekStart: Date, additionalContext: string): string {
  const days = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    days.push({ dayOfWeek: i, date: d.toISOString().split('T')[0], dayName: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][i] });
  }

  return `You are a master teacher planner. Create a structured weekly plan for ${weekLabel}.

${additionalContext}

SCHOOL DAYS THIS WEEK:
${days.map((d) => `- ${d.dayName} (${d.date})`).join('\n')}

INSTRUCTIONS:
- Plan materials for each subject the teacher teaches (from context above)
- For core subjects (Math, ELA/English), plan 4 materials per day: warm_up, lesson, worksheet, exit_ticket
- For other subjects (Science, Social Studies, etc.), plan 2-3 materials: lesson + activity or worksheet
- Use the curriculum state to pick appropriate topics and standards
- Vary activity types throughout the week
- Build on Monday's concepts through Friday (progressive complexity)

Return a JSON object with this exact structure:
{
  "days": [
    {
      "dayOfWeek": 0,
      "date": "${days[0].date}",
      "subjects": [
        {
          "subject": "MATH",
          "topic": "Adding fractions with unlike denominators",
          "standards": ["4.NF.3a"],
          "materials": [
            { "type": "warm_up", "title": "Fraction Review", "description": "5-minute review of equivalent fractions" },
            { "type": "lesson", "title": "Adding Unlike Fractions", "description": "Introduction to finding common denominators" },
            { "type": "worksheet", "title": "Practice: Unlike Denominators", "description": "10 practice problems with scaffolding" },
            { "type": "exit_ticket", "title": "Check: Can You Add?", "description": "3 quick problems to assess understanding" }
          ]
        }
      ]
    }
  ],
  "weekSummary": "Brief 2-sentence summary of the week's focus areas and progression",
  "totalMaterialCount": <number>
}`;
}

function buildMaterialPrompt(
  type: MaterialType,
  title: string,
  subject: string,
  planCtx: any,
  opts?: MaterialGenerationOptions
): string {
  const topicStr = planCtx.topic ? `Topic: ${planCtx.topic}` : '';
  const standardsStr = planCtx.standards?.length ? `Standards: ${planCtx.standards.join(', ')}` : '';
  const notesStr = planCtx.notes ? `Notes: ${planCtx.notes}` : '';
  const regenerationStr = opts?.feedbackNote
    ? `\nTEACHER REVISION REQUEST:\n${opts.feedbackNote}\n\nYou must apply this request while keeping the material age-appropriate and standards-aligned.\n`
    : '';

  const typeInstructions: Record<string, string> = {
    [MaterialType.WARM_UP]: `Create a 5-minute warm-up activity. Include 3-5 review questions or a quick problem set. Return JSON: { "title", "duration": "5 min", "instructions", "questions": [{ "question", "answer" }] }`,
    [MaterialType.LESSON]: `Create a lesson plan with objectives, materials list, procedure (intro/direct instruction/guided practice/independent practice/closure), and key vocabulary. Return JSON: { "title", "objectives": [], "materials": [], "duration": "30-45 min", "procedure": { "intro", "directInstruction", "guidedPractice", "independentPractice", "closure" }, "vocabulary": [{ "term", "definition" }], "assessmentStrategy" }`,
    [MaterialType.WORKSHEET]: `Create a worksheet with 8-12 practice problems, organized from easier to harder. Include an answer key. Return JSON: { "title", "instructions", "problems": [{ "number", "question", "answer", "difficulty": "easy|medium|hard" }] }`,
    [MaterialType.EXIT_TICKET]: `Create a 3-question exit ticket to assess understanding. Return JSON: { "title", "instructions", "questions": [{ "question", "answer", "skill" }] }`,
    [MaterialType.QUIZ]: `Create a 10-question quiz with a mix of question types. Return JSON: { "title", "questions": [{ "question", "type": "multiple_choice|short_answer|true_false", "options"?: [], "answer", "points" }], "totalPoints" }`,
    [MaterialType.FLASHCARDS]: `Create 15 flashcards for key concepts. Return JSON: { "title", "cards": [{ "front", "back", "hint"? }] }`,
    [MaterialType.ACTIVITY]: `Create an engaging classroom activity (15-20 min). Return JSON: { "title", "duration", "grouping": "individual|pairs|small_groups|whole_class", "materials": [], "instructions": [], "extensions"? }`,
    [MaterialType.HOMEWORK]: `Create a homework assignment (20-30 min). Return JSON: { "title", "estimatedTime", "instructions", "problems": [{ "number", "question", "answer" }], "parentNote"? }`,
  };

  return `Generate educational material for ${subject}.

${topicStr}
${standardsStr}
${notesStr}

Title: "${title}"

${regenerationStr}

${typeInstructions[type] || typeInstructions[MaterialType.ACTIVITY]}

Make the content age-appropriate, engaging, and standards-aligned. Return ONLY valid JSON.`;
}

// ============================================
// EXPORTS
// ============================================

export const weeklyPrepService = {
  initiateWeeklyPrep,
  generateWeeklyPlan,
  generateMaterials,
  generateSingleMaterial,
  getWeeklyPrep,
  getWeeklyPrepList,
  getWeeklyPrepProgress,
  approveMaterial,
  approveAllMaterials,
  finalizeWeeklyPrep,
  updateMaterial,
  regenerateMaterial,
};
