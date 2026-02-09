/**
 * Seed Script: IB MYP & DP Curriculum Standards (4 subjects)
 *
 * Populates the database with IB MYP/DP standards for Grades 6-12:
 * - Mathematics: MYP Y1-5, DP Y1-2
 * - English/Language: MYP Y1-5, DP Y1-2
 * - Sciences: MYP Y1-5, DP Y1-2
 * - Individuals & Societies: MYP M1-5, DP DP1-2
 *
 * Run with: npx tsx scripts/seedIBMYPDP.ts
 *
 * Options:
 *   --math-only       Seed only Mathematics
 *   --english-only    Seed only English
 *   --science-only    Seed only Sciences
 *   --is-only         Seed only Individuals & Societies
 */

import { PrismaClient, Subject } from '@prisma/client';
import {
  ibMYPDPMathCurriculum,
  getIBMathStandardsCount,
  IBMYPDPMathStandard
} from '../src/config/ibMYPDPMathCurriculum';
import {
  ibMYPDPEnglishCurriculum,
  getTotalIBMYPDPEnglishStandardsCount,
  IBMYPDPEnglishStandard
} from '../src/config/ibMYPDPEnglishCurriculum';
import {
  ibMYPDPScienceCurriculum,
  getIBScienceStandardsCount,
  IBMYPDPScienceStandard
} from '../src/config/ibMYPDPScienceCurriculum';
import {
  ibIndividualsSocietiesYears,
  getIndividualsSocietiesStandardsCount,
  IBIndividualsSocietiesStandard,
  IBIndividualsSocietiesYear
} from '../src/config/ibMYPDPIndividualsSocietiesCurriculum';

const prisma = new PrismaClient();

const SUBJECT_MAP: Record<string, Subject> = {
  MATH: 'MATH',
  ENGLISH: 'ENGLISH',
  SCIENCE: 'SCIENCE',
  SOCIAL_STUDIES: 'SOCIAL_STUDIES'
};

// ============================================================================
// CONCEPTUAL AREA HELPERS
// ============================================================================

function getMathConceptualArea(branch: string): string {
  const mapping: Record<string, string> = {
    'Numerical and Abstract Reasoning': 'Number and Algebra',
    'Thinking with Models': 'Algebra and Functions',
    'Spatial Reasoning': 'Geometry',
    'Reasoning with Data': 'Statistics and Probability',
    'Number and Algebra': 'Number and Algebra',
    'Functions': 'Functions',
    'Geometry and Trigonometry': 'Geometry',
    'Statistics and Probability': 'Statistics and Probability',
    'Calculus': 'Calculus',
  };
  return mapping[branch] || branch;
}

function getEnglishConceptualArea(strand: string): string {
  const mapping: Record<string, string> = {
    'Analyzing': 'Literary Analysis',
    'Organizing': 'Writing Process',
    'Producing Text': 'Writing',
    'Using Language': 'Language Use',
    'Readers, Writers and Texts': 'Literary Analysis',
    'Time and Space': 'Literary Analysis',
    'Intertextuality': 'Literary Analysis',
    'Literary Forms': 'Literary Analysis',
    'Global Issues': 'Literary Analysis',
  };
  return mapping[strand] || strand;
}

function getScienceConceptualArea(discipline: string): string {
  const mapping: Record<string, string> = {
    'Integrated': 'General Science',
    'Biology': 'Life Science',
    'Chemistry': 'Physical Science',
    'Physics': 'Physical Science',
  };
  return mapping[discipline] || discipline;
}

function getISConceptualArea(strand: string): string {
  const mapping: Record<string, string> = {
    'History': 'History',
    'Geography': 'Geography',
    'Economics': 'Economics',
    'Society and Culture': 'Social Studies',
    'Investigation Skills': 'Research Skills',
    'Critical Thinking': 'Critical Thinking',
    'World History': 'History',
    'HL Extension': 'History',
    'Internal Assessment': 'Research Skills',
    'Physical Geography': 'Geography',
    'Human Geography': 'Geography',
    'Global Interactions': 'Geography',
    'Microeconomics': 'Economics',
    'Macroeconomics': 'Economics',
    'International Economics': 'Economics',
    'Development Economics': 'Economics',
    'Politics and Governance': 'Political Science',
    'Global Politics': 'Political Science',
  };
  return mapping[strand] || strand;
}

// ============================================================================
// ANCESTOR DESCRIPTION HELPERS
// ============================================================================

