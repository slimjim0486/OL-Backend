// TranslateGemma Service
// Provides translation via TranslateGemma model deployed on Vertex AI
// Falls back to Google Translate API when TranslateGemma is unavailable

import { GoogleAuth } from 'google-auth-library';
import {
  TRANSLATE_GEMMA_CONFIG,
  getVertexAIEndpoint,
  validateTranslateGemmaConfig,
  isLanguageSupported,
  SupportedLanguage,
} from '../../config/translateGemma.js';
import { logger } from '../../utils/logger.js';

/**
 * Translation request interface
 */
export interface TranslationRequest {
  text: string;
  targetLanguage: SupportedLanguage;
  sourceLanguage?: SupportedLanguage; // Optional, auto-detect if not provided
}

/**
 * Translation response interface
 */
export interface TranslationResponse {
  translatedText: string;
  detectedSourceLanguage?: string;
  model: 'translategemma' | 'google-translate';
  cached: boolean;
}

/**
 * Batch translation request
 */
export interface BatchTranslationRequest {
  texts: string[];
  targetLanguage: SupportedLanguage;
  sourceLanguage?: SupportedLanguage;
}

/**
 * Simple in-memory cache for translations
 * Key format: `${sourceText}:${sourceLang}:${targetLang}`
 */
interface CacheEntry {
  translatedText: string;
  timestamp: number;
}

class TranslationCache {
  private cache: Map<string, CacheEntry> = new Map();
  private ttlMs: number;

  constructor(ttlSeconds: number) {
    this.ttlMs = ttlSeconds * 1000;
  }

  private makeKey(text: string, sourceLang: string, targetLang: string): string {
    // Use first 100 chars of text to keep keys reasonable
    const textKey = text.length > 100 ? text.substring(0, 100) : text;
    return `${textKey}:${sourceLang}:${targetLang}`;
  }

  get(text: string, sourceLang: string, targetLang: string): string | null {
    const key = this.makeKey(text, sourceLang, targetLang);
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > this.ttlMs) {
      this.cache.delete(key);
      return null;
    }

    return entry.translatedText;
  }

  set(text: string, sourceLang: string, targetLang: string, translatedText: string): void {
    const key = this.makeKey(text, sourceLang, targetLang);
    this.cache.set(key, {
      translatedText,
      timestamp: Date.now(),
    });

    // Simple cleanup: if cache gets too big, remove oldest entries
    if (this.cache.size > 1000) {
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      // Remove oldest 100 entries
      for (let i = 0; i < 100; i++) {
        this.cache.delete(entries[i][0]);
      }
    }
  }
}

/**
 * TranslateGemma Service
 * Singleton service for translation using TranslateGemma via Vertex AI
 */
export class TranslateGemmaService {
  private auth: GoogleAuth | null = null;
  private cache: TranslationCache;
  private isConfigured: boolean;

  constructor() {
    this.cache = new TranslationCache(TRANSLATE_GEMMA_CONFIG.cache.ttlSeconds);
    this.isConfigured = validateTranslateGemmaConfig();

    if (this.isConfigured) {
      this.initializeAuth();
    }
  }

  /**
   * Initialize Google Auth for Vertex AI
   */
  private initializeAuth(): void {
    try {
      // Check for base64-encoded credentials in env var (production)
      const credentialsJson = process.env.GOOGLE_CREDENTIALS_JSON;

      if (credentialsJson) {
        const decodedCredentials = Buffer.from(credentialsJson, 'base64').toString('utf-8');
        const credentials = JSON.parse(decodedCredentials);

        this.auth = new GoogleAuth({
          credentials: {
            client_email: credentials.client_email,
            private_key: credentials.private_key,
          },
          projectId: credentials.project_id,
          scopes: ['https://www.googleapis.com/auth/cloud-platform'],
        });

        logger.info('TranslateGemma auth initialized with GOOGLE_CREDENTIALS_JSON');
      } else {
        // Fall back to default credentials (GOOGLE_APPLICATION_CREDENTIALS file)
        this.auth = new GoogleAuth({
          scopes: ['https://www.googleapis.com/auth/cloud-platform'],
        });

        logger.info('TranslateGemma auth initialized with default credentials');
      }
    } catch (error) {
      logger.error('Failed to initialize TranslateGemma auth', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      this.isConfigured = false;
    }
  }

  /**
   * Check if TranslateGemma is available
   */
  isAvailable(): boolean {
    return this.isConfigured && this.auth !== null;
  }

  /**
   * Translate text using TranslateGemma
   * @returns Translation result or null if TranslateGemma unavailable
   */
  async translate(request: TranslationRequest): Promise<TranslationResponse | null> {
    const { text, targetLanguage, sourceLanguage } = request;

    // Validate languages
    if (!isLanguageSupported(targetLanguage)) {
      logger.warn('Unsupported target language for TranslateGemma', { targetLanguage });
      return null;
    }

    if (sourceLanguage && !isLanguageSupported(sourceLanguage)) {
      logger.warn('Unsupported source language for TranslateGemma', { sourceLanguage });
      return null;
    }

    // Check cache first
    const cachedResult = this.cache.get(text, sourceLanguage || 'auto', targetLanguage);
    if (cachedResult) {
      logger.debug('Translation cache hit', { textLength: text.length, targetLanguage });
      return {
        translatedText: cachedResult,
        model: 'translategemma',
        cached: true,
      };
    }

    // Check if TranslateGemma is available
    if (!this.isAvailable()) {
      logger.debug('TranslateGemma not available, returning null');
      return null;
    }

    try {
      const translatedText = await this.callVertexAI(text, targetLanguage, sourceLanguage);

      // Cache the result
      this.cache.set(text, sourceLanguage || 'auto', targetLanguage, translatedText);

      return {
        translatedText,
        detectedSourceLanguage: sourceLanguage,
        model: 'translategemma',
        cached: false,
      };
    } catch (error) {
      logger.error('TranslateGemma translation failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        textLength: text.length,
        targetLanguage,
      });
      return null;
    }
  }

