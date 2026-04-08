/**
 * Preference Update Job
 * Weekly cron that analyzes teacher behavior and updates preference profiles.
 * Runs every Sunday at midnight UTC.
 */
import { prisma } from '../config/database.js';
import { preferenceAnalysisService } from '../services/teacher/preferenceAnalysisService.js';
import { logger } from '../utils/logger.js';

let intervalId: NodeJS.Timeout | null = null;
let lastRunWeek: string | null = null;

async function runPreferenceUpdate(): Promise<void> {
  const now = new Date();
  // Only run on Sundays
  if (now.getUTCDay() !== 0) return;

  // Prevent duplicate runs in the same week
  const weekKey = `${now.getUTCFullYear()}-W${Math.ceil(now.getUTCDate() / 7)}`;
  if (lastRunWeek === weekKey) return;
  lastRunWeek = weekKey;

  logger.info('Starting weekly preference analysis');

  try {
    // Find all teachers with stream activity
    const teachers = await prisma.teacherStreamEntry.findMany({
      select: { teacherId: true },
      distinct: ['teacherId'],
    });

    let updated = 0;
    let failed = 0;

    for (const { teacherId } of teachers) {
      try {
        await preferenceAnalysisService.analyzeAndUpdatePreferences(teacherId);
        updated++;
      } catch (error) {
        failed++;
        logger.warn('Failed to update preferences for teacher', {
          teacherId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    logger.info('Weekly preference analysis complete', { updated, failed, total: teachers.length });
  } catch (error) {
    logger.error('Preference update job failed', { error });
  }
}

export function schedulePreferenceUpdateJob(): void {
  // Check every hour
  intervalId = setInterval(async () => {
    const now = new Date();
    // Run at midnight UTC on Sundays
    if (now.getUTCDay() === 0 && now.getUTCHours() === 0) {
      await runPreferenceUpdate();
    }
  }, 60 * 60 * 1000);

  logger.info('Preference update job scheduled');
}

export async function triggerPreferenceUpdate(): Promise<void> {
  await runPreferenceUpdate();
}

export function shutdownPreferenceUpdateJob(): void {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    logger.info('Preference update job shutdown');
  }
}
