/**
 * Weekly Box Job
 * Runs every Sunday at 6 PM UTC to generate next week's materials
 * for all active Weekly Classroom Box subscribers.
 */

import { Queue, Worker, Job } from 'bullmq';
import { createBullConnection } from '../config/redis.js';
import { logger } from '../utils/logger.js';
import { prisma } from '../config/database.js';
import { packageDeliveryService } from '../services/teacher/packageDeliveryService.js';
import { addPackageGenerationJob } from './packageGenerationJob.js';

const QUEUE_NAME = 'weekly-box';
const CRON_SCHEDULE = '0 18 * * 0'; // Sunday 6 PM UTC

let weeklyBoxQueue: Queue | null = null;
let weeklyBoxWorker: Worker | null = null;

export async function initializeWeeklyBoxJob(): Promise<void> {
  try {
    const connection = createBullConnection();

    weeklyBoxQueue = new Queue(QUEUE_NAME, {
      connection,
      defaultJobOptions: {
        removeOnComplete: 10,
        removeOnFail: 20,
      },
    });

    // Add repeating job
    await weeklyBoxQueue.add('generate-weekly-boxes', {}, {
      repeat: { pattern: CRON_SCHEDULE },
      jobId: 'weekly-box-generation',
    });

    weeklyBoxWorker = new Worker(
      QUEUE_NAME,
      async (job: Job) => {
        return processWeeklyBoxGeneration(job);
      },
      {
        connection: createBullConnection(),
        concurrency: 1,
      }
    );

    weeklyBoxWorker.on('completed', (job, result) => {
      if (result?.processed > 0) {
        logger.info('Weekly box cron completed', { processed: result.processed });
      }
    });

    weeklyBoxWorker.on('failed', (job, err) => {
      logger.error('Weekly box cron failed', { error: err.message });
    });

    logger.info('Weekly box cron job initialized');
  } catch (error) {
    logger.error('Failed to initialize weekly box cron', { error });
  }
}

async function processWeeklyBoxGeneration(job: Job): Promise<{ processed: number }> {
  const activeBoxes = await packageDeliveryService.getActiveWeeklyBoxes();

  if (activeBoxes.length === 0) {
    return { processed: 0 };
  }

  logger.info('Processing Weekly Box generation', { count: activeBoxes.length });

  let processed = 0;

  for (const box of activeBoxes) {
    try {
      // Mark as generating before queueing the next weekly cycle.
      await prisma.packagePurchase.update({
        where: { id: box.id },
        data: { status: 'GENERATING' },
      });

      // Queue generation
      await addPackageGenerationJob({
        purchaseId: box.id,
        teacherId: box.teacherId,
        tier: 'WEEKLY_BOX',
      });

      processed++;
      logger.info('Weekly Box generation queued', {
        purchaseId: box.id,
      });
    } catch (error) {
      logger.error('Failed to process Weekly Box', {
        purchaseId: box.id,
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  return { processed };
}
