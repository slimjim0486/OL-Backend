// Curriculum Adapter Service — Teacher Intelligence Platform
// Connects the graph engine to existing 20k+ LearningStandard records
// Maps CurriculumType enum → CurriculumJurisdiction → StandardSet → LearningStandard
import { CurriculumType, Subject } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

// ============================================
// TYPES
// ============================================

export interface GraphCurriculumStandard {
  id: string;
  code: string;           // notation e.g. "3.NF.A.1"
  description: string;
  curriculum: string;      // jurisdiction code
  gradeLevel: string;
  subject: string;
  strand: string | null;
  prerequisites: string[]; // IDs of prerequisite standards
  progressesTo: string[];  // IDs this progresses toward
}

// ============================================
// MAPPING
// ============================================

// Map CurriculumType enum → CurriculumJurisdiction.code
const CURRICULUM_TO_JURISDICTION: Record<string, string> = {
  BRITISH: 'UK_NATIONAL_CURRICULUM',
  AMERICAN: 'US_COMMON_CORE',
  IB: 'IB_PYP',
  INDIAN_CBSE: 'INDIAN_CBSE',
  INDIAN_ICSE: 'INDIAN_ICSE',
  ARABIC: 'UK_NATIONAL_CURRICULUM', // Fallback
};

function getJurisdictionCode(curriculumType: string): string {
  return CURRICULUM_TO_JURISDICTION[curriculumType] || 'UK_NATIONAL_CURRICULUM';
}

// Map grade range strings to numeric grade levels for querying.
//
// Intelligence-platform onboarding writes values like "K-2", "3-5", "6-8",
// "MIXED" (see frontend-intelligence/src/pages/teacher/IntelligenceOnboardingPage.jsx).
// Legacy teacher-portal profile updates write "ELEMENTARY", "MIDDLE", "HIGH",
// "MIXED" (see routes/teacher/auth.routes.ts). Single-grade strings like
// "year3", "grade4", "Y3", "3", "K" also flow through from agentProfile.gradesTaught.
//
// `parseGradeRange` is the canonical helper — returns a {min, max} range that
// callers can use with Prisma's {gte, lte} filter. Returns null when the
// input represents "no grade filter" (MIXED, empty, unparseable).
//
// `parseGradeLevel` is kept as a thin wrapper returning the lower bound,
// preserved for any external caller that only wants a single number. Internal
// query helpers below use `parseGradeRange` directly so multi-grade teachers
// get the right filter.

const KINDERGARTEN = 0;

function parseGradeRange(
  gradeRange: string | null | undefined
): { min: number; max: number } | null {
  if (!gradeRange) return null;
  const trimmed = gradeRange.trim();
  if (!trimmed) return null;
  const upper = trimmed.toUpperCase();

  // Explicit "mixed" sentinels — no grade filter, serve all grades.
  if (upper === 'MIXED' || upper === 'MIX' || upper === 'ALL') return null;

  // Legacy named ranges from the old teacher portal profile form.
  if (upper === 'ELEMENTARY') return { min: KINDERGARTEN, max: 5 };
  if (upper === 'MIDDLE') return { min: 6, max: 8 };
  if (upper === 'HIGH') return { min: 9, max: 12 };

  // Explicit "K" / "kindergarten" token — may appear standalone ("K") or as
  // part of a range ("K-2"). Split on dash/en-dash/em-dash first.
  const parts = trimmed.split(/[-–—]/).map(p => p.trim()).filter(Boolean);

  const tokenToNumber = (token: string): number | null => {
    const t = token.toUpperCase();
    if (t === 'K' || t === 'KG' || t === 'KINDERGARTEN' || t === 'PRE-K' || t === 'PREK') {
      return KINDERGARTEN;
    }
    const match = token.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  };

  if (parts.length === 2) {
    const minN = tokenToNumber(parts[0]);
    const maxN = tokenToNumber(parts[1]);
    if (minN !== null && maxN !== null) {
      return minN <= maxN
        ? { min: minN, max: maxN }
        : { min: maxN, max: minN };
    }
    // One side parsed — treat as single grade.
    if (minN !== null) return { min: minN, max: minN };
    if (maxN !== null) return { min: maxN, max: maxN };
    return null;
  }

  // Single token — may be "K", "3", "year3", "grade4", "Y3", "3rd", etc.
  const single = tokenToNumber(trimmed);
  if (single !== null) return { min: single, max: single };
  return null;
}

function parseGradeLevel(gradeRange: string): number | null {
  // Kept for backward compat — returns the lower bound of the parsed range.
  const range = parseGradeRange(gradeRange);
  return range ? range.min : null;
}

