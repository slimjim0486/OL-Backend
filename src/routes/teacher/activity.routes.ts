// Teacher Activity Routes
// Provides recent activity feed for the notification dropdown

import { Router, Request, Response, NextFunction } from 'express';
import { activityService } from '../../services/teacher/activityService.js';
import { authenticateTeacher, requireTeacher } from '../../middleware/teacherAuth.js';

const router = Router();

/**
 * GET /api/teacher/activities
 * Get recent activities for the teacher
 *
 * Query params:
 * - limit: number (default: 10, max: 20)
 *
 * Response:
 * {
 *   success: true,
 *   data: {
 *     activities: ActivityItem[],
 *     hasNew: boolean,
 *     newestTimestamp: string | null
 *   }
 * }
 */
router.get(
  '/',
  authenticateTeacher,
  requireTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = Math.min(
        Math.max(1, parseInt(req.query.limit as string) || 10),
        20
      );

      const result = await activityService.getRecentActivities(
        req.teacher!.id,
        limit
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
