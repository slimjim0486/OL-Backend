/**
 * Brainstorm Routes
 *
 * Curriculum-aware brainstorming for teachers with Ollie.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { brainstormService } from '../../services/teacher/brainstormService.js';
import { quotaService } from '../../services/teacher/quotaService.js';
import { authenticateTeacher } from '../../middleware/teacherAuth.js';
import { enforceTokenQuota } from '../../middleware/tokenQuota.js';
import { CurriculumType, Subject, TokenOperation } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

const router = Router();

// All routes require teacher authentication
router.use(authenticateTeacher);

// ============================================================================
// Validation Helpers
// ============================================================================

function validateBody<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: result.error.errors,
      });
    }
    req.body = result.data;
    next();
  };
}

function validateQuery<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: result.error.errors,
      });
    }
    (req as any).validatedQuery = result.data;
    next();
  };
}

// ============================================================================
// Schemas
// ============================================================================

const createSessionSchema = z.object({
  lessonId: z.string().optional(),
  initialMessage: z.string().optional(),
  curriculumType: z.nativeEnum(CurriculumType).optional(),
  gradeLevel: z.string().optional(),
  subject: z.nativeEnum(Subject).optional(),
});

const listSessionsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  curriculumType: z.nativeEnum(CurriculumType).optional(),
  subject: z.nativeEnum(Subject).optional(),
  search: z.string().optional(),
});

const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required'),
});

const updateTitleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
});

const exportSchema = z.object({
  format: z.enum(['markdown', 'text']),
});

const standardsSearchSchema = z.object({
  curriculumType: z.nativeEnum(CurriculumType),
  subject: z.nativeEnum(Subject),
  gradeLevel: z.string().optional(),
  topic: z.string().min(1, 'Topic is required'),
});

const preferencesSchema = z.object({
  preferredCurriculum: z.nativeEnum(CurriculumType).nullable().optional(),
  preferredGradeRange: z.string().nullable().optional(),
});

// ============================================================================
// Routes
// ============================================================================

// Create new brainstorm session
router.post(
  '/',
  validateBody(createSessionSchema),
  async (req: Request, res: Response) => {
    try {
      const teacherId = req.teacher!.id;
      const session = await brainstormService.createSession(teacherId, req.body);
      res.status(201).json({ success: true, data: session });
    } catch (error) {
      logger.error('Error creating brainstorm session', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to create brainstorm session',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);

// List sessions (with curriculum/subject filters)
router.get(
  '/',
  validateQuery(listSessionsSchema),
  async (req: Request, res: Response) => {
    try {
      const teacherId = req.teacher!.id;
      const query = (req as any).validatedQuery as z.infer<typeof listSessionsSchema>;
      const result = await brainstormService.listSessions(teacherId, query);

      res.json({
        success: true,
        data: result.sessions,
        total: result.total,
        page: query.page,
        limit: query.limit,
      });
    } catch (error) {
      logger.error('Error listing brainstorm sessions', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to list brainstorm sessions',
      });
    }
  }
);

// Search relevant standards for topic
router.get(
  '/standards/search',
  validateQuery(standardsSearchSchema),
  async (req: Request, res: Response) => {
    try {
      const query = (req as any).validatedQuery as z.infer<typeof standardsSearchSchema>;
      const standards = await brainstormService.findRelevantStandards(
        query.curriculumType,
        query.subject,
        query.gradeLevel || '',
        query.topic
      );

      res.json({
        success: true,
        data: standards,
      });
    } catch (error) {
      logger.error('Error searching standards', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to search standards',
      });
    }
  }
);

// Get teacher's curriculum preferences
router.get('/preferences', async (req: Request, res: Response) => {
  try {
    const teacherId = req.teacher!.id;
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: {
        preferredCurriculum: true,
        preferredGradeRange: true,
      },
    });

    res.json({
      success: true,
      data: teacher || { preferredCurriculum: null, preferredGradeRange: null },
    });
  } catch (error) {
    logger.error('Error fetching brainstorm preferences', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch preferences',
    });
  }
});

// Update teacher's curriculum preferences
router.patch(
  '/preferences',
  validateBody(preferencesSchema),
  async (req: Request, res: Response) => {
    try {
      const teacherId = req.teacher!.id;
      const data = req.body as z.infer<typeof preferencesSchema>;

      const updateData: Record<string, unknown> = {};
      if (Object.prototype.hasOwnProperty.call(data, 'preferredCurriculum')) {
        updateData.preferredCurriculum = data.preferredCurriculum;
      }
      if (Object.prototype.hasOwnProperty.call(data, 'preferredGradeRange')) {
        updateData.preferredGradeRange = data.preferredGradeRange;
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No preferences provided',
        });
      }

      const updated = await prisma.teacher.update({
        where: { id: teacherId },
        data: updateData,
        select: {
          preferredCurriculum: true,
          preferredGradeRange: true,
        },
      });

      res.json({ success: true, data: updated });
    } catch (error) {
      logger.error('Error updating brainstorm preferences', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to update preferences',
      });
    }
  }
);

// Get single session with messages
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const teacherId = req.teacher!.id;
    const session = await brainstormService.getSession(req.params.id, teacherId);
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }
    res.json({ success: true, data: session });
  } catch (error) {
    logger.error('Error fetching brainstorm session', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to fetch session',
    });
  }
});

// Delete session
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const teacherId = req.teacher!.id;
    await brainstormService.deleteSession(req.params.id, teacherId);
    res.json({ success: true });
  } catch (error) {
    logger.error('Error deleting brainstorm session', { error });
    res.status(500).json({
      success: false,
      error: 'Failed to delete session',
    });
  }
});

// Send message (with quota enforcement)
router.post(
  '/:id/message',
  enforceTokenQuota(TokenOperation.BRAINSTORM, 800),
  validateBody(sendMessageSchema),
  async (req: Request, res: Response) => {
    try {
      const teacherId = req.teacher!.id;
      const { content } = req.body as z.infer<typeof sendMessageSchema>;

      const result = await brainstormService.sendMessage(req.params.id, teacherId, content);
      const creditBalance = await quotaService.getCreditBalance(teacherId);

      res.json({
        success: true,
        data: {
          ...result,
          remainingCredits: creditBalance.remaining,
        },
      });
    } catch (error) {
      logger.error('Error sending brainstorm message', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to send message',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);

// Update session title
router.patch(
  '/:id/title',
  validateBody(updateTitleSchema),
  async (req: Request, res: Response) => {
    try {
      const teacherId = req.teacher!.id;
      const { title } = req.body as z.infer<typeof updateTitleSchema>;
      await brainstormService.updateTitle(req.params.id, teacherId, title);
      res.json({ success: true });
    } catch (error) {
      logger.error('Error updating brainstorm title', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to update title',
      });
    }
  }
);

// Export session
router.post(
  '/:id/export',
  validateBody(exportSchema),
  async (req: Request, res: Response) => {
    try {
      const teacherId = req.teacher!.id;
      const { format } = req.body as z.infer<typeof exportSchema>;
      const content = await brainstormService.exportSession(req.params.id, teacherId, format);
      res.json({ success: true, data: { content } });
    } catch (error) {
      logger.error('Error exporting brainstorm session', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to export session',
      });
    }
  }
);

export default router;
