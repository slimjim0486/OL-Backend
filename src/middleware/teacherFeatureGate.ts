import { NextFunction, Request, Response } from 'express';
import { prisma } from '../config/database.js';
import { ForbiddenError } from './errorHandler.js';
import { subscriptionService } from '../services/stripe/subscriptionService.js';
import {
  FEATURE_TIER_MAP,
  PUBLIC_TIER_RANK,
  getRequiredTier,
  mapDbTierToPublicTier,
} from '../services/teacher/subscriptionTiers.js';

export function requireFeature(feature: string) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.teacher) {
        throw new ForbiddenError('Teacher authentication required');
      }

      const teacher = await prisma.teacher.findUnique({
        where: { id: req.teacher.id },
        select: {
          subscriptionTier: true,
          subscriptionStatus: true,
          currentPeriodEnd: true,
        },
      });

      if (!teacher) {
        throw new ForbiddenError('Teacher not found');
      }

      const currentTier = mapDbTierToPublicTier(teacher.subscriptionTier);
      const allowedTiers = FEATURE_TIER_MAP[feature] || ['PLUS', 'PRO'];

      if (!allowedTiers.includes(currentTier)) {
        return void res.status(403).json({
          error: 'upgrade_required',
          feature,
          requiredTier: getRequiredTier(feature),
          currentTier,
          message: `This feature requires ${getRequiredTier(feature)}.`,
        });
      }

      if (feature === 'generate' && currentTier === 'FREE') {
        const generation = await subscriptionService.canGenerate(req.teacher.id);
        if (!generation.allowed) {
          return void res.status(403).json({
            error: 'generation_limit_reached',
            feature,
            requiredTier: 'PLUS',
            currentTier,
            used: generation.used,
            limit: generation.limit,
            message: `You've used ${generation.used} of ${generation.limit} free generations this month.`,
          });
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export function hasTierAccess(currentTier: string, requiredTier: string): boolean {
  const currentRank = PUBLIC_TIER_RANK[currentTier as keyof typeof PUBLIC_TIER_RANK] ?? 0;
  const requiredRank = PUBLIC_TIER_RANK[requiredTier as keyof typeof PUBLIC_TIER_RANK] ?? 1;
  return currentRank >= requiredRank;
}
