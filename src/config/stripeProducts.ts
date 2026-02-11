/**
 * Stripe Products Configuration - Teacher Portal
 *
 * Pricing Model (Teacher Portal):
 * - Free to generate + preview unlimited content
 * - Pay-per-download:
 *   - Lesson PDF: $1.99
 *   - Full bundle: $2.99
 * - Subscriptions:
 *   - Teacher Seat (BASIC): $14.99/month or $119.88/year
 *   - Teacher Pro Seat (PROFESSIONAL): $29.99/month or $239.88/year
 */

import { TeacherSubscriptionTier, TeacherDownloadProductType } from '@prisma/client';

// =============================================================================
// ENVIRONMENT VARIABLE LOADING
// =============================================================================

const env = process.env;

// =============================================================================
// SUBSCRIPTION PRODUCTS
// =============================================================================

export interface SubscriptionProduct {
  name: string;
  tier: TeacherSubscriptionTier;
  priceMonthly: number;    // USD
  priceAnnual: number;     // USD
  priceIdMonthly: string;
  priceIdAnnual: string;
  features: string[];
}

// Teacher plan (BASIC). Falls back to legacy "UNLIMITED" price IDs if present.
const teacherMonthlyPriceId =
  env.STRIPE_PRICE_TEACHER_BASIC_MONTHLY ||
  env.STRIPE_PRICE_TEACHER_UNLIMITED_MONTHLY ||
  '';

const teacherAnnualPriceId =
  env.STRIPE_PRICE_TEACHER_BASIC_ANNUAL ||
  env.STRIPE_PRICE_TEACHER_UNLIMITED_ANNUAL ||
  '';

const TEACHER_PRODUCT: SubscriptionProduct = {
  name: 'Teacher',
  tier: 'BASIC',
  priceMonthly: 14.99,
  priceAnnual: 119.88,
  priceIdMonthly: teacherMonthlyPriceId,
  priceIdAnnual: teacherAnnualPriceId,
  features: [
    '1 teacher seat',
    'Unlimited downloads (all formats)',
    'All answer keys + infographics',
    'Google Slides + PowerPoint exports',
    'Cancel anytime',
  ],
};

// Teacher Pro plan (PROFESSIONAL).
const teacherProMonthlyPriceId = env.STRIPE_PRICE_TEACHER_PRO_MONTHLY || '';
const teacherProAnnualPriceId = env.STRIPE_PRICE_TEACHER_PRO_ANNUAL || '';

const TEACHER_PRO_PRODUCT: SubscriptionProduct = {
  name: 'Teacher Pro',
  tier: 'PROFESSIONAL',
  priceMonthly: 29.99,
  priceAnnual: 239.88,
  priceIdMonthly: teacherProMonthlyPriceId,
  priceIdAnnual: teacherProAnnualPriceId,
  features: [
    '1 teacher seat',
    'Everything in Teacher',
    'AI grading + batch processing',
    'Audio class updates',
    'Advanced analytics + year-end handover PDF',
    'Cancel anytime',
  ],
};

export const SUBSCRIPTION_PRODUCTS: Record<TeacherSubscriptionTier, SubscriptionProduct> = {
  FREE: {
    name: 'Free to Create',
    tier: 'FREE',
    priceMonthly: 0,
    priceAnnual: 0,
    priceIdMonthly: '',
    priceIdAnnual: '',
    features: [
      'Generate unlimited lessons, quizzes, and flashcards',
      'Full-quality in-app previews',
      'Save everything to your library',
    ],
  },
  BASIC: TEACHER_PRODUCT,
  PROFESSIONAL: TEACHER_PRO_PRODUCT,
};

// =============================================================================
// ONE-TIME DOWNLOAD PRODUCTS
// =============================================================================

export interface DownloadProduct {
  name: string;
  type: TeacherDownloadProductType;
  price: number; // USD
  priceId: string;
  includes: string[];
}

