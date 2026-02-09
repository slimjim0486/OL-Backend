/**
 * Curriculum Service
 * Queries learning standards from the database for content alignment
 *
 * CACHING STRATEGY:
 * - Standards are cached in Redis for 24 hours (they change ~yearly)
 * - Cache key: standards:{curriculum}:{subject}:{grade}
 * - Cache misses fall back to PostgreSQL
 * - Cache failures are non-fatal (logged and continue to DB)
 * - Pre-built AI context strings are cached for prompt efficiency
 *
 * CALL FLOW:
 * 1. Check Redis cache
 * 2. If HIT: return cached data (fast path ~1-2ms)
 * 3. If MISS: query PostgreSQL, cache result, return (slow path ~20-50ms)
 */

import { prisma } from '../../config/database.js';
import { Subject, CurriculumType } from '@prisma/client';
import { logger } from '../../utils/logger.js';
import { standardsCache, CachedStandard, CachedAIContext } from '../cache/standardsCache.js';

export interface StandardWithContext {
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
 * Map CurriculumType enum to jurisdiction code in database
 * For US curriculum, different subjects have different jurisdictions:
 * - Math & English: US_COMMON_CORE
 * - Science: US_NGSS
 * - Social Studies: US_C3
 * For IB curriculum, grade level determines jurisdiction:
 * - Grade < 6 (PYP): IB_PYP
 * - Grade >= 6 (MYP/DP): IB_MYP_DP
 */
function getJurisdictionCode(curriculumType: CurriculumType, subject?: Subject, gradeLevel?: number): string {
  // Handle US curriculum with subject-specific jurisdictions
  if (curriculumType === 'AMERICAN' && subject) {
    if (subject === 'SCIENCE') {
      return 'US_NGSS';
    }
    if (subject === 'SOCIAL_STUDIES') {
      return 'US_C3';
    }
    // Math, English, and others use Common Core
    return 'US_COMMON_CORE';
  }

  // Handle IB curriculum with grade-based jurisdiction split
  if (curriculumType === 'IB') {
    if (gradeLevel !== undefined && gradeLevel >= 6) {
      return 'IB_MYP_DP';
    }
    return 'IB_PYP';
  }

  const mapping: Record<CurriculumType, string> = {
    BRITISH: 'UK_NATIONAL_CURRICULUM',
    AMERICAN: 'US_COMMON_CORE',
    IB: 'IB_PYP',
    INDIAN_CBSE: 'INDIAN_CBSE',
    INDIAN_ICSE: 'INDIAN_ICSE',
    ARABIC: 'ARABIC_CURRICULUM',
  };
  return mapping[curriculumType] || 'UK_NATIONAL_CURRICULUM';
}

/**
 * Map detected subject string to Subject enum
 */
function normalizeSubject(detectedSubject: string | undefined): Subject | null {
  if (!detectedSubject) return null;

  const normalized = detectedSubject.toUpperCase().replace(/[^A-Z_]/g, '_');
  const validSubjects: Subject[] = ['MATH', 'SCIENCE', 'ENGLISH', 'ARABIC', 'ISLAMIC_STUDIES', 'SOCIAL_STUDIES', 'ART', 'MUSIC', 'GEOGRAPHY', 'HISTORY', 'OTHER'];

  // Handle common variations
  const mapping: Record<string, Subject> = {
    'MATH': 'MATH',
    'MATHS': 'MATH',
    'MATHEMATICS': 'MATH',
    'SCIENCE': 'SCIENCE',
    'BIOLOGY': 'SCIENCE',
    'CHEMISTRY': 'SCIENCE',
    'PHYSICS': 'SCIENCE',
    'ENGLISH': 'ENGLISH',
    'LANGUAGE_ARTS': 'ENGLISH',
    'ELA': 'ENGLISH',
    'READING': 'ENGLISH',
    'WRITING': 'ENGLISH',
    'SOCIAL_STUDIES': 'SOCIAL_STUDIES',
    'SOCIAL': 'SOCIAL_STUDIES',
    'CIVICS': 'SOCIAL_STUDIES',
    'ECONOMICS': 'SOCIAL_STUDIES',
    'HISTORY': 'HISTORY',
    'GEOGRAPHY': 'GEOGRAPHY',
  };

  return mapping[normalized] || (validSubjects.includes(normalized as Subject) ? normalized as Subject : null);
}

// ============================================
// Internal: Database Query Functions (Uncached)
// ============================================

/**
 * Query standards directly from database (bypasses cache)
 * Used internally when cache miss occurs
 */
async function queryStandardsFromDB(
  curriculumType: CurriculumType,
  subject: Subject,
  gradeLevel: number
): Promise<StandardWithContext[]> {
  const jurisdictionCode = getJurisdictionCode(curriculumType, subject, gradeLevel);

  const standards = await prisma.learningStandard.findMany({
    where: {
      standardSet: {
        jurisdiction: { code: jurisdictionCode },
        subject: subject,
        gradeLevel: gradeLevel,
      },
    },
    include: {
      standardSet: {
        select: {
          title: true,
          subject: true,
          gradeLevel: true,
          keyStage: true,
        },
      },
    },
    orderBy: [
      { strand: 'asc' },
      { position: 'asc' },
    ],
  });

  return standards;
}

/**
 * Query standards with adjacent grades directly from database
 */
async function queryAdjacentStandardsFromDB(
  curriculumType: CurriculumType,
  subject: Subject,
  gradeLevel: number
): Promise<StandardWithContext[]> {
  const jurisdictionCode = getJurisdictionCode(curriculumType, subject, gradeLevel);

  // Include grade-1, grade, grade+1
  const gradeLevels = [
    Math.max(1, gradeLevel - 1),
    gradeLevel,
    Math.min(12, gradeLevel + 1), // Extended to grade 12
  ];

  const standards = await prisma.learningStandard.findMany({
    where: {
      standardSet: {
        jurisdiction: { code: jurisdictionCode },
        subject: subject,
        gradeLevel: { in: gradeLevels },
      },
    },
    include: {
      standardSet: {
        select: {
          title: true,
          subject: true,
          gradeLevel: true,
          keyStage: true,
        },
      },
    },
    orderBy: [
      { standardSet: { gradeLevel: 'asc' } },
      { strand: 'asc' },
      { position: 'asc' },
    ],
  });

  return standards;
}

/**
 * Query strands directly from database
 */
async function queryStrandsFromDB(
  curriculumType: CurriculumType,
  subject: Subject,
  gradeLevel: number
): Promise<string[]> {
  const jurisdictionCode = getJurisdictionCode(curriculumType, subject, gradeLevel);

  const standards = await prisma.learningStandard.findMany({
    where: {
      standardSet: {
        jurisdiction: { code: jurisdictionCode },
        subject: subject,
        gradeLevel: gradeLevel,
      },
      strand: { not: null },
    },
    select: { strand: true },
    distinct: ['strand'],
    orderBy: { strand: 'asc' },
  });

  return standards.map(s => s.strand!).filter(Boolean);
}

// ============================================
// Public: Cached Query Functions
// ============================================

/**
 * Get all standards for a specific curriculum, subject, and grade level
 *
 * CACHED: Yes (24 hour TTL)
 * FALLBACK: PostgreSQL on cache miss/error
 */
export async function getStandardsForGrade(
  curriculumType: CurriculumType,
  subject: Subject,
  gradeLevel: number
): Promise<StandardWithContext[]> {
  const startTime = Date.now();

  // Step 1: Check cache
  const cached = await standardsCache.getRawStandards(curriculumType, subject, gradeLevel);

  if (cached) {
    // Cache HIT - return immediately
    logger.debug('Standards cache HIT (getStandardsForGrade)', {
      curriculumType,
      subject,
      gradeLevel,
      count: cached.length,
      latencyMs: Date.now() - startTime,
    });

    // Cast is safe: CachedStandard matches StandardWithContext structure
    return cached as StandardWithContext[];
  }

  // Step 2: Cache MISS - query database
  logger.info('Standards cache MISS - querying database', {
    curriculumType,
    subject,
    gradeLevel,
  });

  const standards = await queryStandardsFromDB(curriculumType, subject, gradeLevel);

  logger.info('Database query complete', {
    curriculumType,
    subject,
    gradeLevel,
    count: standards.length,
    latencyMs: Date.now() - startTime,
  });

  // Step 3: Cache the result for next time (async, don't block return)
  // Note: setRawStandards also caches the AI context
  standardsCache.setRawStandards(
    curriculumType,
    subject,
    gradeLevel,
    standards as CachedStandard[]
  ).catch(err => {
    // Log but don't fail - caching is best-effort
    logger.error('Failed to cache standards after DB query', {
      curriculumType,
      subject,
      gradeLevel,
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  });

  return standards;
}

/**
 * Get standards for a grade with optional adjacent grades for fuzzy matching
 * This helps when content spans multiple grade levels
 *
 * CACHED: Yes (24 hour TTL)
 * FALLBACK: PostgreSQL on cache miss/error
 */
export async function getStandardsWithAdjacentGrades(
  curriculumType: CurriculumType,
  subject: Subject,
  gradeLevel: number,
  includeAdjacentGrades: boolean = true
): Promise<StandardWithContext[]> {
  // If not including adjacent grades, use the single-grade cached function
  if (!includeAdjacentGrades) {
    return getStandardsForGrade(curriculumType, subject, gradeLevel);
  }

  const startTime = Date.now();

  // Step 1: Check cache
  const cached = await standardsCache.getAdjacentStandards(curriculumType, subject, gradeLevel);

  if (cached) {
    logger.debug('Adjacent standards cache HIT', {
      curriculumType,
      subject,
      gradeLevel,
      count: cached.length,
      latencyMs: Date.now() - startTime,
    });

    return cached as StandardWithContext[];
  }

  // Step 2: Cache MISS - query database
  logger.info('Adjacent standards cache MISS - querying database', {
    curriculumType,
    subject,
    gradeLevel,
  });

  const standards = await queryAdjacentStandardsFromDB(curriculumType, subject, gradeLevel);

  logger.info('Database query complete (adjacent)', {
    curriculumType,
    subject,
    gradeLevel,
    count: standards.length,
    latencyMs: Date.now() - startTime,
  });

  // Step 3: Cache the result
  standardsCache.setAdjacentStandards(
    curriculumType,
    subject,
    gradeLevel,
    standards as CachedStandard[]
  ).catch(err => {
    logger.error('Failed to cache adjacent standards', {
      curriculumType,
      subject,
      gradeLevel,
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  });

  return standards;
}

/**
 * Get all strands for a subject and grade
 *
 * CACHED: Yes (24 hour TTL)
 * FALLBACK: PostgreSQL on cache miss/error
 */
export async function getAvailableStrands(
  curriculumType: CurriculumType,
  subject: Subject,
  gradeLevel: number
): Promise<string[]> {
  // Step 1: Check cache
  const cached = await standardsCache.getStrands(curriculumType, subject, gradeLevel);

  if (cached) {
    logger.debug('Strands cache HIT', {
      curriculumType,
      subject,
      gradeLevel,
      count: cached.length,
    });

    return cached;
  }

  // Step 2: Cache MISS - query database
  const strands = await queryStrandsFromDB(curriculumType, subject, gradeLevel);

  // Step 3: Cache the result
  standardsCache.setStrands(curriculumType, subject, gradeLevel, strands).catch(err => {
    logger.error('Failed to cache strands', {
      curriculumType,
      subject,
      gradeLevel,
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  });

  return strands;
}

/**
 * Get pre-built AI context for lesson/quiz generation
 *
 * CACHED: Yes (built when standards are cached)
 * FALLBACK: Builds from DB query on cache miss
 *
 * This returns a ready-to-use string for AI prompts, saving token processing time.
 */
export async function getAIContextForGrade(
  curriculumType: CurriculumType,
  subject: Subject,
  gradeLevel: number
): Promise<CachedAIContext | null> {
  // Step 1: Check cache
  const cached = await standardsCache.getAIContext(curriculumType, subject, gradeLevel);

  if (cached) {
    logger.debug('AI context cache HIT', {
      curriculumType,
      subject,
      gradeLevel,
      standardCount: cached.standardCount,
    });

    return cached;
  }

  // Step 2: Cache MISS - fetch standards and build context
  logger.info('AI context cache MISS - building from standards', {
    curriculumType,
    subject,
    gradeLevel,
  });

  // This will also cache the AI context as a side effect
  const standards = await getStandardsForGrade(curriculumType, subject, gradeLevel);

  if (standards.length === 0) {
    return null;
  }

  // Build context from freshly fetched standards
  const context = standardsCache.buildAIContextFromStandards(
    standards as CachedStandard[],
    curriculumType,
    subject,
    gradeLevel
  );

  return context;
}

// ============================================
// Public: Non-Cached Query Functions
// These are used less frequently or have dynamic filters
// ============================================

/**
 * Get standards by strand/topic for more focused alignment
 *
 * NOT CACHED: Dynamic strand filter makes caching less valuable
 */
export async function getStandardsByStrand(
  curriculumType: CurriculumType,
  subject: Subject,
  gradeLevel: number,
  strand: string
): Promise<StandardWithContext[]> {
  const jurisdictionCode = getJurisdictionCode(curriculumType, subject, gradeLevel);

  const standards = await prisma.learningStandard.findMany({
    where: {
      standardSet: {
        jurisdiction: { code: jurisdictionCode },
        subject: subject,
        gradeLevel: gradeLevel,
      },
      strand: { contains: strand, mode: 'insensitive' },
    },
    include: {
      standardSet: {
        select: {
          title: true,
          subject: true,
          gradeLevel: true,
          keyStage: true,
        },
      },
    },
    orderBy: { position: 'asc' },
  });

  return standards;
}

/**
 * Look up a standard by its notation (e.g., "UK.KS2.Y4.MA.NFR.1")
 *
 * NOT CACHED: Individual lookups are rare, notation is indexed
 */
export async function getStandardByNotation(notation: string): Promise<StandardWithContext | null> {
  const standard = await prisma.learningStandard.findFirst({
    where: { notation },
    include: {
      standardSet: {
        select: {
          title: true,
          subject: true,
          gradeLevel: true,
          keyStage: true,
        },
      },
    },
  });

  return standard;
}

/**
 * Get available subjects for a curriculum and grade
 * For US curriculum, queries multiple jurisdictions (Common Core, NGSS, C3)
 *
 * NOT CACHED: Small result set, infrequent calls
 */
export async function getAvailableSubjects(
  curriculumType: CurriculumType,
  gradeLevel: number
): Promise<Subject[]> {
  // For US curriculum, we need to check multiple jurisdictions
  if (curriculumType === 'AMERICAN') {
    const jurisdictionCodes = ['US_COMMON_CORE', 'US_NGSS', 'US_C3'];
    const standardSets = await prisma.standardSet.findMany({
      where: {
        jurisdiction: { code: { in: jurisdictionCodes } },
        gradeLevel: gradeLevel,
      },
      select: { subject: true },
      distinct: ['subject'],
    });
    return standardSets.map(s => s.subject);
  }

  const jurisdictionCode = getJurisdictionCode(curriculumType, undefined, gradeLevel);

  const standardSets = await prisma.standardSet.findMany({
    where: {
      jurisdiction: { code: jurisdictionCode },
      gradeLevel: gradeLevel,
    },
    select: { subject: true },
    distinct: ['subject'],
  });

  return standardSets.map(s => s.subject);
}

/**
 * Count total standards for reporting/verification
 *
 * NOT CACHED: Infrequent admin/reporting usage
 */
export async function countStandards(
  curriculumType?: CurriculumType,
  subject?: Subject,
  gradeLevel?: number
): Promise<number> {
  const where: any = {};

  if (curriculumType || subject || gradeLevel !== undefined) {
    where.standardSet = {};

    if (curriculumType) {
      where.standardSet.jurisdiction = { code: getJurisdictionCode(curriculumType, subject, gradeLevel) };
    }
    if (subject) {
      where.standardSet.subject = subject;
    }
    if (gradeLevel !== undefined) {
      where.standardSet.gradeLevel = gradeLevel;
    }
  }

  return prisma.learningStandard.count({ where });
}

/**
 * Get all curriculum jurisdictions
 *
 * NOT CACHED: Admin/setup usage only
 */
export async function getAllJurisdictions() {
  return prisma.curriculumJurisdiction.findMany({
    include: {
      _count: {
        select: { standardSets: true },
      },
    },
    orderBy: { name: 'asc' },
  });
}

/**
 * Get jurisdiction by code
 *
 * NOT CACHED: Admin/setup usage only
 */
export async function getJurisdictionByCode(code: string) {
  return prisma.curriculumJurisdiction.findUnique({
    where: { code },
    include: {
      _count: {
        select: { standardSets: true },
      },
    },
  });
}

/**
 * Get standard sets for a curriculum
 *
 * NOT CACHED: Admin/reporting usage only
 */
export async function getStandardSets(jurisdictionCode: string, subject?: Subject) {
  return prisma.standardSet.findMany({
    where: {
      jurisdiction: { code: jurisdictionCode },
      ...(subject && { subject }),
    },
    include: {
      _count: {
        select: { standards: true },
      },
    },
    orderBy: [{ subject: 'asc' }, { gradeLevel: 'asc' }],
  });
}

/**
 * Get standards for a specific year with filtering options
 *
 * NOT CACHED: Dynamic filters (search, strand) make caching complex
 */
export async function getStandardsForYear(
  jurisdictionCode: string,
  year: number,
  subject: Subject,
  options?: {
    strand?: string;
    searchQuery?: string;
    limit?: number;
    offset?: number;
  }
) {
  const { strand, searchQuery, limit = 100, offset = 0 } = options || {};

  return prisma.learningStandard.findMany({
    where: {
      standardSet: {
        jurisdiction: { code: jurisdictionCode },
        gradeLevel: year,
        subject,
      },
      ...(strand && { strand: { contains: strand, mode: 'insensitive' as const } }),
      ...(searchQuery && {
        OR: [
          { description: { contains: searchQuery, mode: 'insensitive' as const } },
          { notation: { contains: searchQuery, mode: 'insensitive' as const } },
        ],
      }),
    },
    include: {
      standardSet: {
        select: {
          title: true,
          subject: true,
          gradeLevel: true,
          keyStage: true,
        },
      },
    },
    orderBy: [{ strand: 'asc' }, { position: 'asc' }],
    take: limit,
    skip: offset,
  });
}

/**
 * Get strands for a specific year (by jurisdiction code)
 *
 * NOT CACHED: Use getAvailableStrands for cached version
 */
export async function getStrandsForYear(
  jurisdictionCode: string,
  year: number,
  subject: Subject
) {
  const standards = await prisma.learningStandard.findMany({
    where: {
      standardSet: {
        jurisdiction: { code: jurisdictionCode },
        gradeLevel: year,
        subject,
      },
      strand: { not: null },
    },
    select: { strand: true },
    distinct: ['strand'],
    orderBy: { strand: 'asc' },
  });

  return standards.map(s => s.strand).filter(Boolean);
}

/**
 * Search standards across all curricula
 *
 * NOT CACHED: Full-text search is dynamic
 */
export async function searchStandards(
  query: string,
  options?: {
    jurisdictionCode?: string;
    subject?: Subject;
    gradeLevel?: number;
    limit?: number;
    offset?: number;
  }
) {
  const { jurisdictionCode, subject, gradeLevel, limit = 50, offset = 0 } = options || {};

  return prisma.learningStandard.findMany({
    where: {
      OR: [
        { description: { contains: query, mode: 'insensitive' as const } },
        { notation: { contains: query, mode: 'insensitive' as const } },
        { strand: { contains: query, mode: 'insensitive' as const } },
      ],
      standardSet: {
        ...(jurisdictionCode && { jurisdiction: { code: jurisdictionCode } }),
        ...(subject && { subject }),
        ...(gradeLevel !== undefined && { gradeLevel }),
      },
    },
    include: {
      standardSet: {
        select: {
          title: true,
          subject: true,
          gradeLevel: true,
          keyStage: true,
          jurisdiction: {
            select: { code: true, name: true },
          },
        },
      },
    },
    orderBy: { position: 'asc' },
    take: limit,
    skip: offset,
  });
}

/**
 * Get a standard by ID
 *
 * NOT CACHED: Individual lookups are rare
 */
export async function getStandardById(id: string) {
  return prisma.learningStandard.findUnique({
    where: { id },
    include: {
      standardSet: {
        select: {
          title: true,
          subject: true,
          gradeLevel: true,
          keyStage: true,
          jurisdiction: {
            select: { code: true, name: true },
          },
        },
      },
    },
  });
}

/**
 * Get standards for a child based on their curriculum and grade
 *
 * USES CACHED: Internally calls getStandardsForGrade which is cached
 */
export async function getStandardsForChild(childId: string) {
  // First get the child's curriculum settings
  const child = await prisma.child.findUnique({
    where: { id: childId },
    select: {
      curriculumType: true,
      gradeLevel: true,
    },
  });

  if (!child || !child.curriculumType || child.gradeLevel === null) {
    return { standards: [], message: 'Child curriculum not configured' };
  }

  // For US curriculum, there are multiple jurisdictions
  // For IB, use grade-appropriate jurisdiction
  const jurisdictionCodes = child.curriculumType === 'AMERICAN'
    ? ['US_COMMON_CORE', 'US_NGSS', 'US_C3']
    : child.curriculumType === 'IB'
      ? (child.gradeLevel >= 6 ? ['IB_MYP_DP', 'IB_PYP'] : ['IB_PYP'])
      : [getJurisdictionCode(child.curriculumType, undefined, child.gradeLevel)];

  // Get all subjects available for this grade
  const subjects = await getAvailableSubjects(child.curriculumType, child.gradeLevel);

  // Get standards for each subject (uses cache internally)
  const standardsBySubject: Record<string, any[]> = {};

  for (const subject of subjects) {
    const standards = await getStandardsForGrade(child.curriculumType, subject, child.gradeLevel);
    standardsBySubject[subject] = standards;
  }

  return {
    curriculumType: child.curriculumType,
    gradeLevel: child.gradeLevel,
    jurisdictionCodes,
    subjects,
    standardsBySubject,
    totalStandards: Object.values(standardsBySubject).flat().length,
  };
}

// ============================================
// Cache Management Functions
// ============================================

/**
 * Invalidate cache for a specific curriculum/subject/grade
 * Call this when standards are updated for that combination
 */
export async function invalidateCacheForGrade(
  curriculumType: CurriculumType,
  subject: Subject,
  gradeLevel: number
): Promise<void> {
  await standardsCache.invalidateGrade(curriculumType, subject, gradeLevel);
}

/**
 * Invalidate all cached standards for a curriculum
 * Call this after bulk curriculum updates (e.g., reseeding)
 */
export async function invalidateCacheForCurriculum(
  curriculumType: CurriculumType
): Promise<void> {
  await standardsCache.invalidateCurriculum(curriculumType);
}

/**
 * Invalidate all cached standards
 * Call this after major database migrations
 */
export async function invalidateAllStandardsCache(): Promise<void> {
  await standardsCache.invalidateAll();
}

/**
 * Get cache statistics for monitoring
 */
export async function getStandardsCacheStats() {
  return standardsCache.getCacheStats();
}

/**
 * Warm the cache for commonly accessed curriculum/subject/grade combinations
 *
 * @param curriculumType - Curriculum to warm
 * @param subject - Subject to warm
 * @param gradeRange - Array of grade levels (e.g., [1, 2, 3, 4, 5])
 */
export async function warmStandardsCache(
  curriculumType: CurriculumType,
  subject: Subject,
  gradeRange: number[]
): Promise<{ warmed: number; failed: number }> {
  return standardsCache.warmCache(
    curriculumType,
    subject,
    gradeRange,
    async (grade: number) => {
      const standards = await queryStandardsFromDB(curriculumType, subject, grade);
      return standards as CachedStandard[];
    }
  );
}

// ============================================
// Export
// ============================================

export const curriculumService = {
  // Cached query functions (high frequency)
  getStandardsForGrade,
  getStandardsWithAdjacentGrades,
  getAvailableStrands,
  getAIContextForGrade,

  // Non-cached query functions
  getStandardsByStrand,
  getStandardByNotation,
  getAvailableSubjects,
  countStandards,
  normalizeSubject,
  getJurisdictionCode,

  // Admin/reporting functions
  getAllJurisdictions,
  getJurisdictionByCode,
  getStandardSets,
  getStandardsForYear,
  getStrandsForYear,
  searchStandards,
  getStandardById,
  getStandardsForChild,

  // Cache management
  invalidateCacheForGrade,
  invalidateCacheForCurriculum,
  invalidateAllStandardsCache,
  getStandardsCacheStats,
  warmStandardsCache,
};
