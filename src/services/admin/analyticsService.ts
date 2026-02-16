// Analytics Service for VC Dashboard
// Provides DAU/WAU/MAU metrics, user counts, and time series data
import { prisma } from '../../config/database.js';
import { redis } from '../../config/redis.js';
import { logger } from '../../utils/logger.js';

// Cache TTLs in seconds
const CACHE_TTL = {
  OVERVIEW: 5 * 60,        // 5 minutes for overview metrics
  DAU_SERIES: 10 * 60,     // 10 minutes for DAU time series
  USER_COUNTS: 5 * 60,     // 5 minutes for user counts
};

// Cache key prefixes
const CACHE_KEYS = {
  OVERVIEW: 'analytics:overview',
  DAU_SERIES: 'analytics:dau:series',
  USER_COUNTS: 'analytics:users:counts',
  DAU: 'analytics:dau',
  WAU: 'analytics:wau',
  MAU: 'analytics:mau',
};

/**
 * Get start of day in UTC
 */
function getStartOfDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/**
 * Get start of week (Sunday) in UTC
 */
function getStartOfWeek(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - d.getUTCDay());
  return d;
}

/**
 * Get start of month in UTC
 */
function getStartOfMonth(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(1);
  return d;
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

const WEEKLY_PREP_MATERIAL_MARKER = 'weekly_prep_material_id:';

type DateRangeFilter = {
  gte: Date;
  lt?: Date;
  lte?: Date;
};

function buildNonWeeklyTeacherContentWhere({
  dateRange,
  teacherId,
}: {
  dateRange?: DateRangeFilter;
  teacherId?: string;
}) {
  return {
    ...(teacherId ? { teacherId } : {}),
    ...(dateRange ? { createdAt: dateRange } : {}),
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
  };
}

async function countGeneratedTeacherContent({
  dateRange,
  teacherId,
}: {
  dateRange?: DateRangeFilter;
  teacherId?: string;
}): Promise<number> {
  const [savedContentCount, weeklyPrepGeneratedCount] = await Promise.all([
    prisma.teacherContent.count({
      where: buildNonWeeklyTeacherContentWhere({ dateRange, teacherId }),
    }),
    prisma.agentMaterial.count({
      where: {
        ...(dateRange ? { generatedAt: dateRange } : { generatedAt: { not: null } }),
        ...(teacherId
          ? {
            weeklyPrep: {
              is: {
                agent: {
                  is: {
                    teacherId,
                  },
                },
              },
            },
          }
          : {}),
      },
    }),
  ]);

  return savedContentCount + weeklyPrepGeneratedCount;
}

async function countTeachersWithGeneratedContent(dateRange: DateRangeFilter): Promise<number> {
  const [savedContentTeacherIds, weeklyPrepTeacherIds] = await Promise.all([
    prisma.teacherContent.findMany({
      where: buildNonWeeklyTeacherContentWhere({ dateRange }),
      select: { teacherId: true },
      distinct: ['teacherId'],
    }),
    prisma.teacherAgent.findMany({
      where: {
        weeklyPreps: {
          some: {
            materials: {
              some: {
                generatedAt: dateRange,
              },
            },
          },
        },
      },
      select: { teacherId: true },
      distinct: ['teacherId'],
    }),
  ]);

  const teacherIds = new Set<string>();
  savedContentTeacherIds.forEach((row) => teacherIds.add(row.teacherId));
  weeklyPrepTeacherIds.forEach((row) => teacherIds.add(row.teacherId));

  return teacherIds.size;
}

export interface OverviewMetrics {
  dau: number;
  wau: number;
  mau: number;
  dauWauRatio: number;
  dauMauRatio: number;
  totalParents: number;
  totalChildren: number;
  totalTeachers: number;
  payingSubscribers: number;
  freeUsers: number;
  conversionRate: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
}

export interface DAUDataPoint {
  date: string;
  count: number;
}

export interface UserGrowthDataPoint {
  date: string;
  totalUsers: number;
  newUsers: number;
}

export const analyticsService = {
  /**
   * Get Daily Active Users for a specific date
   */
  async getDAU(date: Date = new Date()): Promise<number> {
    const startOfDay = getStartOfDay(date);
    const cacheKey = `${CACHE_KEYS.DAU}:${formatDate(startOfDay)}`;

    // Try cache first
    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return parseInt(cached, 10);
    }

    // Query ActivitySession for unique children on that day
    const result = await prisma.activitySession.groupBy({
      by: ['childId'],
      where: {
        createdDate: startOfDay,
      },
    });

    const count = result.length;

    // Cache result (longer TTL for historical dates, shorter for today)
    const isToday = formatDate(startOfDay) === formatDate(new Date());
    await redis.setex(cacheKey, isToday ? CACHE_TTL.OVERVIEW : 3600, count.toString());

    return count;
  },

  /**
   * Get Weekly Active Users (last 7 days)
   */
  async getWAU(date: Date = new Date()): Promise<number> {
    const startOfDay = getStartOfDay(date);
    const weekAgo = new Date(startOfDay);
    weekAgo.setUTCDate(weekAgo.getUTCDate() - 7);

    const cacheKey = `${CACHE_KEYS.WAU}:${formatDate(startOfDay)}`;

    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return parseInt(cached, 10);
    }

    // Unique children with activity in the last 7 days
    const result = await prisma.activitySession.groupBy({
      by: ['childId'],
      where: {
        createdDate: {
          gte: weekAgo,
          lte: startOfDay,
        },
      },
    });

    const count = result.length;
    await redis.setex(cacheKey, CACHE_TTL.OVERVIEW, count.toString());

    return count;
  },

  /**
   * Get Monthly Active Users (last 30 days)
   */
  async getMAU(date: Date = new Date()): Promise<number> {
    const startOfDay = getStartOfDay(date);
    const monthAgo = new Date(startOfDay);
    monthAgo.setUTCDate(monthAgo.getUTCDate() - 30);

    const cacheKey = `${CACHE_KEYS.MAU}:${formatDate(startOfDay)}`;

    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return parseInt(cached, 10);
    }

    // Unique children with activity in the last 30 days
    const result = await prisma.activitySession.groupBy({
      by: ['childId'],
      where: {
        createdDate: {
          gte: monthAgo,
          lte: startOfDay,
        },
      },
    });

    const count = result.length;
    await redis.setex(cacheKey, CACHE_TTL.OVERVIEW, count.toString());

    return count;
  },

  /**
   * Get DAU time series for sparklines (last N days)
   */
  async getDAUTimeSeries(days: number = 30): Promise<DAUDataPoint[]> {
    const cacheKey = `${CACHE_KEYS.DAU_SERIES}:${days}d`;

    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return JSON.parse(cached);
    }

    const result: DAUDataPoint[] = [];
    const today = getStartOfDay();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setUTCDate(date.getUTCDate() - i);

      const dau = await this.getDAU(date);
      result.push({
        date: formatDate(date),
        count: dau,
      });
    }

    await redis.setex(cacheKey, CACHE_TTL.DAU_SERIES, JSON.stringify(result));

    return result;
  },

  /**
   * Get user counts (parents, children, teachers)
   */
  async getUserCounts(): Promise<{
    totalParents: number;
    totalChildren: number;
    totalTeachers: number;
    payingSubscribers: number;
    freeUsers: number;
    tierBreakdown: { tier: string; count: number }[];
  }> {
    const cacheKey = CACHE_KEYS.USER_COUNTS;

    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return JSON.parse(cached);
    }

    // Execute counts in parallel
    const [
      totalParents,
      totalChildren,
      totalTeachers,
      payingSubscribers,
      tierBreakdown,
    ] = await Promise.all([
      prisma.parent.count(),
      prisma.child.count(),
      prisma.teacher.count(),
      prisma.parent.count({
        where: {
          subscriptionTier: {
            not: 'FREE',
          },
        },
      }),
      prisma.parent.groupBy({
        by: ['subscriptionTier'],
        _count: {
          id: true,
        },
      }),
    ]);

    const result = {
      totalParents,
      totalChildren,
      totalTeachers,
      payingSubscribers,
      freeUsers: totalParents - payingSubscribers,
      tierBreakdown: tierBreakdown.map(t => ({
        tier: t.subscriptionTier,
        count: t._count.id,
      })),
    };

    await redis.setex(cacheKey, CACHE_TTL.USER_COUNTS, JSON.stringify(result));

    return result;
  },

  /**
   * Get new users count for a date range
   */
  async getNewUsers(startDate: Date, endDate: Date): Promise<number> {
    return prisma.parent.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  },

  /**
   * Get comprehensive overview metrics
   */
  async getOverview(): Promise<OverviewMetrics> {
    const cacheKey = CACHE_KEYS.OVERVIEW;

    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return JSON.parse(cached);
    }

    const today = getStartOfDay();
    const weekAgo = new Date(today);
    weekAgo.setUTCDate(weekAgo.getUTCDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setUTCDate(monthAgo.getUTCDate() - 30);

    // Get all metrics in parallel
    const [
      dau,
      wau,
      mau,
      userCounts,
      newUsersToday,
      newUsersThisWeek,
      newUsersThisMonth,
    ] = await Promise.all([
      this.getDAU(),
      this.getWAU(),
      this.getMAU(),
      this.getUserCounts(),
      this.getNewUsers(today, new Date()),
      this.getNewUsers(weekAgo, new Date()),
      this.getNewUsers(monthAgo, new Date()),
    ]);

    const result: OverviewMetrics = {
      dau,
      wau,
      mau,
      dauWauRatio: wau > 0 ? Math.round((dau / wau) * 100) / 100 : 0,
      dauMauRatio: mau > 0 ? Math.round((dau / mau) * 100) / 100 : 0,
      totalParents: userCounts.totalParents,
      totalChildren: userCounts.totalChildren,
      totalTeachers: userCounts.totalTeachers,
      payingSubscribers: userCounts.payingSubscribers,
      freeUsers: userCounts.freeUsers,
      conversionRate: userCounts.totalParents > 0
        ? Math.round((userCounts.payingSubscribers / userCounts.totalParents) * 10000) / 100
        : 0,
      newUsersToday,
      newUsersThisWeek,
      newUsersThisMonth,
    };

    await redis.setex(cacheKey, CACHE_TTL.OVERVIEW, JSON.stringify(result));

    return result;
  },

  /**
   * Get user growth time series
   */
  async getUserGrowthTimeSeries(days: number = 30): Promise<UserGrowthDataPoint[]> {
    const cacheKey = `analytics:growth:${days}d`;

    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return JSON.parse(cached);
    }

    const result: UserGrowthDataPoint[] = [];
    const today = getStartOfDay();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setUTCDate(date.getUTCDate() - i);
      const nextDay = new Date(date);
      nextDay.setUTCDate(nextDay.getUTCDate() + 1);

      // Count total users up to this date
      const [totalUsers, newUsers] = await Promise.all([
        prisma.parent.count({
          where: {
            createdAt: {
              lt: nextDay,
            },
          },
        }),
        prisma.parent.count({
          where: {
            createdAt: {
              gte: date,
              lt: nextDay,
            },
          },
        }),
      ]);

      result.push({
        date: formatDate(date),
        totalUsers,
        newUsers,
      });
    }

    await redis.setex(cacheKey, CACHE_TTL.DAU_SERIES, JSON.stringify(result));

    return result;
  },

  /**
   * Get engagement metrics
   */
  async getEngagementMetrics(date: Date = new Date()): Promise<{
    avgSessionDuration: number;
    avgSessionsPerUser: number;
    totalSessions: number;
    totalXpAwarded: number;
    lessonsCompleted: number;
  }> {
    const startOfDay = getStartOfDay(date);
    const cacheKey = `analytics:engagement:${formatDate(startOfDay)}`;

    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return JSON.parse(cached);
    }

    const sessions = await prisma.activitySession.findMany({
      where: {
        createdDate: startOfDay,
      },
      select: {
        durationMinutes: true,
        xpEarned: true,
        lessonsCompleted: true,
        childId: true,
      },
    });

    const uniqueUsers = new Set(sessions.map(s => s.childId)).size;
    const totalDuration = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
    const totalXp = sessions.reduce((sum, s) => sum + s.xpEarned, 0);
    const lessonsCompleted = sessions.reduce((sum, s) => sum + s.lessonsCompleted, 0);

    const result = {
      avgSessionDuration: sessions.length > 0 ? Math.round(totalDuration / sessions.length) : 0,
      avgSessionsPerUser: uniqueUsers > 0 ? Math.round((sessions.length / uniqueUsers) * 100) / 100 : 0,
      totalSessions: sessions.length,
      totalXpAwarded: totalXp,
      lessonsCompleted,
    };

    const isToday = formatDate(startOfDay) === formatDate(new Date());
    await redis.setex(cacheKey, isToday ? CACHE_TTL.OVERVIEW : 3600, JSON.stringify(result));

    return result;
  },

  /**
   * Get platform/device breakdown
   */
  async getPlatformBreakdown(days: number = 30): Promise<{ platform: string; count: number }[]> {
    const today = getStartOfDay();
    const startDate = new Date(today);
    startDate.setUTCDate(startDate.getUTCDate() - days);

    const cacheKey = `analytics:platforms:${days}d`;

    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return JSON.parse(cached);
    }

    const result = await prisma.activitySession.groupBy({
      by: ['platform'],
      where: {
        createdDate: {
          gte: startDate,
          lte: today,
        },
      },
      _count: {
        id: true,
      },
    });

    const mapped = result.map(r => ({
      platform: r.platform || 'unknown',
      count: r._count.id,
    }));

    await redis.setex(cacheKey, CACHE_TTL.DAU_SERIES, JSON.stringify(mapped));

    return mapped;
  },

  /**
   * Invalidate all analytics cache (useful after data changes)
   */
  async invalidateCache(): Promise<void> {
    const keys = await redis.keys('analytics:*');
    if (keys.length > 0) {
      await redis.del(...keys);
      logger.info(`Invalidated ${keys.length} analytics cache keys`);
    }
  },

  /**
   * Get day-by-day retention curves (overall + by curriculum)
   */
  async getRetentionCurves(days: number = 30): Promise<{
    overall: { day: number; rate: number }[];
    byCurriculum: { curriculum: string; data: { day: number; rate: number }[] }[];
  }> {
    const cacheKey = `analytics:retention-curves:${days}d`;

    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return JSON.parse(cached);
    }

    const today = getStartOfDay();
    const periodStart = new Date(today);
    periodStart.setUTCDate(periodStart.getUTCDate() - days);

    // Get all children who signed up in the period
    const children = await prisma.child.findMany({
      where: {
        createdAt: {
          gte: periodStart,
          lte: today,
        },
      },
      select: {
        id: true,
        createdAt: true,
        curriculumType: true,
      },
    });

    if (children.length === 0) {
      const emptyResult = { overall: [], byCurriculum: [] };
      await redis.setex(cacheKey, CACHE_TTL.DAU_SERIES, JSON.stringify(emptyResult));
      return emptyResult;
    }

    const childIds = children.map(c => c.id);

    // Get all activity sessions for these children
    const sessions = await prisma.activitySession.findMany({
      where: {
        childId: { in: childIds },
        createdAt: {
          gte: periodStart,
        },
      },
      select: {
        childId: true,
        createdDate: true,
      },
    });

    // Build a map of childId -> set of days active (relative to signup)
    const childActivityMap = new Map<string, Set<number>>();
    const childCreatedMap = new Map<string, Date>();
    const childCurriculumMap = new Map<string, string>();

    children.forEach(c => {
      childCreatedMap.set(c.id, c.createdAt);
      childCurriculumMap.set(c.id, c.curriculumType || 'UNSPECIFIED');
      childActivityMap.set(c.id, new Set());
    });

    sessions.forEach(s => {
      const created = childCreatedMap.get(s.childId);
      if (created && s.createdDate) {
        const daysSinceSignup = Math.floor((s.createdDate.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceSignup >= 0 && daysSinceSignup < 31) {
          childActivityMap.get(s.childId)?.add(daysSinceSignup);
        }
      }
    });

    // Calculate overall retention curve
    const overall: { day: number; rate: number }[] = [];
    for (let d = 0; d <= 30; d++) {
      const eligibleChildren = children.filter(c => {
        const daysSinceSignup = Math.floor((today.getTime() - c.createdAt.getTime()) / (1000 * 60 * 60 * 24));
        return daysSinceSignup >= d;
      });

      if (eligibleChildren.length === 0) {
        overall.push({ day: d, rate: 0 });
        continue;
      }

      const retainedCount = eligibleChildren.filter(c =>
        childActivityMap.get(c.id)?.has(d)
      ).length;

      const rate = Math.round((retainedCount / eligibleChildren.length) * 10000) / 100;
      overall.push({ day: d, rate });
    }

    // Calculate retention by curriculum
    const curriculumTypes = [...new Set(children.map(c => c.curriculumType || 'UNSPECIFIED'))];
    const byCurriculum: { curriculum: string; data: { day: number; rate: number }[] }[] = [];

    for (const curriculum of curriculumTypes) {
      const curriculumChildren = children.filter(c => (c.curriculumType || 'UNSPECIFIED') === curriculum);
      const data: { day: number; rate: number }[] = [];

      for (let d = 0; d <= 30; d++) {
        const eligibleChildren = curriculumChildren.filter(c => {
          const daysSinceSignup = Math.floor((today.getTime() - c.createdAt.getTime()) / (1000 * 60 * 60 * 24));
          return daysSinceSignup >= d;
        });

        if (eligibleChildren.length === 0) {
          data.push({ day: d, rate: 0 });
          continue;
        }

        const retainedCount = eligibleChildren.filter(c =>
          childActivityMap.get(c.id)?.has(d)
        ).length;

        const rate = Math.round((retainedCount / eligibleChildren.length) * 10000) / 100;
        data.push({ day: d, rate });
      }

      byCurriculum.push({ curriculum, data });
    }

    const result = { overall, byCurriculum };
    await redis.setex(cacheKey, CACHE_TTL.DAU_SERIES, JSON.stringify(result));

    return result;
  },

  /**
   * Get session duration time series
   */
  async getSessionDurationSeries(days: number = 30): Promise<{
    date: string;
    avgDuration: number;
    totalSessions: number;
  }[]> {
    const cacheKey = `analytics:session-duration:${days}d`;

    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return JSON.parse(cached);
    }

    const result: { date: string; avgDuration: number; totalSessions: number }[] = [];
    const today = getStartOfDay();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setUTCDate(date.getUTCDate() - i);

      const sessions = await prisma.activitySession.findMany({
        where: {
          createdDate: date,
        },
        select: {
          durationMinutes: true,
        },
      });

      const totalDuration = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
      const avgDuration = sessions.length > 0 ? Math.round(totalDuration / sessions.length) : 0;

      result.push({
        date: formatDate(date),
        avgDuration,
        totalSessions: sessions.length,
      });
    }

    await redis.setex(cacheKey, CACHE_TTL.DAU_SERIES, JSON.stringify(result));

    return result;
  },

  /**
   * Get activity breakdown by category
   */
  async getActivityBreakdown(days: number = 30): Promise<{
    activity: string;
    minutes: number;
    percentage: number;
  }[]> {
    const cacheKey = `analytics:activity-breakdown:${days}d`;

    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return JSON.parse(cached);
    }

    const today = getStartOfDay();
    const startDate = new Date(today);
    startDate.setUTCDate(startDate.getUTCDate() - days);

    // Get activity sessions with activities JSON
    const sessions = await prisma.activitySession.findMany({
      where: {
        createdDate: {
          gte: startDate,
          lte: today,
        },
      },
      select: {
        activities: true,
        durationMinutes: true,
      },
    });

    // Aggregate by activity type
    const activityTotals: Record<string, number> = {
      'Chat': 0,
      'Lessons': 0,
      'Quizzes': 0,
      'Flashcards': 0,
      'Other': 0,
    };

    let totalMinutes = 0;

    sessions.forEach(session => {
      const activities = session.activities as Record<string, number> | null;
      if (activities && typeof activities === 'object') {
        Object.entries(activities).forEach(([key, minutes]) => {
          const normalizedKey = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
          if (activityTotals.hasOwnProperty(normalizedKey)) {
            activityTotals[normalizedKey] += minutes;
          } else {
            activityTotals['Other'] += minutes;
          }
          totalMinutes += minutes;
        });
      } else {
        // If no activities breakdown, count as "Other"
        activityTotals['Other'] += session.durationMinutes;
        totalMinutes += session.durationMinutes;
      }
    });

    // Convert to result format with percentages
    const result = Object.entries(activityTotals)
      .filter(([_, minutes]) => minutes > 0)
      .map(([activity, minutes]) => ({
        activity,
        minutes,
        percentage: totalMinutes > 0 ? Math.round((minutes / totalMinutes) * 10000) / 100 : 0,
      }))
      .sort((a, b) => b.minutes - a.minutes);

    await redis.setex(cacheKey, CACHE_TTL.DAU_SERIES, JSON.stringify(result));

    return result;
  },

  /**
   * Get feature adoption rates
   */
  async getFeatureAdoption(): Promise<{
    feature: string;
    adoptionRate: number;
    usersCount: number;
    trend7d: number;
  }[]> {
    const cacheKey = 'analytics:feature-adoption';

    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return JSON.parse(cached);
    }

    const today = getStartOfDay();
    const weekAgo = new Date(today);
    weekAgo.setUTCDate(weekAgo.getUTCDate() - 7);
    const twoWeeksAgo = new Date(today);
    twoWeeksAgo.setUTCDate(twoWeeksAgo.getUTCDate() - 14);

    const totalChildren = await prisma.child.count();

    if (totalChildren === 0) {
      return [];
    }

    // Define features and how to measure them
    const features = [
      {
        name: 'Lessons',
        currentQuery: prisma.child.count({
          where: {
            lessons: { some: { createdAt: { gte: weekAgo } } },
          },
        }),
        previousQuery: prisma.child.count({
          where: {
            lessons: { some: { createdAt: { gte: twoWeeksAgo, lt: weekAgo } } },
          },
        }),
      },
      {
        name: 'Flashcards',
        currentQuery: prisma.child.count({
          where: {
            flashcardDecks: { some: { createdAt: { gte: weekAgo } } },
          },
        }),
        previousQuery: prisma.child.count({
          where: {
            flashcardDecks: { some: { createdAt: { gte: twoWeeksAgo, lt: weekAgo } } },
          },
        }),
      },
      {
        name: 'Chat',
        currentQuery: prisma.child.count({
          where: {
            chatMessages: { some: { createdAt: { gte: weekAgo } } },
          },
        }),
        previousQuery: prisma.child.count({
          where: {
            chatMessages: { some: { createdAt: { gte: twoWeeksAgo, lt: weekAgo } } },
          },
        }),
      },
      {
        name: 'Activity Sessions',
        currentQuery: prisma.child.count({
          where: {
            activitySessions: { some: { createdAt: { gte: weekAgo } } },
          },
        }),
        previousQuery: prisma.child.count({
          where: {
            activitySessions: { some: { createdAt: { gte: twoWeeksAgo, lt: weekAgo } } },
          },
        }),
      },
    ];

    const result: { feature: string; adoptionRate: number; usersCount: number; trend7d: number }[] = [];

    for (const feature of features) {
      try {
        const [currentCount, previousCount] = await Promise.all([
          feature.currentQuery,
          feature.previousQuery,
        ]);

        const adoptionRate = Math.round((currentCount / totalChildren) * 10000) / 100;
        const trend7d = previousCount > 0
          ? Math.round(((currentCount - previousCount) / previousCount) * 10000) / 100
          : currentCount > 0 ? 100 : 0;

        result.push({
          feature: feature.name,
          adoptionRate,
          usersCount: currentCount,
          trend7d,
        });
      } catch (error) {
        // If relation doesn't exist, skip this feature
        logger.warn(`Feature adoption query failed for ${feature.name}:`, error);
      }
    }

    await redis.setex(cacheKey, CACHE_TTL.OVERVIEW, JSON.stringify(result));

    return result;
  },

  /**
   * Get geographic breakdown by country
   */
  async getGeographicBreakdown(): Promise<{
    country: string;
    count: number;
    percentage: number;
  }[]> {
    const cacheKey = 'analytics:geographic';

    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return JSON.parse(cached);
    }

    const byCountry = await prisma.parent.groupBy({
      by: ['country'],
      _count: true,
    });

    const totalParents = byCountry.reduce((sum, c) => sum + c._count, 0);

    const result = byCountry
      .map(c => ({
        country: c.country || 'Unknown',
        count: c._count,
        percentage: totalParents > 0 ? Math.round((c._count / totalParents) * 10000) / 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);

    await redis.setex(cacheKey, CACHE_TTL.DAU_SERIES, JSON.stringify(result));

    return result;
  },

  // ============================================
  // TEACHER ANALYTICS
  // ============================================

  /**
   * Get Teacher Daily Active Users for a specific date (based on lastLoginAt)
   */
  async getTeacherDAU(date: Date = new Date()): Promise<number> {
    const startOfDay = getStartOfDay(date);
    const endOfDay = new Date(startOfDay);
    endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

    const cacheKey = `analytics:teacher:dau:${formatDate(startOfDay)}`;

    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return parseInt(cached, 10);
    }

    const count = await prisma.teacher.count({
      where: {
        lastLoginAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    const isToday = formatDate(startOfDay) === formatDate(new Date());
    await redis.setex(cacheKey, isToday ? CACHE_TTL.OVERVIEW : 3600, count.toString());

    return count;
  },

  /**
   * Get Teacher Weekly Active Users (last 7 days)
   */
  async getTeacherWAU(date: Date = new Date()): Promise<number> {
    const startOfDay = getStartOfDay(date);
    const weekAgo = new Date(startOfDay);
    weekAgo.setUTCDate(weekAgo.getUTCDate() - 7);

    const cacheKey = `analytics:teacher:wau:${formatDate(startOfDay)}`;

    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return parseInt(cached, 10);
    }

    const count = await prisma.teacher.count({
      where: {
        lastLoginAt: {
          gte: weekAgo,
          lte: new Date(),
        },
      },
    });

    await redis.setex(cacheKey, CACHE_TTL.OVERVIEW, count.toString());

    return count;
  },

  /**
   * Get Teacher Monthly Active Users (last 30 days)
   */
  async getTeacherMAU(date: Date = new Date()): Promise<number> {
    const startOfDay = getStartOfDay(date);
    const monthAgo = new Date(startOfDay);
    monthAgo.setUTCDate(monthAgo.getUTCDate() - 30);

    const cacheKey = `analytics:teacher:mau:${formatDate(startOfDay)}`;

    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return parseInt(cached, 10);
    }

    const count = await prisma.teacher.count({
      where: {
        lastLoginAt: {
          gte: monthAgo,
          lte: new Date(),
        },
      },
    });

    await redis.setex(cacheKey, CACHE_TTL.OVERVIEW, count.toString());

    return count;
  },

  /**
   * Get teacher DAU time series
   */
  async getTeacherDAUTimeSeries(days: number = 30): Promise<DAUDataPoint[]> {
    const cacheKey = `analytics:teacher:dau:series:${days}d`;

    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return JSON.parse(cached);
    }

    const result: DAUDataPoint[] = [];
    const today = getStartOfDay();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setUTCDate(date.getUTCDate() - i);

      const dau = await this.getTeacherDAU(date);
      result.push({
        date: formatDate(date),
        count: dau,
      });
    }

    await redis.setex(cacheKey, CACHE_TTL.DAU_SERIES, JSON.stringify(result));

    return result;
  },

  /**
   * Get comprehensive teacher overview metrics
   */
  async getTeacherOverview(): Promise<{
    totalTeachers: number;
    dau: number;
    wau: number;
    mau: number;
    dauWauRatio: number;
    dauMauRatio: number;
    payingTeachers: number;
    freeTeachers: number;
    conversionRate: number;
    newTeachersToday: number;
    newTeachersThisWeek: number;
    newTeachersThisMonth: number;
    tierBreakdown: { tier: string; count: number }[];
    totalTokensUsed: number;
    avgOperationsPerDay: number;
    contentCreated: number;
    activeTeachers7d: number;
  }> {
    const cacheKey = 'analytics:teacher:overview:v3';

    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return JSON.parse(cached);
    }

    const today = getStartOfDay();
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    const weekAgo = new Date(today);
    weekAgo.setUTCDate(weekAgo.getUTCDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setUTCDate(monthAgo.getUTCDate() - 30);

    const [
      totalTeachers,
      dau,
      wau,
      mau,
      payingTeachers,
      tierBreakdown,
      newTeachersToday,
      newTeachersThisWeek,
      newTeachersThisMonth,
      tokenUsageStats,
      contentCreated,
    ] = await Promise.all([
      prisma.teacher.count(),
      this.getTeacherDAU(),
      this.getTeacherWAU(),
      this.getTeacherMAU(),
      prisma.teacher.count({
        where: {
          subscriptionTier: { not: 'FREE' },
          subscriptionStatus: 'ACTIVE',
        },
      }),
      prisma.teacher.groupBy({
        by: ['subscriptionTier'],
        _count: { id: true },
      }),
      prisma.teacher.count({
        where: {
          createdAt: { gte: today, lt: tomorrow },
        },
      }),
      prisma.teacher.count({
        where: {
          createdAt: { gte: weekAgo },
        },
      }),
      prisma.teacher.count({
        where: {
          createdAt: { gte: monthAgo },
        },
      }),
      prisma.tokenUsageLog.aggregate({
        where: {
          createdAt: { gte: monthAgo },
        },
        _sum: {
          tokensUsed: true,
        },
        _count: {
          id: true,
        },
      }),
      countGeneratedTeacherContent({
        dateRange: {
          gte: monthAgo,
        },
      }),
    ]);

    const totalTokensUsed = tokenUsageStats._sum.tokensUsed || 0;
    const totalOperations = tokenUsageStats._count.id || 0;
    const avgOperationsPerDay = Math.round((totalOperations / 30) * 10) / 10;

    const result = {
      totalTeachers,
      dau,
      wau,
      mau,
      dauWauRatio: wau > 0 ? Math.round((dau / wau) * 100) / 100 : 0,
      dauMauRatio: mau > 0 ? Math.round((dau / mau) * 100) / 100 : 0,
      payingTeachers,
      freeTeachers: totalTeachers - payingTeachers,
      conversionRate: totalTeachers > 0
        ? Math.round((payingTeachers / totalTeachers) * 10000) / 100
        : 0,
      newTeachersToday,
      newTeachersThisWeek,
      newTeachersThisMonth,
      tierBreakdown: tierBreakdown.map(t => ({
        tier: t.subscriptionTier,
        count: t._count.id,
      })),
      totalTokensUsed,
      avgOperationsPerDay,
      contentCreated,
      activeTeachers7d: wau,
    };

    await redis.setex(cacheKey, CACHE_TTL.OVERVIEW, JSON.stringify(result));

    return result;
  },

  /**
   * Get teacher retention curves (day-by-day retention based on logins)
   */
  async getTeacherRetentionCurves(days: number = 30): Promise<{
    overall: { day: number; rate: number }[];
    byTier: { tier: string; data: { day: number; rate: number }[] }[];
  }> {
    const cacheKey = `analytics:teacher:retention-curves:${days}d`;

    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return JSON.parse(cached);
    }

    const today = getStartOfDay();
    const periodStart = new Date(today);
    periodStart.setUTCDate(periodStart.getUTCDate() - days);

    // Get all teachers who signed up in the period
    const teachers = await prisma.teacher.findMany({
      where: {
        createdAt: {
          gte: periodStart,
          lte: today,
        },
      },
      select: {
        id: true,
        createdAt: true,
        subscriptionTier: true,
        tokenUsageLogs: {
          select: {
            createdAt: true,
          },
        },
      },
    });

    if (teachers.length === 0) {
      const emptyResult = { overall: [], byTier: [] };
      await redis.setex(cacheKey, CACHE_TTL.DAU_SERIES, JSON.stringify(emptyResult));
      return emptyResult;
    }

    // Build activity map: teacherId -> set of active days since signup
    const teacherActivityMap = new Map<string, Set<number>>();

    teachers.forEach(t => {
      const activityDays = new Set<number>();
      t.tokenUsageLogs.forEach(log => {
        const daysSinceSignup = Math.floor(
          (log.createdAt.getTime() - t.createdAt.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceSignup >= 0 && daysSinceSignup <= 30) {
          activityDays.add(daysSinceSignup);
        }
      });
      teacherActivityMap.set(t.id, activityDays);
    });

    // Calculate overall retention curve
    const overall: { day: number; rate: number }[] = [];
    for (let d = 0; d <= 30; d++) {
      const eligibleTeachers = teachers.filter(t => {
        const daysSinceSignup = Math.floor((today.getTime() - t.createdAt.getTime()) / (1000 * 60 * 60 * 24));
        return daysSinceSignup >= d;
      });

      if (eligibleTeachers.length === 0) {
        overall.push({ day: d, rate: 0 });
        continue;
      }

      const retainedCount = eligibleTeachers.filter(t =>
        teacherActivityMap.get(t.id)?.has(d)
      ).length;

      const rate = Math.round((retainedCount / eligibleTeachers.length) * 10000) / 100;
      overall.push({ day: d, rate });
    }

    // Calculate retention by subscription tier
    const tiers = [...new Set(teachers.map(t => t.subscriptionTier))];
    const byTier: { tier: string; data: { day: number; rate: number }[] }[] = [];

    for (const tier of tiers) {
      const tierTeachers = teachers.filter(t => t.subscriptionTier === tier);
      const data: { day: number; rate: number }[] = [];

      for (let d = 0; d <= 30; d++) {
        const eligibleTeachers = tierTeachers.filter(t => {
          const daysSinceSignup = Math.floor((today.getTime() - t.createdAt.getTime()) / (1000 * 60 * 60 * 24));
          return daysSinceSignup >= d;
        });

        if (eligibleTeachers.length === 0) {
          data.push({ day: d, rate: 0 });
          continue;
        }

        const retainedCount = eligibleTeachers.filter(t =>
          teacherActivityMap.get(t.id)?.has(d)
        ).length;

        const rate = Math.round((retainedCount / eligibleTeachers.length) * 10000) / 100;
        data.push({ day: d, rate });
      }

      byTier.push({ tier, data });
    }

    const result = { overall, byTier };
    await redis.setex(cacheKey, CACHE_TTL.DAU_SERIES, JSON.stringify(result));

    return result;
  },

  /**
   * Get teacher token usage time series (proxy for session duration/engagement)
   */
  async getTeacherTokenUsageSeries(days: number = 30): Promise<{
    date: string;
    totalTokens: number;
    activeTeachers: number;
    avgTokensPerTeacher: number;
  }[]> {
    const cacheKey = `analytics:teacher:token-usage:${days}d`;

    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return JSON.parse(cached);
    }

    const result: {
      date: string;
      totalTokens: number;
      activeTeachers: number;
      avgTokensPerTeacher: number;
    }[] = [];
    const today = getStartOfDay();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setUTCDate(date.getUTCDate() - i);
      const nextDay = new Date(date);
      nextDay.setUTCDate(nextDay.getUTCDate() + 1);

      const usageLogs = await prisma.tokenUsageLog.findMany({
        where: {
          createdAt: {
            gte: date,
            lt: nextDay,
          },
        },
        select: {
          tokensUsed: true,
          teacherId: true,
        },
      });

      const totalTokens = usageLogs.reduce((sum, log) => sum + log.tokensUsed, 0);
      const uniqueTeachers = new Set(usageLogs.map(log => log.teacherId)).size;
      const avgTokensPerTeacher = uniqueTeachers > 0 ? Math.round(totalTokens / uniqueTeachers) : 0;

      result.push({
        date: formatDate(date),
        totalTokens,
        activeTeachers: uniqueTeachers,
        avgTokensPerTeacher,
      });
    }

    await redis.setex(cacheKey, CACHE_TTL.DAU_SERIES, JSON.stringify(result));

    return result;
  },

  /**
   * Get teacher activity breakdown by operation type
   */
  async getTeacherActivityBreakdown(days: number = 30): Promise<{
    activity: string;
    tokens: number;
    count: number;
    percentage: number;
  }[]> {
    const cacheKey = `analytics:teacher:activity-breakdown:${days}d`;

    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return JSON.parse(cached);
    }

    const today = getStartOfDay();
    const startDate = new Date(today);
    startDate.setUTCDate(startDate.getUTCDate() - days);

    const usageByOperation = await prisma.tokenUsageLog.groupBy({
      by: ['operation'],
      where: {
        createdAt: {
          gte: startDate,
          lte: new Date(),
        },
      },
      _sum: {
        tokensUsed: true,
      },
      _count: {
        id: true,
      },
    });

    const totalTokens = usageByOperation.reduce((sum, op) => sum + (op._sum.tokensUsed || 0), 0);

    const result = usageByOperation
      .map(op => ({
        activity: formatOperationName(op.operation),
        tokens: op._sum.tokensUsed || 0,
        count: op._count.id,
        percentage: totalTokens > 0
          ? Math.round(((op._sum.tokensUsed || 0) / totalTokens) * 10000) / 100
          : 0,
      }))
      .sort((a, b) => b.tokens - a.tokens);

    await redis.setex(cacheKey, CACHE_TTL.DAU_SERIES, JSON.stringify(result));

    return result;
  },

  /**
   * Get teacher feature adoption rates
   */
  async getTeacherFeatureAdoption(): Promise<{
    feature: string;
    adoptionRate: number;
    usersCount: number;
    trend7d: number;
  }[]> {
    const cacheKey = 'analytics:teacher:feature-adoption:v2';

    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return JSON.parse(cached);
    }

    const today = getStartOfDay();
    const weekAgo = new Date(today);
    weekAgo.setUTCDate(weekAgo.getUTCDate() - 7);
    const twoWeeksAgo = new Date(today);
    twoWeeksAgo.setUTCDate(twoWeeksAgo.getUTCDate() - 14);

    const totalTeachers = await prisma.teacher.count();

    if (totalTeachers === 0) {
      return [];
    }

    const features = [
      {
        name: 'Content Creation',
        currentQuery: countTeachersWithGeneratedContent({
          gte: weekAgo,
        }),
        previousQuery: countTeachersWithGeneratedContent({
          gte: twoWeeksAgo,
          lt: weekAgo,
        }),
      },
      {
        name: 'Audio Updates',
        currentQuery: prisma.teacher.count({
          where: {
            audioUpdates: { some: { createdAt: { gte: weekAgo } } },
          },
        }),
        previousQuery: prisma.teacher.count({
          where: {
            audioUpdates: { some: { createdAt: { gte: twoWeeksAgo, lt: weekAgo } } },
          },
        }),
      },
      {
        name: 'Sub Plans',
        currentQuery: prisma.teacher.count({
          where: {
            substitutePlans: { some: { createdAt: { gte: weekAgo } } },
          },
        }),
        previousQuery: prisma.teacher.count({
          where: {
            substitutePlans: { some: { createdAt: { gte: twoWeeksAgo, lt: weekAgo } } },
          },
        }),
      },
      {
        name: 'IEP Goals',
        currentQuery: prisma.teacher.count({
          where: {
            iepGoalSessions: { some: { createdAt: { gte: weekAgo } } },
          },
        }),
        previousQuery: prisma.teacher.count({
          where: {
            iepGoalSessions: { some: { createdAt: { gte: twoWeeksAgo, lt: weekAgo } } },
          },
        }),
      },
      {
        name: 'Grading',
        currentQuery: prisma.teacher.count({
          where: {
            gradingJobs: { some: { createdAt: { gte: weekAgo } } },
          },
        }),
        previousQuery: prisma.teacher.count({
          where: {
            gradingJobs: { some: { createdAt: { gte: twoWeeksAgo, lt: weekAgo } } },
          },
        }),
      },
      {
        name: 'Rubrics',
        currentQuery: prisma.teacher.count({
          where: {
            rubrics: { some: { createdAt: { gte: weekAgo } } },
          },
        }),
        previousQuery: prisma.teacher.count({
          where: {
            rubrics: { some: { createdAt: { gte: twoWeeksAgo, lt: weekAgo } } },
          },
        }),
      },
    ];

    const result: { feature: string; adoptionRate: number; usersCount: number; trend7d: number }[] = [];

    for (const feature of features) {
      try {
        const [currentCount, previousCount] = await Promise.all([
          feature.currentQuery,
          feature.previousQuery,
        ]);

        const adoptionRate = Math.round((currentCount / totalTeachers) * 10000) / 100;
        const trend7d = previousCount > 0
          ? Math.round(((currentCount - previousCount) / previousCount) * 10000) / 100
          : currentCount > 0 ? 100 : 0;

        result.push({
          feature: feature.name,
          adoptionRate,
          usersCount: currentCount,
          trend7d,
        });
      } catch (error) {
        logger.warn(`Teacher feature adoption query failed for ${feature.name}:`, error);
      }
    }

    await redis.setex(cacheKey, CACHE_TTL.OVERVIEW, JSON.stringify(result));

    return result;
  },

  /**
   * Get teacher segment breakdown (by tier, subject, grade range)
   */
  async getTeacherSegments(): Promise<{
    byTier: { tier: string; count: number; percentage: number }[];
    bySubject: { subject: string; count: number; percentage: number }[];
    byGradeRange: { gradeRange: string; count: number; percentage: number }[];
  }> {
    const cacheKey = 'analytics:teacher:segments';

    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return JSON.parse(cached);
    }

    const [byTier, bySubject, byGradeRange] = await Promise.all([
      prisma.teacher.groupBy({
        by: ['subscriptionTier'],
        _count: true,
      }),
      prisma.teacher.groupBy({
        by: ['primarySubject'],
        _count: true,
      }),
      prisma.teacher.groupBy({
        by: ['gradeRange'],
        _count: true,
      }),
    ]);

    const totalTeachers = byTier.reduce((sum, t) => sum + t._count, 0);

    const result = {
      byTier: byTier.map(t => ({
        tier: t.subscriptionTier,
        count: t._count,
        percentage: totalTeachers > 0 ? Math.round((t._count / totalTeachers) * 10000) / 100 : 0,
      })),
      bySubject: bySubject
        .filter(s => s.primarySubject)
        .map(s => ({
          subject: s.primarySubject || 'Unknown',
          count: s._count,
          percentage: totalTeachers > 0 ? Math.round((s._count / totalTeachers) * 10000) / 100 : 0,
        }))
        .sort((a, b) => b.count - a.count),
      byGradeRange: byGradeRange
        .filter(g => g.gradeRange)
        .map(g => ({
          gradeRange: g.gradeRange || 'Unknown',
          count: g._count,
          percentage: totalTeachers > 0 ? Math.round((g._count / totalTeachers) * 10000) / 100 : 0,
        }))
        .sort((a, b) => b.count - a.count),
    };

    await redis.setex(cacheKey, CACHE_TTL.OVERVIEW, JSON.stringify(result));

    return result;
  },

  // ============================================
  // REPEAT/ENGAGED TEACHERS
  // ============================================

  /**
   * Get repeat/engaged teachers - teachers who have used the service multiple times
   * This is valuable for understanding power users and retention
   */
  async getRepeatTeachers(options: {
    minDistinctDays?: number;
    minUsageEvents?: number;
    minContentCreated?: number;
    limit?: number;
    includeAll?: boolean;
    allLimit?: number;
  } = {}): Promise<{
    summary: {
      totalTeachers: number;
      repeatTeachers: number;
      repeatRate: number;
      superUsers: number;
      regularUsers: number;
      oneTimeUsers: number;
    };
    teachers: {
      id: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
      country: string | null;
      subscriptionTier: string;
      distinctUsageDays: number;
      totalUsageEvents: number;
      totalTokensUsed: number;
      contentCreated: number;
      firstUsageDate: Date | null;
      lastUsageDate: Date | null;
      daysSinceLastUsage: number | null;
      engagementTier: 'super' | 'regular' | 'light' | 'one-time';
    }[];
    allTeachers?: {
      id: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
      country: string | null;
      subscriptionTier: string;
      distinctUsageDays: number;
      totalUsageEvents: number;
      totalTokensUsed: number;
      contentCreated: number;
      firstUsageDate: Date | null;
      lastUsageDate: Date | null;
      daysSinceLastUsage: number | null;
      engagementTier: 'super' | 'regular' | 'light' | 'one-time';
    }[];
  }> {
    const {
      minDistinctDays = 2,
      minUsageEvents = 1,
      minContentCreated = 1,
      limit = 100,
      includeAll = false,
      allLimit,
    } = options;

    const cacheKey = `analytics:teacher:repeat:v2:${minDistinctDays}d:${minUsageEvents}e:${minContentCreated}c:${limit}:all:${includeAll ? '1' : '0'}:${allLimit ?? 'na'}`;

    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return JSON.parse(cached);
    }

    // Get all teachers (excluding test accounts)
    const teachers = await prisma.teacher.findMany({
      where: {
        NOT: {
          email: {
            contains: '@test.orbitlearn.com'
          }
        }
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        country: true,
        subscriptionTier: true,
        createdAt: true,
      }
    });

    const today = new Date();
    const teacherMetrics: {
      id: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
      country: string | null;
      subscriptionTier: string;
      distinctUsageDays: number;
      totalUsageEvents: number;
      totalTokensUsed: number;
      contentCreated: number;
      firstUsageDate: Date | null;
      lastUsageDate: Date | null;
      daysSinceLastUsage: number | null;
      engagementTier: 'super' | 'regular' | 'light' | 'one-time';
    }[] = [];

    // Get usage data for each teacher
    for (const teacher of teachers) {
      const [usageLogs, contentCount] = await Promise.all([
        prisma.tokenUsageLog.findMany({
          where: { teacherId: teacher.id },
          select: {
            createdAt: true,
            tokensUsed: true,
          },
          orderBy: { createdAt: 'asc' }
        }),
        countGeneratedTeacherContent({
          teacherId: teacher.id,
        }),
      ]);

      // Calculate distinct usage days
      const uniqueDays = new Set(
        usageLogs.map(log => log.createdAt.toISOString().split('T')[0])
      );
      const distinctUsageDays = uniqueDays.size;

      // Calculate totals
      const totalUsageEvents = usageLogs.length;
      const totalTokensUsed = usageLogs.reduce((sum, log) => sum + log.tokensUsed, 0);

      const firstUsageDate = usageLogs.length > 0 ? usageLogs[0].createdAt : null;
      const lastUsageDate = usageLogs.length > 0 ? usageLogs[usageLogs.length - 1].createdAt : null;

      const daysSinceLastUsage = lastUsageDate
        ? Math.floor((today.getTime() - lastUsageDate.getTime()) / (1000 * 60 * 60 * 24))
        : null;

      // Determine engagement tier
      let engagementTier: 'super' | 'regular' | 'light' | 'one-time';
      if (distinctUsageDays >= 5 || totalUsageEvents >= 10) {
        engagementTier = 'super';
      } else if (distinctUsageDays >= 2 || totalUsageEvents >= 3) {
        engagementTier = 'regular';
      } else if (totalUsageEvents >= 1) {
        engagementTier = 'light';
      } else {
        engagementTier = 'one-time';
      }

      teacherMetrics.push({
        id: teacher.id,
        email: teacher.email,
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        country: teacher.country,
        subscriptionTier: teacher.subscriptionTier,
        distinctUsageDays,
        totalUsageEvents,
        totalTokensUsed,
        contentCreated: contentCount,
        firstUsageDate,
        lastUsageDate,
        daysSinceLastUsage,
        engagementTier,
      });
    }

    // Sort by engagement (most engaged first)
    teacherMetrics.sort((a, b) => {
      if (b.distinctUsageDays !== a.distinctUsageDays) {
        return b.distinctUsageDays - a.distinctUsageDays;
      }
      return b.totalUsageEvents - a.totalUsageEvents;
    });

    // Filter for repeat users (meet any criteria)
    const repeatTeachers = teacherMetrics.filter(t =>
      t.distinctUsageDays >= minDistinctDays ||
      t.totalUsageEvents >= minUsageEvents ||
      t.contentCreated >= minContentCreated
    );

    // Calculate summary stats
    const superUsers = teacherMetrics.filter(t => t.engagementTier === 'super').length;
    const regularUsers = teacherMetrics.filter(t => t.engagementTier === 'regular').length;
    const lightUsers = teacherMetrics.filter(t => t.engagementTier === 'light').length;
    const oneTimeUsers = teacherMetrics.filter(t => t.engagementTier === 'one-time').length;

    const result: {
      summary: {
        totalTeachers: number;
        repeatTeachers: number;
        repeatRate: number;
        superUsers: number;
        regularUsers: number;
        oneTimeUsers: number;
      };
      teachers: typeof repeatTeachers;
      allTeachers?: typeof teacherMetrics;
    } = {
      summary: {
        totalTeachers: teachers.length,
        repeatTeachers: repeatTeachers.length,
        repeatRate: teachers.length > 0
          ? Math.round((repeatTeachers.length / teachers.length) * 10000) / 100
          : 0,
        superUsers,
        regularUsers,
        oneTimeUsers: lightUsers + oneTimeUsers, // Combine light + never-used
      },
      teachers: repeatTeachers.slice(0, limit),
    };

    if (includeAll) {
      const cap = typeof allLimit === 'number' ? allLimit : teacherMetrics.length;
      result.allTeachers = teacherMetrics.slice(0, cap);
    }

    await redis.setex(cacheKey, CACHE_TTL.OVERVIEW, JSON.stringify(result));

    return result;
  },

  /**
   * Get engagement tier distribution for teachers
   */
  async getTeacherEngagementDistribution(): Promise<{
    tiers: { tier: string; count: number; percentage: number }[];
    avgDaysActive: number;
    avgUsageEvents: number;
    avgContentCreated: number;
  }> {
    const cacheKey = 'analytics:teacher:engagement-distribution';

    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      return JSON.parse(cached);
    }

    const repeatData = await this.getRepeatTeachers({ limit: 10000 });
    const allTeachers = repeatData.teachers;

    const tierCounts = {
      'Super Users (5+ days)': repeatData.summary.superUsers,
      'Regular Users (2-4 days)': repeatData.summary.regularUsers,
      'One-time Users': repeatData.summary.oneTimeUsers,
    };

    const total = repeatData.summary.totalTeachers;

    const tiers = Object.entries(tierCounts).map(([tier, count]) => ({
      tier,
      count,
      percentage: total > 0 ? Math.round((count / total) * 10000) / 100 : 0,
    }));

    // Calculate averages
    const avgDaysActive = allTeachers.length > 0
      ? Math.round((allTeachers.reduce((s, t) => s + t.distinctUsageDays, 0) / allTeachers.length) * 10) / 10
      : 0;
    const avgUsageEvents = allTeachers.length > 0
      ? Math.round((allTeachers.reduce((s, t) => s + t.totalUsageEvents, 0) / allTeachers.length) * 10) / 10
      : 0;
    const avgContentCreated = allTeachers.length > 0
      ? Math.round((allTeachers.reduce((s, t) => s + t.contentCreated, 0) / allTeachers.length) * 10) / 10
      : 0;

    const result = {
      tiers,
      avgDaysActive,
      avgUsageEvents,
      avgContentCreated,
    };

    await redis.setex(cacheKey, CACHE_TTL.OVERVIEW, JSON.stringify(result));

    return result;
  },
};

/**
 * Format token operation name for display
 */
function formatOperationName(operation: string): string {
  const operationNames: Record<string, string> = {
    'CONTENT_ANALYSIS': 'Content Analysis',
    'LESSON_GENERATION': 'Lesson Generation',
    'QUIZ_GENERATION': 'Quiz Generation',
    'FLASHCARD_GENERATION': 'Flashcard Generation',
    'INFOGRAPHIC_GENERATION': 'Infographic Generation',
    'GRADING_SINGLE': 'Single Grading',
    'GRADING_BATCH': 'Batch Grading',
    'FEEDBACK_GENERATION': 'Feedback Generation',
    'CHAT': 'Chat',
    'BRAINSTORM': 'Brainstorm',
    'AUDIO_UPDATE': 'Audio Update',
    'SUB_PLAN_GENERATION': 'Sub Plan Generation',
    'IEP_GOAL_GENERATION': 'IEP Goal Generation',
    'GAMES': 'Games',
    'OTHER': 'Other',
  };
  return operationNames[operation] || operation;
}
