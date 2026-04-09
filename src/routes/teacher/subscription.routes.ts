import { Router, Request, Response, NextFunction } from 'express';
import { authenticateTeacher, requireTeacher, requireVerifiedEmail } from '../../middleware/teacherAuth.js';
import { subscriptionService } from '../../services/stripe/subscriptionService.js';
import { normalizeInterval, normalizePublicTier } from '../../services/teacher/subscriptionTiers.js';

const router = Router();

router.get('/plans', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({
      success: true,
      data: subscriptionService.getAvailablePlans(),
    });
  } catch (error) {
    next(error);
  }
});

router.get('/credit-packs', async (_req: Request, res: Response) => {
  res.status(410).json({
    success: false,
    error: 'Credit packs are no longer available.',
  });
});

router.get('/validate-promo', async (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Promo codes are not supported for teacher billing.',
  });
});

router.get(
  '/',
  authenticateTeacher,
  requireTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const subscription = await subscriptionService.getSubscriptionInfo(req.teacher!.id);
      res.json({
        success: true,
        data: subscription,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/checkout',
  authenticateTeacher,
  requireTeacher,
  requireVerifiedEmail,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tier = normalizePublicTier(req.body?.tier);
      const interval = normalizeInterval(req.body?.interval || req.body?.plan || (req.body?.isAnnual ? 'annual' : 'monthly'));
      const successUrl = req.body?.successUrl;
      const cancelUrl = req.body?.cancelUrl;
      const foundingMember = Boolean(req.body?.foundingMember);

      if (!tier || tier === 'FREE') {
        return res.status(400).json({
          success: false,
          error: 'Tier must be PLUS or PRO.',
        });
      }

      if (!interval) {
        return res.status(400).json({
          success: false,
          error: 'Billing interval must be monthly or annual.',
        });
      }

      if (!successUrl || !cancelUrl) {
        return res.status(400).json({
          success: false,
          error: 'Success and cancel URLs are required.',
        });
      }

      const result = await subscriptionService.createCheckoutSession(
        req.teacher!.id,
        tier,
        interval === 'ANNUAL',
        successUrl,
        cancelUrl,
        foundingMember ? 'founding_member' : undefined
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

router.post(
  '/credit-pack/checkout',
  authenticateTeacher,
  requireTeacher,
  requireVerifiedEmail,
  async (_req: Request, res: Response) => {
    res.status(410).json({
      success: false,
      error: 'Credit packs are no longer available.',
    });
  }
);

router.post(
  '/portal',
  authenticateTeacher,
  requireTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const returnUrl = req.body?.returnUrl;
      if (!returnUrl) {
        return res.status(400).json({
          success: false,
          error: 'Return URL is required.',
        });
      }

      const result = await subscriptionService.createCustomerPortalSession(req.teacher!.id, returnUrl);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/cancel',
  authenticateTeacher,
  requireTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await subscriptionService.cancelSubscription(req.teacher!.id);
      res.json({
        success: true,
        message: 'Subscription will cancel at the end of the current billing period.',
      });
    } catch (error) {
      next(error);
    }
  }
);

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

router.get(
  '/config-status',
  authenticateTeacher,
  requireTeacher,
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const validation = subscriptionService.validateConfig();
      res.json({
        success: true,
        data: {
          stripeConfigured: subscriptionService.isConfigured(),
          pricesConfigured: validation.valid,
          missingPrices: validation.missing,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/sync',
  authenticateTeacher,
  requireTeacher,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const subscription = await subscriptionService.getSubscriptionInfo(req.teacher!.id);
      res.json({
        success: true,
        data: subscription,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
