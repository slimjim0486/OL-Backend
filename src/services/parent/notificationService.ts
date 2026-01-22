/**
 * Parent Notification Service
 *
 * Handles sending real-time notifications to parents when their children
 * achieve milestones (badges, level ups, streaks, lesson completion).
 *
 * Supports:
 * - Email notifications via Resend
 * - Push notifications via FCM (placeholder - to be implemented)
 * - Notification preferences and quiet hours
 * - Notification logging for analytics
 */

import { prisma } from '../../config/database.js';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
import { Resend } from 'resend';
import { NotificationType } from '@prisma/client';

// Initialize Resend client
const resend = config.email.apiKey ? new Resend(config.email.apiKey) : null;

// ============================================
// TYPES
// ============================================

export interface NotificationPayload {
  parentId: string;
  childId: string;
  childName: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

export interface NotificationPreferences {
  pushEnabled: boolean;
  emailEnabled: boolean;
  achievementAlerts: boolean;
  streakAlerts: boolean;
  lessonAlerts: boolean;
  weeklyDigest: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: number | null;
  quietHoursEnd: number | null;
}

// Notification message templates
const NOTIFICATION_MESSAGES = {
  BADGE_EARNED: {
    title: (childName: string, badgeName: string) => `${childName} earned a badge!`,
    body: (childName: string, badgeName: string) =>
      `${childName} just earned the "${badgeName}" badge! Their hard work is paying off.`,
  },
  LEVEL_UP: {
    title: (childName: string, level: number) => `${childName} leveled up!`,
    body: (childName: string, level: number) =>
      `${childName} reached Level ${level}! Keep up the amazing work.`,
  },
  STREAK_MILESTONE: {
    title: (childName: string, days: number) => `${days}-day streak!`,
    body: (childName: string, days: number) => {
      if (days === 3) return `${childName} is on a 3-day learning streak! Keep the momentum going.`;
      if (days === 7) return `${childName} hit a 7-day streak! That's incredible dedication.`;
      if (days === 14) return `${childName} achieved a 2-week streak! Amazing commitment to learning.`;
      if (days === 30) return `${childName} completed a 30-day streak! Exceptional dedication!`;
      return `${childName} is on a ${days}-day learning streak!`;
    },
  },
  LESSON_COMPLETED: {
    title: (childName: string, lessonTitle: string) => `Lesson completed!`,
    body: (childName: string, lessonTitle: string) =>
      `${childName} finished "${lessonTitle}". Great progress!`,
  },
  WEEKLY_DIGEST: {
    title: (childName: string) => `${childName}'s weekly learning summary`,
    body: (childName: string) => `See what ${childName} accomplished this week!`,
  },
};

// ============================================
// SERVICE
// ============================================

export const parentNotificationService = {
  /**
   * Get or create notification preferences for a parent
   */
  async getPreferences(parentId: string): Promise<NotificationPreferences> {
    let prefs = await prisma.parentNotificationPreference.findUnique({
      where: { parentId },
    });

    // Create default preferences if they don't exist
    if (!prefs) {
      prefs = await prisma.parentNotificationPreference.create({
        data: {
          parentId,
          pushEnabled: true,
          emailEnabled: false,
          achievementAlerts: true,
          streakAlerts: true,
          lessonAlerts: true,
          weeklyDigest: true,
          quietHoursEnabled: false,
        },
      });
    }

    return {
      pushEnabled: prefs.pushEnabled,
      emailEnabled: prefs.emailEnabled,
      achievementAlerts: prefs.achievementAlerts,
      streakAlerts: prefs.streakAlerts,
      lessonAlerts: prefs.lessonAlerts,
      weeklyDigest: prefs.weeklyDigest,
      quietHoursEnabled: prefs.quietHoursEnabled,
      quietHoursStart: prefs.quietHoursStart,
      quietHoursEnd: prefs.quietHoursEnd,
    };
  },

  /**
   * Update notification preferences
   */
  async updatePreferences(
    parentId: string,
    updates: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    const prefs = await prisma.parentNotificationPreference.upsert({
      where: { parentId },
      update: updates,
      create: {
        parentId,
        ...updates,
      },
    });

    return {
      pushEnabled: prefs.pushEnabled,
      emailEnabled: prefs.emailEnabled,
      achievementAlerts: prefs.achievementAlerts,
      streakAlerts: prefs.streakAlerts,
      lessonAlerts: prefs.lessonAlerts,
      weeklyDigest: prefs.weeklyDigest,
      quietHoursEnabled: prefs.quietHoursEnabled,
      quietHoursStart: prefs.quietHoursStart,
      quietHoursEnd: prefs.quietHoursEnd,
    };
  },

  /**
   * Check if we should send a notification based on type and preferences
   */
  shouldSendNotification(
    type: NotificationType,
    prefs: NotificationPreferences
  ): boolean {
    switch (type) {
      case 'BADGE_EARNED':
      case 'LEVEL_UP':
        return prefs.achievementAlerts;
      case 'STREAK_MILESTONE':
        return prefs.streakAlerts;
      case 'LESSON_COMPLETED':
        return prefs.lessonAlerts;
      case 'WEEKLY_DIGEST':
        return prefs.weeklyDigest;
      default:
        return false;
    }
  },

  /**
   * Check if current time is within quiet hours
   */
  isQuietHours(prefs: NotificationPreferences, timezone: string): boolean {
    if (!prefs.quietHoursEnabled || prefs.quietHoursStart === null || prefs.quietHoursEnd === null) {
      return false;
    }

    try {
      // Get current hour in parent's timezone
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        hour12: false,
        timeZone: timezone,
      };
      const currentHour = parseInt(new Intl.DateTimeFormat('en-US', options).format(now), 10);

      const start = prefs.quietHoursStart;
      const end = prefs.quietHoursEnd;

      // Handle overnight quiet hours (e.g., 22:00 - 07:00)
      if (start > end) {
        return currentHour >= start || currentHour < end;
      }
      // Handle same-day quiet hours (e.g., 13:00 - 14:00)
      return currentHour >= start && currentHour < end;
    } catch (error) {
      logger.warn('Error checking quiet hours', { error, timezone });
      return false;
    }
  },

