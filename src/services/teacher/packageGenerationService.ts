/**
 * Package Generation Service — Orchestrates content generation for purchased DTC packages
 *
 * Mirrors the weeklyPrepService pattern:
 *   1. Plan the package (Gemini Flash)
 *   2. Create PackageWeek + PackageMaterial records
 *   3. Generate materials sequentially (concurrency=1)
 *   4. Handle differentiation, progressive delivery
 */

import {
  PackagePurchaseStatus,
  PackageMaterialStatus,
  PackageTier,
  MaterialType,
  DeliveryType,
  Prisma,
} from '@prisma/client';
import { prisma } from '../../config/database.js';
import { genAI, TEACHER_CONTENT_SAFETY_SETTINGS } from '../../config/gemini.js';
import { config } from '../../config/index.js';
import { getDTCProduct } from '../../config/stripeProductsDTC.js';
import { contextAssemblerService } from './contextAssemblerService.js';
import { agentMemoryService } from './agentMemoryService.js';
import { contentGenerationService } from './contentGenerationService.js';
import { emailService } from '../email/emailService.js';
import { logger } from '../../utils/logger.js';
import { z } from 'zod';

// =============================================================================
// TYPES
// =============================================================================

interface PackagePlanWeek {
  weekNumber: number;
  weekLabel: string;
  weekDate: string;
  subject: string | null;
  days: Array<{
    dayOfWeek: number;
    subjects: Array<{
      subject: string;
      topic: string;
      standards?: string[];
      materials: Array<{
        type: string;
        title: string;
        description: string;
      }>;
    }>;
  }>;
}

interface PackagePlan {
  weeks: PackagePlanWeek[];
  summary: string;
  totalMaterialCount: number;
}

interface SpecialtyItem {
  type: string;
  title: string;
  description: string;
  category?: string;
}

interface SpecialtyPlan {
  items: SpecialtyItem[];
  summary: string;
}

// How many weeks to generate immediately for progressive delivery
const INITIAL_BATCH_SIZE: Record<string, number> = {
  SEMESTER: 4,
  YEAR_ROUND: 6,
  FOUNDING_TEACHER: 6,
};

// =============================================================================
// HELPERS
// =============================================================================

function extractJSON(text: string): string {
  const normalized = String(text || '').replace(/^\uFEFF/, '').trim();
  if (!normalized) return normalized;
  const jsonBlockMatch = normalized.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (jsonBlockMatch) return jsonBlockMatch[1].trim();
  const jsonObjectMatch = normalized.match(/\{[\s\S]*\}/);
  if (jsonObjectMatch) return jsonObjectMatch[0].trim();
  return normalized;
}

function repairJSON(jsonLike: string): string {
  let repaired = jsonLike.replace(/,\s*([}\]])/g, '$1');

  // Attempt to close truncated JSON by balancing brackets/braces
  let opens = 0;
  let openBrackets = 0;
  let inString = false;
  let escape = false;
  for (const ch of repaired) {
    if (escape) { escape = false; continue; }
    if (ch === '\\') { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === '{') opens++;
    else if (ch === '}') opens--;
    else if (ch === '[') openBrackets++;
    else if (ch === ']') openBrackets--;
  }

  // If we're inside a string, close it
  if (inString) repaired += '"';

  // Remove any trailing comma before we close
  repaired = repaired.replace(/,\s*$/, '');

  // Close unclosed brackets and braces
  for (let i = 0; i < openBrackets; i++) repaired += ']';
  for (let i = 0; i < opens; i++) repaired += '}';

  return repaired;
}

function mapToMaterialType(type: string): MaterialType {
  const map: Record<string, MaterialType> = {
    warm_up: 'WARM_UP',
    warmup: 'WARM_UP',
    lesson: 'LESSON',
    worksheet: 'WORKSHEET',
    exit_ticket: 'EXIT_TICKET',
    quiz: 'QUIZ',
    flashcards: 'FLASHCARDS',
    activity: 'ACTIVITY',
    homework: 'HOMEWORK',
  };
  return map[type.toLowerCase()] || 'LESSON';
}

function getNextMonday(from?: Date): Date {
  const d = from ? new Date(from) : new Date();
  const day = d.getDay();
  const diff = day === 0 ? 1 : 8 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addWeeks(date: Date, weeks: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + weeks * 7);
  return d;
}

function countPlanMaterials(plan: PackagePlan): number {
  let totalMaterials = 0;
  for (const week of plan.weeks) {
    for (const day of week.days) {
      for (const subj of day.subjects) {
        totalMaterials += subj.materials.length;
      }
    }
  }
  return totalMaterials;
}

// =============================================================================
// MAIN ENTRY POINT
// =============================================================================

async function generatePackage(purchaseId: string): Promise<void> {
  const purchase = await prisma.packagePurchase.findUniqueOrThrow({
    where: { id: purchaseId },
  });

  const purchaseConfig = (purchase.config as any) || {};

  // Update status to GENERATING
  await prisma.packagePurchase.update({
    where: { id: purchaseId },
    data: { status: 'GENERATING' },
  });

  try {
    // Weekly Box is recurring and generates one week at a time.
    if (purchase.packageTier === 'WEEKLY_BOX') {
      await generateWeeklyBoxPackage(purchase, purchaseConfig);
      return;
    }

    // Specialty packs have a different generation path
    if (purchase.packageCategory === 'SPECIALTY') {
      await generateSpecialtyPack(purchaseId);
      return;
    }

    // Step 1: Plan the package
    const plan = await planPackage(purchaseId);

    // Step 2: Create week and material records (plan data only — no content generation)
    await createWeekRecords(purchaseId, plan, purchaseConfig);

    // Step 3: Unlock all weeks immediately (on-demand generation — no bulk content gen)
    await prisma.packageWeek.updateMany({
      where: { purchaseId },
      data: { isDelivered: true, isLocked: false },
    });

    await prisma.packagePurchase.update({
      where: { id: purchaseId },
      data: {
        status: 'READY',
        weeksDelivered: plan.weeks.length,
      },
    });

    logger.info('Package plan created (on-demand generation mode)', {
      purchaseId,
      totalWeeks: plan.weeks.length,
      totalMaterials: plan.totalMaterialCount,
    });

    // Send "plan ready" notification email (non-blocking)
    sendPackagePlanReadyNotification(purchase.teacherId, purchaseId, purchase.packageName || 'Content Package', plan.totalMaterialCount || 0, plan.weeks.length)
      .catch(err => logger.error('Failed to send package plan ready email', { error: err, purchaseId }));
  } catch (error) {
    logger.error('Package generation failed', {
      purchaseId,
      error: error instanceof Error ? error.message : error,
    });
    await prisma.packagePurchase.update({
      where: { id: purchaseId },
      data: { status: 'FAILED' },
    });
    throw error;
  }
}

