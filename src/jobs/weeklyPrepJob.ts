/**
 * Weekly Prep Job Queue
 * Handles async generation of full-week material packages
 * Two phases: (1) Generate plan  (2) Generate all materials sequentially
 */

import { Queue, Worker, Job } from 'bullmq';
import { createBullConnection } from '../config/redis.js';
import { logger } from '../utils/logger.js';
import { prisma } from '../config/database.js';
import { weeklyPrepService } from '../services/teacher/weeklyPrepService.js';
import { weeklyPrepAudioService } from '../services/teacher/weeklyPrepAudioService.js';
import { emailService } from '../services/email/emailService.js';
import { config } from '../config/index.js';
import { WeeklyPrepStatus } from '@prisma/client';

const QUEUE_NAME = 'weekly-prep';

// Job data interface
export interface WeeklyPrepJobData {
  prepId: string;
  teacherId: string;
  triggeredBy: 'manual' | 'scheduled' | 'chat';
}

// Job result interface
interface WeeklyPrepJobResult {
  success: boolean;
  prepId: string;
  materialsGenerated?: number;
  error?: string;
}

let weeklyPrepQueue: Queue<WeeklyPrepJobData, WeeklyPrepJobResult> | null = null;
let weeklyPrepWorker: Worker<WeeklyPrepJobData, WeeklyPrepJobResult> | null = null;

export function isWeeklyPrepJobInitialized(): boolean {
  return Boolean(weeklyPrepQueue && weeklyPrepWorker);
}

/**
 * Initialize the weekly prep job queue
 */
export async function initializeWeeklyPrepJob(): Promise<void> {
  try {
    const connection = createBullConnection();

    // Create the queue
    weeklyPrepQueue = new Queue<WeeklyPrepJobData, WeeklyPrepJobResult>(QUEUE_NAME, {
      connection,
      defaultJobOptions: {
        removeOnComplete: 50,
        removeOnFail: 100,
        attempts: 2,
        backoff: {
          type: 'exponential',
          delay: 30000, // 30 seconds initial delay
        },
      },
    });

    // Create the worker — concurrency 1 to avoid overloading Gemini
    weeklyPrepWorker = new Worker<WeeklyPrepJobData, WeeklyPrepJobResult>(
      QUEUE_NAME,
      async (job: Job<WeeklyPrepJobData, WeeklyPrepJobResult>) => {
        return processWeeklyPrepJob(job);
      },
      {
        connection: createBullConnection(),
        concurrency: 1,
      }
    );

    // Handle worker events
    weeklyPrepWorker.on('completed', async (job, result) => {
      logger.info('Weekly prep job completed', {
        jobId: job?.id,
        prepId: result?.prepId,
        materialsGenerated: result?.materialsGenerated,
      });

      // Send digest email notification
      if (result?.prepId && result?.success) {
        try {
          await sendPrepReadyEmail(result.prepId);
        } catch (emailErr) {
          logger.error('Failed to send weekly prep digest email', { prepId: result.prepId, error: emailErr });
        }
      }
    });

    weeklyPrepWorker.on('failed', async (job, err) => {
      logger.error('Weekly prep job failed', {
        jobId: job?.id,
        prepId: job?.data?.prepId,
        error: err.message,
      });

      // Mark prep as FAILED on final attempt
      if (job?.data?.prepId) {
        const attempts = job?.opts?.attempts ?? 1;
        const attemptsMade = job?.attemptsMade ?? 0;
        const isFinalAttempt = attemptsMade >= attempts;

        if (isFinalAttempt) {
          await prisma.agentWeeklyPrep.update({
            where: { id: job.data.prepId },
            data: { status: WeeklyPrepStatus.FAILED },
          });
        }
      }
    });

    logger.info('Weekly prep job queue initialized');
  } catch (error) {
    logger.error('Failed to initialize weekly prep job queue', { error });
    // Let the caller decide whether to continue running the server without the queue.
    throw error;
  }
}

/**
 * Process a weekly prep job: plan → materials
 */
