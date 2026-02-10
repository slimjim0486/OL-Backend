/**
 * Edit Analysis Job Queue
 * Handles background analysis of teacher edits to detect preference patterns.
 * Uses Gemini Flash for lightweight classification of edit diffs.
 */

import { Queue, Worker, Job } from 'bullmq';
import { createBullConnection } from '../config/redis.js';
import { logger } from '../utils/logger.js';
import { teacherPreferenceService } from '../services/enterprise/teacherPreferenceService.js';

const QUEUE_NAME = 'edit-analysis';

export interface EditAnalysisJobData {
  editLogId: string;
  teacherId: string;
}

interface EditAnalysisJobResult {
  success: boolean;
  editLogId: string;
  patterns: string[];
}

let editAnalysisQueue: Queue<EditAnalysisJobData, EditAnalysisJobResult> | null = null;
let editAnalysisWorker: Worker<EditAnalysisJobData, EditAnalysisJobResult> | null = null;

/**
 * Initialize the edit analysis job queue.
 */
export async function initializeEditAnalysisJob(): Promise<void> {
  try {
    const connection = createBullConnection();

    editAnalysisQueue = new Queue<EditAnalysisJobData, EditAnalysisJobResult>(QUEUE_NAME, {
      connection,
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 200,
        attempts: 1,
        backoff: {
          type: 'fixed',
          delay: 15000, // 15 seconds
        },
      },
    });

    // Concurrency 2 — lightweight Gemini Flash calls
    editAnalysisWorker = new Worker<EditAnalysisJobData, EditAnalysisJobResult>(
      QUEUE_NAME,
      async (job: Job<EditAnalysisJobData, EditAnalysisJobResult>) => {
        const { editLogId, teacherId } = job.data;

        logger.info('Processing edit analysis job', { editLogId, teacherId });

        const patterns = await teacherPreferenceService.analyzeEdit(editLogId);

        return {
          success: true,
          editLogId,
          patterns,
        };
      },
      {
        connection: createBullConnection(),
        concurrency: 2,
      }
    );

    editAnalysisWorker.on('completed', (job, result) => {
      if (result?.patterns.length) {
        logger.info('Edit analysis completed', {
          jobId: job?.id,
          editLogId: result.editLogId,
          patterns: result.patterns,
        });
      }
    });

    editAnalysisWorker.on('failed', (job, err) => {
      logger.warn('Edit analysis job failed', {
        jobId: job?.id,
        editLogId: job?.data?.editLogId,
        error: err.message,
      });
    });

    logger.info('Edit analysis job queue initialized');
  } catch (error) {
    logger.error('Failed to initialize edit analysis job queue', { error });
  }
}

/**
 * Queue an edit for background pattern analysis.
 */
export async function queueEditAnalysisJob(data: EditAnalysisJobData): Promise<string | null> {
  if (!editAnalysisQueue) {
    logger.warn('Edit analysis queue not initialized, skipping');
    return null;
  }

  const job = await editAnalysisQueue.add('analyze-edit', data, {
    jobId: `edit-analysis-${data.editLogId}`,
  });

  return job.id || null;
}

/**
 * Shutdown the edit analysis job queue.
 */
export async function shutdownEditAnalysisJob(): Promise<void> {
  try {
    if (editAnalysisWorker) {
      await editAnalysisWorker.close();
      editAnalysisWorker = null;
    }

    if (editAnalysisQueue) {
      await editAnalysisQueue.close();
      editAnalysisQueue = null;
    }

    logger.info('Edit analysis job queue shutdown complete');
  } catch (error) {
    logger.error('Error shutting down edit analysis job queue', { error });
  }
}
