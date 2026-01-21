// Teacher Content Template routes - CRUD operations for reusable templates
import { Router, Request, Response, NextFunction } from 'express';
import { templateService } from '../../services/teacher/templateService.js';
import { authenticateTeacher, requireTeacher } from '../../middleware/teacherAuth.js';
import { validateInput } from '../../middleware/validateInput.js';
import { z } from 'zod';
import { TeacherContentType, Subject } from '@prisma/client';

const router = Router();

// ============================================
// VALIDATION SCHEMAS
// ============================================

const templateSectionSchema = z.object({
  type: z.string().min(1),
  title: z.string().min(1).max(255),
  prompt: z.string().min(1).max(2000),
  duration: z.string().max(50).optional(),
  count: z.number().min(1).max(100).optional(),
  optional: z.boolean().optional(),
});

const templateStructureSchema = z.object({
  sections: z.array(templateSectionSchema).min(1).max(20),
  activityTypes: z.array(z.string()).optional(),
  assessmentStyle: z.string().optional(),
  questionTypes: z.array(z.string()).optional(),
  questionCount: z.number().min(1).max(100).optional(),
  flashcardCount: z.number().min(1).max(100).optional(),
  includeHints: z.boolean().optional(),
  includeExamples: z.boolean().optional(),
});

const templateDefaultSettingsSchema = z.object({
  difficultyProgression: z.boolean().optional(),
  includeVisuals: z.boolean().optional(),
  vocabularySupport: z.boolean().optional(),
  adaptToGradeLevel: z.boolean().optional(),
}).optional();

const createTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().max(2000).optional(),
  contentType: z.nativeEnum(TeacherContentType),
  subject: z.nativeEnum(Subject).optional(),
  gradeLevel: z.string().max(20).optional(),
  structure: templateStructureSchema,
  defaultSettings: templateDefaultSettingsSchema,
});

const updateTemplateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional().nullable(),
  subject: z.nativeEnum(Subject).optional().nullable(),
  gradeLevel: z.string().max(20).optional().nullable(),
  structure: templateStructureSchema.optional(),
  defaultSettings: templateDefaultSettingsSchema.nullable(),
});

const createFromContentSchema = z.object({
  name: z.string().min(1, 'Template name is required').max(255),
  description: z.string().max(2000).optional(),
});

const listTemplatesQuerySchema = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('20'),
  sortBy: z.enum(['createdAt', 'updatedAt', 'name', 'usageCount']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  contentType: z.nativeEnum(TeacherContentType).optional(),
  subject: z.nativeEnum(Subject).optional(),
  gradeLevel: z.string().optional(),
  search: z.string().optional(),
});

// ============================================
// ROUTES
// ============================================

/**
 * GET /api/teacher/templates
 * List all templates for the authenticated teacher
 */
router.get(
  '/',
  authenticateTeacher,
  requireTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = listTemplatesQuerySchema.parse(req.query);

      const result = await templateService.listTemplates(
        req.teacher!.id,
        {
          contentType: query.contentType,
          subject: query.subject,
          gradeLevel: query.gradeLevel,
          search: query.search,
        },
        {
          page: query.page,
          limit: Math.min(query.limit, 100),
          sortBy: query.sortBy,
          sortOrder: query.sortOrder,
        }
      );

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/teacher/templates/starters
 * Get system-provided starter templates
 */
router.get(
  '/starters',
  authenticateTeacher,
  requireTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const starters = templateService.getStarterTemplates();

      res.json({
        success: true,
        data: starters,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/teacher/templates/stats
 * Get template statistics for the teacher
 */
router.get(
  '/stats',
  authenticateTeacher,
  requireTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await templateService.getTemplateStats(req.teacher!.id);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/teacher/templates/:id
 * Get template by ID
 */
router.get(
  '/:id',
  authenticateTeacher,
  requireTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const template = await templateService.getTemplateById(
        req.params.id,
        req.teacher!.id
      );

      if (!template) {
        res.status(404).json({
          success: false,
          error: 'Template not found',
        });
        return;
      }

      res.json({
        success: true,
        data: template,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/teacher/templates
 * Create a new template
 */
router.post(
  '/',
  authenticateTeacher,
  requireTeacher,
  validateInput(createTemplateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const template = await templateService.createTemplate(
        req.teacher!.id,
        req.body
      );

      res.status(201).json({
        success: true,
        data: template,
        message: 'Template created successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/teacher/templates/from-content/:contentId
 * Create a template from existing content
 */
router.post(
  '/from-content/:contentId',
  authenticateTeacher,
  requireTeacher,
  validateInput(createFromContentSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const template = await templateService.createFromContent(
        req.teacher!.id,
        req.params.contentId,
        req.body.name,
        req.body.description
      );

      if (!template) {
        res.status(404).json({
          success: false,
          error: 'Content not found',
        });
        return;
      }

      res.status(201).json({
        success: true,
        data: template,
        message: 'Template created from content successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PATCH /api/teacher/templates/:id
 * Update a template
 */
router.patch(
  '/:id',
  authenticateTeacher,
  requireTeacher,
  validateInput(updateTemplateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const template = await templateService.updateTemplate(
        req.params.id,
        req.teacher!.id,
        req.body
      );

      if (!template) {
        res.status(404).json({
          success: false,
          error: 'Template not found',
        });
        return;
      }

      res.json({
        success: true,
        data: template,
        message: 'Template updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/teacher/templates/:id/duplicate
 * Duplicate a template
 */
router.post(
  '/:id/duplicate',
  authenticateTeacher,
  requireTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const template = await templateService.duplicateTemplate(
        req.params.id,
        req.teacher!.id
      );

      if (!template) {
        res.status(404).json({
          success: false,
          error: 'Template not found',
        });
        return;
      }

      res.status(201).json({
        success: true,
        data: template,
        message: 'Template duplicated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/teacher/templates/:id
 * Delete a template
 */
router.delete(
  '/:id',
  authenticateTeacher,
  requireTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await templateService.deleteTemplate(
        req.params.id,
        req.teacher!.id
      );

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Template not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Template deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