// Apply a parsed grade range to a Prisma `standardSet` where clause.
// Single-grade → equality. True range → {gte, lte}. Null range → no filter.
function applyGradeRangeFilter(
  standardSetWhere: Record<string, any>,
  range: { min: number; max: number } | null
): void {
  if (!range) return;
  if (range.min === range.max) {
    standardSetWhere.gradeLevel = range.min;
  } else {
    standardSetWhere.gradeLevel = { gte: range.min, lte: range.max };
  }
}

// ============================================
// QUERIES
// ============================================

/**
 * Get all standards for a teacher's configured curriculum, grade, and subject(s).
 * Returns standards formatted for the graph engine.
 */
async function getStandardsForTeacher(
  curriculum: string,
  gradeLevel: string,
  subjects: string[]
): Promise<GraphCurriculumStandard[]> {
  const jurisdictionCode = getJurisdictionCode(curriculum);
  const gradeRange = parseGradeRange(gradeLevel);

  const whereClause: any = {
    standardSet: {
      jurisdiction: { code: jurisdictionCode },
    },
  };

  // Filter by grade if we can parse it. Range strings like "6-8" produce
  // {gte: 6, lte: 8} so middle-school teachers see all three years at once.
  applyGradeRangeFilter(whereClause.standardSet, gradeRange);

  // Filter by subjects if provided
  if (subjects.length > 0) {
    whereClause.standardSet.subject = {
      in: subjects.map(s => s.toUpperCase()) as Subject[],
    };
  }

  const standards = await prisma.learningStandard.findMany({
    where: whereClause,
    select: {
      id: true,
      notation: true,
      description: true,
      strand: true,
      conceptualArea: true,
      prerequisites: true,
      progressesTo: true,
      depth: true,
      position: true,
      standardSet: {
        select: {
          code: true,
          subject: true,
          gradeLevel: true,
          jurisdiction: {
            select: { code: true },
          },
        },
      },
    },
    orderBy: [{ depth: 'asc' }, { position: 'asc' }],
  });

  return standards.map(s => ({
    id: s.id,
    code: s.notation || s.standardSet.code,
    description: s.description,
    curriculum: s.standardSet.jurisdiction.code,
    gradeLevel: String(s.standardSet.gradeLevel || ''),
    subject: s.standardSet.subject,
    strand: s.strand,
    prerequisites: s.prerequisites || [],
    progressesTo: s.progressesTo || [],
  }));
}

/**
 * Get a single standard by its ID.
 */
async function getStandardById(standardId: string): Promise<GraphCurriculumStandard | null> {
  const s = await prisma.learningStandard.findUnique({
    where: { id: standardId },
    select: {
      id: true,
      notation: true,
      description: true,
      strand: true,
      prerequisites: true,
      progressesTo: true,
      standardSet: {
        select: {
          code: true,
          subject: true,
          gradeLevel: true,
          jurisdiction: { select: { code: true } },
        },
      },
    },
  });

  if (!s) return null;

  return {
    id: s.id,
    code: s.notation || s.standardSet.code,
    description: s.description,
    curriculum: s.standardSet.jurisdiction.code,
    gradeLevel: String(s.standardSet.gradeLevel || ''),
    subject: s.standardSet.subject,
    strand: s.strand,
    prerequisites: s.prerequisites || [],
    progressesTo: s.progressesTo || [],
  };
}

/**
 * Fuzzy-match a standard code or description fragment against existing standards.
 * Used by stream extraction to link extracted standards to real records.
 */
async function matchStandard(
  query: string,
  curriculum: string,
  subject?: string
): Promise<GraphCurriculumStandard | null> {
  const jurisdictionCode = getJurisdictionCode(curriculum);

  // Try exact notation match first
  const exactMatch = await prisma.learningStandard.findFirst({
    where: {
      notation: query,
      standardSet: {
        jurisdiction: { code: jurisdictionCode },
        ...(subject ? { subject: subject.toUpperCase() as Subject } : {}),
      },
    },
    select: {
      id: true,
      notation: true,
      description: true,
      strand: true,
      prerequisites: true,
      progressesTo: true,
      standardSet: {
        select: {
          code: true,
          subject: true,
          gradeLevel: true,
          jurisdiction: { select: { code: true } },
        },
      },
    },
  });

  if (exactMatch) {
    return {
      id: exactMatch.id,
      code: exactMatch.notation || exactMatch.standardSet.code,
      description: exactMatch.description,
      curriculum: exactMatch.standardSet.jurisdiction.code,
      gradeLevel: String(exactMatch.standardSet.gradeLevel || ''),
      subject: exactMatch.standardSet.subject,
      strand: exactMatch.strand,
      prerequisites: exactMatch.prerequisites || [],
      progressesTo: exactMatch.progressesTo || [],
    };
  }

  // Try partial notation match (e.g., "3.NF" matching "3.NF.A.1")
  const partialMatch = await prisma.learningStandard.findFirst({
    where: {
      notation: { startsWith: query },
      standardSet: {
        jurisdiction: { code: jurisdictionCode },
        ...(subject ? { subject: subject.toUpperCase() as Subject } : {}),
      },
    },
    select: {
      id: true,
      notation: true,
      description: true,
      strand: true,
      prerequisites: true,
      progressesTo: true,
      standardSet: {
        select: {
          code: true,
          subject: true,
          gradeLevel: true,
          jurisdiction: { select: { code: true } },
        },
      },
    },
  });

  if (partialMatch) {
    return {
      id: partialMatch.id,
      code: partialMatch.notation || partialMatch.standardSet.code,
      description: partialMatch.description,
      curriculum: partialMatch.standardSet.jurisdiction.code,
      gradeLevel: String(partialMatch.standardSet.gradeLevel || ''),
      subject: partialMatch.standardSet.subject,
      strand: partialMatch.strand,
      prerequisites: partialMatch.prerequisites || [],
      progressesTo: partialMatch.progressesTo || [],
    };
  }

  return null;
}

