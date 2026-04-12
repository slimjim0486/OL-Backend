/**
 * Materials Routes — Teacher Intelligence Platform
 * CRUD for teacher materials, generation from stream/graph, approval, rating,
 * edit capture (Phase 4.9 — Edit Intelligence Loop).
 */
import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { IntelligenceMaterialType, MaterialEditType } from '@prisma/client';
import { authenticateTeacher } from '../../middleware/teacherAuth.js';
import { requireFeature } from '../../middleware/teacherFeatureGate.js';
import { generationRateLimit } from '../../middleware/rateLimit.js';
import { materialService } from '../../services/teacher/materialService.js';
import { editAnalysisService } from '../../services/teacher/editAnalysisService.js';
import { queueEditAnalysis } from '../../jobs/editAnalysisJob.js';
import { exportMaterialContent } from '../../services/teacher/exportService.js';
import { getDownloadAccess, consumeFreeDownloadAllowance } from '../../services/teacher/downloadAccessService.js';
import { prisma } from '../../config/database.js';
import { generateLessonPPTX, generateFlashcardPPTX, PresentonExportOptions } from '../../services/teacher/presentonService.js';

const router = Router();
router.use(authenticateTeacher);

// ============================================================================
// Validation Schemas
// ============================================================================

const materialTypeEnum = z.nativeEnum(IntelligenceMaterialType);

const updateMaterialSchema = z.object({
  title: z.string().optional(),
  content: z.any().optional(),
  notes: z.string().max(5000).optional(),
  approved: z.boolean().optional(),
  edited: z.boolean().optional(),
  editDiff: z.any().optional(),
  rating: z.number().int().min(1).max(5).optional(),
  usedInClass: z.boolean().optional(),
});

const generateFromStreamSchema = z.object({
  materialType: materialTypeEnum,
  additionalContext: z.string().max(2000).optional(),
});

// Edit Intelligence Loop (Phase 4.9) — every edit the teacher makes to a
// generated material is captured here. The backend persists the diff and
// queues an async Gemini analysis job.
const recordEditSchema = z.object({
  materialId: z.string().min(1),
  editType: z.nativeEnum(MaterialEditType),
  sectionType: z.string().max(120).optional().nullable(),
  originalContent: z.string().max(8000).optional().nullable(),
  newContent: z.string().max(8000).optional().nullable(),
});

// ============================================================================
// Routes
// ============================================================================

// List materials (paginated, filterable)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const result = await materialService.listMaterials(teacherId, {
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      subject: req.query.subject as string | undefined,
      type: req.query.type as IntelligenceMaterialType | undefined,
      dateFrom: req.query.dateFrom as string | undefined,
      dateTo: req.query.dateTo as string | undefined,
      standard: req.query.standard as string | undefined,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Search materials
router.get('/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ error: 'Search query (q) is required' });
    }
    const materials = await materialService.searchMaterials(teacherId, query);
    res.json({ materials });
  } catch (error) {
    next(error);
  }
});

// Material stats
router.get('/stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const stats = await materialService.getMaterialStats(teacherId);
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

// Materials by topic
router.get('/topic/:topic', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const materials = await materialService.getMaterialsByTopic(teacherId, req.params.topic);
    res.json({ materials });
  } catch (error) {
    next(error);
  }
});

// ============================================
// Edit Intelligence Loop (Phase 4.9)
// ============================================
// Defined BEFORE `/:id` so the path matcher can't swallow them.

// Record a material edit. Returns immediately; a BullMQ job runs Gemini
// analysis async and updates extractedSignals on the edit row.
router.post('/edits', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = recordEditSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    }
    const teacherId = (req as any).teacher.id;

    // DELETE needs original content, ADD needs new content, TEXT_EDIT needs both.
    // REGENERATE may arrive with only original (pending) and get updated later —
    // we don't enforce that here because regeneration completion is already
    // tracked via the material content itself.
    const { editType, originalContent, newContent } = parsed.data;
    if (editType === 'DELETE' && !originalContent) {
      return res.status(400).json({ error: 'DELETE edits must include originalContent' });
    }
    if (editType === 'ADD' && !newContent) {
      return res.status(400).json({ error: 'ADD edits must include newContent' });
    }
    if (editType === 'TEXT_EDIT' && (!originalContent || !newContent)) {
      return res.status(400).json({ error: 'TEXT_EDIT edits must include both originalContent and newContent' });
    }

    const edit = await editAnalysisService.recordEdit(teacherId, parsed.data);

    // Fire-and-forget queue. If Redis is down we log and return — the edit is
    // still persisted, we just don't learn from it this time.
    queueEditAnalysis({ editId: edit.id, teacherId }).catch((err) => {
      // Logged inside queueEditAnalysis; swallow here so we don't 500 the route
      // on a queue misconfiguration.
    });

    res.status(201).json(edit);
  } catch (error) {
    next(error);
  }
});