async function generateWeeklyBoxPackage(purchase: any, purchaseConfig: any): Promise<void> {
  const product = getDTCProduct('WEEKLY_BOX');
  const context = await contextAssemblerService.assembleContext(purchase.teacherId, 'WEEKLY_PREP');
  const additionalContext = contextAssemblerService.buildAdditionalContextString(context);

  const nextWeekNumber = Math.max((purchase.weeksDelivered || 0) + 1, 1);
  const baseWeekStart = purchaseConfig.weekStartDate
    ? new Date(purchaseConfig.weekStartDate)
    : getNextMonday();
  baseWeekStart.setHours(0, 0, 0, 0);
  const targetWeekStart = addWeeks(baseWeekStart, nextWeekNumber - 1);

  const mockPurchase = {
    packageTier: purchase.packageTier,
    packageName: purchase.packageName,
    config: purchaseConfig,
  };
  const oneWeekProduct = { ...product, totalWeeks: 1 };
  const prompt = buildPlanningPrompt(
    mockPurchase,
    oneWeekProduct,
    purchaseConfig,
    additionalContext,
    targetWeekStart,
    nextWeekNumber
  );
  const plan = await callGeminiForPlan(prompt, 1);
  const weekPlan = plan.weeks?.[0];

  if (!weekPlan) {
    throw new Error('Weekly Box plan missing week data');
  }

  weekPlan.weekNumber = nextWeekNumber;
  weekPlan.weekDate = targetWeekStart.toISOString().split('T')[0];
  if (!weekPlan.weekLabel) {
    weekPlan.weekLabel = `Week ${nextWeekNumber}`;
  }

  let week = await prisma.packageWeek.findFirst({
    where: { purchaseId: purchase.id, weekNumber: nextWeekNumber },
  });

  if (week?.isDelivered) {
    logger.info('Weekly Box week already delivered; skipping duplicate generation', {
      purchaseId: purchase.id,
      weekNumber: nextWeekNumber,
    });
    return;
  }

  if (!week) {
    week = await prisma.packageWeek.create({
      data: {
        purchaseId: purchase.id,
        weekNumber: nextWeekNumber,
        weekLabel: weekPlan.weekLabel,
        weekDate: targetWeekStart,
        subject: weekPlan.subject,
        plan: weekPlan as any,
        isLocked: false,
        isDelivered: false,
      },
    });
  }

  const existingMaterials = await prisma.packageMaterial.count({
    where: { purchaseId: purchase.id, weekId: week.id },
  });

  if (existingMaterials === 0) {
    const materialRecords: Prisma.PackageMaterialCreateManyInput[] = [];
    for (const day of weekPlan.days) {
      let sortOrder = 0;
      for (const subjectBlock of day.subjects) {
        for (const mat of subjectBlock.materials) {
          materialRecords.push({
            purchaseId: purchase.id,
            weekId: week.id,
            materialType: mapToMaterialType(mat.type),
            title: mat.title,
            description: mat.description,
            subject: subjectBlock.subject.toUpperCase(),
            dayOfWeek: day.dayOfWeek,
            sortOrder: sortOrder++,
            planContext: {
              topic: subjectBlock.topic,
              standards: subjectBlock.standards || [],
              notes: mat.description,
            } as any,
            status: 'PKG_PENDING',
          });
        }
      }
    }

    if (materialRecords.length > 0) {
      await prisma.packageMaterial.createMany({ data: materialRecords });
      await prisma.packagePurchase.update({
        where: { id: purchase.id },
        data: { totalMaterials: { increment: materialRecords.length } },
      });
    }
  }

  // Unlock week — materials generated on-demand when teacher downloads
  await prisma.packageWeek.update({
    where: { id: week.id },
    data: {
      weekLabel: weekPlan.weekLabel,
      weekDate: targetWeekStart,
      plan: weekPlan as any,
      isDelivered: true,
      isLocked: false,
    },
  });

  await prisma.packagePurchase.update({
    where: { id: purchase.id },
    data: {
      weeksDelivered: nextWeekNumber,
      totalWeeks: Math.max(purchase.totalWeeks || 0, nextWeekNumber),
      status: 'PARTIAL',
      nextDeliveryDate: addWeeks(targetWeekStart, 1),
    },
  });

  logger.info('Weekly Box week planned (on-demand generation)', {
    purchaseId: purchase.id,
    weekNumber: nextWeekNumber,
  });
}

// =============================================================================
// PLAN GENERATION
// =============================================================================

async function planPackage(purchaseId: string): Promise<PackagePlan> {
  const purchase = await prisma.packagePurchase.findUniqueOrThrow({
    where: { id: purchaseId },
  });

  const purchaseConfig = (purchase.config as any) || {};
  const context = await contextAssemblerService.assembleContext(purchase.teacherId, 'WEEKLY_PREP');
  const additionalContext = contextAssemblerService.buildAdditionalContextString(context);

  const product = getDTCProduct(purchase.packageTier);
  const weekStartDate = purchaseConfig.weekStartDate
    ? new Date(purchaseConfig.weekStartDate)
    : getNextMonday();

  const prompt = buildPlanningPrompt(purchase, product, purchaseConfig, additionalContext, weekStartDate);

  let plan: PackagePlan;
  try {
    plan = await callGeminiForPlan(prompt, product.totalWeeks || 3);
  } catch (error) {
    logger.error('Failed to parse package plan', {
      purchaseId,
      error: error instanceof Error ? error.message : error,
    });
    throw new Error('Failed to parse package plan from AI');
  }

  await prisma.packagePurchase.update({
    where: { id: purchaseId },
    data: {
      totalWeeks: plan.weeks.length,
    },
  });

  logger.info('Package plan generated', {
    purchaseId,
    weeks: plan.weeks.length,
    totalMaterials: plan.totalMaterialCount,
  });

  return plan;
}

