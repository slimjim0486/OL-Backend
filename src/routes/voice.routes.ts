// Voice Input Routes for Child STT
// COPPA-compliant: Audio processed in-memory only, never persisted
import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';
import { requireVoiceConsent, checkVoiceAvailability } from '../middleware/voiceAuth.js';
import { validateInput } from '../middleware/validateInput.js';
import { sttService } from '../services/ai/sttService.js';
import { voiceConsentService } from '../services/auth/voiceConsentService.js';
import { VoiceContextType } from '@prisma/client';
import { logger } from '../utils/logger.js';
import { ValidationError } from '../middleware/errorHandler.js';
import multer from 'multer';

const router = Router();

// Configure multer for in-memory audio upload (never touches disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max (roughly 2.5 min of audio)
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    if (sttService.validateAudioFormat(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ValidationError(
        `Unsupported audio format: ${file.mimetype}. Supported: ${sttService.getSupportedFormats().join(', ')}`
      ));
    }
  },
});

// ============================================
// SCHEMAS
// ============================================

const transcribeSchema = z.object({
  contextType: z.enum(['QUIZ_ANSWER', 'CHAT_MESSAGE', 'EXERCISE_ANSWER', 'FLASHCARD_RESPONSE']),
  contextId: z.string().optional(),
  language: z.enum(['en', 'ar']).optional(),
});

const quizAnswerSchema = z.object({
  quizId: z.string(),
  questionIndex: z.number().int().min(0),
  options: z.array(z.string()).min(2).max(6),
  language: z.enum(['en', 'ar']).optional(),
});

const matchAnswerSchema = z.object({
  contextType: z.enum(['QUIZ_ANSWER', 'EXERCISE_ANSWER', 'FLASHCARD_RESPONSE']),
  contextId: z.string().optional(),
  options: z.array(z.string()).min(2).max(10),
  language: z.enum(['en', 'ar']).optional(),
});

// ============================================
// ROUTES
// ============================================

/**
 * GET /api/voice/config
 * Get voice configuration for frontend (availability, supported formats)
 * No authentication required - used to show/hide voice UI
 */
router.get('/config', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: sttService.getConfig(),
  });
});

/**
 * GET /api/voice/consent-status
 * Check if current child has voice consent
 * Requires child authentication
 */
