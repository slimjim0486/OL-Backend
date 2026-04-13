/**
 * Unapproved Material Cleanup Job
 * Daily cron at 3 AM UTC — deletes generated materials that haven't been
 * approved, edited, or used within 2 days.
 */
import { materialService } from '../services/teacher/materialService.js';
import { logger } from '../utils/logger.js';

let intervalId: NodeJS.Timeout | null = null;
let lastRunDate: string | null = null;

async function runCleanup(): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  if (lastRunDate === today) return;

  logger.info('Starting unapproved material cleanup');
  lastRunDate = today;

  try {
    const result = await materialService.cleanupUnapprovedMaterials();
    logger.info('Unapproved material cleanup complete', result);
  } catch (error) {
    logger.error('Unapproved material cleanup failed', { error });
  }
}

export function scheduleUnapprovedMaterialCleanupJob(): void {
  intervalId = setInterval(async () => {
    const now = new Date();
    if (now.getUTCHours() === 3) {
      await runCleanup();
    }
  }, 60 * 60 * 1000);

  logger.info('Unapproved material cleanup job scheduled');
}

export function shutdownUnapprovedMaterialCleanupJob(): void {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
