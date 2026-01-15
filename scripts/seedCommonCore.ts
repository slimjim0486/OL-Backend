/**
 * Seed Script: US Common Core State Standards
 *
 * Populates the database with Common Core standards for Grades K-8
 * - Mathematics: ~200 standards
 * - English Language Arts (ELA): ~350 standards
 *
 * Run with: npx tsx scripts/seedCommonCore.ts
 *
 * Options:
 *   --math-only     Seed only Mathematics standards
 *   --ela-only      Seed only ELA standards
 */

import { PrismaClient, Subject } from '@prisma/client';
import {
  commonCoreMathCurriculum,
  getTotalCommonCoreMathStandardsCount,
  CommonCoreMathStandard
} from '../src/config/commonCoreMath';
import {
  commonCoreELACurriculum,
  getTotalCommonCoreELAStandardsCount,
  CommonCoreELAStandard
} from '../src/config/commonCoreELA';

const prisma = new PrismaClient();

type AnyCommonCoreStandard = CommonCoreMathStandard | CommonCoreELAStandard;

const SUBJECT_MAP: Record<string, Subject> = {
  MATH: 'MATH',
  ENGLISH: 'ENGLISH'
};

function getConceptualArea(domain: string, subject: string): string {
  const mapping: Record<string, string> = {
    // Math domains
    'Counting and Cardinality': 'Number Sense',
    'Operations and Algebraic Thinking': 'Algebra',
    'Number and Operations in Base Ten': 'Number Sense',
    'Number and Operations - Fractions': 'Fractions',
    'Measurement and Data': 'Measurement',
    'Geometry': 'Geometry',
    'Ratios and Proportional Relationships': 'Ratio and Proportion',
    'The Number System': 'Number Sense',
    'Expressions and Equations': 'Algebra',
    'Statistics and Probability': 'Statistics',
    'Functions': 'Functions',
    // ELA domains
    'Reading Literature': 'Reading',
    'Reading Informational Text': 'Reading',
    'Reading Foundational Skills': 'Reading',
    'Writing': 'Writing',
    'Speaking and Listening': 'Oral Language',
    'Language': 'Language Conventions'
  };
  return mapping[domain] || domain;
}

function getAncestorDescriptions(domain: string, subject: string): string[] {
  if (subject === 'MATH') {
    if (domain.includes('Number') || domain.includes('Counting')) {
      return ['Mathematics', 'Number'];
    } else if (domain.includes('Geometry')) {
      return ['Mathematics', 'Geometry'];
    } else if (domain.includes('Measurement')) {
      return ['Mathematics', 'Measurement'];
    } else if (domain.includes('Algebra') || domain.includes('Operations') || domain.includes('Expressions')) {
      return ['Mathematics', 'Algebra'];
    } else if (domain.includes('Ratio')) {
      return ['Mathematics', 'Ratio and Proportion'];
    } else if (domain.includes('Statistics') || domain.includes('Probability')) {
      return ['Mathematics', 'Statistics'];
    } else if (domain.includes('Functions')) {
      return ['Mathematics', 'Functions'];
    }
    return ['Mathematics'];
  }

  if (subject === 'ENGLISH') {
    if (domain.includes('Reading')) {
      return ['English', 'Reading'];
    } else if (domain.includes('Writing')) {
      return ['English', 'Writing'];
    } else if (domain.includes('Speaking') || domain.includes('Listening')) {
      return ['English', 'Oral Language'];
    } else if (domain.includes('Language')) {
      return ['English', 'Language'];
    }
    return ['English'];
  }

  return [subject];
}

function groupByDomain<T extends AnyCommonCoreStandard>(standards: T[]): Record<string, T[]> {
  return standards.reduce((groups, std) => {
    const domain = std.domain;
    if (!groups[domain]) {
      groups[domain] = [];
    }
    groups[domain].push(std);
    return groups;
  }, {} as Record<string, T[]>);
}

interface SeedOptions {
  mathOnly?: boolean;
  elaOnly?: boolean;
}

