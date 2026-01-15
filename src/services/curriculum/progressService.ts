/**
 * Progress Service
 * Tracks child mastery of curriculum standards based on quiz/flashcard performance
 */

import { prisma } from '../../config/database.js';
import {
  AlignableContentType,
  StandardMasteryStatus,
  CurriculumType,
  Subject
} from '@prisma/client';
import { logger } from '../../utils/logger.js';
import type { AlignedStandard } from './alignmentService.js';

// =============================================================================
// TYPES
// =============================================================================

export interface ProgressUpdate {
  childId: string;
  standardId: string;
  isCorrect: boolean;
  curriculumType: CurriculumType;
}

export interface ContentAlignmentInput {
  contentType: AlignableContentType;
  contentId: string;
  alignedStandards: AlignedStandard[];
}

export interface CurriculumCoverage {
  totalStandards: number;
  mastered: number;
  proficient: number;
  approaching: number;
  inProgress: number;
  notStarted: number;
  coveragePercent: number;
  masteryPercent: number;
}

export interface SubjectProgress {
  subject: string;
  strand: string;
  totalStandards: number;
  mastered: number;
  coveragePercent: number;
}

export interface ContentAlignment {
  standardId: string;
  notation: string;
  description: string;
  strand: string;
  alignmentStrength: number;
  isPrimary: boolean;
}

// =============================================================================
// CONSTANTS
// =============================================================================

// Mastery thresholds based on correct answer ratio
const MASTERY_THRESHOLDS = {
  APPROACHING: 0.5,   // 50% correct
  PROFICIENT: 0.7,    // 70% correct
  MASTERED: 0.85,     // 85% correct
};

// Minimum attempts before considering mastery status changes
const MIN_ATTEMPTS_FOR_MASTERY = 3;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Map CurriculumType enum to jurisdiction code in database
 */
