// DTC Store Revenue Analytics Service
// Provides revenue metrics for DTC package purchases
import { prisma } from '../../config/database.js';
import { redis } from '../../config/redis.js';
import { logger } from '../../utils/logger.js';

const CACHE_TTL = {
  OVERVIEW: 15 * 60,   // 15 minutes
  TIER: 15 * 60,       // 15 minutes
  SERIES: 30 * 60,     // 30 minutes
};

const CACHE_PREFIX = 'analytics:dtc';

// Statuses that represent a real purchase (exclude PENDING/FAILED/REFUNDED/CANCELLED)
const PAID_STATUSES = ['PAID', 'GENERATING', 'PARTIAL', 'READY', 'COMPLETED'] as const;

export interface DTCOverview {
  totalRevenue: number;
  last30DaysRevenue: number;
  totalPurchases: number;
  last30DaysPurchases: number;
  weeklyBoxMRR: number;
  weeklyBoxSubscribers: number;
  currency: string;
}

export interface DTCTierRevenue {
  tier: string;
  revenue: number;
  count: number;
}

export interface DTCMonthlyDataPoint {
  month: string;
  revenue: number;
  purchases: number;
}

export const dtcRevenueService = {
  /**
   * Get DTC revenue overview (all-time + last 30 days)
   */
  async getOverview(): Promise<DTCOverview> {
    const cacheKey = `${CACHE_PREFIX}:overview`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [allTime, last30, weeklyBox] = await Promise.all([
      // All-time totals
      prisma.packagePurchase.aggregate({
        where: { status: { in: [...PAID_STATUSES] } },
        _sum: { priceCents: true },
        _count: { id: true },
      }),
      // Last 30 days
      prisma.packagePurchase.aggregate({
        where: {
          status: { in: [...PAID_STATUSES] },
          createdAt: { gte: thirtyDaysAgo },
        },
        _sum: { priceCents: true },
        _count: { id: true },
      }),
      // Active Weekly Box subscriptions
      prisma.packagePurchase.count({
        where: {
          packageTier: 'WEEKLY_BOX',
          status: { in: [...PAID_STATUSES] },
          stripeSubscriptionId: { not: null },
        },
      }),
    ]);

    // Weekly Box is $29/mo
    const weeklyBoxMRR = weeklyBox * 29;

    const result: DTCOverview = {
      totalRevenue: (allTime._sum.priceCents || 0) / 100,
      last30DaysRevenue: (last30._sum.priceCents || 0) / 100,
      totalPurchases: allTime._count.id,
      last30DaysPurchases: last30._count.id,
      weeklyBoxMRR,
      weeklyBoxSubscribers: weeklyBox,
      currency: 'USD',
    };

    await redis.setex(cacheKey, CACHE_TTL.OVERVIEW, JSON.stringify(result));
    return result;
  },

  /**
   * Get revenue grouped by package tier
   */
  async getRevenueByTier(): Promise<DTCTierRevenue[]> {
    const cacheKey = `${CACHE_PREFIX}:by-tier`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const tiers = await prisma.packagePurchase.groupBy({
      by: ['packageTier'],
      where: { status: { in: [...PAID_STATUSES] } },
      _sum: { priceCents: true },
      _count: { id: true },
    });

    const result: DTCTierRevenue[] = tiers
      .map(t => ({
        tier: t.packageTier,
        revenue: (t._sum.priceCents || 0) / 100,
        count: t._count.id,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    await redis.setex(cacheKey, CACHE_TTL.TIER, JSON.stringify(result));
    return result;
  },

  /**
   * Get monthly revenue time series
   */
  async getMonthlySeries(months: number = 12): Promise<DTCMonthlyDataPoint[]> {
    const cacheKey = `${CACHE_PREFIX}:monthly:${months}m`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const now = new Date();
    const result: DTCMonthlyDataPoint[] = [];

    for (let i = months - 1; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const agg = await prisma.packagePurchase.aggregate({
        where: {
          status: { in: [...PAID_STATUSES] },
          createdAt: { gte: start, lt: end },
        },
        _sum: { priceCents: true },
        _count: { id: true },
      });

      result.push({
        month: start.toISOString().slice(0, 7),
        revenue: (agg._sum.priceCents || 0) / 100,
        purchases: agg._count.id,
      });
    }

    await redis.setex(cacheKey, CACHE_TTL.SERIES, JSON.stringify(result));
    return result;
  },

  /**
   * Invalidate all DTC analytics caches
   */
  async invalidateCache(): Promise<void> {
    const keys = await redis.keys(`${CACHE_PREFIX}:*`);
    if (keys.length > 0) {
      await redis.del(...keys);
      logger.info(`Invalidated ${keys.length} DTC revenue cache keys`);
    }
  },
};
