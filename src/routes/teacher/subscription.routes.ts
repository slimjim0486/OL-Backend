/**
 * Teacher Subscription Routes
 *
 * Handles teacher seat subscription management:
 * - Get subscription status and plans
 * - Create checkout sessions for seat subscriptions
 * - (Deprecated) Credit pack endpoints retained for compatibility
 * - Access customer portal
 * - Cancel/resume subscriptions
 */

import { Router, Request, Response, NextFunction } from 'express';
import { subscriptionService } from '../../services/stripe/subscriptionService.js';
import { authenticateTeacher, requireTeacher, requireVerifiedEmail } from '../../middleware/teacherAuth.js';
import { TeacherSubscriptionTier } from '@prisma/client';
import { validateStripeConfig } from '../../config/stripeProducts.js';

const router = Router();

// =============================================================================
// PUBLIC ENDPOINTS (No auth required)
// =============================================================================

/**
 * GET /api/teacher/subscription/plans
 * Get available subscription plans (public)
 */
router.get('/plans', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const plans = subscriptionService.getAvailablePlans();

    res.json({
      success: true,
      data: {
        plans,
        currency: 'USD',
        billingModel: 'SEAT_PLUS_DOWNLOAD',
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/teacher/subscription/credit-packs
 * Deprecated: credit packs removed in download-based pricing model
 */
router.get('/credit-packs', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(410).json({
      success: false,
      error: 'Credit packs are no longer available.',
      data: { packs: [], currency: 'USD' },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/teacher/subscription/validate-promo
 * Validate a promo code and get its discount details (public)
 * Query params: code (required)
 * Returns: discount info from Stripe coupon
 */
router.get('/validate-promo', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.query;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Promo code is required.',
      });
    }

    // Check Stripe configuration
    if (!subscriptionService.isConfigured()) {
      return res.status(503).json({
        success: false,
        error: 'Payment system is not configured.',
      });
    }

    const promoDetails = await subscriptionService.validatePromoCode(code);

    if (!promoDetails) {
      return res.status(404).json({
        success: false,
        error: 'Invalid or expired promo code.',
      });
    }

    res.json({
      success: true,
      data: promoDetails,
    });
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// PROTECTED ENDPOINTS (Auth required)
// =============================================================================

/**
 * GET /api/teacher/subscription
 * Get current subscription status
 */
router.get(
  '/',
  authenticateTeacher,
  requireTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const subscriptionInfo = await subscriptionService.getSubscriptionInfo(req.teacher!.id);

      res.json({
        success: true,
        data: {
          subscription: subscriptionInfo,
          currentTier: subscriptionInfo?.tier || 'FREE',
          pricingModel: 'DOWNLOADS',
          billingModel: 'SEAT_PLUS_DOWNLOAD',
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/teacher/subscription/checkout
 * Create a checkout session for subscription (Unlimited downloads)
 * Requires verified email to prevent fraud
 *
 * Optional: pass promoCode (e.g., "EARLYBIRD30") to auto-apply discount
 */
router.post(
  '/checkout',
  authenticateTeacher,
  requireTeacher,
  requireVerifiedEmail,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tier, plan, isAnnual = false, successUrl, cancelUrl, promoCode } = req.body;

      // Normalize billing period
      const normalizedPlan = typeof plan === 'string' ? plan.toLowerCase() : null;
      const annualBilling = normalizedPlan === 'annual' ? true : Boolean(isAnnual);

      // Back-compat: if tier is omitted (legacy "unlimited" checkout), default to Teacher (BASIC).
      // Supported paid tiers: BASIC (Teacher) and PROFESSIONAL (Teacher Pro).
      const requestedTier = (typeof tier === 'string' && ['BASIC', 'PROFESSIONAL'].includes(tier))
        ? tier
        : 'BASIC';

      // Validate URLs
      if (!successUrl || !cancelUrl) {
        return res.status(400).json({
          success: false,
          error: 'Success and cancel URLs are required.',
        });
      }

      // Check Stripe configuration
      if (!subscriptionService.isConfigured()) {
        return res.status(503).json({
          success: false,
          error: 'Payment system is not configured.',
        });
      }

      const result = await subscriptionService.createCheckoutSession(
        req.teacher!.id,
        requestedTier as TeacherSubscriptionTier,
        annualBilling,
        successUrl,
        cancelUrl,
        promoCode // Pass promo code to service
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/teacher/subscription/credit-pack/checkout
 * Deprecated: credit packs removed in download-based pricing model
 * Requires verified email to prevent fraud
 */
router.post(
  '/credit-pack/checkout',
  authenticateTeacher,
  requireTeacher,
  requireVerifiedEmail,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(410).json({
        success: false,
        error: 'Credit packs are no longer available.',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/teacher/subscription/portal
 * Create a customer portal session for managing subscription
 */
router.post(
  '/portal',
  authenticateTeacher,
  requireTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { returnUrl } = req.body;

      if (!returnUrl) {
        return res.status(400).json({
          success: false,
          error: 'Return URL is required.',
        });
      }

      // Check Stripe configuration
      if (!subscriptionService.isConfigured()) {
        return res.status(503).json({
          success: false,
          error: 'Payment system is not configured.',
        });
      }

      const result = await subscriptionService.createCustomerPortalSession(
        req.teacher!.id,
        returnUrl
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/teacher/subscription/cancel
 * Cancel subscription at period end
 */
router.post(
  '/cancel',
  authenticateTeacher,
  requireTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await subscriptionService.cancelSubscription(req.teacher!.id);

      res.json({
        success: true,
        message: 'Subscription will be cancelled at the end of the billing period.',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/teacher/subscription/resume
 * Resume a cancelled subscription (before period end)
 */
router.post(
  '/resume',
  authenticateTeacher,
  requireTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await subscriptionService.resumeSubscription(req.teacher!.id);

      res.json({
        success: true,
        message: 'Subscription resumed successfully.',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/teacher/subscription/config-status
 * Check if Stripe is properly configured (for admin/debugging)
 */
router.get(
  '/config-status',
  authenticateTeacher,
  requireTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stripeConfigured = subscriptionService.isConfigured();
      const priceConfig = validateStripeConfig();

      res.json({
        success: true,
        data: {
          stripeConfigured,
          pricesConfigured: priceConfig.valid,
          missingPrices: priceConfig.missing,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/teacher/subscription/sync
 * Manually sync subscription from Stripe
 * Used when webhook fails to update the database
 */
router.post(
  '/sync',
  authenticateTeacher,
  requireTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check Stripe configuration
      if (!subscriptionService.isConfigured()) {
        return res.status(503).json({
          success: false,
          error: 'Payment system is not configured.',
        });
      }

      // Force a sync by fetching subscription info (which will auto-sync if found)
      const subscriptionInfo = await subscriptionService.getSubscriptionInfo(req.teacher!.id);

      if (subscriptionInfo) {
        res.json({
          success: true,
          message: 'Subscription synced successfully.',
          data: {
            subscription: subscriptionInfo,
          },
        });
      } else {
        res.json({
          success: false,
          message: 'No active subscription found in Stripe for this account.',
          hint: 'If you recently completed a purchase, please wait a moment and try again.',
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;
