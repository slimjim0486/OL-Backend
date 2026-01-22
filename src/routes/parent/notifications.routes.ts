/**
 * Parent Notification Routes
 *
 * Endpoints for managing notification preferences and viewing notification history.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate, requireParent } from '../../middleware/auth.js';
import { parentNotificationService } from '../../services/parent/notificationService.js';
import { logger } from '../../utils/logger.js';

const router = Router();

// ============================================
// VALIDATION SCHEMAS
// ============================================

const updatePreferencesSchema = z.object({
  pushEnabled: z.boolean().optional(),
  emailEnabled: z.boolean().optional(),
  achievementAlerts: z.boolean().optional(),
  streakAlerts: z.boolean().optional(),
  lessonAlerts: z.boolean().optional(),
  weeklyDigest: z.boolean().optional(),
  quietHoursEnabled: z.boolean().optional(),
  quietHoursStart: z.number().min(0).max(23).nullable().optional(),
  quietHoursEnd: z.number().min(0).max(23).nullable().optional(),
});

const registerTokenSchema = z.object({
  token: z.string().min(1),
  deviceType: z.enum(['ios', 'android', 'web']),
  deviceName: z.string().optional(),
});

const removeTokenSchema = z.object({
  token: z.string().min(1),
});

// ============================================
// ROUTES
// ============================================

/**
 * GET /api/parent/notifications/preferences
 * Get notification preferences for the authenticated parent
 */
router.get(
  '/preferences',
  authenticate,
  requireParent,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parentId = req.parent!.id;
      const preferences = await parentNotificationService.getPreferences(parentId);

      res.json({
        success: true,
        data: preferences,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT /api/parent/notifications/preferences
 * Update notification preferences
 */
router.put(
  '/preferences',
  authenticate,
  requireParent,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parentId = req.parent!.id;

      // Validate input
      const validationResult = updatePreferencesSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid input',
          details: validationResult.error.errors,
        });
      }

      const preferences = await parentNotificationService.updatePreferences(
        parentId,
        validationResult.data
      );

      logger.info('Notification preferences updated', { parentId });

      res.json({
        success: true,
        data: preferences,
        message: 'Notification preferences updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/parent/notifications/history
 * Get notification history for the authenticated parent
 */
router.get(
  '/history',
  authenticate,
  requireParent,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parentId = req.parent!.id;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

      const history = await parentNotificationService.getNotificationHistory(parentId, limit);

      res.json({
        success: true,
        data: history,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/parent/notifications/read/:id
 * Mark a notification as read
 */
router.post(
  '/read/:id',
  authenticate,
  requireParent,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      await parentNotificationService.markAsRead(id);

      res.json({
        success: true,
        message: 'Notification marked as read',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/parent/notifications/clicked/:id
 * Mark a notification as clicked (also marks as read)
 */
router.post(
  '/clicked/:id',
  authenticate,
  requireParent,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      await parentNotificationService.markAsClicked(id);

      res.json({
        success: true,
        message: 'Notification marked as clicked',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/parent/notifications/token
 * Register a push notification token (FCM)
 */
router.post(
  '/token',
  authenticate,
  requireParent,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parentId = req.parent!.id;

      // Validate input
      const validationResult = registerTokenSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid input',
          details: validationResult.error.errors,
        });
      }

      const { token, deviceType, deviceName } = validationResult.data;

      await parentNotificationService.registerPushToken(
        parentId,
        token,
        deviceType,
        deviceName
      );

      logger.info('Push token registered', { parentId, deviceType });

      res.json({
        success: true,
        message: 'Push token registered successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/parent/notifications/token
 * Remove a push notification token
 */
router.delete(
  '/token',
  authenticate,
  requireParent,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate input
      const validationResult = removeTokenSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid input',
          details: validationResult.error.errors,
        });
      }

      const { token } = validationResult.data;

      await parentNotificationService.removePushToken(token);

      res.json({
        success: true,
        message: 'Push token removed successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/parent/notifications/test
 * Send a test notification (development only)
 */
router.post(
  '/test',
  authenticate,
  requireParent,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Only allow in development
      if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({
          success: false,
          error: 'Test notifications not available in production',
        });
      }

      const parentId = req.parent!.id;

      // Get first child for test
      const parent = await import('../../config/database.js').then(m =>
        m.prisma.parent.findUnique({
          where: { id: parentId },
          include: { children: { take: 1 } },
        })
      );

      if (!parent || parent.children.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No children found for test notification',
        });
      }

      const child = parent.children[0];

      const sent = await parentNotificationService.notifyBadgeEarned(
        parentId,
        child.id,
        child.displayName,
        'Test Explorer Badge'
      );

      res.json({
        success: true,
        data: { sent },
        message: sent ? 'Test notification sent' : 'Notification not sent (check preferences)',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
