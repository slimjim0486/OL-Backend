/**
 * Unified Notification Service — Teacher Intelligence Platform
 *
 * Single entry point for ALL teacher notifications. Routes to the correct
 * channel (BELL, EMAIL, or delegates to nudgeService for STREAM_WHISPER).
 *
 * Rules:
 * - Max 2 emails per week per teacher
 * - Max 1 stream whisper visible at a time (enforced by nudgeService)
 * - TERM_WRAPPED_READY is the only dual-channel type (BELL + EMAIL)
 * - In-app (bell/whisper) is primary; email is for re-engagement
 */
import { TeacherNotificationType, TeacherNotificationChannel } from '@prisma/client';
import { Resend } from 'resend';
import { config } from '../../config/index.js';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

const resend = config.email.apiKey ? new Resend(config.email.apiKey) : null;

// ============================================
// TYPES
// ============================================

interface SendNotificationInput {
  teacherId: string;
  type: TeacherNotificationType;
  title: string;
  body: string;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
  showAfter?: Date;
  expiresAt?: Date;
}

// ============================================
// CHANNEL ROUTING
// ============================================

const CHANNEL_ROUTING: Record<TeacherNotificationType, TeacherNotificationChannel> = {
  // Bell
  MATERIAL_SAVED: 'BELL',
  MATERIAL_REMIXED: 'BELL',
  STREAK_MILESTONE: 'BELL',
  TERM_WRAPPED_READY: 'BELL', // Also gets EMAIL — handled in send()

  // Email
  WEEKLY_DIGEST: 'EMAIL',
  STREAK_REENGAGEMENT: 'EMAIL',

  // Stream whisper (delegated to nudge system)
  FIRST_NOTE_WELCOME: 'STREAM_WHISPER',
};

// ============================================
// CORE SERVICE
// ============================================

/**
 * Main entry point. Determines channel, enforces rules, dispatches.
 */
async function send(input: SendNotificationInput): Promise<void> {
  const channel = CHANNEL_ROUTING[input.type];

  if (channel === 'STREAM_WHISPER') {
    await handleStreamWhisper(input);
    return;
  }

  if (channel === 'EMAIL') {
    const canEmail = await canSendEmail(input.teacherId);
    if (!canEmail) {
      logger.info('Email cap reached, skipping', { teacherId: input.teacherId, type: input.type });
      return;
    }

    // Check per-type email preferences
    if (!await checkEmailPreference(input.teacherId, input.type)) return;
  }

  // Create the notification record
  const notification = await prisma.teacherNotification.create({
    data: {
      teacherId: input.teacherId,
      type: input.type,
      channel,
      title: input.title,
      body: input.body,
      actionUrl: input.actionUrl,
      actionLabel: input.actionLabel,
      metadata: input.metadata || {},
      showAfter: input.showAfter || new Date(),
      expiresAt: input.expiresAt,
    },
  });

  // Dispatch to channel
  if (channel === 'EMAIL') {
    await sendEmail(notification.id, input.teacherId);
  }

  // Dual-channel: TERM_WRAPPED_READY also gets an email
  if (input.type === 'TERM_WRAPPED_READY') {
    const canEmail = await canSendEmail(input.teacherId);
    if (canEmail && await checkEmailPreference(input.teacherId, input.type)) {
      const emailNotification = await prisma.teacherNotification.create({
        data: {
          teacherId: input.teacherId,
          type: input.type,
          channel: 'EMAIL',
          title: input.title,
          body: input.body,
          actionUrl: input.actionUrl,
          actionLabel: input.actionLabel,
          metadata: input.metadata || {},
          showAfter: input.showAfter || new Date(),
          expiresAt: input.expiresAt,
        },
      });
      await sendEmail(emailNotification.id, input.teacherId);
    }
  }

  logger.info('Notification sent', { id: notification.id, type: input.type, channel });
}

// ============================================
// STREAM WHISPER (delegates to nudge system)
// ============================================

async function handleStreamWhisper(input: SendNotificationInput): Promise<void> {
  // For FIRST_NOTE_WELCOME: create a nudge via the existing system.
  // The nudge service handles max-1-whisper enforcement and expiry.
  try {
    // Auto-dismiss any existing undismissed stream whispers
    await prisma.teacherNudge.updateMany({
      where: {
        teacherId: input.teacherId,
        dismissed: false,
        type: { in: ['RETEACH_SUGGESTION', 'PREFERENCE_LEARNED', 'COLLECTIVE_INSIGHT'] },
      },
      data: { dismissed: true },
    });

    // Create a PREFERENCE_LEARNED nudge (closest type for welcome messages)
    // with custom content. The OllieWhisper component handles rendering.
    await prisma.teacherNudge.create({
      data: {
        teacherId: input.teacherId,
        type: 'PREFERENCE_LEARNED', // Reuse existing type for whisper rendering
        content: input.body,
        priority: 1,
        showAfter: input.showAfter || new Date(),
        expiresAt: input.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        actionContext: {
          notificationType: input.type, // Track original type
          actionUrl: input.actionUrl,
          actionLabel: input.actionLabel,
          ...(input.metadata || {}),
        },
      },
    });

    logger.info('Stream whisper created via nudge system', { teacherId: input.teacherId, type: input.type });
  } catch (err) {
    logger.error('Failed to create stream whisper', { error: (err as Error).message });
  }
}

// ============================================
// EMAIL
// ============================================

/**
 * Max 2 emails per week per teacher.
 */
async function canSendEmail(teacherId: string): Promise<boolean> {
  const startOfWeek = getStartOfWeek();
  const emailCount = await prisma.teacherNotification.count({
    where: {
      teacherId,
      channel: 'EMAIL',
      emailSentAt: { gte: startOfWeek },
    },
  });
  return emailCount < 2;
}