function getJurisdictionCode(curriculumType: CurriculumType): string {
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
 * Calculate mastery status based on score and attempt count
 */
function calculateMasteryStatus(
  masteryScore: number,
  attemptsCount: number
): StandardMasteryStatus {
  // Need minimum attempts to claim mastery levels
  if (attemptsCount < MIN_ATTEMPTS_FOR_MASTERY) {
    return masteryScore > 0 ? 'IN_PROGRESS' : 'NOT_STARTED';
  }

  if (masteryScore >= MASTERY_THRESHOLDS.MASTERED) {
    return 'MASTERED';
  } else if (masteryScore >= MASTERY_THRESHOLDS.PROFICIENT) {
    return 'PROFICIENT';
  } else if (masteryScore >= MASTERY_THRESHOLDS.APPROACHING) {
    return 'APPROACHING';
  } else {
    return 'IN_PROGRESS';
  }
}

// =============================================================================
// CONTENT ALIGNMENT FUNCTIONS
// =============================================================================

/**
 * Save content-to-standard alignments to database
 * Uses upsert to handle re-analysis of the same content
 */
export async function saveContentAlignments(
  input: ContentAlignmentInput
): Promise<number> {
  const { contentType, contentId, alignedStandards } = input;

  if (!alignedStandards.length) {
    logger.info('No standards to save for content', { contentType, contentId });
    return 0;
  }

  try {
    // Use upsert pattern for idempotent saves
    const operations = alignedStandards.map(std =>
      prisma.contentStandardAlignment.upsert({
        where: {
          contentType_contentId_standardId: {
            contentType,
            contentId,
            standardId: std.id,
          },
        },
        update: {
          alignmentStrength: std.alignmentStrength,
          isPrimary: std.isPrimary,
          alignedBy: 'AI',
        },
        create: {
          contentType,
          contentId,
          standardId: std.id,
          alignmentStrength: std.alignmentStrength,
          isPrimary: std.isPrimary,
          alignedBy: 'AI',
        },
      })
    );

    await prisma.$transaction(operations);

    logger.info('Saved content alignments', {
      contentType,
      contentId,
      alignmentCount: alignedStandards.length,
      primaryCount: alignedStandards.filter(s => s.isPrimary).length,
    });

    return alignedStandards.length;
  } catch (error) {
    logger.error('Failed to save content alignments', {
      error: error instanceof Error ? error.message : 'Unknown error',
      contentType,
      contentId,
    });
    throw error;
  }
}

/**
 * Get standards aligned to a piece of content
 */
export async function getContentAlignments(
  contentType: AlignableContentType,
  contentId: string
): Promise<ContentAlignment[]> {
  const alignments = await prisma.contentStandardAlignment.findMany({
    where: { contentType, contentId },
    include: {
      standard: {
        select: {
          id: true,
          notation: true,
          description: true,
          strand: true,
        },
      },
    },
    orderBy: { alignmentStrength: 'desc' },
  });

  return alignments.map(a => ({
    standardId: a.standardId,
    notation: a.standard.notation || '',
    description: a.standard.description,
    strand: a.standard.strand || '',
    alignmentStrength: a.alignmentStrength,
    isPrimary: a.isPrimary,
  }));
}

// =============================================================================
// PROGRESS TRACKING FUNCTIONS
// =============================================================================

/**
 * Update child's progress on a standard based on attempt result
 */
export async function updateStandardProgress(
  update: ProgressUpdate
): Promise<void> {
  const { childId, standardId, isCorrect, curriculumType } = update;

  try {
    // Get existing progress record
    const existing = await prisma.childStandardProgress.findUnique({
      where: {
        childId_standardId: { childId, standardId },
      },
    });

    const newAttempts = (existing?.attemptsCount || 0) + 1;
    const newCorrect = (existing?.correctCount || 0) + (isCorrect ? 1 : 0);
    const masteryScore = newCorrect / newAttempts;

    // Calculate status based on score and attempts
    const status = calculateMasteryStatus(masteryScore, newAttempts);

    // Track when mastery was first achieved
    let firstMasteredAt = existing?.firstMasteredAt || null;
    if (status === 'MASTERED' && !firstMasteredAt) {
      firstMasteredAt = new Date();
    }

    await prisma.childStandardProgress.upsert({
      where: {
        childId_standardId: { childId, standardId },
      },
      update: {
        attemptsCount: newAttempts,
        correctCount: newCorrect,
        masteryScore,
        status,
        lastAttemptAt: new Date(),
        firstMasteredAt,
      },
      create: {
        childId,
        standardId,
        curriculumType,
        attemptsCount: newAttempts,
        correctCount: newCorrect,
        masteryScore,
        status,
        lastAttemptAt: new Date(),
        firstMasteredAt,
      },
    });

    logger.debug('Updated standard progress', {
      childId,
      standardId,
      isCorrect,
      masteryScore: masteryScore.toFixed(2),
      status,
      attemptsCount: newAttempts,
    });
  } catch (error) {
    logger.error('Failed to update standard progress', {
      error: error instanceof Error ? error.message : 'Unknown error',
      childId,
      standardId,
    });
    throw error;
  }
}

/**
 * Batch update progress for multiple standards (after quiz submission)
 */
export async function updateProgressBatch(
  childId: string,
  curriculumType: CurriculumType,
  results: Array<{ standardId: string; isCorrect: boolean }>
): Promise<void> {
  if (!results.length) return;

  logger.info('Batch updating standard progress', {
    childId,
    standardCount: results.length,
    correctCount: results.filter(r => r.isCorrect).length,
  });

  // Process sequentially to maintain data consistency
  for (const result of results) {
    await updateStandardProgress({
      childId,
      standardId: result.standardId,
      isCorrect: result.isCorrect,
      curriculumType,
    });
  }
}

// =============================================================================
// COVERAGE & ANALYTICS FUNCTIONS
// =============================================================================

/**
 * Get curriculum coverage stats for a child
 */
export async function getCurriculumCoverage(
  childId: string
): Promise<CurriculumCoverage> {
  // Get child's curriculum and grade
  const child = await prisma.child.findUnique({
    where: { id: childId },
    select: { curriculumType: true, gradeLevel: true },
  });

  if (!child?.curriculumType || child.gradeLevel === null) {
    return {
      totalStandards: 0,
      mastered: 0,
      proficient: 0,
      approaching: 0,
      inProgress: 0,
      notStarted: 0,
      coveragePercent: 0,
      masteryPercent: 0,
    };
  }

  const jurisdictionCode = getJurisdictionCode(child.curriculumType);

  // Count total standards for this curriculum/grade
  const totalStandards = await prisma.learningStandard.count({
    where: {
      standardSet: {
        jurisdiction: { code: jurisdictionCode },
        gradeLevel: child.gradeLevel,
      },
    },
  });

  if (totalStandards === 0) {
    return {
      totalStandards: 0,
      mastered: 0,
      proficient: 0,
      approaching: 0,
      inProgress: 0,
      notStarted: 0,
      coveragePercent: 0,
      masteryPercent: 0,
    };
  }

  // Count by status
  const statusCounts = await prisma.childStandardProgress.groupBy({
    by: ['status'],
    where: { childId },
    _count: true,
  });

  // Initialize counts
  const counts: Record<StandardMasteryStatus, number> = {
    MASTERED: 0,
    PROFICIENT: 0,
    APPROACHING: 0,
    IN_PROGRESS: 0,
    NOT_STARTED: 0,
  };

  let touched = 0;
  for (const { status, _count } of statusCounts) {
    counts[status] = _count;
    if (status !== 'NOT_STARTED') {
      touched += _count;
    }
  }

  // Standards not in progress table are "not started"
  const notStarted = Math.max(0, totalStandards - touched);

  const coveragePercent =
    totalStandards > 0 ? Math.round((touched / totalStandards) * 100) : 0;

  const masteryPercent =
    totalStandards > 0
      ? Math.round(
          ((counts.MASTERED + counts.PROFICIENT) / totalStandards) * 100
        )
      : 0;

  return {
    totalStandards,
    mastered: counts.MASTERED,
    proficient: counts.PROFICIENT,
    approaching: counts.APPROACHING,
    inProgress: counts.IN_PROGRESS,
    notStarted,
    coveragePercent,
    masteryPercent,
  };
}

/**
 * Get detailed progress by subject and strand
 */
export async function getProgressBySubject(
  childId: string
): Promise<SubjectProgress[]> {
  const progress = await prisma.childStandardProgress.findMany({
    where: { childId },
    include: {
      standard: {
        include: {
          standardSet: {
            select: { subject: true },
          },
        },
      },
    },
  });

  // Group by subject and strand
  const byStrand = new Map<
    string,
    {
      subject: string;
      strand: string;
      total: number;
      mastered: number;
    }
  >();

  for (const p of progress) {
    const key = `${p.standard.standardSet.subject}:${p.standard.strand || 'General'}`;
    const existing = byStrand.get(key) || {
      subject: p.standard.standardSet.subject,
      strand: p.standard.strand || 'General',
      total: 0,
      mastered: 0,
    };

    existing.total++;
    if (p.status === 'MASTERED' || p.status === 'PROFICIENT') {
      existing.mastered++;
    }

    byStrand.set(key, existing);
  }

  return Array.from(byStrand.values())
    .map(s => ({
      subject: s.subject,
      strand: s.strand,
      totalStandards: s.total,
      mastered: s.mastered,
      coveragePercent:
        s.total > 0 ? Math.round((s.mastered / s.total) * 100) : 0,
    }))
    .sort((a, b) => {
      // Sort by subject, then by strand
      if (a.subject !== b.subject) {
        return a.subject.localeCompare(b.subject);
      }
      return a.strand.localeCompare(b.strand);
    });
}

/**
 * Get gap analysis - standards that need more work
 */
export async function getGapAnalysis(
  childId: string,
  limit: number = 10
): Promise<
  Array<{
    standardId: string;
    notation: string;
    description: string;
    strand: string;
    status: StandardMasteryStatus;
    masteryScore: number;
    attemptsCount: number;
  }>
> {
  // Get standards that are in progress but not yet mastered
  const gaps = await prisma.childStandardProgress.findMany({
    where: {
      childId,
      status: {
        in: ['IN_PROGRESS', 'APPROACHING'],
      },
    },
    include: {
      standard: {
        select: {
          notation: true,
          description: true,
          strand: true,
        },
      },
    },
    orderBy: [
      { masteryScore: 'asc' }, // Lowest mastery first
      { attemptsCount: 'desc' }, // More attempts = more stuck
    ],
    take: limit,
  });

  return gaps.map(g => ({
    standardId: g.standardId,
    notation: g.standard.notation || '',
    description: g.standard.description,
    strand: g.standard.strand || '',
    status: g.status,
    masteryScore: g.masteryScore || 0,
    attemptsCount: g.attemptsCount,
  }));
}

/**
 * Initialize progress records for a child when they start using curriculum
 * This creates NOT_STARTED records for all standards at their grade level
 */
export async function initializeChildProgress(
  childId: string,
  curriculumType: CurriculumType,
  gradeLevel: number
): Promise<number> {
  const jurisdictionCode = getJurisdictionCode(curriculumType);

  // Get all standards for this grade
  const standards = await prisma.learningStandard.findMany({
    where: {
      standardSet: {
        jurisdiction: { code: jurisdictionCode },
        gradeLevel,
      },
    },
    select: { id: true },
  });

  if (standards.length === 0) {
    logger.info('No standards found to initialize', {
      childId,
      curriculumType,
      gradeLevel,
    });
    return 0;
  }

  // Create progress records (skip if already exists)
  let created = 0;
  for (const standard of standards) {
    try {
      await prisma.childStandardProgress.create({
        data: {
          childId,
          standardId: standard.id,
          curriculumType,
          status: 'NOT_STARTED',
          attemptsCount: 0,
          correctCount: 0,
        },
      });
      created++;
    } catch (error) {
      // Ignore duplicate key errors
      if (
        error instanceof Error &&
        error.message.includes('Unique constraint')
      ) {
        continue;
      }
      throw error;
    }
  }

  logger.info('Initialized child progress', {
    childId,
    curriculumType,
    gradeLevel,
    standardsInitialized: created,
    totalStandards: standards.length,
  });

  return created;
}

// =============================================================================
// EXPORT
// =============================================================================

export const progressService = {
  // Content alignment
  saveContentAlignments,
  getContentAlignments,

  // Progress tracking
  updateStandardProgress,
  updateProgressBatch,

  // Analytics
  getCurriculumCoverage,
  getProgressBySubject,
  getGapAnalysis,

  // Initialization
  initializeChildProgress,
};
