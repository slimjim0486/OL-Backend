// Teacher Content routes - CRUD operations for lessons, quizzes, flashcards
import { Router, Request, Response, NextFunction } from 'express';
import { contentService, quotaService, weeklyPrepService } from '../../services/teacher/index.js';
import { contentGenerationService } from '../../services/teacher/contentGenerationService.js';
import { geminiService } from '../../services/ai/geminiService.js';
import { authenticateTeacher, requireTeacher } from '../../middleware/teacherAuth.js';
import { validateInput } from '../../middleware/validateInput.js';
import { z } from 'zod';
import {
  TeacherContentType,
  ContentStatus,
  Subject,
  SourceType,
  TokenOperation,
  DocumentAnalysisStatus,
} from '@prisma/client';
import { prisma } from '../../config/database.js';
import { queueDocumentAnalysisJob } from '../../jobs/index.js';
import { DISABILITY_LABELS, SUBJECT_AREA_LABELS } from '../../services/teacher/iepGoalService.js';
import { standardsSuggestionService } from '../../services/teacher/standardsSuggestionService.js';

const router = Router();

// ============================================
// VALIDATION SCHEMAS
// ============================================

const createContentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().max(2000).optional(),
  subject: z.nativeEnum(Subject).optional(),
  gradeLevel: z.string().max(20).optional(),
  contentType: z.nativeEnum(TeacherContentType),
  sourceType: z.nativeEnum(SourceType).optional(),
  originalFileUrl: z.string().url().optional(),
  originalFileName: z.string().max(255).optional(),
  extractedText: z.string().optional(),
  templateId: z.string().uuid().optional(),
  // Allow passing generated content during creation
  lessonContent: z.record(z.unknown()).optional(),
  quizContent: z.record(z.unknown()).optional(),
  flashcardContent: z.record(z.unknown()).optional(),
  infographicUrl: z.string().url().optional(),
  // Allow setting status directly (defaults to DRAFT if not provided)
  status: z.nativeEnum(ContentStatus).optional(),
});

const updateContentSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional(),
  subject: z.nativeEnum(Subject).optional().nullable(),
  gradeLevel: z.string().max(20).optional().nullable(),
  lessonContent: z.record(z.unknown()).optional(),
  quizContent: z.record(z.unknown()).optional(),
  flashcardContent: z.record(z.unknown()).optional(),
  infographicUrl: z.string().url().optional().nullable(),
  status: z.nativeEnum(ContentStatus).optional(),
});

// Virtual content types that map to separate tables (not in TeacherContentType enum)
const VIRTUAL_CONTENT_TYPES = ['IEP_GOALS', 'SUB_PLAN'] as const;
type VirtualContentType = (typeof VIRTUAL_CONTENT_TYPES)[number];

const listContentQuerySchema = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('20'),
  sortBy: z.enum(['createdAt', 'updatedAt', 'title']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  contentType: z.union([z.nativeEnum(TeacherContentType), z.enum(VIRTUAL_CONTENT_TYPES)]).optional(),
  subject: z.nativeEnum(Subject).optional(),
  gradeLevel: z.string().optional(),
  status: z.nativeEnum(ContentStatus).optional(),
  search: z.string().optional(),
});

// ---- Normalize helpers to unify IEP / Sub Plan into content-list shape ----

interface NormalizedContentItem {
  id: string;
  teacherId: string;
  title: string;
  description: string | null;
  subject: string | null;
  gradeLevel: string | null;
  contentType: string; // TeacherContentType | VirtualContentType
  sourceType: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  _virtualSource?: 'iep' | 'sub_plan';
  [key: string]: unknown;
}

function normalizeIepSession(iep: {
  id: string;
  teacherId: string;
  studentIdentifier?: string | null;
  gradeLevel: string;
  disabilityCategory: string;
  subjectArea: string;
  selectedGoals?: unknown;
  createdAt: Date;
  updatedAt: Date;
}): NormalizedContentItem {
  const subjectLabel = SUBJECT_AREA_LABELS[iep.subjectArea as keyof typeof SUBJECT_AREA_LABELS] || iep.subjectArea;
  const disabilityLabel = DISABILITY_LABELS[iep.disabilityCategory as keyof typeof DISABILITY_LABELS] || iep.disabilityCategory;
  const studentPart = iep.studentIdentifier ? ` - ${iep.studentIdentifier}` : '';

  return {
    id: iep.id,
    teacherId: iep.teacherId,
    title: `IEP Goals: ${subjectLabel}${studentPart}`,
    description: `${disabilityLabel} | Grade ${iep.gradeLevel}`,
    subject: null,
    gradeLevel: iep.gradeLevel,
    contentType: 'IEP_GOALS',
    sourceType: null,
    status: iep.selectedGoals ? 'PUBLISHED' : 'DRAFT',
    createdAt: iep.createdAt,
    updatedAt: iep.updatedAt,
    isPublic: false,
    _virtualSource: 'iep',
  };
}

function normalizeSubPlan(sub: {
  id: string;
  teacherId: string;
  title: string;
  gradeLevel?: string | null;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}): NormalizedContentItem {
  return {
    id: sub.id,
    teacherId: sub.teacherId,
    title: sub.title,
    description: sub.gradeLevel ? `Grade ${sub.gradeLevel} | ${sub.date.toISOString().slice(0, 10)}` : sub.date.toISOString().slice(0, 10),
    subject: null,
    gradeLevel: sub.gradeLevel || null,
    contentType: 'SUB_PLAN',
    sourceType: null,
    status: 'PUBLISHED',
    createdAt: sub.createdAt,
    updatedAt: sub.updatedAt,
    isPublic: false,
    _virtualSource: 'sub_plan',
  };
}

const updateStatusSchema = z.object({
  status: z.nativeEnum(ContentStatus),
});

const WEEKLY_PREP_MATERIAL_MARKER_RE = /weekly_prep_material_id:([0-9a-f-]+)/i;
const WEEKDAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

function extractWeeklyPrepMaterialIdFromContent(
  content: { extractedText?: string | null } | null | undefined
): string | null {
  const extracted = String(content?.extractedText || '');
  if (!extracted) return null;
  const match = extracted.match(WEEKLY_PREP_MATERIAL_MARKER_RE);
  return match?.[1] || null;
}

