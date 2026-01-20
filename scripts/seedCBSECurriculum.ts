/**
 * Seed Script: CBSE (Central Board of Secondary Education) Curriculum Standards
 *
 * Populates the database with CBSE standards for Classes 1-8
 * - Mathematics: ~244 standards (Classes 1-8)
 * - Science: ~198 standards (Classes 1-8)
 * - English: ~197 standards (Classes 1-8)
 * - Social Science: ~156 standards (Classes 3-8)
 *
 * These are skill-based learning objectives aligned with CBSE/NCERT curriculum.
 * NOTE: Chapter-level mapping to NEP 2020 textbooks (2024-25) is pending.
 *
 * Run with: npx tsx scripts/seedCBSECurriculum.ts
 *
 * Options:
 *   --math-only            Seed only Mathematics standards
 *   --science-only         Seed only Science standards
 *   --english-only         Seed only English standards
 *   --social-science-only  Seed only Social Science standards
 */

import { PrismaClient, Subject } from '@prisma/client';
import {
  cbseMathCurriculum,
  getTotalCBSEMathStandardsCount,
  CBSEMathStandard
} from '../src/config/cbseMathCurriculum';
import {
  cbseScienceCurriculum,
  getTotalCBSEScienceStandardsCount,
  CBSEScienceStandard
} from '../src/config/cbseScienceCurriculum';
import {
  cbseEnglishCurriculum,
  getTotalCBSEEnglishStandardsCount,
  CBSEEnglishStandard
} from '../src/config/cbseEnglishCurriculum';
import {
  cbseSocialScienceCurriculum,
  getTotalCBSESocialScienceStandardsCount,
  CBSESocialScienceStandard
} from '../src/config/cbseSocialScienceCurriculum';

const prisma = new PrismaClient();

// Type for any CBSE standard
type AnyCBSEStandard = CBSEMathStandard | CBSEScienceStandard | CBSEEnglishStandard | CBSESocialScienceStandard;

// Subject to Prisma Subject enum mapping
const SUBJECT_MAP: Record<string, Subject> = {
  MATH: 'MATH',
  SCIENCE: 'SCIENCE',
  ENGLISH: 'ENGLISH',
  SOCIAL_SCIENCE: 'SOCIAL_STUDIES'
};

// Helper: Get conceptual area from strand
function getConceptualArea(strand: string, subject: string): string {
  const mapping: Record<string, string> = {
    // Math strands
    'Numbers and Operations': 'Number Sense',
    'Geometry': 'Geometry',
    'Measurement': 'Measurement',
    'Data Handling': 'Statistics and Data',
    'Patterns': 'Algebra and Patterns',
    'Fractions': 'Fractions',
    'Fractions and Decimals': 'Fractions and Decimals',
    'Algebra': 'Algebra',
    'Ratio and Proportion': 'Ratio and Proportion',
    'Integers': 'Number Sense',
    'Rational Numbers': 'Number Sense',
    'Exponents and Powers': 'Number Operations',
    'Squares and Square Roots': 'Number Operations',
    'Cubes and Cube Roots': 'Number Operations',
    'Mensuration': 'Measurement',
    'Graphs': 'Data and Graphs',
    'Solid Shapes': 'Geometry',
    'Symmetry': 'Geometry',

    // Science strands
    'Living World': 'Life Science',
    'Environment': 'Environmental Science',
    'Health and Hygiene': 'Health Education',
    'Family and Community': 'Social Studies',
    'Food': 'Nutrition',
    'Water': 'Environmental Science',
    'Shelter': 'Social Studies',
    'Travel and Transport': 'Social Studies',
    'Work and Play': 'Social Studies',
    'Biology': 'Life Science',
    'Chemistry': 'Physical Science',
    'Physics': 'Physical Science',
    'Astronomy': 'Earth and Space',
    'Earth and Space': 'Earth and Space',

    // English strands
    'Reading Comprehension': 'Reading',
    'Writing': 'Writing',
    'Grammar': 'Language Conventions',
    'Vocabulary': 'Vocabulary',
    'Listening and Speaking': 'Oral Language',
    'Literature': 'Literary Analysis',

    // Social Science strands
    'Family and Community': 'Social Studies',
    'Family and Society': 'Social Studies',
    'Environment and Resources': 'Environmental Studies',
    'Shelter and Housing': 'Social Studies',
    'Travel and Communication': 'Social Studies',
    'Maps and Directions': 'Geography',
    'Maps and Geography': 'Geography',
    'History and Heritage': 'History',
    'History': 'History',
    'Geography': 'Geography',
    'Geography and Maps': 'Geography',
    'Civics': 'Civics',
    'Economics': 'Economics'
  };
  return mapping[strand] || strand;
}

