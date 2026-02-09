/**
 * Agent Routes — AI Teaching Assistant API endpoints
 */
import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Subject, CurriculumType, AgentTone } from '@prisma/client';
import { authenticateTeacher } from '../../middleware/teacherAuth.js';
import { agentMemoryService } from '../../services/teacher/agentMemoryService.js';
import { agentOnboardingService } from '../../services/teacher/agentOnboardingService.js';
import { agentOrchestratorService } from '../../services/teacher/agentOrchestratorService.js';
import { reinforcementService } from '../../services/teacher/reinforcementService.js';
import { proactiveSuggestionService } from '../../services/teacher/proactiveSuggestionService.js';
import { weeklyPrepService } from '../../services/teacher/weeklyPrepService.js';
import { weeklyPrepAudioService } from '../../services/teacher/weeklyPrepAudioService.js';
import { standardsAnalysisService } from '../../services/teacher/standardsAnalysisService.js';
import { reviewSummaryService } from '../../services/teacher/reviewSummaryService.js';
import { exportYearEndHandoverPDF } from '../../services/teacher/handoverExportService.js';
import { queueWeeklyPrep } from '../../jobs/index.js';
import { isFeatureEnabled, FEATURE_FLAGS, getAllFlags } from '../../config/featureFlags.js';
import { logger } from '../../utils/logger.js';
import { ReviewType, ReviewStatus } from '@prisma/client';
import { requireTeacherPro } from '../../middleware/teacherPlanGate.js';

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

// Feature flag middleware
function requireAgentFeature(req: Request, res: Response, next: NextFunction) {
  if (!isFeatureEnabled(FEATURE_FLAGS.TEACHER_AGENT_ENABLED)) {
    return res.status(404).json({ error: 'AI Assistant feature is not available yet.' });
  }
  next();
}

// ============================================================================
// Schemas
// ============================================================================

const setupSchema = z.object({});

const updateIdentitySchema = z.object({
  schoolName: z.string().optional(),
  schoolType: z.string().optional(),
  gradesTaught: z.array(z.string()).optional(),
  subjectsTaught: z.array(z.nativeEnum(Subject)).optional(),
  curriculumType: z.nativeEnum(CurriculumType).optional(),
  yearsExperience: z.number().int().min(0).max(50).optional(),
  teachingPhilosophy: z.string().max(2000).optional(),
  preferredPlanningDay: z.string().optional(),
  preferredDeliveryTime: z.string().optional(),
  timezone: z.string().optional(),
  agentTone: z.nativeEnum(AgentTone).optional(),
});

const onboardingMessageSchema = z.object({
  step: z.enum(['identity', 'classroom', 'curriculum', 'confirmation']),
  message: z.string().min(1, 'Message is required'),
});

const classroomSchema = z.object({
  name: z.string().min(1),
  gradeLevel: z.string().optional(),
  subject: z.nativeEnum(Subject).optional(),
  studentCount: z.number().int().min(0).max(200).optional(),
  studentGroups: z.any().optional(),
  schedule: z.any().optional(),
  resources: z.any().optional(),
});

const curriculumUpdateSchema = z.object({
  gradeLevel: z.string().optional(),
  schoolYear: z.string().optional(),
  standardsTaught: z.array(z.string()).optional(),
  standardsAssessed: z.array(z.string()).optional(),
  standardsSkipped: z.array(z.string()).optional(),
  pacingGuide: z.any().optional(),
  currentWeek: z.number().int().min(1).optional(),
});

const createSessionSchema = z.object({
  title: z.string().optional(),
  subject: z.nativeEnum(Subject).optional(),
});

const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message is required'),
});

const feedbackSchema = z.object({
  interactionId: z.string(),
  contentId: z.string().optional(),
  type: z.enum(['approval', 'edit', 'regeneration']),
  original: z.string().optional(),
  edited: z.string().optional(),
  feedbackNote: z.string().optional(),
  contentType: z.string().optional(),
  subject: z.string().optional(),
});

const schedulingSchema = z.object({
  preferredPlanningDay: z.enum([
    'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY',
  ]).optional(),
  preferredDeliveryTime: z.string().regex(/^\d{2}:\d{2}$/, 'Must be HH:MM format').optional(),
  timezone: z.string().optional(),
});

// ============================================================================
// Feature Flags
// ============================================================================

