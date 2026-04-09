/**
 * Notification Cleanup Job
 * Daily cron at 2 AM UTC — expires old whispers, deletes old dismissed notifications.
 */
import { notificationService } from '../services/teacher/notificationService.js';
import { logger } from '../utils/logger.js';

let intervalId: NodeJS.Timeout | null = null;
let lastRunDate: string | null = null;

async function runCleanup(): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  if (lastRunDate === today) return;

  logger.info('Starting notification cleanup');
  lastRunDate = today;

  try {
    const result = await notificationService.cleanup();
    logger.info('Notification cleanup complete', result);
  } catch (error) {
    logger.error('Notification cleanup failed', { error });
  }
}

export function scheduleNotificationCleanupJob(): void {
  intervalId = setInterval(async () => {
    const now = new Date();
    if (now.getUTCHours() === 2) {
      await runCleanup();
    }
  }, 60 * 60 * 1000);

  logger.info('Notification cleanup job scheduled');
}

export function shutdownNotificationCleanupJob(): void {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