/**
 * Check per-type email preferences.
 */
async function checkEmailPreference(teacherId: string, type: TeacherNotificationType): Promise<boolean> {
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    select: {
      notifyWeeklyDigest: true,
      emailStreakEnabled: true,
    },
  });
  if (!teacher) return false;

  if (type === 'WEEKLY_DIGEST' && !teacher.notifyWeeklyDigest) return false;
  if (type === 'STREAK_REENGAGEMENT' && !teacher.emailStreakEnabled) return false;

  return true;
}

/**
 * Send email via Resend.
 */
async function sendEmail(notificationId: string, teacherId: string): Promise<void> {
  const notification = await prisma.teacherNotification.findUnique({
    where: { id: notificationId },
  });
  if (!notification) return;

  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    select: { email: true, firstName: true },
  });
  if (!teacher) return;

  if (!resend) {
    logger.warn('Resend not configured — logging email instead', {
      to: teacher.email,
      subject: notification.title,
      body: notification.body,
    });
    return;
  }

  try {
    const html = buildEmailHtml(notification.title, notification.body, notification.actionUrl, notification.actionLabel, teacher.firstName);

    const { data, error } = await resend.emails.send({
      from: `Orba <${config.email.fromEmail}>`,
      to: teacher.email,
      subject: notification.title,
      html,
    });

    if (error) {
      logger.error('Failed to send notification email', { error, notificationId });
      return;
    }

    await prisma.teacherNotification.update({
      where: { id: notificationId },
      data: { emailSentAt: new Date(), emailId: data?.id },
    });

    logger.info('Notification email sent', { notificationId, to: teacher.email });
  } catch (err) {
    logger.error('Email send error', { error: (err as Error).message, notificationId });
  }
}

function buildEmailHtml(title: string, body: string, actionUrl?: string | null, actionLabel?: string | null, firstName?: string | null): string {
  const name = firstName || 'there';
  const ctaHtml = actionUrl ? `
    <div style="text-align: center; margin-top: 24px;">
      <a href="https://withorba.com${actionUrl}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #2D5A4A, #3D7A6A); color: #fff; text-decoration: none; border-radius: 12px; font-weight: 600;">
        ${actionLabel || 'Open Orba'}
      </a>
    </div>` : '';

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px;">
      <div style="background: linear-gradient(135deg, #2D5A4A, #1E4035); border-radius: 16px 16px 0 0; padding: 24px; text-align: center;">
        <h1 style="color: #fff; font-size: 20px; margin: 0;">Orba</h1>
      </div>
      <div style="background: #fff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 16px 16px; padding: 32px 24px;">
        <p style="color: #1E2A3A; font-size: 16px; margin: 0 0 8px;">Hi ${name},</p>
        <p style="color: #3D4F66; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">${body}</p>
        ${ctaHtml}
      </div>
      <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 16px;">
        Orba | <a href="https://withorba.com/settings" style="color: #9ca3af;">Manage preferences</a>
      </p>
    </div>`;
}

// ============================================
// QUERIES (for API routes)
// ============================================

async function getUnreadCount(teacherId: string): Promise<number> {
  return prisma.teacherNotification.count({
    where: {
      teacherId,
      channel: 'BELL',
      read: false,
      dismissed: false,
      showAfter: { lte: new Date() },
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    },
  });
}

async function getBellNotifications(teacherId: string, limit = 20, offset = 0) {
  const now = new Date();
  const [notifications, total, unreadCount] = await Promise.all([
    prisma.teacherNotification.findMany({
      where: {
        teacherId,
        channel: 'BELL',
        dismissed: false,
        showAfter: { lte: now },
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: now } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.teacherNotification.count({
      where: {
        teacherId,
        channel: 'BELL',
        dismissed: false,
      },
    }),
    prisma.teacherNotification.count({
      where: {
        teacherId,
        channel: 'BELL',
        read: false,
        dismissed: false,
      },
    }),
  ]);

  return { notifications, total, unreadCount };
}

async function markRead(teacherId: string, notificationId: string): Promise<void> {
  await prisma.teacherNotification.updateMany({
    where: { id: notificationId, teacherId },
    data: { read: true },
  });
}

async function dismiss(teacherId: string, notificationId: string): Promise<void> {
  await prisma.teacherNotification.updateMany({
    where: { id: notificationId, teacherId },
    data: { dismissed: true },
  });
}

async function markAllRead(teacherId: string): Promise<void> {
  await prisma.teacherNotification.updateMany({
    where: { teacherId, channel: 'BELL', read: false },
    data: { read: true },
  });
}

// ============================================
// CLEANUP
// ============================================

async function cleanup(): Promise<{ expired: number; deleted: number }> {
  // Auto-dismiss expired notifications
  const expired = await prisma.teacherNotification.updateMany({
    where: {
      dismissed: false,
      expiresAt: { lt: new Date() },
    },
    data: { dismissed: true },
  });

  // Delete old dismissed notifications (90+ days)
  const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const deleted = await prisma.teacherNotification.deleteMany({
    where: {
      dismissed: true,
      createdAt: { lt: cutoff },
    },
  });

  return { expired: expired.count, deleted: deleted.count };
}

// ============================================
// HELPERS
// ============================================

function getStartOfWeek(): Date {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = day === 0 ? 6 : day - 1; // Monday = start of week
  const monday = new Date(now);
  monday.setUTCDate(monday.getUTCDate() - diff);
  monday.setUTCHours(0, 0, 0, 0);
  return monday;
}

// ============================================
// EXPORT
// ============================================

export const notificationService = {
  send,
  getUnreadCount,
  getBellNotifications,
  markRead,
  dismiss,
  markAllRead,
  cleanup,
};
