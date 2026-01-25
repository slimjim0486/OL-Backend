/**
 * Standards Cache Service
 * Redis-based caching for curriculum standards
 *
 * Purpose:
 * - Cache curriculum standards to avoid repeated DB queries during lesson/quiz generation
 * - Pre-build AI prompt context strings for token efficiency
 * - Standards rarely change (yearly curriculum updates), so aggressive caching is safe
 *
 * Cache Keys:
 * - standards:raw:{curriculum}:{subject}:{grade} → Full standards array
 * - standards:adjacent:{curriculum}:{subject}:{grade} → Standards with adjacent grades (±1)
 * - standards:ai:{curriculum}:{subject}:{grade} → Pre-formatted AI prompt string
 * - standards:strands:{curriculum}:{subject}:{grade} → Available strands list
 * - standards:meta:last_invalidation → Timestamp of last cache clear
 *
 * Error Handling:
 * - All operations gracefully fallback on Redis errors
 * - Errors are logged but never thrown to callers
 * - Returns null on cache miss or error, allowing DB fallback
 *
 * @module standardsCache
 */

import { redis } from '../../config/redis.js';
import { logger } from '../../utils/logger.js';
import { Subject, CurriculumType } from '@prisma/client';

// ============================================
// Type Definitions
// ============================================

/**
 * Cached standard record - matches StandardWithContext from curriculumService
 * Stored as JSON in Redis
 */
export interface CachedStandard {
  id: string;
  notation: string | null;
  description: string;
  strand: string | null;
  shortDescription: string | null;
  isStatutory: boolean;
  standardSet: {
    title: string;
    subject: Subject;
    gradeLevel: number | null;
    keyStage: number | null;
  };
}

/**
 * Pre-built AI context for prompts
 * Includes both formatted string and metadata
 */
export interface CachedAIContext {
  /** Pre-formatted standards string ready for AI prompts */
  formattedText: string;
  /** Number of standards included */
  standardCount: number;
  /** Strands covered */
  strands: string[];
  /** When this context was built */
  builtAt: string;
  /** Curriculum type used */
  curriculumType: CurriculumType;
  /** Subject */
  subject: Subject;
  /** Grade level */
  gradeLevel: number;
}

/**
 * Cache operation result for diagnostics
 */
export interface CacheOperationResult {
  success: boolean;
  fromCache: boolean;
  key?: string;
  error?: string;
}

// ============================================
// Constants
// ============================================

/** Cache key prefixes - namespaced to avoid collisions */
const CACHE_PREFIX = {
  RAW: 'standards:raw:',
  ADJACENT: 'standards:adjacent:',
  AI_CONTEXT: 'standards:ai:',
  STRANDS: 'standards:strands:',
  META: 'standards:meta:',
} as const;

/**
 * Cache TTL in seconds
 * Standards change rarely (curriculum updates are annual)
 * 24 hours provides good balance of freshness and performance
 */
const CACHE_TTL = {
  /** Raw standards array - 24 hours */
  RAW: 86400,
  /** Adjacent grades standards - 24 hours */
  ADJACENT: 86400,
  /** Pre-built AI context - 24 hours */
  AI_CONTEXT: 86400,
  /** Strands list - 24 hours */
  STRANDS: 86400,
} as const;

/** Maximum standards to include in AI context to avoid token overflow */
const MAX_STANDARDS_FOR_AI_CONTEXT = 100;

// ============================================
// Cache Key Builders
// ============================================

/**
 * Build a cache key for raw standards
 * @param curriculumType - e.g., 'BRITISH', 'AMERICAN'
 * @param subject - e.g., 'MATH', 'SCIENCE'
 * @param gradeLevel - e.g., 5
 */
function buildRawKey(curriculumType: CurriculumType, subject: Subject, gradeLevel: number): string {
  return `${CACHE_PREFIX.RAW}${curriculumType}:${subject}:${gradeLevel}`;
}

/**
 * Build a cache key for adjacent grades standards
 */
function buildAdjacentKey(curriculumType: CurriculumType, subject: Subject, gradeLevel: number): string {
  return `${CACHE_PREFIX.ADJACENT}${curriculumType}:${subject}:${gradeLevel}`;
}

/**
 * Build a cache key for AI context
 */