// Helper: Get ancestor descriptions for breadcrumb trail
function getAncestorDescriptions(strand: string, subject: string): string[] {
  if (subject === 'MATH') {
    if (strand.includes('Number') || strand.includes('Integer') || strand.includes('Rational')) {
      return ['Mathematics', 'Number'];
    } else if (strand.includes('Geometry') || strand.includes('Shapes') || strand === 'Symmetry') {
      return ['Mathematics', 'Geometry'];
    } else if (strand === 'Measurement' || strand === 'Mensuration') {
      return ['Mathematics', 'Measurement'];
    } else if (strand.includes('Data') || strand.includes('Graph')) {
      return ['Mathematics', 'Statistics'];
    } else if (strand.includes('Algebra') || strand.includes('Pattern')) {
      return ['Mathematics', 'Algebra'];
    } else if (strand.includes('Ratio') || strand.includes('Proportion')) {
      return ['Mathematics', 'Ratio and Proportion'];
    } else if (strand.includes('Fraction') || strand.includes('Decimal')) {
      return ['Mathematics', 'Fractions'];
    } else if (strand.includes('Exponent') || strand.includes('Square') || strand.includes('Cube')) {
      return ['Mathematics', 'Number Operations'];
    }
    return ['Mathematics'];
  }

  if (subject === 'SCIENCE') {
    if (strand === 'Biology' || strand === 'Living World') {
      return ['Science', 'Life Science'];
    } else if (strand === 'Chemistry') {
      return ['Science', 'Physical Science', 'Chemistry'];
    } else if (strand === 'Physics') {
      return ['Science', 'Physical Science', 'Physics'];
    } else if (strand.includes('Environment') || strand.includes('Water')) {
      return ['Science', 'Environmental Science'];
    } else if (strand.includes('Health')) {
      return ['Science', 'Health'];
    } else if (strand === 'Food') {
      return ['Science', 'Life Science', 'Nutrition'];
    } else if (strand.includes('Earth') || strand.includes('Astro')) {
      return ['Science', 'Earth and Space'];
    }
    return ['Science'];
  }

  if (subject === 'ENGLISH') {
    if (strand.includes('Reading')) {
      return ['English', 'Reading'];
    } else if (strand === 'Writing') {
      return ['English', 'Writing'];
    } else if (strand === 'Grammar') {
      return ['English', 'Language'];
    } else if (strand === 'Vocabulary') {
      return ['English', 'Vocabulary'];
    } else if (strand.includes('Listening') || strand.includes('Speaking')) {
      return ['English', 'Oral Language'];
    } else if (strand === 'Literature') {
      return ['English', 'Literature'];
    }
    return ['English'];
  }

  if (subject === 'SOCIAL_SCIENCE') {
    if (strand.includes('History') || strand.includes('Heritage')) {
      return ['Social Science', 'History'];
    } else if (strand.includes('Geography') || strand.includes('Maps')) {
      return ['Social Science', 'Geography'];
    } else if (strand.includes('Civics') || strand.includes('Society')) {
      return ['Social Science', 'Civics'];
    } else if (strand.includes('Economics')) {
      return ['Social Science', 'Economics'];
    } else if (strand.includes('Family') || strand.includes('Community')) {
      return ['Social Science', 'Social Studies'];
    } else if (strand.includes('Environment')) {
      return ['Social Science', 'Environmental Studies'];
    } else if (strand.includes('Travel') || strand.includes('Shelter')) {
      return ['Social Science', 'Social Studies'];
    }
    return ['Social Science'];
  }

  return [subject];
}

// Helper: Group standards by strand
function groupByStrand<T extends AnyCBSEStandard>(standards: T[]): Record<string, T[]> {
  return standards.reduce((groups, std) => {
    const strand = std.strand;
    if (!groups[strand]) {
      groups[strand] = [];
    }
    groups[strand].push(std);
    return groups;
  }, {} as Record<string, T[]>);
}

