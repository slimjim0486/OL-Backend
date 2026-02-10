/**
 * LTI Grade Sync Job Queue
 * Handles async grade passback to LMS via AGS (Assignment and Grade Services)
 */

import { Queue, Worker, Job } from 'bullmq';
import { createBullConnection } from '../config/redis.js';
import { logger } from '../utils/logger.js';
import { prisma } from '../config/database.js';
import { ltiService } from '../services/enterprise/ltiService.js';

const QUEUE_NAME = 'lti-grade-sync';

export interface LtiGradeSyncJobData {
  submissionId: string;
  resourceLinkId: string;
  platformId: string;
  lmsUserId: string;
  scoreGiven: number;
  scoreMaximum: number;
  activityProgress: string;
  gradingProgress: string;
  comment?: string;
}

interface LtiGradeSyncJobResult {
  success: boolean;
  submissionId: string;
  error?: string;
}

let gradeSyncQueue: Queue<LtiGradeSyncJobData, LtiGradeSyncJobResult> | null = null;
let gradeSyncWorker: Worker<LtiGradeSyncJobData, LtiGradeSyncJobResult> | null = null;

/**
 * Initialize the LTI grade sync job queue
 */
export async function initializeLtiGradeSyncJob(): Promise<void> {
  try {
    const connection = createBullConnection();

    gradeSyncQueue = new Queue<LtiGradeSyncJobData, LtiGradeSyncJobResult>(QUEUE_NAME, {
      connection,
      defaultJobOptions: {
        removeOnComplete: 50,
        removeOnFail: 100,
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 30000, // 30 seconds initial delay
        },
      },
    });

    gradeSyncWorker = new Worker<LtiGradeSyncJobData, LtiGradeSyncJobResult>(
      QUEUE_NAME,
      async (job: Job<LtiGradeSyncJobData, LtiGradeSyncJobResult>) => {
        return processGradeSyncJob(job);
      },
      {
        connection: createBullConnection(),
        concurrency: 3,
      }
    );

    gradeSyncWorker.on('completed', async (job, result) => {
      logger.info('LTI grade sync completed', {
        jobId: job?.id,
        submissionId: result?.submissionId,
      });
    });

    gradeSyncWorker.on('failed', async (job, err) => {
      logger.error('LTI grade sync failed', {
        jobId: job?.id,
        submissionId: job?.data?.submissionId,
        error: err.message,
      });

      // Update submission with error only on final attempt
      if (job?.data?.submissionId) {
        const attempts = job?.opts?.attempts ?? 1;
        const attemptsMade = job?.attemptsMade ?? 0;
        const isFinalAttempt = attemptsMade >= attempts;

        if (isFinalAttempt) {
          await prisma.ltiGradeSubmission.update({
            where: { id: job.data.submissionId },
            data: { syncError: err.message },
          });
        }
      }
    });

    logger.info('LTI grade sync job queue initialized');
  } catch (error) {
    logger.error('Failed to initialize LTI grade sync job queue', { error });
  }
}

/**
 * Process a grade sync job
 */
async function processGradeSyncJob(
  job: Job<LtiGradeSyncJobData, LtiGradeSyncJobResult>
): Promise<LtiGradeSyncJobResult> {
  const {
    submissionId,
    resourceLinkId,
    lmsUserId,
    scoreGiven,
    scoreMaximum,
    activityProgress,
    gradingProgress,
    comment,
  } = job.data;

  logger.info('Processing LTI grade sync', { submissionId, resourceLinkId });

  try {
    await ltiService.postScore(resourceLinkId, lmsUserId, {
      scoreGiven,
      scoreMaximum,
      activityProgress,
      gradingProgress,
      comment,
    });

    // Update submission as synced
    await prisma.ltiGradeSubmission.update({
      where: { id: submissionId },
      data: {
        syncedAt: new Date(),
        syncError: null,
      },
    });

    return { success: true, submissionId };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('LTI grade sync job failed', { submissionId, error: errorMessage });
    throw new Error(errorMessage);
  }
}

/**
 * Add a grade sync job to the queue
 */
export async function queueLtiGradeSync(data: LtiGradeSyncJobData): Promise<string> {
  if (!gradeSyncQueue) {
    throw new Error('LTI grade sync queue not initialized');
  }

  const job = await gradeSyncQueue.add('grade-sync', data, {
    jobId: `lti-grade-${data.submissionId}`,
  });

  logger.info('LTI grade sync job queued', { jobId: job.id, submissionId: data.submissionId });
  return job.id || data.submissionId;
}

/**
 * Shutdown the grade sync job queue
 */
export async function shutdownLtiGradeSyncJob(): Promise<void> {
  try {
    if (gradeSyncWorker) {
      await gradeSyncWorker.close();
      gradeSyncWorker = null;
    }

    if (gradeSyncQueue) {
      await gradeSyncQueue.close();
      gradeSyncQueue = null;
    }

    logger.info('LTI grade sync job queue shutdown complete');
  } catch (error) {
    logger.error('Error shutting down LTI grade sync job queue', { error });
  }
}
