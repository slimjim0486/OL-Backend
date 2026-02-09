/**
 * Teacher Batch Grading Job Queue
 * Processes GradingJob batches asynchronously (BullMQ).
 *
 * Why: Batch grading can take minutes (30-100 submissions). Running it inside
 * the web request lifecycle is fragile and can exhaust server concurrency.
 */

import { Queue, Worker, Job } from 'bullmq';
import { createBullConnection } from '../config/redis.js';
import { logger } from '../utils/logger.js';
import { prisma } from '../config/database.js';
import { gradingService } from '../services/teacher/gradingService.js';
import { CurriculumType, GradingJobStatus } from '@prisma/client';

const QUEUE_NAME = 'teacher-batch-grading';

export interface GradingBatchJobData {
  gradingJobId: string;
  curriculumType?: CurriculumType;
}

interface GradingBatchJobResult {
  success: boolean;
  gradingJobId: string;
  error?: string;
}

let gradingQueue: Queue<GradingBatchJobData, GradingBatchJobResult> | null = null;
let gradingWorker: Worker<GradingBatchJobData, GradingBatchJobResult> | null = null;

export async function initializeGradingBatchJob(): Promise<void> {
  try {
    const connection = createBullConnection();

    gradingQueue = new Queue<GradingBatchJobData, GradingBatchJobResult>(QUEUE_NAME, {
      connection,
      defaultJobOptions: {
        removeOnComplete: 50,
        removeOnFail: 100,
        attempts: 2,
        backoff: {
          type: 'exponential',
          delay: 15000,
        },
      },
    });

    gradingWorker = new Worker<GradingBatchJobData, GradingBatchJobResult>(
      QUEUE_NAME,
      async (job: Job<GradingBatchJobData, GradingBatchJobResult>) => {
        return processGradingBatch(job);
      },
      {
        connection: createBullConnection(),
        concurrency: 1, // Keep conservative to avoid rate limits/spikes
        lockDuration: 30 * 60 * 1000, // 30 min (large batches)
        lockRenewTime: 60 * 1000,
      }
    );

    gradingWorker.on('completed', (job, result) => {
      logger.info('Batch grading job completed', {
        jobId: job?.id,
        gradingJobId: result?.gradingJobId,
        success: result?.success,
      });
    });

    gradingWorker.on('failed', async (job, err) => {
      const gradingJobId = job?.data?.gradingJobId;
      logger.error('Batch grading job failed', {
        jobId: job?.id,
        gradingJobId,
        error: err.message,
      });

      // Best-effort mark job as failed if we crashed mid-processing.
      if (gradingJobId) {
        try {
          await prisma.gradingJob.update({
            where: { id: gradingJobId },
            data: {
              status: GradingJobStatus.FAILED,
              processingError: err.message,
              completedAt: new Date(),
            },
          });
        } catch (updateError) {
          logger.error('Failed to mark grading job as FAILED after worker crash', {
            gradingJobId,
            error: updateError instanceof Error ? updateError.message : 'Unknown error',
          });
        }
      }
    });

    logger.info('Batch grading job queue initialized');
  } catch (error) {
    logger.error('Failed to initialize batch grading job queue', { error });
  }
}

async function processGradingBatch(
  job: Job<GradingBatchJobData, GradingBatchJobResult>
): Promise<GradingBatchJobResult> {
  const { gradingJobId, curriculumType } = job.data;

  try {
    logger.info('Processing batch grading job', { gradingJobId, curriculumType });
    await gradingService.processBatchJob(gradingJobId, curriculumType);
    return { success: true, gradingJobId };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Batch grading processing failed', { gradingJobId, error: errorMessage });
    return { success: false, gradingJobId, error: errorMessage };
  }
}

export async function queueGradingBatchJob(data: GradingBatchJobData): Promise<string> {
  if (!gradingQueue) {
    throw new Error('Batch grading queue not initialized');
  }

  const job = await gradingQueue.add('batch-grade', data, {
    jobId: `grading-${data.gradingJobId}`,
  });

  logger.info('Batch grading queued', { jobId: job.id, gradingJobId: data.gradingJobId });
  return job.id || data.gradingJobId;
}

export async function getGradingBatchQueueStatus(): Promise<{
  waiting: number;
  active: number;
  completed: number;
  failed: number;
}> {
  if (!gradingQueue) {
    return { waiting: 0, active: 0, completed: 0, failed: 0 };
  }

  const counts = await gradingQueue.getJobCounts();
  return {
    waiting: counts.waiting,
    active: counts.active,
    completed: counts.completed,
    failed: counts.failed,
  };
}

export async function shutdownGradingBatchJob(): Promise<void> {
  try {
    if (gradingWorker) {
      await gradingWorker.close();
      gradingWorker = null;
    }

    if (gradingQueue) {
      await gradingQueue.close();
      gradingQueue = null;
    }

    logger.info('Batch grading job queue shutdown complete');
  } catch (error) {
    logger.error('Error shutting down batch grading job queue', { error });
  }
}

