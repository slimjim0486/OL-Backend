/**
 * Curriculum Service
 * Queries learning standards from the database for content alignment
 */

import { prisma } from '../../config/database.js';
import { Subject, CurriculumType } from '@prisma/client';
import { logger } from '../../utils/logger.js';

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
 * Map detected subject string to Subject enum
 */
function normalizeSubject(detectedSubject: string | undefined): Subject | null {
  if (!detectedSubject) return null;

  const normalized = detectedSubject.toUpperCase();
  const validSubjects: Subject[] = ['MATH', 'SCIENCE', 'ENGLISH', 'ARABIC', 'ISLAMIC_STUDIES', 'SOCIAL_STUDIES', 'ART', 'MUSIC', 'OTHER'];

  // Handle common variations
  const mapping: Record<string, Subject> = {
    'MATH': 'MATH',
    'MATHS': 'MATH',
    'MATHEMATICS': 'MATH',
    'SCIENCE': 'SCIENCE',
    'ENGLISH': 'ENGLISH',
    'LANGUAGE_ARTS': 'ENGLISH',
    'ELA': 'ENGLISH',
    'READING': 'ENGLISH',
    'WRITING': 'ENGLISH',
  };

  return mapping[normalized] || (validSubjects.includes(normalized as Subject) ? normalized as Subject : null);
}

/**
 * Get all standards for a specific curriculum, subject, and grade level
 */
export async function getStandardsForGrade(
  curriculumType: CurriculumType,
  subject: Subject,
  gradeLevel: number
): Promise<StandardWithContext[]> {
  const jurisdictionCode = getJurisdictionCode(curriculumType);

  logger.info('Querying standards for grade', {
    curriculumType,
    jurisdictionCode,
    subject,
    gradeLevel,
  });

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

  logger.info(`Found ${standards.length} standards`, {
    curriculumType,
    subject,
    gradeLevel,
  });

  return standards;
}

/**
 * Get standards for a grade with optional adjacent grades for fuzzy matching
 * This helps when content spans multiple grade levels
 */
export async function getStandardsWithAdjacentGrades(
  curriculumType: CurriculumType,
  subject: Subject,
  gradeLevel: number,
  includeAdjacentGrades: boolean = true
): Promise<StandardWithContext[]> {
  const jurisdictionCode = getJurisdictionCode(curriculumType);

  // Build grade levels to query
  const gradeLevels = includeAdjacentGrades
    ? [Math.max(1, gradeLevel - 1), gradeLevel, Math.min(9, gradeLevel + 1)]
    : [gradeLevel];

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
 * Get standards by strand/topic for more focused alignment
 */
export async function getStandardsByStrand(
  curriculumType: CurriculumType,
  subject: Subject,
  gradeLevel: number,
  strand: string
): Promise<StandardWithContext[]> {
  const jurisdictionCode = getJurisdictionCode(curriculumType);

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
 */
export async function getAvailableSubjects(
  curriculumType: CurriculumType,
  gradeLevel: number
): Promise<Subject[]> {
  const jurisdictionCode = getJurisdictionCode(curriculumType);

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
 * Get all strands for a subject and grade
 */
export async function getAvailableStrands(
  curriculumType: CurriculumType,
  subject: Subject,
  gradeLevel: number
): Promise<string[]> {
  const jurisdictionCode = getJurisdictionCode(curriculumType);

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

/**
 * Count total standards for reporting/verification
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
      where.standardSet.jurisdiction = { code: getJurisdictionCode(curriculumType) };
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
 * Get strands for a specific year
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

  const jurisdictionCode = getJurisdictionCode(child.curriculumType);

  // Get all subjects available for this grade
  const subjects = await getAvailableSubjects(child.curriculumType, child.gradeLevel);

  // Get standards for each subject
  const standardsBySubject: Record<string, any[]> = {};

  for (const subject of subjects) {
    const standards = await getStandardsForGrade(child.curriculumType, subject, child.gradeLevel);
    standardsBySubject[subject] = standards;
  }

  return {
    curriculumType: child.curriculumType,
    gradeLevel: child.gradeLevel,
    jurisdictionCode,
    subjects,
    standardsBySubject,
    totalStandards: Object.values(standardsBySubject).flat().length,
  };
}

export const curriculumService = {
  getStandardsForGrade,
  getStandardsWithAdjacentGrades,
  getStandardsByStrand,
  getStandardByNotation,
  getAvailableSubjects,
  getAvailableStrands,
  countStandards,
  normalizeSubject,
  getJurisdictionCode,
  // Additional functions for routes
  getAllJurisdictions,
  getJurisdictionByCode,
  getStandardSets,
  getStandardsForYear,
  getStrandsForYear,
  searchStandards,
  getStandardById,
  getStandardsForChild,
};
