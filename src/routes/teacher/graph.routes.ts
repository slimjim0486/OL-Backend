/**
 * Graph Routes — Teacher Intelligence Platform
 * Thought-centric graph: teacher's notes, materials, topic clusters.
 * Curriculum standards are invisible metadata — never returned as nodes.
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

// Get full graph data for visualization (TOPIC, STREAM_ENTRY, MATERIAL nodes only)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const graph = await teachingGraphService.getFullGraph(teacherId);
    res.json(graph);
  } catch (error) {
    next(error);
  }
});

// Get graph statistics (topics, notes, materials, subjects — NOT standard counts)
router.get('/stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const stats = await teachingGraphService.getStats(teacherId);
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

// Get ghost nodes — strand-grouped curriculum gaps the teacher hasn't
// touched yet. Rendered on the graph as faint dashed outlines; this is the
// replacement for the old CURRICULUM_GAP nudge cards in the stream.
router.get('/ghosts', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const ghosts = await teachingGraphService.getGhostNodes(teacherId);
    res.json({ ghosts });
  } catch (error) {
    next(error);
  }
});

// Get single node with connections, related entries, materials, and unlinked mentions
router.get('/node/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const detail = await teachingGraphService.getNodeDetail(teacherId, req.params.id);
    res.json(detail);
  } catch (error) {
    next(error);
  }
});

// Backlinks: promote an unlinked mention to a linked note on this topic
const linkEntrySchema = z.object({
  streamEntryId: z.string().min(1),
});

router.post('/node/:id/link', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = linkEntrySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    }
    const teacherId = (req as any).teacher.id;
    const result = await teachingGraphService.linkEntryToNode(
      teacherId,
      req.params.id,
      parsed.data.streamEntryId,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Seed invisible curriculum metadata from existing standards (onboarding)
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
    const result = await teachingGraphService.seedCurriculumMetadata(
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

// Get standards coverage summary (% covered per subject, gap list)
router.get('/coverage', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const coverage = await teachingGraphService.getCoverage(teacherId);
    res.json(coverage);
  } catch (error) {
    next(error);
  }
});

export default router;
