// Streak Service — Daily streak tracking + reflection status
// Updates on every stream entry creation, reset by hourly cron
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

// ============================================
// HELPERS
// ============================================

/**
 * Get today's date string (YYYY-MM-DD) in a given timezone.
 * Falls back to UTC if timezone is invalid.
 */
function getTodayInTimezone(timezone?: string | null): string {
  try {
    const tz = timezone || 'UTC';
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' });
    return formatter.format(now); // "YYYY-MM-DD"
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

function getYesterdayInTimezone(timezone?: string | null): string {
  try {
    const tz = timezone || 'UTC';
    const yesterday = new Date(Date.now() - 86400000);
    const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' });
    return formatter.format(yesterday);
  } catch {
    const yesterday = new Date(Date.now() - 86400000);
    return yesterday.toISOString().split('T')[0];
  }
}

function dateToString(date: Date | null): string | null {
  if (!date) return null;
  return date.toISOString().split('T')[0];
}

// ============================================
// STREAK LOGIC
// ============================================

async function updateStreak(teacherId: string, timezone?: string | null) {
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    select: {
      currentStreak: true,
      longestStreak: true,
      lastActiveDate: true,
    },
  });

  if (!teacher) return { currentStreak: 0, longestStreak: 0, isNewDay: false };

  const today = getTodayInTimezone(timezone);
  const yesterday = getYesterdayInTimezone(timezone);
  const lastActive = dateToString(teacher.lastActiveDate);

  let { currentStreak, longestStreak } = teacher;
  let isNewDay = false;

  if (lastActive === today) {
    // Already counted today — no change
    return { currentStreak, longestStreak, isNewDay: false };
  }

  if (lastActive === yesterday) {
    // Consecutive day — extend streak
    currentStreak++;
    isNewDay = true;
  } else {
    // Streak broken (or first entry ever) — restart
    currentStreak = 1;
    isNewDay = true;
  }

  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }

  await prisma.teacher.update({
    where: { id: teacherId },
    data: {
      currentStreak,
      longestStreak,
      lastActiveDate: new Date(today + 'T00:00:00Z'),
    },
  });

  logger.info('Streak updated', { teacherId, currentStreak, longestStreak, isNewDay });

  // Send milestone notification for streak achievements
  const MILESTONES = [7, 15, 30, 60, 100];
  if (isNewDay && MILESTONES.includes(currentStreak)) {
    try {
      const { notificationService } = await import('./notificationService.js');
      await notificationService.send({
        teacherId,
        type: 'STREAK_MILESTONE',
        title: `${currentStreak}-day streak!`,
        body: `You've been writing in your stream for ${currentStreak} days straight. Your teaching graph keeps getting richer.`,
        metadata: { streakCount: currentStreak },
      });
    } catch (err) {
      // Non-fatal
      logger.error('Failed to send streak milestone notification', { error: (err as Error).message });
    }
  }

  return { currentStreak, longestStreak, isNewDay };
}

async function getStreak(teacherId: string) {
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    select: {
      currentStreak: true,
      longestStreak: true,
      lastActiveDate: true,
    },
  });

  if (!teacher) {
    return { currentStreak: 0, longestStreak: 0, lastActiveDate: null };
  }

  return {
    currentStreak: teacher.currentStreak,
    longestStreak: teacher.longestStreak,
    lastActiveDate: teacher.lastActiveDate,
  };
}

// ============================================
// REFLECTION STATUS
// ============================================

async function getReflectionStatus(teacherId: string, timezone?: string | null) {
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    select: {
      currentStreak: true,
      longestStreak: true,
      reflectionTime: true,
      reflectionEnabled: true,
      lastActiveDate: true,
    },
  });

  if (!teacher || !teacher.reflectionEnabled) {
    return {
      shouldShowPrompt: false,
      currentStreak: teacher?.currentStreak || 0,
      longestStreak: teacher?.longestStreak || 0,
      reflectionTime: teacher?.reflectionTime || '15:30',
    };
  }

  const tz = timezone || 'UTC';
  const today = getTodayInTimezone(tz);
  const lastActive = dateToString(teacher.lastActiveDate);

  // Already posted today — no prompt needed
  if (lastActive === today) {
    return {
      shouldShowPrompt: false,
      currentStreak: teacher.currentStreak,
      longestStreak: teacher.longestStreak,
      reflectionTime: teacher.reflectionTime,
    };
  }

  // Check if current time is past reflectionTime in teacher's timezone
  let isPastReflectionTime = false;
  try {
    const now = new Date();
    const timeFormatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const currentTime = timeFormatter.format(now); // "HH:MM"
    isPastReflectionTime = currentTime >= teacher.reflectionTime;
  } catch {
    // If timezone is invalid, default to showing prompt
    isPastReflectionTime = true;
  }

  return {
    shouldShowPrompt: isPastReflectionTime,
    currentStreak: teacher.currentStreak,
    longestStreak: teacher.longestStreak,
    reflectionTime: teacher.reflectionTime,
  };
}

// ============================================
// REFLECTION SETTINGS
// ============================================

async function updateReflectionSettings(
  teacherId: string,
  settings: { reflectionTime?: string; reflectionEnabled?: boolean }
) {
  const data: any = {};
  if (settings.reflectionTime !== undefined) {
    // Validate HH:MM format
    if (!/^\d{2}:\d{2}$/.test(settings.reflectionTime)) {
      throw new Error('reflectionTime must be in HH:MM format');
    }
    data.reflectionTime = settings.reflectionTime;
  }
  if (settings.reflectionEnabled !== undefined) {
    data.reflectionEnabled = settings.reflectionEnabled;
  }

  const updated = await prisma.teacher.update({
    where: { id: teacherId },
    data,
    select: { reflectionTime: true, reflectionEnabled: true },
  });

  return updated;
}

// ============================================
// BULK RESET (cron job)
// ============================================

/**
 * Reset broken streaks for teachers whose lastActiveDate is before yesterday
 * in their timezone. Called hourly to handle multiple timezones.
 */
async function resetBrokenStreaks(): Promise<number> {
  // Get all teachers with active streaks
  const teachers = await prisma.teacher.findMany({
    where: {
      currentStreak: { gt: 0 },
      lastActiveDate: { not: null },
    },
    select: {
      id: true,
      lastActiveDate: true,
      agentProfile: { select: { timezone: true } },
    },
  });

  const toReset: string[] = [];

  for (const teacher of teachers) {
    const tz = teacher.agentProfile?.timezone || 'UTC';
    const yesterday = getYesterdayInTimezone(tz);
    const lastActive = dateToString(teacher.lastActiveDate);

    if (lastActive && lastActive < yesterday) {
      toReset.push(teacher.id);
    }
  }

  if (toReset.length > 0) {
    await prisma.teacher.updateMany({
      where: { id: { in: toReset } },
      data: { currentStreak: 0 },
    });

    logger.info('Streaks reset for inactive teachers', { count: toReset.length });
  }

  return toReset.length;
}

// ============================================
// EXPORT
// ============================================

export const streakService = {
  updateStreak,
  getStreak,
  getReflectionStatus,
  updateReflectionSettings,
  resetBrokenStreaks,
};