  /**
   * Send a notification to a parent
   * Handles both email and push notifications based on preferences
   */
  async sendNotification(payload: NotificationPayload): Promise<boolean> {
    const { parentId, childId, type, title, body, data } = payload;

    try {
      // Get parent info and preferences
      const parent = await prisma.parent.findUnique({
        where: { id: parentId },
        select: {
          id: true,
          email: true,
          firstName: true,
          timezone: true,
          notificationPreferences: true,
        },
      });

      if (!parent) {
        logger.warn('Parent not found for notification', { parentId });
        return false;
      }

      // Get or create preferences
      const prefs = await this.getPreferences(parentId);

      // Check if this notification type is enabled
      if (!this.shouldSendNotification(type, prefs)) {
        logger.info('Notification type disabled by preferences', { parentId, type });
        return false;
      }

      // Check quiet hours
      if (this.isQuietHours(prefs, parent.timezone)) {
        logger.info('Notification blocked by quiet hours', { parentId, type });
        // TODO: Queue for later delivery
        return false;
      }

      let emailSent = false;
      let pushSent = false;

      // Send email notification
      if (prefs.emailEnabled && resend) {
        emailSent = await this.sendEmailNotification(parent.email, title, body, type, data);
      }

      // Send push notification
      if (prefs.pushEnabled) {
        pushSent = await this.sendPushNotification(parentId, title, body, data);
      }

      // Log the notification
      await prisma.parentNotificationLog.create({
        data: {
          parentId,
          childId,
          type,
          title,
          body,
          data: data ? JSON.parse(JSON.stringify(data)) : undefined,
          channel: emailSent ? 'email' : pushSent ? 'push' : 'none',
        },
      });

      logger.info('Notification sent', {
        parentId,
        childId,
        type,
        emailSent,
        pushSent,
      });

      return emailSent || pushSent;
    } catch (error) {
      logger.error('Failed to send notification', {
        error: error instanceof Error ? error.message : 'Unknown error',
        parentId,
        type,
      });
      return false;
    }
  },

