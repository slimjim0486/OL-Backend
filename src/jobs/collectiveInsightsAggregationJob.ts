/**
 * Collective Insights Aggregation Job
 *
 * Weekly cron that aggregates cross-teacher stream signals into the
 * CollectiveInsight table. Runs every Sunday at 7 AM UTC (after the daily
 * 6 AM nudge generation has finished the previous day's cycle, so we don't
 * compete for Prisma connections).
 *
 * Follows the setInterval-check-the-clock pattern used by
 * nudgeGenerationJob and monthlyReviewJob — no BullMQ queue needed because
 * this is a singleton aggregation that runs on one server.
 *
 * Idempotent: re-running within the same day is a no-op (guarded by
 * lastRunDate). The underlying service is also idempotent via upserts.
 */
import { collectiveInsightService } from '../services/teacher/collectiveInsightService.js';
import { logger } from '../utils/logger.js';

let intervalId: NodeJS.Timeout | null = null;
let lastRunDate: string | null = null;

/** Day-of-week for the scheduled run. 0=Sun, 1=Mon, ... 6=Sat. */
const SCHEDULED_DAY_OF_WEEK = 0; // Sunday
/** UTC hour for the scheduled run. */
const SCHEDULED_HOUR_UTC = 7;

async function runCollectiveInsightsAggregation(): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);
  if (lastRunDate === today) return; // Already ran today
  lastRunDate = today;

  logger.info('Starting weekly collective insights aggregation');

  try {
    const summary = await collectiveInsightService.aggregateAllInsights();
    logger.info('Weekly collective insights aggregation finished', summary);
  } catch (error) {
    logger.error('Collective insights aggregation job failed', { error });
  }
}

export function scheduleCollectiveInsightsAggregationJob(): void {
  // Check every hour
  intervalId = setInterval(async () => {
    const now = new Date();
    if (
      now.getUTCDay() === SCHEDULED_DAY_OF_WEEK &&
      now.getUTCHours() === SCHEDULED_HOUR_UTC
    ) {
      await runCollectiveInsightsAggregation();
    }
  }, 60 * 60 * 1000);

  logger.info('Collective insights aggregation job scheduled', {
    dayOfWeek: SCHEDULED_DAY_OF_WEEK,
    hourUtc: SCHEDULED_HOUR_UTC,
  });
}

/**
 * Manual trigger — used by ops scripts or the CLI to force aggregation
 * outside of the cron window. Resets the daily guard first.
 */
export async function triggerCollectiveInsightsAggregation(): Promise<void> {
  lastRunDate = null;
  await runCollectiveInsightsAggregation();
}

export function shutdownCollectiveInsightsAggregationJob(): void {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    logger.info('Collective insights aggregation job shutdown');
  }
}
