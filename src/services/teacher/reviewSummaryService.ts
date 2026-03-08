// Review Summary Service — Monthly and yearly review summaries
// Aggregates weekly preps, interactions, and curriculum state to produce rich summaries
import { ReviewType, ReviewStatus, TokenOperation, WeeklyPrepStatus } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { genAI, TEACHER_CONTENT_SAFETY_SETTINGS } from '../../config/gemini.js';
import { config } from '../../config/index.js';
import { agentMemoryService } from './agentMemoryService.js';
import { quotaService } from './quotaService.js';
import { logger } from '../../utils/logger.js';
import { generateAndParseJson, truncatePromptText } from '../../utils/modelJson.js';

// ============================================
// TYPES
// ============================================

interface ReviewData {
  weeklyPreps: Array<{
    weekLabel: string;
    materialsCount: number;
    approvedCount: number;
    subjects: string[];
  }>;
  interactions: Array<{
    type: string;
    outputType: string | null;
    summary: string | null;
    createdAt: Date;
  }>;
  curriculumStates: Array<{
    subject: string;
    standardsTaught: string[];
    standardsAssessed: string[];
    identifiedGaps: any;
    currentWeek: number;
  }>;
  periodLabel: string;
  periodStart: Date;
  periodEnd: Date;
}

const REVIEW_INTERACTIONS_LIMIT = 120;

// ============================================
// MONTHLY REVIEW
// ============================================

async function generateMonthlyReview(
  teacherId: string,
  month?: Date // Defaults to previous month
): Promise<{ id: string; periodLabel: string }> {
  const agent = await agentMemoryService.getAgent(teacherId);
  if (!agent) throw new Error('Agent not initialized');

  const now = month || new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const periodEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
  const periodLabel = periodStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Check for existing
  const existing = await prisma.teacherReviewSummary.findFirst({
    where: { agentId: agent.id, type: ReviewType.MONTHLY, periodStart },
  });
  if (existing) return { id: existing.id, periodLabel: existing.periodLabel };

  const data = await gatherReviewData(agent.id, teacherId, periodStart, periodEnd, periodLabel);
  return createReviewFromData(teacherId, agent.id, ReviewType.MONTHLY, data);
}

// ============================================
// YEARLY REVIEW
// ============================================

async function generateYearlyReview(
  teacherId: string,
  schoolYear?: string // e.g., "2025-2026"
): Promise<{ id: string; periodLabel: string }> {
  const agent = await agentMemoryService.getAgent(teacherId);
  if (!agent) throw new Error('Agent not initialized');

  const year = schoolYear || getCurrentSchoolYear();
  const [startYear] = year.split('-').map(Number);
  const periodStart = new Date(startYear, 7, 1); // Aug 1
  const periodEnd = new Date(startYear + 1, 5, 30, 23, 59, 59); // Jun 30
  const periodLabel = `${year} School Year`;

  const existing = await prisma.teacherReviewSummary.findFirst({
    where: { agentId: agent.id, type: ReviewType.YEARLY, periodStart },
  });
  if (existing) return { id: existing.id, periodLabel: existing.periodLabel };

  const data = await gatherReviewData(agent.id, teacherId, periodStart, periodEnd, periodLabel);
  return createReviewFromData(teacherId, agent.id, ReviewType.YEARLY, data, year);
}

// ============================================
// DATA GATHERING
// ============================================