// Track that a teacher approved, downloaded, or shared a material WITHOUT
// making any edits. This is the positive-signal counterpart to edits —
// drives the edit rate metric. Safe to call multiple times; if the material
// already has edits, this is a no-op.
router.post('/edits/approved-no-edit', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const materialId = z.string().min(1).parse(req.body?.materialId);
    await editAnalysisService.recordApprovedNoEdit(teacherId, materialId);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// List all edits for a specific material.
router.get('/:id/edits', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const edits = await editAnalysisService.listEditsForMaterial(teacherId, req.params.id);
    res.json({ edits });
  } catch (error) {
    next(error);
  }
});

// Get single material
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const material = await materialService.getMaterial(teacherId, req.params.id);
    res.json(material);
  } catch (error) {
    next(error);
  }
});

// Update material
router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = updateMaterialSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    }
    const teacherId = (req as any).teacher.id;
    const material = await materialService.updateMaterial(teacherId, req.params.id, parsed.data);
    res.json(material);
  } catch (error) {
    next(error);
  }
});

// Delete material
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    await materialService.deleteMaterial(teacherId, req.params.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Generate material from stream entry
router.post('/generate/from-stream/:entryId', requireFeature('generate'), generationRateLimit, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = generateFromStreamSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    }
    const teacherId = (req as any).teacher.id;
    const material = await materialService.generateFromStream(teacherId, req.params.entryId, parsed.data);
    res.status(201).json(material);
  } catch (error) {
    next(error);
  }
});

// Generate material from graph node
router.post('/generate/from-node/:nodeId', generationRateLimit, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = generateFromStreamSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    }
    const teacherId = (req as any).teacher.id;
    const material = await materialService.generateFromNode(teacherId, req.params.nodeId, parsed.data);
    res.status(201).json(material);
  } catch (error) {
    next(error);
  }
});

// Generate an AI section for a material
const generateSectionSchema = z.object({
  title: z.string().max(500).optional(),
  instruction: z.string().min(1).max(2000),
});

router.post('/:id/generate-section', generationRateLimit, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = generateSectionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    }
    const teacherId = (req as any).teacher.id;
    const section = await materialService.generateAISection(teacherId, req.params.id, parsed.data);
    res.json({ success: true, data: section });
  } catch (error) {
    next(error);
  }
});

// Generate type-specific items to add to an existing section (e.g., more quiz questions, vocabulary)
const generateSectionItemsSchema = z.object({
  sectionType: z.string().min(1).max(50),
  targetKey: z.string().min(1).max(100),
  instruction: z.string().min(1).max(2000),
  count: z.number().int().min(1).max(20).optional(),
});

router.post('/:id/generate-section-items', generationRateLimit, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = generateSectionItemsSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    }
    const teacherId = (req as any).teacher.id;
    const result = await materialService.generateSectionItems(teacherId, req.params.id, parsed.data);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// Approve material — also records a no-edit approval if the material has
// no MaterialEdit rows yet. That's the positive signal that closes the loop.
router.post('/:id/approve', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    // Non-fatal — track no-edit approval so editRate reflects reality
    await editAnalysisService.recordApprovedNoEdit(teacherId, req.params.id).catch(() => {});
    const material = await materialService.approveMaterial(teacherId, req.params.id);
    res.json(material);
  } catch (error) {
    next(error);
  }
});

// Rate material (1-5)
const rateSchema = z.object({
  rating: z.number().int().min(1).max(5),
});

router.post('/:id/rate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = rateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    }
    const teacherId = (req as any).teacher.id;
    const material = await materialService.rateMaterial(teacherId, req.params.id, parsed.data.rating);
    res.json(material);
  } catch (error) {
    next(error);
  }
});

// Mark material as used in class
router.post('/:id/used', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const material = await materialService.markMaterialUsed(teacherId, req.params.id);
    res.json(material);
  } catch (error) {
    next(error);
  }
});

// Record outcome after using material in class
const outcomeSchema = z.object({
  outcomeRating: z.enum(['WORKED', 'NEEDED_TWEAKS', 'DIDNT_WORK']),
  outcomeNotes: z.string().max(2000).optional(),
});

router.post('/:id/outcome', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = outcomeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
    }
    const teacherId = (req as any).teacher.id;
    const material = await materialService.updateMaterial(teacherId, req.params.id, {
      ...parsed.data,
      outcomeRatedAt: new Date(),
    } as any);
    res.json(material);
  } catch (error) {
    next(error);
  }
});

// ============================================================================
// Material Export (PDF / PPTX)
// ============================================================================

