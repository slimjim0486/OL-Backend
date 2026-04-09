import Stripe from 'stripe';
import { SubscriptionInterval, SubscriptionStatus } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { config } from '../../config/index.js';
import {
  FOUNDING_MEMBER_PRODUCT,
  SUBSCRIPTION_PRODUCTS,
  getProductByTier,
  getPublicTierFromPriceId,
  validateStripeConfig,
} from '../../config/stripeProducts.js';
import {
  PublicSubscriptionInterval,
  PublicSubscriptionTier,
  hasActivePaidAccess,
  mapDbTierToPublicTier,
  mapPublicTierToDbTier,
  normalizePublicTier,
} from '../teacher/subscriptionTiers.js';
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';

const stripe = config.stripe.secretKey
  ? new Stripe(config.stripe.secretKey, { apiVersion: '2025-02-24.acacia' })
  : null;

const FREE_GENERATION_LIMIT = 5;
const FOUNDING_MEMBER_CAP = 500;

function toPrismaInterval(interval: PublicSubscriptionInterval): SubscriptionInterval {
  return interval === 'ANNUAL' ? 'ANNUAL' : 'MONTHLY';
}

function toPublicInterval(interval: SubscriptionInterval | null | undefined): PublicSubscriptionInterval | null {
  if (!interval) return null;
  return interval === 'ANNUAL' ? 'ANNUAL' : 'MONTHLY';
}

function mapStripeStatus(status: string): SubscriptionStatus {
  switch (status) {
    case 'active':
    case 'trialing':
    case 'incomplete':
    case 'incomplete_expired':
      return 'ACTIVE';
    case 'past_due':
    case 'unpaid':
      return 'PAST_DUE';
    case 'canceled':
      return 'CANCELLED';
    case 'ended':
      return 'EXPIRED';
    default:
      return 'ACTIVE';
  }
}

function isGenerationResetNeeded(resetAt: Date | null | undefined): boolean {
  if (!resetAt) return true;
  const now = new Date();
  return now.getUTCFullYear() !== resetAt.getUTCFullYear() ||
    now.getUTCMonth() !== resetAt.getUTCMonth();
}

async function ensureFoundingOfferAvailable(): Promise<void> {
  const offer = await prisma.foundingMemberOffer.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: 'asc' },
  });

  const cap = offer?.maxSlots ?? FOUNDING_MEMBER_CAP;
  const claimed = offer?.claimedSlots ?? await prisma.teacher.count({
    where: { isFoundingMember: true },
  });

  if (claimed >= cap) {
    throw new ConflictError('Founding member offer is sold out.');
  }
}

async function incrementFoundingClaimIfNeeded(teacherId: string): Promise<void> {
  const offer = await prisma.foundingMemberOffer.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: 'asc' },
  });

  if (!offer) {
    return;
  }

  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    select: { isFoundingMember: true },
  });

  if (!teacher?.isFoundingMember) {
    return;
  }

  await prisma.foundingMemberOffer.update({
    where: { id: offer.id },
    data: {
      claimedSlots: {
        increment: 1,
      },
    },
  });
}

async function resetGenerationCountIfNeeded(teacherId: string) {
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    select: {
      generationsUsedThisMonth: true,
      generationCountResetAt: true,
    },
  });

  if (!teacher) {
    throw new NotFoundError('Teacher not found');
  }

  if (!isGenerationResetNeeded(teacher.generationCountResetAt)) {
    return teacher;
  }

  return prisma.teacher.update({
    where: { id: teacherId },
    data: {
      generationsUsedThisMonth: 0,
      generationCountResetAt: new Date(),
    },
    select: {
      generationsUsedThisMonth: true,
      generationCountResetAt: true,
    },
  });
}

