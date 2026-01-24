/**
 * Brevo Event Tracking Service
 *
 * Sends behavioral events to Brevo for triggering automated email sequences.
 * Used for the teacher welcome sequence v2 behavioral triggers.
 *
 * Events tracked:
 * - first_lesson_created (B1)
 * - second_lesson_created (B2)
 * - third_lesson_created (B3)
 * - credits_50_percent (B4)
 * - credits_80_percent (B5)
 * - signup_no_lesson_day3 (B6)
 * - inactive_7_days (B7)
 * - inactive_14_days (B8)
 */

import axios from 'axios';
import { Teacher, TeacherSubscriptionTier } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

// Brevo Track API endpoint
const BREVO_TRACK_URL = 'https://in-automate.brevo.com/api/v2/trackEvent';
const BREVO_API_KEY = process.env.BREVO_API_KEY;

// Credit limits by tier
const CREDIT_LIMITS: Record<TeacherSubscriptionTier, number> = {
  FREE: 100,
  BASIC: 500,
  PROFESSIONAL: 2000,
};

// ============================================================================
// TYPES
// ============================================================================

interface TrackEventParams {
  email: string;
  event: string;
  properties?: Record<string, any>;
  eventdata?: Record<string, any>;
}

interface TeacherEventData {
  teacher: Teacher;
  lessonTitle?: string;
  lessonSubject?: string;
}

// ============================================================================
// CORE TRACKING FUNCTION
// ============================================================================

/**
 * Send an event to Brevo's Track API
 *
 * @param params.email - Teacher's email address
 * @param params.event - Event name (must match Brevo automation trigger)
 * @param params.properties - Updates contact attributes in Brevo
 * @param params.eventdata - Event-specific data for email personalization
 */