router.get(
  '/consent-status',
  authenticate,
  checkVoiceAvailability(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.child) {
        return res.json({
          success: true,
          data: {
            hasConsent: false,
            canUseVoice: false,
            serviceAvailable: sttService.isAvailable(),
            message: 'Voice features are only available for child sessions',
          },
        });
      }

      const consentInfo = await voiceConsentService.getVoiceConsentStatus(req.child.id);
      const serviceAvailable = sttService.isAvailable();

      res.json({
        success: true,
        data: {
          hasConsent: consentInfo.hasConsent,
          canUseVoice: consentInfo.hasConsent && serviceAvailable,
          status: consentInfo.status,
          expiresAt: consentInfo.expiresAt,
          serviceAvailable,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/voice/transcribe
 * Generic transcription endpoint
 * Requires child authentication and voice consent
 */
router.post(
  '/transcribe',
  authenticate,
  requireVoiceConsent(),
  upload.single('audio'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new ValidationError('No audio file provided');
      }

      if (!req.child) {
        throw new ValidationError('Child session required');
      }

      // Parse and validate body
      const bodyData = transcribeSchema.parse({
        contextType: req.body.contextType,
        contextId: req.body.contextId,
        language: req.body.language,
      });

      logger.debug('Voice transcription request', {
        childId: req.child.id,
        contextType: bodyData.contextType,
        audioSize: req.file.size,
        mimeType: req.file.mimetype,
      });

      const result = await sttService.transcribe(
        req.file.buffer,
        req.file.mimetype,
        {
          childId: req.child.id,
          ageGroup: req.child.ageGroup,
          contextType: bodyData.contextType as VoiceContextType,
          contextId: bodyData.contextId,
          language: bodyData.language,
        }
      );

      res.json({
        success: true,
        data: {
          text: result.text,
          confidence: result.confidence,
          durationMs: result.durationMs,
          language: result.language,
          // Include warning if confidence is low
          warning: result.confidence < 0.7
            ? 'Low confidence transcription. Please verify the text.'
            : undefined,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/voice/match-answer
 * Transcribe audio and match to provided options
 * For quizzes, exercises, flashcards
 */
router.post(
  '/match-answer',
  authenticate,
  requireVoiceConsent(),
  upload.single('audio'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new ValidationError('No audio file provided');
      }

      if (!req.child) {
        throw new ValidationError('Child session required');
      }

      // Parse body - options come as JSON string
      const options = JSON.parse(req.body.options || '[]');
      const bodyData = matchAnswerSchema.parse({
        contextType: req.body.contextType,
        contextId: req.body.contextId,
        options,
        language: req.body.language,
      });

      logger.debug('Voice match-answer request', {
        childId: req.child.id,
        contextType: bodyData.contextType,
        optionsCount: bodyData.options.length,
        audioSize: req.file.size,
      });

      const result = await sttService.transcribeAndMatch(
        req.file.buffer,
        req.file.mimetype,
        {
          childId: req.child.id,
          ageGroup: req.child.ageGroup,
          contextType: bodyData.contextType as VoiceContextType,
          contextId: bodyData.contextId,
          language: bodyData.language,
        },
        bodyData.options
      );

      const needsConfirmation = result.confidence < 0.8 || result.matchedIndex === -1;

      res.json({
        success: true,
        data: {
          matchedIndex: result.matchedIndex,
          matchedOption: result.matchedOption,
          confidence: result.confidence,
          transcribedText: result.transcribedText,
          needsConfirmation,
          message: result.matchedIndex === -1
            ? "I didn't quite catch that. Could you try again or type your answer?"
            : needsConfirmation
            ? `Did you say "${result.matchedOption}"?`
            : undefined,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/voice/quiz-answer
 * Convenience endpoint for quiz answers
 * Transcribes and matches to quiz options
 */
router.post(
  '/quiz-answer',
  authenticate,
  requireVoiceConsent(),
  upload.single('audio'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new ValidationError('No audio file provided');
      }

      if (!req.child) {
        throw new ValidationError('Child session required');
      }

      // Parse body
      const options = JSON.parse(req.body.options || '[]');
      const bodyData = quizAnswerSchema.parse({
        quizId: req.body.quizId,
        questionIndex: parseInt(req.body.questionIndex, 10),
        options,
        language: req.body.language,
      });

      logger.debug('Voice quiz-answer request', {
        childId: req.child.id,
        quizId: bodyData.quizId,
        questionIndex: bodyData.questionIndex,
        optionsCount: bodyData.options.length,
      });

      const result = await sttService.transcribeAndMatch(
        req.file.buffer,
        req.file.mimetype,
        {
          childId: req.child.id,
          ageGroup: req.child.ageGroup,
          contextType: 'QUIZ_ANSWER',
          contextId: `${bodyData.quizId}:${bodyData.questionIndex}`,
          language: bodyData.language,
        },
        bodyData.options
      );

      // Auto-select if high confidence, otherwise ask for confirmation
      const autoSelect = result.confidence >= 0.8 && result.matchedIndex !== -1;

      res.json({
        success: true,
        data: {
          matchedIndex: result.matchedIndex,
          matchedOption: result.matchedOption,
          confidence: result.confidence,
          transcribedText: result.transcribedText,
          autoSelect,
          message: result.matchedIndex === -1
            ? "I didn't understand that. Try saying 'A', 'B', 'C', or 'D', or the answer itself."
            : !autoSelect
            ? `I heard "${result.transcribedText}". Is your answer "${result.matchedOption}"?`
            : undefined,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/voice/chat
 * Transcribe for chat message to Ollie
 * Returns transcribed text for the chat input
 */
router.post(
  '/chat',
  authenticate,
  requireVoiceConsent(),
  upload.single('audio'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new ValidationError('No audio file provided');
      }

      if (!req.child) {
        throw new ValidationError('Child session required');
      }

      const lessonId = req.body.lessonId;
      const language = req.body.language as 'en' | 'ar' | undefined;

      logger.debug('Voice chat request', {
        childId: req.child.id,
        lessonId,
        audioSize: req.file.size,
      });

      const result = await sttService.transcribe(
        req.file.buffer,
        req.file.mimetype,
        {
          childId: req.child.id,
          ageGroup: req.child.ageGroup,
          contextType: 'CHAT_MESSAGE',
          contextId: lessonId,
          language,
        }
      );

      res.json({
        success: true,
        data: {
          text: result.text,
          confidence: result.confidence,
          durationMs: result.durationMs,
          language: result.language,
          // For chat, we return the text and let the frontend decide whether to send
          readyToSend: result.confidence >= 0.7 && result.text.length > 0,
          warning: result.confidence < 0.7
            ? 'Please check the text before sending.'
            : undefined,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
