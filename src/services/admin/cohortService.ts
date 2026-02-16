// Cohort Analysis Service for VC Dashboard
// Provides retention matrix and conversion funnel analytics
import { prisma } from '../../config/database.js';
import { redis } from '../../config/redis.js';
import { logger } from '../../utils/logger.js';

const WEEKLY_PREP_MATERIAL_MARKER = 'weekly_prep_material_id:';

async function countGeneratedTeacherContentForTeacher(teacherId: string): Promise<number> {
  const [savedContentCount, weeklyPrepGeneratedCount] = await Promise.all([
    prisma.teacherContent.count({
      where: {
        teacherId,
        OR: [
          { extractedText: null },
          {
            extractedText: {
              not: {
                contains: WEEKLY_PREP_MATERIAL_MARKER,
              },
            },
          },
        ],
      },
    }),
    prisma.agentMaterial.count({
      where: {
        generatedAt: { not: null },
        weeklyPrep: {
          is: {
            agent: {
              is: {
                teacherId,
              },
            },
          },
        },
      },
    }),
  ]);

  return savedContentCount + weeklyPrepGeneratedCount;
}

// Cache TTLs in seconds
const CACHE_TTL = {
  COHORT_MATRIX: 60 * 60,    // 1 hour for cohort retention (expensive query)
  FUNNEL: 15 * 60,           // 15 minutes for funnel data
};

// Cache key prefixes
const CACHE_KEYS = {
  COHORT_MATRIX: 'analytics:cohorts:matrix',
  FUNNEL: 'analytics:funnel',
};

/**
 * Get start of month in UTC
 */
function getStartOfMonth(date: Date): Date {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(1);
  return d;
}

/**
 * Format date as YYYY-MM
 */
function formatMonth(date: Date): string {
  return date.toISOString().slice(0, 7);
}

/**
 * Get month display name
 */
function getMonthDisplayName(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}

export interface CohortRetentionRow {
  cohortMonth: string;           // "2024-01"
  cohortDisplayName: string;     // "Jan 2024"
  cohortSize: number;            // Number of users who signed up in this month
  retention: (number | null)[];  // Retention rates for M0, M1, M2, ... (null if future)
}

export interface CohortRetentionMatrix {
  months: number;                // Number of months of data
  cohorts: CohortRetentionRow[];
  headers: string[];             // ["M0", "M1", "M2", ...]
}

export interface FunnelStage {
  stage: string;
  label: string;
  count: number;
  percentage: number;
  conversionFromPrevious: number | null;
}

export interface ConversionFunnel {
  stages: FunnelStage[];
  timeframe: string;
}