router.get('/features', (req: Request, res: Response) => {
  res.json({ flags: getAllFlags() });
});

// Apply feature flag check to all routes below
router.use(requireAgentFeature);

// ============================================================================
// Setup & Identity
// ============================================================================

// Initialize or get agent
router.post('/setup', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const agent = await agentMemoryService.getOrCreateAgent(teacherId);
    res.json({ agent });
  } catch (error) {
    next(error);
  }
});

// Get agent state
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const agent = await agentMemoryService.getAgent(teacherId);
    if (!agent) {
      return res.json({ agent: null, setupRequired: true });
    }
    res.json({ agent, setupRequired: !agent.onboardingComplete });
  } catch (error) {
    next(error);
  }
});

// Update identity
router.patch(
  '/identity',
  validateBody(updateIdentitySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teacherId = (req as any).teacher.id;
      const agent = await agentMemoryService.updateIdentity(teacherId, req.body);
      res.json({ agent });
    } catch (error) {
      next(error);
    }
  }
);

// Mark setup complete
router.post('/setup/complete', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const agent = await agentMemoryService.completeSetupStep(teacherId, 'FULLY_SETUP' as any);
    res.json({ agent });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// Scheduling Preferences
// ============================================================================

router.get('/scheduling', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const agent = await agentMemoryService.getAgent(teacherId);
    if (!agent) return res.status(404).json({ error: 'Agent not found' });
    res.json({
      preferredPlanningDay: agent.preferredPlanningDay,
      preferredDeliveryTime: agent.preferredDeliveryTime,
      timezone: agent.timezone,
    });
  } catch (error) {
    next(error);
  }
});

