import cron from 'node-cron';
import { DripStatus } from '@prisma/client';
import { prisma } from '../config/database.js';
import { redis } from '../config/redis.js';
import { logger } from '../utils/logger.js';
import { isContentDripJobInitialized, queueDripStep } from './contentDripJob.js';

const SCHED_LOCK_KEY = 'locks:content-drip-scheduler';
const SCHED_LOCK_TTL_MS = 10 * 60 * 1000;

async function withSchedulerLock(fn: () => Promise<void>): Promise<void> {
  const token = `${process.pid}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  try {
    const ok = await redis.set(SCHED_LOCK_KEY, token, 'PX', SCHED_LOCK_TTL_MS, 'NX');
    if (ok !== 'OK') {
      logger.debug('Content drip scheduling skipped (lock held by another instance)');
      return;
    }
  } catch (error) {
    logger.warn('Content drip scheduling skipped (failed to acquire Redis lock)', { error });
    return;
  }

  try {
    await fn();
  } finally {
    try {
      const script = `
        if redis.call("GET", KEYS[1]) == ARGV[1] then
          return redis.call("DEL", KEYS[1])
        else
          return 0
        end
      `;
      await redis.eval(script, 1, SCHED_LOCK_KEY, token);
    } catch (error) {
      logger.warn('Failed to release content drip scheduler lock', { error });
    }
  }
}

export async function runScheduledContentDrips(): Promise<void> {
  if (!isContentDripJobInitialized()) {
    logger.warn('Content drip scheduler skipped (queue not initialized)');
    return;
  }

  const dueEnrollments = await prisma.contentDripEnrollment.findMany({
    where: {
      status: DripStatus.ACTIVE,
      nextDeliveryAt: {
        lte: new Date(),
      },
    },
    select: {
      id: true,
      teacherId: true,
      currentStep: true,
    },
  });

  if (dueEnrollments.length === 0) {
    logger.debug('No due content drip enrollments found');
    return;
  }

  for (const enrollment of dueEnrollments) {
    await queueDripStep({
      enrollmentId: enrollment.id,
      teacherId: enrollment.teacherId,
      step: enrollment.currentStep,
    });
  }

  logger.info('Scheduled content drip check complete', {
    queued: dueEnrollments.length,
  });
}

export function scheduleContentDripDelivery(): void {
  cron.schedule('0,30 * * * *', async () => {
    await withSchedulerLock(async () => {
      try {
        await runScheduledContentDrips();
      } catch (error) {
        logger.error('Scheduled content drip cron failed', { error });
      }
    });
  });

  logger.info('Content drip delivery scheduled (every 30 minutes)');
}

