// AI Grading Routes - Grade essays against rubrics with AI
import { Router, Request, Response, NextFunction } from 'express';
import { gradingService } from '../../services/teacher/gradingService.js';
import { authenticateTeacher, requireTeacher } from '../../middleware/teacherAuth.js';
import { requireTeacherPro } from '../../middleware/teacherPlanGate.js';
import { validateInput } from '../../middleware/validateInput.js';
import { z } from 'zod';
import { queueGradingBatchJob } from '../../jobs/index.js';

const router = Router();

// All routes require teacher auth + Teacher Pro
router.use(authenticateTeacher);
router.use(requireTeacher);
router.use(requireTeacherPro);

// ============================================
// VALIDATION SCHEMAS
// ============================================

const curriculumTypeEnum = z.enum([
  'IB', 'BRITISH', 'AMERICAN', 'INDIAN_CBSE', 'INDIAN_ICSE', 'ARABIC'
]);

const gradeSingleSchema = z.object({
  rubricId: z.string().uuid(),
  studentSubmission: z.string().min(10, 'Submission too short').max(100000, 'Submission too long'),
  studentIdentifier: z.string().max(100).optional(),
  curriculumType: curriculumTypeEnum.optional(),
});

const createBatchJobSchema = z.object({
  rubricId: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  submissions: z.array(z.object({
    studentIdentifier: z.string().min(1).max(100),
    text: z.string().max(100000).optional(),
    fileUrl: z.string().url().optional(),
    fileName: z.string().max(255).optional(),
  })).min(1).max(100),
  curriculumType: curriculumTypeEnum.optional(),
});

const overrideSchema = z.object({
  criteriaScores: z.record(z.string(), z.object({
    score: z.number(),
    feedback: z.string().max(1000),
  })).optional(),
  overallFeedback: z.string().max(2000).optional(),
  teacherNotes: z.string().max(2000).optional(),
});

const exportOptionsSchema = z.object({
  format: z.enum(['csv', 'json']),
  includeOriginalText: z.boolean().optional().default(false),
  includeTeacherNotes: z.boolean().optional().default(false),
});

const estimateTokensSchema = z.object({
  rubricId: z.string().uuid(),
  contentLength: z.number().min(1).max(100000),
});

const listJobsQuerySchema = z.object({
  limit: z.string().transform(Number).optional().default('20'),
  offset: z.string().transform(Number).optional().default('0'),
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'PARTIALLY_COMPLETED']).optional(),
});

// ============================================
// SINGLE GRADING ROUTES
// ============================================

/**
 * POST /api/teacher/grading/single
 * Grade a single submission
 */
