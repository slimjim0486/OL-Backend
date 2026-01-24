/**
 * Teacher Subscription Service
 *
 * Handles Stripe subscription operations for teacher subscriptions:
 * - Creating checkout sessions for new subscriptions
 * - Managing subscription lifecycle (upgrades, downgrades, cancellations)
 * - Processing credit pack purchases
 * - Customer portal access
 */

import Stripe from 'stripe';
import { prisma } from '../../config/database.js';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
import { TeacherSubscriptionTier, SubscriptionStatus } from '@prisma/client';
import { ConflictError } from '../../middleware/errorHandler.js';
import {
  getProductByTier,
  isAnnualSubscription,
  getTierFromPriceId,
  SUBSCRIPTION_PRODUCTS,
  CREDIT_PACKS,
} from '../../config/stripeProducts.js';
import { creditsToTokens } from '../teacher/quotaService.js';
import { referralService } from '../sharing/index.js';

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

  // Fallback: check price amount to determine tier
  const price = subscription.items.data[0]?.price;
  if (price) {
    const amount = price.unit_amount || 0;
    const interval = price.recurring?.interval;

    // Monthly pricing: BASIC = $9.99 (999 cents), PROFESSIONAL = $24.99 (2499 cents)
    // Annual pricing: BASIC = $95.90 (9590 cents), PROFESSIONAL = $239.90 (23990 cents)
    if (interval === 'month') {
      if (amount >= 2000) return 'PROFESSIONAL';
      if (amount >= 500) return 'BASIC';
    } else if (interval === 'year') {
      if (amount >= 20000) return 'PROFESSIONAL';
      if (amount >= 5000) return 'BASIC';
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
      try {
        // Look up the promotion code by its customer-facing code
        const promoCodes = await stripe.promotionCodes.list({
          code: promoCode,
          active: true,
          limit: 1,
        });

        if (promoCodes.data.length > 0) {
          sessionParams.discounts = [{ promotion_code: promoCodes.data[0].id }];
          logger.info('Applying promo code to teacher checkout', {
            teacherId,
            promoCode,
            promotionCodeId: promoCodes.data[0].id,
          });
        } else {
          logger.warn('Promo code not found or inactive', { teacherId, promoCode });
          // Don't fail checkout - just skip the discount
        }
      } catch (error) {
        logger.error('Error looking up promo code', {
          teacherId,
          promoCode,
          error: error instanceof Error ? error.message : error,
        });
        // Don't fail checkout - just skip the discount
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

    // Add trial period if configured
    if (product.trialDays > 0) {
      sessionParams.subscription_data!.trial_period_days = product.trialDays;
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
   * Create a checkout session for a credit pack purchase
   */
  async createCreditPackCheckoutSession(
    teacherId: string,
    packId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<CheckoutSessionResult> {
    if (!stripe) {
      throw new Error('Stripe is not configured');
    }

    const pack = CREDIT_PACKS.find(p => p.id === packId);
    if (!pack) {
      throw new Error(`Credit pack not found: ${packId}`);
    }

    if (!pack.priceId) {
      throw new Error(`Price ID not configured for credit pack: ${packId}`);
    }

    const customerId = await this.getOrCreateCustomer(teacherId);

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      line_items: [
        {
          price: pack.priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        teacherId,
        type: 'credit_pack',
        packId,
        credits: pack.credits.toString(),
      },
    });

    logger.info('Created credit pack checkout session', {
      teacherId,
      packId,
      credits: pack.credits,
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

    const product = getProductByTier(effectiveTier);
    if (!product) {
      logger.error('Could not find product for tier during sync', {
        teacherId,
        subscriptionId: subscription.id,
        tier,
      });
      return;
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

    // Calculate token quota
    const tokenQuota = creditsToTokens(product.credits);

    logger.info('Syncing subscription from Stripe to database', {
      teacherId,
      subscriptionId: subscription.id,
      tier,
      status: subscription.status,
      subscriptionStatus,
      tokenQuota,
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
        monthlyTokenQuota: BigInt(tokenQuota),
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

    const product = getProductByTier(effectiveTier);

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
        tokenQuota: creditsToTokens(product.credits),
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
          monthlyTokenQuota: BigInt(creditsToTokens(product.credits)),
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

    // Revert to FREE tier
    const freeProduct = getProductByTier('FREE');

    await prisma.teacher.update({
      where: { id: teacherId },
      data: {
        subscriptionTier: 'FREE',
        subscriptionStatus: 'ACTIVE',
        stripeSubscriptionId: null,
        subscriptionExpiresAt: null,
        monthlyTokenQuota: BigInt(creditsToTokens(freeProduct.credits)),
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

    // Check if this is a credit pack purchase
    if (session.metadata?.type === 'credit_pack') {
      const credits = parseInt(session.metadata.credits || '0', 10);
      const packId = session.metadata.packId;

      if (!packId || credits <= 0) {
        logger.warn('Credit pack checkout missing pack details', {
          teacherId,
          sessionId: session.id,
          packId,
          credits,
        });
        return;
      }

      try {
        await prisma.$transaction([
          prisma.teacherCreditPackPurchase.create({
            data: {
              teacherId,
              stripeSessionId: session.id,
              packId,
              credits,
            },
          }),
          prisma.teacher.update({
            where: { id: teacherId },
            data: {
              bonusCredits: { increment: credits },
            },
          }),
        ]);

        logger.info('Credit pack purchased', {
          teacherId,
          packId,
          credits,
          sessionId: session.id,
        });
      } catch (error: any) {
        if (error?.code === 'P2002') {
          logger.warn('Credit pack purchase already processed', {
            teacherId,
            packId,
            credits,
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
    return Object.values(SUBSCRIPTION_PRODUCTS).map(product => ({
      tier: product.tier,
      name: product.name,
      credits: product.credits,
      priceMonthly: product.priceMonthly,
      priceAnnual: product.priceAnnual,
      features: product.features,
      trialDays: product.trialDays,
    }));
  },

  /**
   * Get available credit packs for display
   */
  getAvailableCreditPacks() {
    return CREDIT_PACKS.map(pack => ({
      id: pack.id,
      name: pack.name,
      credits: pack.credits,
      price: pack.price,
      pricePerCredit: pack.pricePerCredit,
      savings: pack.savings,
    }));
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

    try {
      // Look up the promotion code by its customer-facing code
      const promoCodes = await stripe.promotionCodes.list({
        code: code.toUpperCase(),
        active: true,
        limit: 1,
        expand: ['data.coupon'],
      });

      if (promoCodes.data.length === 0) {
        logger.info('Promo code not found or inactive', { code });
        return null;
      }

      const promoCode = promoCodes.data[0];
      const coupon = promoCode.coupon;

      // Check if coupon is still valid
      if (!coupon.valid) {
        logger.info('Promo code coupon is no longer valid', { code, couponId: coupon.id });
        return null;
      }

      // Check redemption limits
      if (promoCode.max_redemptions && promoCode.times_redeemed >= promoCode.max_redemptions) {
        logger.info('Promo code has reached max redemptions', {
          code,
          maxRedemptions: promoCode.max_redemptions,
          timesRedeemed: promoCode.times_redeemed,
        });
        return null;
      }

      // Check expiration
      if (promoCode.expires_at && promoCode.expires_at * 1000 < Date.now()) {
        logger.info('Promo code has expired', { code, expiresAt: promoCode.expires_at });
        return null;
      }

      logger.info('Promo code validated successfully', {
        code,
        couponId: coupon.id,
        percentOff: coupon.percent_off,
        amountOff: coupon.amount_off,
        duration: coupon.duration,
        durationInMonths: coupon.duration_in_months,
      });

      return {
        code: code.toUpperCase(),
        percentOff: coupon.percent_off,
        amountOff: coupon.amount_off,
        currency: coupon.currency,
        duration: coupon.duration,
        durationInMonths: coupon.duration_in_months,
        name: coupon.name,
        valid: true,
      };
    } catch (error) {
      logger.error('Error validating promo code', {
        code,
        error: error instanceof Error ? error.message : error,
      });
      return null;
    }
  },
};

export default subscriptionService;
