/**
 * Package Purchase Service — Handles Stripe checkout, purchase lifecycle, and queries
 */

import Stripe from 'stripe';
import {
  PackageTier,
  PackagePurchaseStatus,
  DeliveryType,
  Prisma,
} from '@prisma/client';
import { prisma } from '../../config/database.js';
import { config } from '../../config/index.js';
import { getDTCProduct, getDTCProductByPriceId } from '../../config/stripeProductsDTC.js';
import { stripeService } from '../stripe/index.js';
import { emailService } from '../email/emailService.js';
import { logger } from '../../utils/logger.js';

// =============================================================================
// TYPES
// =============================================================================

export interface CheckoutConfig {
  gradeLevel?: string;
  subjects?: string[];
  topic?: string;
  curriculum?: string;
  schoolYear?: string;
  weekStartDate?: string;
  [key: string]: unknown;
}

interface CreateCheckoutParams {
  teacherId: string;
  tier: PackageTier;
  config: CheckoutConfig;
  successUrl: string;
  cancelUrl: string;
}

interface PaginationParams {
  page?: number;
  limit?: number;
}

// =============================================================================
// CHECKOUT
// =============================================================================

async function createCheckout(params: CreateCheckoutParams): Promise<{ checkoutUrl: string }> {
  const { teacherId, tier, config: purchaseConfig, successUrl, cancelUrl } = params;
  const product = getDTCProduct(tier);

  if (!product.stripePriceId) {
    throw new Error(`Stripe price not configured for tier: ${tier}`);
  }

  const stripe = stripeService.getStripe();
  if (!stripe) throw new Error('Stripe is not configured');

  // Ensure teacher has a Stripe customer ID
  const teacher = await prisma.teacher.findUniqueOrThrow({
    where: { id: teacherId },
    select: { id: true, email: true, stripeCustomerId: true, firstName: true, lastName: true },
  });

  let customerId = teacher.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: teacher.email,
      name: [teacher.firstName, teacher.lastName].filter(Boolean).join(' ') || undefined,
      metadata: { teacherId: teacher.id, source: 'dtc_store' },
    });
    customerId = customer.id;
    await prisma.teacher.update({
      where: { id: teacherId },
      data: { stripeCustomerId: customerId },
    });
  }

  const mode: Stripe.Checkout.SessionCreateParams['mode'] = product.isRecurring ? 'subscription' : 'payment';

  const session = await stripe.checkout.sessions.create({
    mode,
    customer: customerId,
    line_items: [{ price: product.stripePriceId, quantity: 1 }],
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
    metadata: {
      teacherId,
      packageTier: tier,
      packageCategory: product.category,
      deliveryType: product.deliveryType,
      source: 'dtc_store',
      config: JSON.stringify(purchaseConfig),
    },
    ...(mode === 'subscription' ? {
      subscription_data: {
        metadata: {
          teacherId,
          packageTier: tier,
          source: 'dtc_store',
        },
      },
    } : {
      payment_intent_data: {
        metadata: {
          teacherId,
          packageTier: tier,
          source: 'dtc_store',
        },
      },
    }),
  });

  if (!session.url) throw new Error('Failed to create Stripe checkout session');
  return { checkoutUrl: session.url };
}

// =============================================================================
// WEBHOOK HANDLERS
// =============================================================================

