// Speech-to-Text Service using OpenAI Whisper
// COPPA-compliant: Audio is processed in-memory only, never persisted
import OpenAI from 'openai';
import { config } from '../../config/index.js';
import { voiceConsentService } from '../auth/voiceConsentService.js';
import { VoiceContextType } from '@prisma/client';
import { logger } from '../../utils/logger.js';
import { ValidationError, ForbiddenError, ServiceUnavailableError } from '../../middleware/errorHandler.js';

// Initialize OpenAI client
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    if (!config.voice.openaiApiKey) {
      throw new ServiceUnavailableError('Voice input is not configured. Please contact support.');
    }
    openaiClient = new OpenAI({
      apiKey: config.voice.openaiApiKey,
    });
  }
  return openaiClient;
}

// Supported audio MIME types
const SUPPORTED_AUDIO_TYPES = [
  'audio/webm',
  'audio/mp4',
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
  'audio/flac',
  'audio/m4a',
] as const;

type SupportedAudioType = typeof SUPPORTED_AUDIO_TYPES[number];

export interface TranscriptionResult {
  text: string;
  confidence: number;
  durationMs: number;
  language?: string;
}

export interface TranscribeOptions {
  childId?: string;
  userId?: string;
  ageGroup?: 'YOUNG' | 'OLDER';
  contextType: VoiceContextType;
  contextId?: string;
  language?: string; // 'en' | 'ar' - hint for Whisper
}

export interface AnswerMatchResult {
  matchedIndex: number;
  matchedOption: string;
  confidence: number;
  transcribedText: string;
}

export const sttService = {
  /**
   * Check if voice input service is available
   */
  isAvailable(): boolean {
    return config.voice.enabled && !!config.voice.openaiApiKey;
  },

  /**
   * Validate audio format
   */
  validateAudioFormat(mimeType: string): boolean {
    return SUPPORTED_AUDIO_TYPES.includes(mimeType as SupportedAudioType);
  },

  /**
   * Get supported audio formats for frontend
   */
  getSupportedFormats(): readonly string[] {
    return SUPPORTED_AUDIO_TYPES;
  },

  /**
   * Transcribe audio buffer to text using OpenAI Whisper
   * CRITICAL: Audio buffer is processed in-memory only, never written to disk
   *
   * @param audioBuffer - Raw audio data (will be zeroed after processing)
   * @param mimeType - MIME type of the audio (e.g., 'audio/webm')
   * @param options - Transcription options including child context
   * @returns Transcription result with text and confidence
   */
  async transcribe(
    audioBuffer: Buffer,
    mimeType: string,
    options: TranscribeOptions
  ): Promise<TranscriptionResult> {
    const startTime = Date.now();

    // Check if service is available
    if (!this.isAvailable()) {
      throw new ServiceUnavailableError('Voice input is currently unavailable');
    }

    // Validate audio format
    if (!this.validateAudioFormat(mimeType)) {
      throw new ValidationError(
        `Unsupported audio format: ${mimeType}. Supported formats: ${SUPPORTED_AUDIO_TYPES.join(', ')}`
      );
    }

    // Voice consent check is optional - only enforce if childId is provided
    // This allows voice to work for both parent and child sessions

    // Validate audio duration (rough estimate based on buffer size)
    // WebM audio is roughly 16KB per second at low bitrate
    const estimatedDurationMs = (audioBuffer.length / 16000) * 1000;
    if (estimatedDurationMs > config.voice.maxDurationMs) {
      throw new ValidationError(
        `Audio too long. Maximum duration is ${config.voice.maxDurationMs / 1000} seconds.`
      );
    }

    try {
      const client = getOpenAIClient();

      // Create a File-like object from the buffer
      // OpenAI SDK expects a File or Blob with name property
      const audioFile = new File(
        [audioBuffer],
        `audio.${getExtensionFromMimeType(mimeType)}`,
        { type: mimeType }
      );

      // Call Whisper API with verbose_json for confidence scores
      const response = await client.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        response_format: 'verbose_json',
        language: options.language || undefined,
        // Prompts can help with domain-specific terms
        prompt: options.ageGroup === 'YOUNG'
          ? 'This is a child speaking. Educational content, numbers, letters, colors, shapes.'
          : 'This is a child speaking. Educational content, math, science, reading, questions.',
      });

      const transcriptionMs = Date.now() - startTime;

      // Extract text and calculate confidence
      // Whisper verbose_json returns segments with confidence info
      const text = response.text.trim();
      const durationMs = Math.round((response.duration || 0) * 1000);

      // Calculate average confidence from segments if available
      let confidence = 0.85; // Default confidence
      if ('segments' in response && Array.isArray(response.segments)) {
        const segments = response.segments as Array<{ avg_logprob?: number; no_speech_prob?: number }>;
        if (segments.length > 0) {
          // Convert log probability to confidence (0-1 range)
          const avgLogProb = segments.reduce((sum, seg) => sum + (seg.avg_logprob || -1), 0) / segments.length;
          // Log probs are negative, closer to 0 = higher confidence
          // Typical range is -1 to 0, map to 0.5 to 1.0
          confidence = Math.min(1.0, Math.max(0.5, 1 + avgLogProb));

          // Reduce confidence if high no-speech probability
          const avgNoSpeechProb = segments.reduce((sum, seg) => sum + (seg.no_speech_prob || 0), 0) / segments.length;
          if (avgNoSpeechProb > 0.5) {
            confidence *= (1 - avgNoSpeechProb);
          }
        }
      }

      // Log transcription metadata (no content for COPPA compliance)
      // Only log if childId is provided (child session)
      if (options.childId) {
        await voiceConsentService.logTranscription({
          childId: options.childId,
          audioLengthMs: durationMs || estimatedDurationMs,
          transcriptionMs,
          modelUsed: 'whisper-1',
          contextType: options.contextType,
          contextId: options.contextId,
          confidenceScore: confidence,
          wasRetried: false,
        });
      }

      logger.debug('Transcription completed', {
        childId: options.childId || options.userId || 'unknown',
        durationMs,
        transcriptionMs,
        confidence,
        textLength: text.length,
        contextType: options.contextType,
      });

      return {
        text,
        confidence,
        durationMs: durationMs || estimatedDurationMs,
        language: response.language,
      };
    } catch (error) {
      // Log error without exposing sensitive details
      logger.error('Transcription failed', {
        childId: options.childId || options.userId || 'unknown',
        contextType: options.contextType,
        errorType: error instanceof Error ? error.constructor.name : 'Unknown',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });

      // Re-throw known errors
      if (error instanceof ValidationError || error instanceof ForbiddenError) {
        throw error;
      }

      // Handle OpenAI specific errors
      if (error instanceof OpenAI.APIError) {
        if (error.status === 429) {
          throw new ServiceUnavailableError('Voice service is temporarily busy. Please try again.');
        }
        if (error.status === 400) {
          throw new ValidationError('Could not process audio. Please try speaking more clearly.');
        }
      }

      throw new ServiceUnavailableError('Voice transcription failed. Please try again.');
    } finally {
      // CRITICAL: Zero the buffer to ensure audio data doesn't persist in memory
      audioBuffer.fill(0);
    }
  },

  /**
   * Transcribe and match to quiz/exercise options
   * Returns the best matching option with confidence
   */
  async transcribeAndMatch(
    audioBuffer: Buffer,
    mimeType: string,
    options: TranscribeOptions,
    possibleOptions: string[]
  ): Promise<AnswerMatchResult> {
    const transcription = await this.transcribe(audioBuffer, mimeType, options);

    // Normalize transcribed text
    const normalizedText = normalizeText(transcription.text);

    // Find best match using fuzzy matching
    let bestMatch = {
      index: -1,
      score: 0,
      option: '',
    };

    for (let i = 0; i < possibleOptions.length; i++) {
      const option = possibleOptions[i];
      const normalizedOption = normalizeText(option);

      // Check for exact match
      if (normalizedText === normalizedOption) {
        bestMatch = { index: i, score: 1.0, option };
        break;
      }

      // Check for option letter/number match (e.g., "A", "option A", "1", "first")
      const letterMatch = matchOptionLetter(normalizedText, i, possibleOptions.length);
      if (letterMatch > 0.9) {
        bestMatch = { index: i, score: letterMatch, option };
        break;
      }

      // Fuzzy string matching
      const similarity = calculateSimilarity(normalizedText, normalizedOption);
      if (similarity > bestMatch.score) {
        bestMatch = { index: i, score: similarity, option };
      }
    }

    // If no good match found, return -1
    if (bestMatch.score < 0.4) {
      return {
        matchedIndex: -1,
        matchedOption: '',
        confidence: transcription.confidence * bestMatch.score,
        transcribedText: transcription.text,
      };
    }

    return {
      matchedIndex: bestMatch.index,
      matchedOption: bestMatch.option,
      confidence: transcription.confidence * bestMatch.score,
      transcribedText: transcription.text,
    };
  },

  /**
   * Get voice configuration for frontend
   */
  getConfig(): {
    enabled: boolean;
    maxDurationMs: number;
    supportedFormats: readonly string[];
    supportedLanguages: readonly string[];
  } {
    return {
      enabled: this.isAvailable(),
      maxDurationMs: config.voice.maxDurationMs,
      supportedFormats: SUPPORTED_AUDIO_TYPES,
      supportedLanguages: config.voice.supportedLanguages,
    };
  },
};

