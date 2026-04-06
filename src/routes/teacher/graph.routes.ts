/**
 * Graph Routes — Teacher Intelligence Platform
 * Teaching graph visualization, node details, gap detection, curriculum seeding
 */
import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticateTeacher } from '../../middleware/teacherAuth.js';
import { teachingGraphService } from '../../services/teacher/teachingGraphService.js';
import { curriculumAdapterService } from '../../services/teacher/curriculumAdapterService.js';

const router = Router();
router.use(authenticateTeacher);

// ============================================================================
// Routes
// ============================================================================

// Get full graph data for visualization
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const graph = await teachingGraphService.getFullGraph(teacherId);
    res.json(graph);
  } catch (error) {
    next(error);
  }
});

// Get graph statistics
router.get('/stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const stats = await teachingGraphService.getStats(teacherId);
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

// Get gap edges (prerequisites not yet covered)
router.get('/gaps', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const gaps = await teachingGraphService.getGaps(teacherId);
    res.json({ gaps });
  } catch (error) {
    next(error);
  }
});

// Get single node with connections, related entries, and materials
router.get('/node/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const detail = await teachingGraphService.getNodeDetail(teacherId, req.params.id);
    res.json(detail);
  } catch (error) {
    next(error);
  }
});

// Seed curriculum nodes from existing standards data
const seedSchema = z.object({
  curriculum: z.string().min(1),
  gradeLevel: z.string().min(1),
  subjects: z.array(z.string()).min(1),
});

router.post('/seed', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = seedSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    }
    const teacherId = (req as any).teacher.id;
    const result = await teachingGraphService.seedCurriculumNodes(
      teacherId,
      parsed.data.curriculum,
      parsed.data.gradeLevel,
      parsed.data.subjects
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get available standards count for a curriculum/grade/subject
router.get('/standards-count', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { curriculum, gradeLevel, subject } = req.query;
    if (!curriculum) {
      return res.status(400).json({ error: 'curriculum query param is required' });
    }
    const count = await curriculumAdapterService.getStandardsCount(
      curriculum as string,
      gradeLevel as string | undefined,
      subject as string | undefined
    );
    res.json({ count });
  } catch (error) {
    next(error);
  }
});

export default router;
