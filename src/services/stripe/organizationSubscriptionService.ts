import Stripe from 'stripe';
import { OrgBillingInterval, OrgSubscriptionTier, SubscriptionStatus } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { config } from '../../config/index.js';
import {
  getAvailableOrganizationPlans,
  getOrganizationProductByTier,
  getOrganizationProductByPriceId,
  getOrganizationTierFromPriceId,
  isOrganizationAnnualSubscription,
} from '../../config/stripeProductsOrganization.js';
import { ConflictError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';

const stripe = config.stripe.secretKey
  ? new Stripe(config.stripe.secretKey, {
      apiVersion: '2025-02-24.acacia',
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

type OrgSubscriptionMatch = {
  organizationId: string;
  tier: OrgSubscriptionTier;
};

function isActiveSubscription(subscription: Stripe.Subscription): boolean {
  return ACTIVE_SUBSCRIPTION_STATUSES.includes(subscription.status);
}

function mapStripeStatus(status: Stripe.Subscription['status']): SubscriptionStatus {
  if (status === 'active' || status === 'trialing') return 'ACTIVE';
  if (status === 'canceled') return 'CANCELLED';
  if (status === 'incomplete_expired') return 'EXPIRED';
  return 'PAST_DUE';
}

function getBillingInterval(subscription: Stripe.Subscription): OrgBillingInterval {
  const interval = subscription.items.data[0]?.price?.recurring?.interval;
  return interval === 'year' ? 'ANNUAL' : 'MONTHLY';
}

function getCurrentPeriodEndUnix(subscription: Stripe.Subscription): number | null {
  const direct = (subscription as any).current_period_end;
  if (typeof direct === 'number' && !isNaN(direct)) return direct;
  const itemEnd = (subscription.items?.data?.[0] as any)?.current_period_end;
  if (typeof itemEnd === 'number' && !isNaN(itemEnd)) return itemEnd;
  return null;
}

async function findActiveOrganizationSubscription(
  customerId: string
): Promise<Stripe.Subscription | null> {
  if (!stripe) return null;

  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'all',
    limit: 10,
  });

  return subscriptions.data.find(isActiveSubscription) || null;
}

async function resolveOrganizationFromSubscription(
  subscription: Stripe.Subscription
): Promise<OrgSubscriptionMatch | null> {
  const priceId = subscription.items.data[0]?.price?.id;
  const tierFromPrice = priceId ? getOrganizationTierFromPriceId(priceId) : null;
  const tierFromMetadata = (subscription.metadata?.tier as OrgSubscriptionTier | undefined) || null;
  const tier = tierFromPrice || tierFromMetadata;

  if (!tier) {
    return null;
  }

  const metadataOrgId = subscription.metadata?.organizationId;
  if (metadataOrgId) {
    return { organizationId: metadataOrgId, tier };
  }

  const customerId = typeof subscription.customer === 'string'
    ? subscription.customer
    : subscription.customer?.id;

  if (!customerId) return null;

  const organization = await prisma.organization.findFirst({
    where: { stripeCustomerId: customerId },
    select: { id: true },
  });

  if (!organization) return null;

  return { organizationId: organization.id, tier };
}

export interface OrganizationCheckoutSessionResult {
  sessionId: string;
  url: string;
}

export interface OrganizationPortalResult {
  url: string;
}

export interface OrganizationSubscriptionInfo {
  id: string;
  status: string;
  tier: OrgSubscriptionTier;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  isAnnual: boolean;
  seatLimit: number;
  monthlyTokenQuota: bigint;
}

export const organizationSubscriptionService = {
  isConfigured(): boolean {
    return !!stripe;
  },

  async getOrCreateCustomer(organizationId: string): Promise<string> {
    if (!stripe) {
      throw new Error('Stripe is not configured');
    }

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: {
        id: true,
        name: true,
        stripeCustomerId: true,
      },
    });

    if (!organization) {
      throw new NotFoundError('Organization not found.');
    }

    if (organization.stripeCustomerId) {
      try {
        await stripe.customers.retrieve(organization.stripeCustomerId);
        return organization.stripeCustomerId;
      } catch (error: any) {
        logger.warn('Stored organization Stripe customer is invalid. Creating a new customer.', {
          organizationId,
          oldCustomerId: organization.stripeCustomerId,
          error: error?.message || error,
        });
      }
    }

    const customer = await stripe.customers.create({
      name: organization.name,
      metadata: {
        organizationId: organization.id,
        type: 'organization',
      },
    });

    await prisma.organization.update({
      where: { id: organizationId },
      data: {
        stripeCustomerId: customer.id,
        stripeSubscriptionId: null,
        subscriptionExpiresAt: null,
      },
    });

    return customer.id;
  },

  async createCheckoutSession(
    organizationId: string,
    tier: OrgSubscriptionTier,
    isAnnual: boolean,
    successUrl: string,
    cancelUrl: string
  ): Promise<OrganizationCheckoutSessionResult> {
    if (!stripe) {
      throw new Error('Stripe is not configured');
    }

    const product = getOrganizationProductByTier(tier);
    const priceId = isAnnual ? product.priceIdAnnual : product.priceIdMonthly;

    if (!priceId) {
      throw new Error(`Price ID not configured for organization ${tier} ${isAnnual ? 'annual' : 'monthly'} plan.`);
    }

    const customerId = await this.getOrCreateCustomer(organizationId);

    const activeSubscription = await findActiveOrganizationSubscription(customerId);
    if (activeSubscription) {
      await this.syncSubscriptionFromStripe(organizationId, activeSubscription);
      throw new ConflictError(
        'This organization already has an active subscription. Use billing portal to manage plan changes.'
      );
    }

    const session = await stripe.checkout.sessions.create({
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
        organizationId,
        tier,
        isAnnual: String(isAnnual),
        type: 'organization',
      },
      subscription_data: {
        metadata: {
          organizationId,
          tier,
          type: 'organization',
        },
      },
    });

    logger.info('Created organization subscription checkout session', {
      organizationId,
      tier,
      isAnnual,
      sessionId: session.id,
    });

    return {
      sessionId: session.id,
      url: session.url!,
    };
  },

  async createCustomerPortalSession(
    organizationId: string,
    returnUrl: string
  ): Promise<OrganizationPortalResult> {
    if (!stripe) {
      throw new Error('Stripe is not configured');
    }

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { stripeCustomerId: true },
    });

    const customerId = organization?.stripeCustomerId || await this.getOrCreateCustomer(organizationId);

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return { url: session.url };
  },

  async syncSubscriptionFromStripe(
    organizationId: string,
    subscription: Stripe.Subscription
  ): Promise<void> {
    const match = await resolveOrganizationFromSubscription(subscription);
    const tier = match?.tier;

    if (!tier) {
      logger.warn('Unable to map organization tier from subscription', {
        organizationId,
        subscriptionId: subscription.id,
        priceId: subscription.items.data[0]?.price?.id,
      });
      return;
    }

    const product = getOrganizationProductByTier(tier);
    const currentPeriodEndUnix = getCurrentPeriodEndUnix(subscription);
    const interval = getBillingInterval(subscription);
    const fallbackDays = interval === 'ANNUAL' ? 365 : 30;

    const subscriptionExpiresAt = currentPeriodEndUnix
      ? new Date(currentPeriodEndUnix * 1000)
      : new Date(Date.now() + fallbackDays * 24 * 60 * 60 * 1000);

    const customerId = typeof subscription.customer === 'string'
      ? subscription.customer
      : subscription.customer?.id;

    await prisma.organization.update({
      where: { id: organizationId },
      data: {
        stripeCustomerId: customerId || undefined,
        stripeSubscriptionId: subscription.id,
        subscriptionTier: tier,
        subscriptionStatus: mapStripeStatus(subscription.status),
        subscriptionExpiresAt,
        billingInterval: interval,
        seatLimit: product.seatLimit,
        monthlyTokenQuota: product.monthlyTokenQuota,
      },
    });

    logger.info('Synced organization subscription from Stripe', {
      organizationId,
      subscriptionId: subscription.id,
      tier,
      status: subscription.status,
      billingInterval: interval,
      seatLimit: product.seatLimit,
    });
  },

  async getSubscriptionInfo(organizationId: string): Promise<OrganizationSubscriptionInfo | null> {
    if (!stripe) {
      return null;
    }

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: {
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        subscriptionTier: true,
        seatLimit: true,
        monthlyTokenQuota: true,
      },
    });

    if (!organization) {
      throw new NotFoundError('Organization not found.');
    }

    if (organization.stripeSubscriptionId) {
      try {
        const subscription = await stripe.subscriptions.retrieve(organization.stripeSubscriptionId);
        const priceId = subscription.items.data[0]?.price?.id || '';
        const tier = getOrganizationTierFromPriceId(priceId) || organization.subscriptionTier;
        const product = getOrganizationProductByTier(tier);

        const currentPeriodEndUnix = getCurrentPeriodEndUnix(subscription);
        const currentPeriodEnd = currentPeriodEndUnix
          ? new Date(currentPeriodEndUnix * 1000)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        return {
          id: subscription.id,
          status: subscription.status,
          tier,
          currentPeriodEnd,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          isAnnual: isOrganizationAnnualSubscription(priceId),
          seatLimit: product.seatLimit,
          monthlyTokenQuota: product.monthlyTokenQuota,
        };
      } catch (error) {
        logger.error('Failed to retrieve organization subscription', {
          organizationId,
          subscriptionId: organization.stripeSubscriptionId,
          error: error instanceof Error ? error.message : error,
        });
      }
    }

    if (organization.stripeCustomerId) {
      const activeSubscription = await findActiveOrganizationSubscription(organization.stripeCustomerId);
      if (activeSubscription) {
        await this.syncSubscriptionFromStripe(organizationId, activeSubscription);

        const priceId = activeSubscription.items.data[0]?.price?.id || '';
        const tier = getOrganizationTierFromPriceId(priceId) || organization.subscriptionTier;
        const product = getOrganizationProductByTier(tier);
        const currentPeriodEndUnix = getCurrentPeriodEndUnix(activeSubscription);

        return {
          id: activeSubscription.id,
          status: activeSubscription.status,
          tier,
          currentPeriodEnd: currentPeriodEndUnix
            ? new Date(currentPeriodEndUnix * 1000)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          cancelAtPeriodEnd: activeSubscription.cancel_at_period_end,
          isAnnual: isOrganizationAnnualSubscription(priceId),
          seatLimit: product.seatLimit,
          monthlyTokenQuota: product.monthlyTokenQuota,
        };
      }
    }

    return null;
  },

  async cancelSubscription(organizationId: string): Promise<void> {
    if (!stripe) {
      throw new Error('Stripe is not configured');
    }

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { stripeSubscriptionId: true },
    });

    if (!organization?.stripeSubscriptionId) {
      throw new NotFoundError('No active organization subscription found.');
    }

    await stripe.subscriptions.update(organization.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    logger.info('Organization subscription set to cancel at period end', {
      organizationId,
      subscriptionId: organization.stripeSubscriptionId,
    });
  },

  async resumeSubscription(organizationId: string): Promise<void> {
    if (!stripe) {
      throw new Error('Stripe is not configured');
    }

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { stripeSubscriptionId: true },
    });

    if (!organization?.stripeSubscriptionId) {
      throw new NotFoundError('No organization subscription found.');
    }

    await stripe.subscriptions.update(organization.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });

    logger.info('Organization subscription resumed', {
      organizationId,
      subscriptionId: organization.stripeSubscriptionId,
    });
  },

  async handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<boolean> {
    if (session.metadata?.type !== 'organization') {
      return false;
    }

    logger.info('Organization checkout session completed', {
      sessionId: session.id,
      organizationId: session.metadata?.organizationId,
      mode: session.mode,
    });

    return true;
  },

  async handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<boolean> {
    const match = await resolveOrganizationFromSubscription(subscription);
    if (!match) return false;

    await this.syncSubscriptionFromStripe(match.organizationId, subscription);
    return true;
  },

  async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<boolean> {
    const match = await resolveOrganizationFromSubscription(subscription);
    if (!match) return false;

    const starter = getOrganizationProductByTier('STARTER');

    await prisma.organization.update({
      where: { id: match.organizationId },
      data: {
        subscriptionTier: 'STARTER',
        subscriptionStatus: 'CANCELLED',
        stripeSubscriptionId: null,
        subscriptionExpiresAt: null,
        billingInterval: 'MONTHLY',
        seatLimit: starter.seatLimit,
        monthlyTokenQuota: starter.monthlyTokenQuota,
      },
    });

    logger.info('Organization subscription deleted', {
      organizationId: match.organizationId,
      subscriptionId: subscription.id,
    });

    return true;
  },

  async handlePaymentFailed(invoice: Stripe.Invoice): Promise<boolean> {
    const invoiceAny = invoice as any;
    const subscriptionId = typeof invoiceAny.subscription === 'string'
      ? invoiceAny.subscription
      : invoiceAny.subscription?.id;

    if (!subscriptionId) {
      return false;
    }

    const organization = await prisma.organization.findFirst({
      where: { stripeSubscriptionId: subscriptionId },
      select: { id: true },
    });

    if (!organization) {
      return false;
    }

    await prisma.organization.update({
      where: { id: organization.id },
      data: { subscriptionStatus: 'PAST_DUE' },
    });

    logger.warn('Organization subscription payment failed', {
      organizationId: organization.id,
      subscriptionId,
      invoiceId: invoice.id,
    });

    return true;
  },

  async handleInvoicePaid(invoice: Stripe.Invoice): Promise<boolean> {
    const invoiceAny = invoice as any;
    const subscriptionId = typeof invoiceAny.subscription === 'string'
      ? invoiceAny.subscription
      : invoiceAny.subscription?.id;

    if (!subscriptionId) {
      return false;
    }

    const organization = await prisma.organization.findFirst({
      where: { stripeSubscriptionId: subscriptionId },
      select: { id: true },
    });

    if (!organization) {
      return false;
    }

    if (stripe) {
      try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        await this.syncSubscriptionFromStripe(organization.id, subscription);
        return true;
      } catch (error) {
        logger.error('Failed to resync organization subscription on invoice.paid', {
          organizationId: organization.id,
          subscriptionId,
          invoiceId: invoice.id,
          error: error instanceof Error ? error.message : error,
        });
      }
    }

    await prisma.organization.update({
      where: { id: organization.id },
      data: {
        subscriptionStatus: 'ACTIVE',
      },
    });

    return true;
  },

  getAvailablePlans() {
    return getAvailableOrganizationPlans().map((product) => ({
      tier: product.tier,
      name: product.name,
      priceMonthly: product.priceMonthly,
      priceAnnual: product.priceAnnual,
      seatLimit: product.seatLimit,
      monthlyTokenQuota: product.monthlyTokenQuota.toString(),
      features: product.features,
    }));
  },
};

export default organizationSubscriptionService;
