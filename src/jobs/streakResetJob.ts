/**
 * Streak Reset Job
 * Hourly cron that resets broken streaks for teachers whose lastActiveDate
 * is before yesterday in their timezone.
 */
import { streakService } from '../services/teacher/streakService.js';
import { logger } from '../utils/logger.js';

let intervalId: NodeJS.Timeout | null = null;

async function runStreakReset(): Promise<void> {
  logger.info('Starting hourly streak reset check');

  try {
    const resetCount = await streakService.resetBrokenStreaks();
    logger.info('Streak reset check complete', { resetCount });
  } catch (error) {
    logger.error('Streak reset job failed', { error });
  }
}

export function scheduleStreakResetJob(): void {
  // Run every hour
  intervalId = setInterval(async () => {
    await runStreakReset();
  }, 60 * 60 * 1000);

  logger.info('Streak reset job scheduled (hourly)');
}

export async function triggerStreakReset(): Promise<void> {
  await runStreakReset();
}

export function shutdownStreakResetJob(): void {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    logger.info('Streak reset job shutdown');
  }
}
