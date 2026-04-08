/**
 * Materials Routes — Teacher Intelligence Platform
 * CRUD for teacher materials, generation from stream/graph, approval, rating
 */
import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { IntelligenceMaterialType } from '@prisma/client';
import { authenticateTeacher } from '../../middleware/teacherAuth.js';
import { generationRateLimit } from '../../middleware/rateLimit.js';
import { materialService } from '../../services/teacher/materialService.js';

const router = Router();
router.use(authenticateTeacher);

// ============================================================================
// Validation Schemas
// ============================================================================

const materialTypeEnum = z.nativeEnum(IntelligenceMaterialType);

const updateMaterialSchema = z.object({
  title: z.string().optional(),
  content: z.any().optional(),
  notes: z.string().max(5000).optional(),
  approved: z.boolean().optional(),
  edited: z.boolean().optional(),
  editDiff: z.any().optional(),
  rating: z.number().int().min(1).max(5).optional(),
  usedInClass: z.boolean().optional(),
});

const generateFromStreamSchema = z.object({
  materialType: materialTypeEnum,
  additionalContext: z.string().max(2000).optional(),
});

// ============================================================================
// Routes
// ============================================================================

// List materials (paginated, filterable)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const result = await materialService.listMaterials(teacherId, {
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      subject: req.query.subject as string | undefined,
      type: req.query.type as IntelligenceMaterialType | undefined,
      dateFrom: req.query.dateFrom as string | undefined,
      dateTo: req.query.dateTo as string | undefined,
      standard: req.query.standard as string | undefined,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Search materials
router.get('/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ error: 'Search query (q) is required' });
    }
    const materials = await materialService.searchMaterials(teacherId, query);
    res.json({ materials });
  } catch (error) {
    next(error);
  }
});

// Material stats
router.get('/stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const stats = await materialService.getMaterialStats(teacherId);
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

// Materials by topic
router.get('/topic/:topic', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const materials = await materialService.getMaterialsByTopic(teacherId, req.params.topic);
    res.json({ materials });
  } catch (error) {
    next(error);
  }
});

// Get single material
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const material = await materialService.getMaterial(teacherId, req.params.id);
    res.json(material);
  } catch (error) {
    next(error);
  }
});

// Update material
router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = updateMaterialSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    }
    const teacherId = (req as any).teacher.id;
    const material = await materialService.updateMaterial(teacherId, req.params.id, parsed.data);
    res.json(material);
  } catch (error) {
    next(error);
  }
});

// Delete material
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    await materialService.deleteMaterial(teacherId, req.params.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Generate material from stream entry
router.post('/generate/from-stream/:entryId', generationRateLimit, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = generateFromStreamSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    }
    const teacherId = (req as any).teacher.id;
    const material = await materialService.generateFromStream(teacherId, req.params.entryId, parsed.data);
    res.status(201).json(material);
  } catch (error) {
    next(error);
  }
});

// Generate material from graph node
router.post('/generate/from-node/:nodeId', generationRateLimit, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = generateFromStreamSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    }
    const teacherId = (req as any).teacher.id;
    const material = await materialService.generateFromNode(teacherId, req.params.nodeId, parsed.data);
    res.status(201).json(material);
  } catch (error) {
    next(error);
  }
});

// Approve material
router.post('/:id/approve', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const material = await materialService.approveMaterial(teacherId, req.params.id);
    res.json(material);
  } catch (error) {
    next(error);
  }
});

// Rate material (1-5)
const rateSchema = z.object({
  rating: z.number().int().min(1).max(5),
});

router.post('/:id/rate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = rateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    }
    const teacherId = (req as any).teacher.id;
    const material = await materialService.rateMaterial(teacherId, req.params.id, parsed.data.rating);
    res.json(material);
  } catch (error) {
    next(error);
  }
});

// Mark material as used in class
router.post('/:id/used', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const material = await materialService.markMaterialUsed(teacherId, req.params.id);
    res.json(material);
  } catch (error) {
    next(error);
  }
});

// Record outcome after using material in class
const outcomeSchema = z.object({
  outcomeRating: z.enum(['WORKED', 'NEEDED_TWEAKS', 'DIDNT_WORK']),
  outcomeNotes: z.string().max(2000).optional(),
});

router.post('/:id/outcome', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = outcomeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    }
    const teacherId = (req as any).teacher.id;
    const material = await materialService.updateMaterial(teacherId, req.params.id, {
      ...parsed.data,
      outcomeRatedAt: new Date(),
    } as any);
    res.json(material);
  } catch (error) {
    next(error);
  }
});

export default router;
