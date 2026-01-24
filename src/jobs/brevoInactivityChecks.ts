/**
 * Brevo Inactivity Check Job
 *
 * Daily cron job that checks for inactive teachers and sends
 * behavioral trigger events to Brevo.
 *
 * Triggers:
 * - B6: signup_no_lesson_day3 - Signed up 3 days ago, no lessons created
 * - B7: inactive_7_days - Last active 7 days ago, has created at least 1 lesson
 * - B8: inactive_14_days - Last active 14 days ago (final re-engagement)
 *
 * Run this job daily at a consistent time (e.g., 9 AM local time)
 *
 * Setup with node-cron:
 *   import { scheduleBrevoInactivityChecks } from './jobs/brevoInactivityChecks';
 *   scheduleBrevoInactivityChecks();
 *
 * Or run manually:
 *   npx tsx src/jobs/brevoInactivityChecks.ts
 */

import cron from 'node-cron';
import { fileURLToPath } from 'url';
import { prisma } from '../config/database.js';
import { trackBrevoEvent } from '../services/brevo/brevoTrackingService.js';
import { logger } from '../utils/logger.js';

// ============================================================================
// DATE HELPERS
// ============================================================================

function subDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function endOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

// ============================================================================
// BUILD CONTACT PROPERTIES
// ============================================================================

