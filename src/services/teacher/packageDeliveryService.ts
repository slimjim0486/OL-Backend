/**
 * Package Delivery Service — Handles progressive delivery scheduling and queries
 */

import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

// =============================================================================
// DELIVERY SCHEDULE
// =============================================================================

interface DeliveryScheduleItem {
  weekNumber: number;
  weekLabel: string;
  weekDate: string;
  isDelivered: boolean;
  isLocked: boolean;
  materialCount: number;
  generatedAt: string | null;
}

async function getDeliverySchedule(purchaseId: string, teacherId: string): Promise<{
  schedule: DeliveryScheduleItem[];
  nextDeliveryDate: string | null;
  weeksDelivered: number;
  totalWeeks: number;
}> {
  const purchase = await prisma.packagePurchase.findFirstOrThrow({
    where: { id: purchaseId, teacherId },
    select: {
      nextDeliveryDate: true,
      weeksDelivered: true,
      totalWeeks: true,
    },
  });

  const weeks = await prisma.packageWeek.findMany({
    where: { purchaseId },
    orderBy: { weekNumber: 'asc' },
    include: { _count: { select: { materials: true } } },
  });

  const schedule: DeliveryScheduleItem[] = weeks.map(w => ({
    weekNumber: w.weekNumber,
    weekLabel: w.weekLabel,
    weekDate: w.weekDate.toISOString(),
    isDelivered: w.isDelivered,
    isLocked: w.isLocked,
    materialCount: w._count.materials,
    generatedAt: w.generatedAt?.toISOString() || null,
  }));

  return {
    schedule,
    nextDeliveryDate: purchase.nextDeliveryDate?.toISOString() || null,
    weeksDelivered: purchase.weeksDelivered,
    totalWeeks: purchase.totalWeeks,
  };
}

// =============================================================================
// FIND PACKAGES NEEDING DELIVERY (for cron job)
// =============================================================================

async function getPackagesNeedingDelivery(): Promise<Array<{ id: string; teacherId: string }>> {
  const packages = await prisma.packagePurchase.findMany({
    where: {
      status: 'PARTIAL',
      nextDeliveryDate: { lte: new Date() },
      deliveryType: 'PROGRESSIVE',
    },
    select: { id: true, teacherId: true },
  });
  return packages;
}

// =============================================================================
// ACTIVE WEEKLY BOX SUBSCRIPTIONS (for weekly box cron)
// =============================================================================

async function getActiveWeeklyBoxes(): Promise<Array<{ id: string; teacherId: string; config: any }>> {
  const boxes = await prisma.packagePurchase.findMany({
    where: {
      packageTier: 'WEEKLY_BOX',
      status: { in: ['PAID', 'PARTIAL', 'READY'] },
      stripeSubscriptionId: { not: null },
    },
    select: { id: true, teacherId: true, config: true },
  });
  return boxes;
}

export const packageDeliveryService = {
  getDeliverySchedule,
  getPackagesNeedingDelivery,
  getActiveWeeklyBoxes,
};