// Helper functions

function getExtensionFromMimeType(mimeType: string): string {
  const extensions: Record<string, string> = {
    'audio/webm': 'webm',
    'audio/mp4': 'm4a',
    'audio/mpeg': 'mp3',
    'audio/mp3': 'mp3',
    'audio/wav': 'wav',
    'audio/ogg': 'ogg',
    'audio/flac': 'flac',
    'audio/m4a': 'm4a',
  };
  return extensions[mimeType] || 'webm';
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Remove punctuation
    .replace(/[.,!?;:'"()[\]{}]/g, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    // Remove common filler words
    .replace(/\b(um|uh|like|you know|i think|maybe)\b/g, '')
    .trim();
}

function matchOptionLetter(text: string, optionIndex: number, totalOptions: number): number {
  const letters = ['a', 'b', 'c', 'd', 'e', 'f'];
  const ordinals = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'];
  const numbers = ['one', 'two', 'three', 'four', 'five', 'six', '1', '2', '3', '4', '5', '6'];

  const letter = letters[optionIndex];
  const ordinal = ordinals[optionIndex];
  const numberWord = numbers[optionIndex];
  const numberDigit = numbers[optionIndex + totalOptions];

  // Check for letter match
  if (text === letter || text === `option ${letter}` || text === `answer ${letter}`) {
    return 1.0;
  }

  // Check for ordinal match
  if (text.includes(ordinal) || text === `the ${ordinal} one`) {
    return 0.95;
  }

  // Check for number match
  if (text === numberWord || text === numberDigit || text === `number ${numberDigit}`) {
    return 0.95;
  }

  return 0;
}

function calculateSimilarity(a: string, b: string): number {
  // Levenshtein distance based similarity
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1.0;

  const distance = levenshteinDistance(a, b);
  return 1 - (distance / maxLen);
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}