async function seedCommonCore(options: SeedOptions = {}) {
  const { mathOnly, elaOnly } = options;
  const seedAll = !mathOnly && !elaOnly;

  console.log('\n========================================');
  console.log('  US Common Core State Standards Seeder');
  console.log('  (Grades K-8)');
  console.log('========================================\n');

  console.log('Curriculum Statistics:');
  if (seedAll || mathOnly) {
    console.log(`  Mathematics: ${getTotalCommonCoreMathStandardsCount()} standards`);
  }
  if (seedAll || elaOnly) {
    console.log(`  English Language Arts: ${getTotalCommonCoreELAStandardsCount()} standards`);
  }

  try {
    console.log('\n[1/3] Creating jurisdiction...');
    const jurisdiction = await prisma.curriculumJurisdiction.upsert({
      where: { code: 'US_COMMON_CORE' },
      update: {
        name: 'Common Core State Standards',
        country: 'US',
        version: '2010',
        sourceUrl: 'https://www.corestandards.org/',
        lastSyncedAt: new Date()
      },
      create: {
        code: 'US_COMMON_CORE',
        name: 'Common Core State Standards',
        country: 'US',
        version: '2010',
        sourceUrl: 'https://www.corestandards.org/',
        lastSyncedAt: new Date()
      }
    });
    console.log(`  Created/Updated: ${jurisdiction.name} (${jurisdiction.id})`);

    let totalCreated = 0;
    let totalUpdated = 0;

    if (seedAll || mathOnly) {
      console.log('\n[2/3] Seeding Mathematics standards...');
      const mathResult = await seedSubject(jurisdiction.id, commonCoreMathCurriculum, 'MATH');
      totalCreated += mathResult.created;
      totalUpdated += mathResult.updated;
    }

    if (seedAll || elaOnly) {
      console.log('\n[3/3] Seeding ELA standards...');
      const elaResult = await seedSubject(jurisdiction.id, commonCoreELACurriculum, 'ENGLISH');
      totalCreated += elaResult.created;
      totalUpdated += elaResult.updated;
    }

    console.log('\n========================================');
    console.log('  Seeding Complete!');
    console.log('========================================');
    console.log(`  Total Created: ${totalCreated}`);
    console.log(`  Total Updated: ${totalUpdated}`);
    console.log(`  Total Standards: ${totalCreated + totalUpdated}`);

    const dbCounts = await prisma.learningStandard.groupBy({
      by: ['standardSetId'],
      _count: { id: true },
      where: {
        standardSet: {
          jurisdiction: { code: 'US_COMMON_CORE' }
        }
      }
    });

    console.log('\n  Verification - Total US Common Core standards in database:');
    const totalInDb = dbCounts.reduce((sum, c) => sum + (c._count?.id || 0), 0);
    console.log(`    ${totalInDb} standards`);

  } catch (error) {
    console.error('\nError seeding curriculum:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

interface CurriculumData {
  code: string;
  name: string;
  country: string;
  version: string;
  sourceUrl: string;
  subject: string;
  grades: Array<{
    grade: number;
    gradeLabel: string;
    ageRangeMin: number;
    ageRangeMax: number;
    standards: AnyCommonCoreStandard[];
  }>;
}

async function seedSubject(
  jurisdictionId: string,
  curriculum: CurriculumData,
  subject: string
): Promise<{ created: number; updated: number }> {
  let totalCreated = 0;
  let totalUpdated = 0;

  console.log(`\n  Standards by Grade (${subject}):`);
  curriculum.grades.forEach(g => {
    console.log(`    Grade ${g.gradeLabel}: ${g.standards.length} standards`);
  });

  console.log(`\n  Creating standard sets...`);
  const standardSets: Map<string, string> = new Map();

  for (const gradeData of curriculum.grades) {
    const subjectCode = subject === 'MATH' ? 'MA' : 'ELA';
    const setCode = `US.CC.${gradeData.gradeLabel}.${subjectCode}`;

    const standardSet = await prisma.standardSet.upsert({
      where: {
        jurisdictionId_code: {
          jurisdictionId,
          code: setCode
        }
      },
      update: {
        title: `Grade ${gradeData.gradeLabel} ${subject === 'MATH' ? 'Mathematics' : 'English Language Arts'}`,
        subject: SUBJECT_MAP[subject],
        educationLevels: [`Grade ${gradeData.gradeLabel}`],
        gradeLevel: gradeData.grade,
        ageRangeMin: gradeData.ageRangeMin,
        ageRangeMax: gradeData.ageRangeMax,
        documentTitle: `Common Core ${subject === 'MATH' ? 'Mathematics' : 'ELA'} Standards for Grade ${gradeData.gradeLabel}`,
        documentYear: '2010'
      },
      create: {
        jurisdictionId,
        code: setCode,
        title: `Grade ${gradeData.gradeLabel} ${subject === 'MATH' ? 'Mathematics' : 'English Language Arts'}`,
        subject: SUBJECT_MAP[subject],
        educationLevels: [`Grade ${gradeData.gradeLabel}`],
        gradeLevel: gradeData.grade,
        ageRangeMin: gradeData.ageRangeMin,
        ageRangeMax: gradeData.ageRangeMax,
        documentTitle: `Common Core ${subject === 'MATH' ? 'Mathematics' : 'ELA'} Standards for Grade ${gradeData.gradeLabel}`,
        documentYear: '2010'
      }
    });

    standardSets.set(gradeData.gradeLabel, standardSet.id);
  }

  console.log(`\n  Creating learning standards...`);

  for (const gradeData of curriculum.grades) {
    const standardSetId = standardSets.get(gradeData.gradeLabel);
    if (!standardSetId) continue;

    let gradeCreated = 0;
    let gradeUpdated = 0;

    const domainGroups = groupByDomain(gradeData.standards);

    for (const [domain, standards] of Object.entries(domainGroups)) {
      for (let i = 0; i < standards.length; i++) {
        const std = standards[i];
        const position = i;

        const result = await prisma.learningStandard.upsert({
          where: {
            standardSetId_notation: {
              standardSetId,
              notation: std.notation
            }
          },
          update: {
            description: std.description,
            strand: std.domain,
            conceptualArea: getConceptualArea(std.domain, subject),
            isStatutory: true,
            guidance: std.cluster,
            position,
            depth: 0,
            ancestorDescriptions: getAncestorDescriptions(std.domain, subject)
          },
          create: {
            standardSetId,
            notation: std.notation,
            description: std.description,
            strand: std.domain,
            conceptualArea: getConceptualArea(std.domain, subject),
            isStatutory: true,
            guidance: std.cluster,
            position,
            depth: 0,
            ancestorDescriptions: getAncestorDescriptions(std.domain, subject)
          }
        });

        if (result.createdAt.getTime() === result.updatedAt.getTime()) {
          gradeCreated++;
          totalCreated++;
        } else {
          gradeUpdated++;
          totalUpdated++;
        }
      }
    }

    console.log(`    Grade ${gradeData.gradeLabel}: Created ${gradeCreated}, Updated ${gradeUpdated}`);
  }

  return { created: totalCreated, updated: totalUpdated };
}

const args = process.argv.slice(2);
const options: SeedOptions = {
  mathOnly: args.includes('--math-only'),
  elaOnly: args.includes('--ela-only')
};

seedCommonCore(options)
  .then(() => {
    console.log('\nDone!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to seed:', error);
    process.exit(1);
  });
