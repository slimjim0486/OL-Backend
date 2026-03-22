import { Job, Queue, Worker } from 'bullmq';
import { createBullConnection } from '../config/redis.js';
import { logger } from '../utils/logger.js';
import { contentDripService } from '../services/teacher/contentDripService.js';

const QUEUE_NAME = 'content-drip';

export interface ContentDripJobData {
  enrollmentId: string;
  teacherId: string;
  step: number;
}

interface ContentDripJobResult {
  success: boolean;
  enrollmentId: string;
  processedSteps: string[];
  skippedSteps: string[];
  error?: string;
}

let contentDripQueue: Queue<ContentDripJobData, ContentDripJobResult> | null = null;
let contentDripWorker: Worker<ContentDripJobData, ContentDripJobResult> | null = null;

export function isContentDripJobInitialized(): boolean {
  return Boolean(contentDripQueue && contentDripWorker);
}

export async function initializeContentDripJob(): Promise<void> {
  const connection = createBullConnection();

  contentDripQueue = new Queue<ContentDripJobData, ContentDripJobResult>(QUEUE_NAME, {
    connection,
    defaultJobOptions: {
      removeOnComplete: 50,
      removeOnFail: 100,
      attempts: 2,
      backoff: {
        type: 'exponential',
        delay: 60000,
      },
    },
  });

  contentDripWorker = new Worker<ContentDripJobData, ContentDripJobResult>(
    QUEUE_NAME,
    async (job: Job<ContentDripJobData, ContentDripJobResult>) => {
      return contentDripService.processStep(job.data.enrollmentId);
    },
    {
      connection: createBullConnection(),
      concurrency: 1,
    }
  );

  contentDripWorker.on('completed', (job, result) => {
    logger.info('Content drip job completed', {
      jobId: job?.id,
      enrollmentId: result?.enrollmentId,
      processedSteps: result?.processedSteps,
      skippedSteps: result?.skippedSteps,
      success: result?.success,
    });
  });

  contentDripWorker.on('failed', (job, err) => {
    logger.error('Content drip job failed unexpectedly', {
      jobId: job?.id,
      enrollmentId: job?.data?.enrollmentId,
      error: err.message,
    });
  });

  logger.info('Content drip job queue initialized');
}

export async function queueDripStep(data: ContentDripJobData): Promise<string> {
  if (!contentDripQueue) {
    throw new Error('Content drip queue not initialized');
  }

  const job = await contentDripQueue.add(`drip-${data.enrollmentId}-${data.step}`, data);

  logger.info('Content drip job queued', {
    jobId: job.id,
    enrollmentId: data.enrollmentId,
    teacherId: data.teacherId,
    step: data.step,
  });

  return job.id || data.enrollmentId;
}

export async function shutdownContentDripJob(): Promise<void> {
  try {
    if (contentDripWorker) {
      await contentDripWorker.close();
      contentDripWorker = null;
    }

    if (contentDripQueue) {
      await contentDripQueue.close();
      contentDripQueue = null;
    }

    logger.info('Content drip job queue shutdown complete');
  } catch (error) {
    logger.error('Error shutting down content drip job queue', { error });
  }
}