async function gatherReviewData(
  agentId: string,
  teacherId: string,
  periodStart: Date,
  periodEnd: Date,
  periodLabel: string
): Promise<ReviewData> {
  // Weekly preps in period
  const weeklyPreps = await prisma.agentWeeklyPrep.findMany({
    where: {
      agentId,
      weekStartDate: { gte: periodStart, lte: periodEnd },
      status: { in: [WeeklyPrepStatus.READY, WeeklyPrepStatus.REVIEWING, WeeklyPrepStatus.APPROVED] },
    },
    include: {
      materials: { select: { subject: true, status: true } },
    },
    orderBy: { weekStartDate: 'asc' },
  });

  const prepSummaries = weeklyPreps.map(p => ({
    weekLabel: p.weekLabel,
    materialsCount: p.materials.length,
    approvedCount: p.materials.filter(m => m.status === 'APPROVED').length,
    subjects: [...new Set(p.materials.map(m => m.subject))],
  }));

  // Interactions in period
  const interactions = await prisma.agentInteraction.findMany({
    where: {
      agentId,
      createdAt: { gte: periodStart, lte: periodEnd },
    },
    select: { type: true, outputType: true, summary: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
    take: REVIEW_INTERACTIONS_LIMIT,
  });

  // Current curriculum states
  const curriculumStates = await agentMemoryService.getCurriculumStates(agentId);

  return {
    weeklyPreps: prepSummaries,
    interactions: interactions as any[],
    curriculumStates: curriculumStates.map(s => ({
      subject: s.subject,
      standardsTaught: s.standardsTaught,
      standardsAssessed: s.standardsAssessed,
      identifiedGaps: s.identifiedGaps,
      currentWeek: s.currentWeek,
    })),
    periodLabel,
    periodStart,
    periodEnd,
  };
}

// ============================================
// REVIEW GENERATION (AI)
// ============================================

async function createReviewFromData(
  teacherId: string,
  agentId: string,
  type: ReviewType,
  data: ReviewData,
  schoolYear?: string
): Promise<{ id: string; periodLabel: string }> {
  const estimatedTokens = 5000;
  await quotaService.enforceQuota(teacherId, TokenOperation.REVIEW_SUMMARY_GENERATION, estimatedTokens);

  const isYearly = type === ReviewType.YEARLY;

  const weeklyPrepSummary = truncatePromptText(
    data.weeklyPreps
      .map((p) => `  * ${p.weekLabel}: ${p.materialsCount} materials (${p.approvedCount} approved), subjects: ${p.subjects.join(', ')}`)
      .join('\n'),
    5000
  );
  const interactionSummary = truncatePromptText(summarizeInteractions(data.interactions), 2500);
  const curriculumSummary = truncatePromptText(
    data.curriculumStates
      .map((s) => `  * ${s.subject}: ${s.standardsTaught.length} taught, ${s.standardsAssessed.length} assessed, week ${s.currentWeek}`)
      .join('\n'),
    2500
  );

  const prompt = `You are an educational data analyst creating a ${isYearly ? 'yearly' : 'monthly'} teaching review summary for the period "${data.periodLabel}".

DATA:
- Weekly Prep Packages: ${data.weeklyPreps.length}
${weeklyPrepSummary}

- Teaching Interactions: ${data.interactions.length}
${interactionSummary}

- Curriculum Coverage:
${curriculumSummary}

Generate a comprehensive ${isYearly ? 'yearly' : 'monthly'} review. Return JSON:
{
  "executiveSummary": "2-3 paragraph overview of the period",
  "lessonsDelivered": { "total": <number>, "bySubject": { "<SUBJECT>": <count> } },
  "assessmentsGiven": { "total": <number>, "byType": { "quiz": <count>, "exit_ticket": <count> } },
  "standardsCovered": { "total": <number>, "newlyMastered": <number>, "gaps": <number> },
  "studentGrowth": { "summary": "<growth narrative>", "highlights": ["<highlight1>", "<highlight2>"] },
  "attentionAreas": [{ "area": "<area>", "description": "<detail>", "suggestedAction": "<action>" }],
  "upcomingFocus": [{ "topic": "<topic>", "rationale": "<why>" }],
  "recommendations": [{ "recommendation": "<rec>", "priority": "high" | "medium" | "low" }]${isYearly ? ',\n  "handoverNotes": "Notes for next year teacher including student group dynamics, effective strategies, and curriculum positioning"' : ''}
}`;

  const parsedResult = await generateAndParseJson({
    contextLabel: 'Review summary',
    prompts: [
      prompt,
      `${prompt}\n\nIMPORTANT: Return a single valid JSON object only. Keep the executive summary concise and the lists focused.`,
    ],
    estimatedTokens,
    invoke: async (attemptPrompt) => {
      const model = genAI.getGenerativeModel({
        model: config.gemini.models.flash,
        safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: getReviewSummaryMaxOutputTokens(data, isYearly),
          responseMimeType: 'application/json',
        },
      });
      return model.generateContent(attemptPrompt);
    },
    normalize: (value) => normalizeReviewSummary(value, isYearly),
  });

  const parsed = parsedResult.data;
  const tokensUsed = parsedResult.tokensUsed;

  const review = await prisma.teacherReviewSummary.create({
    data: {
      teacherId,
      agentId,
      type,
      periodLabel: data.periodLabel,
      periodStart: data.periodStart,
      periodEnd: data.periodEnd,
      schoolYear: schoolYear || null,
      executiveSummary: parsed.executiveSummary || '',
      lessonsDelivered: parsed.lessonsDelivered || {},
      assessmentsGiven: parsed.assessmentsGiven || {},
      standardsCovered: parsed.standardsCovered || {},
      studentGrowth: parsed.studentGrowth || {},
      attentionAreas: parsed.attentionAreas || [],
      upcomingFocus: parsed.upcomingFocus || [],
      recommendations: parsed.recommendations || [],
      handoverNotes: parsed.handoverNotes || null,
      tokensUsed,
      modelUsed: config.gemini.models.flash,
      status: ReviewStatus.DRAFT,
    },
  });

  await quotaService.recordUsage({
    teacherId,
    operation: TokenOperation.REVIEW_SUMMARY_GENERATION,
    tokensUsed,
    modelUsed: config.gemini.models.flash,
    resourceType: 'review_summary',
    resourceId: review.id,
  });

  logger.info('Review summary generated', { reviewId: review.id, type, periodLabel: data.periodLabel });

  return { id: review.id, periodLabel: data.periodLabel };
}

