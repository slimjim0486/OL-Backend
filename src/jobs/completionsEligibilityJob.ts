/**
 * Completions Eligibility Job
 * Daily cron that flips `completionsEligible` for teachers crossing the
 * 50-entry + 21-day threshold. Runs at 2 AM UTC — after streak reset,
 * before nudge generation (6 AM UTC).
 *
 * This is the ONLY writer of `completionsEligible`. The completion handler
 * reads the flag but never writes it, eliminating per-keystroke DB queries.
 */
import { completionService } from '../services/teacher/completionService.js';
import { logger } from '../utils/logger.js';

let intervalId: NodeJS.Timeout | null = null;
let lastRunDate: string | null = null;

async function runEligibilityUpdate(): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  if (lastRunDate === today) return;

  logger.info('Starting daily completions eligibility update');
  lastRunDate = today;

  try {
    const { updated } = await completionService.updateAllEligibility();
    logger.info('Completions eligibility update complete', { updated });
  } catch (error) {
    logger.error('Completions eligibility job failed', { error });
  }
}

export function scheduleCompletionsEligibilityJob(): void {
  // Check every hour, run at 2 AM UTC
  intervalId = setInterval(async () => {
    const now = new Date();
    if (now.getUTCHours() === 2) {
      await runEligibilityUpdate();
    }
  }, 60 * 60 * 1000);

  logger.info('Completions eligibility job scheduled');
}

export async function triggerCompletionsEligibility(): Promise<void> {
  lastRunDate = null;
  await runEligibilityUpdate();
}

export function shutdownCompletionsEligibilityJob(): void {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    logger.info('Completions eligibility job shutdown');
  }
}
