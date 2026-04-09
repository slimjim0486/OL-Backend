/**
 * Notification Routes — Teacher Intelligence Platform
 * Bell notifications, whisper endpoint, preferences
 */
import { Router, Request, Response, NextFunction } from 'express';
import { authenticateTeacher } from '../../middleware/teacherAuth.js';
import { notificationService } from '../../services/teacher/notificationService.js';
import { prisma } from '../../config/database.js';

const router = Router();
router.use(authenticateTeacher);

// ============================================================================
// Bell Notifications
// ============================================================================

// Unread count (for badge)
router.get('/unread-count', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const count = await notificationService.getUnreadCount(teacherId);
    res.json({ count });
  } catch (error) {
    next(error);
  }
});

// List bell notifications (paginated)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
    const offset = parseInt(req.query.offset as string) || 0;
    const result = await notificationService.getBellNotifications(teacherId, limit, offset);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Mark single notification as read
router.post('/:id/read', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    await notificationService.markRead(teacherId, req.params.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Dismiss a notification
router.post('/:id/dismiss', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    await notificationService.dismiss(teacherId, req.params.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Mark all as read
router.post('/read-all', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    await notificationService.markAllRead(teacherId);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// Notification Preferences
// ============================================================================

router.get('/preferences', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: {
        notifyWeeklyDigest: true,
        emailStreakEnabled: true,
        reflectionEnabled: true,
        reflectionTime: true,
      },
    });
    res.json({
      emailDigestEnabled: teacher?.notifyWeeklyDigest ?? true,
      emailStreakEnabled: teacher?.emailStreakEnabled ?? true,
      reflectionEnabled: teacher?.reflectionEnabled ?? true,
      reflectionReminderTime: teacher?.reflectionTime ?? '15:30',
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/preferences', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const { emailDigestEnabled, emailStreakEnabled, reflectionEnabled, reflectionReminderTime } = req.body;

    const data: Record<string, any> = {};
    if (emailDigestEnabled !== undefined) data.notifyWeeklyDigest = !!emailDigestEnabled;
    if (emailStreakEnabled !== undefined) data.emailStreakEnabled = !!emailStreakEnabled;
    if (reflectionEnabled !== undefined) data.reflectionEnabled = !!reflectionEnabled;
    if (reflectionReminderTime !== undefined) {
      // Validate HH:MM format
      if (/^\d{2}:\d{2}$/.test(reflectionReminderTime)) {
        data.reflectionTime = reflectionReminderTime;
      }
    }

    if (Object.keys(data).length > 0) {
      await prisma.teacher.update({
        where: { id: teacherId },
        data,
      });
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