// ============================================
// CRUD
// ============================================

async function listReviews(
  teacherId: string,
  opts?: { type?: ReviewType; page?: number; limit?: number }
) {
  const agent = await agentMemoryService.getAgent(teacherId);
  if (!agent) return { reviews: [], total: 0 };

  const page = opts?.page || 1;
  const limit = opts?.limit || 20;
  const where = {
    agentId: agent.id,
    ...(opts?.type && { type: opts.type }),
  };

  const [reviews, total] = await Promise.all([
    prisma.teacherReviewSummary.findMany({
      where,
      orderBy: { periodStart: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.teacherReviewSummary.count({ where }),
  ]);

  return { reviews, total };
}

async function getReview(id: string, teacherId: string) {
  return prisma.teacherReviewSummary.findFirst({
    where: { id, teacherId },
  });
}

async function updateReview(
  id: string,
  teacherId: string,
  data: { status?: ReviewStatus; handoverNotes?: string }
) {
  const existing = await prisma.teacherReviewSummary.findFirst({
    where: { id, teacherId },
  });
  if (!existing) throw new Error('Review not found');

  return prisma.teacherReviewSummary.update({
    where: { id },
    data,
  });
}

async function deleteReview(id: string, teacherId: string) {
  const existing = await prisma.teacherReviewSummary.findFirst({
    where: { id, teacherId },
  });
  if (!existing) throw new Error('Review not found');

  await prisma.teacherReviewSummary.delete({ where: { id } });
}

// ============================================
// HELPERS
// ============================================

function getCurrentSchoolYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  if (now.getMonth() >= 7) {
    return `${year}-${year + 1}`;
  }
  return `${year - 1}-${year}`;
}

function summarizeInteractions(interactions: Array<{ type: string; outputType: string | null }>): string {
  const counts: Record<string, number> = {};
  for (const i of interactions) {
    const key = i.outputType || i.type;
    counts[key] = (counts[key] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([key, count]) => `  * ${key}: ${count}`)
    .join('\n');
}

function getReviewSummaryMaxOutputTokens(data: ReviewData, isYearly: boolean): number {
  const base = isYearly ? 5500 : 4200;
  const weeklyPrepFactor = data.weeklyPreps.length * 90;
  const interactionFactor = data.interactions.length * 8;
  const curriculumFactor = data.curriculumStates.length * 120;
  return Math.min(9000, Math.max(4000, base + weeklyPrepFactor + interactionFactor + curriculumFactor));
}

function normalizeReviewSummary(value: any, isYearly: boolean): any {
  const executiveSummary = String(value?.executiveSummary || '').trim();
  if (!executiveSummary) {
    throw new Error('Review summary JSON missing executiveSummary');
  }

  return {
    executiveSummary,
    lessonsDelivered: value?.lessonsDelivered && typeof value.lessonsDelivered === 'object' ? value.lessonsDelivered : {},
    assessmentsGiven: value?.assessmentsGiven && typeof value.assessmentsGiven === 'object' ? value.assessmentsGiven : {},
    standardsCovered: value?.standardsCovered && typeof value.standardsCovered === 'object' ? value.standardsCovered : {},
    studentGrowth: value?.studentGrowth && typeof value.studentGrowth === 'object' ? value.studentGrowth : {},
    attentionAreas: Array.isArray(value?.attentionAreas) ? value.attentionAreas : [],
    upcomingFocus: Array.isArray(value?.upcomingFocus) ? value.upcomingFocus : [],
    recommendations: Array.isArray(value?.recommendations) ? value.recommendations : [],
    handoverNotes: isYearly ? String(value?.handoverNotes || '').trim() || null : null,
  };
}

// ============================================
// EXPORTS
// ============================================

export const reviewSummaryService = {
  generateMonthlyReview,
  generateYearlyReview,
  listReviews,
  getReview,
  updateReview,
  deleteReview,
};