  /**
   * Send email notification
   */
  async sendEmailNotification(
    email: string,
    title: string,
    body: string,
    type: NotificationType,
    data?: Record<string, unknown>
  ): Promise<boolean> {
    if (!resend) {
      logger.warn('Resend not configured, skipping email notification');
      return false;
    }

    try {
      const { error } = await resend.emails.send({
        from: `Orbit Learn <${config.email.fromEmail}>`,
        to: email,
        subject: title,
        html: this.buildEmailTemplate(title, body, type, data),
        text: body,
      });

      if (error) {
        logger.error('Failed to send notification email', { error, email });
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Error sending notification email', {
        error: error instanceof Error ? error.message : 'Unknown error',
        email,
      });
      return false;
    }
  },

  /**
   * Send push notification via FCM
   * TODO: Implement FCM integration
   */
  async sendPushNotification(
    parentId: string,
    title: string,
    body: string,
    data?: Record<string, unknown>
  ): Promise<boolean> {
    // Get active push tokens for the parent
    const tokens = await prisma.parentPushToken.findMany({
      where: {
        parentId,
        isActive: true,
      },
    });

    if (tokens.length === 0) {
      logger.info('No active push tokens for parent', { parentId });
      return false;
    }

    // TODO: Implement FCM push notification
    // For now, log that we would send a push notification
    logger.info('Push notification would be sent (FCM not yet implemented)', {
      parentId,
      tokenCount: tokens.length,
      title,
    });

    return false; // Return false until FCM is implemented
  },

  /**
   * Build HTML email template for notifications
   */
  buildEmailTemplate(
    title: string,
    body: string,
    type: NotificationType,
    data?: Record<string, unknown>
  ): string {
    // Get emoji based on notification type
    const emoji = {
      BADGE_EARNED: '🏆',
      LEVEL_UP: '⬆️',
      STREAK_MILESTONE: '🔥',
      LESSON_COMPLETED: '✅',
      WEEKLY_DIGEST: '📊',
    }[type] || '🎉';

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f4f8;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background: linear-gradient(135deg, #7C3AED 0%, #2DD4BF 100%); border-radius: 24px 24px 0 0; padding: 30px; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 10px;">${emoji}</div>
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">${title}</h1>
      </td>
    </tr>
    <tr>
      <td style="background-color: #ffffff; padding: 30px; border-radius: 0 0 24px 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
        <p style="color: #4b5563; line-height: 1.7; font-size: 16px; margin: 0 0 24px 0;">
          ${body}
        </p>

        <div style="text-align: center; margin: 24px 0;">
          <a href="${config.frontendUrl}/dashboard" style="background: linear-gradient(135deg, #7C3AED 0%, #2DD4BF 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 14px rgba(124, 58, 237, 0.4);">
            View Progress
          </a>
        </div>

        <p style="color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 20px; margin-bottom: 0; text-align: center;">
          You're receiving this because you have achievement notifications enabled.<br>
          <a href="${config.frontendUrl}/settings" style="color: #7C3AED;">Manage notification settings</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  },

  // ============================================
  // CONVENIENCE METHODS FOR SPECIFIC EVENTS
  // ============================================

  /**
   * Notify parent when child earns a badge
   */
  async notifyBadgeEarned(
    parentId: string,
    childId: string,
    childName: string,
    badgeName: string,
    badgeIcon?: string
  ): Promise<boolean> {
    return this.sendNotification({
      parentId,
      childId,
      childName,
      type: 'BADGE_EARNED',
      title: NOTIFICATION_MESSAGES.BADGE_EARNED.title(childName, badgeName),
      body: NOTIFICATION_MESSAGES.BADGE_EARNED.body(childName, badgeName),
      data: { badgeName, badgeIcon },
    });
  },

  /**
   * Notify parent when child levels up
   */
  async notifyLevelUp(
    parentId: string,
    childId: string,
    childName: string,
    newLevel: number
  ): Promise<boolean> {
    return this.sendNotification({
      parentId,
      childId,
      childName,
      type: 'LEVEL_UP',
      title: NOTIFICATION_MESSAGES.LEVEL_UP.title(childName, newLevel),
      body: NOTIFICATION_MESSAGES.LEVEL_UP.body(childName, newLevel),
      data: { newLevel },
    });
  },

  /**
   * Notify parent when child hits a streak milestone
   */
  async notifyStreakMilestone(
    parentId: string,
    childId: string,
    childName: string,
    streakDays: number
  ): Promise<boolean> {
    // Only notify on specific milestones
    const milestones = [3, 7, 14, 30, 60, 90, 180, 365];
    if (!milestones.includes(streakDays)) {
      return false;
    }

    return this.sendNotification({
      parentId,
      childId,
      childName,
      type: 'STREAK_MILESTONE',
      title: NOTIFICATION_MESSAGES.STREAK_MILESTONE.title(childName, streakDays),
      body: NOTIFICATION_MESSAGES.STREAK_MILESTONE.body(childName, streakDays),
      data: { streakDays },
    });
  },

  /**
   * Notify parent when child completes a lesson
   */
  async notifyLessonCompleted(
    parentId: string,
    childId: string,
    childName: string,
    lessonTitle: string,
    lessonId: string
  ): Promise<boolean> {
    return this.sendNotification({
      parentId,
      childId,
      childName,
      type: 'LESSON_COMPLETED',
      title: NOTIFICATION_MESSAGES.LESSON_COMPLETED.title(childName, lessonTitle),
      body: NOTIFICATION_MESSAGES.LESSON_COMPLETED.body(childName, lessonTitle),
      data: { lessonId, lessonTitle },
    });
  },

  // ============================================
  // PUSH TOKEN MANAGEMENT
  // ============================================

  /**
   * Register a push token for a parent
   */
  async registerPushToken(
    parentId: string,
    token: string,
    deviceType: 'ios' | 'android' | 'web',
    deviceName?: string
  ): Promise<void> {
    await prisma.parentPushToken.upsert({
      where: { token },
      update: {
        parentId,
        deviceType,
        deviceName,
        isActive: true,
        lastUsed: new Date(),
      },
      create: {
        parentId,
        token,
        deviceType,
        deviceName,
        isActive: true,
      },
    });

    logger.info('Push token registered', { parentId, deviceType });
  },

  /**
   * Remove a push token
   */
  async removePushToken(token: string): Promise<void> {
    await prisma.parentPushToken.updateMany({
      where: { token },
      data: { isActive: false },
    });
  },

  /**
   * Get notification history for a parent
   */
  async getNotificationHistory(
    parentId: string,
    limit: number = 20
  ): Promise<Array<{
    id: string;
    type: NotificationType;
    title: string;
    body: string;
    sentAt: Date;
    readAt: Date | null;
  }>> {
    const logs = await prisma.parentNotificationLog.findMany({
      where: { parentId },
      orderBy: { sentAt: 'desc' },
      take: limit,
      select: {
        id: true,
        type: true,
        title: true,
        body: true,
        sentAt: true,
        readAt: true,
      },
    });

    return logs;
  },

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    await prisma.parentNotificationLog.update({
      where: { id: notificationId },
      data: { readAt: new Date() },
    });
  },

  /**
   * Mark a notification as clicked
   */
  async markAsClicked(notificationId: string): Promise<void> {
    await prisma.parentNotificationLog.update({
      where: { id: notificationId },
      data: {
        readAt: new Date(),
        clickedAt: new Date(),
      },
    });
  },
};