/**
 * Match standards by topic label using keyword search against standard descriptions.
 * Used by the graph engine to invisibly link TOPIC nodes to curriculum standards.
 * Returns up to 5 best matches.
 */
async function matchStandardsByTopic(
  topicLabel: string,
  curriculum: string,
  subject?: string
): Promise<GraphCurriculumStandard[]> {
  const jurisdictionCode = getJurisdictionCode(curriculum);

  // Search for standards whose description contains the topic words
  const words = topicLabel.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  if (words.length === 0) return [];

  // Use the longest/most specific word for initial filtering
  const searchWord = words.sort((a, b) => b.length - a.length)[0];

  const matches = await prisma.learningStandard.findMany({
    where: {
      description: { contains: searchWord, mode: 'insensitive' },
      standardSet: {
        jurisdiction: { code: jurisdictionCode },
        ...(subject ? { subject: subject.toUpperCase() as Subject } : {}),
      },
    },
    select: {
      id: true,
      notation: true,
      description: true,
      strand: true,
      prerequisites: true,
      progressesTo: true,
      standardSet: {
        select: {
          code: true,
          subject: true,
          gradeLevel: true,
          jurisdiction: { select: { code: true } },
        },
      },
    },
    take: 5,
  });

  return matches.map(s => ({
    id: s.id,
    code: s.notation || s.standardSet.code,
    description: s.description,
    curriculum: s.standardSet.jurisdiction.code,
    gradeLevel: String(s.standardSet.gradeLevel || ''),
    subject: s.standardSet.subject,
    strand: s.strand,
    prerequisites: s.prerequisites || [],
    progressesTo: s.progressesTo || [],
  }));
}

/**
 * Get count of standards available for a given curriculum + grade + subject.
 * Useful for onboarding ("We have 342 standards for Year 3 Mathematics ready").
 */
async function getStandardsCount(
  curriculum: string,
  gradeLevel?: string,
  subject?: string
): Promise<number> {
  const jurisdictionCode = getJurisdictionCode(curriculum);
  const gradeRange = gradeLevel ? parseGradeRange(gradeLevel) : null;

  const standardSetWhere: Record<string, any> = {
    jurisdiction: { code: jurisdictionCode },
    ...(subject ? { subject: subject.toUpperCase() as Subject } : {}),
  };
  applyGradeRangeFilter(standardSetWhere, gradeRange);

  return prisma.learningStandard.count({
    where: { standardSet: standardSetWhere },
  });
}

/**
 * Get all strands (topic areas) for a curriculum + grade + subject.
 * Used to seed initial graph nodes as UNTOUCHED.
 */
async function getStrands(
  curriculum: string,
  gradeLevel: string,
  subject: string
): Promise<string[]> {
  const jurisdictionCode = getJurisdictionCode(curriculum);
  const gradeRange = parseGradeRange(gradeLevel);

  const standardSetWhere: Record<string, any> = {
    jurisdiction: { code: jurisdictionCode },
    subject: subject.toUpperCase() as Subject,
  };
  applyGradeRangeFilter(standardSetWhere, gradeRange);

  const standards = await prisma.learningStandard.findMany({
    where: {
      strand: { not: null },
      standardSet: standardSetWhere,
    },
    select: { strand: true },
    distinct: ['strand'],
  });

  return standards.map(s => s.strand!).filter(Boolean);
}

// ============================================
// EXPORT
// ============================================

export const curriculumAdapterService = {
  getStandardsForTeacher,
  getStandardById,
  matchStandard,
  matchStandardsByTopic,
  getStandardsCount,
  getStrands,
  getJurisdictionCode,
  parseGradeLevel,
  parseGradeRange,
};
