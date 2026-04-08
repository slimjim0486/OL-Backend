/**
 * Student Routes — Teacher Intelligence Platform (Phase 2)
 * Silent student entity linking: list, search, get timeline, merge, backlinks
 */
import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticateTeacher } from '../../middleware/teacherAuth.js';
import { studentMentionService } from '../../services/teacher/studentMentionService.js';

const router = Router();
router.use(authenticateTeacher);

// List all detected students/groups (sorted by mention count)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const result = await studentMentionService.listStudents(teacherId, {
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      sortBy: (req.query.sortBy as 'mentions' | 'recent') || 'mentions',
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Search students by name
router.get('/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ error: 'Search query (q) is required' });
    }
    const students = await studentMentionService.searchStudents(teacherId, query);
    res.json({ students });
  } catch (error) {
    next(error);
  }
});

// Get full student profile with timeline and unlinked mentions
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const result = await studentMentionService.getStudent(teacherId, req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Backlinks: promote an unlinked mention to a linked entry on this student
const linkEntrySchema = z.object({
  streamEntryId: z.string().min(1),
});

router.post('/:id/link', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = linkEntrySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    }
    const teacherId = (req as any).teacher.id;
    const updated = await studentMentionService.linkEntryToStudent(
      teacherId,
      req.params.id,
      parsed.data.streamEntryId,
    );
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

// Merge two student records
router.post('/:sourceId/merge/:targetId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const merged = await studentMentionService.mergeStudents(
      teacherId,
      req.params.sourceId,
      req.params.targetId
    );
    res.json(merged);
  } catch (error) {
    next(error);
  }
});

export default router;
