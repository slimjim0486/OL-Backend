// Public resource routes — unauthenticated access to shared teacher content
import { Router, Request, Response, NextFunction } from 'express';
import { contentSharingService } from '../../services/teacher/index.js';

const router = Router();

/**
 * GET /api/public/resources/:slug
 * Get full public content by slug (no auth required)
 */
router.get(
  '/:slug',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;
      const content = await contentSharingService.getContentBySlug(slug);

      if (!content) {
        return res.status(404).json({ error: 'Resource not found' });
      }

      // Track view (fire and forget)
      contentSharingService.recordView(content.id).catch(() => {});

      res.json(content);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/public/resources/:slug/meta
 * Lightweight metadata for OG tags (no auth required)
 */
router.get(
  '/:slug/meta',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;
      const meta = await contentSharingService.getContentMetaBySlug(slug);

      if (!meta) {
        return res.status(404).json({ error: 'Resource not found' });
      }

      res.json(meta);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/public/resources/:slug/related
 * Get related public resources (no auth required)
 */
router.get(
  '/:slug/related',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;

      // Look up content ID by slug
      const content = await contentSharingService.getContentBySlug(slug);
      if (!content) {
        return res.status(404).json({ error: 'Resource not found' });
      }

      const related = await contentSharingService.getRelatedContent(content.id, 6);
      res.json({ content: related });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
