import { TokenOperation } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { PaymentRequiredError } from '../../middleware/errorHandler.js';
import { subscriptionService } from '../stripe/subscriptionService.js';
import { mapDbTierToPublicTier } from './subscriptionTiers.js';

const COUNTED_GENERATION_OPERATIONS = new Set<TokenOperation>([
  TokenOperation.LESSON_GENERATION,
  TokenOperation.QUIZ_GENERATION,
  TokenOperation.FLASHCARD_GENERATION,
  TokenOperation.INFOGRAPHIC_GENERATION,
  TokenOperation.SUB_PLAN_GENERATION,
  TokenOperation.IEP_GOAL_GENERATION,
]);

const OPERATION_ESTIMATES: Record<TokenOperation, number> = {
  CONTENT_ANALYSIS: 5000,
  LESSON_GENERATION: 8000,
  QUIZ_GENERATION: 3000,
  FLASHCARD_GENERATION: 2500,
  INFOGRAPHIC_GENERATION: 1600,
  GRADING_SINGLE: 4000,
  GRADING_BATCH: 4000,
  FEEDBACK_GENERATION: 1500,
  CHAT: 800,
  BRAINSTORM: 800,
  AUDIO_UPDATE: 7500,
  SUB_PLAN_GENERATION: 4000,
  IEP_GOAL_GENERATION: 5000,
  GAMES: 1200,
  AGENT_CHAT: 500,
  WEEKLY_PREP: 500,
  AGENT_MATERIAL: 500,
  PARENT_EMAIL_GENERATION: 2000,
  REPORT_COMMENT_GENERATION: 3000,
  REVIEW_SUMMARY_GENERATION: 5000,
  STREAM_EXTRACTION: 500,
  GRAPH_ANALYSIS: 500,
  PREFERENCE_ANALYSIS: 500,
  NUDGE_GENERATION: 500,
};

export function tokensToCredits(tokens: number | bigint): number {
  return Math.ceil(Number(tokens) / 1000);
}

export function creditsToTokens(credits: number): number {
  return credits * 1000;
}

export function getTierCredits(): number {
  return 5;
}

export function getOperationCredits(operation: TokenOperation): number {
  if (COUNTED_GENERATION_OPERATIONS.has(operation)) {
    return 1;
  }
  return tokensToCredits(OPERATION_ESTIMATES[operation] || 1000);
}

