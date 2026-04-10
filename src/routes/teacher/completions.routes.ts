/**
 * Completions Routes — Surface-aware ghost-text completions
 * Generalizes the stream-only endpoint to work across all composition surfaces.
 */
import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticateTeacher } from '../../middleware/teacherAuth.js';
import { requireFeature } from '../../middleware/teacherFeatureGate.js';
import { completionService } from '../../services/teacher/completionService.js';
import { prisma } from '../../config/database.js';

const router = Router();
router.use(authenticateTeacher);

const VALID_SURFACES = ['stream', 'parent_email', 'iep_goal', 'sub_plan', 'report_comment'] as const;

const completionSchema = z.object({
  currentInput: z.string().min(1).max(500),
  surface: z.enum(VALID_SURFACES).default('stream'),
  studentName: z.string().max(100).optional(),
  subject: z.string().max(100).optional(),
  materialType: z.string().max(50).optional(),
  topic: z.string().max(200).optional(),
});

// POST /completions — Surface-aware completion
router.post('/', requireFeature('inline-completions'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = completionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.json({ completion: null });
    }

    const teacherId = (req as any).teacher.id;
    const { currentInput, surface, studentName, subject, materialType, topic } = parsed.data;

    // Hard 800ms timeout on entire handler
    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 800));
    const completionPromise = completionService.getCompletion(
      teacherId,
      currentInput,
      surface,
      { studentName, subject, materialType, topic }
    );

    const result = await Promise.race([completionPromise, timeout]);

    if (result) {
      return res.json({ completion: result.text, confidence: result.confidence });
    }
    return res.json({ completion: null });
  } catch (error) {
    return res.json({ completion: null });
  }
});

// GET /completions/status — Eligibility check
router.get('/status', requireFeature('inline-completions'), async (req: Request, res: Response, next: NextFunction) => {
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

// PATCH /completions/settings — Toggle on/off
router.patch('/settings', requireFeature('inline-completions'), async (req: Request, res: Response, next: NextFunction) => {
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

    res.json({ success: true, enabled });
  } catch (error) {
    next(error);
  }
});

export default router;