async function updateTeacherFromStripeSubscription(teacherId: string, subscription: Stripe.Subscription) {
  const priceId = subscription.items.data[0]?.price?.id || null;
  const publicTier = priceId ? getPublicTierFromPriceId(priceId) : null;
  const publicInterval: PublicSubscriptionInterval =
    subscription.items.data[0]?.price?.recurring?.interval === 'year' ? 'ANNUAL' : 'MONTHLY';

  if (!publicTier) {
    logger.warn('Could not map Stripe price to teacher tier', {
      teacherId,
      subscriptionId: subscription.id,
      priceId,
    });
    return null;
  }

  const currentPeriodStart = typeof (subscription as any).current_period_start === 'number'
    ? new Date((subscription as any).current_period_start * 1000)
    : null;
  const currentPeriodEnd = typeof (subscription as any).current_period_end === 'number'
    ? new Date((subscription as any).current_period_end * 1000)
    : null;

  await prisma.teacher.update({
    where: { id: teacherId },
    data: {
      subscriptionTier: mapPublicTierToDbTier(publicTier),
      subscriptionStatus: mapStripeStatus(subscription.status),
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      subscriptionInterval: toPrismaInterval(publicInterval),
      currentPeriodStart,
      currentPeriodEnd,
      subscriptionExpiresAt: currentPeriodEnd,
      isFoundingMember: priceId === FOUNDING_MEMBER_PRODUCT.priceId,
    },
  });

  if (priceId === FOUNDING_MEMBER_PRODUCT.priceId) {
    await incrementFoundingClaimIfNeeded(teacherId);
  }

  return {
    publicTier,
    publicInterval,
    currentPeriodStart,
    currentPeriodEnd,
  };
}

export interface CheckoutSessionResult {
  sessionId: string;
  url: string;
}

export interface CustomerPortalResult {
  url: string;
}

