// Teacher Voice Routes — WebRTC realtime transcription + batch fallback
// No COPPA consent required (teachers are adults)
import { Router, Request, Response, NextFunction } from 'express';
import { authenticateTeacher } from '../../middleware/teacherAuth.js';
import { sttService } from '../../services/ai/sttService.js';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
import { ValidationError, ServiceUnavailableError } from '../../middleware/errorHandler.js';
import multer from 'multer';

const router = Router();

// All teacher voice routes require authentication
router.use(authenticateTeacher);

// Multer for batch fallback (in-memory only)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 }, // 10MB for longer teacher recordings
  fileFilter: (_req, file, cb) => {
    if (sttService.validateAudioFormat(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported audio format: ${file.mimetype}`));
    }
  },
});

/**
 * GET /api/teacher/voice/config
 * Returns voice availability and capabilities
 */
router.get('/config', (_req: Request, res: Response) => {
  const openaiKey = config.voice.openaiApiKey;
  res.json({
    success: true,
    data: {
      realtimeAvailable: !!openaiKey,
      batchAvailable: sttService.isAvailable(),
      maxDurationMs: config.voice.teacherMaxDurationMs,
      realtimeModel: config.voice.realtimeModel,
    },
  });
});

/**
 * POST /api/teacher/voice/session
 * Creates an ephemeral client secret from OpenAI for WebRTC.
 * The frontend uses this short-lived token to connect directly to OpenAI —
 * our server never touches audio data.
 */
router.post('/session', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const openaiKey = config.voice.openaiApiKey;
    if (!openaiKey) {
      throw new ServiceUnavailableError('Voice transcription is not configured');
    }

    const model = config.voice.realtimeModel;

    logger.info('Teacher voice session requested', {
      teacherId: (req as any).teacher?.id,
      model,
    });

    // Request an ephemeral client secret from OpenAI's transcription session endpoint
    const openaiResponse = await fetch(
      'https://api.openai.com/v1/realtime/transcription_sessions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input_audio_transcription: {
            model,
            language: 'en',
          },
          input_audio_noise_reduction: {
            type: 'near_field',
          },
          turn_detection: {
            type: 'server_vad',
            threshold: 0.5,
            prefix_padding_ms: 300,
            silence_duration_ms: 800,
          },
        }),
      }
    );

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text().catch(() => 'Unknown error');
      logger.error('OpenAI ephemeral token request failed', {
        status: openaiResponse.status,
        error: errorText.substring(0, 500),
      });

      if (openaiResponse.status === 429) {
        throw new ServiceUnavailableError('Voice service is temporarily busy. Please try again.');
      }
      throw new ServiceUnavailableError('Failed to create voice session');
    }

    const data: any = await openaiResponse.json();
    const clientSecret = data?.client_secret?.value;

    if (!clientSecret) {
      logger.error('OpenAI transcription session missing client secret', {
        responseSnippet: JSON.stringify(data).substring(0, 500),
      });
      throw new ServiceUnavailableError('Failed to create voice session');
    }

    // Return the ephemeral key (client_secret) to the frontend
    res.json({
      success: true,
      data: {
        clientSecret,
        expiresAt: data.client_secret?.expires_at ?? data.expires_at,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/teacher/voice/transcribe
 * Batch fallback — uses sttService.transcribe() without COPPA consent checks
 */
router.post(
  '/transcribe',
  upload.single('audio'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = (req as any).file;
      if (!file) {
        throw new ValidationError('No audio file provided');
      }

      const language = (req.body.language as string) || 'en';

      logger.debug('Teacher batch transcription request', {
        teacherId: (req as any).teacher?.id,
        audioSize: file.size,
        mimeType: file.mimetype,
      });

      const result = await sttService.transcribe(
        file.buffer,
        file.mimetype,
        {
          userId: (req as any).teacher?.id,
          contextType: 'CHAT_MESSAGE',
          language,
        }
      );

      res.json({
        success: true,
        data: {
          text: result.text,
          confidence: result.confidence,
          durationMs: result.durationMs,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
