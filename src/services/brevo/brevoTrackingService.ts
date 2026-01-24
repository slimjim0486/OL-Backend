/**
 * Brevo Event Tracking Service
 *
 * Sends behavioral events to Brevo for triggering automated email sequences.
 * Used for the teacher welcome sequence v2 behavioral triggers.
 *
 * Uses LIST-BASED triggers (Contact added to list) for automations.
 *
 * Lists:
 * - B1 (List 12): First lesson created
 * - B2 (List 13): Second lesson created
 * - B3 (List 14): Third lesson created
 * - B4 (List 15): Credits 50 percent
 * - B5 (List 16): Credits 80 percent
 * - B6 (List 17): Day 3 no lesson
 * - B7 (List 18): Inactive 7 days
 * - B8 (List 19): Inactive 14 days
 */

import axios from 'axios';
import { Teacher, TeacherSubscriptionTier } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

// Brevo API endpoints
const BREVO_CONTACTS_URL = 'https://api.brevo.com/v3/contacts';
const BREVO_API_KEY = process.env.BREVO_API_KEY;

// List IDs for behavioral triggers
const BREVO_LISTS = {
  B1_FIRST_LESSON: 12,
  B2_SECOND_LESSON: 13,
  B3_THIRD_LESSON: 14,
  B4_CREDITS_50: 15,
  B5_CREDITS_80: 16,
  B6_DAY3_NO_LESSON: 17,
  B7_INACTIVE_7_DAYS: 18,
  B8_INACTIVE_14_DAYS: 19,
};

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
// CORE FUNCTIONS
// ============================================================================

/**
 * Add a contact to a Brevo list (triggers "Contact added to list" automations)
 */
export async function addContactToList(email: string, listId: number): Promise<boolean> {
  if (!BREVO_API_KEY) {
    logger.warn('BREVO_API_KEY not configured, skipping list add');
    return false;
  }

  try {
    await axios.post(
      `${BREVO_CONTACTS_URL}/lists/${listId}/contacts/add`,
      { emails: [email] },
      {
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    logger.info(`Brevo: Added contact to list ${listId}`, { email, listId });
    return true;
  } catch (error: any) {
    logger.error('Brevo list add error', {
      listId,
      email,
      error: error.response?.data || error.message,
    });
    return false;
  }
}

/**
 * Create or update a contact in Brevo with attributes
 */
export async function upsertBrevoContact(
  email: string,
  attributes: Record<string, any>
): Promise<boolean> {
  if (!BREVO_API_KEY) {
    logger.warn('BREVO_API_KEY not configured, skipping contact upsert');
    return false;
  }

  try {
    await axios.post(
      BREVO_CONTACTS_URL,
      {
        email,
        attributes,
        updateEnabled: true,
      },
      {
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    logger.info('Brevo: Contact upserted', { email });
    return true;
  } catch (error: any) {
    // 204 = duplicate, which is fine for updates
    if (error.response?.status === 204) {
      return true;
    }
    logger.error('Brevo contact upsert error', {
      email,
      error: error.response?.data || error.message,
    });
    return false;
  }
}

/**
 * Send an event to Brevo's Track API (for contact attribute updates)
 * Note: Track events don't trigger automations without JS tracker,
 * but they DO update contact attributes.
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
      'https://in-automate.brevo.com/api/v2/trackEvent',
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
  const attributes = buildContactProperties(teacher);
  const lessonCount = teacher.lessonCount || 0;

  // Update contact attributes in Brevo
  await upsertBrevoContact(teacher.email, attributes);

  // Fire specific milestone triggers (only for FREE tier to avoid spamming paid users)
  // Use deduplication to prevent multiple milestone emails in quick succession
  if (teacher.subscriptionTier === 'FREE') {
    if (lessonCount === 1) {
      const alreadySent = await checkTriggerSentThisMonth(teacher.id, 'first_lesson_created');
      if (!alreadySent) {
        await addContactToList(teacher.email, BREVO_LISTS.B1_FIRST_LESSON);
        await recordTriggerSent(teacher.id, 'first_lesson_created');
        logger.info('Triggered B1: First lesson created', { email: teacher.email });
      }
    }

    if (lessonCount === 2) {
      const alreadySent = await checkTriggerSentThisMonth(teacher.id, 'second_lesson_created');
      if (!alreadySent) {
        await addContactToList(teacher.email, BREVO_LISTS.B2_SECOND_LESSON);
        await recordTriggerSent(teacher.id, 'second_lesson_created');
        logger.info('Triggered B2: Second lesson created', { email: teacher.email });
      }
    }

    if (lessonCount === 3) {
      const alreadySent = await checkTriggerSentThisMonth(teacher.id, 'third_lesson_created');
      if (!alreadySent) {
        await addContactToList(teacher.email, BREVO_LISTS.B3_THIRD_LESSON);
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
  const attributes = buildContactProperties(teacher);

  // Update contact attributes
  await upsertBrevoContact(teacher.email, attributes);

  // Check if we've crossed the 50% threshold
  if (percentUsed >= 50 && percentUsed < 80) {
    const alreadySent = await checkTriggerSentThisMonth(teacher.id, 'credits_50_percent');
    if (!alreadySent) {
      await addContactToList(teacher.email, BREVO_LISTS.B4_CREDITS_50);
      await recordTriggerSent(teacher.id, 'credits_50_percent');
      logger.info('Triggered B4: 50% credits used', { email: teacher.email, percentUsed });
    }
  }

  // Check if we've crossed the 80% threshold
  if (percentUsed >= 80) {
    const alreadySent = await checkTriggerSentThisMonth(teacher.id, 'credits_80_percent');
    if (!alreadySent) {
      await addContactToList(teacher.email, BREVO_LISTS.B5_CREDITS_80);
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
  const attributes = {
    ...buildContactProperties(teacher),
    SIGNUP_SOURCE: 'teacher_portal',
  };

  await upsertBrevoContact(teacher.email, attributes);

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
  const attributes = {
    ...buildContactProperties(teacher),
    LAST_ACTIVE_DATE: new Date().toISOString().split('T')[0],
  };

  await upsertBrevoContact(teacher.email, attributes);
}

// ============================================================================
// UPGRADE EVENTS
// ============================================================================

/**
 * Track when a teacher upgrades to a paid plan
 */
export async function trackTeacherUpgrade(teacher: Teacher, fromTier: TeacherSubscriptionTier): Promise<void> {
  const attributes = {
    ...buildContactProperties(teacher),
    PREVIOUS_TIER: fromTier,
  };

  await upsertBrevoContact(teacher.email, attributes);

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
    const result = await upsertBrevoContact(
      teacher.email,
      buildContactProperties(teacher)
    );

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
  addContactToList,
  upsertBrevoContact,
  trackBrevoEvent,
  trackLessonCreated,
  trackCreditUsage,
  trackTeacherSignup,
  trackTeacherActivity,
  trackTeacherUpgrade,
  syncAllTeachersToBrevo,
  BREVO_LISTS,
};