function buildPlanningPrompt(
  purchase: any,
  product: any,
  purchaseConfig: any,
  additionalContext: string,
  weekStartDate: Date,
  weekNumberOffset: number = 1,
  mode: 'full' | 'preview' = 'full'
): string {
  const totalWeeks = product.totalWeeks || 3;
  const weekDates: string[] = [];
  for (let i = 0; i < totalWeeks; i++) {
    const d = addWeeks(weekStartDate, i);
    weekDates.push(d.toISOString().split('T')[0]);
  }

  let subjectConstraint = '';
  if (purchaseConfig.subjects?.length) {
    subjectConstraint = `Subjects: ${purchaseConfig.subjects.join(', ')}`;
  } else if (purchaseConfig.topic) {
    subjectConstraint = `Topic focus: ${purchaseConfig.topic}`;
  }

  const startWeekNum = weekNumberOffset;
  const endWeekNum = weekNumberOffset + totalWeeks - 1;
  const modeInstruction =
    mode === 'preview'
      ? `Create a concise preview plan. Keep output lightweight:
- Include all 5 weekdays but only 1-2 representative subjects per day.
- Include exactly 2 materials per subject (prefer lesson + worksheet/activity).
- Keep each material description short (max 12 words).`
      : `Create a detailed plan. For each week, plan 5 school days (Mon-Fri). Each day should have materials for the appropriate subjects.

Core subjects get 4 materials per day: warm_up, lesson, worksheet, exit_ticket
Other subjects get 2-3: lesson + activity or worksheet`;

  return `You are an expert curriculum planner creating a comprehensive teaching package.

Package: ${product.name} (${product.resourceEstimate})
${subjectConstraint ? subjectConstraint : 'Cover all subjects the teacher teaches.'}
Plan weeks ${startWeekNum} through ${endWeekNum} (${totalWeeks} weeks total for this batch).
Week start dates: ${weekDates.join(', ')}
${purchaseConfig.gradeLevel ? `Grade level: ${purchaseConfig.gradeLevel}` : ''}
${purchaseConfig.curriculum ? `Curriculum: ${purchaseConfig.curriculum}` : ''}

${additionalContext}

${modeInstruction}

Return JSON:
{
  "weeks": [
    {
      "weekNumber": ${startWeekNum},
      "weekLabel": "Week ${startWeekNum} - [Topic/Theme]",
      "weekDate": "${weekDates[0]}",
      "subject": null,
      "days": [
        {
          "dayOfWeek": 0,
          "subjects": [
            {
              "subject": "MATH",
              "topic": "Fractions - Introduction",
              "standards": ["4.NF.1"],
              "materials": [
                { "type": "warm_up", "title": "...", "description": "..." },
                { "type": "lesson", "title": "...", "description": "..." },
                { "type": "worksheet", "title": "...", "description": "..." },
                { "type": "exit_ticket", "title": "...", "description": "..." }
              ]
            }
          ]
        }
      ]
    }
  ],
  "summary": "Overview of weeks ${startWeekNum}-${endWeekNum}",
  "totalMaterialCount": 0
}`;
}

/**
 * Call Gemini Flash and parse the returned JSON plan.
 * maxOutputTokens scales with week count to prevent truncation.
 */
async function callGeminiForPlan(
  prompt: string,
  weekCount: number,
  opts?: { previewMode?: boolean }
): Promise<PackagePlan> {
  // Preview mode intentionally uses a smaller budget to keep checkout previews fast.
  const previewMode = Boolean(opts?.previewMode);
  const tokensPerWeek = previewMode ? 1200 : 3500;
  const minTokens = previewMode ? 4000 : 8000;
  const maxTokensCap = previewMode ? 16000 : 65000;
  const baseMaxTokens = Math.min(Math.max(weekCount * tokensPerWeek, minTokens), maxTokensCap);

  // Allow one retry with a larger token budget if the response is truncated.
  const attempts = [baseMaxTokens, Math.min(Math.round(baseMaxTokens * 1.5), maxTokensCap)];

  for (let i = 0; i < attempts.length; i++) {
    const maxOutputTokens = attempts[i];
    const model = genAI.getGenerativeModel({
      model: config.gemini.models.flash,
      safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens,
        responseMimeType: 'application/json',
      },
    });

    const result = await model.generateContent(prompt);
    const candidate = result.response.candidates?.[0];
    const finishReason = candidate?.finishReason;
    const text = result.response.text().trim();

    if (!text) {
      logger.warn('Gemini returned empty response for package plan', { weekCount, previewMode, finishReason, attempt: i + 1 });
      if (i < attempts.length - 1) continue;
      throw new Error('Gemini returned an empty response for package plan');
    }

    // If truncated due to token limit, retry with more tokens before attempting repair
    if (finishReason === 'MAX_TOKENS' && i < attempts.length - 1) {
      logger.warn('Gemini plan response truncated, retrying with higher token budget', {
        weekCount, previewMode, attempt: i + 1, maxOutputTokens, nextBudget: attempts[i + 1],
      });
      continue;
    }

    const raw = extractJSON(text);
    if (!raw) {
      logger.warn('Could not extract JSON from Gemini plan response', { weekCount, previewMode, textLength: text.length });
      if (i < attempts.length - 1) continue;
      throw new Error('Could not extract JSON from Gemini plan response');
    }

    try {
      const parsed = JSON.parse(repairJSON(raw));
      if (!parsed.weeks || !Array.isArray(parsed.weeks)) {
        throw new Error('Plan missing weeks array');
      }
      if (finishReason === 'MAX_TOKENS') {
        logger.warn('Gemini plan was truncated but repaired successfully', {
          weekCount, previewMode, weeksReturned: parsed.weeks.length,
        });
      }
      return parsed as PackagePlan;
    } catch (parseErr: any) {
      logger.warn('Failed to parse Gemini plan JSON', {
        weekCount, previewMode, attempt: i + 1, error: parseErr.message, rawLength: raw.length,
      });
      if (i < attempts.length - 1) continue;
      throw new Error(`Failed to parse package plan JSON: ${parseErr.message}`);
    }
  }

  // Should never reach here, but satisfy TypeScript
  throw new Error('Failed to generate package plan after all attempts');
}

