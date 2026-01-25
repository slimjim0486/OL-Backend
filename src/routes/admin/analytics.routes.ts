// Admin Analytics routes for VC Dashboard
import { Router, Request, Response, NextFunction } from 'express';
import { analyticsService, cohortService, revenueService } from '../../services/admin/index.js';
import { curriculumService } from '../../services/curriculum/index.js';
import { authenticateAdmin, requireAdmin } from '../../middleware/adminAuth.js';
import { validateInput } from '../../middleware/validateInput.js';
import { z } from 'zod';
import { CurriculumType, Subject } from '@prisma/client';

const router = Router();

// All analytics routes require admin authentication
router.use(authenticateAdmin, requireAdmin);

// ============================================
// VALIDATION SCHEMAS
// ============================================

const timeRangeSchema = z.object({
  days: z.coerce.number().min(1).max(365).optional().default(30),
});

const monthsSchema = z.object({
  months: z.coerce.number().min(1).max(24).optional().default(12),
});

// ============================================
// OVERVIEW ROUTES
// ============================================

/**
 * GET /api/admin/analytics/overview
 * Get comprehensive overview metrics (KPIs)
 */
router.get(
  '/overview',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const [overview, revenue, funnel] = await Promise.all([
        analyticsService.getOverview(),
        revenueService.getRevenueOverview(),
        cohortService.getConversionFunnel(),
      ]);

      res.json({
        success: true,
        data: {
          users: {
            dau: overview.dau,
            wau: overview.wau,
            mau: overview.mau,
            dauWauRatio: overview.dauWauRatio,
            dauMauRatio: overview.dauMauRatio,
            totalParents: overview.totalParents,
            totalChildren: overview.totalChildren,
            totalTeachers: overview.totalTeachers,
            payingSubscribers: overview.payingSubscribers,
            freeUsers: overview.freeUsers,
            conversionRate: overview.conversionRate,
          },
          growth: {
            newUsersToday: overview.newUsersToday,
            newUsersThisWeek: overview.newUsersThisWeek,
            newUsersThisMonth: overview.newUsersThisMonth,
          },
          revenue: {
            mrr: revenue.mrr,
            arr: revenue.arr,
            mrrGrowthPercent: revenue.mrrGrowthPercent,
            avgRevenuePerUser: revenue.avgRevenuePerUser,
            ltv: revenue.ltv,
            currency: revenue.currency,
          },
          funnel: {
            stages: funnel.stages,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// ============================================
// ACTIVE USERS ROUTES
// ============================================

/**
 * GET /api/admin/analytics/active-users
 * Get DAU/WAU/MAU time series data for charts
 */
router.get(
  '/active-users',
  validateInput(timeRangeSchema, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const days = parseInt(req.query.days as string) || 30;

      const [dauSeries, engagement] = await Promise.all([
        analyticsService.getDAUTimeSeries(days),
        analyticsService.getEngagementMetrics(),
      ]);

      res.json({
        success: true,
        data: {
          dauSeries,
          engagement: {
            avgSessionDuration: engagement.avgSessionDuration,
            avgSessionsPerUser: engagement.avgSessionsPerUser,
            totalSessions: engagement.totalSessions,
            totalXpAwarded: engagement.totalXpAwarded,
            lessonsCompleted: engagement.lessonsCompleted,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/admin/analytics/user-growth
 * Get user growth time series
 */
router.get(
  '/user-growth',
  validateInput(timeRangeSchema, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const growthSeries = await analyticsService.getUserGrowthTimeSeries(days);

      res.json({
        success: true,
        data: growthSeries,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ============================================
// COHORT RETENTION ROUTES
// ============================================

/**
 * GET /api/admin/analytics/cohorts
 * Get cohort retention matrix (CRITICAL for VCs)
 */
router.get(
  '/cohorts',
  validateInput(monthsSchema, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const months = parseInt(req.query.months as string) || 12;
      const matrix = await cohortService.getCohortRetentionMatrix(months);

      res.json({
        success: true,
        data: matrix,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/admin/analytics/retention-average
 * Get average retention rates across all cohorts
 */
router.get(
  '/retention-average',
  validateInput(monthsSchema, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const months = parseInt(req.query.months as string) || 6;
      const avgRetention = await cohortService.getAverageRetention(months);

      res.json({
        success: true,
        data: avgRetention,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ============================================
// FUNNEL ROUTES
// ============================================

/**
 * GET /api/admin/analytics/funnel
 * Get subscription conversion funnel
 */
router.get(
  '/funnel',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const funnel = await cohortService.getConversionFunnel();

      res.json({
        success: true,
        data: funnel,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/admin/analytics/churn
 * Get churn rate
 */
router.get(
  '/churn',
  validateInput(monthsSchema, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const months = parseInt(req.query.months as string) || 1;
      const churn = await cohortService.getChurnRate(months);

      res.json({
        success: true,
        data: churn,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ============================================
// REVENUE ROUTES
// ============================================

/**
 * GET /api/admin/analytics/revenue
 * Get comprehensive revenue metrics
 */
router.get(
  '/revenue',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const [overview, breakdown, totalRevenue] = await Promise.all([
        revenueService.getRevenueOverview(),
        revenueService.getMRRBreakdown(),
        revenueService.getTotalRevenue(),
      ]);

      res.json({
        success: true,
        data: {
          overview,
          breakdown,
          total: totalRevenue,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/admin/analytics/revenue/mrr-series
 * Get MRR time series for charts
 */
router.get(
  '/revenue/mrr-series',
  validateInput(monthsSchema, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const months = parseInt(req.query.months as string) || 12;
      const mrrSeries = await revenueService.getHistoricalMRR(months);

      res.json({
        success: true,
        data: mrrSeries,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/admin/analytics/revenue/daily
 * Get daily MRR for sparklines
 */
router.get(
  '/revenue/daily',
  validateInput(timeRangeSchema, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const dailyMRR = await revenueService.getMRRTimeSeries(days);

      res.json({
        success: true,
        data: dailyMRR,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/admin/analytics/revenue/teacher
 * Get teacher portal revenue metrics
 */
router.get(
  '/revenue/teacher',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const teacherRevenue = await revenueService.getTeacherRevenue();

      res.json({
        success: true,
        data: teacherRevenue,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ============================================
// SEGMENT ROUTES
// ============================================

/**
 * GET /api/admin/analytics/segments
 * Get user segment breakdowns (curriculum, age group)
 */
router.get(
  '/segments',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const [segments, platforms] = await Promise.all([
        cohortService.getSegmentBreakdown(),
        analyticsService.getPlatformBreakdown(),
      ]);

      res.json({
        success: true,
        data: {
          byCurriculum: segments.byCurriculum,
          byAgeGroup: segments.byAgeGroup,
          byPlatform: platforms,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// ============================================
// ENHANCED RETENTION ROUTES
// ============================================

/**
 * GET /api/admin/analytics/retention-curves
 * Get day-by-day retention curves (overall + by curriculum)
 */
router.get(
  '/retention-curves',
  validateInput(timeRangeSchema, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const curves = await analyticsService.getRetentionCurves(days);

      res.json({
        success: true,
        data: curves,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/admin/analytics/at-risk-users
 * Get list of users inactive for a specified number of days
 */
router.get(
  '/at-risk-users',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const inactiveDays = parseInt(req.query.inactiveDays as string) || 7;
      const limit = parseInt(req.query.limit as string) || 50;
      const users = await cohortService.getAtRiskUsers(inactiveDays, limit);

      res.json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ============================================
// ENHANCED ENGAGEMENT ROUTES
// ============================================

/**
 * GET /api/admin/analytics/session-duration-series
 * Get average session duration time series
 */
router.get(
  '/session-duration-series',
  validateInput(timeRangeSchema, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const series = await analyticsService.getSessionDurationSeries(days);

      res.json({
        success: true,
        data: series,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/admin/analytics/activity-breakdown
 * Get activity time breakdown by category
 */
router.get(
  '/activity-breakdown',
  validateInput(timeRangeSchema, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const breakdown = await analyticsService.getActivityBreakdown(days);

      res.json({
        success: true,
        data: breakdown,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/admin/analytics/feature-adoption
 * Get feature adoption rates
 */
router.get(
  '/feature-adoption',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const adoption = await analyticsService.getFeatureAdoption();

      res.json({
        success: true,
        data: adoption,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ============================================
// ENHANCED SEGMENT ROUTES
// ============================================

/**
 * GET /api/admin/analytics/geographic
 * Get geographic distribution by country
 */
router.get(
  '/geographic',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const geographic = await analyticsService.getGeographicBreakdown();

      res.json({
        success: true,
        data: geographic,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/admin/analytics/cross-segments
 * Get cross-segment analysis (curriculum + region)
 */
router.get(
  '/cross-segments',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const crossSegments = await cohortService.getCrossSegmentAnalysis();

      res.json({
        success: true,
        data: crossSegments,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ============================================
// TEACHER METRICS ROUTES
// ============================================

/**
 * GET /api/admin/analytics/teachers
 * Get teacher portal metrics (basic)
 */
router.get(
  '/teachers',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const [userCounts, teacherRevenue] = await Promise.all([
        analyticsService.getUserCounts(),
        revenueService.getTeacherRevenue(),
      ]);

      res.json({
        success: true,
        data: {
          totalTeachers: userCounts.totalTeachers,
          payingTeachers: teacherRevenue.payingTeachers,
          teacherMRR: teacherRevenue.mrr,
          byTier: teacherRevenue.byTier,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/admin/analytics/teacher/overview
 * Get comprehensive teacher overview metrics
 */
router.get(
  '/teacher/overview',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const [overview, revenue] = await Promise.all([
        analyticsService.getTeacherOverview(),
        revenueService.getTeacherRevenue(),
      ]);

      res.json({
        success: true,
        data: {
          ...overview,
          revenue: {
            mrr: revenue.mrr,
            arr: Math.round(revenue.mrr * 12 * 100) / 100,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/admin/analytics/teacher/active-users
 * Get teacher DAU time series
 */
router.get(
  '/teacher/active-users',
  validateInput(timeRangeSchema, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const dauSeries = await analyticsService.getTeacherDAUTimeSeries(days);

      res.json({
        success: true,
        data: {
          dauSeries,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/admin/analytics/teacher/retention-curves
 * Get teacher retention curves
 */
router.get(
  '/teacher/retention-curves',
  validateInput(timeRangeSchema, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const curves = await analyticsService.getTeacherRetentionCurves(days);

      res.json({
        success: true,
        data: curves,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/admin/analytics/teacher/at-risk-users
 * Get list of teachers inactive for a specified number of days
 */
router.get(
  '/teacher/at-risk-users',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const inactiveDays = parseInt(req.query.inactiveDays as string) || 7;
      const limit = parseInt(req.query.limit as string) || 50;
      const users = await cohortService.getTeacherAtRiskUsers(inactiveDays, limit);

      res.json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/admin/analytics/teacher/cohorts
 * Get teacher cohort retention matrix
 */
router.get(
  '/teacher/cohorts',
  validateInput(monthsSchema, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const months = parseInt(req.query.months as string) || 12;
      const matrix = await cohortService.getTeacherCohortRetentionMatrix(months);

      res.json({
        success: true,
        data: matrix,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/admin/analytics/teacher/funnel
 * Get teacher conversion funnel
 */
router.get(
  '/teacher/funnel',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const funnel = await cohortService.getTeacherConversionFunnel();

      res.json({
        success: true,
        data: funnel,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/admin/analytics/teacher/token-usage-series
 * Get teacher token usage time series
 */
router.get(
  '/teacher/token-usage-series',
  validateInput(timeRangeSchema, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const series = await analyticsService.getTeacherTokenUsageSeries(days);

      res.json({
        success: true,
        data: series,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/admin/analytics/teacher/activity-breakdown
 * Get teacher activity breakdown by operation type
 */
router.get(
  '/teacher/activity-breakdown',
  validateInput(timeRangeSchema, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const breakdown = await analyticsService.getTeacherActivityBreakdown(days);

      res.json({
        success: true,
        data: breakdown,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/admin/analytics/teacher/feature-adoption
 * Get teacher feature adoption rates
 */
router.get(
  '/teacher/feature-adoption',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const adoption = await analyticsService.getTeacherFeatureAdoption();

      res.json({
        success: true,
        data: adoption,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/admin/analytics/teacher/segments
 * Get teacher segment breakdown (by tier, subject, grade range)
 */
router.get(
  '/teacher/segments',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const segments = await analyticsService.getTeacherSegments();

      res.json({
        success: true,
        data: segments,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/admin/analytics/teacher/repeat-users
 * Get repeat/engaged teachers who have used the service multiple times
 * Query params:
 *   - minDays: minimum distinct days of usage (default: 2)
 *   - minEvents: minimum usage events (default: 1)
 *   - minContent: minimum content created (default: 1)
 *   - limit: max results to return (default: 100)
 */
router.get(
  '/teacher/repeat-users',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const minDistinctDays = parseInt(req.query.minDays as string) || 2;
      const minUsageEvents = parseInt(req.query.minEvents as string) || 1;
      const minContentCreated = parseInt(req.query.minContent as string) || 1;
      const limit = parseInt(req.query.limit as string) || 100;

      const data = await analyticsService.getRepeatTeachers({
        minDistinctDays,
        minUsageEvents,
        minContentCreated,
        limit,
      });

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/admin/analytics/teacher/engagement-distribution
 * Get engagement tier distribution for teachers
 */
router.get(
  '/teacher/engagement-distribution',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const distribution = await analyticsService.getTeacherEngagementDistribution();

      res.json({
        success: true,
        data: distribution,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ============================================
// CACHE MANAGEMENT ROUTES
// ============================================

/**
 * POST /api/admin/analytics/cache/invalidate
 * Invalidate all analytics caches (admin only)
 */
router.post(
  '/cache/invalidate',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      await Promise.all([
        analyticsService.invalidateCache(),
        cohortService.invalidateCache(),
        revenueService.invalidateCache(),
      ]);

      res.json({
        success: true,
        message: 'Analytics cache invalidated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

// ============================================
// STANDARDS CACHE MANAGEMENT ROUTES
// ============================================

/**
 * GET /api/admin/analytics/cache/standards
 * Get standards cache statistics
 */
router.get(
  '/cache/standards',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await curriculumService.getStandardsCacheStats();

      res.json({
        success: true,
        data: {
          cached: {
            rawStandards: stats.rawCount,
            adjacentStandards: stats.adjacentCount,
            aiContexts: stats.aiContextCount,
            strands: stats.strandsCount,
          },
          lastInvalidation: stats.lastInvalidation
            ? JSON.parse(stats.lastInvalidation)
            : null,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/admin/analytics/cache/standards/invalidate
 * Invalidate all standards cache
 */
router.post(
  '/cache/standards/invalidate',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      await curriculumService.invalidateAllStandardsCache();

      res.json({
        success: true,
        message: 'All standards cache invalidated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

// Validation schema for curriculum invalidation
const invalidateCurriculumSchema = z.object({
  curriculum: z.enum(['BRITISH', 'AMERICAN', 'IB', 'INDIAN_CBSE', 'INDIAN_ICSE', 'ARABIC']),
});

/**
 * POST /api/admin/analytics/cache/standards/invalidate/:curriculum
 * Invalidate standards cache for a specific curriculum
 */
router.post(
  '/cache/standards/invalidate/:curriculum',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const curriculum = req.params.curriculum.toUpperCase() as CurriculumType;

      // Validate curriculum type
      const validCurricula: CurriculumType[] = ['BRITISH', 'AMERICAN', 'IB', 'INDIAN_CBSE', 'INDIAN_ICSE', 'ARABIC'];
      if (!validCurricula.includes(curriculum)) {
        return res.status(400).json({
          success: false,
          error: `Invalid curriculum: ${req.params.curriculum}. Valid options: ${validCurricula.join(', ')}`,
        });
      }

      await curriculumService.invalidateCacheForCurriculum(curriculum);

      res.json({
        success: true,
        message: `Standards cache for ${curriculum} invalidated successfully`,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Validation schema for cache warming
const warmCacheSchema = z.object({
  curriculum: z.enum(['BRITISH', 'AMERICAN', 'IB', 'INDIAN_CBSE', 'INDIAN_ICSE', 'ARABIC']),
  subject: z.enum(['MATH', 'SCIENCE', 'ENGLISH', 'SOCIAL_STUDIES', 'ARABIC', 'HISTORY', 'GEOGRAPHY', 'OTHER']),
  grades: z.array(z.number().min(1).max(12)).min(1).max(12),
});

/**
 * POST /api/admin/analytics/cache/standards/warm
 * Warm the standards cache for specified curriculum/subject/grades
 *
 * Body: { curriculum: 'BRITISH', subject: 'MATH', grades: [1, 2, 3, 4, 5] }
 */
router.post(
  '/cache/standards/warm',
  validateInput(warmCacheSchema, 'body'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { curriculum, subject, grades } = req.body as {
        curriculum: CurriculumType;
        subject: Subject;
        grades: number[];
      };

      const result = await curriculumService.warmStandardsCache(
        curriculum,
        subject,
        grades
      );

      res.json({
        success: true,
        message: `Cache warming complete for ${curriculum}/${subject}`,
        data: {
          curriculum,
          subject,
          gradesRequested: grades.length,
          gradesWarmed: result.warmed,
          gradesFailed: result.failed,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
