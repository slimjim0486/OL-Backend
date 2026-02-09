/**
 * Monthly Review Job
 * Cron job that auto-generates monthly reviews for all active agents
 * Runs on the 1st of each month at 6 AM UTC
 */
import { prisma } from '../config/database.js';
import { reviewSummaryService } from '../services/teacher/reviewSummaryService.js';
import { logger } from '../utils/logger.js';

let intervalId: NodeJS.Timeout | null = null;

/**
 * Check if monthly reviews should be generated today (1st of month)
 * and generate them for all active agents
 */
async function runMonthlyReviews(): Promise<void> {
  const now = new Date();
  // Only run on the 1st of the month
  if (now.getDate() !== 1) {
    return;
  }

  logger.info('Starting monthly review generation');

  try {
    // Find all agents with onboarding complete
    const agents = await prisma.teacherAgent.findMany({
      where: { onboardingComplete: true },
      select: { teacherId: true, id: true },
    });

    let generated = 0;
    let failed = 0;

    for (const agent of agents) {
      try {
        await reviewSummaryService.generateMonthlyReview(agent.teacherId);
        generated++;
      } catch (error) {
        failed++;
        logger.warn('Failed to generate monthly review for teacher', {
          teacherId: agent.teacherId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    logger.info('Monthly review generation complete', { generated, failed, total: agents.length });
  } catch (error) {
    logger.error('Monthly review job failed', { error });
  }
}

/**
 * Schedule the monthly review job
 * Checks every hour if it's time to run (1st of month, 6 AM UTC)
 */
export function scheduleMonthlyReviewJob(): void {
  // Check every hour
  intervalId = setInterval(async () => {
    const now = new Date();
    // Run at 6 AM UTC on the 1st of each month
    if (now.getUTCDate() === 1 && now.getUTCHours() === 6) {
      await runMonthlyReviews();
    }
  }, 60 * 60 * 1000); // Every hour

  logger.info('Monthly review job scheduled');
}

/**
 * Manually trigger monthly review generation (for testing)
 */
export async function triggerMonthlyReviews(): Promise<void> {
  await runMonthlyReviews();
}

/**
 * Shutdown the monthly review job
 */
export function shutdownMonthlyReviewJob(): void {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    logger.info('Monthly review job shutdown');
  }
}
