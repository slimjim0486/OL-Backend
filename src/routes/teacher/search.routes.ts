import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticateTeacher } from '../../middleware/teacherAuth.js';
import { unifiedSearch } from '../../services/teacher/searchService.js';

const router = Router();
router.use(authenticateTeacher);

const querySchema = z.object({
  q: z.string().trim().min(1, 'Search query (q) is required'),
  limit: z.coerce.number().int().min(1).max(20).optional(),
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    }

    const teacherId = (req as any).teacher.id;
    const result = await unifiedSearch({
      teacherId,
      query: parsed.data.q,
      limit: parsed.data.limit,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