router.patch(
  '/scheduling',
  validateBody(schedulingSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teacherId = (req as any).teacher.id;
      const agent = await agentMemoryService.updateIdentity(teacherId, req.body);
      res.json({
        preferredPlanningDay: agent.preferredPlanningDay,
        preferredDeliveryTime: agent.preferredDeliveryTime,
        timezone: agent.timezone,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ============================================================================
// Onboarding Chat
// ============================================================================

router.post(
  '/onboarding/message',
  validateBody(onboardingMessageSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teacherId = (req as any).teacher.id;
      const { step, message } = req.body;
      const result = await agentOnboardingService.processOnboardingResponse(
        teacherId,
        step,
        message
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/onboarding/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const status = await agentOnboardingService.getOnboardingStatus(teacherId);
    res.json(status);
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// Classrooms
// ============================================================================

router.get('/classrooms', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const agent = await agentMemoryService.getAgent(teacherId);
    if (!agent) return res.json({ classrooms: [] });
    const classrooms = await agentMemoryService.getClassroomContexts(agent.id);
    res.json({ classrooms });
  } catch (error) {
    next(error);
  }
});

router.post(
  '/classrooms',
  validateBody(classroomSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teacherId = (req as any).teacher.id;
      const agent = await agentMemoryService.getOrCreateAgent(teacherId);
      const classroom = await agentMemoryService.upsertClassroomContext(agent.id, req.body);
      res.status(201).json({ classroom });
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/classrooms/:id',
  validateBody(classroomSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teacherId = (req as any).teacher.id;
      const agent = await agentMemoryService.getAgent(teacherId);
      if (!agent) return res.status(404).json({ error: 'Agent not found' });
      const classroom = await agentMemoryService.upsertClassroomContext(agent.id, {
        ...req.body,
        id: req.params.id,
      });
      res.json({ classroom });
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/classrooms/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const agent = await agentMemoryService.getAgent(teacherId);
    if (!agent) return res.status(404).json({ error: 'Agent not found' });
    await agentMemoryService.deleteClassroomContext(agent.id, req.params.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// Curriculum
// ============================================================================

router.get('/curriculum', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const agent = await agentMemoryService.getAgent(teacherId);
    if (!agent) return res.json({ curriculumStates: [] });
    const curriculumStates = await agentMemoryService.getCurriculumStates(agent.id);
    res.json({ curriculumStates });
  } catch (error) {
    next(error);
  }
});

router.patch(
  '/curriculum/:subject',
  validateBody(curriculumUpdateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teacherId = (req as any).teacher.id;
      const agent = await agentMemoryService.getAgent(teacherId);
      if (!agent) return res.status(404).json({ error: 'Agent not found' });

      const subject = req.params.subject as any;
      if (!Object.values(Subject).includes(subject)) {
        return res.status(400).json({ error: 'Invalid subject' });
      }

      const state = await agentMemoryService.updateCurriculumState(
        agent.id,
        subject,
        req.body
      );
      res.json({ curriculumState: state });
    } catch (error) {
      next(error);
    }
  }
);

// ============================================================================
// Memory
// ============================================================================

router.get('/memory', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const snapshot = await agentMemoryService.getFullMemorySnapshot(teacherId);
    if (!snapshot) return res.json({ snapshot: null });
    res.json({ snapshot });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// Chat Sessions
// ============================================================================

router.post(
  '/chat/sessions',
  validateBody(createSessionSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teacherId = (req as any).teacher.id;
      const session = await agentOrchestratorService.createSession(teacherId, req.body);
      res.status(201).json({ session });
    } catch (error) {
      next(error);
    }
  }
);

router.get('/chat/sessions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await agentOrchestratorService.listSessions(teacherId, { page, limit });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/chat/sessions/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const session = await agentOrchestratorService.getSession(req.params.id, teacherId);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json({ session });
  } catch (error) {
    next(error);
  }
});

router.delete('/chat/sessions/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    await agentOrchestratorService.deleteSession(req.params.id, teacherId);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Send message to chat session
router.post(
  '/chat/sessions/:id/messages',
  validateBody(sendMessageSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teacherId = (req as any).teacher.id;
      const sessionId = req.params.id;
      const { content } = req.body;

      const response = await agentOrchestratorService.processMessage(
        teacherId,
        sessionId,
        content
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

// ============================================================================
// Feedback (Reinforcement)
// ============================================================================

router.post(
  '/feedback',
  validateBody(feedbackSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teacherId = (req as any).teacher.id;
      const { type, interactionId, contentId, original, edited, feedbackNote, contentType, subject } = req.body;
      const ctx = { contentType, subject };

      switch (type) {
        case 'approval':
          await reinforcementService.recordApproval(teacherId, interactionId, contentId, ctx);
          break;
        case 'edit':
          if (!original || !edited) {
            return res.status(400).json({ error: 'original and edited are required for edit feedback' });
          }
          await reinforcementService.recordEdit(teacherId, interactionId, contentId || '', original, edited, ctx);
          break;
        case 'regeneration':
          await reinforcementService.recordRegeneration(teacherId, interactionId, contentId, feedbackNote, ctx);
          break;
      }

      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }
);

// ============================================================================
// Suggestions
// ============================================================================

router.get('/suggestions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const suggestions = await proactiveSuggestionService.getSuggestions(teacherId);
    res.json({ suggestions });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// Weekly Prep
// ============================================================================

const weeklyPrepCreateSchema = z.object({
  weekStartDate: z.string().optional(), // ISO date string
});

const materialUpdateSchema = z.object({
  editedContent: z.any(),
  teacherNotes: z.string().optional(),
});

const materialRegenerateSchema = z.object({
  feedbackNote: z.string().optional(),
});

// Create / queue weekly prep
router.post(
  '/weekly-prep',
  validateBody(weeklyPrepCreateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teacherId = (req as any).teacher.id;
      const weekStartDate = req.body.weekStartDate ? new Date(req.body.weekStartDate) : undefined;
      const { prepId, weekLabel } = await weeklyPrepService.initiateWeeklyPrep(teacherId, {
        triggeredBy: 'manual',
        weekStartDate,
      });
      await queueWeeklyPrep({ prepId, teacherId, triggeredBy: 'manual' });
      res.status(201).json({ prepId, weekLabel, status: 'GENERATING' });
    } catch (error) {
      next(error);
    }
  }
);

// List weekly preps
router.get('/weekly-prep', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await weeklyPrepService.getWeeklyPrepList(teacherId, { page, limit });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Get weekly prep with all materials
router.get('/weekly-prep/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const prep = await weeklyPrepService.getWeeklyPrep(req.params.id, teacherId);
    res.json({ prep });
  } catch (error) {
    next(error);
  }
});

// Lightweight progress poll
router.get('/weekly-prep/:id/progress', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const progress = await weeklyPrepService.getWeeklyPrepProgress(req.params.id, teacherId);
    res.json(progress);
  } catch (error) {
    next(error);
  }
});

// Approve single material
router.post(
  '/weekly-prep/:id/materials/:materialId/approve',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teacherId = (req as any).teacher.id;
      await weeklyPrepService.approveMaterial(req.params.materialId, teacherId);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }
);

// Bulk approve all materials
router.post('/weekly-prep/:id/approve-all', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const count = await weeklyPrepService.approveAllMaterials(req.params.id, teacherId);
    res.json({ success: true, approvedCount: count });
  } catch (error) {
    next(error);
  }
});

// Update material (edit)
router.patch(
  '/weekly-prep/:id/materials/:materialId',
  validateBody(materialUpdateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teacherId = (req as any).teacher.id;
      const { editedContent, teacherNotes } = req.body;
      await weeklyPrepService.updateMaterial(req.params.materialId, teacherId, editedContent, teacherNotes);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }
);

// Regenerate material
router.post(
  '/weekly-prep/:id/materials/:materialId/regenerate',
  validateBody(materialRegenerateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teacherId = (req as any).teacher.id;
      await weeklyPrepService.regenerateMaterial(req.params.materialId, teacherId, req.body.feedbackNote);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }
);

// Generate audio from weekly prep
router.post(
  '/weekly-prep/:id/generate-audio',
  requireTeacherPro,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const audioUpdateId = await weeklyPrepAudioService.generateAudioFromWeeklyPrep(req.params.id);
      res.json({ success: !!audioUpdateId, audioUpdateId });
    } catch (error) {
      next(error);
    }
  }
);

