/**
 * Canvas Routes — Teacher Intelligence Platform (Phase 4-5)
 * CRUD for unit planning canvases, sequence validation, coverage checks
 */
import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticateTeacher } from '../../middleware/teacherAuth.js';
import { canvasService } from '../../services/teacher/canvasService.js';

const router = Router();
router.use(authenticateTeacher);

// ============================================================================
// Validation Schemas
// ============================================================================

const createCanvasSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
});

const updateCanvasSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).nullable().optional(),
  canvasData: z.any().optional(), // Full JSON replacement — validated at service level
});

// ============================================================================
// Routes
// ============================================================================

// Create new canvas
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = createCanvasSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    }
    const teacherId = (req as any).teacher.id;
    const canvas = await canvasService.createCanvas(teacherId, parsed.data);
    res.status(201).json(canvas);
  } catch (error) {
    next(error);
  }
});

// List all canvases
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const canvases = await canvasService.listCanvases(teacherId);
    res.json({ canvases });
  } catch (error) {
    next(error);
  }
});

// Get single canvas with full data
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const canvas = await canvasService.getCanvas(teacherId, req.params.id);
    res.json(canvas);
  } catch (error) {
    if ((error as any).status === 404) {
      return res.status(404).json({ error: 'Canvas not found' });
    }
    next(error);
  }
});

// Update canvas (title, description, canvasData)
router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = updateCanvasSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    }
    const teacherId = (req as any).teacher.id;
    const canvas = await canvasService.updateCanvas(teacherId, req.params.id, parsed.data);
    res.json(canvas);
  } catch (error) {
    if ((error as any).status === 404) {
      return res.status(404).json({ error: 'Canvas not found' });
    }
    next(error);
  }
});

// Archive (soft delete) canvas
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    await canvasService.archiveCanvas(teacherId, req.params.id);
    res.json({ success: true });
  } catch (error) {
    if ((error as any).status === 404) {
      return res.status(404).json({ error: 'Canvas not found' });
    }
    next(error);
  }
});

// Validate topic sequence on a canvas
router.post('/:id/validate-sequence', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const validations = await canvasService.validateSequence(teacherId, req.params.id);
    res.json({ validations });
  } catch (error) {
    if ((error as any).status === 404) {
      return res.status(404).json({ error: 'Canvas not found' });
    }
    next(error);
  }
});

// Check curriculum coverage on a canvas
router.get('/:id/coverage', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const coverage = await canvasService.checkCoverage(teacherId, req.params.id);
    res.json(coverage);
  } catch (error) {
    if ((error as any).status === 404) {
      return res.status(404).json({ error: 'Canvas not found' });
    }
    next(error);
  }
});

export default router;