function getMathAncestors(branch: string): string[] {
  if (branch.includes('Numerical') || branch.includes('Number')) {
    return ['Mathematics', 'Number and Algebra'];
  } else if (branch.includes('Model') || branch.includes('Function') || branch.includes('Calculus')) {
    return ['Mathematics', 'Functions and Analysis'];
  } else if (branch.includes('Spatial') || branch.includes('Geometry')) {
    return ['Mathematics', 'Geometry'];
  } else if (branch.includes('Data') || branch.includes('Statistic') || branch.includes('Probability')) {
    return ['Mathematics', 'Statistics and Probability'];
  }
  return ['Mathematics'];
}

function getEnglishAncestors(strand: string): string[] {
  if (['Analyzing', 'Readers, Writers and Texts', 'Time and Space', 'Intertextuality', 'Literary Forms', 'Global Issues'].includes(strand)) {
    return ['English', 'Literary Analysis'];
  } else if (['Organizing', 'Producing Text'].includes(strand)) {
    return ['English', 'Writing'];
  } else if (strand === 'Using Language') {
    return ['English', 'Language'];
  }
  return ['English'];
}

function getScienceAncestors(discipline: string): string[] {
  if (discipline === 'Biology') {
    return ['Science', 'Life Science'];
  } else if (discipline === 'Chemistry') {
    return ['Science', 'Physical Science', 'Chemistry'];
  } else if (discipline === 'Physics') {
    return ['Science', 'Physical Science', 'Physics'];
  } else if (discipline === 'Integrated') {
    return ['Science'];
  }
  return ['Science'];
}

function getISAncestors(strand: string): string[] {
  if (strand.includes('History') || strand === 'World History' || strand === 'HL Extension') {
    return ['Individuals and Societies', 'History'];
  } else if (strand.includes('Geography') || strand === 'Physical Geography' || strand === 'Human Geography' || strand === 'Global Interactions') {
    return ['Individuals and Societies', 'Geography'];
  } else if (strand.includes('Econ') || strand === 'Microeconomics' || strand === 'Macroeconomics' || strand === 'International Economics' || strand === 'Development Economics') {
    return ['Individuals and Societies', 'Economics'];
  } else if (strand === 'Society and Culture' || strand === 'Investigation Skills' || strand === 'Critical Thinking') {
    return ['Individuals and Societies', 'Social Studies'];
  } else if (strand.includes('Politic') || strand === 'Global Politics') {
    return ['Individuals and Societies', 'Political Science'];
  } else if (strand === 'Internal Assessment') {
    return ['Individuals and Societies', 'Research'];
  }
  return ['Individuals and Societies'];
}

// ============================================================================
// GENERIC SEEDER FOR YEAR-BASED CURRICULA
// ============================================================================

interface YearData<T> {
  year: number;
  grade: number;
  programme: 'MYP' | 'DP';
  yearLabel: string;
  ageRangeMin: number;
  ageRangeMax: number;
  standards: T[];
}