export const quotaService = {
  async checkQuota(teacherId: string, operation: TokenOperation, estimatedTokens?: number) {
    if (!COUNTED_GENERATION_OPERATIONS.has(operation)) {
      return {
        allowed: true,
        remainingTokens: BigInt(Number.MAX_SAFE_INTEGER),
        remainingCredits: Number.MAX_SAFE_INTEGER,
        estimatedCost: 0,
        quotaResetDate: new Date(),
        percentUsed: 0,
        warning: undefined,
      };
    }

    const generation = await subscriptionService.canGenerate(teacherId);
    const used = Number.isFinite(generation.limit) ? generation.used : 0;
    const limit = Number.isFinite(generation.limit) ? generation.limit : Number.MAX_SAFE_INTEGER;
    const remaining = Math.max(0, limit - used);
    const percentUsed = limit > 0 && Number.isFinite(limit)
      ? Math.min(100, Math.round((used / limit) * 100))
      : 0;

    return {
      allowed: generation.allowed,
      remainingTokens: BigInt(remaining),
      remainingCredits: remaining,
      estimatedCost: 0,
      quotaResetDate: new Date(),
      percentUsed,
      warning: generation.allowed
        ? undefined
        : `You've used ${used} of ${limit} free generations this month.`,
    };
  },

  async enforceQuota(teacherId: string, operation: TokenOperation, estimatedTokens?: number) {
    const check = await this.checkQuota(teacherId, operation, estimatedTokens);
    if (!check.allowed) {
      throw new PaymentRequiredError(
        `Free generation limit reached. You've used ${check.percentUsed >= 100 ? 'all' : 'your'} monthly free generations. Upgrade to Plus for unlimited generation.`
      );
    }
  },

  async recordUsage(params: {
    teacherId: string;
    operation: TokenOperation;
    tokensUsed: number;
    modelUsed: string;
    resourceType?: string;
    resourceId?: string;
    countGeneration?: boolean;
  }) {
    const {
      teacherId,
      operation,
      tokensUsed,
      modelUsed,
      resourceType,
      resourceId,
      countGeneration = true,
    } = params;

    await prisma.tokenUsageLog.create({
      data: {
        teacherId,
        operation,
        tokensUsed,
        modelUsed,
        resourceType,
        resourceId,
        estimatedCost: 0,
      },
    });

    if (countGeneration && COUNTED_GENERATION_OPERATIONS.has(operation)) {
      await subscriptionService.incrementGenerationCount(teacherId);
    }
  },

  async getUsageStats(teacherId: string, period: 'day' | 'week' | 'month' = 'month') {
    const now = new Date();
    const startDate = period === 'day'
      ? new Date(now.getFullYear(), now.getMonth(), now.getDate())
      : period === 'week'
        ? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        : new Date(now.getFullYear(), now.getMonth(), 1);

    const logs = await prisma.tokenUsageLog.findMany({
      where: {
        teacherId,
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const operationBreakdown = logs.reduce<Record<TokenOperation, number>>((acc, log) => {
      acc[log.operation] = (acc[log.operation] || 0) + log.tokensUsed;
      return acc;
    }, {} as Record<TokenOperation, number>);

    const generation = await subscriptionService.canGenerate(teacherId);

    return {
      currentMonth: {
        tokensUsed: BigInt(logs.reduce((sum, log) => sum + log.tokensUsed, 0)),
        creditsUsed: Number.isFinite(generation.limit) ? generation.used : 0,
        operationBreakdown,
        costEstimate: 0,
      },
      history: logs.map((log) => ({
        date: log.createdAt,
        tokensUsed: log.tokensUsed,
        creditsUsed: COUNTED_GENERATION_OPERATIONS.has(log.operation) ? 1 : tokensToCredits(log.tokensUsed),
        operation: log.operation,
      })),
    };
  },

  async getQuotaInfo(teacherId: string) {
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: {
        subscriptionTier: true,
        subscriptionStatus: true,
        currentPeriodEnd: true,
        generationCountResetAt: true,
        grandfatheredUntil: true,
        isFoundingMember: true,
      },
    });

    if (!teacher) {
      throw new Error('Teacher not found');
    }

    const publicTier = mapDbTierToPublicTier(teacher.subscriptionTier);
    const generation = await subscriptionService.canGenerate(teacherId);
    const limit = Number.isFinite(generation.limit) ? generation.limit : 0;
    const used = Number.isFinite(generation.limit) ? generation.used : 0;
    const remaining = Number.isFinite(generation.limit) ? Math.max(0, limit - used) : 0;

    return {
      pricingModel: 'SUBSCRIPTION',
      subscriptionTier: publicTier,
      subscriptionStatus: teacher.subscriptionStatus,
      generations: {
        used,
        limit: Number.isFinite(generation.limit) ? limit : null,
        remaining: Number.isFinite(generation.limit) ? remaining : null,
        resetDate: teacher.generationCountResetAt,
      },
      quota: {
        monthlyLimit: String(limit),
        used: String(used),
        remaining: String(remaining),
        percentUsed: limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0,
        resetDate: teacher.generationCountResetAt,
      },
      credits: {
        subscription: limit,
        rollover: 0,
        bonus: 0,
        total: limit,
        used,
        remaining,
      },
      trial: {
        isActive: false,
        startedAt: null,
        endsAt: null,
        daysRemaining: null,
        used: false,
      },
      currentPeriodEnd: teacher.currentPeriodEnd,
      grandfatheredUntil: teacher.grandfatheredUntil,
      isFoundingMember: teacher.isFoundingMember,
    };
  },

  async getCreditBalance(teacherId: string) {
    const info = await this.getQuotaInfo(teacherId);
    return info.credits;
  },

  async resetQuota() {
    return;
  },

  async resetAllExpiredQuotas() {
    return;
  },

  async addBonusCredits() {
    return;
  },

  async updateSubscriptionTier() {
    return;
  },

  async startTrial() {
    return new Date();
  },

  async isTrialExpired() {
    return false;
  },

  getOperationEstimate(operation: TokenOperation) {
    return OPERATION_ESTIMATES[operation] || 1000;
  },

  estimateTokens(content: string) {
    return Math.max(500, Math.ceil((content || '').length / 4));
  },
};

export default quotaService;
