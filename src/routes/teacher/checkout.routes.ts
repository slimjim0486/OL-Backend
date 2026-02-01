/**
 * Teacher Checkout Routes
 * - One-time download purchases
 */

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/database.js';
import { authenticateTeacher, requireTeacher, requireVerifiedEmail } from '../../middleware/teacherAuth.js';
import { subscriptionService } from '../../services/stripe/subscriptionService.js';
import { TeacherDownloadProductType } from '@prisma/client';

const router = Router();

const purchaseSchema = z.object({
  contentId: z.string().uuid(),
  productType: z.enum(['pdf', 'bundle', 'PDF', 'BUNDLE']),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

const confirmSchema = z.object({
  sessionId: z.string().min(1),
});

/**
 * POST /api/teacher/checkout/purchase
 * Create a checkout session for a one-time download purchase
 */
router.post(
  '/purchase',
  authenticateTeacher,
  requireTeacher,
  requireVerifiedEmail,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { contentId, productType, successUrl, cancelUrl } = purchaseSchema.parse(req.body);

      const teacherId = req.teacher!.id;
      const normalizedProductType = productType.toUpperCase() as TeacherDownloadProductType;

      // Verify content exists and belongs to teacher
      const content = await prisma.teacherContent.findFirst({
        where: { id: contentId, teacherId },
        select: { id: true, title: true },
      });

      if (!content) {
        return res.status(404).json({
          success: false,
          error: 'Content not found. It may have been deleted.',
        });
      }

      // Check if teacher already has access (paid subscription)
      const teacher = await prisma.teacher.findUnique({
        where: { id: teacherId },
        select: {
          subscriptionTier: true,
          subscriptionStatus: true,
          subscriptionExpiresAt: true,
        },
      });

      // Only BASIC/PROFESSIONAL with active status count as subscribers
      // FREE tier teachers must pay per download
      const isSubscriber = Boolean(
        teacher?.subscriptionTier !== 'FREE' &&
        teacher?.subscriptionStatus === 'ACTIVE' &&
        (!teacher.subscriptionExpiresAt || teacher.subscriptionExpiresAt > new Date())
      );

      if (isSubscriber) {
        return res.status(409).json({
          success: false,
          error: 'You already have unlimited downloads.',
        });
      }

      const purchases = await prisma.teacherDownloadPurchase.findMany({
        where: { teacherId, contentId },
        select: { productType: true },
      });

      const hasBundle = purchases.some(p => p.productType === 'BUNDLE');
      const hasPdf = purchases.some(p => p.productType === 'PDF') || hasBundle;

      if (hasBundle || (normalizedProductType === 'PDF' && hasPdf)) {
        return res.status(409).json({
          success: false,
          error: 'You already own this download.',
        });
      }

      const result = await subscriptionService.createDownloadCheckoutSession(
        teacherId,
        contentId,
        normalizedProductType,
        successUrl,
        cancelUrl
      );

      return res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/teacher/checkout/purchase/confirm
 * Confirm a download purchase after redirect (webhook fallback)
 */
router.post(
  '/purchase/confirm',
  authenticateTeacher,
  requireTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId } = confirmSchema.parse(req.body);
      const teacherId = req.teacher!.id;

      const result = await subscriptionService.confirmDownloadCheckoutSession(
        teacherId,
        sessionId
      );

      return res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
