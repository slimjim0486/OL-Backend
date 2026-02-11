import { Request, Response, NextFunction } from 'express';
import { TeacherRole, TeacherSubscriptionTier } from '@prisma/client';
import { prisma } from '../config/database.js';
import { ForbiddenError, PaymentRequiredError } from './errorHandler.js';

const TIER_RANK: Record<TeacherSubscriptionTier, number> = {
  FREE: 0,
  BASIC: 1,
  PROFESSIONAL: 2,
};

export class TeacherPlanRequiredError extends PaymentRequiredError {
  code: string;
  requiredTier: TeacherSubscriptionTier;

  constructor(requiredTier: TeacherSubscriptionTier, message?: string) {
    const planName =
      requiredTier === 'PROFESSIONAL'
        ? 'Teacher Pro'
        : requiredTier === 'BASIC'
          ? 'Teacher'
          : 'Subscription';

    super(message || `${planName} subscription required.`);
    this.code = requiredTier === 'PROFESSIONAL' ? 'PRO_REQUIRED' : 'SUBSCRIPTION_REQUIRED';
    this.requiredTier = requiredTier;
  }
}

function isActiveTrial(teacher: {
  subscriptionTier: TeacherSubscriptionTier;
  organizationId: string | null;
  trialEndsAt: Date | null;
  trialUsed: boolean | null;
}): boolean {
  if (teacher.subscriptionTier !== 'FREE') return false;
  if (teacher.organizationId) return false;
  if (!teacher.trialEndsAt) return false;
  if (teacher.trialUsed) return false;
  return teacher.trialEndsAt.getTime() > Date.now();
}

function hasActivePaidSubscription(teacher: {
  subscriptionTier: TeacherSubscriptionTier;
  subscriptionStatus: string;
  subscriptionExpiresAt: Date | null;
}): boolean {
  if (teacher.subscriptionTier === 'FREE') return false;
  if (teacher.subscriptionStatus !== 'ACTIVE') return false;
  if (teacher.subscriptionExpiresAt && teacher.subscriptionExpiresAt.getTime() <= Date.now()) return false;
  return true;
}

type TeacherPlanSnapshot = {
  id: string;
  organizationId: string | null;
  role: TeacherRole;
  subscriptionTier: TeacherSubscriptionTier;
  subscriptionStatus: string;
  subscriptionExpiresAt: Date | null;
  trialEndsAt: Date | null;
  trialUsed: boolean | null;
  organization: {
    subscriptionStatus: string;
    subscriptionExpiresAt: Date | null;
  } | null;
};

async function loadTeacherPlanSnapshot(teacherId: string): Promise<TeacherPlanSnapshot | null> {
  return prisma.teacher.findUnique({
    where: { id: teacherId },
    select: {
      id: true,
      organizationId: true,
      role: true,
      subscriptionTier: true,
      subscriptionStatus: true,
      subscriptionExpiresAt: true,
      trialEndsAt: true,
      trialUsed: true,
      organization: {
        select: {
          subscriptionStatus: true,
          subscriptionExpiresAt: true,
        },
      },
    },
  });
}

function assertTeacherTierAccess(
  teacher: TeacherPlanSnapshot,
  minTier: TeacherSubscriptionTier
): void {
  // Org teachers bypass individual tiers, but the organization subscription must be active.
  if (teacher.organizationId) {
    const orgActive = Boolean(
      teacher.organization?.subscriptionStatus === 'ACTIVE' &&
      (!teacher.organization.subscriptionExpiresAt ||
        teacher.organization.subscriptionExpiresAt.getTime() > Date.now())
    );

    if (!orgActive) {
      throw new TeacherPlanRequiredError(
        'BASIC',
        'Organization seat subscription is not active. Contact your organization admin.'
      );
    }

    return;
  }

  // Allow super admins to access everything.
  if (teacher.role === TeacherRole.SUPER_ADMIN) {
    return;
  }

  // Free-tier trials (if enabled elsewhere) should have full feature access during the trial window.
  if (isActiveTrial(teacher)) {
    return;
  }

  const activeSubscription = hasActivePaidSubscription(teacher);
  const currentRank = TIER_RANK[teacher.subscriptionTier];
  const requiredRank = TIER_RANK[minTier];

  if (!activeSubscription || currentRank < requiredRank) {
    throw new TeacherPlanRequiredError(minTier);
  }
}

export async function hasTeacherTierAccess(
  teacherId: string,
  minTier: TeacherSubscriptionTier
): Promise<boolean> {
  const teacher = await loadTeacherPlanSnapshot(teacherId);
  if (!teacher) return false;

  try {
    assertTeacherTierAccess(teacher, minTier);
    return true;
  } catch (error) {
    if (error instanceof TeacherPlanRequiredError || error instanceof ForbiddenError) {
      return false;
    }
    throw error;
  }
}

export function requireTeacherTier(minTier: TeacherSubscriptionTier) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.teacher) {
        throw new ForbiddenError('Teacher authentication required');
      }

      const teacher = await loadTeacherPlanSnapshot(req.teacher.id);

      if (!teacher) {
        throw new ForbiddenError('Teacher not found');
      }

      assertTeacherTierAccess(teacher, minTier);

      next();
    } catch (error) {
      next(error);
    }
  };
}

export const requireTeacherPro = requireTeacherTier('PROFESSIONAL');
