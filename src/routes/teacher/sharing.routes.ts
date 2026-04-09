// Content Sharing routes - Discovery, sharing, and remix functionality
import { Router, Request, Response, NextFunction } from 'express';
import { contentSharingService } from '../../services/teacher/index.js';
import { authenticateTeacher, optionalTeacherAuth } from '../../middleware/teacherAuth.js';
import { validateInput } from '../../middleware/validateInput.js';
import { z } from 'zod';
import { TeacherContentType, Subject, ShareCategory } from '@prisma/client';
import { prisma } from '../../config/database.js';

const router = Router();

// ============================================
// VALIDATION SCHEMAS
// ============================================

const discoverQuerySchema = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('12'),
  contentType: z.nativeEnum(TeacherContentType).optional(),
  subject: z.nativeEnum(Subject).optional(),
  gradeLevel: z.string().optional(),
  category: z.nativeEnum(ShareCategory).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['popular', 'recent', 'mostLiked']).default('recent'),
});

const shareContentSchema = z.object({
  category: z.nativeEnum(ShareCategory),
});

const popularQuerySchema = z.object({
  period: z.enum(['week', 'month']).default('week'),
});

const paginationSchema = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('12'),
});

// ============================================
// PUBLIC ROUTES (no auth required)
// ============================================

/**
 * GET /api/teacher/sharing/discover
 * Discover shared content with filters and pagination
 */
router.get(
  '/discover',
  optionalTeacherAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = discoverQuerySchema.parse(req.query);

      const result = await contentSharingService.discoverContent(
        {
          contentType: query.contentType,
          subject: query.subject,
          gradeLevel: query.gradeLevel,
          category: query.category,
          search: query.search,
          sortBy: query.sortBy,
        },
        { page: query.page, limit: query.limit },
        req.teacher?.id
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/teacher/sharing/featured
 * Get featured content (staff picks)
 */
router.get(
  '/featured',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const content = await contentSharingService.getFeaturedContent(6);
      res.json({ content });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/teacher/sharing/popular
 * Get popular content for this week/month
 */
router.get(
  '/popular',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = popularQuerySchema.parse(req.query);
      const content = await contentSharingService.getPopularContent(query.period, 12);
      res.json({ content });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/teacher/sharing/shared/:id
 * Get single shared content (public view)
 */
router.get(
  '/shared/:id',
  optionalTeacherAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const content = await contentSharingService.getSharedContent(id, req.teacher?.id);

      if (!content) {
        return res.status(404).json({ error: 'Content not found' });
      }

      // Track view (fire and forget)
      contentSharingService.recordView(id).catch(() => {});

      res.json(content);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/teacher/sharing/shared/:id/related
 * Get related content
 */
router.get(
  '/shared/:id/related',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const content = await contentSharingService.getRelatedContent(id, 6);
      res.json({ content });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/teacher/sharing/teacher/:teacherId
 * Get teacher's public profile and shared content
 */
router.get(
  '/teacher/:teacherId',
  optionalTeacherAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { teacherId } = req.params;
      const profile = await contentSharingService.getTeacherProfile(
        teacherId,
        req.teacher?.id
      );

      if (!profile) {
        return res.status(404).json({ error: 'Teacher not found or profile is private' });
      }

      res.json(profile);
    } catch (error) {
      next(error);
    }
  }
);

// ============================================
// PROTECTED ROUTES (auth required)
// ============================================

/**
 * POST /api/teacher/sharing/:id/share
 * Share content publicly
 */
router.post(
  '/:id/share',
  authenticateTeacher,
  validateInput(shareContentSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { category } = req.body;

      const content = await contentSharingService.shareContent(
        id,
        req.teacher!.id,
        category
      );

      res.json(content);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/teacher/sharing/:id/unshare
 * Make content private again
 */
router.post(
  '/:id/unshare',
  authenticateTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const content = await contentSharingService.unshareContent(
        id,
        req.teacher!.id
      );

      res.json(content);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/teacher/sharing/:id/remix
 * Remix (duplicate) shared content
 */
router.post(
  '/:id/remix',
  authenticateTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const remix = await contentSharingService.remixContent(
        id,
        req.teacher!.id
      );

      // Notify original author (non-fatal)
      try {
        const original = await prisma.teacherContent.findUnique({
          where: { id },
          select: { teacherId: true, title: true },
        });
        if (original && original.teacherId !== req.teacher!.id) {
          const { notificationService } = await import('../../services/teacher/notificationService.js');
          await notificationService.send({
            teacherId: original.teacherId,
            type: 'MATERIAL_REMIXED',
            title: 'Material remixed',
            body: `A teacher remixed your "${original.title || 'material'}"`,
            actionUrl: `/library`,
            metadata: { contentId: id, remixedByTeacherId: req.teacher!.id },
          });
        }
      } catch {
        // Non-fatal
      }

      res.json(remix);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/teacher/sharing/:id/like
 * Like content
 */
router.post(
  '/:id/like',
  authenticateTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      await contentSharingService.likeContent(id, req.teacher!.id);

      // Notify original author (non-fatal)
      try {
        const content = await prisma.teacherContent.findUnique({
          where: { id },
          select: { teacherId: true, title: true },
        });
        if (content && content.teacherId !== req.teacher!.id) {
          const { notificationService } = await import('../../services/teacher/notificationService.js');
          await notificationService.send({
            teacherId: content.teacherId,
            type: 'MATERIAL_SAVED',
            title: 'Material saved',
            body: `A teacher saved your "${content.title || 'material'}"`,
            actionUrl: `/library`,
            metadata: { contentId: id, savedByTeacherId: req.teacher!.id },
          });
        }
      } catch {
        // Non-fatal
      }

      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/teacher/sharing/:id/like
 * Unlike content
 */
router.delete(
  '/:id/like',
  authenticateTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      await contentSharingService.unlikeContent(id, req.teacher!.id);

      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/teacher/sharing/my-shared
 * Get my shared content
 */
router.get(
  '/my-shared',
  authenticateTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const content = await contentSharingService.getTeacherSharedContent(
        req.teacher!.id
      );

      res.json({ content });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/teacher/sharing/my-remixes
 * Get content I've remixed from others
 */
router.get(
  '/my-remixes',
  authenticateTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const content = await contentSharingService.getTeacherRemixes(
        req.teacher!.id
      );

      res.json({ content });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/teacher/sharing/my-likes
 * Get content I've liked
 */
router.get(
  '/my-likes',
  authenticateTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = paginationSchema.parse(req.query);

      const result = await contentSharingService.getLikedContent(
        req.teacher!.id,
        { page: query.page, limit: query.limit }
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/teacher/sharing/my-stats
 * Get my sharing statistics
 */
router.get(
  '/my-stats',
  authenticateTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await contentSharingService.getSharingStats(
        req.teacher!.id
      );

      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
