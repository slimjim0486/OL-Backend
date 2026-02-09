/**
 * Communication Routes — Parent emails and report card comments
 */
import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { CommunicationType, CommunicationStatus } from '@prisma/client';
import { authenticateTeacher } from '../../middleware/teacherAuth.js';
import { communicationService } from '../../services/teacher/communicationService.js';

const router = Router();
router.use(authenticateTeacher);

// ============================================================================
// Validation Schemas
// ============================================================================

const parentEmailSchema = z.object({
  topic: z.string().min(1, 'Topic is required'),
  tone: z.enum(['positive', 'concern', 'update', 'celebration']).optional(),
  subject: z.string().optional(),
  studentGroup: z.string().optional(),
  gradeLevel: z.string().optional(),
  additionalContext: z.string().optional(),
  length: z.enum(['short', 'medium', 'long']).optional(),
});

const reportCommentsSchema = z.object({
  studentGroup: z.string().optional(),
  subject: z.string().optional(),
  gradeLevel: z.string().optional(),
  performanceLevel: z.enum(['exceeding', 'meeting', 'approaching', 'below']).optional(),
  focusAreas: z.array(z.string()).optional(),
  includeGoals: z.boolean().optional(),
  commentCount: z.number().int().min(1).max(20).optional(),
});

const updateSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  status: z.nativeEnum(CommunicationStatus).optional(),
});

// ============================================================================
// Routes
// ============================================================================

// Generate parent email
router.post('/parent-email', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = parentEmailSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    }
    const teacherId = (req as any).teacher.id;
    const result = await communicationService.generateParentEmail(teacherId, parsed.data);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// Generate report card comments
router.post('/report-comments', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = reportCommentsSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    }
    const teacherId = (req as any).teacher.id;
    const result = await communicationService.generateReportComments(teacherId, parsed.data);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// List communications
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const type = req.query.type as CommunicationType | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await communicationService.listCommunications(teacherId, { type, page, limit });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get single communication
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const communication = await communicationService.getCommunication(req.params.id, teacherId);
    if (!communication) return res.status(404).json({ error: 'Communication not found' });
    res.json({ communication });
  } catch (error) {
    next(error);
  }
});

// Update communication
router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    }
    const teacherId = (req as any).teacher.id;
    const communication = await communicationService.updateCommunication(req.params.id, teacherId, parsed.data);
    res.json({ communication });
  } catch (error) {
    next(error);
  }
});

// Delete communication
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    await communicationService.deleteCommunication(req.params.id, teacherId);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
