// Rubric Management Routes - CRUD for grading rubrics
import { Router, Request, Response, NextFunction } from 'express';
import { rubricService } from '../../services/teacher/rubricService.js';
import { authenticateTeacher, requireTeacher } from '../../middleware/teacherAuth.js';
import { validateInput } from '../../middleware/validateInput.js';
import { z } from 'zod';

const router = Router();

// All routes require teacher auth.
router.use(authenticateTeacher);
router.use(requireTeacher);

// ============================================
// VALIDATION SCHEMAS
// ============================================

const scoringLevelSchema = z.object({
  score: z.number(),
  label: z.string().min(1).max(50),
  description: z.string().min(1).max(500),
});

const rubricCriterionSchema = z.object({
  id: z.string().min(1).max(50),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  weight: z.number().min(1).max(100),
  levels: z.array(scoringLevelSchema).min(2).max(6),
});

const subjectEnum = z.enum([
  'MATH', 'SCIENCE', 'ENGLISH', 'ARABIC', 'ISLAMIC_STUDIES',
  'SOCIAL_STUDIES', 'HISTORY', 'GEOGRAPHY', 'PHYSICAL_EDUCATION',
  'HEALTH', 'COMPUTER_SCIENCE', 'READING', 'FOREIGN_LANGUAGE',
  'ECONOMICS', 'DRAMA'
]);

const scoringTypeEnum = z.enum(['POINTS', 'PERCENTAGE', 'LETTER_GRADE', 'PASS_FAIL']);

const createRubricSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().max(1000).optional(),
  subject: subjectEnum.optional(),
  gradeLevel: z.string().max(50).optional(),
  criteria: z.array(rubricCriterionSchema).min(1).max(10),
  maxScore: z.number().min(1).max(1000),
  scoringType: scoringTypeEnum.optional().default('POINTS'),
  passingThreshold: z.number().min(0).max(1000).optional(),
  gradingPrompt: z.string().max(2000).optional(),
  confidenceThreshold: z.number().min(0).max(1).optional().default(0.7),
});

const updateRubricSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional().nullable(),
  subject: subjectEnum.optional().nullable(),
  gradeLevel: z.string().max(50).optional().nullable(),
  criteria: z.array(rubricCriterionSchema).min(1).max(10).optional(),
  maxScore: z.number().min(1).max(1000).optional(),
  scoringType: scoringTypeEnum.optional(),
  passingThreshold: z.number().min(0).max(1000).optional().nullable(),
  gradingPrompt: z.string().max(2000).optional().nullable(),
  confidenceThreshold: z.number().min(0).max(1).optional(),
});

const duplicateRubricSchema = z.object({
  newName: z.string().min(1).max(200).optional(),
});

const createFromTemplateSchema = z.object({
  templateId: z.string().min(1),
  customName: z.string().min(1).max(200).optional(),
});

const listRubricsQuerySchema = z.object({
  limit: z.string().transform(Number).optional().default('20'),
  offset: z.string().transform(Number).optional().default('0'),
  subject: subjectEnum.optional(),
  search: z.string().max(100).optional(),
});

const templatesQuerySchema = z.object({
  subject: subjectEnum.optional(),
  gradeLevel: z.string().max(50).optional(),
});

// ============================================
// ROUTES
// ============================================

/**
 * GET /api/teacher/rubrics
 * List all rubrics for the authenticated teacher
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = listRubricsQuerySchema.parse(req.query);

      const result = await rubricService.list(
        req.teacher!.id,
        {
          limit: Math.min(query.limit, 100),
          offset: query.offset,
          subject: query.subject,
          search: query.search,
        }
      );

      res.json({
        success: true,
        data: result.rubrics,
        pagination: {
          total: result.total,
          limit: query.limit,
          offset: query.offset,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/teacher/rubrics/templates
 * Get system rubric templates
 */
router.get(
  '/templates',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = templatesQuerySchema.parse(req.query);

      const templates = await rubricService.getTemplates(
        query.subject,
        query.gradeLevel
      );

      res.json({
        success: true,
        data: templates,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/teacher/rubrics
 * Create a new rubric
 */
router.post(
  '/',
  validateInput(createRubricSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rubric = await rubricService.create(
        req.teacher!.id,
        req.body
      );

      res.status(201).json({
        success: true,
        data: rubric,
        message: 'Rubric created successfully',
      });
    } catch (error) {
      if (error instanceof Error && error.message.startsWith('Invalid criteria:')) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
        return;
      }
      next(error);
    }
  }
);

/**
 * POST /api/teacher/rubrics/from-template
 * Create a rubric from a system template
 */
router.post(
  '/from-template',
  validateInput(createFromTemplateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rubric = await rubricService.createFromTemplate(
        req.teacher!.id,
        req.body.templateId,
        req.body.customName
      );

      res.status(201).json({
        success: true,
        data: rubric,
        message: 'Rubric created from template successfully',
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Template not found') {
        res.status(404).json({
          success: false,
          error: error.message,
        });
        return;
      }
      next(error);
    }
  }
);

/**
 * GET /api/teacher/rubrics/:id
 * Get rubric by ID
 */
router.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rubric = await rubricService.getById(
        req.params.id,
        req.teacher!.id
      );

      if (!rubric) {
        res.status(404).json({
          success: false,
          error: 'Rubric not found',
        });
        return;
      }

      res.json({
        success: true,
        data: rubric,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PATCH /api/teacher/rubrics/:id
 * Update rubric
 */
router.patch(
  '/:id',
  validateInput(updateRubricSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rubric = await rubricService.update(
        req.params.id,
        req.teacher!.id,
        req.body
      );

      res.json({
        success: true,
        data: rubric,
        message: 'Rubric updated successfully',
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Rubric not found') {
          res.status(404).json({
            success: false,
            error: error.message,
          });
          return;
        }
        if (error.message.startsWith('Invalid criteria:')) {
          res.status(400).json({
            success: false,
            error: error.message,
          });
          return;
        }
      }
      next(error);
    }
  }
);

/**
 * DELETE /api/teacher/rubrics/:id
 * Delete rubric
 */
router.delete(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await rubricService.delete(
        req.params.id,
        req.teacher!.id
      );

      res.json({
        success: true,
        message: 'Rubric deleted successfully',
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Rubric not found') {
          res.status(404).json({
            success: false,
            error: error.message,
          });
          return;
        }
        if (error.message.startsWith('Cannot delete rubric:')) {
          res.status(409).json({
            success: false,
            error: error.message,
          });
          return;
        }
      }
      next(error);
    }
  }
);

/**
 * POST /api/teacher/rubrics/:id/duplicate
 * Duplicate a rubric
 */
router.post(
  '/:id/duplicate',
  validateInput(duplicateRubricSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rubric = await rubricService.duplicate(
        req.params.id,
        req.teacher!.id,
        req.body.newName
      );

      res.status(201).json({
        success: true,
        data: rubric,
        message: 'Rubric duplicated successfully',
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Rubric not found') {
        res.status(404).json({
          success: false,
          error: error.message,
        });
        return;
      }
      next(error);
    }
  }
);

/**
 * POST /api/teacher/rubrics/validate
 * Validate rubric criteria without saving
 */
router.post(
  '/validate',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { criteria } = req.body;

      if (!criteria) {
        res.status(400).json({
          success: false,
          error: 'Criteria is required',
        });
        return;
      }

      const validation = rubricService.validateCriteria(criteria);

      res.json({
        success: true,
        data: validation,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