async function seedSubjectYears<T extends { notation: string; strand?: string; description: string }>(
  jurisdictionId: string,
  years: YearData<T>[],
  subject: Subject,
  subjectCode: string,
  getStrandKey: (std: T) => string,
  getConceptualAreaFn: (std: T) => string,
  getAncestorsFn: (std: T) => string[],
  getGuidance?: (std: T) => string | undefined,
): Promise<{ created: number; updated: number }> {
  let totalCreated = 0;
  let totalUpdated = 0;

  console.log(`\n  Standards by Year:`);
  years.forEach(y => {
    console.log(`    ${y.yearLabel}: ${y.standards.length} standards`);
  });

  console.log(`\n  Creating standard sets...`);
  const standardSets: Map<string, string> = new Map();

  for (const yearData of years) {
    const yearCode = yearData.programme === 'MYP' ? `Y${yearData.year}` : `Y${yearData.year}`;
    const setCode = `IB.${yearData.programme}.${yearCode}.${subjectCode}`;

    const standardSet = await prisma.standardSet.upsert({
      where: {
        jurisdictionId_code: {
          jurisdictionId,
          code: setCode
        }
      },
      update: {
        title: `IB ${yearData.programme} ${subject === 'SOCIAL_STUDIES' ? 'Individuals & Societies' : subject.charAt(0) + subject.slice(1).toLowerCase()} - ${yearData.yearLabel}`,
        subject,
        educationLevels: [`Grade ${yearData.grade}`],
        gradeLevel: yearData.grade,
        ageRangeMin: yearData.ageRangeMin,
        ageRangeMax: yearData.ageRangeMax,
        documentTitle: `IB ${yearData.programme} ${subject === 'SOCIAL_STUDIES' ? 'Individuals & Societies' : subject.charAt(0) + subject.slice(1).toLowerCase()} Guide`,
        documentYear: yearData.programme === 'MYP' ? '2020' : '2019'
      },
      create: {
        jurisdictionId,
        code: setCode,
        title: `IB ${yearData.programme} ${subject === 'SOCIAL_STUDIES' ? 'Individuals & Societies' : subject.charAt(0) + subject.slice(1).toLowerCase()} - ${yearData.yearLabel}`,
        subject,
        educationLevels: [`Grade ${yearData.grade}`],
        gradeLevel: yearData.grade,
        ageRangeMin: yearData.ageRangeMin,
        ageRangeMax: yearData.ageRangeMax,
        documentTitle: `IB ${yearData.programme} ${subject === 'SOCIAL_STUDIES' ? 'Individuals & Societies' : subject.charAt(0) + subject.slice(1).toLowerCase()} Guide`,
        documentYear: yearData.programme === 'MYP' ? '2020' : '2019'
      }
    });

    const key = `${yearData.programme}_${yearData.year}`;
    standardSets.set(key, standardSet.id);
  }

  console.log(`\n  Creating learning standards...`);

  for (const yearData of years) {
    const key = `${yearData.programme}_${yearData.year}`;
    const standardSetId = standardSets.get(key);
    if (!standardSetId) continue;

    let yearCreated = 0;
    let yearUpdated = 0;

    // Group by strand
    const strandGroups: Record<string, T[]> = {};
    for (const std of yearData.standards) {
      const strandKey = getStrandKey(std);
      if (!strandGroups[strandKey]) {
        strandGroups[strandKey] = [];
      }
      strandGroups[strandKey].push(std);
    }

    let position = 0;
    for (const [, standards] of Object.entries(strandGroups)) {
      for (const std of standards) {
        const result = await prisma.learningStandard.upsert({
          where: {
            standardSetId_notation: {
              standardSetId,
              notation: std.notation
            }
          },
          update: {
            description: std.description,
            strand: getStrandKey(std),
            conceptualArea: getConceptualAreaFn(std),
            isStatutory: true,
            guidance: getGuidance ? getGuidance(std) : undefined,
            position,
            depth: 0,
            ancestorDescriptions: getAncestorsFn(std)
          },
          create: {
            standardSetId,
            notation: std.notation,
            description: std.description,
            strand: getStrandKey(std),
            conceptualArea: getConceptualAreaFn(std),
            isStatutory: true,
            guidance: getGuidance ? getGuidance(std) : undefined,
            position,
            depth: 0,
            ancestorDescriptions: getAncestorsFn(std)
          }
        });

        position++;
        if (result.createdAt.getTime() === result.updatedAt.getTime()) {
          yearCreated++;
          totalCreated++;
        } else {
          yearUpdated++;
          totalUpdated++;
        }
      }
    }

    console.log(`    ${yearData.yearLabel}: Created ${yearCreated}, Updated ${yearUpdated}`);
  }

  return { created: totalCreated, updated: totalUpdated };
}

// ============================================================================
// MAIN SEEDER
// ============================================================================

interface SeedOptions {
  mathOnly?: boolean;
  englishOnly?: boolean;
  scienceOnly?: boolean;
  isOnly?: boolean;
}