export const cohortService = {
  /**
   * Get cohort retention matrix
   * This is the CRITICAL metric for VCs - shows user retention over time
   *
   * @param months Number of months to include in analysis (default 12)
   * @returns Matrix with retention rates per cohort per month
   */
  async getCohortRetentionMatrix(months: number = 12): Promise<CohortRetentionMatrix> {
    const cacheKey = `${CACHE_KEYS.COHORT_MATRIX}:${months}m`;

    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return JSON.parse(cached);
    }

    const today = new Date();
    const currentMonth = getStartOfMonth(today);
    const cohorts: CohortRetentionRow[] = [];
    const headers = Array.from({ length: months }, (_, i) => `M${i}`);

    // Process each cohort (month of signup)
    for (let i = months - 1; i >= 0; i--) {
      const cohortStart = new Date(currentMonth);
      cohortStart.setUTCMonth(cohortStart.getUTCMonth() - i);
      const cohortEnd = new Date(cohortStart);
      cohortEnd.setUTCMonth(cohortEnd.getUTCMonth() + 1);

      // Get children who signed up in this cohort month
      const cohortChildren = await prisma.child.findMany({
        where: {
          createdAt: {
            gte: cohortStart,
            lt: cohortEnd,
          },
        },
        select: {
          id: true,
          createdAt: true,
        },
      });

      const cohortSize = cohortChildren.length;

      if (cohortSize === 0) {
        cohorts.push({
          cohortMonth: formatMonth(cohortStart),
          cohortDisplayName: getMonthDisplayName(cohortStart),
          cohortSize: 0,
          retention: Array(months).fill(null),
        });
        continue;
      }

      const childIds = cohortChildren.map(c => c.id);
      const retention: (number | null)[] = [];

      // Calculate retention for each subsequent month
      for (let m = 0; m < months; m++) {
        const targetMonth = new Date(cohortStart);
        targetMonth.setUTCMonth(targetMonth.getUTCMonth() + m);
        const targetMonthEnd = new Date(targetMonth);
        targetMonthEnd.setUTCMonth(targetMonthEnd.getUTCMonth() + 1);

        // If target month is in the future, mark as null
        if (targetMonth > currentMonth) {
          retention.push(null);
          continue;
        }

        // Count users from this cohort who were active in the target month
        const activeInMonth = await prisma.activitySession.groupBy({
          by: ['childId'],
          where: {
            childId: {
              in: childIds,
            },
            monthStart: targetMonth,
          },
        });

        const activeCount = activeInMonth.length;
        const retentionRate = Math.round((activeCount / cohortSize) * 10000) / 100;
        retention.push(retentionRate);
      }

      cohorts.push({
        cohortMonth: formatMonth(cohortStart),
        cohortDisplayName: getMonthDisplayName(cohortStart),
        cohortSize,
        retention,
      });
    }

    const result: CohortRetentionMatrix = {
      months,
      cohorts,
      headers,
    };

    await redis.setex(cacheKey, CACHE_TTL.COHORT_MATRIX, JSON.stringify(result));

    return result;
  },

  /**
   * Get simplified retention rates (average across cohorts)
   */
  async getAverageRetention(months: number = 6): Promise<{ month: number; rate: number }[]> {
    const matrix = await this.getCohortRetentionMatrix(months);

    const avgRetention: { month: number; rate: number }[] = [];

    for (let m = 0; m < months; m++) {
      const rates = matrix.cohorts
        .map(c => c.retention[m])
        .filter((r): r is number => r !== null);

      if (rates.length > 0) {
        const avg = rates.reduce((sum, r) => sum + r, 0) / rates.length;
        avgRetention.push({
          month: m,
          rate: Math.round(avg * 100) / 100,
        });
      }
    }

    return avgRetention;
  },

  /**
   * Get subscription conversion funnel
   * Shows: Signup -> Active (any session) -> Trial -> Paid -> Retained 3mo
   */
  async getConversionFunnel(): Promise<ConversionFunnel> {
    const cacheKey = CACHE_KEYS.FUNNEL;

    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return JSON.parse(cached);
    }

    const today = new Date();
    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setUTCMonth(threeMonthsAgo.getUTCMonth() - 3);

    // Get counts for each funnel stage
    const [
      totalSignups,
      activeUsers,
      trialUsers,
      paidUsers,
      retainedPaidUsers,
    ] = await Promise.all([
      // Stage 1: Total signups (parents with children)
      prisma.parent.count({
        where: {
          children: {
            some: {},
          },
        },
      }),

      // Stage 2: Active users (parents with children who have had at least one session)
      prisma.parent.count({
        where: {
          children: {
            some: {
              activitySessions: {
                some: {},
              },
            },
          },
        },
      }),

      // Stage 3: Users who started a trial (had trial or are/were paid)
      prisma.parent.count({
        where: {
          OR: [
            { subscriptionTier: { not: 'FREE' } },
            { trialEndsAt: { not: null } },
          ],
        },
      }),

      // Stage 4: Paid users (currently on paid plan)
      prisma.parent.count({
        where: {
          subscriptionTier: {
            not: 'FREE',
          },
          subscriptionStatus: 'ACTIVE',
        },
      }),

      // Stage 5: Retained paid users (paid and active in last 3 months)
      prisma.parent.count({
        where: {
          subscriptionTier: { not: 'FREE' },
          subscriptionStatus: 'ACTIVE',
          children: {
            some: {
              activitySessions: {
                some: {
                  createdAt: {
                    gte: threeMonthsAgo,
                  },
                },
              },
            },
          },
        },
      }),
    ]);

    const stages: FunnelStage[] = [
      {
        stage: 'signup',
        label: 'Signed Up',
        count: totalSignups,
        percentage: 100,
        conversionFromPrevious: null,
      },
      {
        stage: 'active',
        label: 'Active (any session)',
        count: activeUsers,
        percentage: totalSignups > 0 ? Math.round((activeUsers / totalSignups) * 10000) / 100 : 0,
        conversionFromPrevious: totalSignups > 0 ? Math.round((activeUsers / totalSignups) * 10000) / 100 : 0,
      },
      {
        stage: 'trial',
        label: 'Started Trial',
        count: trialUsers,
        percentage: totalSignups > 0 ? Math.round((trialUsers / totalSignups) * 10000) / 100 : 0,
        conversionFromPrevious: activeUsers > 0 ? Math.round((trialUsers / activeUsers) * 10000) / 100 : 0,
      },
      {
        stage: 'paid',
        label: 'Paid Subscriber',
        count: paidUsers,
        percentage: totalSignups > 0 ? Math.round((paidUsers / totalSignups) * 10000) / 100 : 0,
        conversionFromPrevious: trialUsers > 0 ? Math.round((paidUsers / trialUsers) * 10000) / 100 : 0,
      },
      {
        stage: 'retained',
        label: 'Retained 3+ Months',
        count: retainedPaidUsers,
        percentage: totalSignups > 0 ? Math.round((retainedPaidUsers / totalSignups) * 10000) / 100 : 0,
        conversionFromPrevious: paidUsers > 0 ? Math.round((retainedPaidUsers / paidUsers) * 10000) / 100 : 0,
      },
    ];

    const result: ConversionFunnel = {
      stages,
      timeframe: 'all-time',
    };

    await redis.setex(cacheKey, CACHE_TTL.FUNNEL, JSON.stringify(result));

    return result;
  },

  /**
   * Get churn rate for a specific period
   */
  async getChurnRate(months: number = 1): Promise<{
    churnRate: number;
    churned: number;
    total: number;
  }> {
    const today = new Date();
    const periodStart = new Date(today);
    periodStart.setUTCMonth(periodStart.getUTCMonth() - months);

    // Get users who were paying at the start of the period
    const startPaying = await prisma.parent.count({
      where: {
        createdAt: {
          lt: periodStart,
        },
        subscriptionTier: {
          not: 'FREE',
        },
      },
    });

    // Get users who are still paying now
    const stillPaying = await prisma.parent.count({
      where: {
        subscriptionTier: {
          not: 'FREE',
        },
        subscriptionStatus: 'ACTIVE',
      },
    });

    // Estimate churned users (simplified - in real world you'd track subscription events)
    const churned = Math.max(0, startPaying - stillPaying);
    const churnRate = startPaying > 0 ? Math.round((churned / startPaying) * 10000) / 100 : 0;

    return {
      churnRate,
      churned,
      total: startPaying,
    };
  },

  /**
   * Get segment breakdown (geographic, curriculum, age)
   */
  async getSegmentBreakdown(): Promise<{
    byCurriculum: { curriculum: string; count: number }[];
    byAgeGroup: { ageGroup: string; count: number }[];
  }> {
    const cacheKey = 'analytics:segments';

    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return JSON.parse(cached);
    }

    const [byCurriculum, byAgeGroup] = await Promise.all([
      prisma.child.groupBy({
        by: ['curriculumType'],
        _count: true,
      }),
      prisma.child.groupBy({
        by: ['ageGroup'],
        _count: true,
      }),
    ]);

    const result = {
      byCurriculum: byCurriculum.map(c => ({
        curriculum: c.curriculumType || 'unspecified',
        count: c._count,
      })),
      byAgeGroup: byAgeGroup.map(a => ({
        ageGroup: a.ageGroup,
        count: a._count,
      })),
    };

    await redis.setex(cacheKey, CACHE_TTL.FUNNEL, JSON.stringify(result));

    return result;
  },

  /**
   * Invalidate cohort cache
   */
  async invalidateCache(): Promise<void> {
    const keys = await redis.keys('analytics:cohorts:*');
    const funnelKeys = await redis.keys('analytics:funnel*');
    const segmentKeys = await redis.keys('analytics:segments*');
    const allKeys = [...keys, ...funnelKeys, ...segmentKeys];

    if (allKeys.length > 0) {
      await redis.del(...allKeys);
      logger.info(`Invalidated ${allKeys.length} cohort/funnel cache keys`);
    }
  },

  /**
   * Get at-risk users (inactive for specified days)
   */
  async getAtRiskUsers(inactiveDays: number = 7, limit: number = 50): Promise<{
    id: string;
    name: string;
    parentEmail: string;
    lastActiveAt: string | null;
    daysSinceActive: number;
    lessonsCompleted: number;
    curriculumType: string;
  }[]> {
    const cacheKey = `analytics:at-risk:${inactiveDays}d:${limit}`;

    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return JSON.parse(cached);
    }

    const today = new Date();
    const cutoffDate = new Date(today);
    cutoffDate.setUTCDate(cutoffDate.getUTCDate() - inactiveDays);

    // Find children with no recent activity
    const children = await prisma.child.findMany({
      where: {
        OR: [
          { lastActiveAt: null },
          { lastActiveAt: { lt: cutoffDate } },
        ],
      },
      include: {
        parent: {
          select: {
            email: true,
          },
        },
        _count: {
          select: {
            lessons: true,
          },
        },
      },
      orderBy: {
        lastActiveAt: 'asc',
      },
      take: limit,
    });

    const result = children.map(child => {
      const daysSinceActive = child.lastActiveAt
        ? Math.floor((today.getTime() - child.lastActiveAt.getTime()) / (1000 * 60 * 60 * 24))
        : -1; // -1 indicates never active

      return {
        id: child.id,
        name: child.displayName,
        parentEmail: child.parent.email,
        lastActiveAt: child.lastActiveAt?.toISOString() || null,
        daysSinceActive: daysSinceActive === -1 ? 999 : daysSinceActive,
        lessonsCompleted: child._count.lessons,
        curriculumType: child.curriculumType || 'UNSPECIFIED',
      };
    });

    await redis.setex(cacheKey, CACHE_TTL.FUNNEL, JSON.stringify(result));

    return result;
  },

  /**
   * Get cross-segment analysis (curriculum + country)
   */
  async getCrossSegmentAnalysis(): Promise<{
    segments: {
      curriculum: string;
      country: string;
      childrenCount: number;
      activeCount: number;
      avgLessons: number;
    }[];
    totals: {
      byCurriculum: { curriculum: string; count: number }[];
      byCountry: { country: string; count: number }[];
    };
  }> {
    const cacheKey = 'analytics:cross-segments';

    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return JSON.parse(cached);
    }

    // Get children with parent country
    const children = await prisma.child.findMany({
      select: {
        id: true,
        curriculumType: true,
        lastActiveAt: true,
        parent: {
          select: {
            country: true,
          },
        },
        _count: {
          select: {
            lessons: true,
          },
        },
      },
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 30);

    // Build cross-segment map
    const segmentMap = new Map<string, {
      curriculum: string;
      country: string;
      children: number;
      active: number;
      totalLessons: number;
    }>();

    const curriculumCounts = new Map<string, number>();
    const countryCounts = new Map<string, number>();

    children.forEach(child => {
      const curriculum = child.curriculumType || 'UNSPECIFIED';
      const country = child.parent.country || 'Unknown';
      const key = `${curriculum}|${country}`;
      const isActive = child.lastActiveAt && child.lastActiveAt >= thirtyDaysAgo;

      if (!segmentMap.has(key)) {
        segmentMap.set(key, {
          curriculum,
          country,
          children: 0,
          active: 0,
          totalLessons: 0,
        });
      }

      const segment = segmentMap.get(key)!;
      segment.children++;
      if (isActive) segment.active++;
      segment.totalLessons += child._count.lessons;

      // Update totals
      curriculumCounts.set(curriculum, (curriculumCounts.get(curriculum) || 0) + 1);
      countryCounts.set(country, (countryCounts.get(country) || 0) + 1);
    });

    const segments = Array.from(segmentMap.values())
      .map(s => ({
        curriculum: s.curriculum,
        country: s.country,
        childrenCount: s.children,
        activeCount: s.active,
        avgLessons: s.children > 0 ? Math.round((s.totalLessons / s.children) * 10) / 10 : 0,
      }))
      .sort((a, b) => b.childrenCount - a.childrenCount)
      .slice(0, 20); // Top 20 segments

    const totals = {
      byCurriculum: Array.from(curriculumCounts.entries())
        .map(([curriculum, count]) => ({ curriculum, count }))
        .sort((a, b) => b.count - a.count),
      byCountry: Array.from(countryCounts.entries())
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count),
    };

    const result = { segments, totals };
    await redis.setex(cacheKey, CACHE_TTL.FUNNEL, JSON.stringify(result));

    return result;
  },

  // ============================================
  // TEACHER ANALYTICS
  // ============================================

  /**
   * Get at-risk teachers (inactive for specified days)
   */
  async getTeacherAtRiskUsers(inactiveDays: number = 7, limit: number = 50): Promise<{
    id: string;
    email: string;
    name: string;
    lastLoginAt: string | null;
    daysSinceActive: number;
    subscriptionTier: string;
    contentCreated: number;
  }[]> {
    const cacheKey = `analytics:teacher:at-risk:v2:${inactiveDays}d:${limit}`;

    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return JSON.parse(cached);
    }

    const today = new Date();
    const cutoffDate = new Date(today);
    cutoffDate.setUTCDate(cutoffDate.getUTCDate() - inactiveDays);

    // Find teachers with no recent login
    const teachers = await prisma.teacher.findMany({
      where: {
        OR: [
          { lastLoginAt: null },
          { lastLoginAt: { lt: cutoffDate } },
        ],
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        lastLoginAt: true,
        subscriptionTier: true,
      },
      orderBy: {
        lastLoginAt: 'asc',
      },
      take: limit,
    });

    const generatedContentCounts = await Promise.all(
      teachers.map(async (teacher) => [
        teacher.id,
        await countGeneratedTeacherContentForTeacher(teacher.id),
      ] as const)
    );
    const generatedContentMap = new Map(generatedContentCounts);

    const result = teachers.map(teacher => {
      const daysSinceActive = teacher.lastLoginAt
        ? Math.floor((today.getTime() - teacher.lastLoginAt.getTime()) / (1000 * 60 * 60 * 24))
        : -1;

      return {
        id: teacher.id,
        email: teacher.email,
        name: [teacher.firstName, teacher.lastName].filter(Boolean).join(' ') || 'Unknown',
        lastLoginAt: teacher.lastLoginAt?.toISOString() || null,
        daysSinceActive: daysSinceActive === -1 ? 999 : daysSinceActive,
        subscriptionTier: teacher.subscriptionTier,
        contentCreated: generatedContentMap.get(teacher.id) || 0,
      };
    });

    await redis.setex(cacheKey, CACHE_TTL.FUNNEL, JSON.stringify(result));

    return result;
  },

  /**
   * Get teacher cohort retention matrix
   */
  async getTeacherCohortRetentionMatrix(months: number = 12): Promise<CohortRetentionMatrix> {
    const cacheKey = `analytics:teacher:cohorts:matrix:${months}m`;

    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return JSON.parse(cached);
    }

    const today = new Date();
    const currentMonth = getStartOfMonth(today);
    const cohorts: CohortRetentionRow[] = [];
    const headers = Array.from({ length: months }, (_, i) => `M${i}`);

    for (let i = months - 1; i >= 0; i--) {
      const cohortStart = new Date(currentMonth);
      cohortStart.setUTCMonth(cohortStart.getUTCMonth() - i);
      const cohortEnd = new Date(cohortStart);
      cohortEnd.setUTCMonth(cohortEnd.getUTCMonth() + 1);

      // Get teachers who signed up in this cohort month
      const cohortTeachers = await prisma.teacher.findMany({
        where: {
          createdAt: {
            gte: cohortStart,
            lt: cohortEnd,
          },
        },
        select: {
          id: true,
          createdAt: true,
        },
      });

      const cohortSize = cohortTeachers.length;

      if (cohortSize === 0) {
        cohorts.push({
          cohortMonth: formatMonth(cohortStart),
          cohortDisplayName: getMonthDisplayName(cohortStart),
          cohortSize: 0,
          retention: Array(months).fill(null),
        });
        continue;
      }

      const teacherIds = cohortTeachers.map(t => t.id);
      const retention: (number | null)[] = [];

      // Calculate retention for each subsequent month based on token usage
      for (let m = 0; m < months; m++) {
        const targetMonth = new Date(cohortStart);
        targetMonth.setUTCMonth(targetMonth.getUTCMonth() + m);
        const targetMonthEnd = new Date(targetMonth);
        targetMonthEnd.setUTCMonth(targetMonthEnd.getUTCMonth() + 1);

        if (targetMonth > currentMonth) {
          retention.push(null);
          continue;
        }

        // Count teachers from this cohort who had token usage in the target month
        const activeInMonth = await prisma.tokenUsageLog.groupBy({
          by: ['teacherId'],
          where: {
            teacherId: {
              in: teacherIds,
            },
            createdAt: {
              gte: targetMonth,
              lt: targetMonthEnd,
            },
          },
        });

        const activeCount = activeInMonth.length;
        const retentionRate = Math.round((activeCount / cohortSize) * 10000) / 100;
        retention.push(retentionRate);
      }

      cohorts.push({
        cohortMonth: formatMonth(cohortStart),
        cohortDisplayName: getMonthDisplayName(cohortStart),
        cohortSize,
        retention,
      });
    }

    const result: CohortRetentionMatrix = {
      months,
      cohorts,
      headers,
    };

    await redis.setex(cacheKey, CACHE_TTL.COHORT_MATRIX, JSON.stringify(result));

    return result;
  },

  /**
   * Get teacher conversion funnel
   * Shows: Signup -> Active (any usage) -> Trial -> Paid -> Retained 3mo
   */
  async getTeacherConversionFunnel(): Promise<ConversionFunnel> {
    const cacheKey = 'analytics:teacher:funnel';

    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return JSON.parse(cached);
    }

    const today = new Date();
    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setUTCMonth(threeMonthsAgo.getUTCMonth() - 3);

    const [
      totalSignups,
      activeTeachers,
      trialTeachers,
      paidTeachers,
      retainedPaidTeachers,
    ] = await Promise.all([
      // Stage 1: Total signups
      prisma.teacher.count(),

      // Stage 2: Active teachers (have any token usage)
      prisma.teacher.count({
        where: {
          tokenUsageLogs: {
            some: {},
          },
        },
      }),

      // Stage 3: Teachers who started a trial or are/were paid
      prisma.teacher.count({
        where: {
          OR: [
            { subscriptionTier: { not: 'FREE' } },
            { trialEndsAt: { not: null } },
          ],
        },
      }),

      // Stage 4: Paid teachers (currently on paid plan)
      prisma.teacher.count({
        where: {
          subscriptionTier: { not: 'FREE' },
          subscriptionStatus: 'ACTIVE',
        },
      }),

      // Stage 5: Retained paid teachers (paid and active in last 3 months)
      prisma.teacher.count({
        where: {
          subscriptionTier: { not: 'FREE' },
          subscriptionStatus: 'ACTIVE',
          tokenUsageLogs: {
            some: {
              createdAt: {
                gte: threeMonthsAgo,
              },
            },
          },
        },
      }),
    ]);

    const stages: FunnelStage[] = [
      {
        stage: 'signup',
        label: 'Signed Up',
        count: totalSignups,
        percentage: 100,
        conversionFromPrevious: null,
      },
      {
        stage: 'active',
        label: 'Active (any usage)',
        count: activeTeachers,
        percentage: totalSignups > 0 ? Math.round((activeTeachers / totalSignups) * 10000) / 100 : 0,
        conversionFromPrevious: totalSignups > 0 ? Math.round((activeTeachers / totalSignups) * 10000) / 100 : 0,
      },
      {
        stage: 'trial',
        label: 'Started Trial',
        count: trialTeachers,
        percentage: totalSignups > 0 ? Math.round((trialTeachers / totalSignups) * 10000) / 100 : 0,
        conversionFromPrevious: activeTeachers > 0 ? Math.round((trialTeachers / activeTeachers) * 10000) / 100 : 0,
      },
      {
        stage: 'paid',
        label: 'Paid Subscriber',
        count: paidTeachers,
        percentage: totalSignups > 0 ? Math.round((paidTeachers / totalSignups) * 10000) / 100 : 0,
        conversionFromPrevious: trialTeachers > 0 ? Math.round((paidTeachers / trialTeachers) * 10000) / 100 : 0,
      },
      {
        stage: 'retained',
        label: 'Retained 3+ Months',
        count: retainedPaidTeachers,
        percentage: totalSignups > 0 ? Math.round((retainedPaidTeachers / totalSignups) * 10000) / 100 : 0,
        conversionFromPrevious: paidTeachers > 0 ? Math.round((retainedPaidTeachers / paidTeachers) * 10000) / 100 : 0,
      },
    ];

    const result: ConversionFunnel = {
      stages,
      timeframe: 'all-time',
    };

    await redis.setex(cacheKey, CACHE_TTL.FUNNEL, JSON.stringify(result));

    return result;
  },
};