export async function trackBrevoEvent({
  email,
  event,
  properties = {},
  eventdata = {}
}: TrackEventParams): Promise<boolean> {
  if (!BREVO_API_KEY) {
    logger.warn('BREVO_API_KEY not configured, skipping event tracking');
    return false;
  }

  try {
    await axios.post(
      BREVO_TRACK_URL,
      {
        email,
        event,
        properties,
        eventdata,
      },
      {
        headers: {
          'ma-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    logger.info(`Brevo event tracked: ${event}`, { email, event });
    return true;
  } catch (error: any) {
    logger.error('Brevo tracking error', {
      event,
      email,
      error: error.response?.data || error.message,
    });
    return false;
  }
}

// ============================================================================
// CONTACT ATTRIBUTE UPDATES
// ============================================================================

/**
 * Build standard contact properties for Brevo
 * These update the contact's attributes in Brevo for personalization
 */
function buildContactProperties(teacher: Teacher): Record<string, any> {
  const creditLimit = CREDIT_LIMITS[teacher.subscriptionTier];
  // Convert BigInt to Number for calculations
  const creditsUsed = Number(teacher.currentMonthUsage) || 0;
  const creditsRemaining = Math.max(0, creditLimit - creditsUsed);

  // Calculate reset date (1st of next month)
  const now = new Date();
  const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const daysUntilReset = Math.ceil((resetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // Estimate lessons possible (roughly 10 credits per lesson)
  const lessonsPossible = Math.floor(creditsRemaining / 10);

  // Estimate time saved (45 min per lesson)
  const timeSaved = (teacher.lessonCount || 0) * 45;
  const timeSavedHours = Math.round(timeSaved / 60);

  return {
    FIRSTNAME: teacher.firstName || '',
    LASTNAME: teacher.lastName || '',
    LESSON_COUNT: teacher.lessonCount || 0,
    CREDITS_USED: creditsUsed,
    CREDITS_REMAINING: creditsRemaining,
    CREDIT_LIMIT: creditLimit,
    SUBSCRIPTION_TIER: teacher.subscriptionTier,
    RESET_DATE: resetDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
    DAYS_UNTIL_RESET: daysUntilReset,
    LESSONS_POSSIBLE: `${lessonsPossible}-${lessonsPossible + 2}`,
    TIME_SAVED: timeSavedHours > 0 ? `${timeSavedHours}+` : '0',
    SIGNUP_DATE: teacher.createdAt?.toISOString().split('T')[0],
    SCHOOL_NAME: teacher.schoolName || '',
    GRADE_RANGE: teacher.gradeRange || '',
    PRIMARY_SUBJECT: teacher.primarySubject || '',
  };
}

// ============================================================================
// LESSON CREATION EVENTS
// ============================================================================

/**
 * Track lesson creation and fire appropriate behavioral triggers
 * Call this after a lesson is successfully created
 */
export async function trackLessonCreated(data: TeacherEventData): Promise<void> {
  const { teacher, lessonTitle, lessonSubject } = data;
  const properties = buildContactProperties(teacher);
  const lessonCount = teacher.lessonCount || 0;

  // Always track the general lesson_created event (updates contact attributes)
  await trackBrevoEvent({
    email: teacher.email,
    event: 'lesson_created',
    properties,
    eventdata: {
      lesson_title: lessonTitle || 'Untitled Lesson',
      lesson_subject: lessonSubject || 'General',
      lesson_number: lessonCount,
    },
  });

  // Fire specific milestone events (only for FREE tier to avoid spamming paid users)
  // Use deduplication to prevent multiple milestone emails in quick succession
  if (teacher.subscriptionTier === 'FREE') {
    if (lessonCount === 1) {
      const alreadySent = await checkTriggerSentThisMonth(teacher.id, 'first_lesson_created');
      if (!alreadySent) {
        await trackBrevoEvent({
          email: teacher.email,
          event: 'first_lesson_created',
          properties,
          eventdata: { lesson_title: lessonTitle },
        });
        await recordTriggerSent(teacher.id, 'first_lesson_created');
        logger.info('Triggered B1: First lesson created', { email: teacher.email });
      }
    }

    if (lessonCount === 2) {
      const alreadySent = await checkTriggerSentThisMonth(teacher.id, 'second_lesson_created');
      if (!alreadySent) {
        await trackBrevoEvent({
          email: teacher.email,
          event: 'second_lesson_created',
          properties,
          eventdata: { lesson_title: lessonTitle },
        });
        await recordTriggerSent(teacher.id, 'second_lesson_created');
        logger.info('Triggered B2: Second lesson created', { email: teacher.email });
      }
    }

    if (lessonCount === 3) {
      const alreadySent = await checkTriggerSentThisMonth(teacher.id, 'third_lesson_created');
      if (!alreadySent) {
        await trackBrevoEvent({
          email: teacher.email,
          event: 'third_lesson_created',
          properties,
          eventdata: { lesson_title: lessonTitle },
        });
        await recordTriggerSent(teacher.id, 'third_lesson_created');
        logger.info('Triggered B3: Third lesson (activation!)', { email: teacher.email });
      }
    }
  }
}

// ============================================================================
// CREDIT USAGE EVENTS
// ============================================================================

/**
 * Track credit usage and fire threshold triggers
 * Call this after tokens are consumed
 */
export async function trackCreditUsage(teacher: Teacher): Promise<void> {
  // Only trigger for FREE tier users
  if (teacher.subscriptionTier !== 'FREE') {
    return;
  }

  const creditLimit = CREDIT_LIMITS.FREE;
  const creditsUsed = Number(teacher.currentMonthUsage) || 0;
  const percentUsed = (creditsUsed / creditLimit) * 100;
  const properties = buildContactProperties(teacher);

  // Check if we've crossed the 50% threshold
  // We use a flag to prevent sending multiple times
  if (percentUsed >= 50 && percentUsed < 80) {
    // Check if we already sent this trigger this month
    const alreadySent = await checkTriggerSentThisMonth(teacher.id, 'credits_50_percent');
    if (!alreadySent) {
      await trackBrevoEvent({
        email: teacher.email,
        event: 'credits_50_percent',
        properties,
      });
      await recordTriggerSent(teacher.id, 'credits_50_percent');
      logger.info('Triggered B4: 50% credits used', { email: teacher.email, percentUsed });
    }
  }

  // Check if we've crossed the 80% threshold
  if (percentUsed >= 80) {
    const alreadySent = await checkTriggerSentThisMonth(teacher.id, 'credits_80_percent');
    if (!alreadySent) {
      await trackBrevoEvent({
        email: teacher.email,
        event: 'credits_80_percent',
        properties,
      });
      await recordTriggerSent(teacher.id, 'credits_80_percent');
      logger.info('Triggered B5: 80% credits used', { email: teacher.email, percentUsed });
    }
  }
}

// ============================================================================
// SIGNUP EVENT
// ============================================================================

/**
 * Track teacher signup - adds them to Brevo with initial attributes
 * Call this after successful signup
 */
export async function trackTeacherSignup(teacher: Teacher): Promise<void> {
  const properties = buildContactProperties(teacher);

  await trackBrevoEvent({
    email: teacher.email,
    event: 'teacher_signup',
    properties: {
      ...properties,
      SIGNUP_SOURCE: 'teacher_portal',
    },
  });

  logger.info('Tracked teacher signup in Brevo', { email: teacher.email });
}

// ============================================================================
// ACTIVITY TRACKING
// ============================================================================

/**
 * Track teacher login/activity - updates last active timestamp
 * Call this on login or significant activity
 */
export async function trackTeacherActivity(teacher: Teacher): Promise<void> {
  const properties = buildContactProperties(teacher);

  await trackBrevoEvent({
    email: teacher.email,
    event: 'teacher_active',
    properties: {
      ...properties,
      LAST_ACTIVE_DATE: new Date().toISOString().split('T')[0],
    },
  });
}

// ============================================================================
// UPGRADE EVENTS
// ============================================================================

/**
 * Track when a teacher upgrades to a paid plan
 */
export async function trackTeacherUpgrade(teacher: Teacher, fromTier: TeacherSubscriptionTier): Promise<void> {
  const properties = buildContactProperties(teacher);

  await trackBrevoEvent({
    email: teacher.email,
    event: 'teacher_upgraded',
    properties: {
      ...properties,
      PREVIOUS_TIER: fromTier,
    },
    eventdata: {
      from_tier: fromTier,
      to_tier: teacher.subscriptionTier,
    },
  });

  logger.info('Tracked teacher upgrade in Brevo', {
    email: teacher.email,
    fromTier,
    toTier: teacher.subscriptionTier
  });
}

// ============================================================================
// HELPER FUNCTIONS FOR TRIGGER DEDUPLICATION
// ============================================================================

/**
 * Check if a trigger was already sent this month
 * Uses a simple in-memory cache or database flag
 */
async function checkTriggerSentThisMonth(teacherId: string, triggerName: string): Promise<boolean> {
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${now.getMonth()}`;

  // Check in database for trigger log
  const existing = await prisma.teacherTriggerLog?.findFirst({
    where: {
      teacherId,
      triggerName,
      monthKey,
    },
  }).catch(() => null); // Table might not exist yet

  return !!existing;
}

/**
 * Record that a trigger was sent
 */
async function recordTriggerSent(teacherId: string, triggerName: string): Promise<void> {
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${now.getMonth()}`;

  await prisma.teacherTriggerLog?.create({
    data: {
      teacherId,
      triggerName,
      monthKey,
      sentAt: now,
    },
  }).catch((error) => {
    // Table might not exist yet, log but don't fail
    logger.warn('Could not record trigger (table may not exist)', { triggerName, error: error.message });
  });
}

// ============================================================================
// BULK CONTACT SYNC
// ============================================================================

/**
 * Sync all teacher contact attributes to Brevo
 * Useful for initial setup or periodic sync
 */
export async function syncAllTeachersToBrevo(): Promise<{ success: number; failed: number }> {
  const teachers = await prisma.teacher.findMany({
    where: { emailVerified: true },
  });

  let success = 0;
  let failed = 0;

  for (const teacher of teachers) {
    const result = await trackBrevoEvent({
      email: teacher.email,
      event: 'contact_sync',
      properties: buildContactProperties(teacher),
    });

    if (result) {
      success++;
    } else {
      failed++;
    }

    // Rate limiting - Brevo allows 400 requests/minute
    await new Promise(resolve => setTimeout(resolve, 150));
  }

  logger.info('Brevo contact sync complete', { success, failed });
  return { success, failed };
}

export default {
  trackBrevoEvent,
  trackLessonCreated,
  trackCreditUsage,
  trackTeacherSignup,
  trackTeacherActivity,
  trackTeacherUpgrade,
  syncAllTeachersToBrevo,
};
