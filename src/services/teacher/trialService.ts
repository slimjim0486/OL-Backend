import { prisma } from '../../config/database.js';
import { emailService } from '../email/emailService.js';
import { logger } from '../../utils/logger.js';

const HOUR_MS = 1000 * 60 * 60;

/**
 * Called by cron job to handle trial expirations
 */
export async function processTrialExpirations(): Promise<void> {
  const now = new Date();

  // Send warning email ~24 hours before trial ends (1-hour window)
  const warnWindowStart = new Date(now.getTime() + 23 * HOUR_MS);
  const warnWindowEnd = new Date(now.getTime() + 24 * HOUR_MS);

  const expiringTrials = await prisma.teacher.findMany({
    where: {
      subscriptionTier: 'FREE',
      organizationId: null,
      trialUsed: false,
      trialEndsAt: {
        gte: warnWindowStart,
        lt: warnWindowEnd,
      },
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      trialEndsAt: true,
    },
  });

  for (const teacher of expiringTrials) {
    await emailService.sendTeacherTrialExpiringEmail(
      teacher.email,
      teacher.firstName || 'Teacher',
      teacher.trialEndsAt
    );
  }

  // Find expired trials - mark as used and send expired email
  const expiredTrials = await prisma.teacher.findMany({
    where: {
      subscriptionTier: 'FREE',
      organizationId: null,
      trialUsed: false,
      trialEndsAt: {
        lt: now,
      },
    },
    select: {
      id: true,
      email: true,
      firstName: true,
    },
  });

  for (const teacher of expiredTrials) {
    await prisma.teacher.update({
      where: { id: teacher.id },
      data: { trialUsed: true },
    });
    await emailService.sendTeacherTrialExpiredEmail(
      teacher.email,
      teacher.firstName || 'Teacher'
    );
  }

  logger.info('Processed trial expirations', {
    expiring: expiringTrials.length,
    expired: expiredTrials.length,
  });
}

export default {
  processTrialExpirations,
};
