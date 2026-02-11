import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { OrgSubscriptionTier, TeacherRole } from '@prisma/client';
import {
  authenticateTeacher,
  requireOrganization,
  requireOrgAdmin,
  requireTeacher,
  requireVerifiedEmail,
} from '../../middleware/teacherAuth.js';
import { organizationSeatService } from '../../services/teacher/organizationSeatService.js';
import { ConflictError } from '../../middleware/errorHandler.js';
import { prisma } from '../../config/database.js';
import { organizationSubscriptionService } from '../../services/stripe/organizationSubscriptionService.js';
import { validateOrganizationStripeConfig } from '../../config/stripeProductsOrganization.js';

const router = Router();

const inviteSchema = z.object({
  email: z.string().email('A valid email address is required.'),
  role: z.nativeEnum(TeacherRole).optional().default(TeacherRole.TEACHER),
  expiresInDays: z.number().int().min(1).max(30).optional().default(7),
});

const assignSchema = z.object({
  teacherId: z.string().uuid('teacherId must be a valid UUID.'),
  role: z.nativeEnum(TeacherRole).optional().default(TeacherRole.TEACHER),
});

const reassignSchema = z.object({
  fromTeacherId: z.string().uuid('fromTeacherId must be a valid UUID.'),
  toTeacherId: z.string().uuid('toTeacherId must be a valid UUID.'),
  toRole: z.nativeEnum(TeacherRole).optional().default(TeacherRole.TEACHER),
});

const orgCheckoutSchema = z.object({
  tier: z.nativeEnum(OrgSubscriptionTier),
  plan: z.enum(['monthly', 'annual']).optional(),
  isAnnual: z.boolean().optional(),
  successUrl: z.string().url('A valid successUrl is required.'),
  cancelUrl: z.string().url('A valid cancelUrl is required.'),
});

const orgPortalSchema = z.object({
  returnUrl: z.string().url('A valid returnUrl is required.'),
});

router.use(authenticateTeacher);
router.use(requireTeacher);

/**
 * GET /api/teacher/organizations/:organizationId/seats
 * Returns seat usage and member list for the organization.
 */
