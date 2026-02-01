/**
 * Stripe Products Configuration - Teacher Portal
 *
 * Pricing Model (Teacher Portal v2):
 * - Free to generate + preview unlimited content
 * - Pay-per-download:
 *   - Lesson PDF: $1.99
 *   - Full bundle: $2.99
 * - Unlimited downloads subscription:
 *   - $14.99/month
 *   - $99/year
 */

import { TeacherSubscriptionTier, TeacherDownloadProductType } from '@prisma/client';

// =============================================================================
// ENVIRONMENT VARIABLE LOADING
// =============================================================================

const env = process.env;

// =============================================================================
// SUBSCRIPTION PRODUCTS (Unlimited Downloads)
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

const unlimitedMonthlyPriceId =
  env.STRIPE_PRICE_TEACHER_UNLIMITED_MONTHLY ||
  env.STRIPE_PRICE_TEACHER_PRO_MONTHLY ||
  env.STRIPE_PRICE_TEACHER_BASIC_MONTHLY ||
  '';

const unlimitedAnnualPriceId =
  env.STRIPE_PRICE_TEACHER_UNLIMITED_ANNUAL ||
  env.STRIPE_PRICE_TEACHER_PRO_ANNUAL ||
  env.STRIPE_PRICE_TEACHER_BASIC_ANNUAL ||
  '';

const UNLIMITED_PRODUCT: SubscriptionProduct = {
  name: 'OrbitLearn Unlimited',
  tier: 'PROFESSIONAL',
  priceMonthly: 14.99,
  priceAnnual: 99,
  priceIdMonthly: unlimitedMonthlyPriceId,
  priceIdAnnual: unlimitedAnnualPriceId,
  features: [
    'Unlimited downloads (all formats)',
    'All answer keys, infographics, and exports',
    'Google Slides + PowerPoint exports',
    'Priority AI generation',
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
  // Map legacy tiers to the Unlimited plan for compatibility
  BASIC: UNLIMITED_PRODUCT,
  PROFESSIONAL: UNLIMITED_PRODUCT,
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

  const legacyPriceIds = new Set([
    env.STRIPE_PRICE_TEACHER_BASIC_MONTHLY,
    env.STRIPE_PRICE_TEACHER_BASIC_ANNUAL,
    env.STRIPE_PRICE_TEACHER_PRO_MONTHLY,
    env.STRIPE_PRICE_TEACHER_PRO_ANNUAL,
    env.STRIPE_PRICE_TEACHER_UNLIMITED_MONTHLY,
    env.STRIPE_PRICE_TEACHER_UNLIMITED_ANNUAL,
  ].filter(Boolean));

  if (legacyPriceIds.has(priceId)) {
    return UNLIMITED_PRODUCT;
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
  return priceId === unlimitedAnnualPriceId || priceId === env.STRIPE_PRICE_TEACHER_PRO_ANNUAL || priceId === env.STRIPE_PRICE_TEACHER_BASIC_ANNUAL;
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

  if (!unlimitedMonthlyPriceId) {
    missing.push('STRIPE_PRICE_TEACHER_UNLIMITED_MONTHLY');
  }
  if (!unlimitedAnnualPriceId) {
    missing.push('STRIPE_PRICE_TEACHER_UNLIMITED_ANNUAL');
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