  /**
   * Translate multiple texts in batch
   * More efficient for multiple translations to the same target language
   */
  async translateBatch(request: BatchTranslationRequest): Promise<TranslationResponse[] | null> {
    const { texts, targetLanguage, sourceLanguage } = request;

    if (!this.isAvailable()) {
      return null;
    }

    const results: TranslationResponse[] = [];

    for (const text of texts) {
      const result = await this.translate({
        text,
        targetLanguage,
        sourceLanguage,
      });

      if (result) {
        results.push(result);
      } else {
        // If any translation fails, return null to trigger fallback
        return null;
      }
    }

    return results;
  }

  /**
   * Detect the language of text
   * Uses TranslateGemma's detection capability
   */
  async detectLanguage(text: string): Promise<SupportedLanguage | null> {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const prompt = `Detect the language of the following text and respond with only the ISO 639-1 language code (e.g., 'en', 'ar', 'hi', 'fr').

Text: "${text.substring(0, 500)}"

Language code:`;

      const result = await this.callVertexAIRaw(prompt);
      const langCode = result.trim().toLowerCase().substring(0, 2);

      if (isLanguageSupported(langCode)) {
        return langCode;
      }

      return null;
    } catch (error) {
      logger.error('Language detection failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }

  /**
   * Call Vertex AI endpoint for translation
   */
  private async callVertexAI(
    text: string,
    targetLanguage: string,
    sourceLanguage?: string
  ): Promise<string> {
    // Build the translation prompt
    // TranslateGemma uses a specific prompt format for best results
    const sourceSpec = sourceLanguage ? `from ${sourceLanguage} ` : '';
    const prompt = `Translate the following text ${sourceSpec}to ${targetLanguage}. Return only the translation, nothing else.

Text: ${text}

Translation:`;

    return this.callVertexAIRaw(prompt);
  }

  /**
   * Raw call to Vertex AI endpoint
   */
  private async callVertexAIRaw(prompt: string): Promise<string> {
    if (!this.auth) {
      throw new Error('TranslateGemma auth not initialized');
    }

    const endpoint = getVertexAIEndpoint();
    const client = await this.auth.getClient();
    const accessToken = await client.getAccessToken();

    if (!accessToken.token) {
      throw new Error('Failed to get access token for Vertex AI');
    }

    const requestBody = {
      instances: [
        {
          prompt,
        },
      ],
      parameters: {
        temperature: 0.1, // Low temperature for consistent translations
        maxOutputTokens: 2048,
        topP: 0.95,
        topK: 40,
      },
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Vertex AI request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json() as {
      predictions?: Array<{
        content?: string;
        candidates?: Array<{ content?: string }>;
      }>;
    };

    // Extract translation from response
    // Vertex AI response format varies by model, handle multiple formats
    const prediction = data.predictions?.[0];
    if (prediction?.content) {
      return prediction.content.trim();
    }
    if (prediction?.candidates?.[0]?.content) {
      return prediction.candidates[0].content.trim();
    }

    throw new Error('Unexpected Vertex AI response format');
  }
}

// Export singleton instance
export const translateGemmaService = new TranslateGemmaService();
