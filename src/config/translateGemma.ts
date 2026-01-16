// TranslateGemma Configuration
// Open translation model by Google, built on Gemma 3 with support for 55 languages
// Released January 15, 2026 - https://blog.google/innovation-and-ai/technology/developers-tools/translategemma/
// Deployed via Vertex AI for integration with existing GCP project

import { logger } from '../utils/logger.js';

/**
 * TranslateGemma model sizes:
 * - 4B: Mobile/Edge deployment, on-device translation
 * - 12B: Best balance of quality and cost (recommended)
 * - 27B: Maximum quality, requires H100 GPU
 */
export type TranslateGemmaModel = 'translategemma-4b-it' | 'translategemma-12b-it' | 'translategemma-27b-it';

/**
 * Supported language codes for TranslateGemma
 * Focus on Gulf region markets + common educational languages
 */
export type SupportedLanguage = 'ar' | 'hi' | 'fr' | 'en' | 'es' | 'ur' | 'zh' | 'ja' | 'ko' | 'de' | 'it' | 'pt' | 'ru' | 'tr';

/**
 * TranslateGemma configuration
 * Uses existing GCP project 'eduk-6' for Vertex AI deployment
 */
export const TRANSLATE_GEMMA_CONFIG = {
  // GCP Project Configuration
  projectId: process.env.TRANSLATE_GEMMA_PROJECT_ID || 'eduk-6',
  location: process.env.TRANSLATE_GEMMA_LOCATION || 'us-central1',

  // Model Selection (12B recommended for best balance)
  model: (process.env.TRANSLATE_GEMMA_MODEL || 'translategemma-12b-it') as TranslateGemmaModel,

  // Vertex AI Endpoint (set after deployment)
  endpointId: process.env.TRANSLATE_GEMMA_ENDPOINT_ID,

  // Primary languages for Orbit Learn (Gulf region focus)
  primaryLanguages: ['ar', 'hi', 'fr', 'en'] as SupportedLanguage[],

  // All supported languages
  supportedLanguages: ['ar', 'hi', 'fr', 'en', 'es', 'ur', 'zh', 'ja', 'ko', 'de', 'it', 'pt', 'ru', 'tr'] as SupportedLanguage[],

  // Feature flag for gradual rollout
  enabled: process.env.ENABLE_TRANSLATE_GEMMA === 'true',

  // Caching configuration
  cache: {
    enabled: true,
    ttlSeconds: 3600, // 1 hour cache for translations
  },

  // Rate limiting
  rateLimit: {
    requestsPerMinute: 60,
    tokensPerMinute: 100000,
  },
} as const;

/**
 * Human-readable language names for UI display
 */
export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  ar: 'Arabic (العربية)',
  hi: 'Hindi (हिन्दी)',
  fr: 'French (Français)',
  en: 'English',
  es: 'Spanish (Español)',
  ur: 'Urdu (اردو)',
  zh: 'Chinese (中文)',
  ja: 'Japanese (日本語)',
  ko: 'Korean (한국어)',
  de: 'German (Deutsch)',
  it: 'Italian (Italiano)',
  pt: 'Portuguese (Português)',
  ru: 'Russian (Русский)',
  tr: 'Turkish (Türkçe)',
};

/**
 * Language names in English only (for API responses)
 */
export const LANGUAGE_NAMES_ENGLISH: Record<SupportedLanguage, string> = {
  ar: 'Arabic',
  hi: 'Hindi',
  fr: 'French',
  en: 'English',
  es: 'Spanish',
  ur: 'Urdu',
  zh: 'Chinese',
  ja: 'Japanese',
  ko: 'Korean',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  tr: 'Turkish',
};

/**
 * RTL (Right-to-Left) languages that need special handling in UI
 */
export const RTL_LANGUAGES: SupportedLanguage[] = ['ar', 'ur'];

/**
 * Check if a language code is supported
 */
export function isLanguageSupported(langCode: string): langCode is SupportedLanguage {
  return TRANSLATE_GEMMA_CONFIG.supportedLanguages.includes(langCode as SupportedLanguage);
}

/**
 * Check if a language is RTL
 */
export function isRTL(langCode: string): boolean {
  return RTL_LANGUAGES.includes(langCode as SupportedLanguage);
}

/**
 * Get language display name
 */
export function getLanguageName(langCode: string, includeNative = true): string {
  if (!isLanguageSupported(langCode)) {
    return langCode;
  }
  return includeNative ? LANGUAGE_NAMES[langCode] : LANGUAGE_NAMES_ENGLISH[langCode];
}

/**
 * Validate TranslateGemma configuration
 * Returns true if all required config is present for Vertex AI deployment
 */
export function validateTranslateGemmaConfig(): boolean {
  if (!TRANSLATE_GEMMA_CONFIG.enabled) {
    logger.info('TranslateGemma is disabled via feature flag');
    return false;
  }

  if (!TRANSLATE_GEMMA_CONFIG.endpointId) {
    logger.warn('TranslateGemma endpoint ID not configured - will fall back to Google Translate');
    return false;
  }

  if (!TRANSLATE_GEMMA_CONFIG.projectId) {
    logger.warn('TranslateGemma project ID not configured');
    return false;
  }

  return true;
}

/**
 * Get the Vertex AI endpoint URL for TranslateGemma
 */
export function getVertexAIEndpoint(): string {
  const { projectId, location, endpointId } = TRANSLATE_GEMMA_CONFIG;
  return `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/endpoints/${endpointId}:predict`;
}

/**
 * Model capabilities and recommendations
 */
export const MODEL_INFO: Record<TranslateGemmaModel, {
  description: string;
  recommendedFor: string;
  approximateCost: string;
}> = {
  'translategemma-4b-it': {
    description: '4 billion parameter model - fastest, mobile-friendly',
    recommendedFor: 'On-device translation, low-latency requirements',
    approximateCost: 'Lowest cost per request',
  },
  'translategemma-12b-it': {
    description: '12 billion parameter model - best balance of quality and speed',
    recommendedFor: 'Production API translation, parent communications',
    approximateCost: 'Moderate cost per request',
  },
  'translategemma-27b-it': {
    description: '27 billion parameter model - highest quality',
    recommendedFor: 'Complex educational content, formal documents',
    approximateCost: 'Higher cost per request',
  },
};