async function processWeeklyPrepJob(
  job: Job<WeeklyPrepJobData, WeeklyPrepJobResult>
): Promise<WeeklyPrepJobResult> {
  const { prepId, teacherId } = job.data;

  logger.info('Processing weekly prep job', { prepId, teacherId });

  try {
    // Phase 1: Generate the weekly plan
    await job.updateProgress(10);
    await weeklyPrepService.generateWeeklyPlan(prepId);
    await job.updateProgress(30);

    // Phase 2: Generate all materials
    await weeklyPrepService.generateMaterials(prepId);
    await job.updateProgress(90);

    // Phase 3: Generate audio class update (non-fatal)
    try {
      await weeklyPrepAudioService.generateAudioFromWeeklyPrep(prepId);
    } catch (audioErr) {
      logger.warn('Audio generation from weekly prep failed (non-fatal)', {
        prepId,
        error: audioErr instanceof Error ? audioErr.message : 'Unknown error',
      });
    }
    await job.updateProgress(100);

    // Get final count
    const prep = await prisma.agentWeeklyPrep.findUnique({
      where: { id: prepId },
      select: { generatedCount: true },
    });

    return {
      success: true,
      prepId,
      materialsGenerated: prep?.generatedCount || 0,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Weekly prep job processing failed', { prepId, error: errorMessage });
    throw new Error(errorMessage);
  }
}

/**
 * Send digest email after prep generation completes
 */
async function sendPrepReadyEmail(prepId: string): Promise<void> {
  const prep = await prisma.agentWeeklyPrep.findUnique({
    where: { id: prepId },
    include: {
      agent: {
        include: {
          teacher: { select: { email: true, firstName: true, lastName: true } },
        },
      },
      materials: { select: { dayOfWeek: true } },
    },
  });

  if (!prep || !prep.agent?.teacher) return;

  const teacher = prep.agent.teacher;
  const teacherName = [teacher.firstName, teacher.lastName].filter(Boolean).join(' ') || 'Teacher';

  // Build day breakdown (0=Mon..4=Fri)
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const dayBreakdown: Record<string, number> = {};
  for (const mat of prep.materials) {
    const dayName = dayNames[mat.dayOfWeek] || `Day ${mat.dayOfWeek + 1}`;
    dayBreakdown[dayName] = (dayBreakdown[dayName] || 0) + 1;
  }

  const reviewUrl = `${config.frontendUrl}/en/teacher/agent/weekly-prep/${prepId}`;

  await emailService.sendWeeklyPrepDigestEmail(
    teacher.email,
    teacherName,
    prep.weekLabel,
    prep.materials.length,
    dayBreakdown,
    reviewUrl
  );
}

/**
 * Add a weekly prep job to the queue
 */
export async function queueWeeklyPrep(data: WeeklyPrepJobData): Promise<string> {
  if (!weeklyPrepQueue) {
    throw new Error('Weekly prep queue not initialized');
  }

  const job = await weeklyPrepQueue.add(`prep-${data.prepId}`, data, {
    jobId: `prep-${data.prepId}`,
  });

  logger.info('Weekly prep job queued', { jobId: job.id, prepId: data.prepId });

  return job.id || data.prepId;
}

/**
 * Get queue status for monitoring
 */
export async function getWeeklyPrepQueueStatus(): Promise<{
  waiting: number;
  active: number;
  completed: number;
  failed: number;
}> {
  if (!weeklyPrepQueue) {
    return { waiting: 0, active: 0, completed: 0, failed: 0 };
  }

  const counts = await weeklyPrepQueue.getJobCounts();
  return {
    waiting: counts.waiting,
    active: counts.active,
    completed: counts.completed,
    failed: counts.failed,
  };
}

/**
 * Shutdown the weekly prep job queue
 */
export async function shutdownWeeklyPrepJob(): Promise<void> {
  try {
    if (weeklyPrepWorker) {
      await weeklyPrepWorker.close();
      weeklyPrepWorker = null;
    }

    if (weeklyPrepQueue) {
      await weeklyPrepQueue.close();
      weeklyPrepQueue = null;
    }

    logger.info('Weekly prep job queue shutdown complete');
  } catch (error) {
    logger.error('Error shutting down weekly prep job queue', { error });
  }
}
