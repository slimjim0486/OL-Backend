/**
 * Stripe Products Configuration - Teacher Organizations
 *
 * Organization seat billing products. Price IDs are loaded from environment.
 */

import { OrgSubscriptionTier } from '@prisma/client';

const env = process.env;

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
}

function parsePositiveBigInt(value: string | undefined, fallback: bigint): bigint {
  if (!value) return fallback;
  try {
    const parsed = BigInt(value);
    return parsed > 0n ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export interface OrganizationSubscriptionProduct {
  name: string;
  tier: OrgSubscriptionTier;
  priceMonthly: number;
  priceAnnual: number;
  seatLimit: number;
  monthlyTokenQuota: bigint;
  priceIdMonthly: string;
  priceIdAnnual: string;
  features: string[];
}

export const ORGANIZATION_SUBSCRIPTION_PRODUCTS: Record<OrgSubscriptionTier, OrganizationSubscriptionProduct> = {
  STARTER: {
    name: 'Organization Starter',
    tier: 'STARTER',
    priceMonthly: 99,
    priceAnnual: 948,
    seatLimit: parsePositiveInt(env.ORG_STARTER_SEAT_LIMIT, 10),
    monthlyTokenQuota: parsePositiveBigInt(env.ORG_STARTER_MONTHLY_TOKEN_QUOTA, 1_000_000n),
    priceIdMonthly: env.STRIPE_PRICE_ORG_STARTER_MONTHLY || '',
    priceIdAnnual: env.STRIPE_PRICE_ORG_STARTER_ANNUAL || '',
    features: [
      'Up to 10 teacher seats',
      '1M tokens/month organization quota',
      'Organization invite + seat reassignment tools',
    ],
  },
  PROFESSIONAL: {
    name: 'Organization Professional',
    tier: 'PROFESSIONAL',
    priceMonthly: 399,
    priceAnnual: 3828,
    seatLimit: parsePositiveInt(env.ORG_PRO_SEAT_LIMIT, 50),
    monthlyTokenQuota: parsePositiveBigInt(env.ORG_PRO_MONTHLY_TOKEN_QUOTA, 5_000_000n),
    priceIdMonthly: env.STRIPE_PRICE_ORG_PRO_MONTHLY || '',
    priceIdAnnual: env.STRIPE_PRICE_ORG_PRO_ANNUAL || '',
    features: [
      'Up to 50 teacher seats',
      '5M tokens/month organization quota',
      'Advanced admin controls',
    ],
  },
  ENTERPRISE: {
    name: 'Organization Enterprise',
    tier: 'ENTERPRISE',
    priceMonthly: 999,
    priceAnnual: 9588,
    seatLimit: parsePositiveInt(env.ORG_ENTERPRISE_SEAT_LIMIT, 10000),
    monthlyTokenQuota: parsePositiveBigInt(env.ORG_ENTERPRISE_MONTHLY_TOKEN_QUOTA, 20_000_000n),
    priceIdMonthly: env.STRIPE_PRICE_ORG_ENTERPRISE_MONTHLY || '',
    priceIdAnnual: env.STRIPE_PRICE_ORG_ENTERPRISE_ANNUAL || '',
    features: [
      'High seat limit',
      'Custom organization quota',
      'Priority support',
    ],
  },
};

export function getOrganizationProductByTier(
  tier: OrgSubscriptionTier
): OrganizationSubscriptionProduct {
  return ORGANIZATION_SUBSCRIPTION_PRODUCTS[tier];
}

export function getOrganizationProductByPriceId(
  priceId: string
): OrganizationSubscriptionProduct | null {
  if (!priceId) return null;
  for (const product of Object.values(ORGANIZATION_SUBSCRIPTION_PRODUCTS)) {
    if (product.priceIdMonthly === priceId || product.priceIdAnnual === priceId) {
      return product;
    }
  }
  return null;
}

export function getOrganizationTierFromPriceId(priceId: string): OrgSubscriptionTier | null {
  const product = getOrganizationProductByPriceId(priceId);
  return product?.tier || null;
}

export function isOrganizationAnnualSubscription(priceId: string): boolean {
  if (!priceId) return false;
  for (const product of Object.values(ORGANIZATION_SUBSCRIPTION_PRODUCTS)) {
    if (product.priceIdAnnual === priceId) {
      return true;
    }
  }
  return false;
}

export function getAvailableOrganizationPlans(): OrganizationSubscriptionProduct[] {
  return Object.values(ORGANIZATION_SUBSCRIPTION_PRODUCTS).filter(
    (product) => Boolean(product.priceIdMonthly && product.priceIdAnnual)
  );
}

export function validateOrganizationStripeConfig(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  if (!ORGANIZATION_SUBSCRIPTION_PRODUCTS.STARTER.priceIdMonthly) {
    missing.push('STRIPE_PRICE_ORG_STARTER_MONTHLY');
  }
  if (!ORGANIZATION_SUBSCRIPTION_PRODUCTS.STARTER.priceIdAnnual) {
    missing.push('STRIPE_PRICE_ORG_STARTER_ANNUAL');
  }
  if (!ORGANIZATION_SUBSCRIPTION_PRODUCTS.PROFESSIONAL.priceIdMonthly) {
    missing.push('STRIPE_PRICE_ORG_PRO_MONTHLY');
  }
  if (!ORGANIZATION_SUBSCRIPTION_PRODUCTS.PROFESSIONAL.priceIdAnnual) {
    missing.push('STRIPE_PRICE_ORG_PRO_ANNUAL');
  }

  const hasEnterpriseMonthly = Boolean(ORGANIZATION_SUBSCRIPTION_PRODUCTS.ENTERPRISE.priceIdMonthly);
  const hasEnterpriseAnnual = Boolean(ORGANIZATION_SUBSCRIPTION_PRODUCTS.ENTERPRISE.priceIdAnnual);
  if (hasEnterpriseMonthly && !hasEnterpriseAnnual) {
    missing.push('STRIPE_PRICE_ORG_ENTERPRISE_ANNUAL');
  }
  if (!hasEnterpriseMonthly && hasEnterpriseAnnual) {
    missing.push('STRIPE_PRICE_ORG_ENTERPRISE_MONTHLY');
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

export default {
  ORGANIZATION_SUBSCRIPTION_PRODUCTS,
  getOrganizationProductByTier,
  getOrganizationProductByPriceId,
  getOrganizationTierFromPriceId,
  isOrganizationAnnualSubscription,
  getAvailableOrganizationPlans,
  validateOrganizationStripeConfig,
};
