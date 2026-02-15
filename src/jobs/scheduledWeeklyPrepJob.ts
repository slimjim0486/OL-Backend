/**
 * Scheduled Weekly Prep Job
 *
 * Cron job that runs every 30 minutes to check if any teachers
 * have their preferred planning day/time matching now. If so,
 * it triggers a weekly prep generation for the upcoming week.
 *
 * Uses the teacher's timezone to compare against current time.
 */

import cron from 'node-cron';
import { prisma } from '../config/database.js';
import { PlanningAutonomy } from '@prisma/client';
import { weeklyPrepService } from '../services/teacher/weeklyPrepService.js';
import { queueWeeklyPrep } from './weeklyPrepJob.js';
import { logger } from '../utils/logger.js';

// Day name → JS getDay() value (0=Sun, 6=Sat)
const DAY_MAP: Record<string, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

/**
 * Check if the current time in the teacher's timezone falls within
 * the 30-minute window of their preferred planning time.
 */
function isWithinWindow(
  preferredDay: string,
  preferredTime: string, // "HH:MM"
  timezone: string
): boolean {
  try {
    const now = new Date();

    // Get current time in teacher's timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const parts = formatter.formatToParts(now);
    const currentDay = parts.find((p) => p.type === 'weekday')?.value?.toUpperCase();
    const currentHour = parseInt(parts.find((p) => p.type === 'hour')?.value || '0', 10);
    const currentMinute = parseInt(parts.find((p) => p.type === 'minute')?.value || '0', 10);

    // Check day match
    if (currentDay !== preferredDay.toUpperCase()) return false;

    // Parse preferred time
    const [prefHour, prefMinute] = preferredTime.split(':').map(Number);

    // Check if we're within 30 minutes of the preferred time
    const currentTotalMinutes = currentHour * 60 + currentMinute;
    const prefTotalMinutes = prefHour * 60 + prefMinute;

    // Window: preferredTime <= now < preferredTime + 30min
    return currentTotalMinutes >= prefTotalMinutes && currentTotalMinutes < prefTotalMinutes + 30;
  } catch (error) {
    logger.warn('Failed to check scheduling window', { preferredDay, preferredTime, timezone, error });
    return false;
  }
}

/**
 * Main cron tick: find teachers whose scheduled prep time is now
 * and trigger weekly prep generation for them.
 */
async function runScheduledWeeklyPreps(): Promise<void> {
  logger.info('Running scheduled weekly prep check');

  try {
    // Find all teachers with scheduling preferences set and onboarding complete
    const agents = await prisma.teacherAgent.findMany({
      where: {
        onboardingComplete: true,
        planningAutonomy: PlanningAutonomy.AUTOPILOT,
        preferredPlanningDay: { not: null },
        preferredDeliveryTime: { not: null },
      },
      select: {
        id: true,
        teacherId: true,
        preferredPlanningDay: true,
        preferredDeliveryTime: true,
        timezone: true,
      },
    });

    if (agents.length === 0) {
      logger.debug('No teachers with scheduling preferences found');
      return;
    }

    let triggered = 0;

    for (const agent of agents) {
      const day = agent.preferredPlanningDay;
      const time = agent.preferredDeliveryTime;
      const tz = agent.timezone || 'America/New_York';

      if (!day || !time) continue;

      if (!isWithinWindow(day, time, tz)) continue;

      try {
        const { prepId, weekLabel, existed } = await weeklyPrepService.initiateWeeklyPrep(
          agent.teacherId,
          { triggeredBy: 'scheduled' }
        );

        // If a prep already exists for the upcoming week, don't re-queue the same job.
        if (existed) {
          logger.debug('Scheduled weekly prep already exists; skipping queue', {
            teacherId: agent.teacherId,
            prepId,
            weekLabel,
          });
          continue;
        }

        await queueWeeklyPrep({
          prepId,
          teacherId: agent.teacherId,
          triggeredBy: 'scheduled',
        });

        triggered++;
        logger.info('Scheduled weekly prep triggered', {
          teacherId: agent.teacherId,
          prepId,
          weekLabel,
        });
      } catch (error) {
        // Most failures here should be logged; existing-week dedupe is handled by initiateWeeklyPrep + existed flag.
        const msg = error instanceof Error ? error.message : String(error);
        if (!msg.includes('already exists')) {
          logger.error('Failed to trigger scheduled weekly prep', {
            teacherId: agent.teacherId,
            error: msg,
          });
        }
      }
    }

    logger.info('Scheduled weekly prep check complete', { checked: agents.length, triggered });
  } catch (error) {
    logger.error('Scheduled weekly prep check failed', { error });
  }
}

/**
 * Schedule the cron job — runs every 30 minutes.
 */
export function scheduleWeeklyPrepDelivery(): void {
  // Every 30 minutes: at 0 and 30 minutes past every hour
  cron.schedule('0,30 * * * *', async () => {
    try {
      await runScheduledWeeklyPreps();
    } catch (error) {
      logger.error('Scheduled weekly prep cron failed', { error });
    }
  });

  logger.info('Weekly prep delivery scheduled (every 30 minutes)');
}

export { runScheduledWeeklyPreps };