router.get(
  '/:organizationId/seats',
  requireOrganization('organizationId'),
  requireOrgAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await organizationSeatService.listOrganizationSeats(req.params.organizationId);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/teacher/organizations/:organizationId/seats/invite
 * Generates an organization invite token and signup URL.
 */
router.post(
  '/:organizationId/seats/invite',
  requireOrganization('organizationId'),
  requireOrgAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = inviteSchema.parse(req.body);

      await organizationSeatService.ensureSeatAvailable(req.params.organizationId);

      const existingTeacher = await prisma.teacher.findUnique({
        where: { email: parsed.email.toLowerCase() },
        select: { id: true, organizationId: true },
      });

      if (existingTeacher?.organizationId === req.params.organizationId) {
        throw new ConflictError('This teacher is already a member of your organization.');
      }
      if (existingTeacher?.organizationId && existingTeacher.organizationId !== req.params.organizationId) {
        throw new ConflictError('This teacher belongs to another organization.');
      }

      const invite = organizationSeatService.createInviteToken({
        organizationId: req.params.organizationId,
        email: parsed.email,
        role: parsed.role,
        invitedByTeacherId: req.teacher!.id,
        expiresInDays: parsed.expiresInDays,
      });

      const frontendBase = process.env.FRONTEND_URL || 'http://localhost:5173';
      const inviteUrl =
        `${frontendBase}/teacher/signup?invite=${encodeURIComponent(invite.token)}` +
        `&email=${encodeURIComponent(parsed.email.toLowerCase())}`;

      res.status(201).json({
        success: true,
        data: {
          email: parsed.email.toLowerCase(),
          role: parsed.role,
          inviteToken: invite.token,
          inviteUrl,
          expiresAt: invite.expiresAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/teacher/organizations/:organizationId/seats/assign
 * Assigns an existing teacher to an organization seat.
 */
router.post(
  '/:organizationId/seats/assign',
  requireOrganization('organizationId'),
  requireOrgAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = assignSchema.parse(req.body);
      const member = await organizationSeatService.assignTeacherToOrganization({
        organizationId: req.params.organizationId,
        teacherId: parsed.teacherId,
        role: parsed.role,
      });

      res.json({
        success: true,
        data: member,
        message: 'Seat assigned successfully.',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/teacher/organizations/:organizationId/seats/reassign
 * Reassigns a seat from one teacher to another.
 */
router.post(
  '/:organizationId/seats/reassign',
  requireOrganization('organizationId'),
  requireOrgAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = reassignSchema.parse(req.body);
      const updated = await organizationSeatService.reassignSeat({
        organizationId: req.params.organizationId,
        fromTeacherId: parsed.fromTeacherId,
        toTeacherId: parsed.toTeacherId,
        toRole: parsed.toRole,
      });

      res.json({
        success: true,
        data: updated,
        message: 'Seat reassigned successfully.',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/teacher/organizations/:organizationId/seats/:teacherId
 * Removes a teacher from an organization seat.
 */
router.delete(
  '/:organizationId/seats/:teacherId',
  requireOrganization('organizationId'),
  requireOrgAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await organizationSeatService.removeTeacherFromOrganization({
        organizationId: req.params.organizationId,
        teacherId: req.params.teacherId,
        actingTeacherId: req.teacher!.id,
      });

      res.json({
        success: true,
        data: result,
        message: 'Seat removed successfully.',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/teacher/organizations/:organizationId/billing/plans
 * List organization seat billing plans.
 */
router.get(
  '/:organizationId/billing/plans',
  requireOrganization('organizationId'),
  requireOrgAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const plans = organizationSubscriptionService.getAvailablePlans();
      res.json({
        success: true,
        data: {
          plans,
          currency: 'USD',
          billingModel: 'ORGANIZATION_SEAT_SUBSCRIPTION',
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/teacher/organizations/:organizationId/billing
 * Get current organization subscription details.
 */
router.get(
  '/:organizationId/billing',
  requireOrganization('organizationId'),
  requireOrgAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const subscription = await organizationSubscriptionService.getSubscriptionInfo(req.params.organizationId);

      res.json({
        success: true,
        data: {
          subscription,
          billingModel: 'ORGANIZATION_SEAT_SUBSCRIPTION',
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/teacher/organizations/:organizationId/billing/checkout
 * Create organization seat subscription checkout session.
 */
router.post(
  '/:organizationId/billing/checkout',
  requireOrganization('organizationId'),
  requireOrgAdmin,
  requireVerifiedEmail,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = orgCheckoutSchema.parse(req.body);
      const isAnnual = parsed.plan
        ? parsed.plan === 'annual'
        : Boolean(parsed.isAnnual);

      const result = await organizationSubscriptionService.createCheckoutSession(
        req.params.organizationId,
        parsed.tier,
        isAnnual,
        parsed.successUrl,
        parsed.cancelUrl
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
 * POST /api/teacher/organizations/:organizationId/billing/portal
 * Create billing portal session for organization subscription management.
 */
router.post(
  '/:organizationId/billing/portal',
  requireOrganization('organizationId'),
  requireOrgAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = orgPortalSchema.parse(req.body);
      const result = await organizationSubscriptionService.createCustomerPortalSession(
        req.params.organizationId,
        parsed.returnUrl
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
 * POST /api/teacher/organizations/:organizationId/billing/cancel
 * Cancel organization subscription at period end.
 */
router.post(
  '/:organizationId/billing/cancel',
  requireOrganization('organizationId'),
  requireOrgAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await organizationSubscriptionService.cancelSubscription(req.params.organizationId);
      res.json({
        success: true,
        message: 'Organization subscription will cancel at period end.',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/teacher/organizations/:organizationId/billing/resume
 * Resume organization subscription.
 */
router.post(
  '/:organizationId/billing/resume',
  requireOrganization('organizationId'),
  requireOrgAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await organizationSubscriptionService.resumeSubscription(req.params.organizationId);
      res.json({
        success: true,
        message: 'Organization subscription resumed successfully.',
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/teacher/organizations/:organizationId/billing/config-status
 * Stripe configuration status for organization billing.
 */
router.get(
  '/:organizationId/billing/config-status',
  requireOrganization('organizationId'),
  requireOrgAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const configured = organizationSubscriptionService.isConfigured();
      const validation = validateOrganizationStripeConfig();

      res.json({
        success: true,
        data: {
          stripeConfigured: configured,
          priceIdsConfigured: validation.valid,
          missingPriceIds: validation.missing,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