router.post(
  '/single',
  validateInput(gradeSingleSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await gradingService.gradeSingle(
        req.teacher!.id,
        req.body
      );

      res.status(201).json({
        success: true,
        data: result.submission,
        tokensUsed: result.tokensUsed,
        message: 'Submission graded successfully',
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
        if (error.message.includes('quota') || error.message.includes('credit')) {
          res.status(402).json({
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
 * POST /api/teacher/grading/estimate
 * Estimate token cost for grading
 */
router.post(
  '/estimate',
  validateInput(estimateTokensSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokens = await gradingService.estimateTokens(
        req.body.rubricId,
        req.teacher!.id,
        req.body.contentLength
      );

      // Convert to credits (1000 tokens = 1 credit)
      const credits = Math.ceil(tokens / 1000);

      res.json({
        success: true,
        data: {
          estimatedTokens: tokens,
          estimatedCredits: credits,
        },
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

// ============================================
// BATCH GRADING ROUTES
// ============================================

/**
 * POST /api/teacher/grading/batch
 * Create a batch grading job
 */
router.post(
  '/batch',
  validateInput(createBatchJobSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const job = await gradingService.createBatchJob(
        req.teacher!.id,
        req.body
      );

      // Queue for background processing (BullMQ). If Redis isn't available (local dev),
      // fall back to in-process background execution.
      let queued = false;
      try {
        await queueGradingBatchJob({
          gradingJobId: job.id,
          curriculumType: req.body.curriculumType,
        });
        queued = true;
      } catch (queueError) {
        console.warn('Failed to queue batch grading job, falling back to in-process processing', queueError);
        gradingService.processBatchJob(job.id, req.body.curriculumType).catch(err => {
          console.error('Batch processing error:', err);
        });
      }

      res.status(201).json({
        success: true,
        data: job,
        message: queued
          ? 'Batch grading job created. Processing queued.'
          : 'Batch grading job created. Processing started.',
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
        if (error.message.includes('quota') || error.message.includes('credit')) {
          res.status(402).json({
            success: false,
            error: error.message,
          });
          return;
        }
        if (error.message.includes('Maximum') || error.message.includes('At least')) {
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
 * GET /api/teacher/grading/jobs
 * List grading jobs
 */
router.get(
  '/jobs',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = listJobsQuerySchema.parse(req.query);

      const result = await gradingService.listJobs(
        req.teacher!.id,
        {
          limit: Math.min(query.limit, 100),
          offset: query.offset,
          status: query.status,
        }
      );

      res.json({
        success: true,
        data: result.jobs,
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
 * GET /api/teacher/grading/jobs/:id
 * Get job status with submissions
 */
router.get(
  '/jobs/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await gradingService.getJobStatus(
        req.params.id,
        req.teacher!.id
      );

      if (!result) {
        res.status(404).json({
          success: false,
          error: 'Job not found',
        });
        return;
      }

      res.json({
        success: true,
        data: {
          job: result.job,
          submissions: result.submissions,
          progress: result.progress,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/teacher/grading/jobs/:id/finalize
 * Finalize all submissions in a job
 */
router.post(
  '/jobs/:id/finalize',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await gradingService.finalizeJob(
        req.params.id,
        req.teacher!.id
      );

      res.json({
        success: true,
        data: result,
        message: `${result.count} submissions finalized`,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Job not found') {
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
 * POST /api/teacher/grading/jobs/:id/export
 * Export grading results
 */
router.post(
  '/jobs/:id/export',
  validateInput(exportOptionsSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await gradingService.exportResults(
        req.params.id,
        req.teacher!.id,
        req.body
      );

      res.setHeader('Content-Type', result.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
      res.send(result.data);
    } catch (error) {
      if (error instanceof Error && error.message === 'Job not found') {
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

// ============================================
// SUBMISSION ROUTES
// ============================================

/**
 * GET /api/teacher/grading/submissions/:id
 * Get a single submission
 */
router.get(
  '/submissions/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const submission = await gradingService.getSubmission(
        req.params.id,
        req.teacher!.id
      );

      if (!submission) {
        res.status(404).json({
          success: false,
          error: 'Submission not found',
        });
        return;
      }

      res.json({
        success: true,
        data: submission,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/teacher/grading/submissions/:id/override
 * Apply teacher override to a submission
 */
router.post(
  '/submissions/:id/override',
  validateInput(overrideSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const submission = await gradingService.applyOverride(
        req.params.id,
        req.teacher!.id,
        req.body
      );

      res.json({
        success: true,
        data: submission,
        message: 'Override applied successfully',
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Submission not found') {
          res.status(404).json({
            success: false,
            error: error.message,
          });
          return;
        }
        if (error.message.includes('finalized')) {
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
 * POST /api/teacher/grading/submissions/:id/finalize
 * Finalize a submission
 */
router.post(
  '/submissions/:id/finalize',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const submission = await gradingService.finalizeSubmission(
        req.params.id,
        req.teacher!.id
      );

      res.json({
        success: true,
        data: submission,
        message: 'Submission finalized',
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Submission not found') {
          res.status(404).json({
            success: false,
            error: error.message,
          });
          return;
        }
        if (error.message.includes('already finalized')) {
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
 * POST /api/teacher/grading/submissions/:id/regenerate
 * Regenerate grading for a submission
 */
router.post(
  '/submissions/:id/regenerate',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const curriculumType = req.body.curriculumType;
      const result = await gradingService.regenerateSubmission(
        req.params.id,
        req.teacher!.id,
        curriculumType
      );

      res.json({
        success: true,
        data: result.submission,
        tokensUsed: result.tokensUsed,
        message: 'Submission regraded successfully',
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Submission not found') {
          res.status(404).json({
            success: false,
            error: error.message,
          });
          return;
        }
        if (error.message.includes('finalized')) {
          res.status(409).json({
            success: false,
            error: error.message,
          });
          return;
        }
        if (error.message.includes('quota') || error.message.includes('credit')) {
          res.status(402).json({
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

export default router;