export const subscriptionService = {
  isConfigured(): boolean {
    return Boolean(stripe);
  },

  getAvailablePlans() {
    return {
      free: {
        tier: 'FREE' as const,
        name: SUBSCRIPTION_PRODUCTS.FREE.name,
        priceMonthly: 0,
        priceAnnual: 0,
        features: SUBSCRIPTION_PRODUCTS.FREE.features,
        generationLimit: FREE_GENERATION_LIMIT,
      },
      plus: {
        tier: 'PLUS' as const,
        name: SUBSCRIPTION_PRODUCTS.PLUS.name,
        priceMonthly: SUBSCRIPTION_PRODUCTS.PLUS.priceMonthly,
        priceAnnual: SUBSCRIPTION_PRODUCTS.PLUS.priceAnnual,
        features: SUBSCRIPTION_PRODUCTS.PLUS.features,
      },
      pro: {
        tier: 'PRO' as const,
        name: SUBSCRIPTION_PRODUCTS.PRO.name,
        priceMonthly: SUBSCRIPTION_PRODUCTS.PRO.priceMonthly,
        priceAnnual: SUBSCRIPTION_PRODUCTS.PRO.priceAnnual,
        features: SUBSCRIPTION_PRODUCTS.PRO.features,
      },
      foundingMember: FOUNDING_MEMBER_PRODUCT.priceId
        ? {
            tier: 'PLUS' as const,
            interval: 'ANNUAL' as const,
            priceAnnual: FOUNDING_MEMBER_PRODUCT.price,
          }
        : null,
    };
  },

  async validatePromoCode(_code: string) {
    return null;
  },

  async getOrCreateCustomer(teacherId: string): Promise<string> {
    if (!stripe) {
      throw new ValidationError('Stripe is not configured.');
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
      throw new NotFoundError('Teacher not found');
    }

    if (teacher.stripeCustomerId) {
      try {
        await stripe.customers.retrieve(teacher.stripeCustomerId);
        return teacher.stripeCustomerId;
      } catch {
        logger.warn('Stored Stripe customer was invalid, creating a new one', {
          teacherId,
          stripeCustomerId: teacher.stripeCustomerId,
        });
      }
    }

    const customer = await stripe.customers.create({
      email: teacher.email,
      name: [teacher.firstName, teacher.lastName].filter(Boolean).join(' ') || undefined,
      metadata: {
        teacherId: teacher.id,
        type: 'teacher',
      },
    });

    await prisma.teacher.update({
      where: { id: teacherId },
      data: {
        stripeCustomerId: customer.id,
      },
    });

    return customer.id;
  },

  async createCheckoutSession(
    teacherId: string,
    tierInput: PublicSubscriptionTier | string,
    isAnnual = false,
    successUrl: string,
    cancelUrl: string,
    promoCode?: string
  ): Promise<CheckoutSessionResult> {
    if (!stripe) {
      throw new ValidationError('Stripe is not configured.');
    }

    const tier = normalizePublicTier(tierInput);
    if (!tier || tier === 'FREE') {
      throw new ValidationError('Checkout is only available for Plus or Pro.');
    }

    const interval: PublicSubscriptionInterval = isAnnual ? 'ANNUAL' : 'MONTHLY';
    const wantsFoundingMember = promoCode?.trim().toLowerCase() === 'founding_member';

    let priceId = getProductByTier(tier)[interval === 'ANNUAL' ? 'priceIdAnnual' : 'priceIdMonthly'];
    if (wantsFoundingMember && tier === 'PLUS' && interval === 'ANNUAL') {
      await ensureFoundingOfferAvailable();
      if (!FOUNDING_MEMBER_PRODUCT.priceId) {
        throw new ValidationError('Founding member annual price is not configured.');
      }
      priceId = FOUNDING_MEMBER_PRODUCT.priceId;
    }

    if (!priceId) {
      throw new ValidationError(`Stripe price is not configured for ${tier} ${interval.toLowerCase()}.`);
    }

    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: {
        stripeSubscriptionId: true,
      },
    });

    if (teacher?.stripeSubscriptionId) {
      throw new ConflictError('You already have an active subscription. Use Manage Billing instead.');
    }

    const customerId = await this.getOrCreateCustomer(teacherId);

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        teacherId,
        publicTier: tier,
        interval,
        foundingMember: wantsFoundingMember ? 'true' : 'false',
        type: 'teacher',
      },
      subscription_data: {
        metadata: {
          teacherId,
          publicTier: tier,
          interval,
          foundingMember: wantsFoundingMember ? 'true' : 'false',
          type: 'teacher',
        },
      },
    });

    return {
      sessionId: session.id,
      url: session.url || '',
    };
  },

  async createCreditPackCheckoutSession(): Promise<CheckoutSessionResult> {
    throw new ValidationError('Credit packs are no longer available.');
  },

  async createDownloadCheckoutSession(): Promise<CheckoutSessionResult> {
    throw new ValidationError('One-time download purchases are no longer available.');
  },

  async createCustomerPortalSession(teacherId: string, returnUrl: string): Promise<CustomerPortalResult> {
    if (!stripe) {
      throw new ValidationError('Stripe is not configured.');
    }

    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: { stripeCustomerId: true },
    });

    if (!teacher?.stripeCustomerId) {
      throw new ValidationError('No Stripe customer was found for this teacher.');
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: teacher.stripeCustomerId,
      return_url: returnUrl,
    });

    return { url: session.url };
  },

  async syncSubscriptionFromStripe(teacherId: string, subscription: Stripe.Subscription) {
    return updateTeacherFromStripeSubscription(teacherId, subscription);
  },

  async canGenerate(teacherId: string) {
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: {
        subscriptionTier: true,
        subscriptionStatus: true,
        currentPeriodEnd: true,
        generationsUsedThisMonth: true,
        generationCountResetAt: true,
      },
    });

    if (!teacher) {
      throw new NotFoundError('Teacher not found');
    }

    const publicTier = mapDbTierToPublicTier(teacher.subscriptionTier);
    if (hasActivePaidAccess({
      publicTier,
      subscriptionStatus: teacher.subscriptionStatus,
      currentPeriodEnd: teacher.currentPeriodEnd,
    })) {
      return { allowed: true, used: 0, limit: Infinity };
    }

    const generationCounter = await resetGenerationCountIfNeeded(teacherId);
    return {
      allowed: generationCounter.generationsUsedThisMonth < FREE_GENERATION_LIMIT,
      used: generationCounter.generationsUsedThisMonth,
      limit: FREE_GENERATION_LIMIT,
    };
  },

  async incrementGenerationCount(teacherId: string) {
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: {
        subscriptionTier: true,
        subscriptionStatus: true,
        currentPeriodEnd: true,
      },
    });

    if (!teacher) {
      throw new NotFoundError('Teacher not found');
    }

    const publicTier = mapDbTierToPublicTier(teacher.subscriptionTier);
    if (hasActivePaidAccess({
      publicTier,
      subscriptionStatus: teacher.subscriptionStatus,
      currentPeriodEnd: teacher.currentPeriodEnd,
    })) {
      return;
    }

    await resetGenerationCountIfNeeded(teacherId);
    await prisma.teacher.update({
      where: { id: teacherId },
      data: {
        generationsUsedThisMonth: { increment: 1 },
      },
    });
  },

  async getSubscriptionInfo(teacherId: string) {
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: {
        id: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        stripePriceId: true,
        subscriptionInterval: true,
        currentPeriodStart: true,
        currentPeriodEnd: true,
        generationsUsedThisMonth: true,
        generationCountResetAt: true,
        grandfatheredUntil: true,
        isFoundingMember: true,
      },
    });

    if (!teacher) {
      throw new NotFoundError('Teacher not found');
    }

    if (stripe && teacher.stripeSubscriptionId) {
      try {
        const stripeSubscription = await stripe.subscriptions.retrieve(teacher.stripeSubscriptionId);
        await updateTeacherFromStripeSubscription(teacherId, stripeSubscription);
      } catch (error) {
        logger.warn('Failed to sync teacher subscription from Stripe', {
          teacherId,
          stripeSubscriptionId: teacher.stripeSubscriptionId,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    const refreshedTeacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: {
        subscriptionTier: true,
        subscriptionStatus: true,
        stripeSubscriptionId: true,
        stripePriceId: true,
        subscriptionInterval: true,
        currentPeriodStart: true,
        currentPeriodEnd: true,
        generationsUsedThisMonth: true,
        generationCountResetAt: true,
        grandfatheredUntil: true,
        isFoundingMember: true,
      },
    });

    if (!refreshedTeacher) {
      throw new NotFoundError('Teacher not found');
    }

    const publicTier = mapDbTierToPublicTier(refreshedTeacher.subscriptionTier);
    const generation = await this.canGenerate(teacherId);

    return {
      id: refreshedTeacher.stripeSubscriptionId,
      tier: publicTier,
      status: refreshedTeacher.subscriptionStatus,
      interval: toPublicInterval(refreshedTeacher.subscriptionInterval),
      currentPeriodStart: refreshedTeacher.currentPeriodStart,
      currentPeriodEnd: refreshedTeacher.currentPeriodEnd,
      generationsUsed: publicTier === 'FREE' ? generation.used : 0,
      generationsLimit: publicTier === 'FREE' ? generation.limit : null,
      grandfatheredUntil: refreshedTeacher.grandfatheredUntil,
      isFoundingMember: refreshedTeacher.isFoundingMember,
      stripePriceId: refreshedTeacher.stripePriceId,
    };
  },

  async cancelSubscription(teacherId: string) {
    if (!stripe) {
      throw new ValidationError('Stripe is not configured.');
    }

    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: { stripeSubscriptionId: true },
    });

    if (!teacher?.stripeSubscriptionId) {
      throw new ValidationError('No active subscription was found.');
    }

    await stripe.subscriptions.update(teacher.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });
  },

  async resumeSubscription(teacherId: string) {
    if (!stripe) {
      throw new ValidationError('Stripe is not configured.');
    }

    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: { stripeSubscriptionId: true },
    });

    if (!teacher?.stripeSubscriptionId) {
      throw new ValidationError('No active subscription was found.');
    }

    await stripe.subscriptions.update(teacher.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });
  },

  async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const teacherId = session.metadata?.teacherId;
    const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;

    if (!teacherId || !subscriptionId || !stripe) {
      return;
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    await updateTeacherFromStripeSubscription(teacherId, subscription);
  },

  async handleSubscriptionCreated(subscription: Stripe.Subscription) {
    const teacherIdFromMetadata = subscription.metadata.teacherId;
    let teacherId: string | undefined = teacherIdFromMetadata;

    if (!teacherId) {
      const customerId = typeof subscription.customer === 'string'
        ? subscription.customer
        : subscription.customer?.id;
      if (!customerId) {
        return;
      }

      const teacher = await prisma.teacher.findFirst({
        where: { stripeCustomerId: customerId },
        select: { id: true },
      });
      teacherId = teacher?.id;
    }

    if (!teacherId) {
      return;
    }

    await updateTeacherFromStripeSubscription(teacherId, subscription);
  },

  async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const customerId = typeof subscription.customer === 'string'
      ? subscription.customer
      : subscription.customer?.id;

    const teacher = await prisma.teacher.findFirst({
      where: customerId
        ? {
            OR: [
              { stripeSubscriptionId: subscription.id },
              { stripeCustomerId: customerId },
            ],
          }
        : { stripeSubscriptionId: subscription.id },
      select: { id: true },
    });

    if (!teacher) {
      return;
    }

    await prisma.teacher.update({
      where: { id: teacher.id },
      data: {
        subscriptionTier: 'FREE',
        subscriptionStatus: 'CANCELLED',
        stripeSubscriptionId: null,
        stripePriceId: null,
        subscriptionInterval: null,
        currentPeriodStart: null,
        currentPeriodEnd: null,
        subscriptionExpiresAt: null,
        isFoundingMember: false,
      },
    });
  },

  async handlePaymentFailed(invoice: Stripe.Invoice) {
    const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;
    if (!customerId) {
      return;
    }

    const teacher = await prisma.teacher.findFirst({
      where: { stripeCustomerId: customerId },
      select: { id: true },
    });

    if (!teacher) {
      return;
    }

    await prisma.teacher.update({
      where: { id: teacher.id },
      data: {
        subscriptionStatus: 'PAST_DUE',
      },
    });
  },

  validateConfig() {
    return validateStripeConfig();
  },
};

export default subscriptionService;
