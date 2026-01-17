// Voice Consent Service - COPPA-compliant voice input consent management
import { prisma } from '../../config/database.js';
import { VoiceConsentStatus, VoiceContextType } from '@prisma/client';
import { ValidationError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';

// Consent expiry duration (1 year in milliseconds)
const CONSENT_EXPIRY_MS = 365 * 24 * 60 * 60 * 1000;

export interface VoiceConsentInfo {
  hasConsent: boolean;
  status: VoiceConsentStatus;
  expiresAt?: Date | null;
  consentGivenAt?: Date | null;
}

export interface TranscriptionLogParams {
  childId: string;
  audioLengthMs: number;
  transcriptionMs: number;
  modelUsed: string;
  contextType: VoiceContextType;
  contextId?: string;
  confidenceScore?: number;
  wasRetried?: boolean;
}

export const voiceConsentService = {
  /**
   * Check if a child has valid voice consent
   */
  async hasVoiceConsent(childId: string): Promise<boolean> {
    const consent = await prisma.voiceConsent.findUnique({
      where: { childId },
    });

    if (!consent) {
      return false;
    }

    // Check if consent is granted and not expired
    if (consent.status !== 'GRANTED') {
      return false;
    }

    if (consent.expiresAt && consent.expiresAt < new Date()) {
      // Mark as expired
      await prisma.voiceConsent.update({
        where: { id: consent.id },
        data: { status: 'EXPIRED' },
      });
      return false;
    }

    return true;
  },

  /**
   * Get detailed voice consent status for a child
   */
  async getVoiceConsentStatus(childId: string): Promise<VoiceConsentInfo> {
    const consent = await prisma.voiceConsent.findUnique({
      where: { childId },
    });

    if (!consent) {
      return {
        hasConsent: false,
        status: 'PENDING' as VoiceConsentStatus,
      };
    }

    // Check if expired
    if (consent.status === 'GRANTED' && consent.expiresAt && consent.expiresAt < new Date()) {
      await prisma.voiceConsent.update({
        where: { id: consent.id },
        data: { status: 'EXPIRED' },
      });

      return {
        hasConsent: false,
        status: 'EXPIRED' as VoiceConsentStatus,
        expiresAt: consent.expiresAt,
        consentGivenAt: consent.consentGivenAt,
      };
    }

    return {
      hasConsent: consent.status === 'GRANTED',
      status: consent.status,
      expiresAt: consent.expiresAt,
      consentGivenAt: consent.consentGivenAt,
    };
  },

  /**
   * Get voice consent status for all children of a parent
   */
  async getChildrenVoiceConsentStatus(parentId: string): Promise<Array<{
    childId: string;
    childName: string;
    hasConsent: boolean;
    status: VoiceConsentStatus;
    expiresAt?: Date | null;
  }>> {
    const children = await prisma.child.findMany({
      where: { parentId },
      include: {
        voiceConsent: true,
      },
    });

    const now = new Date();

    return children.map(child => {
      const consent = child.voiceConsent;

      if (!consent) {
        return {
          childId: child.id,
          childName: child.displayName,
          hasConsent: false,
          status: 'PENDING' as VoiceConsentStatus,
        };
      }

      // Check if expired
      const isExpired = consent.status === 'GRANTED' && consent.expiresAt && consent.expiresAt < now;

      return {
        childId: child.id,
        childName: child.displayName,
        hasConsent: consent.status === 'GRANTED' && !isExpired,
        status: isExpired ? ('EXPIRED' as VoiceConsentStatus) : consent.status,
        expiresAt: consent.expiresAt,
      };
    });
  },

  /**
   * Grant voice consent for a child
   * Must be called by the parent
   */
  async grantVoiceConsent(
    parentId: string,
    childId: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<VoiceConsentInfo> {
    // Verify the child belongs to this parent
    const child = await prisma.child.findFirst({
      where: { id: childId, parentId },
    });

    if (!child) {
      throw new ForbiddenError('You do not have permission to manage this child');
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + CONSENT_EXPIRY_MS);

    // Upsert consent record
    const consent = await prisma.voiceConsent.upsert({
      where: { childId },
      create: {
        parentId,
        childId,
        status: 'GRANTED',
        consentGivenAt: now,
        expiresAt,
        ipAddress,
        userAgent,
      },
      update: {
        status: 'GRANTED',
        consentGivenAt: now,
        expiresAt,
        revokedAt: null,
        ipAddress,
        userAgent,
      },
    });

    logger.info('Voice consent granted', {
      parentId,
      childId,
      consentId: consent.id,
      expiresAt,
    });

    return {
      hasConsent: true,
      status: consent.status,
      expiresAt: consent.expiresAt,
      consentGivenAt: consent.consentGivenAt,
    };
  },

  /**
   * Revoke voice consent for a child
   * Takes effect immediately
   */
  async revokeVoiceConsent(
    parentId: string,
    childId: string
  ): Promise<VoiceConsentInfo> {
    // Verify the child belongs to this parent
    const child = await prisma.child.findFirst({
      where: { id: childId, parentId },
    });

    if (!child) {
      throw new ForbiddenError('You do not have permission to manage this child');
    }

    const consent = await prisma.voiceConsent.findUnique({
      where: { childId },
    });

    if (!consent) {
      throw new NotFoundError('No voice consent found for this child');
    }

    const now = new Date();

    const updated = await prisma.voiceConsent.update({
      where: { id: consent.id },
      data: {
        status: 'REVOKED',
        revokedAt: now,
      },
    });

    logger.info('Voice consent revoked', {
      parentId,
      childId,
      consentId: consent.id,
    });

    return {
      hasConsent: false,
      status: updated.status,
      expiresAt: updated.expiresAt,
      consentGivenAt: updated.consentGivenAt,
    };
  },

  /**
   * Deny voice consent (parent explicitly declines)
   */
  async denyVoiceConsent(
    parentId: string,
    childId: string
  ): Promise<VoiceConsentInfo> {
    // Verify the child belongs to this parent
    const child = await prisma.child.findFirst({
      where: { id: childId, parentId },
    });

    if (!child) {
      throw new ForbiddenError('You do not have permission to manage this child');
    }

    const consent = await prisma.voiceConsent.upsert({
      where: { childId },
      create: {
        parentId,
        childId,
        status: 'DENIED',
      },
      update: {
        status: 'DENIED',
        revokedAt: new Date(),
      },
    });

    logger.info('Voice consent denied', {
      parentId,
      childId,
      consentId: consent.id,
    });

    return {
      hasConsent: false,
      status: consent.status,
    };
  },

  /**
   * Log a transcription event (audit trail - no content stored)
   * COPPA compliance: Only stores metadata, never audio or transcript content
   */
  async logTranscription(params: TranscriptionLogParams): Promise<void> {
    await prisma.voiceTranscriptionLog.create({
      data: {
        childId: params.childId,
        audioLengthMs: params.audioLengthMs,
        transcriptionMs: params.transcriptionMs,
        modelUsed: params.modelUsed,
        contextType: params.contextType,
        contextId: params.contextId,
        confidenceScore: params.confidenceScore,
        wasRetried: params.wasRetried ?? false,
      },
    });

    logger.debug('Voice transcription logged', {
      childId: params.childId,
      contextType: params.contextType,
      audioLengthMs: params.audioLengthMs,
    });
  },

  /**
   * Get transcription usage statistics for a child (parent visibility)
   */
  async getTranscriptionStats(childId: string, periodDays: number = 30): Promise<{
    totalTranscriptions: number;
    totalAudioMinutes: number;
    byContextType: Record<string, number>;
  }> {
    const since = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);

    const logs = await prisma.voiceTranscriptionLog.findMany({
      where: {
        childId,
        createdAt: { gte: since },
      },
      select: {
        audioLengthMs: true,
        contextType: true,
      },
    });

    const byContextType: Record<string, number> = {};
    let totalAudioMs = 0;

    for (const log of logs) {
      totalAudioMs += log.audioLengthMs;
      byContextType[log.contextType] = (byContextType[log.contextType] || 0) + 1;
    }

    return {
      totalTranscriptions: logs.length,
      totalAudioMinutes: Math.round(totalAudioMs / 60000 * 10) / 10, // Round to 1 decimal
      byContextType,
    };
  },

  /**
   * Enforce voice consent - throws if child doesn't have consent
   * Use this as a guard before processing voice input
   */
  async enforceVoiceConsent(childId: string): Promise<void> {
    const hasConsent = await this.hasVoiceConsent(childId);

    if (!hasConsent) {
      throw new ForbiddenError('Voice features require parental consent. Please ask a parent to enable voice input in settings.');
    }
  },

  /**
   * Cleanup expired consents (for scheduled job)
   */
  async cleanupExpiredConsents(): Promise<number> {
    const result = await prisma.voiceConsent.updateMany({
      where: {
        status: 'GRANTED',
        expiresAt: { lt: new Date() },
      },
      data: {
        status: 'EXPIRED',
      },
    });

    if (result.count > 0) {
      logger.info('Expired voice consents cleaned up', { count: result.count });
    }

    return result.count;
  },
};