// =============================================================================
// WEEK/MATERIAL RECORD CREATION
// =============================================================================

async function createWeekRecords(purchaseId: string, plan: PackagePlan, purchaseConfig: any): Promise<void> {
  let totalMaterials = 0;

  for (const weekPlan of plan.weeks) {
    const week = await prisma.packageWeek.create({
      data: {
        purchaseId,
        weekNumber: weekPlan.weekNumber,
        weekLabel: weekPlan.weekLabel,
        weekDate: new Date(weekPlan.weekDate),
        subject: weekPlan.subject,
        plan: weekPlan as any,
        isLocked: true,
        isDelivered: false,
      },
    });

    // Create material records
    const materialRecords: Prisma.PackageMaterialCreateManyInput[] = [];

    for (const day of weekPlan.days) {
      let sortOrder = 0;
      for (const subjectBlock of day.subjects) {
        for (const mat of subjectBlock.materials) {
          materialRecords.push({
            purchaseId,
            weekId: week.id,
            materialType: mapToMaterialType(mat.type),
            title: mat.title,
            description: mat.description,
            subject: subjectBlock.subject.toUpperCase(),
            dayOfWeek: day.dayOfWeek,
            sortOrder: sortOrder++,
            planContext: {
              topic: subjectBlock.topic,
              standards: subjectBlock.standards || [],
              notes: mat.description,
            } as any,
            status: 'PKG_PENDING',
          });
          totalMaterials++;
        }
      }
    }

    if (materialRecords.length > 0) {
      await prisma.packageMaterial.createMany({ data: materialRecords });
    }
  }

  await prisma.packagePurchase.update({
    where: { id: purchaseId },
    data: { totalMaterials },
  });
}

// =============================================================================
// MATERIAL GENERATION FOR A WEEK
// =============================================================================

async function generateWeekMaterials(weekId: string, teacherId: string): Promise<void> {
  const pendingMaterials = await prisma.packageMaterial.findMany({
    where: { weekId, status: 'PKG_PENDING' },
    orderBy: [{ dayOfWeek: 'asc' }, { sortOrder: 'asc' }],
  });

  if (pendingMaterials.length === 0) return;

  const week = await prisma.packageWeek.findUniqueOrThrow({
    where: { id: weekId },
  });

  // Load teacher context once
  const snapshot = await agentMemoryService.getFullMemorySnapshot(teacherId);
  const studentGroups = extractStudentGroups(snapshot?.classrooms || []);

  let generatedCount = 0;
  let failedCount = 0;

  for (const material of pendingMaterials) {
    try {
      await prisma.packageMaterial.update({
        where: { id: material.id },
        data: { status: 'PKG_GENERATING' },
      });

      const result = await generateSingleMaterial(material, teacherId);

      // Differentiation
      let differentiated: any = null;
      if (studentGroups.length > 0 && result.content) {
        try {
          differentiated = await generateDifferentiatedVersions(
            result.content,
            material.materialType,
            studentGroups
          );
        } catch (err) {
          logger.warn('Package differentiation failed', {
            materialId: material.id,
            error: (err as Error).message,
          });
        }
      }

      await prisma.packageMaterial.update({
        where: { id: material.id },
        data: {
          content: result.content as any,
          differentiatedContent: differentiated as any,
          status: 'PKG_GENERATED',
          tokensUsed: result.tokensUsed,
          modelUsed: result.modelUsed,
          generatedAt: new Date(),
        },
      });

      generatedCount++;

      // Update purchase progress
      await prisma.packagePurchase.update({
        where: { id: week.purchaseId },
        data: {
          generatedCount: { increment: 1 },
          totalTokensUsed: { increment: result.tokensUsed },
        },
      });
    } catch (err) {
      logger.error('Package material generation failed', {
        materialId: material.id,
        error: (err as Error).message,
      });
      await prisma.packageMaterial.update({
        where: { id: material.id },
        data: { status: 'PKG_FAILED' },
      });
      failedCount++;
      await prisma.packagePurchase.update({
        where: { id: week.purchaseId },
        data: { failedCount: { increment: 1 } },
      });
    }
  }

  logger.info('Week materials generated', { weekId, generatedCount, failedCount });
}

// =============================================================================
// SINGLE MATERIAL GENERATION
// =============================================================================

