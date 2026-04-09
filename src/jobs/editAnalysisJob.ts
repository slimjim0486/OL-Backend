/**
 * Edit Analysis Job Queue — Teacher Intelligence Platform (Phase 4.9)
 *
 * Every MaterialEdit row is queued for async analysis by Gemini Flash. The
 * extracted signals are stored back on the edit row, and every 5th edit
 * triggers an aggregation pass that rebuilds the teacher's learned
 * preferences (tendencies, patterns, per-type prefs) and fires an Ollie
 * whisper when the confidence threshold is hit.
 *
 * Non-fatal on failure — a Gemini error marks the edit analyzed with empty
 * signals rather than retrying forever.
 */
import { Queue, Worker, Job } from 'bullmq';
import { createBullConnection } from '../config/redis.js';
import { logger } from '../utils/logger.js';
import { prisma } from '../config/database.js';
import { editAnalysisService } from '../services/teacher/editAnalysisService.js';
import { preferenceAnalysisService } from '../services/teacher/preferenceAnalysisService.js';
import { sseService } from '../services/teacher/sseService.js';

const QUEUE_NAME = 'edit-analyze';

/** Re-run preference aggregation every N edits. */
const AGGREGATION_INTERVAL = 5;

export interface EditAnalysisJobData {
  editId: string;
  teacherId: string;
}

interface EditAnalysisJobResult {
  success: boolean;
  editId: string;
  aggregated: boolean;
  whisperFired: boolean;
  error?: string;
}

let analysisQueue: Queue<EditAnalysisJobData, EditAnalysisJobResult> | null = null;
let analysisWorker: Worker<EditAnalysisJobData, EditAnalysisJobResult> | null = null;

export async function initializeEditAnalysisJob(): Promise<void> {
  try {
    const connection = createBullConnection();

    analysisQueue = new Queue<EditAnalysisJobData, EditAnalysisJobResult>(
      QUEUE_NAME,
      {
        connection,
        defaultJobOptions: {
          removeOnComplete: 100,
          removeOnFail: 200,
          attempts: 2,
          backoff: {
            type: 'exponential',
            delay: 15000,
          },
        },
      }
    );

    analysisWorker = new Worker<EditAnalysisJobData, EditAnalysisJobResult>(
      QUEUE_NAME,
      async (job: Job<EditAnalysisJobData, EditAnalysisJobResult>) => {
        return processEditAnalysisJob(job);
      },
      {
        connection: createBullConnection(),
        // Concurrency 3 — Gemini Flash handles this easily, and edits may
        // come in bursts as a teacher rapidly iterates on a material.
        concurrency: 3,
        lockDuration: 60000,
        lockRenewTime: 15000,
      }
    );

    analysisWorker.on('completed', (job, result) => {
      logger.info('Edit analysis job completed', {
        jobId: job?.id,
        editId: result?.editId,
        aggregated: result?.aggregated,
        whisperFired: result?.whisperFired,
      });
    });

    analysisWorker.on('failed', (job, err) => {
      logger.error('Edit analysis job failed', {
        jobId: job?.id,
        editId: job?.data?.editId,
        error: err.message,
      });
    });

    logger.info('Edit analysis job queue initialized');
  } catch (error) {
    logger.error('Failed to initialize edit analysis job queue', { error });
  }
}

async function processEditAnalysisJob(
  job: Job<EditAnalysisJobData, EditAnalysisJobResult>
): Promise<EditAnalysisJobResult> {
  const { editId, teacherId } = job.data;

  try {
    // 1. Gemini analyzes the edit and writes extractedSignals
    await editAnalysisService.analyzeEdit(editId);

    // 2. Decide whether to re-aggregate preferences. Doing it on every edit
    // would be wasteful at scale; every 5th edit is frequent enough for
    // learning to feel responsive without hammering the DB.
    const totalAnalyzed = await prisma.materialEdit.count({
      where: { teacherId, analyzed: true },
    });

    let aggregated = false;
    let whisperFired = false;

    if (totalAnalyzed % AGGREGATION_INTERVAL === 0 && totalAnalyzed > 0) {
      const result = await preferenceAnalysisService.updatePreferencesFromEdits(
        teacherId
      );
      aggregated = true;

      logger.info('Edit aggregation complete', {
        teacherId,
        totalAnalyzed,
        ...result,
      });

      // 3. Maybe fire the "I've learned your preferences" whisper
      const whisperSummary =
        await preferenceAnalysisService.maybeWhisperLearnedPreferences(teacherId);

      if (whisperSummary) {
        whisperFired = true;

        // Create a PREFERENCE_LEARNED nudge so the stream surfaces it
        await prisma.teacherNudge.create({
          data: {
            teacherId,
            type: 'PREFERENCE_LEARNED',
            content: whisperSummary,
            priority: 10,
            actionContext: {
              actionType: 'view_preferences',
            } as any,
            // 14-day expiry matches the 14-day re-notify cooldown
            expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          },
        });

        // SSE event so the frontend can pop the whisper immediately
        sseService.sendEvent(teacherId, {
          type: 'nudge-available',
          data: {
            nudgeType: 'PREFERENCE_LEARNED',
            summary: whisperSummary,
          },
        });
      }
    }

    return {
      success: true,
      editId,
      aggregated,
      whisperFired,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Edit analysis processing failed', {
      editId,
      teacherId,
      error: errorMessage,
    });
    return {
      success: false,
      editId,
      aggregated: false,
      whisperFired: false,
      error: errorMessage,
    };
  }
}

/**
 * Queue an edit for async Gemini analysis. Called from the edits route
 * immediately after recordEdit() succeeds.
 */
export async function queueEditAnalysis(
  data: EditAnalysisJobData
): Promise<string> {
  if (!analysisQueue) {
    throw new Error('Edit analysis queue not initialized');
  }

  const job = await analysisQueue.add('analyze-edit', data, {
    jobId: `edit-${data.editId}-${Date.now()}`,
  });

  logger.info('Edit analysis job queued', {
    jobId: job.id,
    editId: data.editId,
    teacherId: data.teacherId,
  });

  return job.id || data.editId;
}

export async function getEditAnalysisQueueStatus(): Promise<{
  name: string;
  waiting: number;
  active: number;
  completed: number;
  failed: number;
}> {
  if (!analysisQueue) {
    return { name: QUEUE_NAME, waiting: 0, active: 0, completed: 0, failed: 0 };
  }
  const [waiting, active, completed, failed] = await Promise.all([
    analysisQueue.getWaitingCount(),
    analysisQueue.getActiveCount(),
    analysisQueue.getCompletedCount(),
    analysisQueue.getFailedCount(),
  ]);
  return { name: QUEUE_NAME, waiting, active, completed, failed };
}

export async function shutdownEditAnalysisJob(): Promise<void> {
  if (analysisWorker) await analysisWorker.close();
  if (analysisQueue) await analysisQueue.close();
  logger.info('Edit analysis job queue shut down');
}
