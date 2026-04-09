import { TeacherDownloadProductType } from '@prisma/client';
import {
  PublicSubscriptionTier,
  mapDbTierToPublicTier,
  mapPublicTierToDbTier,
} from '../services/teacher/subscriptionTiers.js';

const env = process.env;

export interface SubscriptionProduct {
  name: string;
  publicTier: PublicSubscriptionTier;
  internalTier: ReturnType<typeof mapPublicTierToDbTier>;
  priceMonthly: number;
  priceAnnual: number;
  priceIdMonthly: string;
  priceIdAnnual: string;
  features: string[];
}

const PLUS_MONTHLY_PRICE_ID = env.STRIPE_PLUS_MONTHLY_PRICE_ID || '';
const PLUS_ANNUAL_PRICE_ID = env.STRIPE_PLUS_ANNUAL_PRICE_ID || '';
const PRO_MONTHLY_PRICE_ID = env.STRIPE_PRO_MONTHLY_PRICE_ID || '';
const PRO_ANNUAL_PRICE_ID = env.STRIPE_PRO_ANNUAL_PRICE_ID || '';
const FOUNDING_PLUS_ANNUAL_PRICE_ID = env.STRIPE_FOUNDING_PLUS_ANNUAL_PRICE_ID || '';

const FREE_PRODUCT: SubscriptionProduct = {
  name: 'OrbitLearn Free',
  publicTier: 'FREE',
  internalTier: mapPublicTierToDbTier('FREE'),
  priceMonthly: 0,
  priceAnnual: 0,
  priceIdMonthly: '',
  priceIdAnnual: '',
  features: [
    'Unlimited Stream, Graph, and Library access',
    'Student linking, backlinks, streaks, reflection, and digest',
    '5 material generations each month',
  ],
};

const PLUS_PRODUCT: SubscriptionProduct = {
  name: 'OrbitLearn Plus',
  publicTier: 'PLUS',
  internalTier: mapPublicTierToDbTier('PLUS'),
  priceMonthly: 12.99,
  priceAnnual: 103.9,
  priceIdMonthly: PLUS_MONTHLY_PRICE_ID,
  priceIdAnnual: PLUS_ANNUAL_PRICE_ID,
  features: [
    'Unlimited generation',
    'Ollie whispers and preference learning',
    'Material import, sharing, and voice input',
  ],
};

const PRO_PRODUCT: SubscriptionProduct = {
  name: 'OrbitLearn Pro',
  publicTier: 'PRO',
  internalTier: mapPublicTierToDbTier('PRO'),
  priceMonthly: 24.99,
  priceAnnual: 199.9,
  priceIdMonthly: PRO_MONTHLY_PRICE_ID,
  priceIdAnnual: PRO_ANNUAL_PRICE_ID,
  features: [
    'Everything in Plus',
    'Priority queue and inline completions',
    'Canvas, advanced analytics, and parent bridge export',
  ],
};

export const SUBSCRIPTION_PRODUCTS = {
  FREE: {
    ...FREE_PRODUCT,
  },
  PLUS: {
    ...PLUS_PRODUCT,
  },
  PRO: {
    ...PRO_PRODUCT,
  },
  BASIC: {
    ...PLUS_PRODUCT,
  },
  PROFESSIONAL: {
    ...PRO_PRODUCT,
  },
} as const;

export const FOUNDING_MEMBER_PRODUCT = {
  publicTier: 'PLUS' as const,
  interval: 'ANNUAL' as const,
  price: 79,
  priceId: FOUNDING_PLUS_ANNUAL_PRICE_ID,
};

export interface DownloadProduct {
  name: string;
  type: TeacherDownloadProductType;
  price: number;
  priceId: string;
  includes: string[];
}

export const DOWNLOAD_PRODUCTS: Record<TeacherDownloadProductType, DownloadProduct> = {
  PDF: {
    name: 'Legacy Lesson PDF Download',
    type: 'PDF',
    price: 0,
    priceId: '',
    includes: ['Deprecated under subscription billing'],
  },
  BUNDLE: {
    name: 'Legacy Full Lesson Bundle',
    type: 'BUNDLE',
    price: 0,
    priceId: '',
    includes: ['Deprecated under subscription billing'],
  },
};

export function getProductByTier(tier: PublicSubscriptionTier | ReturnType<typeof mapPublicTierToDbTier>) {
  const publicTier = tier === 'BASIC' || tier === 'PROFESSIONAL'
    ? mapDbTierToPublicTier(tier)
    : tier;
  return SUBSCRIPTION_PRODUCTS[publicTier];
}

export function getProductByPriceId(priceId: string): SubscriptionProduct | null {
  if (!priceId) return null;
  return Object.values(SUBSCRIPTION_PRODUCTS).find(
    (product) => product.priceIdMonthly === priceId || product.priceIdAnnual === priceId
  ) || null;
}

export function getTierFromPriceId(priceId: string): ReturnType<typeof mapPublicTierToDbTier> | null {
  if (priceId === FOUNDING_PLUS_ANNUAL_PRICE_ID) {
    return mapPublicTierToDbTier('PLUS');
  }
  return getProductByPriceId(priceId)?.internalTier || null;
}

export function getPublicTierFromPriceId(priceId: string): PublicSubscriptionTier | null {
  if (priceId === FOUNDING_PLUS_ANNUAL_PRICE_ID) {
    return 'PLUS';
  }
  return getProductByPriceId(priceId)?.publicTier || null;
}

export function isAnnualSubscription(priceId: string): boolean {
  return priceId === PLUS_ANNUAL_PRICE_ID ||
    priceId === PRO_ANNUAL_PRICE_ID ||
    priceId === FOUNDING_PLUS_ANNUAL_PRICE_ID;
}

export function validateStripeConfig(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  if (!PLUS_MONTHLY_PRICE_ID) missing.push('STRIPE_PLUS_MONTHLY_PRICE_ID');
  if (!PLUS_ANNUAL_PRICE_ID) missing.push('STRIPE_PLUS_ANNUAL_PRICE_ID');
  if (!PRO_MONTHLY_PRICE_ID) missing.push('STRIPE_PRO_MONTHLY_PRICE_ID');
  if (!PRO_ANNUAL_PRICE_ID) missing.push('STRIPE_PRO_ANNUAL_PRICE_ID');

  return {
    valid: missing.length === 0,
    missing,
  };
}

export default {
  SUBSCRIPTION_PRODUCTS,
  FOUNDING_MEMBER_PRODUCT,
  DOWNLOAD_PRODUCTS,
  getProductByTier,
  getProductByPriceId,
  getTierFromPriceId,
  getPublicTierFromPriceId,
  isAnnualSubscription,
  validateStripeConfig,
};
