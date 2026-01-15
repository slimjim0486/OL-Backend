/**
 * Curriculum Routes
 *
 * API endpoints for querying curriculum standards.
 */

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';
import { validateInput } from '../middleware/validateInput.js';
import { logger } from '../utils/logger.js';
import { Subject } from '@prisma/client';
import * as curriculumService from '../services/curriculum/curriculumService.js';

const router = Router();

// ============================================
// SCHEMAS
// ============================================

const getStandardsQuerySchema = z.object({
  strand: z.string().optional(),
  search: z.string().optional(),
  limit: z.coerce.number().min(1).max(200).optional().default(100),
  offset: z.coerce.number().min(0).optional().default(0)
});

const searchStandardsSchema = z.object({
  q: z.string().min(2, 'Search query must be at least 2 characters'),
  curriculum: z.string().optional(),
  subject: z.enum(['MATH', 'SCIENCE', 'ENGLISH', 'SOCIAL_STUDIES', 'ARABIC', 'OTHER']).optional(),
  grade: z.coerce.number().min(1).max(12).optional(),
  limit: z.coerce.number().min(1).max(100).optional().default(50),
  offset: z.coerce.number().min(0).optional().default(0)
});

// ============================================
// ROUTES
// ============================================

/**
 * GET /api/curricula
 * List all available curriculum jurisdictions
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jurisdictions = await curriculumService.getAllJurisdictions();

      res.json({
        success: true,
        data: jurisdictions
      });
    } catch (error) {
      logger.error('Error fetching jurisdictions', { error });
      next(error);
    }
  }
);

/**
 * GET /api/curricula/:code
 * Get details for a specific curriculum jurisdiction
 */
router.get(
  '/:code',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code } = req.params;
      const jurisdiction = await curriculumService.getJurisdictionByCode(code);

      if (!jurisdiction) {
        return res.status(404).json({
          success: false,
          error: `Curriculum not found: ${code}`
        });
      }

      res.json({
        success: true,
        data: jurisdiction
      });
    } catch (error) {
      logger.error('Error fetching jurisdiction', { error, code: req.params.code });
      next(error);
    }
  }
);

/**
 * GET /api/curricula/:code/standard-sets
 * Get all standard sets for a curriculum
 */
router.get(
  '/:code/standard-sets',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code } = req.params;
      const subject = req.query.subject as Subject | undefined;

      const standardSets = await curriculumService.getStandardSets(code, subject);

      res.json({
        success: true,
        data: standardSets
      });
    } catch (error) {
      logger.error('Error fetching standard sets', { error, code: req.params.code });
      next(error);
    }
  }
);

/**
 * GET /api/curricula/:code/years/:year
 * Get standards for a specific year/grade
 */
router.get(
  '/:code/years/:year',
  validateInput(getStandardsQuerySchema, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, year } = req.params;
      const { strand, search, limit, offset } = req.query;
      const subject = (req.query.subject as Subject) || 'MATH';

      const standards = await curriculumService.getStandardsForYear(
        code,
        parseInt(year, 10),
        subject,
        {
          strand: strand as string | undefined,
          searchQuery: search as string | undefined,
          limit: limit ? Number(limit) : undefined,
          offset: offset ? Number(offset) : undefined
        }
      );

      res.json({
        success: true,
        data: standards,
        meta: {
          curriculum: code,
          year: parseInt(year, 10),
          subject,
          count: standards.length,
          limit,
          offset
        }
      });
    } catch (error) {
      logger.error('Error fetching standards for year', {
        error,
        code: req.params.code,
        year: req.params.year
      });
      next(error);
    }
  }
);

/**
 * GET /api/curricula/:code/years/:year/strands
 * Get available strands for a specific year
 */
router.get(
  '/:code/years/:year/strands',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, year } = req.params;
      const subject = (req.query.subject as Subject) || 'MATH';

      const strands = await curriculumService.getStrandsForYear(
        code,
        parseInt(year, 10),
        subject
      );

      res.json({
        success: true,
        data: strands
      });
    } catch (error) {
      logger.error('Error fetching strands', {
        error,
        code: req.params.code,
        year: req.params.year
      });
      next(error);
    }
  }
);

/**
 * GET /api/curricula/standards/search
 * Search standards across all curricula
 */
router.get(
  '/standards/search',
  validateInput(searchStandardsSchema, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { q, curriculum, subject, grade, limit, offset } = req.query;

      const standards = await curriculumService.searchStandards(
        q as string,
        {
          jurisdictionCode: curriculum as string | undefined,
          subject: subject as Subject | undefined,
          gradeLevel: grade ? parseInt(grade as string, 10) : undefined,
          limit: limit ? Number(limit) : undefined,
          offset: offset ? Number(offset) : undefined
        }
      );

      res.json({
        success: true,
        data: standards,
        meta: {
          query: q,
          count: standards.length,
          limit,
          offset
        }
      });
    } catch (error) {
      logger.error('Error searching standards', { error, query: req.query.q });
      next(error);
    }
  }
);

/**
 * GET /api/curricula/standards/:id
 * Get a specific standard by ID
 */
router.get(
  '/standards/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const standard = await curriculumService.getStandardById(id);

      if (!standard) {
        return res.status(404).json({
          success: false,
          error: 'Standard not found'
        });
      }

      res.json({
        success: true,
        data: standard
      });
    } catch (error) {
      logger.error('Error fetching standard', { error, id: req.params.id });
      next(error);
    }
  }
);

/**
 * GET /api/curricula/standards/by-notation/:notation
 * Get a standard by its notation code
 */
router.get(
  '/standards/by-notation/:notation',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { notation } = req.params;
      const standard = await curriculumService.getStandardByNotation(notation);

      if (!standard) {
        return res.status(404).json({
          success: false,
          error: `Standard not found: ${notation}`
        });
      }

      res.json({
        success: true,
        data: standard
      });
    } catch (error) {
      logger.error('Error fetching standard by notation', { error, notation: req.params.notation });
      next(error);
    }
  }
);

/**
 * GET /api/curricula/child/:childId/standards
 * Get standards for a child based on their curriculum and grade
 * Requires authentication
 */
router.get(
  '/child/:childId/standards',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { childId } = req.params;

      // Verify the child belongs to the authenticated user
      if (req.parent) {
        const child = await curriculumService.getStandardsForChild(childId);
        // Additional parent-child verification could be added here

        res.json({
          success: true,
          data: child
        });
      } else {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }
    } catch (error) {
      logger.error('Error fetching child standards', { error, childId: req.params.childId });
      next(error);
    }
  }
);

export default router;
