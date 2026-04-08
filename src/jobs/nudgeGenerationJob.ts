/**
 * Nudge Generation Job
 * Daily cron that generates nudges for all teachers with stream activity.
 * Runs at 6 AM UTC every day.
 */
import { prisma } from '../config/database.js';
import { nudgeService } from '../services/teacher/nudgeService.js';
import { logger } from '../utils/logger.js';

let intervalId: NodeJS.Timeout | null = null;
let lastRunDate: string | null = null;

async function runNudgeGeneration(): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  if (lastRunDate === today) return; // Already ran today

  logger.info('Starting daily nudge generation');
  lastRunDate = today;

  try {
    // Find all teachers with at least one stream entry (active intelligence users)
    const teachers = await prisma.teacherStreamEntry.findMany({
      select: { teacherId: true },
      distinct: ['teacherId'],
    });

    let generated = 0;
    let failed = 0;

    for (const { teacherId } of teachers) {
      try {
        await nudgeService.generateNudges(teacherId);
        generated++;
      } catch (error) {
        failed++;
        logger.warn('Failed to generate nudges for teacher', {
          teacherId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    logger.info('Daily nudge generation complete', { generated, failed, total: teachers.length });
  } catch (error) {
    logger.error('Nudge generation job failed', { error });
  }
}

export function scheduleNudgeGenerationJob(): void {
  // Check every hour
  intervalId = setInterval(async () => {
    const now = new Date();
    // Run at 6 AM UTC daily
    if (now.getUTCHours() === 6) {
      await runNudgeGeneration();
    }
  }, 60 * 60 * 1000);

  logger.info('Nudge generation job scheduled');
}

export async function triggerNudgeGeneration(): Promise<void> {
  lastRunDate = null; // Reset to allow re-run
  await runNudgeGeneration();
}

export function shutdownNudgeGenerationJob(): void {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    logger.info('Nudge generation job shutdown');
  }
}
