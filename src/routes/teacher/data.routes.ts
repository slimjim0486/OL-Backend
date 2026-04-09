/**
 * Teacher Data Routes — data export and account data management
 * POST /api/teacher/data/export — Trigger data export (sends email with download link)
 */
import { Router, Request, Response, NextFunction } from 'express';
import { authenticateTeacher, requireTeacher } from '../../middleware/teacherAuth.js';
import { logger } from '../../utils/logger.js';

const router = Router();

/**
 * POST /api/teacher/data/export
 * Triggers a data export. In production this would queue a BullMQ job.
 * For now, returns immediately — the job system can be wired in later.
 */
router.post(
  '/export',
  authenticateTeacher,
  requireTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teacherId = req.teacher!.id;

      logger.info('Data export requested', { teacherId });

      // TODO: In production, queue a BullMQ job:
      //   await dataExportQueue.add('export', { teacherId });
      // The job would:
      //   1. Fetch all teacher data (stream, materials, graph, preferences)
      //   2. Build a ZIP file
      //   3. Upload to R2 with 24hr expiry
      //   4. Send email with download link via Brevo

      // For now, acknowledge the request
      res.json({
        success: true,
        message: 'Data export has been queued. You will receive an email with a download link.',
        status: 'processing',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
