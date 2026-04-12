import { prisma } from '../../config/database.js';
import { TeacherContentType } from '@prisma/client';
import { SUBSCRIPTION_PRODUCTS } from '../../config/stripeProducts.js';
import { ForbiddenError } from '../../middleware/errorHandler.js';

export type ExportKind = 'pdf' | 'pptx' | 'drive' | 'batch';

const FREE_DOWNLOADS_PER_MONTH = 5;

function getCurrentMonthStart(date: Date = new Date()): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function getNextMonthStart(date: Date = new Date()): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));
}

function hasActiveSubscription(teacher: {
  subscriptionTier: string;
  subscriptionStatus: string;
  subscriptionExpiresAt: Date | null;
  organization: {
    subscriptionStatus: string;
    subscriptionExpiresAt: Date | null;
  } | null;
}): boolean {
  const now = new Date();

  const hasIndividualSubscription = Boolean(
    teacher.subscriptionTier !== 'FREE' &&
    teacher.subscriptionStatus === 'ACTIVE' &&
    (!teacher.subscriptionExpiresAt || teacher.subscriptionExpiresAt > now)
  );

  const hasOrganizationSeat = Boolean(
    teacher.organization?.subscriptionStatus === 'ACTIVE' &&
    (!teacher.organization.subscriptionExpiresAt || teacher.organization.subscriptionExpiresAt > now)
  );

  return hasIndividualSubscription || hasOrganizationSeat;
}

export async function getDownloadAccess(teacherId: string, _contentId: string) {
  const monthStart = getCurrentMonthStart();

  const [teacher, usage] = await Promise.all([
    prisma.teacher.findUnique({
      where: { id: teacherId },
      select: {
        subscriptionTier: true,
        subscriptionStatus: true,
        subscriptionExpiresAt: true,
        organization: {
          select: {
            subscriptionStatus: true,
            subscriptionExpiresAt: true,
          },
        },
      },
    }),
    prisma.teacherDownloadUsage.findUnique({
      where: {
        teacherId_month: {
          teacherId,
          month: monthStart,
        },
      },
      select: {
        usedCount: true,
      },
    }),
  ]);

  if (!teacher) {
    throw new Error('Teacher not found');
  }

  const isSubscriber = hasActiveSubscription(teacher);
  const freeDownloadsUsed = usage?.usedCount || 0;
  const freeDownloadsRemaining = Math.max(0, FREE_DOWNLOADS_PER_MONTH - freeDownloadsUsed);
  const canDownload = isSubscriber || freeDownloadsRemaining > 0;

  return {
    isSubscriber,
    canDownload,
    // Backward-compatible keys used by frontend export checks.
    hasPdf: canDownload,
    hasBundle: canDownload,
    freeMonthlyLimit: FREE_DOWNLOADS_PER_MONTH,
    freeDownloadsUsed,
    freeDownloadsRemaining,
    freeDownloadsResetAt: getNextMonthStart(),
  };
}

export async function checkDownloadAccess(
  teacherId: string,
  _contentId: string,
  _contentType: TeacherContentType,
  _exportKind: Exclude<ExportKind, 'batch'>
) {
  const access = await getDownloadAccess(teacherId, _contentId);
  const unlimitedMonthlyPriceCents = Math.round(SUBSCRIPTION_PRODUCTS.BASIC.priceMonthly * 100);

  return {
    ...access,
    allowed: access.canDownload,
    requiredProduct: 'SUBSCRIPTION',
    priceCents: unlimitedMonthlyPriceCents,
  };
}

export async function consumeFreeDownloadAllowance(teacherId: string) {
  const monthStart = getCurrentMonthStart();

  const runConsume = async () => {
    return prisma.$transaction(async (tx) => {
      const teacher = await tx.teacher.findUnique({
        where: { id: teacherId },
        select: {
          subscriptionTier: true,
          subscriptionStatus: true,
          subscriptionExpiresAt: true,
          organization: {
            select: {
              subscriptionStatus: true,
              subscriptionExpiresAt: true,
            },
          },
        },
      });

      if (!teacher) {
        throw new Error('Teacher not found');
      }

      if (hasActiveSubscription(teacher)) {
        return {
          consumed: false,
          freeMonthlyLimit: FREE_DOWNLOADS_PER_MONTH,
          freeDownloadsUsed: 0,
          freeDownloadsRemaining: FREE_DOWNLOADS_PER_MONTH,
          freeDownloadsResetAt: getNextMonthStart(),
        };
      }

      const usage = await tx.teacherDownloadUsage.findUnique({
        where: {
          teacherId_month: {
            teacherId,
            month: monthStart,
          },
        },
      });

      if (usage && usage.usedCount >= FREE_DOWNLOADS_PER_MONTH) {
        throw new ForbiddenError('Free monthly download limit reached. Start Teacher Unlimited to continue exporting.');
      }

      const freeDownloadsUsed = usage
        ? (await tx.teacherDownloadUsage.update({
            where: { id: usage.id },
            data: { usedCount: { increment: 1 } },
            select: { usedCount: true },
          })).usedCount
        : (await tx.teacherDownloadUsage.create({
            data: {
              teacherId,
              month: monthStart,
              usedCount: 1,
            },
            select: { usedCount: true },
          })).usedCount;

      return {
        consumed: true,
        freeMonthlyLimit: FREE_DOWNLOADS_PER_MONTH,
        freeDownloadsUsed,
        freeDownloadsRemaining: Math.max(0, FREE_DOWNLOADS_PER_MONTH - freeDownloadsUsed),
        freeDownloadsResetAt: getNextMonthStart(),
      };
    });
  };

  try {
    return await runConsume();
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return runConsume();
    }
    throw error;
  }
}
