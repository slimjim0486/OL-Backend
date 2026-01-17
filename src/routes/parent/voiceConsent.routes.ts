// Parent Voice Consent Routes
// COPPA-compliant: Parents control voice input permissions per child
import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate, requireParent } from '../../middleware/auth.js';
import { validateInput } from '../../middleware/validateInput.js';
import { voiceConsentService } from '../../services/auth/voiceConsentService.js';
import { sttService } from '../../services/ai/sttService.js';
import { logger } from '../../utils/logger.js';

const router = Router();

// ============================================
// SCHEMAS
// ============================================

const grantConsentSchema = z.object({
  acknowledgment: z.boolean().refine(val => val === true, {
    message: 'You must acknowledge the voice privacy notice',
  }),
});

// ============================================
// ROUTES
// ============================================

/**
 * GET /api/parent/voice-consent
 * Get voice consent status for all children
 */
router.get(
  '/',
  authenticate,
  requireParent,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parentId = req.parent!.id;
      const serviceAvailable = sttService.isAvailable();

      const children = await voiceConsentService.getChildrenVoiceConsentStatus(parentId);

      res.json({
        success: true,
        data: {
          serviceAvailable,
          children,
          privacyNotice: serviceAvailable ? PRIVACY_NOTICE : null,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/parent/voice-consent/:childId
 * Get voice consent status for a specific child
 */
router.get(
  '/:childId',
  authenticate,
  requireParent,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { childId } = req.params;

      const consentInfo = await voiceConsentService.getVoiceConsentStatus(childId);
      const serviceAvailable = sttService.isAvailable();

      res.json({
        success: true,
        data: {
          ...consentInfo,
          serviceAvailable,
          canUseVoice: consentInfo.hasConsent && serviceAvailable,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/parent/voice-consent/:childId
 * Grant voice consent for a child
 */
router.post(
  '/:childId',
  authenticate,
  requireParent,
  validateInput(grantConsentSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parentId = req.parent!.id;
      const { childId } = req.params;

      // Get client info for audit
      const ipAddress = req.ip || req.socket.remoteAddress || undefined;
      const userAgent = req.get('User-Agent');

      logger.info('Parent granting voice consent', {
        parentId,
        childId,
        ipAddress,
      });

      const result = await voiceConsentService.grantVoiceConsent(
        parentId,
        childId,
        ipAddress,
        userAgent
      );

      res.json({
        success: true,
        message: 'Voice input has been enabled for this child.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/parent/voice-consent/:childId
 * Revoke voice consent for a child
 */
router.delete(
  '/:childId',
  authenticate,
  requireParent,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parentId = req.parent!.id;
      const { childId } = req.params;

      logger.info('Parent revoking voice consent', {
        parentId,
        childId,
      });

      const result = await voiceConsentService.revokeVoiceConsent(parentId, childId);

      res.json({
        success: true,
        message: 'Voice input has been disabled for this child.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/parent/voice-consent/:childId/deny
 * Explicitly deny voice consent (parent declines)
 */
router.post(
  '/:childId/deny',
  authenticate,
  requireParent,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parentId = req.parent!.id;
      const { childId } = req.params;

      logger.info('Parent denying voice consent', {
        parentId,
        childId,
      });

      const result = await voiceConsentService.denyVoiceConsent(parentId, childId);

      res.json({
        success: true,
        message: 'Voice input has been declined for this child.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/parent/voice-consent/:childId/usage
 * Get voice usage statistics for a child (for parent visibility)
 */
router.get(
  '/:childId/usage',
  authenticate,
  requireParent,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { childId } = req.params;
      const periodDays = parseInt(req.query.days as string, 10) || 30;

      const stats = await voiceConsentService.getTranscriptionStats(childId, periodDays);

      res.json({
        success: true,
        data: {
          ...stats,
          periodDays,
          // Human-readable context type names
          usageByContext: Object.entries(stats.byContextType).map(([type, count]) => ({
            type,
            label: CONTEXT_TYPE_LABELS[type] || type,
            count,
          })),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// ============================================
// CONSTANTS
// ============================================

const PRIVACY_NOTICE = `
Voice Input Privacy Notice

How we handle your child's voice:
- Audio is processed in real-time and immediately deleted
- We never store or save audio recordings
- No voice profiles or biometric data is created
- Only the text transcript is used for learning activities
- Transcription is performed by a secure AI service

Consent details:
- Voice input is optional - your child can always type instead
- You can revoke consent at any time
- Consent automatically expires after 1 year
- Usage statistics are available in your parent dashboard

By enabling voice input, you confirm that you are the parent or legal guardian
of this child and consent to the processing of their voice for educational purposes.
`.trim();

const CONTEXT_TYPE_LABELS: Record<string, string> = {
  QUIZ_ANSWER: 'Quiz Answers',
  CHAT_MESSAGE: 'Chat with Ollie',
  EXERCISE_ANSWER: 'Exercise Answers',
  FLASHCARD_RESPONSE: 'Flashcard Responses',
};

export default router;