function buildAIContextKey(curriculumType: CurriculumType, subject: Subject, gradeLevel: number): string {
  return `${CACHE_PREFIX.AI_CONTEXT}${curriculumType}:${subject}:${gradeLevel}`;
}

/**
 * Build a cache key for strands
 */
function buildStrandsKey(curriculumType: CurriculumType, subject: Subject, gradeLevel: number): string {
  return `${CACHE_PREFIX.STRANDS}${curriculumType}:${subject}:${gradeLevel}`;
}

// ============================================
// AI Context Builder
// ============================================

/**
 * Build a pre-formatted AI context string from standards
 * This is the format used by alignmentService.formatStandardsForPrompt
 *
 * @param standards - Array of cached standards
 * @param curriculumType - Curriculum type for context
 * @param subject - Subject for context
 * @param gradeLevel - Grade level for context
 */
function buildAIContextFromStandards(
  standards: CachedStandard[],
  curriculumType: CurriculumType,
  subject: Subject,
  gradeLevel: number
): CachedAIContext {
  // Group standards by strand
  const standardsByStrand: Record<string, CachedStandard[]> = {};
  const strandsSet = new Set<string>();

  for (const standard of standards) {
    const strand = standard.strand || 'General';
    strandsSet.add(strand);
    if (!standardsByStrand[strand]) {
      standardsByStrand[strand] = [];
    }
    standardsByStrand[strand].push(standard);
  }

  // Build formatted text (matching alignmentService format)
  const lines: string[] = [];
  let count = 0;

  for (const [strand, strandStandards] of Object.entries(standardsByStrand)) {
    if (count >= MAX_STANDARDS_FOR_AI_CONTEXT) break;

    lines.push(`\n### ${strand}`);

    for (const standard of strandStandards) {
      if (count >= MAX_STANDARDS_FOR_AI_CONTEXT) break;

      const gradeNote = standard.standardSet.gradeLevel
        ? ` (Year ${standard.standardSet.gradeLevel})`
        : '';
      lines.push(`- ${standard.notation}${gradeNote}: ${standard.description}`);
      count++;
    }
  }

  return {
    formattedText: lines.join('\n'),
    standardCount: Math.min(standards.length, MAX_STANDARDS_FOR_AI_CONTEXT),
    strands: Array.from(strandsSet),
    builtAt: new Date().toISOString(),
    curriculumType,
    subject,
    gradeLevel,
  };
}

// ============================================
// Cache Operations - Read
// ============================================

/**
 * Get cached raw standards for a specific grade
 *
 * @param curriculumType - Curriculum type
 * @param subject - Subject
 * @param gradeLevel - Grade level
 * @returns Cached standards array or null if not cached/error
 */
async function getRawStandards(
  curriculumType: CurriculumType,
  subject: Subject,
  gradeLevel: number
): Promise<CachedStandard[] | null> {
  const key = buildRawKey(curriculumType, subject, gradeLevel);

  try {
    const cached = await redis.get(key);

    if (cached) {
      const parsed = JSON.parse(cached) as CachedStandard[];

      logger.debug('Standards cache HIT', {
        key,
        count: parsed.length,
        curriculumType,
        subject,
        gradeLevel,
      });

      return parsed;
    }

    logger.debug('Standards cache MISS', {
      key,
      curriculumType,
      subject,
      gradeLevel,
    });

    return null;
  } catch (error) {
    // Log error but don't throw - allow DB fallback
    logger.error('Standards cache read error', {
      key,
      error: error instanceof Error ? error.message : 'Unknown error',
      curriculumType,
      subject,
      gradeLevel,
    });
    return null;
  }
}

/**
 * Get cached standards with adjacent grades (grade ± 1)
 *
 * @param curriculumType - Curriculum type
 * @param subject - Subject
 * @param gradeLevel - Center grade level
 * @returns Cached standards array or null if not cached/error
 */