async function generateSingleMaterial(
  material: any,
  teacherId: string
): Promise<{ content: any; tokensUsed: number; modelUsed: string }> {
  const planCtx = (material.planContext as any) || {};

  const context = await contextAssemblerService.assembleContext(teacherId, 'CONTENT_GENERATION');
  const additionalContext = contextAssemblerService.buildAdditionalContextString(context);

  const prompt = buildMaterialGenerationPrompt(material, planCtx, additionalContext);

  const modelName = config.gemini.models.flash;
  const model = genAI.getGenerativeModel({
    model: modelName,
    safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 4000,
      responseMimeType: 'application/json',
    },
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const tokensUsed = result.response.usageMetadata?.totalTokenCount || 1000;

  let content: any;
  try {
    const raw = extractJSON(text);
    content = JSON.parse(repairJSON(raw));
  } catch {
    content = { rawText: text };
  }

  return { content, tokensUsed, modelUsed: modelName };
}

function buildMaterialGenerationPrompt(material: any, planCtx: any, additionalContext: string): string {
  return `Generate educational content for a teacher's classroom.

Material Type: ${material.materialType}
Title: ${material.title}
Subject: ${material.subject || 'General'}
Topic: ${planCtx.topic || 'Not specified'}
Standards: ${(planCtx.standards || []).join(', ') || 'None specified'}
Description: ${material.description || planCtx.notes || ''}

${additionalContext}

Generate a complete, ready-to-use ${material.materialType.toLowerCase().replace('_', ' ')} that the teacher can use immediately.

Return JSON with structure appropriate for the material type:
{
  "title": "...",
  "subject": "...",
  "topic": "...",
  "gradeLevel": "...",
  "standards": [...],
  "objectives": [...],
  "content": { ... },
  "instructions": "...",
  "duration": "... minutes"
}`;
}

// =============================================================================
// DIFFERENTIATION
// =============================================================================

function extractStudentGroups(classrooms: any[]): any[] {
  const groups: any[] = [];
  for (const classroom of classrooms) {
    const studentGroups = (classroom.studentGroups as any) || [];
    if (Array.isArray(studentGroups)) {
      groups.push(...studentGroups);
    }
  }
  return groups;
}

async function generateDifferentiatedVersions(
  baseContent: any,
  materialType: MaterialType,
  studentGroups: any[]
): Promise<any> {
  const levels = ['above_grade', 'on_level', 'below_grade', 'ell_scaffolding'];

  const model = genAI.getGenerativeModel({
    model: config.gemini.models.flash,
    safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 6000,
      responseMimeType: 'application/json',
    },
  });

  const prompt = `Differentiate this ${materialType} for different student levels.

Original content:
${JSON.stringify(baseContent).substring(0, 3000)}

Student groups: ${JSON.stringify(studentGroups).substring(0, 500)}

Create differentiated versions for: ${levels.join(', ')}

Return JSON:
{
  "above_grade": { ... modified content ... },
  "on_level": { ... base content ... },
  "below_grade": { ... simplified content ... },
  "ell_scaffolding": { ... ELL scaffolded content ... }
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const raw = extractJSON(text);
  return JSON.parse(repairJSON(raw));
}

// =============================================================================
// SPECIALTY PACK GENERATION (Category D)
// =============================================================================

async function generateSpecialtyPack(purchaseId: string): Promise<void> {
  const purchase = await prisma.packagePurchase.findUniqueOrThrow({
    where: { id: purchaseId },
  });

  const purchaseConfig = (purchase.config as any) || {};
  const context = await contextAssemblerService.assembleContext(purchase.teacherId, 'CONTENT_GENERATION');
  const additionalContext = contextAssemblerService.buildAdditionalContextString(context);

  // Plan specialty items
  const plan = await planSpecialtyItems(purchase, additionalContext);

  // Create a single week container for specialty items
  const week = await prisma.packageWeek.create({
    data: {
      purchaseId,
      weekNumber: 1,
      weekLabel: `${purchase.packageName}`,
      weekDate: new Date(),
      isLocked: false,
      isDelivered: false,
    },
  });

  // Create material records
  const materialRecords: Prisma.PackageMaterialCreateManyInput[] = [];
  for (let i = 0; i < plan.items.length; i++) {
    const item = plan.items[i];
    materialRecords.push({
      purchaseId,
      weekId: week.id,
      materialType: mapSpecialtyToMaterialType(item.type),
      title: item.title,
      description: item.description,
      subject: item.category || null,
      sortOrder: i,
      specialtyType: item.type,
      planContext: { category: item.category, notes: item.description } as any,
      status: 'PKG_PENDING',
    });
  }

  await prisma.packageMaterial.createMany({ data: materialRecords });
  await prisma.packagePurchase.update({
    where: { id: purchaseId },
    data: { totalMaterials: materialRecords.length, totalWeeks: 1 },
  });

  // Unlock — materials generated on-demand when teacher downloads
  await prisma.packageWeek.update({
    where: { id: week.id },
    data: { isDelivered: true, isLocked: false },
  });

  await prisma.packagePurchase.update({
    where: { id: purchaseId },
    data: { status: 'READY', weeksDelivered: 1 },
  });

  logger.info('Specialty pack planned (on-demand generation)', { purchaseId, items: plan.items.length });

  // Send "plan ready" notification email (non-blocking)
  sendPackagePlanReadyNotification(purchase.teacherId, purchaseId, purchase.packageName || 'Specialty Pack', plan.items.length, 1)
    .catch(err => logger.error('Failed to send package plan ready email', { error: err, purchaseId }));
}

function mapSpecialtyToMaterialType(specialtyType: string): MaterialType {
  const map: Record<string, MaterialType> = {
    sub_plan: 'LESSON',
    iep_goal: 'ACTIVITY',
    assessment: 'QUIZ',
    pre_test: 'QUIZ',
    unit_test: 'QUIZ',
    cumulative_exam: 'QUIZ',
    newsletter: 'ACTIVITY',
    report_comment: 'ACTIVITY',
    conference_material: 'ACTIVITY',
  };
  return map[specialtyType] || 'LESSON';
}

async function planSpecialtyItems(purchase: any, additionalContext: string): Promise<SpecialtyPlan> {
  const model = genAI.getGenerativeModel({
    model: config.gemini.models.flash,
    safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8000,
      responseMimeType: 'application/json',
    },
  });

  let planDescription = '';
  switch (purchase.packageTier) {
    case 'SUB_PLAN_VAULT':
      planDescription = 'Plan 10 complete substitute teacher plans across varied topics and subjects. Include both emergency plans and planned absence plans.';
      break;
    case 'IEP_GOAL_BANK':
      planDescription = 'Plan 100+ measurable IEP goals across disability categories (SLD, ASD, ADHD, Speech/Language, etc.) and academic subjects. Include progress monitoring descriptors.';
      break;
    case 'ASSESSMENT_ARSENAL':
      planDescription = 'Plan a complete assessment suite: pre-tests, unit tests, cumulative exams, and rubrics for each major unit/topic. Include answer keys.';
      break;
    case 'PARENT_COMM_KIT':
      planDescription = 'Plan a full year of parent communications: 36+ weekly newsletters, parent-teacher conference materials, report card comment templates for all subjects, and special event communications.';
      break;
  }

  const prompt = `You are planning a specialty content pack for a teacher.

Pack: ${purchase.packageName}
${planDescription}

${additionalContext}

Return JSON:
{
  "items": [
    { "type": "sub_plan" | "iep_goal" | "assessment" | "newsletter" | "report_comment" | "conference_material", "title": "...", "description": "...", "category": "optional subject or disability category" }
  ],
  "summary": "Overview"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const raw = extractJSON(text);
  return JSON.parse(repairJSON(raw));
}

// =============================================================================
// REGENERATE SINGLE MATERIAL
// =============================================================================

async function regenerateSingleMaterial(materialId: string, teacherId: string): Promise<void> {
  // Reset to pending so generateMaterialOnDemand can pick it up
  await prisma.packageMaterial.update({
    where: { id: materialId },
    data: {
      status: 'PKG_PENDING',
      content: Prisma.DbNull,
      editedContent: Prisma.DbNull,
    },
  });

  await generateMaterialOnDemand(materialId, teacherId);
}

// =============================================================================
// PROGRESSIVE DELIVERY — Generate next week
// =============================================================================

async function deliverNextWeek(purchaseId: string): Promise<void> {
  const purchase = await prisma.packagePurchase.findUniqueOrThrow({
    where: { id: purchaseId },
  });

  const nextWeekNumber = purchase.weeksDelivered + 1;
  const nextWeek = await prisma.packageWeek.findFirst({
    where: { purchaseId, weekNumber: nextWeekNumber },
  });

  if (!nextWeek) {
    // All weeks delivered
    await prisma.packagePurchase.update({
      where: { id: purchaseId },
      data: { status: 'COMPLETED', completedAt: new Date(), nextDeliveryDate: null },
    });
    return;
  }

  // Unlock week — materials generated on-demand
  await prisma.packageWeek.update({
    where: { id: nextWeek.id },
    data: { isDelivered: true, isLocked: false },
  });

  const newWeeksDelivered = nextWeekNumber;
  const allDelivered = newWeeksDelivered >= purchase.totalWeeks;

  await prisma.packagePurchase.update({
    where: { id: purchaseId },
    data: {
      weeksDelivered: newWeeksDelivered,
      status: allDelivered ? 'COMPLETED' : 'PARTIAL',
      completedAt: allDelivered ? new Date() : null,
      nextDeliveryDate: allDelivered ? null : addWeeks(new Date(), 1),
    },
  });

  logger.info('Progressive delivery: week generated', {
    purchaseId,
    weekNumber: nextWeekNumber,
    allDelivered,
  });
}

// =============================================================================
// ON-DEMAND MATERIAL GENERATION
// =============================================================================

/**
 * Generate a single material on-demand using the appropriate high-quality engine.
 * Routes LESSON/QUIZ/FLASHCARDS to standalone engines (with quality validation,
 * Flash-to-Pro fallback). Other types use enhanced Gemini prompts.
 *
 * Uses atomic status guard to prevent concurrent generation of the same material.
 */
async function generateMaterialOnDemand(
  materialId: string,
  teacherId: string
): Promise<{ materialId: string; status: string }> {
  // 1. Atomic status guard — only generate if PKG_PENDING or PKG_FAILED
  const updated = await prisma.$executeRaw`
    UPDATE "PackageMaterial"
    SET status = 'PKG_GENERATING'::"PackageMaterialStatus", "updatedAt" = NOW()
    WHERE id = ${materialId}
      AND status IN ('PKG_PENDING'::"PackageMaterialStatus", 'PKG_FAILED'::"PackageMaterialStatus")
  `;

  if (updated === 0) {
    // Already generating or already generated
    const current = await prisma.packageMaterial.findUnique({
      where: { id: materialId },
      select: { status: true },
    });
    return { materialId, status: current?.status || 'UNKNOWN' };
  }

  // 2. Load material with purchase context
  const material = await prisma.packageMaterial.findUniqueOrThrow({
    where: { id: materialId },
    include: { purchase: true },
  });

  const purchaseConfig = (material.purchase.config as any) || {};
  const planCtx = (material.planContext as any) || {};

  try {
    // 3. Load teacher context
    const snapshot = await agentMemoryService.getFullMemorySnapshot(teacherId);
    const studentGroups = extractStudentGroups(snapshot?.classrooms || []);

    // 4. Route to appropriate engine
    let content: any;
    let tokensUsed = 0;
    let modelUsed: string = config.gemini.models.flash;

    const topic = planCtx.topic || material.title;
    const standards = planCtx.standards || [];
    const gradeLevel = purchaseConfig.gradeLevel || '';
    const curriculum = purchaseConfig.curriculum || 'AMERICAN';
    const additionalCtx = [
      material.title ? `Title: ${material.title}` : '',
      material.description ? `Description: ${material.description}` : '',
      standards.length > 0 ? `Standards: ${standards.join(', ')}` : '',
      material.teacherNotes ? `Teacher notes: ${material.teacherNotes}` : '',
    ].filter(Boolean).join('\n');

    switch (material.materialType) {
      case 'LESSON': {
        const lesson = await contentGenerationService.generateLesson(teacherId, {
          topic,
          subject: material.subject as any,
          gradeLevel,
          curriculum,
          lessonType: 'full',
          includeActivities: true,
          includeAssessment: true,
          additionalContext: additionalCtx,
        });
        content = lesson;
        tokensUsed = lesson.tokensUsed || 0;
        modelUsed = lesson.modelUsed === 'pro' ? config.gemini.models.pro : config.gemini.models.flash;
        break;
      }

      case 'QUIZ': {
        const quizContent = `Topic: ${topic}. ${material.description || ''}. Standards: ${standards.join(', ')}`;
        const quiz = await contentGenerationService.generateQuiz(teacherId, `pkg-${materialId}`, {
          content: quizContent,
          title: material.title,
          questionCount: 10,
          questionTypes: ['multiple_choice', 'true_false', 'short_answer'],
          difficulty: 'mixed',
          gradeLevel,
        });
        content = quiz;
        tokensUsed = quiz.tokensUsed || 0;
        break;
      }

      case 'FLASHCARDS': {
        const fcContent = `Topic: ${topic}. ${material.description || ''}. Standards: ${standards.join(', ')}`;
        const flashcards = await contentGenerationService.generateFlashcards(teacherId, `pkg-${materialId}`, {
          content: fcContent,
          title: material.title,
          cardCount: 15,
          includeHints: true,
          gradeLevel,
        });
        content = flashcards;
        tokensUsed = flashcards.tokensUsed || 0;
        break;
      }

      // For types without standalone engines, use enhanced Gemini prompts
      default: {
        const result = await generateEnhancedMaterial(material, planCtx, teacherId, purchaseConfig);
        content = result.content;
        tokensUsed = result.tokensUsed;
        modelUsed = result.modelUsed;
        break;
      }
    }

    // 5. Differentiation (non-fatal)
    let differentiated: any = null;
    if (studentGroups.length > 0 && content) {
      try {
        differentiated = await generateDifferentiatedVersions(
          content,
          material.materialType,
          studentGroups
        );
      } catch (err) {
        logger.warn('On-demand differentiation failed', {
          materialId,
          error: (err as Error).message,
        });
      }
    }

    // 6. Store result
    await prisma.packageMaterial.update({
      where: { id: materialId },
      data: {
        content: content as any,
        differentiatedContent: differentiated as any,
        status: 'PKG_GENERATED',
        tokensUsed,
        modelUsed,
        generatedAt: new Date(),
      },
    });

    // Update purchase counters
    await prisma.packagePurchase.update({
      where: { id: material.purchaseId },
      data: {
        generatedCount: { increment: 1 },
        totalTokensUsed: { increment: tokensUsed },
      },
    });

    logger.info('Material generated on-demand', {
      materialId,
      materialType: material.materialType,
      tokensUsed,
      modelUsed,
    });

    return { materialId, status: 'PKG_GENERATED' };
  } catch (error) {
    logger.error('On-demand material generation failed', {
      materialId,
      materialType: material.materialType,
      error: error instanceof Error ? error.message : error,
    });

    await prisma.packageMaterial.update({
      where: { id: materialId },
      data: { status: 'PKG_FAILED' },
    });

    throw error;
  }
}

/**
 * Enhanced Gemini generation for material types without standalone engines
 * (WORKSHEET, WARM_UP, EXIT_TICKET, ACTIVITY, HOMEWORK).
 * Uses type-specific prompts with higher token budgets than the old generic prompt.
 */
async function generateEnhancedMaterial(
  material: any,
  planCtx: any,
  teacherId: string,
  purchaseConfig: any
): Promise<{ content: any; tokensUsed: number; modelUsed: string }> {
  const context = await contextAssemblerService.assembleContext(teacherId, 'CONTENT_GENERATION');
  const additionalContext = contextAssemblerService.buildAdditionalContextString(context);

  const topic = planCtx.topic || material.title;
  const subject = material.subject || 'General';
  const gradeLevel = purchaseConfig.gradeLevel || '';
  const standards = (planCtx.standards || []).join(', ') || 'None specified';

  // Type-specific prompt and token budget
  const typePrompts: Record<string, { instruction: string; maxTokens: number; temp: number }> = {
    WORKSHEET: {
      instruction: `Create a comprehensive classroom worksheet with:
- Clear title and student name/date fields
- 8-12 practice problems progressing from basic recall to application
- A mix of problem types (fill-in, short answer, multiple choice, word problems)
- Clearly numbered questions with adequate space descriptions
- An answer key section at the end with complete solutions and explanations
- Bonus/challenge question for early finishers`,
      maxTokens: 6000,
      temp: 0.65,
    },
    WARM_UP: {
      instruction: `Create a 5-minute warm-up activity with:
- 3-5 quick review questions covering prerequisite skills
- A brief "think about it" discussion prompt related to today's topic
- Mix of question types (1 multiple choice, 1 true/false, 1-2 short answer)
- Answer key with brief explanations`,
      maxTokens: 3000,
      temp: 0.6,
    },
    EXIT_TICKET: {
      instruction: `Create a 3-question exit ticket assessment with:
- Question 1: Basic recall/understanding (easier)
- Question 2: Application of the concept (medium)
- Question 3: Analysis or extension (harder)
- Student self-assessment: "Rate your understanding: 1-2-3-4"
- Answer key with scoring guide (what constitutes proficient vs. needs review)`,
      maxTokens: 3000,
      temp: 0.6,
    },
    ACTIVITY: {
      instruction: `Create a hands-on classroom activity with:
- Activity title and estimated duration (15-25 minutes)
- Learning objectives (2-3 specific objectives)
- Materials needed (be specific and realistic for a classroom)
- Setup instructions for the teacher
- Step-by-step student directions (numbered, clear for the grade level)
- Discussion questions (3-4 questions to debrief the activity)
- Assessment: How to evaluate student understanding from this activity
- Differentiation tips for struggling and advanced learners`,
      maxTokens: 5000,
      temp: 0.7,
    },
    HOMEWORK: {
      instruction: `Create a homework assignment with:
- Clear title with estimated completion time (15-30 minutes)
- Brief parent/guardian note explaining what was learned in class
- 6-10 practice problems reinforcing today's lesson
- 1-2 real-world application problems connecting to daily life
- A reflection question: "What was the most challenging part?"
- Complete answer key with worked solutions
- Optional extension activity for students who want extra practice`,
      maxTokens: 5000,
      temp: 0.65,
    },
  };

  const typeConfig = typePrompts[material.materialType] || typePrompts.WORKSHEET;

  const prompt = `You are an expert K-8 teacher creating high-quality classroom materials.

Subject: ${subject}
Grade Level: ${gradeLevel}
Topic: ${topic}
Standards: ${standards}
Material Type: ${material.materialType.replace(/_/g, ' ')}
Title: ${material.title}
Description: ${material.description || planCtx.notes || ''}
${material.teacherNotes ? `Teacher Notes: ${material.teacherNotes}` : ''}

${additionalContext}

${typeConfig.instruction}

IMPORTANT: Create complete, print-ready content. Every section should have full text, not placeholders.

Return JSON:
{
  "title": "${material.title}",
  "subject": "${subject}",
  "topic": "${topic}",
  "gradeLevel": "${gradeLevel}",
  "standards": [${(planCtx.standards || []).map((s: string) => `"${s}"`).join(', ')}],
  "objectives": ["objective 1", "objective 2"],
  "duration": "estimated minutes",
  "sections": [
    {
      "title": "Section Title",
      "content": "Full section content with all problems, questions, or instructions"
    }
  ],
  "answerKey": [
    { "question": "Q1", "answer": "Full answer with explanation" }
  ],
  "teacherNotes": "Implementation tips"
}`;

  const modelName = config.gemini.models.flash;
  const model = genAI.getGenerativeModel({
    model: modelName,
    safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
    generationConfig: {
      temperature: typeConfig.temp,
      maxOutputTokens: typeConfig.maxTokens,
      responseMimeType: 'application/json',
    },
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const tokensUsed = result.response.usageMetadata?.totalTokenCount || 1000;

  let content: any;
  try {
    const raw = extractJSON(text);
    content = JSON.parse(repairJSON(raw));
  } catch {
    content = { rawText: text };
  }

  return { content, tokensUsed, modelUsed: modelName };
}

/**
 * Generate all pending materials for a package sequentially.
 * Used by the "Generate All" button via BullMQ.
 */
async function generateAllPendingMaterials(
  purchaseId: string,
  teacherId: string,
  onProgress?: (generated: number, total: number) => void
): Promise<{ generated: number; failed: number; total: number }> {
  const pending = await prisma.packageMaterial.findMany({
    where: { purchaseId, status: 'PKG_PENDING' },
    orderBy: [{ dayOfWeek: 'asc' }, { sortOrder: 'asc' }],
  });

  let generated = 0;
  let failed = 0;

  for (const mat of pending) {
    try {
      await generateMaterialOnDemand(mat.id, teacherId);
      generated++;
      onProgress?.(generated, pending.length);
    } catch (err) {
      logger.error('Bulk material generation failed', {
        materialId: mat.id,
        error: (err as Error).message,
      });
      failed++;
    }
  }

  return { generated, failed, total: pending.length };
}

// =============================================================================
// EMAIL NOTIFICATION HELPERS
// =============================================================================

async function sendPackagePlanReadyNotification(
  teacherId: string,
  purchaseId: string,
  packageName: string,
  totalMaterials: number,
  totalWeeks: number
): Promise<void> {
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    select: { email: true, firstName: true, lastName: true },
  });
  if (!teacher) return;

  const teacherName = [teacher.firstName, teacher.lastName].filter(Boolean).join(' ') || 'Teacher';
  const packageUrl = `${config.frontendUrl}/teacher/store/my-packages/${purchaseId}`;

  await emailService.sendPackageReadyEmail(
    teacher.email,
    teacherName,
    packageName,
    totalMaterials,
    totalWeeks,
    packageUrl
  );
}

async function sendPackageReadyNotification(
  teacherId: string,
  purchaseId: string,
  packageName: string,
  totalMaterials: number,
  totalWeeks: number
): Promise<void> {
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    select: { email: true, firstName: true, lastName: true },
  });
  if (!teacher) return;

  const teacherName = [teacher.firstName, teacher.lastName].filter(Boolean).join(' ') || 'Teacher';
  const packageUrl = `${config.frontendUrl}/teacher/store/my-packages/${purchaseId}`;

  await emailService.sendPackageReadyEmail(
    teacher.email,
    teacherName,
    packageName,
    totalMaterials,
    totalWeeks,
    packageUrl
  );
}

