// Admin Reports routes for User Management
import { Router, Request, Response, NextFunction } from 'express';
import { reportsService } from '../../services/admin/index.js';
import { authenticateAdmin, requireAdmin } from '../../middleware/adminAuth.js';
import { validateInput } from '../../middleware/validateInput.js';
import { z } from 'zod';

const router = Router();

// All reports routes require admin authentication
router.use(authenticateAdmin, requireAdmin);

// ============================================
// VALIDATION SCHEMAS
// ============================================

const paginationSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  subscriptionTier: z.string().optional(),
  pricingTier: z.string().optional(),
  curriculumType: z.string().optional(),
  dateFrom: z.string().datetime().optional().transform(val => val ? new Date(val) : undefined),
  dateTo: z.string().datetime().optional().transform(val => val ? new Date(val) : undefined),
});

const idParamSchema = z.object({
  id: z.string().uuid(),
});

// ============================================
// SUMMARY ROUTE
// ============================================

/**
 * GET /api/admin/reports/summary
 * Get summary stats for all user types
 */
router.get(
  '/summary',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const summary = await reportsService.getReportsSummary();

      res.json({
        success: true,
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ============================================
// PARENTS ROUTES
// ============================================

/**
 * GET /api/admin/reports/parents
 * List all parents with pagination and filtering
 */
router.get(
  '/parents',
  validateInput(paginationSchema, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const options = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        search: req.query.search as string | undefined,
        sortBy: req.query.sortBy as string | undefined,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
        subscriptionTier: req.query.subscriptionTier as string | undefined,
        pricingTier: req.query.pricingTier as string | undefined,
        dateFrom: req.query.dateFrom ? new Date(req.query.dateFrom as string) : undefined,
        dateTo: req.query.dateTo ? new Date(req.query.dateTo as string) : undefined,
      };

      const result = await reportsService.getParents(options);

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/admin/reports/parents/:id
 * Get detailed information for a single parent
 */
router.get(
  '/parents/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const parent = await reportsService.getParentDetails(id);

      if (!parent) {
        res.status(404).json({
          success: false,
          error: 'Parent not found',
        });
        return;
      }

      res.json({
        success: true,
        data: parent,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ============================================
// CHILDREN ROUTES
// ============================================

/**
 * GET /api/admin/reports/children
 * List all children with pagination and filtering
 */
router.get(
  '/children',
  validateInput(paginationSchema, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const options = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        search: req.query.search as string | undefined,
        sortBy: req.query.sortBy as string | undefined,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
        curriculumType: req.query.curriculumType as string | undefined,
        dateFrom: req.query.dateFrom ? new Date(req.query.dateFrom as string) : undefined,
        dateTo: req.query.dateTo ? new Date(req.query.dateTo as string) : undefined,
      };

      const result = await reportsService.getChildren(options);

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/admin/reports/children/:id
 * Get detailed information for a single child
 */
router.get(
  '/children/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const child = await reportsService.getChildDetails(id);

      if (!child) {
        res.status(404).json({
          success: false,
          error: 'Child not found',
        });
        return;
      }

      res.json({
        success: true,
        data: child,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ============================================
// TEACHERS ROUTES
// ============================================

/**
 * GET /api/admin/reports/teachers
 * List all teachers with pagination and filtering
 */
router.get(
  '/teachers',
  validateInput(paginationSchema, 'query'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const options = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 20,
        search: req.query.search as string | undefined,
        sortBy: req.query.sortBy as string | undefined,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
        subscriptionTier: req.query.subscriptionTier as string | undefined,
        dateFrom: req.query.dateFrom ? new Date(req.query.dateFrom as string) : undefined,
        dateTo: req.query.dateTo ? new Date(req.query.dateTo as string) : undefined,
      };

      const result = await reportsService.getTeachers(options);

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/admin/reports/teachers/:id
 * Get detailed information for a single teacher
 */
router.get(
  '/teachers/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const teacher = await reportsService.getTeacherDetails(id);

      if (!teacher) {
        res.status(404).json({
          success: false,
          error: 'Teacher not found',
        });
        return;
      }

      res.json({
        success: true,
        data: teacher,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
