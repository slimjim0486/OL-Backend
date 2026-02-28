/**
 * Stripe Products Configuration — DTC Product Packages
 *
 * Teachers sign up, onboard with Ollie for context, then purchase content packages.
 * Categories:
 *   A — Core Tiers (one-time)
 *   B — Weekly Classroom Box (recurring $29/mo)
 *   C — Seasonal Mega-Packs (one-time)
 *   D — Specialty Packs (one-time)
 */

import { PackageTier, PackageCategory, DeliveryType } from '@prisma/client';

// =============================================================================
// TYPES
// =============================================================================

export interface DTCProduct {
  id: string;
  name: string;
  tier: PackageTier;
  category: PackageCategory;
  priceCents: number;
  stripePriceId: string;
  isRecurring: boolean;
  deliveryType: DeliveryType;
  description: string;
  resourceEstimate: string;
  totalWeeks: number;
  requiresSubject: boolean;
  requiresTopic: boolean;
  features: string[];
}

// =============================================================================
// ENV VAR LOADING
// =============================================================================

const env = process.env;

// =============================================================================
// PRODUCT CATALOG
// =============================================================================

export const DTC_PRODUCTS: Record<PackageTier, DTCProduct> = {
  // ─── Category A — Core Tiers ───────────────────────────────────────────
  STARTER: {
    id: 'starter',
    name: 'Starter Kit',
    tier: 'STARTER',
    category: 'CORE',
    priceCents: 2900,
    stripePriceId: env.STRIPE_PRICE_DTC_STARTER || '',
    isRecurring: false,
    deliveryType: 'INSTANT',
    description: '1 unit (2-3 weeks) of personalized resources for a specific topic',
    resourceEstimate: '~40-50 resources',
    totalWeeks: 3,
    requiresSubject: true,
    requiresTopic: true,
    features: [
      '2-3 weeks of personalized content',
      '~40-50 differentiated resources',
      'Warm-ups, lessons, worksheets, exit tickets',
      'Standards-aligned to your curriculum',
      'Instant delivery — all at once',
    ],
  },

  SEMESTER: {
    id: 'semester',
    name: 'Semester Saver',
    tier: 'SEMESTER',
    category: 'CORE',
    priceCents: 8900,
    stripePriceId: env.STRIPE_PRICE_DTC_SEMESTER || '',
    isRecurring: false,
    deliveryType: 'PROGRESSIVE',
    description: '1 full subject for 16-18 weeks with progressive weekly delivery',
    resourceEstimate: '~300-400 resources',
    totalWeeks: 17,
    requiresSubject: true,
    requiresTopic: false,
    features: [
      '16-18 weeks of content for one subject',
      '~300-400 differentiated resources',
      'Progressive delivery — first 4 weeks instant, then weekly drops',
      'Pacing aligned to your curriculum standards',
      'Full standards coverage map included',
    ],
  },

  YEAR_ROUND: {
    id: 'year-round',
    name: 'Year-Round Classroom',
    tier: 'YEAR_ROUND',
    category: 'CORE',
    priceCents: 19900,
    stripePriceId: env.STRIPE_PRICE_DTC_YEAR_ROUND || '',
    isRecurring: false,
    deliveryType: 'PROGRESSIVE',
    description: 'All subjects for ~36 weeks — your entire school year, covered',
    resourceEstimate: '~1,500-2,000 resources',
    totalWeeks: 36,
    requiresSubject: false,
    requiresTopic: false,
    features: [
      '~36 weeks across all your subjects',
      '~1,500-2,000 differentiated resources',
      'Progressive delivery — first 6 weeks instant, then weekly',
      'Complete standards coverage across all subjects',
      'Pacing guide and standards alignment map',
    ],
  },

  FOUNDING_TEACHER: {
    id: 'founding-teacher',
    name: 'Founding Teacher',
    tier: 'FOUNDING_TEACHER',
    category: 'CORE',
    priceCents: 29900,
    stripePriceId: env.STRIPE_PRICE_DTC_FOUNDING || '',
    isRecurring: false,
    deliveryType: 'PROGRESSIVE',
    description: 'Everything in Year-Round + priority generation, audio updates, and sharing',
    resourceEstimate: '~1,500-2,000+ resources',
    totalWeeks: 36,
    requiresSubject: false,
    requiresTopic: false,
    features: [
      'Everything in Year-Round Classroom',
      'Priority generation queue (2x faster)',
      'Audio class updates for parents',
      'Share materials with 2 colleagues',
      'Lifetime content updates when curriculum changes',
    ],
  },

  // ─── Category B — Weekly Classroom Box ──────────────────────────────────
  WEEKLY_BOX: {
    id: 'weekly-box',
    name: 'Weekly Classroom Box',
    tier: 'WEEKLY_BOX',
    category: 'WEEKLY_BOX',
    priceCents: 2900,
    stripePriceId: env.STRIPE_PRICE_DTC_WEEKLY_BOX || '',
    isRecurring: true,
    deliveryType: 'RECURRING',
    description: 'Personalized materials delivered every week — like a subscription box for your classroom',
    resourceEstimate: '~20-30 resources/week',
    totalWeeks: 0, // Ongoing
    requiresSubject: false,
    requiresTopic: false,
    features: [
      'Fresh materials delivered every Sunday evening',
      '~20-30 differentiated resources per week',
      'Adapts to your curriculum progress',
      'Cancel anytime',
    ],
  },

  // ─── Category C — Seasonal Mega-Packs ──────────────────────────────────
  BACK_TO_SCHOOL: {
    id: 'back-to-school',
    name: 'Back-to-School Survival Kit',
    tier: 'BACK_TO_SCHOOL',
    category: 'SEASONAL',
    priceCents: 4900,
    stripePriceId: env.STRIPE_PRICE_DTC_BACK_TO_SCHOOL || '',
    isRecurring: false,
    deliveryType: 'INSTANT',
    description: 'First 4 weeks of school across all subjects — hit the ground running',
    resourceEstimate: '~120-160 resources',
    totalWeeks: 4,
    requiresSubject: false,
    requiresTopic: false,
    features: [
      'First 4 weeks across all subjects',
      '~120-160 differentiated resources',
      'Ice-breakers, pre-assessments, getting-to-know-you activities',
      'Classroom routines and procedures materials',
      'Instant delivery',
    ],
  },

  TEST_PREP: {
    id: 'test-prep',
    name: 'Test Prep Power Pack',
    tier: 'TEST_PREP',
    category: 'SEASONAL',
    priceCents: 6900,
    stripePriceId: env.STRIPE_PRICE_DTC_TEST_PREP || '',
    isRecurring: false,
    deliveryType: 'INSTANT',
    description: '4-6 weeks of intensive review and test prep materials',
    resourceEstimate: '~150-200 resources',
    totalWeeks: 5,
    requiresSubject: false,
    requiresTopic: false,
    features: [
      '4-6 weeks of standards-aligned review materials',
      '~150-200 differentiated resources',
      'Practice tests, review worksheets, study guides',
      'Gap analysis based on your curriculum progress',
      'Test-taking strategy materials',
    ],
  },

  END_OF_YEAR: {
    id: 'end-of-year',
    name: 'End-of-Year Wrap-Up Bundle',
    tier: 'END_OF_YEAR',
    category: 'SEASONAL',
    priceCents: 3900,
    stripePriceId: env.STRIPE_PRICE_DTC_END_OF_YEAR || '',
    isRecurring: false,
    deliveryType: 'INSTANT',
    description: 'Final reviews, report card comments, and summer packets',
    resourceEstimate: '~80-120 resources',
    totalWeeks: 3,
    requiresSubject: false,
    requiresTopic: false,
    features: [
      'Final review materials for all subjects',
      'Report card comment templates',
      'Summer learning packets for students',
      'Year-end portfolio/reflection materials',
      'Instant delivery',
    ],
  },

  // ─── Category D — Specialty Packs ──────────────────────────────────────
  SUB_PLAN_VAULT: {
    id: 'sub-plan-vault',
    name: 'Sub Plan Vault',
    tier: 'SUB_PLAN_VAULT',
    category: 'SPECIALTY',
    priceCents: 3900,
    stripePriceId: env.STRIPE_PRICE_DTC_SUB_PLANS || '',
    isRecurring: false,
    deliveryType: 'INSTANT',
    description: '10 complete substitute teacher plans — ready when you need them',
    resourceEstimate: '10 complete sub plans',
    totalWeeks: 0,
    requiresSubject: false,
    requiresTopic: false,
    features: [
      '10 complete substitute plans across your subjects',
      'Varied topics and grade-appropriate activities',
      'Detailed step-by-step instructions for subs',
      'Emergency plans + planned absence plans',
      'Instant delivery',
    ],
  },

  IEP_GOAL_BANK: {
    id: 'iep-goal-bank',
    name: 'IEP Goal Bank',
    tier: 'IEP_GOAL_BANK',
    category: 'SPECIALTY',
    priceCents: 4900,
    stripePriceId: env.STRIPE_PRICE_DTC_IEP_GOALS || '',
    isRecurring: false,
    deliveryType: 'INSTANT',
    description: '100+ measurable IEP goals with monitoring tools',
    resourceEstimate: '100+ IEP goals',
    totalWeeks: 0,
    requiresSubject: false,
    requiresTopic: false,
    features: [
      '100+ measurable, standards-aligned IEP goals',
      'Covers all disability categories',
      'Progress monitoring data sheets',
      'Baseline assessment templates',
      'Instant delivery',
    ],
  },

  ASSESSMENT_ARSENAL: {
    id: 'assessment-arsenal',
    name: 'Assessment Arsenal',
    tier: 'ASSESSMENT_ARSENAL',
    category: 'SPECIALTY',
    priceCents: 4900,
    stripePriceId: env.STRIPE_PRICE_DTC_ASSESSMENT || '',
    isRecurring: false,
    deliveryType: 'INSTANT',
    description: 'Complete assessment suite for your subject and grade level',
    resourceEstimate: '~50-80 assessments',
    totalWeeks: 0,
    requiresSubject: true,
    requiresTopic: false,
    features: [
      'Pre-tests, unit tests, cumulative exams',
      'Differentiated versions for each assessment',
      'Answer keys and rubrics included',
      'Standards alignment for every assessment',
      'Instant delivery',
    ],
  },

  PARENT_COMM_KIT: {
    id: 'parent-comm-kit',
    name: 'Parent Communication Kit',
    tier: 'PARENT_COMM_KIT',
    category: 'SPECIALTY',
    priceCents: 3900,
    stripePriceId: env.STRIPE_PRICE_DTC_PARENT_COMM || '',
    isRecurring: false,
    deliveryType: 'INSTANT',
    description: 'Full year of newsletters, conference materials, and report card comments',
    resourceEstimate: '~60-80 communication pieces',
    totalWeeks: 0,
    requiresSubject: false,
    requiresTopic: false,
    features: [
      '36+ weekly/bi-weekly newsletter templates',
      'Parent-teacher conference materials',
      'Report card comment bank (all subjects)',
      'Back-to-school and end-of-year communications',
      'Instant delivery',
    ],
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getDTCProduct(tier: PackageTier): DTCProduct {
  return DTC_PRODUCTS[tier];
}

export function getDTCProductByPriceId(priceId: string): DTCProduct | null {
  if (!priceId) return null;
  return Object.values(DTC_PRODUCTS).find(p => p.stripePriceId === priceId) || null;
}

export function getDTCProducts(category?: PackageCategory): DTCProduct[] {
  const all = Object.values(DTC_PRODUCTS);
  if (!category) return all;
  return all.filter(p => p.category === category);
}

export function getDTCProductsByCategory(): Record<PackageCategory, DTCProduct[]> {
  return {
    CORE: getDTCProducts('CORE'),
    WEEKLY_BOX: getDTCProducts('WEEKLY_BOX'),
    SEASONAL: getDTCProducts('SEASONAL'),
    SPECIALTY: getDTCProducts('SPECIALTY'),
  };
}

export function validateDTCStripeConfig(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  const envMap: Record<string, string> = {
    STARTER: 'STRIPE_PRICE_DTC_STARTER',
    SEMESTER: 'STRIPE_PRICE_DTC_SEMESTER',
    YEAR_ROUND: 'STRIPE_PRICE_DTC_YEAR_ROUND',
    FOUNDING_TEACHER: 'STRIPE_PRICE_DTC_FOUNDING',
    WEEKLY_BOX: 'STRIPE_PRICE_DTC_WEEKLY_BOX',
    BACK_TO_SCHOOL: 'STRIPE_PRICE_DTC_BACK_TO_SCHOOL',
    TEST_PREP: 'STRIPE_PRICE_DTC_TEST_PREP',
    END_OF_YEAR: 'STRIPE_PRICE_DTC_END_OF_YEAR',
    SUB_PLAN_VAULT: 'STRIPE_PRICE_DTC_SUB_PLANS',
    IEP_GOAL_BANK: 'STRIPE_PRICE_DTC_IEP_GOALS',
    ASSESSMENT_ARSENAL: 'STRIPE_PRICE_DTC_ASSESSMENT',
    PARENT_COMM_KIT: 'STRIPE_PRICE_DTC_PARENT_COMM',
  };

  for (const [tier, envVar] of Object.entries(envMap)) {
    if (!DTC_PRODUCTS[tier as PackageTier].stripePriceId) {
      missing.push(envVar);
    }
  }

  return { valid: missing.length === 0, missing };
}