function getIsoWeekNumber(date: Date): number {
  const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  return Math.ceil((((utcDate.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

// ============================================
// ROUTES
// ============================================

/**
 * GET /api/teacher/content
 * List all content for the authenticated teacher
 * Includes IEP goal sessions and substitute plans alongside standard TeacherContent.
 */
router.get(
  '/',
  authenticateTeacher,
  requireTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = listContentQuerySchema.parse(req.query);
      const teacherId = req.teacher!.id;
      const limit = Math.min(query.limit, 100);
      const page = query.page;
      const skip = (page - 1) * limit;
      const sortOrder = query.sortOrder;
      const isVirtual = VIRTUAL_CONTENT_TYPES.includes(query.contentType as VirtualContentType);

      // ---- Virtual-type-only queries (IEP_GOALS or SUB_PLAN filter) ----
      if (query.contentType === 'IEP_GOALS') {
        const where: Record<string, unknown> = { teacherId };
        if (query.gradeLevel) where.gradeLevel = query.gradeLevel;
        if (query.search) {
          where.OR = [
            { studentIdentifier: { contains: query.search, mode: 'insensitive' } },
          ];
        }
        const [rows, total] = await Promise.all([
          prisma.iEPGoalSession.findMany({ where, orderBy: { createdAt: sortOrder }, take: limit, skip }),
          prisma.iEPGoalSession.count({ where }),
        ]);
        const totalPages = Math.ceil(total / limit);
        return res.json({
          success: true,
          data: rows.map(normalizeIepSession),
          pagination: { total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
        });
      }

      if (query.contentType === 'SUB_PLAN') {
        const where: Record<string, unknown> = { teacherId };
        if (query.gradeLevel) where.gradeLevel = query.gradeLevel;
        if (query.search) {
          where.title = { contains: query.search, mode: 'insensitive' };
        }
        const [rows, total] = await Promise.all([
          prisma.substitutePlan.findMany({ where, orderBy: { createdAt: sortOrder }, take: limit, skip }),
          prisma.substitutePlan.count({ where }),
        ]);
        const totalPages = Math.ceil(total / limit);
        return res.json({
          success: true,
          data: rows.map(normalizeSubPlan),
          pagination: { total, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
        });
      }

      // ---- Standard TeacherContent query (with optional type filter) ----
      const result = await contentService.listContent(
        teacherId,
        {
          contentType: query.contentType as TeacherContentType | undefined,
          subject: query.subject,
          gradeLevel: query.gradeLevel,
          status: query.status,
          search: query.search,
        },
        { page, limit, sortBy: query.sortBy, sortOrder }
      );

      // Enrich lesson cards generated from weekly prep with week/day tags.
      const weeklyPrepMaterialIds = Array.from(
        new Set(
          (result.data || [])
            .map((item) => extractWeeklyPrepMaterialIdFromContent(item))
            .filter((id): id is string => Boolean(id))
        )
      );

      let weeklyPrepByMaterialId = new Map<string, {
        weekLabel: string;
        weekNumber: number;
        dayOfWeek: number;
        dayLabel: string;
      }>();

      if (weeklyPrepMaterialIds.length > 0) {
        const materials = await prisma.agentMaterial.findMany({
          where: { id: { in: weeklyPrepMaterialIds } },
          select: {
            id: true,
            dayOfWeek: true,
            weeklyPrep: { select: { weekLabel: true, weekStartDate: true } },
          },
        });
        weeklyPrepByMaterialId = new Map(
          materials.map((m) => [
            m.id,
            {
              weekLabel: m.weeklyPrep.weekLabel,
              weekNumber: getIsoWeekNumber(m.weeklyPrep.weekStartDate),
              dayOfWeek: m.dayOfWeek,
              dayLabel: WEEKDAY_LABELS[m.dayOfWeek] || `Day ${m.dayOfWeek + 1}`,
            },
          ])
        );
      }

      const enrichedData = (result.data || []).map((item) => {
        const materialId = extractWeeklyPrepMaterialIdFromContent(item);
        if (!materialId) return item;
        const weeklyPrep = weeklyPrepByMaterialId.get(materialId);
        if (!weeklyPrep) return item;
        return { ...item, weeklyPrep };
      });

      // ---- If a specific TeacherContentType filter is set, return as-is ----
      if (query.contentType) {
        return res.json({
          success: true,
          data: enrichedData,
          pagination: result.pagination,
        });
      }

      // ---- No filter: merge IEP sessions and sub plans into the unified list ----
      const fetchCap = skip + limit; // enough items from each source
      const iepWhere: Record<string, unknown> = { teacherId };
      const subWhere: Record<string, unknown> = { teacherId };
      if (query.search) {
        iepWhere.OR = [{ studentIdentifier: { contains: query.search, mode: 'insensitive' } }];
        subWhere.title = { contains: query.search, mode: 'insensitive' };
      }
      if (query.gradeLevel) {
        iepWhere.gradeLevel = query.gradeLevel;
        subWhere.gradeLevel = query.gradeLevel;
      }

      const [iepRows, subRows, iepCount, subCount] = await Promise.all([
        prisma.iEPGoalSession.findMany({ where: iepWhere, orderBy: { createdAt: sortOrder }, take: fetchCap }),
        prisma.substitutePlan.findMany({ where: subWhere, orderBy: { createdAt: sortOrder }, take: fetchCap }),
        prisma.iEPGoalSession.count({ where: iepWhere }),
        prisma.substitutePlan.count({ where: subWhere }),
      ]);

      // Merge all sources
      const merged: Array<Record<string, unknown>> = [
        ...(enrichedData as Array<Record<string, unknown>>).filter(Boolean),
        ...iepRows.map(normalizeIepSession),
        ...subRows.map(normalizeSubPlan),
      ];

      // Sort merged list by createdAt
      merged.sort((a, b) => {
        const da = new Date(a.createdAt as string | Date).getTime();
        const db = new Date(b.createdAt as string | Date).getTime();
        return sortOrder === 'desc' ? db - da : da - db;
      });

      // Re-paginate the merged list
      const totalAll = result.pagination.total + iepCount + subCount;
      const totalPages = Math.ceil(totalAll / limit);
      const paged = merged.slice(skip, skip + limit);

      res.json({
        success: true,
        data: paged,
        pagination: { total: totalAll, page, limit, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/teacher/content/stats
 * Get content statistics for the teacher (includes IEP goals & sub plans)
 */
router.get(
  '/stats',
  authenticateTeacher,
  requireTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teacherId = req.teacher!.id;
      const [stats, iepCount, subPlanCount] = await Promise.all([
        contentService.getContentStats(teacherId),
        prisma.iEPGoalSession.count({ where: { teacherId } }),
        prisma.substitutePlan.count({ where: { teacherId } }),
      ]);

      // Inject virtual type counts so the frontend stat cards work
      if (iepCount > 0) (stats.byType as Record<string, number>)['IEP_GOALS'] = iepCount;
      if (subPlanCount > 0) (stats.byType as Record<string, number>)['SUB_PLAN'] = subPlanCount;

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
 * GET /api/teacher/content/total-count
 * Get total count of all content types (lessons, quizzes, flashcards, audio updates, sub plans, IEP goals)
 * Used to determine if sample content should be auto-hidden
 */
router.get(
  '/total-count',
  authenticateTeacher,
  requireTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teacherId = req.teacher!.id;

      // Count all content types in parallel
      const [contentCount, audioUpdateCount, subPlanCount, iepGoalCount] = await Promise.all([
        prisma.teacherContent.count({ where: { teacherId } }),
        prisma.teacherAudioUpdate.count({ where: { teacherId } }),
        prisma.substitutePlan.count({ where: { teacherId } }),
        prisma.iEPGoalSession.count({ where: { teacherId } }),
      ]);

      const totalCount = contentCount + audioUpdateCount + subPlanCount + iepGoalCount;

      res.json({
        success: true,
        data: {
          totalCount,
          breakdown: {
            content: contentCount,         // lessons, quizzes, flashcards
            audioUpdates: audioUpdateCount,
            subPlans: subPlanCount,
            iepGoals: iepGoalCount,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/teacher/content/recent
 * Get recently updated content
 */
router.get(
  '/recent',
  authenticateTeacher,
  requireTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const content = await contentService.getRecentContent(
        req.teacher!.id,
        Math.min(limit, 20)
      );

      res.json({
        success: true,
        data: content,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/teacher/content
 * Create new content
 */
router.post(
  '/',
  authenticateTeacher,
  requireTeacher,
  validateInput(createContentSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const content = await contentService.createContent(
        req.teacher!.id,
        req.body
      );

      res.status(201).json({
        success: true,
        data: content,
        message: 'Content created successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/teacher/content/from-weekly-material/:materialId
 * Find latest full lesson generated from a weekly prep material marker
 */
router.get(
  '/from-weekly-material/:materialId',
  authenticateTeacher,
  requireTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const marker = `weekly_prep_material_id:${req.params.materialId}`;
      const content = await prisma.teacherContent.findFirst({
        where: {
          teacherId: req.teacher!.id,
          contentType: TeacherContentType.LESSON,
          extractedText: {
            contains: marker,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          title: true,
          updatedAt: true,
        },
      });

      res.json({
        success: true,
        data: {
          exists: !!content,
          contentId: content?.id,
          content: content || null,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// ============================================
// STANDARDS SUGGESTIONS
// ============================================

const suggestedStandardsQuerySchema = z.object({
  subject: z.nativeEnum(Subject),
  gradeLevel: z.string().max(20),
});

/**
 * GET /api/teacher/content/standards/suggestions
 * Get suggested standards for a given subject + grade based on teacher's CurriculumState
 */
router.get(
  '/standards/suggestions',
  authenticateTeacher,
  requireTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = suggestedStandardsQuerySchema.parse(req.query);
      const result = await standardsSuggestionService.getSuggestedStandards(
        req.teacher!.id,
        parsed.subject,
        parsed.gradeLevel
      );
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
);

// ============================================
// SECTION-LEVEL EDITING
// ============================================

const regenerateSectionSchema = z.object({
  sectionIndex: z.number().int().min(0).max(50),
  instruction: z.string().min(1).max(2000),
  currentContent: z.string().max(50000),
  currentTitle: z.string().max(500),
});

const addSectionSchema = z.object({
  title: z.string().max(500).optional(),
  instruction: z.string().max(2000).optional(),
  position: z.number().int().min(0).max(50).optional(),
  useAI: z.boolean().optional().default(false),
});

/**
 * POST /api/teacher/content/:id/regenerate-section
 * Regenerate a single section of a lesson using AI
 */
router.post(
  '/:id/regenerate-section',
  authenticateTeacher,
  requireTeacher,
  validateInput(regenerateSectionSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teacherId = req.teacher!.id;
      const content = await contentService.getContentById(req.params.id, teacherId);
      if (!content) {
        res.status(404).json({ success: false, error: 'Content not found' });
        return;
      }
      if (content.contentType !== 'LESSON') {
        res.status(400).json({ success: false, error: 'Section editing is only supported for lessons' });
        return;
      }
      const result = await contentGenerationService.regenerateSection(teacherId, content, req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/teacher/content/:id/add-section
 * Add a new section to a lesson (blank or AI-generated)
 */
router.post(
  '/:id/add-section',
  authenticateTeacher,
  requireTeacher,
  validateInput(addSectionSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teacherId = req.teacher!.id;
      const content = await contentService.getContentById(req.params.id, teacherId);
      if (!content) {
        res.status(404).json({ success: false, error: 'Content not found' });
        return;
      }
      if (content.contentType !== 'LESSON') {
        res.status(400).json({ success: false, error: 'Section editing is only supported for lessons' });
        return;
      }
      const result = await contentGenerationService.addSection(teacherId, content, req.body);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/teacher/content/:id/approve-weekly-prep
 * Approve the linked weekly prep material (if present) and publish content
 */
router.post(
  '/:id/approve-weekly-prep',
  authenticateTeacher,
  requireTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teacherId = req.teacher!.id;
      const content = await contentService.getContentById(req.params.id, teacherId);

      if (!content) {
        res.status(404).json({
          success: false,
          error: 'Content not found',
        });
        return;
      }

      const materialId = extractWeeklyPrepMaterialIdFromContent(content);
      if (!materialId) {
        res.status(400).json({
          success: false,
          code: 'NOT_WEEKLY_PREP_CONTENT',
          error: 'This lesson is not linked to a weekly prep material.',
        });
        return;
      }

      await weeklyPrepService.approveMaterial(materialId, teacherId);

      const updatedContent =
        content.status === ContentStatus.PUBLISHED
          ? content
          : await contentService.updateStatus(content.id, teacherId, ContentStatus.PUBLISHED);

      res.json({
        success: true,
        data: updatedContent,
        message: 'Lesson approved and synced with weekly prep.',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/teacher/content/:id
 * Get content by ID
 */
router.get(
  '/:id',
  authenticateTeacher,
  requireTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const content = await contentService.getContentById(
        req.params.id,
        req.teacher!.id
      );

      if (!content) {
        res.status(404).json({
          success: false,
          error: 'Content not found',
        });
        return;
      }

      res.json({
        success: true,
        data: content,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PATCH /api/teacher/content/:id
 * Update content
 */
router.patch(
  '/:id',
  authenticateTeacher,
  requireTeacher,
  validateInput(updateContentSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const content = await contentService.updateContent(
        req.params.id,
        req.teacher!.id,
        req.body
      );

      if (!content) {
        res.status(404).json({
          success: false,
          error: 'Content not found',
        });
        return;
      }

      res.json({
        success: true,
        data: content,
        message: 'Content updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/teacher/content/:id
 * Delete content
 */
router.delete(
  '/:id',
  authenticateTeacher,
  requireTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await contentService.deleteContent(
        req.params.id,
        req.teacher!.id
      );

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Content not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Content deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/teacher/content/:id/duplicate
 * Duplicate content
 */
router.post(
  '/:id/duplicate',
  authenticateTeacher,
  requireTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const content = await contentService.duplicateContent(
        req.params.id,
        req.teacher!.id
      );

      if (!content) {
        res.status(404).json({
          success: false,
          error: 'Content not found',
        });
        return;
      }

      res.status(201).json({
        success: true,
        data: content,
        message: 'Content duplicated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PATCH /api/teacher/content/:id/status
 * Update content status
 */
router.patch(
  '/:id/status',
  authenticateTeacher,
  requireTeacher,
  validateInput(updateStatusSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const content = await contentService.updateStatus(
        req.params.id,
        req.teacher!.id,
        req.body.status
      );

      if (!content) {
        res.status(404).json({
          success: false,
          error: 'Content not found',
        });
        return;
      }

      res.json({
        success: true,
        data: content,
        message: `Content ${req.body.status.toLowerCase()} successfully`,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ============================================
// AI GENERATION SCHEMAS
// ============================================

// Template structure schema for reusable content structures
const templateStructureSchema = z.object({
  sections: z.array(z.object({
    type: z.string(),
    title: z.string(),
    prompt: z.string(),
    duration: z.string().optional(),
    count: z.number().optional(),
    optional: z.boolean().optional(),
  })),
  activityTypes: z.array(z.string()).optional(),
  assessmentStyle: z.string().optional(),
  questionTypes: z.array(z.string()).optional(),
  questionCount: z.number().optional(),
  flashcardCount: z.number().optional(),
}).optional();

const targetStandardsSchema = z.array(z.object({
  notation: z.string().max(100),
  description: z.string().max(500),
})).max(10).optional();

const generateLessonSchema = z.object({
  topic: z.string().min(1, 'Topic is required').max(500),
  subject: z.nativeEnum(Subject).optional(),
  gradeLevel: z.string().max(20).optional(),
  curriculum: z.string().max(50).optional(), // e.g., COMMON_CORE, UK_NATIONAL, IB_PYP
  objectives: z.array(z.string()).optional(),
  duration: z.number().min(5).max(180).optional(),
  lessonType: z.enum(['guide', 'full']).optional().default('guide'), // 'guide' = teacher guide, 'full' = comprehensive lesson
  includeActivities: z.boolean().optional(),
  includeAssessment: z.boolean().optional(),
  additionalContext: z.string().max(7000, 'Additional context must be 7000 characters or less').optional(),
  targetStandards: targetStandardsSchema,
  // Template support
  templateStructure: templateStructureSchema,
  templateId: z.string().uuid().optional(),
});

// Schema for split generation with all components
const generateFullLessonSchema = z.object({
  topic: z.string().min(1, 'Topic is required').max(500),
  subject: z.nativeEnum(Subject).optional(),
  gradeLevel: z.string().max(20).optional(),
  curriculum: z.string().max(50).optional(),
  objectives: z.array(z.string()).optional(),
  duration: z.number().min(5).max(180).optional(),
  lessonType: z.enum(['guide', 'full']).optional().default('full'),
  includeActivities: z.boolean().optional().default(true),
  includeAssessment: z.boolean().optional().default(true),
  additionalContext: z.string().max(7000, 'Additional context must be 7000 characters or less').optional(),
  targetStandards: targetStandardsSchema,
  // Split generation options
  includeQuiz: z.boolean().optional().default(true),
  includeFlashcards: z.boolean().optional().default(true),
  includeInfographic: z.boolean().optional().default(false),
  quizQuestionCount: z.number().min(5).max(20).optional().default(10),
  flashcardCount: z.number().min(5).max(30).optional().default(15),
  infographicStyle: z.enum(['educational', 'colorful', 'minimalist', 'professional']).optional(),
  // Template support
  templateStructure: templateStructureSchema,
  templateId: z.string().uuid().optional(),
});

const weeklyMaterialTypeSchema = z.enum([
  'WARM_UP',
  'LESSON',
  'WORKSHEET',
  'EXIT_TICKET',
  'QUIZ',
  'FLASHCARDS',
  'ACTIVITY',
  'HOMEWORK',
]);

type WeeklyMaterialType = z.infer<typeof weeklyMaterialTypeSchema>;

const generateFromWeeklyMaterialSchema = z.object({
  materialId: z.string().uuid().optional(),
  materialType: weeklyMaterialTypeSchema,
  title: z.string().min(1, 'Title is required').max(255),
  topic: z.string().min(1, 'Topic is required').max(500),
  subject: z.nativeEnum(Subject).optional(),
  gradeLevel: z.string().max(20).optional(),
  curriculum: z.string().max(50).optional(),
  standards: z.array(z.string().max(100)).optional(),
  notes: z.string().max(3000).optional(),
  seedMaterial: z.unknown().optional(),
  differentiation: z.string().max(50).optional(),
  includeQuiz: z.boolean().optional(),
  includeFlashcards: z.boolean().optional(),
});

const generateQuizSchema = z.object({
  content: z.string().min(5, 'Content must be at least 5 characters'),
  title: z.string().max(255).optional(),
  questionCount: z.number().min(1).max(50).optional(),
  questionTypes: z.array(z.enum(['multiple_choice', 'true_false', 'fill_blank', 'short_answer'])).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard', 'mixed']).optional(),
  gradeLevel: z.string().max(20).optional(),
});

const generateFlashcardsSchema = z.object({
  content: z.string().min(50, 'Content must be at least 50 characters'),
  title: z.string().max(255).optional(),
  cardCount: z.number().min(5).max(100).optional(),
  includeHints: z.boolean().optional(),
  gradeLevel: z.string().max(20).optional(),
});

const generateStudyGuideSchema = z.object({
  content: z.string().min(50, 'Content must be at least 50 characters'),
  title: z.string().max(255).optional(),
  format: z.enum(['outline', 'detailed', 'summary']).optional(),
  includeKeyTerms: z.boolean().optional(),
  includeReviewQuestions: z.boolean().optional(),
  gradeLevel: z.string().max(20).optional(),
});

const analyzeContentSchema = z.object({
  content: z.string()
    .min(50, 'Content must be at least 50 characters')
    .max(50000, 'Content must be at most 50,000 characters'),
  detectSubject: z.boolean().optional(),
  detectGradeLevel: z.boolean().optional(),
  extractKeyTerms: z.boolean().optional(),
});

const generateInfographicSchema = z.object({
  topic: z.string().min(1, 'Topic is required').max(255),
  keyPoints: z.array(z.string()).min(3, 'At least 3 key points required').max(10),
  style: z.enum(['educational', 'colorful', 'minimalist', 'professional']).optional(),
  gradeLevel: z.string().max(20).optional(),
  subject: z.string().max(50).optional(),
});

function safeJsonString(value: unknown, maxChars = 3500): string {
  if (value == null) return '';
  let serialized = '';
  try {
    serialized = JSON.stringify(value, null, 2);
  } catch {
    serialized = String(value);
  }
  if (serialized.length <= maxChars) return serialized;
  return `${serialized.slice(0, maxChars)}\n... (truncated)`;
}

function buildWeeklyMaterialAdditionalContext(input: z.infer<typeof generateFromWeeklyMaterialSchema>): string {
  const parts: string[] = [];

  parts.push(`[Weekly Material Type]\n${input.materialType}`);
  parts.push(`[Weekly Material Title]\n${input.title}`);
  parts.push(`[Topic]\n${input.topic}`);

  if (input.subject) parts.push(`[Subject]\n${input.subject}`);
  if (input.gradeLevel) parts.push(`[Grade Level]\n${input.gradeLevel}`);
  if (input.curriculum) parts.push(`[Curriculum]\n${input.curriculum}`);
  if (input.standards?.length) parts.push(`[Standards]\n${input.standards.join(', ')}`);
  if (input.notes) parts.push(`[Teacher Notes]\n${input.notes}`);
  if (input.differentiation) parts.push(`[Differentiation Focus]\n${input.differentiation}`);

  const seed = safeJsonString(input.seedMaterial, 5000);
  if (seed) parts.push(`[Seed Material]\n${seed}`);

  return parts.join('\n\n').slice(0, 12000);
}

function buildTemplateStructureForWeeklyMaterial(type: WeeklyMaterialType) {
  switch (type) {
    case 'WARM_UP':
      return {
        sections: [
          { type: 'hook', title: 'Warm-Up Prompt', prompt: 'Write a short, engaging warm-up prompt that activates prior knowledge.', duration: '5 min' },
          { type: 'task', title: 'Student Task', prompt: 'Provide clear task instructions and expected output from students.', duration: '5 min' },
          { type: 'answers', title: 'Answer Guide', prompt: 'Give concise model answers and common misconceptions to watch for.' },
          { type: 'debrief', title: 'Quick Debrief', prompt: 'List 2-3 fast debrief questions to transition into the lesson.' },
        ],
      };
    case 'WORKSHEET':
      return {
        sections: [
          { type: 'goal', title: 'Learning Goal', prompt: 'State the worksheet objective in student-friendly language.' },
          { type: 'instructions', title: 'Instructions', prompt: 'Provide concise student instructions for completing the worksheet.' },
          { type: 'practice', title: 'Practice Problems', prompt: 'Create 8-12 problems from easier to harder with clear numbering.', count: 10 },
          { type: 'answers', title: 'Answer Key & Notes', prompt: 'Provide answer key with short explanation per item.' },
        ],
      };
    case 'EXIT_TICKET':
      return {
        sections: [
          { type: 'instructions', title: 'Exit Ticket Instructions', prompt: 'Write clear exit-ticket instructions.' },
          { type: 'questions', title: 'Exit Ticket Questions', prompt: 'Create exactly 3 questions targeting key lesson outcomes.', count: 3 },
          { type: 'answers', title: 'Teacher Answer Key', prompt: 'Provide concise correct answers and what to look for in responses.' },
        ],
      };
    case 'ACTIVITY':
      return {
        sections: [
          { type: 'overview', title: 'Activity Overview', prompt: 'Describe purpose, objective, and engagement hook.' },
          { type: 'materials', title: 'Materials Needed', prompt: 'List all required materials and setup notes.' },
          { type: 'procedure', title: 'Step-by-Step Procedure', prompt: 'Provide a clear numbered procedure teachers can run immediately.' },
          { type: 'debrief', title: 'Discussion & Debrief', prompt: 'Provide debrief questions and expected student takeaways.' },
          { type: 'differentiation', title: 'Differentiation Moves', prompt: 'Provide above/on-level/below/ELL scaffolds.' },
        ],
      };
    case 'HOMEWORK':
      return {
        sections: [
          { type: 'instructions', title: 'Homework Instructions', prompt: 'Write clear instructions students and families can follow.' },
          { type: 'problems', title: 'Assignment Problems', prompt: 'Create 6-10 homework tasks with increasing complexity.', count: 8 },
          { type: 'extension', title: 'Extension Challenge', prompt: 'Add 1-2 optional challenge tasks for advanced learners.' },
          { type: 'answers', title: 'Answer Key', prompt: 'Provide concise answer key or model responses.' },
        ],
      };
    default:
      return undefined;
  }
}

function buildSourceContentForQuickGenerators(input: z.infer<typeof generateFromWeeklyMaterialSchema>): string {
  const lines = [
    `Title: ${input.title}`,
    `Topic: ${input.topic}`,
    input.subject ? `Subject: ${input.subject}` : '',
    input.gradeLevel ? `Grade Level: ${input.gradeLevel}` : '',
    input.curriculum ? `Curriculum: ${input.curriculum}` : '',
    input.standards?.length ? `Standards: ${input.standards.join(', ')}` : '',
    input.notes ? `Teacher Notes: ${input.notes}` : '',
  ].filter(Boolean);

  const seed = safeJsonString(input.seedMaterial, 2500);
  if (seed) lines.push(`Seed Material:\n${seed}`);

  let text = lines.join('\n');
  if (text.length < 80) {
    text += '\nExpand this into robust classroom-ready material with examples and answer guidance.';
  }
  return text;
}

// ============================================
// PDF ANALYSIS ROUTES
// ============================================

const analyzePDFSchema = z.object({
  pdfBase64: z.string().min(100, 'PDF data is required'),
  filename: z.string().max(255).optional(),
});

/**
 * POST /api/teacher/content/analyze-pdf
 * Analyze a PDF document and extract educational content
 * Uses Gemini's native PDF processing capabilities
 */
router.post(
  '/analyze-pdf',
  authenticateTeacher,
  requireTeacher,
  validateInput(analyzePDFSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { pdfBase64, filename } = req.body;

      // Check file size (base64 is ~33% larger than original)
      // 50MB PDF = ~67MB base64
      const maxBase64Size = 67 * 1024 * 1024; // ~67MB base64 = ~50MB PDF
      if (pdfBase64.length > maxBase64Size) {
        res.status(400).json({
          success: false,
          error: 'PDF file too large',
          message: 'PDF files must be under 50MB. Please compress your PDF or split it into smaller files.',
        });
        return;
      }

      // Check quota before processing
      const estimatedTokens = 4000; // PDF analysis uses roughly 4000 tokens
      await quotaService.enforceQuota(
        req.teacher!.id,
        TokenOperation.CONTENT_ANALYSIS,
        estimatedTokens
      );

      // Analyze the PDF
      const result = await geminiService.analyzePDF(pdfBase64);

      // Record usage
      await quotaService.recordUsage({
        teacherId: req.teacher!.id,
        operation: TokenOperation.CONTENT_ANALYSIS,
        tokensUsed: result.tokensUsed,
        modelUsed: 'gemini-3-flash-preview',
        resourceType: 'pdf_analysis',
      });

      res.json({
        success: true,
        data: {
          extractedText: result.extractedText,
          suggestedTitle: result.suggestedTitle,
          summary: result.summary,
          detectedSubject: result.detectedSubject,
          detectedGradeLevel: result.detectedGradeLevel,
          keyTopics: result.keyTopics,
          vocabulary: result.vocabulary,
          tokensUsed: result.tokensUsed,
          filename: filename || 'document.pdf',
        },
        message: 'PDF analyzed successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/teacher/content/analyze-pdf-async
 * Queue a PDF analysis job and return job status
 */
router.post(
  '/analyze-pdf-async',
  authenticateTeacher,
  requireTeacher,
  validateInput(analyzePDFSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { pdfBase64, filename } = req.body;

      // Check file size (base64 is ~33% larger than original)
      // 50MB PDF = ~67MB base64
      const maxBase64Size = 67 * 1024 * 1024; // ~67MB base64 = ~50MB PDF
      if (pdfBase64.length > maxBase64Size) {
        res.status(400).json({
          success: false,
          error: 'PDF file too large',
          message: 'PDF files must be under 50MB. Please compress your PDF or split it into smaller files.',
        });
        return;
      }

      const estimatedTokens = 4000;
      await quotaService.enforceQuota(
        req.teacher!.id,
        TokenOperation.CONTENT_ANALYSIS,
        estimatedTokens
      );

      const analysisRecord = await prisma.teacherDocumentAnalysis.create({
        data: {
          teacherId: req.teacher!.id,
          filename: filename || 'document.pdf',
          mimeType: 'application/pdf',
          status: DocumentAnalysisStatus.QUEUED,
        },
      });

      try {
        await queueDocumentAnalysisJob({
          analysisId: analysisRecord.id,
          teacherId: req.teacher!.id,
          mimeType: 'application/pdf',
          fileBase64: pdfBase64,
          filename: filename || 'document.pdf',
        });
      } catch (queueError) {
        await prisma.teacherDocumentAnalysis.update({
          where: { id: analysisRecord.id },
          data: {
            status: DocumentAnalysisStatus.FAILED,
            errorMessage: 'Failed to queue PDF analysis job',
          },
        });
        throw queueError;
      }

      res.status(202).json({
        success: true,
        data: {
          analysisId: analysisRecord.id,
          status: analysisRecord.status,
        },
        message: 'PDF analysis queued',
      });
    } catch (error) {
      next(error);
    }
  }
);

// ============================================
// PPT ANALYSIS ROUTES
// ============================================

const analyzePPTSchema = z.object({
  pptBase64: z.string().min(100, 'PowerPoint data is required'),
  filename: z.string().max(255).optional(),
  mimeType: z.enum([
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ]),
});

/**
 * POST /api/teacher/content/analyze-ppt
 * Analyze a PowerPoint document and extract educational content
 * Converts PPT to PDF via LibreOffice, then uses Gemini for analysis
 */
router.post(
  '/analyze-ppt',
  authenticateTeacher,
  requireTeacher,
  validateInput(analyzePPTSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { pptBase64, filename, mimeType } = req.body;

      // Check file size (base64 is ~33% larger than original)
      // 50MB PPT = ~67MB base64
      const maxBase64Size = 67 * 1024 * 1024; // ~67MB base64 = ~50MB PPT
      if (pptBase64.length > maxBase64Size) {
        res.status(400).json({
          success: false,
          error: 'PowerPoint file too large',
          message: 'PowerPoint files must be under 50MB. Please compress your file or split it into smaller presentations.',
        });
        return;
      }

      // Check quota before processing (PPT uses more tokens due to conversion)
      const estimatedTokens = 5000; // PPT analysis uses ~5000 tokens
      await quotaService.enforceQuota(
        req.teacher!.id,
        TokenOperation.CONTENT_ANALYSIS,
        estimatedTokens
      );

      // Import PPT processor dynamically to avoid startup issues if LibreOffice not installed
      const { analyzePPT } = await import('../../services/learning/pptProcessor.js');

      // Analyze the PPT
      const result = await analyzePPT(
        pptBase64,
        mimeType,
        filename || 'presentation.pptx'
      );

      // Record usage
      await quotaService.recordUsage({
        teacherId: req.teacher!.id,
        operation: TokenOperation.CONTENT_ANALYSIS,
        tokensUsed: result.tokensUsed,
        modelUsed: 'gemini-3-flash-preview',
        resourceType: 'ppt_analysis',
      });

      res.json({
        success: true,
        data: {
          extractedText: result.extractedText,
          suggestedTitle: result.suggestedTitle,
          summary: result.summary,
          detectedSubject: result.detectedSubject,
          detectedGradeLevel: result.detectedGradeLevel,
          keyTopics: result.keyTopics,
          vocabulary: result.vocabulary,
          slideCount: result.slideCount,
          originalFormat: result.originalFormat,
          tokensUsed: result.tokensUsed,
          filename: filename || 'presentation.pptx',
        },
        message: 'PowerPoint analyzed successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/teacher/content/analyze-ppt-async
 * Queue a PPT analysis job and return job status
 */
router.post(
  '/analyze-ppt-async',
  authenticateTeacher,
  requireTeacher,
  validateInput(analyzePPTSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { pptBase64, filename, mimeType } = req.body;

      // Check file size (base64 is ~33% larger than original)
      // 50MB PPT = ~67MB base64
      const maxBase64Size = 67 * 1024 * 1024; // ~67MB base64 = ~50MB PPT
      if (pptBase64.length > maxBase64Size) {
        res.status(400).json({
          success: false,
          error: 'PowerPoint file too large',
          message: 'PowerPoint files must be under 50MB. Please compress your file or split it into smaller presentations.',
        });
        return;
      }

      const estimatedTokens = 5000;
      await quotaService.enforceQuota(
        req.teacher!.id,
        TokenOperation.CONTENT_ANALYSIS,
        estimatedTokens
      );

      const analysisRecord = await prisma.teacherDocumentAnalysis.create({
        data: {
          teacherId: req.teacher!.id,
          filename: filename || 'presentation.pptx',
          mimeType,
          status: DocumentAnalysisStatus.QUEUED,
        },
      });

      try {
        await queueDocumentAnalysisJob({
          analysisId: analysisRecord.id,
          teacherId: req.teacher!.id,
          mimeType,
          fileBase64: pptBase64,
          filename: filename || 'presentation.pptx',
        });
      } catch (queueError) {
        await prisma.teacherDocumentAnalysis.update({
          where: { id: analysisRecord.id },
          data: {
            status: DocumentAnalysisStatus.FAILED,
            errorMessage: 'Failed to queue PowerPoint analysis job',
          },
        });
        throw queueError;
      }

      res.status(202).json({
        success: true,
        data: {
          analysisId: analysisRecord.id,
          status: analysisRecord.status,
        },
        message: 'PowerPoint analysis queued',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/teacher/content/analyze-jobs/:id
 * Get document analysis job status/results
 */
router.get(
  '/analyze-jobs/:id',
  authenticateTeacher,
  requireTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const analysis = await prisma.teacherDocumentAnalysis.findFirst({
        where: {
          id: req.params.id,
          teacherId: req.teacher!.id,
        },
      });

      if (!analysis) {
        res.status(404).json({
          success: false,
          error: 'Analysis job not found',
        });
        return;
      }

      res.json({
        success: true,
        data: {
          analysisId: analysis.id,
          status: analysis.status,
          filename: analysis.filename,
          mimeType: analysis.mimeType,
          result: analysis.result,
          errorMessage: analysis.errorMessage,
          createdAt: analysis.createdAt,
          completedAt: analysis.completedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// ============================================
// AI GENERATION ROUTES
// ============================================

/**
 * POST /api/teacher/content/generate/lesson
 * Generate a lesson plan from a topic
 */
router.post(
  '/generate/lesson',
  authenticateTeacher,
  requireTeacher,
  validateInput(generateLessonSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await contentGenerationService.generateLesson(
        req.teacher!.id,
        req.body
      );

      res.json({
        success: true,
        data: result,
        message: 'Lesson generated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/teacher/content/generate/full-lesson
 * Generate a complete lesson with quiz, flashcards, and optional infographic
 * Uses Server-Sent Events (SSE) for real-time progress updates
 *
 * This endpoint uses split generation - each component is generated separately
 * for better reliability and allows the frontend to show progress updates
 */
router.post(
  '/generate/full-lesson',
  authenticateTeacher,
  requireTeacher,
  validateInput(generateFullLessonSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    // Set up SSE headers for streaming progress
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
    res.flushHeaders();

    // Helper to send SSE events
    const sendEvent = (event: string, data: unknown) => {
      res.write(`event: ${event}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    // Send initial connection event
    sendEvent('connected', { message: 'Connected to lesson generator' });

    try {
      const result = await contentGenerationService.generateFullLessonWithProgress(
        req.teacher!.id,
        req.body,
        (progress) => {
          // Send progress updates via SSE
          sendEvent('progress', progress);
        }
      );

      // Send final result
      sendEvent('complete', {
        success: true,
        data: result,
        message: 'Full lesson generated successfully',
      });

      // End the stream
      res.write('event: done\ndata: {}\n\n');
      res.end();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      // Send error event
      sendEvent('error', {
        success: false,
        error: errorMessage,
        message: 'Failed to generate lesson',
      });

      res.write('event: done\ndata: {}\n\n');
      res.end();
    }
  }
);

/**
 * POST /api/teacher/content/generate/full-lesson-sync
 * Same as full-lesson but returns a single JSON response (no streaming)
 * Use this if your client doesn't support SSE
 */
router.post(
  '/generate/full-lesson-sync',
  authenticateTeacher,
  requireTeacher,
  validateInput(generateFullLessonSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await contentGenerationService.generateFullLessonWithProgress(
        req.teacher!.id,
        req.body
        // No progress callback - just wait for the result
      );

      res.json({
        success: true,
        data: result,
        message: 'Full lesson generated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/teacher/content/generate/from-weekly-material
 * Generate material-specific content from a weekly prep calendar item
 * and save directly to My Content with an appropriate content type.
 */
router.post(
  '/generate/from-weekly-material',
  authenticateTeacher,
  requireTeacher,
  validateInput(generateFromWeeklyMaterialSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = req.body as z.infer<typeof generateFromWeeklyMaterialSchema>;
      const teacherId = req.teacher!.id;
      const additionalContext = buildWeeklyMaterialAdditionalContext(input);
      const contentSource = buildSourceContentForQuickGenerators(input);
      const extractedText = input.materialId
        ? `weekly_prep_material_id:${input.materialId}`
        : undefined;

      let createPayload: {
        title: string;
        description: string;
        subject?: Subject;
        gradeLevel?: string;
        contentType: TeacherContentType;
        sourceType: SourceType;
        extractedText?: string;
        lessonContent?: Record<string, unknown>;
        quizContent?: Record<string, unknown>;
        flashcardContent?: Record<string, unknown>;
      } = {
        title: input.title,
        description: `Generated from weekly prep ${input.materialType.toLowerCase().replace(/_/g, ' ')}: ${input.topic}`,
        subject: input.subject,
        gradeLevel: input.gradeLevel,
        contentType: TeacherContentType.LESSON,
        sourceType: SourceType.TEXT,
        extractedText,
      };

      if (input.materialType === 'LESSON') {
        const generated = await contentGenerationService.generateFullLessonWithProgress(
          teacherId,
          {
            topic: input.topic,
            subject: input.subject,
            gradeLevel: input.gradeLevel,
            curriculum: input.curriculum,
            lessonType: 'full',
            includeActivities: true,
            includeAssessment: true,
            includeQuiz: input.includeQuiz ?? true,
            includeFlashcards: input.includeFlashcards ?? true,
            includeInfographic: false,
            additionalContext,
          }
        );

        createPayload = {
          ...createPayload,
          contentType: TeacherContentType.LESSON,
          lessonContent: {
            ...(generated.lesson as unknown as Record<string, unknown>),
            weeklyMaterialType: input.materialType,
            weeklyTemplateVersion: 'v1',
          },
          quizContent: generated.quiz as unknown as Record<string, unknown> | undefined,
          flashcardContent: generated.flashcards as unknown as Record<string, unknown> | undefined,
        };
      } else if (input.materialType === 'QUIZ' || input.materialType === 'EXIT_TICKET') {
        const quiz = await contentGenerationService.generateQuiz(teacherId, '', {
          content: contentSource,
          title: input.materialType === 'EXIT_TICKET'
            ? `Exit Ticket: ${input.title}`
            : `Quiz: ${input.title}`,
          questionCount: input.materialType === 'EXIT_TICKET' ? 3 : 10,
          questionTypes: input.materialType === 'EXIT_TICKET'
            ? ['multiple_choice', 'short_answer']
            : ['multiple_choice', 'true_false', 'short_answer'],
          difficulty: 'mixed',
          gradeLevel: input.gradeLevel,
        });

        createPayload = {
          ...createPayload,
          contentType: TeacherContentType.QUIZ,
          quizContent: quiz as unknown as Record<string, unknown>,
        };
      } else if (input.materialType === 'FLASHCARDS') {
        const flashcards = await contentGenerationService.generateFlashcards(teacherId, '', {
          content: contentSource,
          title: `Flashcards: ${input.title}`,
          cardCount: 15,
          includeHints: true,
          gradeLevel: input.gradeLevel,
        });

        createPayload = {
          ...createPayload,
          contentType: TeacherContentType.FLASHCARD_DECK,
          flashcardContent: flashcards as unknown as Record<string, unknown>,
        };
      } else if (
        input.materialType === 'WARM_UP' ||
        input.materialType === 'WORKSHEET' ||
        input.materialType === 'ACTIVITY' ||
        input.materialType === 'HOMEWORK'
      ) {
        const contextNote = [
          contentSource,
          input.differentiation ? `Differentiation Focus: ${input.differentiation}` : '',
        ].filter(Boolean).join('\n\n');

        const generated = await weeklyPrepService.generateSingleMaterial(
          {
            materialType: input.materialType,
            title: input.title,
            subject: input.subject || 'GENERAL',
            planContext: {
              topic: input.topic,
              standards: input.standards || [],
              notes: contextNote,
            },
          },
          teacherId
        );

        const worksheetLike = input.materialType === 'WORKSHEET' || input.materialType === 'HOMEWORK';
        createPayload = {
          ...createPayload,
          contentType: worksheetLike ? TeacherContentType.WORKSHEET : TeacherContentType.LESSON,
          lessonContent: {
            ...(generated.content as Record<string, unknown>),
            weeklyMaterialType: input.materialType,
            weeklyTemplateVersion: 'v1',
          },
        };
      } else {
        const templateStructure = buildTemplateStructureForWeeklyMaterial(input.materialType);
        const lesson = await contentGenerationService.generateLesson(teacherId, {
          topic: input.topic,
          subject: input.subject,
          gradeLevel: input.gradeLevel,
          curriculum: input.curriculum,
          lessonType: 'guide',
          includeActivities: input.materialType === 'ACTIVITY',
          includeAssessment: input.materialType !== 'ACTIVITY',
          additionalContext,
          templateStructure,
        });

        const worksheetLike = input.materialType === 'WORKSHEET' || input.materialType === 'HOMEWORK';
        createPayload = {
          ...createPayload,
          contentType: worksheetLike ? TeacherContentType.WORKSHEET : TeacherContentType.LESSON,
          lessonContent: {
            ...(lesson as unknown as Record<string, unknown>),
            weeklyMaterialType: input.materialType,
            weeklyTemplateVersion: 'v1',
          },
        };
      }

      const content = await contentService.createContent(teacherId, createPayload);

      res.json({
        success: true,
        data: {
          id: content.id,
          contentType: content.contentType,
          title: content.title,
        },
        message: 'Material generated and saved to My Content.',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/teacher/content/generate/quiz
 * Generate a quiz directly from topic or source text without creating source content
 */
router.post(
  '/generate/quiz',
  authenticateTeacher,
  requireTeacher,
  validateInput(generateQuizSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await contentGenerationService.generateQuiz(
        req.teacher!.id,
        '',
        req.body
      );

      res.json({
        success: true,
        data: result,
        message: 'Quiz generated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/teacher/content/:id/generate/quiz
 * Generate a quiz from content
 */
router.post(
  '/:id/generate/quiz',
  authenticateTeacher,
  requireTeacher,
  validateInput(generateQuizSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Verify content ownership
      const content = await contentService.getContentById(
        req.params.id,
        req.teacher!.id
      );

      if (!content) {
        res.status(404).json({
          success: false,
          error: 'Content not found',
        });
        return;
      }

      const result = await contentGenerationService.generateQuiz(
        req.teacher!.id,
        req.params.id,
        req.body
      );

      // Optionally save quiz to content
      if (req.query.save === 'true') {
        await contentService.updateContent(req.params.id, req.teacher!.id, {
          quizContent: result as unknown as Record<string, unknown>,
        });
      }

      res.json({
        success: true,
        data: result,
        message: 'Quiz generated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/teacher/content/:id/generate/flashcards
 * Generate flashcards from content
 */
router.post(
  '/:id/generate/flashcards',
  authenticateTeacher,
  requireTeacher,
  validateInput(generateFlashcardsSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Verify content ownership
      const content = await contentService.getContentById(
        req.params.id,
        req.teacher!.id
      );

      if (!content) {
        res.status(404).json({
          success: false,
          error: 'Content not found',
        });
        return;
      }

      const result = await contentGenerationService.generateFlashcards(
        req.teacher!.id,
        req.params.id,
        req.body
      );

      // Optionally save flashcards to content
      if (req.query.save === 'true') {
        await contentService.updateContent(req.params.id, req.teacher!.id, {
          flashcardContent: result as unknown as Record<string, unknown>,
        });
      }

      res.json({
        success: true,
        data: result,
        message: 'Flashcards generated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/teacher/content/:id/generate/study-guide
 * Generate a study guide from content
 */
router.post(
  '/:id/generate/study-guide',
  authenticateTeacher,
  requireTeacher,
  validateInput(generateStudyGuideSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Verify content ownership
      const content = await contentService.getContentById(
        req.params.id,
        req.teacher!.id
      );

      if (!content) {
        res.status(404).json({
          success: false,
          error: 'Content not found',
        });
        return;
      }

      const result = await contentGenerationService.generateStudyGuide(
        req.teacher!.id,
        req.params.id,
        req.body
      );

      res.json({
        success: true,
        data: result,
        message: 'Study guide generated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/teacher/content/analyze
 * Analyze content and extract metadata
 */
router.post(
  '/analyze',
  authenticateTeacher,
  requireTeacher,
  validateInput(analyzeContentSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await contentGenerationService.analyzeContent(
        req.teacher!.id,
        req.body.content,
        {
          detectSubject: req.body.detectSubject,
          detectGradeLevel: req.body.detectGradeLevel,
          extractKeyTerms: req.body.extractKeyTerms,
        }
      );

      res.json({
        success: true,
        data: result,
        message: 'Content analyzed successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/teacher/content/:id/generate/infographic
 * Generate an infographic from content
 */
router.post(
  '/:id/generate/infographic',
  authenticateTeacher,
  requireTeacher,
  validateInput(generateInfographicSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Verify content ownership
      const content = await contentService.getContentById(
        req.params.id,
        req.teacher!.id
      );

      if (!content) {
        res.status(404).json({
          success: false,
          error: 'Content not found',
        });
        return;
      }

      const result = await contentGenerationService.generateInfographic(
        req.teacher!.id,
        req.params.id,
        req.body
      );

      res.json({
        success: true,
        data: result,
        message: 'Infographic generated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