async function handlePaymentCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const metadata = session.metadata || {};
  if (metadata.source !== 'dtc_store') return; // Not a DTC purchase

  const teacherId = metadata.teacherId;
  const tier = metadata.packageTier as PackageTier;
  const purchaseConfig = metadata.config ? JSON.parse(metadata.config) : {};

  if (!teacherId || !tier) {
    logger.error('DTC checkout missing metadata', { sessionId: session.id, metadata });
    return;
  }

  // Check for duplicate
  const existing = await prisma.packagePurchase.findUnique({
    where: { stripeSessionId: session.id },
  });
  if (existing) {
    logger.info('DTC purchase already processed', { sessionId: session.id });
    return;
  }

  const product = getDTCProduct(tier);

  const purchase = await prisma.packagePurchase.create({
    data: {
      teacherId,
      packageTier: tier,
      packageCategory: product.category,
      packageName: product.name,
      priceCents: product.priceCents,
      stripeSessionId: session.id,
      stripePaymentIntentId: typeof session.payment_intent === 'string'
        ? session.payment_intent
        : (session.payment_intent as any)?.id || null,
      stripeSubscriptionId: typeof session.subscription === 'string'
        ? session.subscription
        : (session.subscription as any)?.id || null,
      config: purchaseConfig as Prisma.JsonObject,
      deliveryType: product.deliveryType as DeliveryType,
      totalWeeks: product.totalWeeks,
      status: 'PAID',
      purchasedAt: new Date(),
      isPriorityQueue: tier === 'FOUNDING_TEACHER',
      sharingLicense: tier === 'FOUNDING_TEACHER' ? 2 : 0,
      lifetimeUpdates: tier === 'FOUNDING_TEACHER',
    },
  });

  logger.info('DTC package purchase created', {
    purchaseId: purchase.id,
    teacherId,
    tier,
    deliveryType: product.deliveryType,
  });

  // Queue generation job — imported dynamically to avoid circular deps
  const { addPackageGenerationJob } = await import('../../jobs/packageGenerationJob.js');
  await addPackageGenerationJob({
    purchaseId: purchase.id,
    teacherId,
    tier,
  });

  // Note: "plan ready" email is sent from packageGenerationService after planning completes.
  // Planning is fast (seconds), so the email arrives almost immediately.
}

async function handleRecurringPayment(invoice: Stripe.Invoice): Promise<void> {
  const invoiceAny = invoice as any;
  const subscriptionId = typeof invoiceAny.subscription === 'string'
    ? invoiceAny.subscription
    : invoiceAny.subscription?.id;

  if (!subscriptionId) return;

  // Only process renewals, not initial payments
  if (invoice.billing_reason !== 'subscription_cycle') return;

  const purchase = await prisma.packagePurchase.findFirst({
    where: { stripeSubscriptionId: subscriptionId, packageTier: 'WEEKLY_BOX' },
  });

  if (!purchase) return;

  logger.info('Weekly Box recurring payment received', {
    purchaseId: purchase.id,
    invoiceId: invoice.id,
  });

  // The weekly box cron job handles generation, so we just confirm the purchase stays active
  await prisma.packagePurchase.update({
    where: { id: purchase.id },
    data: { status: 'PAID', updatedAt: new Date() },
  });
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription): Promise<void> {
  const purchase = await prisma.packagePurchase.findFirst({
    where: { stripeSubscriptionId: subscription.id },
  });
  if (!purchase) return;

  await prisma.packagePurchase.update({
    where: { id: purchase.id },
    data: { status: 'CANCELLED' },
  });

  logger.info('Weekly Box subscription cancelled', { purchaseId: purchase.id });
}

async function handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  const invoiceAny = invoice as any;
  const subscriptionId = typeof invoiceAny.subscription === 'string'
    ? invoiceAny.subscription
    : invoiceAny.subscription?.id;

  if (!subscriptionId) return;

  const purchase = await prisma.packagePurchase.findFirst({
    where: { stripeSubscriptionId: subscriptionId },
  });

  if (purchase) {
    logger.warn('DTC payment failed', { purchaseId: purchase.id, invoiceId: invoice.id });
  }
}

// =============================================================================
// QUERIES
// =============================================================================