async function seedIBMYPDP(options: SeedOptions = {}) {
  const { mathOnly, englishOnly, scienceOnly, isOnly } = options;
  const seedAll = !mathOnly && !englishOnly && !scienceOnly && !isOnly;

  console.log('\n========================================');
  console.log('  IB MYP/DP Curriculum Seeder');
  console.log('  (Grades 6-12, Ages 11-18)');
  console.log('========================================\n');

  console.log('Curriculum Statistics:');
  if (seedAll || mathOnly) {
    console.log(`  Mathematics: ${getIBMathStandardsCount()} standards`);
  }
  if (seedAll || englishOnly) {
    console.log(`  English/Language: ${getTotalIBMYPDPEnglishStandardsCount()} standards`);
  }
  if (seedAll || scienceOnly) {
    console.log(`  Sciences: ${getIBScienceStandardsCount()} standards`);
  }
  if (seedAll || isOnly) {
    console.log(`  Individuals & Societies: ${getIndividualsSocietiesStandardsCount()} standards`);
  }

  try {
    // Step 1: Create or update the Jurisdiction
    console.log('\n[1/5] Creating jurisdiction...');
    const jurisdiction = await prisma.curriculumJurisdiction.upsert({
      where: { code: 'IB_MYP_DP' },
      update: {
        name: 'International Baccalaureate MYP & Diploma Programme',
        country: 'INTERNATIONAL',
        version: '2020',
        sourceUrl: 'https://www.ibo.org/programmes/',
        lastSyncedAt: new Date()
      },
      create: {
        code: 'IB_MYP_DP',
        name: 'International Baccalaureate MYP & Diploma Programme',
        country: 'INTERNATIONAL',
        version: '2020',
        sourceUrl: 'https://www.ibo.org/programmes/',
        lastSyncedAt: new Date()
      }
    });
    console.log(`  Created/Updated: ${jurisdiction.name} (${jurisdiction.id})`);

    let totalCreated = 0;
    let totalUpdated = 0;

    // Step 2: Seed Mathematics
    if (seedAll || mathOnly) {
      console.log('\n[2/5] Seeding Mathematics standards...');
      const mathResult = await seedSubjectYears<IBMYPDPMathStandard>(
        jurisdiction.id,
        ibMYPDPMathCurriculum.years,
        SUBJECT_MAP['MATH'],
        'MA',
        (std) => std.branch,
        (std) => getMathConceptualArea(std.branch),
        (std) => getMathAncestors(std.branch),
        (std) => std.level ? `Level: ${std.level}` : undefined,
      );
      totalCreated += mathResult.created;
      totalUpdated += mathResult.updated;
    }

    // Step 3: Seed English
    if (seedAll || englishOnly) {
      console.log('\n[3/5] Seeding English/Language standards...');
      const englishResult = await seedSubjectYears<IBMYPDPEnglishStandard>(
        jurisdiction.id,
        ibMYPDPEnglishCurriculum.years,
        SUBJECT_MAP['ENGLISH'],
        'EN',
        (std) => std.strand,
        (std) => getEnglishConceptualArea(std.strand),
        (std) => getEnglishAncestors(std.strand),
        (std) => std.level ? `Level: ${std.level}` : undefined,
      );
      totalCreated += englishResult.created;
      totalUpdated += englishResult.updated;
    }

    // Step 4: Seed Sciences
    if (seedAll || scienceOnly) {
      console.log('\n[4/5] Seeding Sciences standards...');
      const scienceResult = await seedSubjectYears<IBMYPDPScienceStandard>(
        jurisdiction.id,
        ibMYPDPScienceCurriculum.years,
        SUBJECT_MAP['SCIENCE'],
        'SC',
        (std) => std.discipline,
        (std) => getScienceConceptualArea(std.discipline),
        (std) => getScienceAncestors(std.discipline),
        (std) => std.level ? `Level: ${std.level}` : undefined,
      );
      totalCreated += scienceResult.created;
      totalUpdated += scienceResult.updated;
    }

    // Step 5: Seed Individuals & Societies
    if (seedAll || isOnly) {
      console.log('\n[5/5] Seeding Individuals & Societies standards...');
      // Need to adapt the year data structure - it uses string 'year' field
      const isYears: YearData<IBIndividualsSocietiesStandard>[] = ibIndividualsSocietiesYears.map(y => {
        // Parse year string to get grade mapping
        const gradeMap: Record<string, number> = {
          'M1': 6, 'M2': 7, 'M3': 8, 'M4': 9, 'M5': 10,
          'DP1': 11, 'DP2': 12
        };
        return {
          year: parseInt(y.year.replace('M', '').replace('DP', '')),
          grade: gradeMap[y.year] || 6,
          programme: y.programme,
          yearLabel: y.yearLabel,
          ageRangeMin: y.ageRangeMin,
          ageRangeMax: y.ageRangeMax,
          standards: y.standards,
        };
      });

      const isResult = await seedSubjectYears<IBIndividualsSocietiesStandard>(
        jurisdiction.id,
        isYears,
        SUBJECT_MAP['SOCIAL_STUDIES'],
        'IS',
        (std) => std.strand,
        (std) => getISConceptualArea(std.strand),
        (std) => getISAncestors(std.strand),
      );
      totalCreated += isResult.created;
      totalUpdated += isResult.updated;
    }

    // Summary
    console.log('\n========================================');
    console.log('  Seeding Complete!');
    console.log('========================================');
    console.log(`  Total Created: ${totalCreated}`);
    console.log(`  Total Updated: ${totalUpdated}`);
    console.log(`  Total Standards: ${totalCreated + totalUpdated}`);

    // Verification
    const dbCounts = await prisma.learningStandard.groupBy({
      by: ['standardSetId'],
      _count: { id: true },
      where: {
        standardSet: {
          jurisdiction: { code: 'IB_MYP_DP' }
        }
      }
    });

    console.log('\n  Verification - Total IB MYP/DP standards in database:');
    const totalInDb = dbCounts.reduce((sum, c) => sum + (c._count?.id || 0), 0);
    console.log(`    ${totalInDb} standards`);

  } catch (error) {
    console.error('\nError seeding curriculum:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const options: SeedOptions = {
  mathOnly: args.includes('--math-only'),
  englishOnly: args.includes('--english-only'),
  scienceOnly: args.includes('--science-only'),
  isOnly: args.includes('--is-only')
};

seedIBMYPDP(options)
  .then(() => {
    console.log('\nDone!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to seed:', error);
    process.exit(1);
  });
