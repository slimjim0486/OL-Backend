/**
 * Package Generation Job Queue
 * Handles async generation of DTC package content.
 * Phases: (1) Plan package  (2) Generate materials  (3) Post-processing
 */

import { Queue, Worker, Job } from 'bullmq';
import { createBullConnection } from '../config/redis.js';
import { logger } from '../utils/logger.js';
import { prisma } from '../config/database.js';
import { packageGenerationService } from '../services/teacher/packageGenerationService.js';
import { PackageTier } from '@prisma/client';

const QUEUE_NAME = 'package-generation';

// Job data interface
export interface PackageGenerationJobData {
  purchaseId: string;
  teacherId: string;
  tier: PackageTier;
  regenerateMaterialId?: string; // If set, only regenerate this material
}

// Job result interface
interface PackageGenerationJobResult {
  success: boolean;
  purchaseId: string;
  materialsGenerated?: number;
  error?: string;
}

let packageGenerationQueue: Queue<PackageGenerationJobData, PackageGenerationJobResult> | null = null;
let packageGenerationWorker: Worker<PackageGenerationJobData, PackageGenerationJobResult> | null = null;

export function isPackageGenerationJobInitialized(): boolean {
  return Boolean(packageGenerationQueue && packageGenerationWorker);
}

/**
 * Initialize the package generation job queue
 */
export async function initializePackageGenerationJob(): Promise<void> {
  try {
    const connection = createBullConnection();

    packageGenerationQueue = new Queue<PackageGenerationJobData, PackageGenerationJobResult>(QUEUE_NAME, {
      connection,
      defaultJobOptions: {
        removeOnComplete: 50,
        removeOnFail: 100,
        attempts: 2,
        backoff: {
          type: 'exponential',
          delay: 60000, // 1 minute initial delay (packages are larger)
        },
      },
    });

    // Concurrency 1 — avoid Gemini overload
    packageGenerationWorker = new Worker<PackageGenerationJobData, PackageGenerationJobResult>(
      QUEUE_NAME,
      async (job: Job<PackageGenerationJobData, PackageGenerationJobResult>) => {
        return processPackageGenerationJob(job);
      },
      {
        connection: createBullConnection(),
        concurrency: 1,
      }
    );

    packageGenerationWorker.on('completed', async (job, result) => {
      logger.info('Package generation job completed', {
        jobId: job?.id,
        purchaseId: result?.purchaseId,
        materialsGenerated: result?.materialsGenerated,
      });
    });

    packageGenerationWorker.on('failed', async (job, err) => {
      logger.error('Package generation job failed', {
        jobId: job?.id,
        purchaseId: job?.data?.purchaseId,
        error: err.message,
      });

      if (job?.data?.purchaseId) {
        const attempts = job?.opts?.attempts ?? 1;
        const attemptsMade = job?.attemptsMade ?? 0;
        if (attemptsMade >= attempts) {
          await prisma.packagePurchase.update({
            where: { id: job.data.purchaseId },
            data: { status: 'FAILED' },
          });
        }
      }
    });

    logger.info('Package generation job queue initialized');
  } catch (error) {
    logger.error('Failed to initialize package generation job queue', { error });
    throw error;
  }
}

/**
 * Process a package generation job
 */
async function processPackageGenerationJob(
  job: Job<PackageGenerationJobData, PackageGenerationJobResult>
): Promise<PackageGenerationJobResult> {
  const { purchaseId, teacherId, regenerateMaterialId } = job.data;

  logger.info('Processing package generation job', { purchaseId, teacherId, regenerateMaterialId });

  try {
    // Handle single material regeneration
    if (regenerateMaterialId) {
      await packageGenerationService.regenerateSingleMaterial(regenerateMaterialId, teacherId);
      await job.updateProgress(100);
      return { success: true, purchaseId, materialsGenerated: 1 };
    }

    // Full package planning (creates records, skips bulk generation)
    await job.updateProgress(5);
    await packageGenerationService.generatePackage(purchaseId);
    await job.updateProgress(100);

    const purchase = await prisma.packagePurchase.findUnique({
      where: { id: purchaseId },
      select: { generatedCount: true },
    });

    return {
      success: true,
      purchaseId,
      materialsGenerated: purchase?.generatedCount || 0,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Package generation job failed', { purchaseId, error: errorMessage });
    throw new Error(errorMessage);
  }
}

/**
 * Add a package generation job to the queue
 */
export async function addPackageGenerationJob(data: PackageGenerationJobData): Promise<string | undefined> {
  if (!packageGenerationQueue) {
    logger.warn('Package generation queue not initialized, attempting initialization');
    await initializePackageGenerationJob();
  }

  if (!packageGenerationQueue) {
    throw new Error('Package generation queue is not available');
  }

  // Priority queue for Founding Teacher tier
  const priority = data.tier === 'FOUNDING_TEACHER' ? 1 : 5;
  const uniqueSuffix = Date.now();
  const jobId = data.regenerateMaterialId
    ? `regen-${data.regenerateMaterialId}-${uniqueSuffix}`
    : data.tier === 'WEEKLY_BOX'
      ? `pkg-${data.purchaseId}-${uniqueSuffix}`
      : `pkg-${data.purchaseId}`;

  const job = await packageGenerationQueue.add('generate', data, {
    priority,
    jobId,
  });

  logger.info('Package generation job queued', {
    jobId: job.id,
    purchaseId: data.purchaseId,
    priority,
  });

  return job.id;
}
