/**
 * Weekly Digest Job
 * Runs Sunday at 6 PM UTC. Sends weekly activity digest emails
 * to teachers active in the past 14 days.
 */
import { weeklyDigestService } from '../services/teacher/weeklyDigestService.js';
import { logger } from '../utils/logger.js';

let intervalId: NodeJS.Timeout | null = null;
let lastRunWeek: string | null = null;

function getWeekKey(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const startOfYear = new Date(Date.UTC(year, 0, 1));
  const weekNum = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getUTCDay() + 1) / 7);
  return `${year}-W${weekNum}`;
}

async function runWeeklyDigest(): Promise<void> {
  const weekKey = getWeekKey();
  if (lastRunWeek === weekKey) return; // Already ran this week

  logger.info('Starting weekly digest processing');
  lastRunWeek = weekKey;

  try {
    const result = await weeklyDigestService.processWeeklyDigests();
    logger.info('Weekly digest processing complete', result);
  } catch (error) {
    logger.error('Weekly digest job failed', { error });
  }
}

export function scheduleWeeklyDigestJob(): void {
  // Check every hour
  intervalId = setInterval(async () => {
    const now = new Date();
    // Run Sunday at 6 PM UTC (day 0 = Sunday, hour 18)
    if (now.getUTCDay() === 0 && now.getUTCHours() === 18) {
      await runWeeklyDigest();
    }
  }, 60 * 60 * 1000);

  logger.info('Weekly digest job scheduled (Sunday 6 PM UTC)');
}

export async function triggerWeeklyDigest(): Promise<void> {
  lastRunWeek = null; // Reset to allow re-run
  await runWeeklyDigest();
}

export function shutdownWeeklyDigestJob(): void {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    logger.info('Weekly digest job shutdown');
  }
}