interface SeedOptions {
  mathOnly?: boolean;
  scienceOnly?: boolean;
  englishOnly?: boolean;
  socialScienceOnly?: boolean;
}

async function seedCBSECurriculum(options: SeedOptions = {}) {
  const { mathOnly, scienceOnly, englishOnly, socialScienceOnly } = options;
  const seedAll = !mathOnly && !scienceOnly && !englishOnly && !socialScienceOnly;

  console.log('\n========================================');
  console.log('  CBSE (India) Curriculum Seeder');
  console.log('  (Classes 1-8 - Based on NCERT)');
  console.log('========================================\n');

  // Show stats before seeding
  console.log('Curriculum Statistics:');
  if (seedAll || mathOnly) {
    console.log(`  Mathematics: ${getTotalCBSEMathStandardsCount()} standards`);
  }
  if (seedAll || scienceOnly) {
    console.log(`  Science: ${getTotalCBSEScienceStandardsCount()} standards`);
  }
  if (seedAll || englishOnly) {
    console.log(`  English: ${getTotalCBSEEnglishStandardsCount()} standards`);
  }
  if (seedAll || socialScienceOnly) {
    console.log(`  Social Science: ${getTotalCBSESocialScienceStandardsCount()} standards`);
  }

  try {
    // Step 1: Create or update the Jurisdiction
    console.log('\n[1/5] Creating jurisdiction...');
    const jurisdiction = await prisma.curriculumJurisdiction.upsert({
      where: { code: 'INDIAN_CBSE' },
      update: {
        name: 'Central Board of Secondary Education',
        country: 'IN',
        version: '2024-25',
        sourceUrl: 'https://ncert.nic.in/textbook.php',
        lastSyncedAt: new Date()
      },
      create: {
        code: 'INDIAN_CBSE',
        name: 'Central Board of Secondary Education',
        country: 'IN',
        version: '2024-25',
        sourceUrl: 'https://ncert.nic.in/textbook.php',
        lastSyncedAt: new Date()
      }
    });
    console.log(`  Created/Updated: ${jurisdiction.name} (${jurisdiction.id})`);

    let totalCreated = 0;
    let totalUpdated = 0;

    // Step 2: Seed Mathematics
    if (seedAll || mathOnly) {
      console.log('\n[2/5] Seeding Mathematics standards...');
      const mathResult = await seedSubject(
        jurisdiction.id,
        cbseMathCurriculum,
        'MATH'
      );
      totalCreated += mathResult.created;
      totalUpdated += mathResult.updated;
    }

    // Step 3: Seed Science
    if (seedAll || scienceOnly) {
      console.log('\n[3/5] Seeding Science standards...');
      const scienceResult = await seedSubject(
        jurisdiction.id,
        cbseScienceCurriculum,
        'SCIENCE'
      );
      totalCreated += scienceResult.created;
      totalUpdated += scienceResult.updated;
    }

    // Step 4: Seed English
    if (seedAll || englishOnly) {
      console.log('\n[4/5] Seeding English standards...');
      const englishResult = await seedSubject(
        jurisdiction.id,
        cbseEnglishCurriculum,
        'ENGLISH'
      );
      totalCreated += englishResult.created;
      totalUpdated += englishResult.updated;
    }

    // Step 5: Seed Social Science
    if (seedAll || socialScienceOnly) {
      console.log('\n[5/5] Seeding Social Science standards...');
      const socialScienceResult = await seedSubject(
        jurisdiction.id,
        cbseSocialScienceCurriculum,
        'SOCIAL_SCIENCE'
      );
      totalCreated += socialScienceResult.created;
      totalUpdated += socialScienceResult.updated;
    }

    // Summary
    console.log('\n========================================');
    console.log('  Seeding Complete!');
    console.log('========================================');
    console.log(`  Total Created: ${totalCreated}`);
    console.log(`  Total Updated: ${totalUpdated}`);
    console.log(`  Total Standards: ${totalCreated + totalUpdated}`);

    // Verify counts
    const dbCounts = await prisma.learningStandard.groupBy({
      by: ['standardSetId'],
      _count: { id: true },
      where: {
        standardSet: {
          jurisdiction: {
            code: 'INDIAN_CBSE'
          }
        }
      }
    });

    console.log('\n  Verification - Total CBSE standards in database:');
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
  classes: Array<{
    class: number;
    ageRangeMin: number;
    ageRangeMax: number;
    standards: AnyCBSEStandard[];
  }>;
}

async function seedSubject(
  jurisdictionId: string,
  curriculum: CurriculumData,
  subject: string
): Promise<{ created: number; updated: number }> {
  let totalCreated = 0;
  let totalUpdated = 0;

  // Show standards by class
  console.log(`\n  Standards by Class (${subject}):`);
  curriculum.classes.forEach(c => {
    console.log(`    Class ${c.class}: ${c.standards.length} standards`);
  });

  // Create StandardSets for each class
  console.log(`\n  Creating standard sets...`);
  const standardSets: Map<number, string> = new Map();

  for (const classData of curriculum.classes) {
    const subjectCode = subject === 'MATH' ? 'MA' : subject === 'SCIENCE' ? 'SC' : subject === 'ENGLISH' ? 'EN' : 'SS';
    const setCode = `IN.CBSE.C${classData.class}.${subjectCode}`;
    const standardSet = await prisma.standardSet.upsert({
      where: {
        jurisdictionId_code: {
          jurisdictionId,
          code: setCode
        }
      },
      update: {
        title: `Class ${classData.class} ${subject.charAt(0) + subject.slice(1).toLowerCase()}`,
        subject: SUBJECT_MAP[subject],
        educationLevels: [`C${classData.class}`],
        gradeLevel: classData.class,
        ageRangeMin: classData.ageRangeMin,
        ageRangeMax: classData.ageRangeMax,
        documentTitle: `NCERT ${subject.charAt(0) + subject.slice(1).toLowerCase()} for Class ${classData.class}`,
        documentYear: '2024'
      },
      create: {
        jurisdictionId,
        code: setCode,
        title: `Class ${classData.class} ${subject.charAt(0) + subject.slice(1).toLowerCase()}`,
        subject: SUBJECT_MAP[subject],
        educationLevels: [`C${classData.class}`],
        gradeLevel: classData.class,
        ageRangeMin: classData.ageRangeMin,
        ageRangeMax: classData.ageRangeMax,
        documentTitle: `NCERT ${subject.charAt(0) + subject.slice(1).toLowerCase()} for Class ${classData.class}`,
        documentYear: '2024'
      }
    });

    standardSets.set(classData.class, standardSet.id);
  }

  // Create Learning Standards
  console.log(`\n  Creating learning standards...`);

  for (const classData of curriculum.classes) {
    const standardSetId = standardSets.get(classData.class);
    if (!standardSetId) continue;

    let classCreated = 0;
    let classUpdated = 0;

    // Group standards by strand
    const strandGroups = groupByStrand(classData.standards);

    for (const [strand, standards] of Object.entries(strandGroups)) {
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
            strand: std.strand,
            conceptualArea: getConceptualArea(std.strand, subject),
            isStatutory: true,
            guidance: undefined, // Chapter mapping pending NEP 2020 alignment
            position,
            depth: 0,
            ancestorDescriptions: getAncestorDescriptions(std.strand, subject)
          },
          create: {
            standardSetId,
            notation: std.notation,
            description: std.description,
            strand: std.strand,
            conceptualArea: getConceptualArea(std.strand, subject),
            isStatutory: true,
            guidance: undefined, // Chapter mapping pending NEP 2020 alignment
            position,
            depth: 0,
            ancestorDescriptions: getAncestorDescriptions(std.strand, subject)
          }
        });

        // Check if it was created or updated
        if (result.createdAt.getTime() === result.updatedAt.getTime()) {
          classCreated++;
          totalCreated++;
        } else {
          classUpdated++;
          totalUpdated++;
        }
      }
    }

    console.log(`    Class ${classData.class}: Created ${classCreated}, Updated ${classUpdated}`);
  }

  return { created: totalCreated, updated: totalUpdated };
}

// Parse command line arguments
const args = process.argv.slice(2);
const options: SeedOptions = {
  mathOnly: args.includes('--math-only'),
  scienceOnly: args.includes('--science-only'),
  englishOnly: args.includes('--english-only'),
  socialScienceOnly: args.includes('--social-science-only')
};

// Run the seeder
seedCBSECurriculum(options)
  .then(() => {
    console.log('\nDone!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to seed:', error);
    process.exit(1);
  });
