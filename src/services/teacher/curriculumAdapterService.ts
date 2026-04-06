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

// Map grade range strings to numeric grade levels for querying
function parseGradeLevel(gradeRange: string): number | null {
  // Handle "year3", "grade4", "Y3", "3", etc.
  const match = gradeRange.match(/(\d+)/);
  return match ? parseInt(match[1]) : null;
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
  const numericGrade = parseGradeLevel(gradeLevel);

  const whereClause: any = {
    standardSet: {
      jurisdiction: { code: jurisdictionCode },
    },
  };

  // Filter by grade if we can parse it
  if (numericGrade !== null) {
    whereClause.standardSet.gradeLevel = numericGrade;
  }

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
 * Get count of standards available for a given curriculum + grade + subject.
 * Useful for onboarding ("We have 342 standards for Year 3 Mathematics ready").
 */
async function getStandardsCount(
  curriculum: string,
  gradeLevel?: string,
  subject?: string
): Promise<number> {
  const jurisdictionCode = getJurisdictionCode(curriculum);
  const numericGrade = gradeLevel ? parseGradeLevel(gradeLevel) : null;

  return prisma.learningStandard.count({
    where: {
      standardSet: {
        jurisdiction: { code: jurisdictionCode },
        ...(numericGrade !== null ? { gradeLevel: numericGrade } : {}),
        ...(subject ? { subject: subject.toUpperCase() as Subject } : {}),
      },
    },
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
  const numericGrade = parseGradeLevel(gradeLevel);

  const standards = await prisma.learningStandard.findMany({
    where: {
      strand: { not: null },
      standardSet: {
        jurisdiction: { code: jurisdictionCode },
        ...(numericGrade !== null ? { gradeLevel: numericGrade } : {}),
        subject: subject.toUpperCase() as Subject,
      },
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
  getStandardsCount,
  getStrands,
  getJurisdictionCode,
  parseGradeLevel,
};