export const DOWNLOAD_PRODUCTS: Record<TeacherDownloadProductType, DownloadProduct> = {
  PDF: {
    name: 'Lesson PDF Download',
    type: 'PDF',
    price: 1.99,
    priceId: env.STRIPE_PRICE_TEACHER_PDF || '',
    includes: ['Lesson PDF'],
  },
  BUNDLE: {
    name: 'Full Lesson Bundle',
    type: 'BUNDLE',
    price: 2.99,
    priceId: env.STRIPE_PRICE_TEACHER_BUNDLE || '',
    includes: [
      'Lesson PDF',
      'Quiz + Answer Key',
      'Flashcards',
      'Infographic',
      'Google Slides',
      'PowerPoint',
    ],
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get subscription product by tier
 */
export function getProductByTier(tier: TeacherSubscriptionTier): SubscriptionProduct {
  return SUBSCRIPTION_PRODUCTS[tier];
}

/**
 * Get subscription product by price ID (maps legacy prices to Unlimited)
 */
export function getProductByPriceId(priceId: string): SubscriptionProduct | null {
  if (!priceId) return null;

  // Explicit mapping first
  if (priceId === teacherMonthlyPriceId || priceId === teacherAnnualPriceId) {
    return TEACHER_PRODUCT;
  }
  if (priceId === teacherProMonthlyPriceId || priceId === teacherProAnnualPriceId) {
    return TEACHER_PRO_PRODUCT;
  }

  // Legacy mapping: old "UNLIMITED" price IDs count as the Teacher plan (BASIC)
  const legacyTeacherPriceIds = new Set([
    env.STRIPE_PRICE_TEACHER_UNLIMITED_MONTHLY,
    env.STRIPE_PRICE_TEACHER_UNLIMITED_ANNUAL,
  ].filter(Boolean));

  if (legacyTeacherPriceIds.has(priceId)) {
    return TEACHER_PRODUCT;
  }

  return null;
}

/**
 * Get download product by type
 */
export function getDownloadProduct(type: TeacherDownloadProductType): DownloadProduct {
  return DOWNLOAD_PRODUCTS[type];
}

/**
 * Get download product by price ID
 */
export function getDownloadProductByPriceId(priceId: string): DownloadProduct | null {
  return Object.values(DOWNLOAD_PRODUCTS).find(product => product.priceId === priceId) || null;
}

/**
 * Check if a price ID is for an annual subscription
 */
export function isAnnualSubscription(priceId: string): boolean {
  return priceId === teacherAnnualPriceId ||
    priceId === teacherProAnnualPriceId ||
    priceId === env.STRIPE_PRICE_TEACHER_UNLIMITED_ANNUAL;
}

/**
 * Get tier from price ID
 */
export function getTierFromPriceId(priceId: string): TeacherSubscriptionTier | null {
  const product = getProductByPriceId(priceId);
  return product?.tier || null;
}

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Validate that all required price IDs are configured
 */
export function validateStripeConfig(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  if (!teacherMonthlyPriceId) {
    missing.push('STRIPE_PRICE_TEACHER_BASIC_MONTHLY');
  }
  if (!teacherAnnualPriceId) {
    missing.push('STRIPE_PRICE_TEACHER_BASIC_ANNUAL');
  }
  if (!teacherProMonthlyPriceId) {
    missing.push('STRIPE_PRICE_TEACHER_PRO_MONTHLY');
  }
  if (!teacherProAnnualPriceId) {
    missing.push('STRIPE_PRICE_TEACHER_PRO_ANNUAL');
  }

  if (!DOWNLOAD_PRODUCTS.PDF.priceId) {
    missing.push('STRIPE_PRICE_TEACHER_PDF');
  }
  if (!DOWNLOAD_PRODUCTS.BUNDLE.priceId) {
    missing.push('STRIPE_PRICE_TEACHER_BUNDLE');
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  SUBSCRIPTION_PRODUCTS,
  DOWNLOAD_PRODUCTS,
  getProductByTier,
  getProductByPriceId,
  getDownloadProduct,
  getDownloadProductByPriceId,
  isAnnualSubscription,
  getTierFromPriceId,
  validateStripeConfig,
};
