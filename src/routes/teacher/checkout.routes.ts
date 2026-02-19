/**
 * Teacher Checkout Routes
 * - Deprecated one-time download purchases
 */

import { Router, Request, Response, NextFunction } from 'express';
import { authenticateTeacher, requireTeacher, requireVerifiedEmail } from '../../middleware/teacherAuth.js';

const router = Router();

/**
 * POST /api/teacher/checkout/purchase
 * Deprecated: one-time download purchases have been removed.
 */
router.post(
  '/purchase',
  authenticateTeacher,
  requireTeacher,
  requireVerifiedEmail,
  async (_req: Request, res: Response, _next: NextFunction) => {
    return res.status(410).json({
      success: false,
      error: 'One-time download purchases are no longer available. You now get 3 free downloads per month, then upgrade to Teacher Unlimited.',
    });
  }
);

/**
 * POST /api/teacher/checkout/purchase/confirm
 * Deprecated: one-time download purchases have been removed.
 */
router.post(
  '/purchase/confirm',
  authenticateTeacher,
  requireTeacher,
  async (_req: Request, res: Response, _next: NextFunction) => {
    return res.status(410).json({
      success: false,
      error: 'One-time download purchases are no longer available.',
    });
  }
);

export default router;
