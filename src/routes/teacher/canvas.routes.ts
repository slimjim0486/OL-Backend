/**
 * Canvas Routes — Teacher Intelligence Platform (Phase 4-5)
 * CRUD for unit planning canvases, sequence validation, coverage checks
 */
import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticateTeacher } from '../../middleware/teacherAuth.js';
import { requireFeature } from '../../middleware/teacherFeatureGate.js';
import { IntelligenceMaterialType } from '@prisma/client';
import { canvasService } from '../../services/teacher/canvasService.js';
import { queueCanvasGeneration } from '../../jobs/canvasGenerationJob.js';
import { sseService } from '../../services/teacher/sseService.js';

const router = Router();
router.use(authenticateTeacher);
router.use(requireFeature('canvas'));

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

// Generate materials for all topics on canvas (left-to-right)
const generateSchema = z.object({
  materialType: z.nativeEnum(IntelligenceMaterialType),
});

router.post('/:id/generate-materials', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = generateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid material type', details: parsed.error.errors });
    }

    const teacherId = (req as any).teacher.id;
    const canvasId = req.params.id;

    const result = await canvasService.prepareCanvasGeneration(
      teacherId,
      canvasId,
      parsed.data.materialType
    );

    if (result.queued === 0) {
      return res.json({
        queued: 0,
        skipped: result.skipped,
        skippedLabels: result.skippedLabels,
        totalTopics: result.totalTopics,
        message: 'No topics to generate — all skipped or already have materials of this type.',
      });
    }

    // Queue jobs with staggered delays (3s apart)
    for (let i = 0; i < result.jobs.length; i++) {
      const job = result.jobs[i];
      await queueCanvasGeneration(
        {
          teacherId,
          canvasId,
          graphNodeId: job.graphNodeId,
          topicLabel: job.topicLabel,
          materialType: parsed.data.materialType,
          canvasItemId: job.canvasItemId,
          total: result.queued,
        },
        i * 3000 // 3-second stagger
      );
    }

    // Send initial SSE event so frontend knows the batch started
    sseService.sendEvent(teacherId, {
      type: 'canvas-generation-progress',
      data: {
        canvasId,
        started: true,
        total: result.queued,
        completed: 0,
        failed: 0,
      },
    });

    res.json({
      queued: result.queued,
      skipped: result.skipped,
      skippedLabels: result.skippedLabels,
      totalTopics: result.totalTopics,
    });
  } catch (error) {
    if ((error as any).status === 404) {
      return res.status(404).json({ error: 'Canvas not found' });
    }
    next(error);
  }
});

export default router;