// Helper: load material and check download access, consume allowance
async function loadMaterialForExport(teacherId: string, materialId: string, res: Response) {
  const material = await prisma.teacherMaterial.findFirst({
    where: { id: materialId, teacherId },
  });
  if (!material) {
    res.status(404).json({ error: 'Material not found' });
    return null;
  }

  const access = await getDownloadAccess(teacherId, materialId);
  if (!access.canDownload) {
    res.status(403).json({
      error: 'Free monthly download limit reached. Upgrade to continue exporting.',
      freeMonthlyLimit: access.freeMonthlyLimit,
      freeDownloadsUsed: access.freeDownloadsUsed,
      freeDownloadsRemaining: access.freeDownloadsRemaining,
      freeDownloadsResetAt: access.freeDownloadsResetAt,
    });
    return null;
  }

  if (!access.isSubscriber) {
    try {
      await consumeFreeDownloadAllowance(teacherId);
    } catch {
      const latest = await getDownloadAccess(teacherId, materialId);
      res.status(403).json({
        error: 'Free monthly download limit reached. Upgrade to continue exporting.',
        freeDownloadsUsed: latest.freeDownloadsUsed,
        freeDownloadsRemaining: latest.freeDownloadsRemaining,
        freeDownloadsResetAt: latest.freeDownloadsResetAt,
      });
      return null;
    }
  }

  return material;
}

// Helper: build a fake TeacherContent for Presenton from TeacherMaterial
function materialToTeacherContent(material: any) {
  const content = material.content || {};
  const typeMap: Record<string, string> = {
    LESSON_PLAN: 'LESSON', WORKSHEET: 'WORKSHEET', QUIZ: 'QUIZ',
    FLASHCARDS: 'FLASHCARD_DECK', SUB_PLAN: 'LESSON', RETEACH_ACTIVITY: 'LESSON',
    SUMMARY: 'STUDY_GUIDE', PARENT_UPDATE: 'LESSON', INFOGRAPHIC: 'LESSON', AUDIO_UPDATE: 'LESSON',
  };
  return {
    id: material.id,
    title: material.title,
    subject: material.subject || 'OTHER',
    gradeLevel: material.gradeLevel || '',
    contentType: typeMap[material.type] || 'LESSON',
    lessonContent: content,
    quizContent: material.type === 'QUIZ'
      ? { title: content.title || material.title, questions: content.questions || content.assessment?.questions || [] }
      : null,
    flashcardContent: material.type === 'FLASHCARDS'
      ? { title: content.title || material.title, cards: content.cards || content.flashcards || [] }
      : null,
  };
}

// Check download access for a material
router.get('/:id/download-access', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const access = await getDownloadAccess(teacherId, req.params.id);
    res.json({ success: true, data: access });
  } catch (error) {
    next(error);
  }
});

// Export material as PDF
router.get('/:id/export/pdf', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const material = await loadMaterialForExport(teacherId, req.params.id, res);
    if (!material) return;

    const options = {
      format: 'pdf' as const,
      includeAnswers: req.query.includeAnswers !== 'false',
      includeTeacherNotes: req.query.includeTeacherNotes !== 'false',
      paperSize: (req.query.paperSize as 'letter' | 'a4') || 'letter',
      colorScheme: (req.query.colorScheme as 'color' | 'grayscale') || 'color',
    };

    const result = await exportMaterialContent(material, options);

    res.setHeader('Content-Type', result.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.send(result.data);
  } catch (error) {
    next(error);
  }
});

// Export material as PPTX via Presenton
router.get('/:id/export/pptx', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const material = await loadMaterialForExport(teacherId, req.params.id, res);
    if (!material) return;

    // Only lesson-shaped types support PPTX
    const pptxTypes = ['LESSON_PLAN', 'WORKSHEET', 'FLASHCARDS', 'SUB_PLAN', 'RETEACH_ACTIVITY'];
    if (!pptxTypes.includes(material.type)) {
      return res.status(400).json({
        error: 'This material type can only be exported as PDF. Try PDF export instead.',
      });
    }

    const themeMap: Record<string, PresentonExportOptions['theme']> = {
      'professional': 'professional-blue',
      'colorful': 'mint-blue',
    };
    const options: PresentonExportOptions = {
      theme: themeMap[(req.query.theme as string) || 'professional'] || 'professional-blue',
      slideStyle: (req.query.slideStyle as 'focused' | 'dense') || 'focused',
      includeAnswers: req.query.includeAnswers !== 'false',
      includeTeacherNotes: req.query.includeTeacherNotes !== 'false',
      includeInfographic: req.query.includeInfographic !== 'false',
      language: (req.query.language as string) || 'English',
    };

    const fakeContent = materialToTeacherContent(material) as any;
    const result = material.type === 'FLASHCARDS'
      ? await generateFlashcardPPTX(fakeContent, options)
      : await generateLessonPPTX(fakeContent, options);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.send(result.data);
  } catch (error) {
    next(error);
  }
});

export default router;