function buildContactProperties(teacher: any): Record<string, any> {
  const creditLimit = teacher.subscriptionTier === 'FREE' ? 100 :
                      teacher.subscriptionTier === 'BASIC' ? 500 : 2000;
  const creditsUsed = teacher.monthlyTokensUsed || 0;
  const creditsRemaining = Math.max(0, creditLimit - creditsUsed);

  const now = new Date();
  const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const daysUntilReset = Math.ceil((resetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return {
    FIRSTNAME: teacher.firstName || teacher.name?.split(' ')[0] || '',
    LESSON_COUNT: teacher.lessonCount || 0,
    CREDITS_USED: creditsUsed,
    CREDITS_REMAINING: creditsRemaining,
    RESET_DATE: resetDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
    DAYS_UNTIL_RESET: daysUntilReset,
    LESSONS_POSSIBLE: `${Math.floor(creditsRemaining / 10)}-${Math.floor(creditsRemaining / 10) + 2}`,
    TIME_SAVED: `${Math.round((teacher.lessonCount || 0) * 45 / 60)}+`,
  };
}

// ============================================================================
// B6: SIGNUP NO LESSON DAY 3
// ============================================================================

/**
 * Find teachers who signed up exactly 3 days ago but haven't created any lessons
 */
async function checkSignupNoLessonDay3(): Promise<number> {
  const now = new Date();
  const day3Start = startOfDay(subDays(now, 3));
  const day3End = endOfDay(subDays(now, 3));

  const teachers = await prisma.teacher.findMany({
    where: {
      createdAt: {
        gte: day3Start,
        lte: day3End,
      },
      lessonCount: 0,
      subscriptionTier: 'FREE',
      emailVerified: true,
    },
  });

  logger.info(`B6 Check: Found ${teachers.length} teachers (signed up day 3, no lessons)`);

  for (const teacher of teachers) {
    // Check if already sent
    const alreadySent = await prisma.teacherTriggerLog?.findFirst({
      where: {
        teacherId: teacher.id,
        triggerName: 'signup_no_lesson_day3',
      },
    }).catch(() => null);

    if (!alreadySent) {
      await trackBrevoEvent({
        email: teacher.email,
        event: 'signup_no_lesson_day3',
        properties: buildContactProperties(teacher),
      });

      // Record trigger sent
      await prisma.teacherTriggerLog?.create({
        data: {
          teacherId: teacher.id,
          triggerName: 'signup_no_lesson_day3',
          monthKey: `${now.getFullYear()}-${now.getMonth()}`,
          sentAt: now,
        },
      }).catch(() => {});

      logger.info('Sent B6 trigger: signup_no_lesson_day3', { email: teacher.email });
    }
  }

  return teachers.length;
}

// ============================================================================
// B7: INACTIVE 7 DAYS
// ============================================================================

/**
 * Find teachers who were last active exactly 7 days ago and have created at least 1 lesson
 */
async function checkInactive7Days(): Promise<number> {
  const now = new Date();
  const day7Start = startOfDay(subDays(now, 7));
  const day7End = endOfDay(subDays(now, 7));

  const teachers = await prisma.teacher.findMany({
    where: {
      lastActiveAt: {
        gte: day7Start,
        lte: day7End,
      },
      lessonCount: {
        gte: 1,
      },
      subscriptionTier: 'FREE',
      emailVerified: true,
    },
  });

  logger.info(`B7 Check: Found ${teachers.length} teachers (inactive 7 days, has lessons)`);

  for (const teacher of teachers) {
    // Check if already sent
    const alreadySent = await prisma.teacherTriggerLog?.findFirst({
      where: {
        teacherId: teacher.id,
        triggerName: 'inactive_7_days',
      },
    }).catch(() => null);

    if (!alreadySent) {
      await trackBrevoEvent({
        email: teacher.email,
        event: 'inactive_7_days',
        properties: buildContactProperties(teacher),
      });

      // Record trigger sent
      await prisma.teacherTriggerLog?.create({
        data: {
          teacherId: teacher.id,
          triggerName: 'inactive_7_days',
          monthKey: `${now.getFullYear()}-${now.getMonth()}`,
          sentAt: now,
        },
      }).catch(() => {});

      logger.info('Sent B7 trigger: inactive_7_days', { email: teacher.email });
    }
  }

  return teachers.length;
}

// ============================================================================
// B8: INACTIVE 14 DAYS (FOMO)
// ============================================================================

/**
 * Find teachers who were last active exactly 14 days ago (final re-engagement)
 */
async function checkInactive14Days(): Promise<number> {
  const now = new Date();
  const day14Start = startOfDay(subDays(now, 14));
  const day14End = endOfDay(subDays(now, 14));

  const teachers = await prisma.teacher.findMany({
    where: {
      lastActiveAt: {
        gte: day14Start,
        lte: day14End,
      },
      subscriptionTier: 'FREE',
      emailVerified: true,
    },
  });

  logger.info(`B8 Check: Found ${teachers.length} teachers (inactive 14 days)`);

  for (const teacher of teachers) {
    // Check if already sent
    const alreadySent = await prisma.teacherTriggerLog?.findFirst({
      where: {
        teacherId: teacher.id,
        triggerName: 'inactive_14_days',
      },
    }).catch(() => null);

    if (!alreadySent) {
      await trackBrevoEvent({
        email: teacher.email,
        event: 'inactive_14_days',
        properties: buildContactProperties(teacher),
      });

      // Record trigger sent
      await prisma.teacherTriggerLog?.create({
        data: {
          teacherId: teacher.id,
          triggerName: 'inactive_14_days',
          monthKey: `${now.getFullYear()}-${now.getMonth()}`,
          sentAt: now,
        },
      }).catch(() => {});

      logger.info('Sent B8 trigger: inactive_14_days', { email: teacher.email });
    }
  }

  return teachers.length;
}

// ============================================================================
// MAIN JOB RUNNER
// ============================================================================

/**
 * Run all inactivity checks
 */
export async function runBrevoInactivityChecks(): Promise<{
  b6: number;
  b7: number;
  b8: number;
}> {
  logger.info('Starting Brevo inactivity checks...');

  const results = {
    b6: await checkSignupNoLessonDay3(),
    b7: await checkInactive7Days(),
    b8: await checkInactive14Days(),
  };

  logger.info('Brevo inactivity checks complete', results);

  return results;
}

// ============================================================================
// CRON SCHEDULER
// ============================================================================

/**
 * Schedule the inactivity checks to run daily at 9 AM
 */
export function scheduleBrevoInactivityChecks(): void {
  // Run every day at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    logger.info('Running scheduled Brevo inactivity checks');
    try {
      await runBrevoInactivityChecks();
    } catch (error) {
      logger.error('Brevo inactivity check failed', { error });
    }
  });

  logger.info('Brevo inactivity checks scheduled for 9:00 AM daily');
}

// ============================================================================
// CLI RUNNER
// ============================================================================

// Allow running directly from command line (ESM version)
const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);
if (isMainModule) {
  runBrevoInactivityChecks()
    .then((results) => {
      console.log('Inactivity checks complete:', results);
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error running inactivity checks:', error);
      process.exit(1);
    });
}

export default {
  runBrevoInactivityChecks,
  scheduleBrevoInactivityChecks,
};
