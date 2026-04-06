/**
 * Stream Routes — Teacher Intelligence Platform
 * CRUD for stream entries, tag corrections, search
 */
import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticateTeacher } from '../../middleware/teacherAuth.js';
import { streamService } from '../../services/teacher/streamService.js';
import { logger } from '../../utils/logger.js';

const router = Router();
router.use(authenticateTeacher);

// ============================================================================
// Validation Schemas
// ============================================================================

const createEntrySchema = z.object({
  content: z.string().min(1, 'Content is required').max(10000, 'Content too long'),
});

const updateEntrySchema = z.object({
  content: z.string().min(1).max(10000).optional(),
  pinned: z.boolean().optional(),
  archived: z.boolean().optional(),
});

const tagCorrectionsSchema = z.object({
  dismissed: z.array(z.string()).optional(),
  added: z.array(z.object({ type: z.string(), value: z.string() })).optional(),
  corrected: z.array(z.object({ original: z.string(), corrected: z.string() })).optional(),
});

// ============================================================================
// Routes
// ============================================================================

// Create stream entry
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = createEntrySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    }
    const teacherId = (req as any).teacher.id;
    const entry = await streamService.createEntry(teacherId, parsed.data);

    // Queue extraction job (imported dynamically to avoid circular deps)
    try {
      const { queueStreamExtraction } = await import('../../jobs/streamExtractionJob.js');
      await queueStreamExtraction({ entryId: entry.id, teacherId });
    } catch (err) {
      // Non-fatal: extraction will be retried or can be triggered manually
      logger.error('Failed to queue stream extraction', { error: (err as Error).message });
    }

    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
});

// List stream entries (paginated, filterable)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const result = await streamService.listEntries(teacherId, {
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      subject: req.query.subject as string | undefined,
      topic: req.query.topic as string | undefined,
      dateFrom: req.query.dateFrom as string | undefined,
      dateTo: req.query.dateTo as string | undefined,
      pinned: req.query.pinned !== undefined ? req.query.pinned === 'true' : undefined,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Search stream entries
router.get('/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ error: 'Search query (q) is required' });
    }
    const entries = await streamService.searchEntries(teacherId, query);
    res.json({ entries });
  } catch (error) {
    next(error);
  }
});

// Get single stream entry
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const entry = await streamService.getEntry(teacherId, req.params.id);
    res.json(entry);
  } catch (error) {
    next(error);
  }
});

// Update stream entry
router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = updateEntrySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    }
    const teacherId = (req as any).teacher.id;
    const { entry, contentChanged } = await streamService.updateEntry(teacherId, req.params.id, parsed.data);

    // Re-queue extraction if content changed
    if (contentChanged) {
      try {
        const { queueStreamExtraction } = await import('../../jobs/streamExtractionJob.js');
        await queueStreamExtraction({ entryId: entry.id, teacherId });
      } catch (err) {
        logger.error('Failed to queue stream re-extraction', { error: (err as Error).message });
      }
    }

    res.json(entry);
  } catch (error) {
    next(error);
  }
});

// Archive (soft delete) stream entry
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    await streamService.deleteEntry(teacherId, req.params.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Correct tags on a stream entry
router.post('/:id/tags', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = tagCorrectionsSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    }
    const teacherId = (req as any).teacher.id;
    const entry = await streamService.correctTags(teacherId, req.params.id, parsed.data);
    res.json(entry);
  } catch (error) {
    next(error);
  }
});

export default router;
