import { SubscriptionStatus, TeacherSubscriptionTier } from '@prisma/client';

export type PublicSubscriptionTier = 'FREE' | 'PLUS' | 'PRO';
export type PublicSubscriptionInterval = 'MONTHLY' | 'ANNUAL';

export const PUBLIC_TIER_RANK: Record<PublicSubscriptionTier, number> = {
  FREE: 0,
  PLUS: 1,
  PRO: 2,
};

export const FEATURE_TIER_MAP: Record<string, PublicSubscriptionTier[]> = {
  stream: ['FREE', 'PLUS', 'PRO'],
  graph: ['FREE', 'PLUS', 'PRO'],
  library: ['FREE', 'PLUS', 'PRO'],
  'student-linking': ['FREE', 'PLUS', 'PRO'],
  backlinks: ['FREE', 'PLUS', 'PRO'],
  streak: ['FREE', 'PLUS', 'PRO'],
  'daily-reflection': ['FREE', 'PLUS', 'PRO'],
  'weekly-digest': ['FREE', 'PLUS', 'PRO'],
  generate: ['FREE', 'PLUS', 'PRO'],

  'ollie-whispers': ['PLUS', 'PRO'],
  'preference-learning': ['PLUS', 'PRO'],
  'smart-options': ['PLUS', 'PRO'],
  'outcome-tracking': ['PLUS', 'PRO'],
  'material-import': ['PLUS', 'PRO'],
  'voice-input': ['PLUS', 'PRO'],
  'material-sharing': ['PLUS', 'PRO'],

  'priority-generation': ['PRO'],
  'inline-completions': ['PRO'],
  'term-wrapped': ['PRO'],
  canvas: ['PLUS', 'PRO'],
  'advanced-analytics': ['PRO'],
  'parent-bridge': ['PRO'],
};

export function mapDbTierToPublicTier(tier: TeacherSubscriptionTier | null | undefined): PublicSubscriptionTier {
  switch (tier) {
    case 'PROFESSIONAL':
      return 'PRO';
    case 'BASIC':
      return 'PLUS';
    default:
      return 'FREE';
  }
}

export function mapPublicTierToDbTier(tier: PublicSubscriptionTier): TeacherSubscriptionTier {
  switch (tier) {
    case 'PRO':
      return 'PROFESSIONAL';
    case 'PLUS':
      return 'BASIC';
    default:
      return 'FREE';
  }
}

export function normalizePublicTier(value: unknown): PublicSubscriptionTier | null {
  const normalized = String(value || '').trim().toUpperCase();
  if (normalized === 'PRO') return 'PRO';
  if (normalized === 'PLUS') return 'PLUS';
  if (normalized === 'FREE') return 'FREE';
  if (normalized === 'PROFESSIONAL') return 'PRO';
  if (normalized === 'BASIC') return 'PLUS';
  return null;
}

export function normalizeInterval(value: unknown): PublicSubscriptionInterval | null {
  const normalized = String(value || '').trim().toUpperCase();
  if (normalized === 'MONTHLY' || normalized === 'MONTH') return 'MONTHLY';
  if (normalized === 'ANNUAL' || normalized === 'YEARLY' || normalized === 'YEAR') return 'ANNUAL';
  return null;
}

export function hasActivePaidAccess(params: {
  publicTier: PublicSubscriptionTier;
  subscriptionStatus: SubscriptionStatus;
  currentPeriodEnd?: Date | null;
}): boolean {
  if (params.publicTier === 'FREE') return false;
  if (params.subscriptionStatus !== 'ACTIVE') {
    return false;
  }
  if (params.currentPeriodEnd && params.currentPeriodEnd.getTime() <= Date.now()) {
    return false;
  }
  return true;
}

export function getRequiredTier(feature: string): PublicSubscriptionTier {
  const allowed = FEATURE_TIER_MAP[feature];
  if (!allowed || allowed.length === 0) {
    return 'PLUS';
  }
  return allowed[0] === 'FREE' ? (allowed[1] || 'PLUS') : allowed[0];
}
