/**
 * Import Routes — Teacher Intelligence Platform
 * Bulk material upload and import job status polling.
 */
import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticateTeacher } from '../../middleware/teacherAuth.js';
import { generationRateLimit } from '../../middleware/rateLimit.js';
import { materialImportService } from '../../services/teacher/materialImportService.js';

const router = Router();
router.use(authenticateTeacher);

// ============================================================================
// Validation Schemas
// ============================================================================

const importFilesSchema = z.object({
  files: z.array(
    z.object({
      name: z.string().min(1, 'File name is required'),
      content: z.string().min(1, 'File content is required'),
      mimeType: z.string().min(1, 'MIME type is required'),
    })
  ).min(1, 'At least one file is required').max(20, 'Maximum 20 files per import'),
});

// ============================================================================
// Routes
// ============================================================================

// Create import job (upload files for processing)
router.post('/', generationRateLimit, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = importFilesSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    }

    const teacherId = (req as any).teacher.id;
    const job = await materialImportService.createImportJob(teacherId, parsed.data.files);

    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
});

// Get import job status with progress
router.get('/:jobId/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const job = await materialImportService.getImportJobStatus(teacherId, req.params.jobId);
    res.json(job);
  } catch (error) {
    next(error);
  }
});

export default router;