// ============================================================================
// Standards Coverage
// ============================================================================

router.get('/standards/overview', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const overview = await standardsAnalysisService.getOverviewStats(teacherId);
    res.json(overview);
  } catch (error) {
    next(error);
  }
});

router.get('/standards/coverage', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const reports = await standardsAnalysisService.getFullCoverageReport(teacherId);
    res.json({ reports });
  } catch (error) {
    next(error);
  }
});

router.get('/standards/coverage/:subject', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const report = await standardsAnalysisService.getCoverageBySubject(teacherId, req.params.subject);
    if (!report) return res.status(404).json({ error: 'No coverage data for this subject' });
    res.json({ report });
  } catch (error) {
    next(error);
  }
});

router.post('/standards/suggest-actions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const { subject, gapStandardIds } = req.body;
    if (!subject || !Array.isArray(gapStandardIds)) {
      return res.status(400).json({ error: 'subject and gapStandardIds[] are required' });
    }
    const actions = await standardsAnalysisService.suggestGapActions(teacherId, subject, gapStandardIds);
    res.json({ actions });
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// Reviews (Monthly & Yearly)
// ============================================================================

router.get('/reviews', requireTeacherPro, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const type = req.query.type as ReviewType | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await reviewSummaryService.listReviews(teacherId, { type, page, limit });
    res.json(result);
  } catch (error) {
    next(error);
  }
});


router.get('/reviews/:id', requireTeacherPro, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const review = await reviewSummaryService.getReview(req.params.id, teacherId);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json({ review });
  } catch (error) {
    next(error);
  }
});

// Download a printable year-end handover package (PDF)
router.get('/reviews/:id/handover.pdf', requireTeacherPro, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const result = await exportYearEndHandoverPDF({ teacherId, reviewId: req.params.id });
    res.setHeader('Content-Type', result.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.send(result.data);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Review not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes('only available')) {
        return res.status(400).json({ error: error.message });
      }
    }
    next(error);
  }
});

router.post('/reviews/generate-monthly', requireTeacherPro, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const month = req.body.month ? new Date(req.body.month) : undefined;
    const result = await reviewSummaryService.generateMonthlyReview(teacherId, month);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/reviews/generate-yearly', requireTeacherPro, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const schoolYear = req.body.schoolYear;
    const result = await reviewSummaryService.generateYearlyReview(teacherId, schoolYear);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.patch('/reviews/:id', requireTeacherPro, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const { status, handoverNotes } = req.body;
    const review = await reviewSummaryService.updateReview(req.params.id, teacherId, { status, handoverNotes });
    res.json({ review });
  } catch (error) {
    next(error);
  }
});

router.delete('/reviews/:id', requireTeacherPro, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    await reviewSummaryService.deleteReview(req.params.id, teacherId);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