async function getAdjacentStandards(
  curriculumType: CurriculumType,
  subject: Subject,
  gradeLevel: number
): Promise<CachedStandard[] | null> {
  const key = buildAdjacentKey(curriculumType, subject, gradeLevel);

  try {
    const cached = await redis.get(key);

    if (cached) {
      const parsed = JSON.parse(cached) as CachedStandard[];

      logger.debug('Adjacent standards cache HIT', {
        key,
        count: parsed.length,
        curriculumType,
        subject,
        gradeLevel,
      });

      return parsed;
    }

    logger.debug('Adjacent standards cache MISS', { key });
    return null;
  } catch (error) {
    logger.error('Adjacent standards cache read error', {
      key,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return null;
  }
}

/**
 * Get cached AI context for lesson/quiz generation
 *
 * @param curriculumType - Curriculum type
 * @param subject - Subject
 * @param gradeLevel - Grade level
 * @returns Cached AI context or null if not cached/error
 */
async function getAIContext(
  curriculumType: CurriculumType,
  subject: Subject,
  gradeLevel: number
): Promise<CachedAIContext | null> {
  const key = buildAIContextKey(curriculumType, subject, gradeLevel);

  try {
    const cached = await redis.get(key);

    if (cached) {
      const parsed = JSON.parse(cached) as CachedAIContext;

      logger.debug('AI context cache HIT', {
        key,
        standardCount: parsed.standardCount,
        strands: parsed.strands.length,
      });

      return parsed;
    }

    logger.debug('AI context cache MISS', { key });
    return null;
  } catch (error) {
    logger.error('AI context cache read error', {
      key,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return null;
  }
}

/**
 * Get cached strands list
 *
 * @param curriculumType - Curriculum type
 * @param subject - Subject
 * @param gradeLevel - Grade level
 * @returns Cached strands array or null if not cached/error
 */
async function getStrands(
  curriculumType: CurriculumType,
  subject: Subject,
  gradeLevel: number
): Promise<string[] | null> {
  const key = buildStrandsKey(curriculumType, subject, gradeLevel);

  try {
    const cached = await redis.get(key);

    if (cached) {
      const parsed = JSON.parse(cached) as string[];

      logger.debug('Strands cache HIT', {
        key,
        count: parsed.length,
      });

      return parsed;
    }

    logger.debug('Strands cache MISS', { key });
    return null;
  } catch (error) {
    logger.error('Strands cache read error', {
      key,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return null;
  }
}

// ============================================
// Cache Operations - Write
// ============================================

/**
 * Cache raw standards for a specific grade
 * Also builds and caches the AI context
 *
 * @param curriculumType - Curriculum type
 * @param subject - Subject
 * @param gradeLevel - Grade level
 * @param standards - Standards to cache
 */
async function setRawStandards(
  curriculumType: CurriculumType,
  subject: Subject,
  gradeLevel: number,
  standards: CachedStandard[]
): Promise<void> {
  const key = buildRawKey(curriculumType, subject, gradeLevel);

  try {
    // Cache raw standards
    await redis.setex(key, CACHE_TTL.RAW, JSON.stringify(standards));

    logger.info('Cached raw standards', {
      key,
      count: standards.length,
      ttlSeconds: CACHE_TTL.RAW,
    });

    // Also build and cache AI context
    const aiContext = buildAIContextFromStandards(standards, curriculumType, subject, gradeLevel);
    const aiKey = buildAIContextKey(curriculumType, subject, gradeLevel);
    await redis.setex(aiKey, CACHE_TTL.AI_CONTEXT, JSON.stringify(aiContext));

    logger.info('Cached AI context', {
      key: aiKey,
      standardCount: aiContext.standardCount,
      strands: aiContext.strands.length,
    });

    // Also cache strands list
    const strandsKey = buildStrandsKey(curriculumType, subject, gradeLevel);
    await redis.setex(strandsKey, CACHE_TTL.STRANDS, JSON.stringify(aiContext.strands));
  } catch (error) {
    // Log error but don't throw - caching failure is non-fatal
    logger.error('Failed to cache raw standards', {
      key,
      error: error instanceof Error ? error.message : 'Unknown error',
      standardCount: standards.length,
    });
  }
}

/**
 * Cache standards with adjacent grades
 *
 * @param curriculumType - Curriculum type
 * @param subject - Subject
 * @param gradeLevel - Center grade level
 * @param standards - Standards to cache (includes grades gradeLevel-1, gradeLevel, gradeLevel+1)
 */
async function setAdjacentStandards(
  curriculumType: CurriculumType,
  subject: Subject,
  gradeLevel: number,
  standards: CachedStandard[]
): Promise<void> {
  const key = buildAdjacentKey(curriculumType, subject, gradeLevel);

  try {
    await redis.setex(key, CACHE_TTL.ADJACENT, JSON.stringify(standards));

    logger.info('Cached adjacent standards', {
      key,
      count: standards.length,
      ttlSeconds: CACHE_TTL.ADJACENT,
    });
  } catch (error) {
    logger.error('Failed to cache adjacent standards', {
      key,
      error: error instanceof Error ? error.message : 'Unknown error',
      standardCount: standards.length,
    });
  }
}

/**
 * Cache strands list
 *
 * @param curriculumType - Curriculum type
 * @param subject - Subject
 * @param gradeLevel - Grade level
 * @param strands - Strands to cache
 */
async function setStrands(
  curriculumType: CurriculumType,
  subject: Subject,
  gradeLevel: number,
  strands: string[]
): Promise<void> {
  const key = buildStrandsKey(curriculumType, subject, gradeLevel);

  try {
    await redis.setex(key, CACHE_TTL.STRANDS, JSON.stringify(strands));

    logger.debug('Cached strands', {
      key,
      count: strands.length,
    });
  } catch (error) {
    logger.error('Failed to cache strands', {
      key,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

// ============================================
// Cache Operations - Invalidation
// ============================================

/**
 * Invalidate all cached standards for a specific curriculum/subject/grade
 *
 * @param curriculumType - Curriculum type
 * @param subject - Subject
 * @param gradeLevel - Grade level
 */
async function invalidateGrade(
  curriculumType: CurriculumType,
  subject: Subject,
  gradeLevel: number
): Promise<void> {
  const keys = [
    buildRawKey(curriculumType, subject, gradeLevel),
    buildAdjacentKey(curriculumType, subject, gradeLevel),
    buildAIContextKey(curriculumType, subject, gradeLevel),
    buildStrandsKey(curriculumType, subject, gradeLevel),
  ];

  // Also invalidate adjacent grade's adjacent cache (since it includes this grade)
  keys.push(buildAdjacentKey(curriculumType, subject, gradeLevel - 1));
  keys.push(buildAdjacentKey(curriculumType, subject, gradeLevel + 1));

  try {
    const deleted = await redis.del(...keys);

    logger.info('Invalidated grade cache', {
      curriculumType,
      subject,
      gradeLevel,
      keysDeleted: deleted,
    });
  } catch (error) {
    logger.error('Failed to invalidate grade cache', {
      curriculumType,
      subject,
      gradeLevel,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Invalidate all cached standards for a curriculum
 * Use when curriculum standards are bulk-updated
 *
 * @param curriculumType - Curriculum type to invalidate
 */
async function invalidateCurriculum(curriculumType: CurriculumType): Promise<void> {
  try {
    // Use SCAN to find all keys for this curriculum (safer than KEYS in production)
    const patterns = [
      `${CACHE_PREFIX.RAW}${curriculumType}:*`,
      `${CACHE_PREFIX.ADJACENT}${curriculumType}:*`,
      `${CACHE_PREFIX.AI_CONTEXT}${curriculumType}:*`,
      `${CACHE_PREFIX.STRANDS}${curriculumType}:*`,
    ];

    let totalDeleted = 0;

    for (const pattern of patterns) {
      const keys = await scanKeys(pattern);
      if (keys.length > 0) {
        const deleted = await redis.del(...keys);
        totalDeleted += deleted;
      }
    }

    // Record invalidation timestamp
    await redis.set(
      `${CACHE_PREFIX.META}last_invalidation`,
      JSON.stringify({
        curriculumType,
        timestamp: new Date().toISOString(),
        keysDeleted: totalDeleted,
      })
    );

    logger.info('Invalidated curriculum cache', {
      curriculumType,
      totalKeysDeleted: totalDeleted,
    });
  } catch (error) {
    logger.error('Failed to invalidate curriculum cache', {
      curriculumType,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Invalidate ALL standards cache
 * Use sparingly - only for major database migrations or reseeding
 */
async function invalidateAll(): Promise<void> {
  try {
    const patterns = [
      `${CACHE_PREFIX.RAW}*`,
      `${CACHE_PREFIX.ADJACENT}*`,
      `${CACHE_PREFIX.AI_CONTEXT}*`,
      `${CACHE_PREFIX.STRANDS}*`,
    ];

    let totalDeleted = 0;

    for (const pattern of patterns) {
      const keys = await scanKeys(pattern);
      if (keys.length > 0) {
        const deleted = await redis.del(...keys);
        totalDeleted += deleted;
      }
    }

    // Record invalidation timestamp
    await redis.set(
      `${CACHE_PREFIX.META}last_invalidation`,
      JSON.stringify({
        curriculumType: 'ALL',
        timestamp: new Date().toISOString(),
        keysDeleted: totalDeleted,
      })
    );

    logger.warn('Invalidated ALL standards cache', {
      totalKeysDeleted: totalDeleted,
    });
  } catch (error) {
    logger.error('Failed to invalidate all standards cache', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

// ============================================
// Utility Functions
// ============================================

/**
 * Scan for keys matching pattern using SCAN (production-safe)
 * KEYS command can block Redis, SCAN is incremental
 *
 * @param pattern - Redis key pattern
 * @returns Array of matching keys
 */
async function scanKeys(pattern: string): Promise<string[]> {
  const keys: string[] = [];
  let cursor = '0';

  try {
    do {
      const [nextCursor, foundKeys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
      cursor = nextCursor;
      keys.push(...foundKeys);
    } while (cursor !== '0');
  } catch (error) {
    logger.error('Redis SCAN failed', {
      pattern,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  return keys;
}

/**
 * Get cache statistics for monitoring
 * Returns counts of cached items by type
 */
async function getCacheStats(): Promise<{
  rawCount: number;
  adjacentCount: number;
  aiContextCount: number;
  strandsCount: number;
  lastInvalidation: string | null;
}> {
  try {
    const [rawKeys, adjacentKeys, aiKeys, strandsKeys, lastInvalidation] = await Promise.all([
      scanKeys(`${CACHE_PREFIX.RAW}*`),
      scanKeys(`${CACHE_PREFIX.ADJACENT}*`),
      scanKeys(`${CACHE_PREFIX.AI_CONTEXT}*`),
      scanKeys(`${CACHE_PREFIX.STRANDS}*`),
      redis.get(`${CACHE_PREFIX.META}last_invalidation`),
    ]);

    return {
      rawCount: rawKeys.length,
      adjacentCount: adjacentKeys.length,
      aiContextCount: aiKeys.length,
      strandsCount: strandsKeys.length,
      lastInvalidation,
    };
  } catch (error) {
    logger.error('Failed to get cache stats', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return {
      rawCount: 0,
      adjacentCount: 0,
      aiContextCount: 0,
      strandsCount: 0,
      lastInvalidation: null,
    };
  }
}

/**
 * Warm cache for a specific curriculum, subject, and grade range
 * Useful for pre-loading commonly accessed standards
 *
 * @param curriculumType - Curriculum type
 * @param subject - Subject
 * @param gradeRange - Array of grade levels to warm
 * @param fetchFn - Function to fetch standards from DB
 */
async function warmCache(
  curriculumType: CurriculumType,
  subject: Subject,
  gradeRange: number[],
  fetchFn: (grade: number) => Promise<CachedStandard[]>
): Promise<{ warmed: number; failed: number }> {
  let warmed = 0;
  let failed = 0;

  for (const grade of gradeRange) {
    try {
      const standards = await fetchFn(grade);
      await setRawStandards(curriculumType, subject, grade, standards);
      warmed++;
    } catch (error) {
      logger.error('Cache warm failed for grade', {
        curriculumType,
        subject,
        grade,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      failed++;
    }
  }

  logger.info('Cache warm completed', {
    curriculumType,
    subject,
    gradeRange,
    warmed,
    failed,
  });

  return { warmed, failed };
}

// ============================================
// Export
// ============================================

export const standardsCache = {
  // Read operations
  getRawStandards,
  getAdjacentStandards,
  getAIContext,
  getStrands,

  // Write operations
  setRawStandards,
  setAdjacentStandards,
  setStrands,

  // Invalidation
  invalidateGrade,
  invalidateCurriculum,
  invalidateAll,

  // Utilities
  getCacheStats,
  warmCache,
  buildAIContextFromStandards,

  // Constants (for testing/debugging)
  CACHE_PREFIX,
  CACHE_TTL,
  MAX_STANDARDS_FOR_AI_CONTEXT,
};

export default standardsCache;
