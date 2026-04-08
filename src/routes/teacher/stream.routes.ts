/**
 * Stream Routes — Teacher Intelligence Platform
 * CRUD for stream entries, tag corrections, search
 */
import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { CurriculumType, Subject } from '@prisma/client';
import { authenticateTeacher } from '../../middleware/teacherAuth.js';
import { streamRateLimit } from '../../middleware/rateLimit.js';
import { streamService } from '../../services/teacher/streamService.js';
import { streakService } from '../../services/teacher/streakService.js';
import { completionService } from '../../services/teacher/completionService.js';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

const router = Router();
router.use(authenticateTeacher);

// ============================================================================
// Onboarding (must come before param routes)
// ============================================================================

// Check if teacher has completed intelligence platform onboarding
router.get('/onboarding-status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: { preferredCurriculum: true, gradeRange: true, primarySubject: true },
    });
    const isComplete = !!(teacher?.preferredCurriculum && teacher?.gradeRange && teacher?.primarySubject);
    res.json({
      isComplete,
      curriculum: teacher?.preferredCurriculum || null,
      gradeRange: teacher?.gradeRange || null,
      primarySubject: teacher?.primarySubject || null,
    });
  } catch (error) {
    next(error);
  }
});

const onboardingSchema = z.object({
  curriculum: z.nativeEnum(CurriculumType),
  gradeRange: z.string().min(1),
  primarySubject: z.nativeEnum(Subject),
  additionalSubjects: z.array(z.nativeEnum(Subject)).optional(),
});

// Complete onboarding: save profile + seed curriculum graph
router.post('/onboarding', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = onboardingSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    }
    const teacherId = (req as any).teacher.id;
    const { curriculum, gradeRange, primarySubject, additionalSubjects } = parsed.data;

    // Update teacher profile
    await prisma.teacher.update({
      where: { id: teacherId },
      data: {
        preferredCurriculum: curriculum,
        gradeRange,
        primarySubject,
      },
    });

    // Load curriculum metadata for invisible standard matching (no visible graph nodes created)
    try {
      const { teachingGraphService } = await import('../../services/teacher/teachingGraphService.js');
      const subjects = [primarySubject, ...(additionalSubjects || [])];
      await teachingGraphService.seedCurriculumMetadata(teacherId, curriculum, gradeRange, subjects);
    } catch (err) {
      // Non-fatal: metadata loading can be retried
      logger.error('Failed to load curriculum metadata during onboarding', { error: (err as Error).message });
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// Inline Completions (Phase 4)
// ============================================================================

const completionSchema = z.object({
  currentInput: z.string().min(1).max(500),
});

// POST /stream/complete — Get inline completion suggestion
router.post('/complete', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = completionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.json({ completion: null });
    }
    const teacherId = (req as any).teacher.id;

    // Hard 800ms timeout on entire handler
    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 800));
    const completionPromise = completionService.getCompletion(teacherId, parsed.data.currentInput);

    const result = await Promise.race([completionPromise, timeout]);

    if (result) {
      return res.json({ completion: result.text, confidence: result.confidence });
    }
    return res.json({ completion: null });
  } catch (error) {
    // On any error, return null — never block the typing experience
    return res.json({ completion: null });
  }
});

// GET /stream/completions-status — Check if completions are enabled/eligible for this teacher
router.get('/completions-status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: { completionsEnabled: true, completionsEligible: true },
    });
    res.json({
      enabled: teacher?.completionsEnabled ?? true,
      eligible: teacher?.completionsEligible ?? false,
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /stream/completions-settings — Toggle completions on/off
router.patch('/completions-settings', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const { enabled } = req.body;
    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ error: 'enabled must be a boolean' });
    }
    await prisma.teacher.update({
      where: { id: teacherId },
      data: { completionsEnabled: enabled },
    });
    res.json({ enabled });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// Validation Schemas
// ============================================================================

const createEntrySchema = z.object({
  content: z.string().min(1, 'Content is required').max(10000, 'Content too long'),
  timezone: z.string().optional(),
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
router.post('/', streamRateLimit, async (req: Request, res: Response, next: NextFunction) => {
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

// ============================================================================
// Streak & Reflection
// ============================================================================

// Get reflection status (should we show the prompt?)
router.get('/reflection-status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const timezone = req.query.tz as string | undefined;
    const status = await streakService.getReflectionStatus(teacherId, timezone);
    res.json(status);
  } catch (error) {
    next(error);
  }
});

// Get streak info
router.get('/streak', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const streak = await streakService.getStreak(teacherId);
    res.json(streak);
  } catch (error) {
    next(error);
  }
});

// Update reflection settings
const reflectionSettingsSchema = z.object({
  reflectionTime: z.string().regex(/^\d{2}:\d{2}$/, 'Must be HH:MM format').optional(),
  reflectionEnabled: z.boolean().optional(),
});

router.patch('/reflection-settings', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = reflectionSettingsSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    }
    const teacherId = (req as any).teacher.id;
    const settings = await streakService.updateReflectionSettings(teacherId, parsed.data);
    res.json(settings);
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// Search & CRUD
// ============================================================================

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