async function getMyPackages(teacherId: string, params?: PaginationParams) {
  const page = params?.page || 1;
  const limit = params?.limit || 20;
  const skip = (page - 1) * limit;

  const [packages, total] = await Promise.all([
    prisma.packagePurchase.findMany({
      where: { teacherId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        _count: { select: { materials: true, weeks: true } },
      },
    }),
    prisma.packagePurchase.count({ where: { teacherId } }),
  ]);

  return {
    packages,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

async function getPackage(purchaseId: string, teacherId: string) {
  const purchase = await prisma.packagePurchase.findFirst({
    where: { id: purchaseId, teacherId },
    include: {
      weeks: {
        orderBy: { weekNumber: 'asc' },
        include: {
          materials: { orderBy: { sortOrder: 'asc' } },
        },
      },
      _count: { select: { materials: true } },
    },
  });

  if (!purchase) throw new Error('Package not found');
  return purchase;
}

async function getPackageProgress(purchaseId: string, teacherId: string) {
  const purchase = await prisma.packagePurchase.findFirstOrThrow({
    where: { id: purchaseId, teacherId },
    select: {
      id: true,
      status: true,
      totalMaterials: true,
      generatedCount: true,
      approvedCount: true,
      failedCount: true,
      weeksDelivered: true,
      totalWeeks: true,
    },
  });
  return purchase;
}

async function cancelRecurring(purchaseId: string, teacherId: string): Promise<void> {
  const purchase = await prisma.packagePurchase.findFirst({
    where: { id: purchaseId, teacherId, packageTier: 'WEEKLY_BOX' },
  });

  if (!purchase || !purchase.stripeSubscriptionId) {
    throw new Error('No active Weekly Box subscription found');
  }

  const stripe = stripeService.getStripe();
  if (!stripe) throw new Error('Stripe is not configured');

  await stripe.subscriptions.cancel(purchase.stripeSubscriptionId);
  // Status update handled by webhook
}

// =============================================================================
// MATERIAL ACTIONS
// =============================================================================

async function approveMaterial(purchaseId: string, materialId: string, teacherId: string) {
  const material = await prisma.packageMaterial.findFirst({
    where: { id: materialId, purchaseId, purchase: { teacherId } },
  });
  if (!material) throw new Error('Material not found');

  const updated = await prisma.packageMaterial.update({
    where: { id: materialId },
    data: { status: 'PKG_APPROVED', approvedAt: new Date() },
  });

  await prisma.packagePurchase.update({
    where: { id: purchaseId },
    data: { approvedCount: { increment: 1 } },
  });

  return updated;
}

async function editMaterial(purchaseId: string, materialId: string, teacherId: string, editedContent: any) {
  const material = await prisma.packageMaterial.findFirst({
    where: { id: materialId, purchaseId, purchase: { teacherId } },
  });
  if (!material) throw new Error('Material not found');

  return prisma.packageMaterial.update({
    where: { id: materialId },
    data: {
      editedContent: editedContent as Prisma.JsonObject,
      status: 'PKG_EDITED',
    },
  });
}

async function regenerateMaterial(
  purchaseId: string,
  materialId: string,
  teacherId: string,
  feedbackNote?: string
) {
  const material = await prisma.packageMaterial.findFirst({
    where: { id: materialId, purchaseId, purchase: { teacherId } },
  });
  if (!material) throw new Error('Material not found');

  await prisma.packageMaterial.update({
    where: { id: materialId },
    data: {
      status: 'PKG_REGENERATING',
      teacherNotes: feedbackNote || null,
    },
  });

  // Dynamic import to avoid circular dependency
  const { addPackageGenerationJob } = await import('../../jobs/packageGenerationJob.js');
  await addPackageGenerationJob({
    purchaseId,
    teacherId,
    tier: 'STARTER', // Not used for regeneration
    regenerateMaterialId: materialId,
  });
}

async function approveAllMaterials(purchaseId: string, teacherId: string) {
  const purchase = await prisma.packagePurchase.findFirst({
    where: { id: purchaseId, teacherId },
  });
  if (!purchase) throw new Error('Package not found');

  const result = await prisma.packageMaterial.updateMany({
    where: {
      purchaseId,
      status: { in: ['PKG_GENERATED', 'PKG_EDITED'] },
    },
    data: { status: 'PKG_APPROVED', approvedAt: new Date() },
  });

  await prisma.packagePurchase.update({
    where: { id: purchaseId },
    data: { approvedCount: { increment: result.count } },
  });

  return { approved: result.count };
}

export const packagePurchaseService = {
  createCheckout,
  handlePaymentCompleted,
  handleRecurringPayment,
  handleSubscriptionCancelled,
  handlePaymentFailed,
  getMyPackages,
  getPackage,
  getPackageProgress,
  cancelRecurring,
  approveMaterial,
  editMaterial,
  regenerateMaterial,
  approveAllMaterials,
};
