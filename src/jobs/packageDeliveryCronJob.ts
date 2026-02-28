/**
 * Package Delivery Cron Job
 * Runs every 30 minutes to check for packages needing progressive delivery.
 * For each package where nextDeliveryDate <= now(), generates the next week.
 */

import { Queue, Worker, Job } from 'bullmq';
import { createBullConnection } from '../config/redis.js';
import { logger } from '../utils/logger.js';
import { packageDeliveryService } from '../services/teacher/packageDeliveryService.js';
import { packageGenerationService } from '../services/teacher/packageGenerationService.js';
import { emailService } from '../services/email/emailService.js';
import { prisma } from '../config/database.js';

const QUEUE_NAME = 'package-delivery-cron';
const CRON_SCHEDULE = '*/30 * * * *'; // Every 30 minutes

let deliveryQueue: Queue | null = null;
let deliveryWorker: Worker | null = null;

export async function initializePackageDeliveryCron(): Promise<void> {
  try {
    const connection = createBullConnection();

    deliveryQueue = new Queue(QUEUE_NAME, {
      connection,
      defaultJobOptions: {
        removeOnComplete: 10,
        removeOnFail: 20,
      },
    });

    // Add repeating job
    await deliveryQueue.add('check-deliveries', {}, {
      repeat: { pattern: CRON_SCHEDULE },
      jobId: 'package-delivery-check',
    });

    deliveryWorker = new Worker(
      QUEUE_NAME,
      async (job: Job) => {
        return processDeliveryCheck(job);
      },
      {
        connection: createBullConnection(),
        concurrency: 1,
      }
    );

    deliveryWorker.on('completed', (job, result) => {
      if (result?.processed > 0) {
        logger.info('Package delivery cron completed', { processed: result.processed });
      }
    });

    deliveryWorker.on('failed', (job, err) => {
      logger.error('Package delivery cron failed', { error: err.message });
    });

    logger.info('Package delivery cron job initialized');
  } catch (error) {
    logger.error('Failed to initialize package delivery cron', { error });
  }
}

async function processDeliveryCheck(job: Job): Promise<{ processed: number }> {
  const packagesNeedingDelivery = await packageDeliveryService.getPackagesNeedingDelivery();

  if (packagesNeedingDelivery.length === 0) {
    return { processed: 0 };
  }

  logger.info('Processing progressive deliveries', { count: packagesNeedingDelivery.length });

  let processed = 0;
  for (const pkg of packagesNeedingDelivery) {
    try {
      await packageGenerationService.deliverNextWeek(pkg.id);
      processed++;

      // Send email notification
      try {
        const purchase = await prisma.packagePurchase.findUnique({
          where: { id: pkg.id },
          include: { teacher: { select: { email: true, firstName: true } } },
        });
        if (purchase?.teacher?.email) {
          logger.info('Package week delivered, email notification pending', {
            purchaseId: pkg.id,
            teacherEmail: purchase.teacher.email,
          });
          // Email sending can be added here when template is ready
        }
      } catch (emailErr) {
        logger.warn('Failed to send delivery notification', { purchaseId: pkg.id, error: emailErr });
      }
    } catch (error) {
      logger.error('Failed to deliver package week', {
        purchaseId: pkg.id,
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  return { processed };
}
