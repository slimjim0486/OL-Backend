/**
 * Teacher Subscription Service
 *
 * Handles Stripe subscription operations for teacher subscriptions:
 * - Creating checkout sessions for unlimited downloads
 * - Managing subscription lifecycle (cancellations, renewals)
 * - Processing per-lesson download purchases
 * - Customer portal access
 */

import Stripe from 'stripe';
import { prisma } from '../../config/database.js';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
import { TeacherSubscriptionTier, SubscriptionStatus, TeacherDownloadProductType } from '@prisma/client';
import { ConflictError, ForbiddenError, NotFoundError, ValidationError } from '../../middleware/errorHandler.js';
import {
  getProductByTier,
  isAnnualSubscription,
  getTierFromPriceId,
  SUBSCRIPTION_PRODUCTS,
  getDownloadProduct,
} from '../../config/stripeProducts.js';
import { referralService } from '../sharing/index.js';
import { emailService } from '../email/emailService.js';

// Initialize Stripe client
const stripe = config.stripe.secretKey
  ? new Stripe(config.stripe.secretKey, {
      apiVersion: '2025-11-17.clover',
    })
  : null;

const ACTIVE_SUBSCRIPTION_STATUSES: Stripe.Subscription['status'][] = [
  'active',
  'trialing',
  'past_due',
  'unpaid',
  'incomplete',
  'paused',
];

function isActiveSubscription(subscription: Stripe.Subscription): boolean {
  return ACTIVE_SUBSCRIPTION_STATUSES.includes(subscription.status);
}

async function findActiveTeacherSubscription(
  customerId: string
): Promise<Stripe.Subscription | null> {
  if (!stripe) {
    return null;
  }

  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'all',
    limit: 10,
  });

  return subscriptions.data.find(isActiveSubscription) || null;
}

// =============================================================================
// TYPES
// =============================================================================

export interface CheckoutSessionResult {
  sessionId: string;
  url: string;
}

export interface CustomerPortalResult {
  url: string;
}

export interface SubscriptionInfo {
  id: string;
  status: string;
  tier: TeacherSubscriptionTier;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  isAnnual: boolean;
}

// =============================================================================
// HELPER: Determine tier from Stripe price ID with fallback
// =============================================================================

function determineTierFromSubscription(subscription: Stripe.Subscription): TeacherSubscriptionTier | null {
  const priceId = subscription.items.data[0]?.price?.id;
  if (!priceId) return null;

  // First try the configured price IDs
  const tier = getTierFromPriceId(priceId);
  if (tier) return tier;

  // Fallback: check price amount to determine tier (treat any paid plan as Unlimited)
  const price = subscription.items.data[0]?.price;
  if (price) {
    const amount = price.unit_amount || 0;
    const interval = price.recurring?.interval;

    if (interval === 'month') {
      if (amount >= 500) return 'PROFESSIONAL';
    } else if (interval === 'year') {
      if (amount >= 5000) return 'PROFESSIONAL';
    }
  }

  return null;
}

const TIER_RANK: Record<TeacherSubscriptionTier, number> = {
  FREE: 0,
  BASIC: 1,
  PROFESSIONAL: 2,
};

function isTierDowngrade(
  currentTier: TeacherSubscriptionTier,
  nextTier: TeacherSubscriptionTier
): boolean {
  return TIER_RANK[nextTier] < TIER_RANK[currentTier];
}

function shouldDeferDowngrade(
  currentTier: TeacherSubscriptionTier | null | undefined,
  nextTier: TeacherSubscriptionTier,
  subscription: Stripe.Subscription
): boolean {
  if (!currentTier || !isTierDowngrade(currentTier, nextTier)) {
    return false;
  }

  const pendingUpdate = (subscription as any).pending_update;
  if (!pendingUpdate) {
    return false;
  }

  const billingCycleAnchor = pendingUpdate.billing_cycle_anchor;
  if (typeof billingCycleAnchor === 'number') {
    return billingCycleAnchor * 1000 > Date.now();
  }

  return true;
}

// =============================================================================
// SUBSCRIPTION SERVICE
// =============================================================================