// =============================================================================
// PREVIEW — Plan only (no DB records)
// =============================================================================

async function previewPackagePlan(
  teacherId: string,
  tier: PackageTier,
  previewConfig: {
    subjects?: string[];
    topic?: string;
    gradeLevel: string;
    curriculum: string;
    weekStartDate: string;
  }
): Promise<{
  plan: PackagePlan | SpecialtyPlan;
  tier: PackageTier;
  totalMaterials: number;
  totalWeeks: number;
  previewWeeks?: number;
  isTruncatedPreview?: boolean;
}> {
  const product = getDTCProduct(tier);
  const context = await contextAssemblerService.assembleContext(teacherId, 'WEEKLY_PREP');
  const additionalContext = contextAssemblerService.buildAdditionalContextString(context);

  // Specialty packs return a flat item list
  if (product.category === 'SPECIALTY') {
    const mockPurchase = {
      packageTier: tier,
      packageName: product.name,
    };
    const plan = await planSpecialtyItems(mockPurchase, additionalContext);
    return {
      plan,
      tier,
      totalMaterials: plan.items.length,
      totalWeeks: 1,
    };
  }

  // Standard packages return week-by-week plan
  const weekStartDate = previewConfig.weekStartDate
    ? new Date(previewConfig.weekStartDate)
    : getNextMonday();

  const mockPurchase = {
    packageTier: tier,
    packageName: product.name,
    config: previewConfig,
  };

  // Preview is intentionally capped so checkout remains responsive.
  const totalWeeks = product.totalWeeks || 3;
  const PREVIEW_MAX_WEEKS = 3;
  const previewWeeks = Math.min(totalWeeks, PREVIEW_MAX_WEEKS);
  const isTruncatedPreview = previewWeeks < totalWeeks;
  const previewProduct = { ...product, totalWeeks: previewWeeks };

  const prompt = buildPlanningPrompt(
    mockPurchase,
    previewProduct,
    previewConfig,
    additionalContext,
    weekStartDate,
    1,
    'preview'
  );

  const plan = await callGeminiForPlan(prompt, previewWeeks, { previewMode: true });
  const totalMaterials = countPlanMaterials(plan);

  logger.info('Package plan preview generated', {
    teacherId,
    tier,
    totalWeeks,
    previewWeeks: plan.weeks.length,
    totalMaterials,
    isTruncatedPreview,
  });

  return {
    plan,
    tier,
    totalMaterials,
    totalWeeks,
    previewWeeks: plan.weeks.length,
    isTruncatedPreview,
  };
}

export const packageGenerationService = {
  generatePackage,
  generateWeekMaterials,
  generateSpecialtyPack,
  regenerateSingleMaterial,
  deliverNextWeek,
  previewPackagePlan,
  generateMaterialOnDemand,
};