export const subscriptionService = {
  /**
   * Check if Stripe is configured
   */
  isConfigured(): boolean {
    return !!stripe;
  },

  /**
   * Get or create a Stripe customer for a teacher
   */
  async getOrCreateCustomer(teacherId: string): Promise<string> {
    if (!stripe) {
      throw new Error('Stripe is not configured');
    }

    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        stripeCustomerId: true,
      },
    });

    if (!teacher) {
      throw new Error('Teacher not found');
    }

    // Return existing customer ID if present
    if (teacher.stripeCustomerId) {
      return teacher.stripeCustomerId;
    }

    // Create new Stripe customer
    const customer = await stripe.customers.create({
      email: teacher.email,
      name: [teacher.firstName, teacher.lastName].filter(Boolean).join(' ') || undefined,
      metadata: {
        teacherId: teacher.id,
        type: 'teacher',
      },
    });

    // Save customer ID to database
    await prisma.teacher.update({
      where: { id: teacherId },
      data: { stripeCustomerId: customer.id },
    });

    logger.info('Created Stripe customer for teacher', {
      teacherId,
      customerId: customer.id,
    });

    return customer.id;
  },

  /**
   * Create a checkout session for a subscription
   * @param promoCode - Optional promo code (e.g., "EARLYBIRD30") to auto-apply
   */
  async createCheckoutSession(
    teacherId: string,
    tier: TeacherSubscriptionTier,
    isAnnual: boolean = false,
    successUrl: string,
    cancelUrl: string,
    promoCode?: string
  ): Promise<CheckoutSessionResult> {
    if (!stripe) {
      throw new Error('Stripe is not configured');
    }

    if (tier === 'FREE') {
      throw new Error('Cannot create checkout session for FREE tier');
    }

    const product = getProductByTier(tier);
    const priceId = isAnnual ? product.priceIdAnnual : product.priceIdMonthly;

    if (!priceId) {
      throw new Error(`Price ID not configured for ${tier} ${isAnnual ? 'annual' : 'monthly'}`);
    }

    const customerId = await this.getOrCreateCustomer(teacherId);

    const activeSubscription = await findActiveTeacherSubscription(customerId);
    if (activeSubscription) {
      try {
        await this.syncSubscriptionFromStripe(teacherId, activeSubscription);
      } catch (error) {
        logger.warn('Failed to sync existing teacher subscription before checkout', {
          teacherId,
          subscriptionId: activeSubscription.id,
          error: error instanceof Error ? error.message : error,
        });
      }

      throw new ConflictError(
        'You already have an active subscription. Use Manage Billing to update or resume your plan.'
      );
    }

    // Check if this teacher was referred and has a valid referral
    const referral = await prisma.referral.findFirst({
      where: {
        referredTeacherId: teacherId,
        status: { in: ['SIGNED_UP', 'TRIALING'] },
        expiresAt: { gte: new Date() }, // Within attribution window
      },
      select: { id: true, referralCodeId: true },
    });

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        teacherId,
        tier,
        isAnnual: isAnnual.toString(),
        type: 'teacher',
        ...(referral && { referralId: referral.id, referralCodeId: referral.referralCodeId }),
        ...(promoCode && { promoCode }),
      },
      subscription_data: {
        metadata: {
          teacherId,
          tier,
          type: 'teacher',
          ...(referral && { referralId: referral.id }),
        },
      },
    };

    // Apply promo code if provided (takes precedence over referral discount)
    if (promoCode) {
      const promoCodeLookup = promoCode.trim().toUpperCase();
      if (!promoCodeLookup) {
        logger.warn('Promo code is blank', { teacherId });
      } else {
        try {
          // Look up the promotion code by its customer-facing code
          const promoCodes = await stripe.promotionCodes.list({
            code: promoCodeLookup,
            active: true,
            limit: 1,
          });

          if (promoCodes.data.length > 0) {
            sessionParams.discounts = [{ promotion_code: promoCodes.data[0].id }];
            logger.info('Applying promo code to teacher checkout', {
              teacherId,
              promoCode: promoCodeLookup,
              promotionCodeId: promoCodes.data[0].id,
            });
          } else {
            let coupon: Stripe.Coupon | null = null;
            try {
              const foundCoupon = await stripe.coupons.retrieve(promoCodeLookup);
              if (foundCoupon && !('deleted' in foundCoupon && foundCoupon.deleted)) {
                const couponDetails = foundCoupon as Stripe.Coupon;
                if (couponDetails.valid) {
                  coupon = couponDetails;
                }
              }
            } catch (error) {
              // Ignore invalid coupon IDs and fall through to warning below.
            }

            if (coupon) {
              sessionParams.discounts = [{ coupon: coupon.id }];
              logger.info('Applying coupon to teacher checkout', {
                teacherId,
                promoCode: promoCodeLookup,
                couponId: coupon.id,
              });
            } else {
              logger.warn('Promo code not found or inactive', { teacherId, promoCode: promoCodeLookup });
              // Don't fail checkout - just skip the discount
            }
          }
        } catch (error) {
          logger.error('Error looking up promo code', {
            teacherId,
            promoCode: promoCodeLookup,
            error: error instanceof Error ? error.message : error,
          });
          // Don't fail checkout - just skip the discount
        }
      }
    }
    // Apply referral discount if applicable (and no promo code was applied)
    else if (referral) {
      const refereeCouponId = process.env.STRIPE_COUPON_REFEREE_TEACHER;
      if (refereeCouponId) {
        sessionParams.discounts = [{ coupon: refereeCouponId }];
        logger.info('Applying referral discount to teacher checkout', {
          teacherId,
          referralId: referral.id,
          couponId: refereeCouponId,
        });
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    logger.info('Created checkout session', {
      teacherId,
      tier,
      isAnnual,
      promoCode: promoCode || null,
      sessionId: session.id,
    });

    return {
      sessionId: session.id,
      url: session.url!,
    };
  },

  /**
   * Create a checkout session for a credit pack purchase (deprecated)
   */
  async createCreditPackCheckoutSession(
    teacherId: string,
    packId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<CheckoutSessionResult> {
    logger.warn('Credit pack checkout requested after deprecation', {
      teacherId,
      packId,
      successUrl,
      cancelUrl,
    });

    throw new Error('Credit packs are no longer available. Please choose a download or unlimited plan instead.');
  },

  /**
   * Create a checkout session for a one-time download purchase
   */
  async createDownloadCheckoutSession(
    teacherId: string,
    contentId: string,
    productType: TeacherDownloadProductType,
    successUrl: string,
    cancelUrl: string
  ): Promise<CheckoutSessionResult> {
    if (!stripe) {
      throw new Error('Stripe is not configured');
    }

    const product = getDownloadProduct(productType);
    if (!product?.priceId) {
      throw new Error(`Price ID not configured for download product: ${productType}`);
    }

    const customerId = await this.getOrCreateCustomer(teacherId);

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      line_items: [
        {
          price: product.priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        teacherId,
        contentId,
        productType,
        type: 'download_purchase',
      },
    });

    logger.info('Created download purchase checkout session', {
      teacherId,
      contentId,
      productType,
      sessionId: session.id,
    });

    return {
      sessionId: session.id,
      url: session.url!,
    };
  },

  /**
   * Create a customer portal session for managing subscription
   */
  async createCustomerPortalSession(
    teacherId: string,
    returnUrl: string
  ): Promise<CustomerPortalResult> {
    if (!stripe) {
      throw new Error('Stripe is not configured');
    }

    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: { stripeCustomerId: true },
    });

    if (!teacher?.stripeCustomerId) {
      throw new Error('No Stripe customer found for teacher');
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: teacher.stripeCustomerId,
      return_url: returnUrl,
    });

    return { url: session.url };
  },

  /**
   * Sync subscription from Stripe to database
   * This is called as a fallback when webhook didn't update the database
   */
  async syncSubscriptionFromStripe(teacherId: string, subscription: Stripe.Subscription): Promise<void> {
    const tier = determineTierFromSubscription(subscription);

    if (!tier) {
      logger.warn('Could not determine tier from Stripe subscription during sync', {
        teacherId,
        subscriptionId: subscription.id,
        priceId: subscription.items.data[0]?.price?.id,
      });
      return;
    }

    // Check if we should defer a downgrade (pending_update with future billing_cycle_anchor)
    const existingTeacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: { subscriptionTier: true },
    });

    const deferDowngrade = shouldDeferDowngrade(
      existingTeacher?.subscriptionTier,
      tier,
      subscription
    );

    // Use existing tier if downgrade is deferred, otherwise use the detected tier
    const effectiveTier = deferDowngrade && existingTeacher?.subscriptionTier
      ? existingTeacher.subscriptionTier
      : tier;

    if (deferDowngrade) {
      logger.info('Deferring downgrade during sync until period end', {
        teacherId,
        subscriptionId: subscription.id,
        currentTier: existingTeacher?.subscriptionTier,
        detectedTier: tier,
      });
    }

    // Stripe API returns current_period_end as a number (Unix timestamp)
    // Handle both direct property and items-based period end
    let currentPeriodEnd: number | undefined;

    if ((subscription as any).current_period_end) {
      currentPeriodEnd = (subscription as any).current_period_end;
    } else if (subscription.items?.data?.[0]?.current_period_end) {
      currentPeriodEnd = (subscription.items.data[0] as any).current_period_end;
    }

    // Calculate subscription expiry date
    let subscriptionExpiresAt: Date | null = null;
    if (currentPeriodEnd && !isNaN(currentPeriodEnd)) {
      subscriptionExpiresAt = new Date(currentPeriodEnd * 1000);
    } else {
      const daysToAdd = subscription.items?.data?.[0]?.price?.recurring?.interval === 'year' ? 365 : 30;
      subscriptionExpiresAt = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000);
      logger.warn('Could not determine current_period_end during sync, using fallback expiry', {
        subscriptionId: subscription.id,
        fallbackDays: daysToAdd,
      });
    }

    // Calculate trial end if applicable
    let trialEndsAt: Date | null = null;
    const trialEnd = (subscription as any).trial_end;
    if (trialEnd && typeof trialEnd === 'number') {
      trialEndsAt = new Date(trialEnd * 1000);
    }

    // Determine status - use enum values
    const subscriptionStatus: SubscriptionStatus =
      subscription.status === 'active' || subscription.status === 'trialing'
        ? SubscriptionStatus.ACTIVE
        : SubscriptionStatus.PAST_DUE;

    logger.info('Syncing subscription from Stripe to database', {
      teacherId,
      subscriptionId: subscription.id,
      tier,
      status: subscription.status,
      subscriptionStatus,
      currentPeriodEnd,
      subscriptionExpiresAt,
    });

    await prisma.teacher.update({
      where: { id: teacherId },
      data: {
        subscriptionTier: effectiveTier,
        subscriptionStatus,
        stripeSubscriptionId: subscription.id,
        subscriptionExpiresAt,
        trialEndsAt,
      },
    });

    logger.info('Successfully synced subscription from Stripe to database', {
      teacherId,
      subscriptionId: subscription.id,
      tier: effectiveTier,
    });
  },

  /**
   * Get current subscription info for a teacher
   * Includes automatic sync if subscription exists in Stripe but not in database
   */
  async getSubscriptionInfo(teacherId: string): Promise<SubscriptionInfo | null> {
    if (!stripe) {
      return null;
    }

    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: {
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        subscriptionTier: true,
      },
    });

    if (!teacher) {
      return null;
    }

    // If we have a subscription ID, fetch it directly
    if (teacher.stripeSubscriptionId) {
      try {
        const subscription = await stripe.subscriptions.retrieve(teacher.stripeSubscriptionId);

        const priceId = subscription.items.data[0]?.price?.id;
        const detectedTier = determineTierFromSubscription(subscription);
        const effectiveTier = detectedTier && shouldDeferDowngrade(
          teacher.subscriptionTier,
          detectedTier,
          subscription
        )
          ? teacher.subscriptionTier
          : (detectedTier || teacher.subscriptionTier);

        // Stripe API returns current_period_end as a number (Unix timestamp)
        const rawPeriodEnd = (subscription as any).current_period_end ||
          (subscription.items?.data?.[0] as any)?.current_period_end;
        const currentPeriodEnd = rawPeriodEnd && !isNaN(rawPeriodEnd)
          ? new Date(rawPeriodEnd * 1000)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Fallback to 30 days

        return {
          id: subscription.id,
          status: subscription.status,
          tier: effectiveTier,
          currentPeriodEnd,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          isAnnual: priceId ? isAnnualSubscription(priceId) : false,
        };
      } catch (error) {
        logger.error('Failed to retrieve subscription', { error, teacherId });
        return null;
      }
    }

    // No subscription ID in database - check if customer has subscriptions in Stripe
    // This handles the case where webhook failed to update the database
    if (teacher.stripeCustomerId) {
      try {
        const subscriptions = await stripe.subscriptions.list({
          customer: teacher.stripeCustomerId,
          status: 'all',
          limit: 5,
        });

        // Find the most recent active/trialing subscription
        const activeSubscription = subscriptions.data.find(
          sub => sub.status === 'active' || sub.status === 'trialing'
        );

        if (activeSubscription) {
          logger.info('Found active subscription in Stripe that was missing from database - syncing', {
            teacherId,
            subscriptionId: activeSubscription.id,
            customerId: teacher.stripeCustomerId,
          });

          // Sync the subscription to the database
          await this.syncSubscriptionFromStripe(teacherId, activeSubscription);

          const priceId = activeSubscription.items.data[0]?.price?.id;
          const detectedTier = determineTierFromSubscription(activeSubscription);
          const effectiveTier = detectedTier && shouldDeferDowngrade(
            teacher.subscriptionTier,
            detectedTier,
            activeSubscription
          )
            ? teacher.subscriptionTier
            : (detectedTier || teacher.subscriptionTier);
          const rawPeriodEnd = (activeSubscription as any).current_period_end ||
            (activeSubscription.items?.data?.[0] as any)?.current_period_end;
          const currentPeriodEnd = rawPeriodEnd && !isNaN(rawPeriodEnd)
            ? new Date(rawPeriodEnd * 1000)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Fallback to 30 days

          return {
            id: activeSubscription.id,
            status: activeSubscription.status,
            tier: effectiveTier || 'BASIC',
            currentPeriodEnd,
            cancelAtPeriodEnd: activeSubscription.cancel_at_period_end,
            isAnnual: priceId ? isAnnualSubscription(priceId) : false,
          };
        } else {
          logger.info('No active subscriptions found for customer in Stripe', {
            teacherId,
            customerId: teacher.stripeCustomerId,
            totalSubscriptions: subscriptions.data.length,
            statuses: subscriptions.data.map(s => s.status),
          });
        }
      } catch (error: any) {
        // Log detailed error info for debugging
        logger.error('Failed to list subscriptions for customer', {
          error: error.message || error,
          errorType: error.type,
          errorCode: error.code,
          teacherId,
          customerId: teacher.stripeCustomerId,
          hint: error.code === 'resource_missing'
            ? 'Customer ID may be from a different Stripe environment (test vs live)'
            : undefined,
        });
      }
    }

    return null;
  },

  /**
   * Cancel a subscription at period end
   */
  async cancelSubscription(teacherId: string): Promise<void> {
    if (!stripe) {
      throw new Error('Stripe is not configured');
    }

    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: { stripeSubscriptionId: true },
    });

    if (!teacher?.stripeSubscriptionId) {
      throw new Error('No active subscription found');
    }

    await stripe.subscriptions.update(teacher.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    logger.info('Subscription set to cancel at period end', {
      teacherId,
      subscriptionId: teacher.stripeSubscriptionId,
    });
  },

  /**
   * Resume a cancelled subscription (before period end)
   */
  async resumeSubscription(teacherId: string): Promise<void> {
    if (!stripe) {
      throw new Error('Stripe is not configured');
    }

    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: { stripeSubscriptionId: true },
    });

    if (!teacher?.stripeSubscriptionId) {
      throw new Error('No subscription found');
    }

    await stripe.subscriptions.update(teacher.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });

    logger.info('Subscription resumed', {
      teacherId,
      subscriptionId: teacher.stripeSubscriptionId,
    });
  },

  // =============================================================================
  // WEBHOOK HANDLERS
  // =============================================================================

  /**
   * Handle subscription created/updated from webhook
   */
  async handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
    logger.info('Processing subscription created/updated webhook', {
      subscriptionId: subscription.id,
      status: subscription.status,
      metadata: subscription.metadata,
      customerId: typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id,
    });

    // Skip family subscriptions - they're handled by familySubscriptionService
    if (subscription.metadata.type === 'family') {
      logger.debug('Skipping family subscription in teacher handler', {
        subscriptionId: subscription.id,
      });
      return;
    }

    const teacherId = subscription.metadata.teacherId;
    if (!teacherId) {
      // Try to find teacher by customer ID if teacherId is missing from metadata
      const customerId = typeof subscription.customer === 'string'
        ? subscription.customer
        : subscription.customer?.id;

      logger.info('teacherId missing from subscription metadata, attempting to find by customer ID', {
        subscriptionId: subscription.id,
        customerId,
      });

      if (customerId) {
        const teacher = await prisma.teacher.findFirst({
          where: { stripeCustomerId: customerId },
          select: { id: true },
        });

        if (teacher) {
          logger.info('Found teacher by customer ID since metadata was missing', {
            subscriptionId: subscription.id,
            customerId,
            teacherId: teacher.id,
          });
          // Use syncSubscriptionFromStripe which handles all the updates
          await this.syncSubscriptionFromStripe(teacher.id, subscription);
          return;
        }
      }

      logger.warn('Subscription has no teacherId in metadata and could not find by customer', {
        subscriptionId: subscription.id,
        metadata: subscription.metadata,
        customerId,
      });
      return;
    }

    // Use the helper function with price-based fallback
    const priceId = subscription.items.data[0]?.price?.id;
    const priceAmount = subscription.items.data[0]?.price?.unit_amount;
    const tier = determineTierFromSubscription(subscription);

    logger.info('Tier detection result', {
      subscriptionId: subscription.id,
      teacherId,
      priceId,
      priceAmount,
      detectedTier: tier,
      configuredBasicMonthlyPriceId: process.env.STRIPE_PRICE_TEACHER_BASIC_MONTHLY || '(not set)',
      configuredBasicAnnualPriceId: process.env.STRIPE_PRICE_TEACHER_BASIC_ANNUAL || '(not set)',
      configuredProMonthlyPriceId: process.env.STRIPE_PRICE_TEACHER_PRO_MONTHLY || '(not set)',
    });

    if (!tier) {
      logger.warn('Could not determine tier from subscription', {
        subscriptionId: subscription.id,
        priceId,
        priceAmount,
        hint: 'Price ID does not match configured IDs and amount-based fallback failed',
      });
      return;
    }

    const existingTeacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: { subscriptionTier: true },
    });

    const shouldDelayDowngrade = shouldDeferDowngrade(
      existingTeacher?.subscriptionTier,
      tier,
      subscription
    );
    const effectiveTier = shouldDelayDowngrade && existingTeacher?.subscriptionTier
      ? existingTeacher.subscriptionTier
      : tier;

    if (shouldDelayDowngrade) {
      logger.info('Deferring downgrade until period end', {
        teacherId,
        subscriptionId: subscription.id,
        currentTier: existingTeacher?.subscriptionTier,
        detectedTier: tier,
      });
    }

    // Calculate trial end if applicable
    let trialEndsAt: Date | null = null;
    if (subscription.trial_end) {
      trialEndsAt = new Date(subscription.trial_end * 1000);
    }

    // Stripe API returns current_period_end as a number (Unix timestamp)
    // Handle both direct property and items-based period end
    let currentPeriodEnd: number | undefined;

    // Try direct property first (standard location)
    if ((subscription as any).current_period_end) {
      currentPeriodEnd = (subscription as any).current_period_end;
    }
    // Fallback to items data
    else if (subscription.items?.data?.[0]?.current_period_end) {
      currentPeriodEnd = (subscription.items.data[0] as any).current_period_end;
    }

    // Calculate subscription expiry date
    let subscriptionExpiresAt: Date | null = null;
    if (currentPeriodEnd && !isNaN(currentPeriodEnd)) {
      subscriptionExpiresAt = new Date(currentPeriodEnd * 1000);
    } else {
      // Fallback: set expiry to 30 days from now for monthly, 365 for annual
      const daysToAdd = subscription.items?.data?.[0]?.price?.recurring?.interval === 'year' ? 365 : 30;
      subscriptionExpiresAt = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000);
      logger.warn('Could not determine current_period_end, using fallback expiry', {
        subscriptionId: subscription.id,
        fallbackDays: daysToAdd,
        subscriptionExpiresAt,
      });
    }

    // Update teacher's subscription info
    try {
      logger.info('Attempting to update teacher subscription in database', {
        teacherId,
        subscriptionId: subscription.id,
        tier,
        currentPeriodEnd,
        subscriptionExpiresAt,
      });

      await prisma.teacher.update({
        where: { id: teacherId },
        data: {
          subscriptionTier: effectiveTier,
          subscriptionStatus: subscription.status === 'active' || subscription.status === 'trialing' ? 'ACTIVE' : 'PAST_DUE',
          stripeSubscriptionId: subscription.id,
          subscriptionExpiresAt,
          trialEndsAt,
        },
      });

      logger.info('Subscription created/updated successfully', {
        teacherId,
        subscriptionId: subscription.id,
        tier: effectiveTier,
        status: subscription.status,
      });
    } catch (dbError: any) {
      logger.error('Failed to update teacher subscription in database', {
        teacherId,
        subscriptionId: subscription.id,
        tier,
        error: dbError.message || dbError,
        errorCode: dbError.code,
        hint: dbError.code === 'P2025'
          ? 'Teacher not found in database - teacherId may be invalid'
          : undefined,
      });
      throw dbError; // Re-throw to ensure webhook returns error
    }

    // Handle referral conversion and reward fulfillment
    // Only reward on active subscriptions (not trials)
    if (subscription.status === 'active' && subscription.metadata.referralId) {
      try {
        await referralService.markAsConverted(teacherId, 'teacher');
        logger.info('Teacher referral marked as converted and reward created', {
          teacherId,
          subscriptionId: subscription.id,
          referralId: subscription.metadata.referralId,
        });
      } catch (referralError) {
        // Log but don't fail the subscription update
        logger.error('Failed to process teacher referral reward', {
          teacherId,
          subscriptionId: subscription.id,
          referralId: subscription.metadata.referralId,
          error: referralError instanceof Error ? referralError.message : referralError,
        });
      }
    }
  },

  /**
   * Handle subscription deleted from webhook
   */
  async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    // Skip family subscriptions - they're handled by familySubscriptionService
    if (subscription.metadata.type === 'family') {
      logger.debug('Skipping family subscription deletion in teacher handler', {
        subscriptionId: subscription.id,
      });
      return;
    }

    const teacherId = subscription.metadata.teacherId;
    if (!teacherId) {
      logger.warn('Subscription has no teacherId in metadata', {
        subscriptionId: subscription.id,
        metadata: subscription.metadata,
      });
      return;
    }

    await prisma.teacher.update({
      where: { id: teacherId },
      data: {
        subscriptionTier: 'FREE',
        subscriptionStatus: 'ACTIVE',
        stripeSubscriptionId: null,
        subscriptionExpiresAt: null,
        trialEndsAt: null,
      },
    });

    logger.info('Subscription deleted, reverted to FREE tier', {
      teacherId,
      subscriptionId: subscription.id,
    });
  },

  /**
   * Handle checkout session completed from webhook
   */
  async handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
    // Skip family subscription checkouts - they're handled by familySubscriptionService
    if (session.metadata?.type === 'family') {
      logger.debug('Skipping family checkout in teacher handler', {
        sessionId: session.id,
      });
      return;
    }

    const teacherId = session.metadata?.teacherId;
    if (!teacherId) {
      logger.warn('Checkout session has no teacherId in metadata', {
        sessionId: session.id,
        metadata: session.metadata,
      });
      return;
    }

    // Check if this is a download purchase
    if (session.metadata?.type === 'download_purchase') {
      const contentId = session.metadata.contentId;
      const productType = session.metadata.productType as TeacherDownloadProductType | undefined;
      const amountCents = session.amount_total ?? 0;

      if (!contentId || !productType || !['PDF', 'BUNDLE'].includes(productType)) {
        logger.warn('Download purchase checkout missing details', {
          teacherId,
          sessionId: session.id,
          contentId,
          productType,
        });
        return;
      }

      try {
        await prisma.teacherDownloadPurchase.create({
          data: {
            teacherId,
            contentId,
            productType,
            amountCents,
            stripeSessionId: session.id,
          },
        });

        logger.info('Download purchase recorded', {
          teacherId,
          contentId,
          productType,
          sessionId: session.id,
        });

        // Send purchase confirmation email
        try {
          const [teacher, content] = await Promise.all([
            prisma.teacher.findUnique({
              where: { id: teacherId },
              select: { email: true, firstName: true },
            }),
            prisma.teacherContent.findUnique({
              where: { id: contentId },
              select: { title: true },
            }),
          ]);

          if (teacher?.email) {
            await emailService.sendTeacherDownloadPurchaseEmail(
              teacher.email,
              teacher.firstName || 'Teacher',
              productType,
              content?.title || 'Your Content',
              amountCents
            );
          }
        } catch (emailError) {
          logger.error('Failed to send download purchase email', { emailError, teacherId });
          // Don't throw - purchase was successful, email is secondary
        }
      } catch (error: any) {
        if (error?.code === 'P2002') {
          logger.warn('Download purchase already processed', {
            teacherId,
            contentId,
            productType,
            sessionId: session.id,
          });
          return;
        }
        throw error;
      }

      return;
    }

    // For subscriptions, the subscription.created webhook will handle the update
    logger.info('Checkout session completed', {
      teacherId,
      sessionId: session.id,
      mode: session.mode,
    });
  },

  /**
   * Confirm a download checkout session after redirect (webhook fallback)
   */
  async confirmDownloadCheckoutSession(
    teacherId: string,
    sessionId: string
  ): Promise<{ status: 'recorded' | 'already_recorded' | 'pending'; contentId: string; productType: TeacherDownloadProductType }> {
    if (!stripe) {
      throw new Error('Stripe is not configured');
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.metadata?.type !== 'download_purchase') {
      throw new ValidationError('Invalid checkout session type');
    }

    if (session.metadata?.teacherId && session.metadata.teacherId !== teacherId) {
      throw new ForbiddenError('Checkout session does not belong to this teacher');
    }

    const contentId = session.metadata?.contentId;
    const productType = session.metadata?.productType as TeacherDownloadProductType | undefined;

    if (!contentId || !productType || !['PDF', 'BUNDLE'].includes(productType)) {
      throw new ValidationError('Checkout session is missing purchase details');
    }

    const isPaid = session.payment_status === 'paid' || session.payment_status === 'no_payment_required';
    if (!isPaid || session.status !== 'complete') {
      return { status: 'pending', contentId, productType };
    }

    const content = await prisma.teacherContent.findFirst({
      where: { id: contentId, teacherId },
      select: { id: true, title: true },
    });

    if (!content) {
      throw new NotFoundError('Content not found. It may have been deleted.');
    }

    const amountCents = session.amount_total ?? 0;

    try {
      await prisma.teacherDownloadPurchase.create({
        data: {
          teacherId,
          contentId,
          productType,
          amountCents,
          stripeSessionId: session.id,
        },
      });

      logger.info('Download purchase recorded via confirmation', {
        teacherId,
        contentId,
        productType,
        sessionId: session.id,
      });

      // Send purchase confirmation email
      try {
        const teacher = await prisma.teacher.findUnique({
          where: { id: teacherId },
          select: { email: true, firstName: true },
        });

        if (teacher?.email) {
          await emailService.sendTeacherDownloadPurchaseEmail(
            teacher.email,
            teacher.firstName || 'Teacher',
            productType,
            content.title || 'Your Content',
            amountCents
          );
        }
      } catch (emailError) {
        logger.error('Failed to send download purchase email via confirmation', { emailError, teacherId });
        // Don't throw - purchase was successful, email is secondary
      }

      return { status: 'recorded', contentId, productType };
    } catch (error: any) {
      if (error?.code === 'P2002') {
        logger.info('Download purchase already recorded via confirmation', {
          teacherId,
          contentId,
          productType,
          sessionId: session.id,
        });
        return { status: 'already_recorded', contentId, productType };
      }
      throw error;
    }
  },

  /**
   * Handle invoice payment failed from webhook
   */
  async handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    // Stripe API returns subscription as string or Subscription object
    // Using 'as any' due to Stripe SDK type inconsistencies
    const invoiceAny = invoice as any;
    const subscriptionId = typeof invoiceAny.subscription === 'string'
      ? invoiceAny.subscription
      : invoiceAny.subscription?.id;
    if (!subscriptionId) {
      return;
    }

    // Find teacher by subscription ID
    const teacher = await prisma.teacher.findFirst({
      where: { stripeSubscriptionId: subscriptionId },
      select: { id: true },
    });

    if (teacher) {
      await prisma.teacher.update({
        where: { id: teacher.id },
        data: {
          subscriptionStatus: 'PAST_DUE',
        },
      });

      logger.warn('Subscription payment failed', {
        teacherId: teacher.id,
        subscriptionId,
        invoiceId: invoice.id,
      });
    }
  },

  // =============================================================================
  // UTILITIES
  // =============================================================================

  /**
   * Get available plans for display
   */
  getAvailablePlans() {
    const plans = [
      SUBSCRIPTION_PRODUCTS.FREE,
      SUBSCRIPTION_PRODUCTS.PROFESSIONAL,
    ];

    return plans.map(product => ({
      tier: product.tier,
      name: product.name,
      priceMonthly: product.priceMonthly,
      priceAnnual: product.priceAnnual,
      features: product.features,
    }));
  },

  /**
   * Get available credit packs for display
   */
  getAvailableCreditPacks() {
    return [];
  },

  /**
   * Validate a promo code and return its discount details
   * Returns null if the code is invalid or expired
   */
  async validatePromoCode(code: string): Promise<{
    code: string;
    percentOff: number | null;
    amountOff: number | null;
    currency: string | null;
    duration: 'forever' | 'once' | 'repeating';
    durationInMonths: number | null;
    name: string | null;
    valid: boolean;
  } | null> {
    if (!stripe) {
      throw new Error('Stripe is not configured');
    }

    const promoCodeLookup = code.trim().toUpperCase();

    try {
      // Look up the promotion code by its customer-facing code
      const promoCodes = await stripe.promotionCodes.list({
        code: promoCodeLookup,
        active: true,
        limit: 1,
        expand: ['data.coupon'],
      });

      let promoCode: Stripe.PromotionCode | null = null;
      let missingCouponReference = false;

      if (promoCodes.data.length > 0) {
        promoCode = promoCodes.data[0];

        // Check redemption limits
        if (promoCode.max_redemptions && promoCode.times_redeemed >= promoCode.max_redemptions) {
          logger.info('Promo code has reached max redemptions', {
            code: promoCodeLookup,
            maxRedemptions: promoCode.max_redemptions,
            timesRedeemed: promoCode.times_redeemed,
          });
          return null;
        }

        // Check expiration
        if (promoCode.expires_at && promoCode.expires_at * 1000 < Date.now()) {
          logger.info('Promo code has expired', { code: promoCodeLookup, expiresAt: promoCode.expires_at });
          return null;
        }

        // promoCode.coupon can be a string ID or an expanded coupon object
        let promoCoupon = (promoCode as any).coupon as
          | Stripe.Coupon
          | Stripe.DeletedCoupon
          | string
          | null
          | undefined;
        let couponId =
          typeof promoCoupon === 'string'
            ? promoCoupon
            : promoCoupon && typeof promoCoupon === 'object'
              ? promoCoupon.id
              : null;

        if (!couponId) {
          try {
            const fullPromoCode = await stripe.promotionCodes.retrieve(promoCode.id, {
              expand: ['coupon'],
            });
            promoCoupon = (fullPromoCode as any).coupon as
              | Stripe.Coupon
              | Stripe.DeletedCoupon
              | string
              | null
              | undefined;
            couponId =
              typeof promoCoupon === 'string'
                ? promoCoupon
                : promoCoupon && typeof promoCoupon === 'object'
                  ? promoCoupon.id
                  : null;
          } catch (error) {
            logger.warn('Failed to retrieve full promo code for coupon lookup', {
              code: promoCodeLookup,
              promoCodeId: promoCode.id,
              error: error instanceof Error ? error.message : error,
            });
          }
        }

        if (couponId) {
          const coupon =
            typeof promoCoupon === 'string' ? await stripe.coupons.retrieve(couponId) : promoCoupon;

          // Check if coupon is still valid
          if (!coupon) {
            logger.info('Promo code coupon is missing', { code: promoCodeLookup, couponId });
            return null;
          }

          if ('deleted' in coupon && coupon.deleted) {
            logger.info('Promo code coupon is deleted', { code: promoCodeLookup, couponId });
            return null;
          }

          const couponDetails = coupon as Stripe.Coupon;

          if (!couponDetails.valid) {
            logger.info('Promo code coupon is no longer valid', { code: promoCodeLookup, couponId });
            return null;
          }

          logger.info('Promo code validated successfully', {
            code: promoCodeLookup,
            couponId,
            percentOff: couponDetails.percent_off,
            amountOff: couponDetails.amount_off,
            duration: couponDetails.duration,
            durationInMonths: couponDetails.duration_in_months,
          });

          return {
            code: promoCodeLookup,
            percentOff: couponDetails.percent_off,
            amountOff: couponDetails.amount_off,
            currency: couponDetails.currency,
            duration: couponDetails.duration,
            durationInMonths: couponDetails.duration_in_months,
            name: couponDetails.name,
            valid: true,
          };
        }

        missingCouponReference = true;
      }

      let fallbackCoupon: Stripe.Coupon | null = null;
      try {
        const coupon = await stripe.coupons.retrieve(promoCodeLookup);
        if (coupon && !('deleted' in coupon && coupon.deleted)) {
          const couponDetails = coupon as Stripe.Coupon;
          if (couponDetails.valid) {
            fallbackCoupon = couponDetails;
          }
        }
      } catch (error) {
        // Ignore invalid coupon IDs and fall through to logging below.
      }

      if (fallbackCoupon) {
        logger.info('Promo code validated using coupon ID', {
          code: promoCodeLookup,
          couponId: fallbackCoupon.id,
          promoCodeId: promoCode ? promoCode.id : null,
        });

        return {
          code: promoCodeLookup,
          percentOff: fallbackCoupon.percent_off,
          amountOff: fallbackCoupon.amount_off,
          currency: fallbackCoupon.currency,
          duration: fallbackCoupon.duration,
          durationInMonths: fallbackCoupon.duration_in_months,
          name: fallbackCoupon.name,
          valid: true,
        };
      }

      if (!promoCode) {
        logger.info('Promo code not found or inactive', { code: promoCodeLookup });
        return null;
      }

      if (missingCouponReference) {
        logger.warn('Promo code is missing a coupon reference', {
          code: promoCodeLookup,
          promoCodeId: promoCode.id,
        });
      }

      return null;
    } catch (error) {
      logger.error('Error validating promo code', {
        code: promoCodeLookup,
        error: error instanceof Error ? error.message : error,
      });
      return null;
    }
  },
};

export default subscriptionService;
