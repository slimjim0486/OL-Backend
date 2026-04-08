/**
 * Seed Script: ICSE (Indian Certificate of Secondary Education / CISCE) Standards
 *
 * Populates the database with ICSE standards for Classes 1-12.
 * Target subjects: Mathematics, Science, English, Social Science.
 *
 * Source: Content files in src/config/icse*Curriculum.ts, each of which
 * documents its sourcing in the file header (primarily CISCE ICSE 2028
 * syllabus PDFs for Classes 9-10, ISC 2028 for 11-12, and CISCE-aligned
 * Selina/Frank primary publishers for Classes 1-8).
 *
 * Run with: npx tsx scripts/seedIndianICSE.ts
 *
 * Options:
 *   --math-only            Seed only Mathematics standards
 *   --science-only         Seed only Science standards
 *   --english-only         Seed only English standards
 *   --social-science-only  Seed only Social Science standards
 *
 * Safety: Uses upsert at all three levels (jurisdiction, standard set,
 * learning standard) so the seeder is idempotent and can be re-run without
 * creating duplicates.
 */

import { PrismaClient, Subject } from '@prisma/client';
import {
  icseMathCurriculum,
  getTotalICSEMathStandardsCount,
  ICSEMathStandard
} from '../src/config/icseMathCurriculum';
import {
  icseScienceCurriculum,
  getTotalICSEScienceStandardsCount,
  ICSEScienceStandard
} from '../src/config/icseScienceCurriculum';
import {
  icseEnglishCurriculum,
  getTotalICSEEnglishStandardsCount,
  ICSEEnglishStandard
} from '../src/config/icseEnglishCurriculum';
import {
  icseSocialScienceCurriculum,
  getTotalICSESocialScienceStandardsCount,
  ICSESocialScienceStandard
} from '../src/config/icseSocialScienceCurriculum';

const prisma = new PrismaClient();

// Type for any ICSE standard
type AnyICSEStandard = ICSEMathStandard | ICSEScienceStandard | ICSEEnglishStandard | ICSESocialScienceStandard;

// Subject to Prisma Subject enum mapping
const SUBJECT_MAP: Record<string, Subject> = {
  MATH: 'MATH',
  SCIENCE: 'SCIENCE',
  ENGLISH: 'ENGLISH',
  SOCIAL_SCIENCE: 'SOCIAL_STUDIES'
};

// Helper: Get conceptual area from strand (same taxonomy as CBSE seeder)
function getConceptualArea(strand: string, subject: string): string {
  // Use the leading portion of the strand (before any dash) for matching
  const baseStrand = strand.split(' - ')[0].trim();

  const mapping: Record<string, string> = {
    // Math
    'Numbers and Operations': 'Number Sense',
    'Integers': 'Number Sense',
    'Rational Numbers': 'Number Sense',
    'Rational and Irrational Numbers': 'Number Sense',
    'Squares and Square Roots': 'Number Operations',
    'Cubes and Cube Roots': 'Number Operations',
    'Exponents and Powers': 'Number Operations',
    'Fractions and Decimals': 'Fractions and Decimals',
    'Ratio and Proportion': 'Ratio and Proportion',
    'Ratio and Percentage': 'Ratio and Proportion',
    'Percentage': 'Ratio and Proportion',
    'Profit and Loss': 'Commercial Mathematics',
    'Simple Interest': 'Commercial Mathematics',
    'Compound Interest': 'Commercial Mathematics',
    'Direct and Inverse Proportion': 'Ratio and Proportion',
    'Time Work and Distance': 'Commercial Mathematics',
    'Percentage and Profit Loss': 'Commercial Mathematics',
    'Pure Arithmetic': 'Number Sense',
    'Commercial Mathematics': 'Commercial Mathematics',
    'Algebra': 'Algebra',
    'Geometry': 'Geometry',
    'Measurement': 'Measurement',
    'Mensuration': 'Measurement',
    'Money': 'Commercial Mathematics',
    'Time': 'Measurement',
    'Patterns': 'Algebra and Patterns',
    'Data Handling': 'Statistics and Data',
    'Statistics': 'Statistics and Data',
    'Probability': 'Probability',
    'Sets': 'Sets and Logic',
    'Trigonometry': 'Trigonometry',
    'Coordinate Geometry': 'Coordinate Geometry',
    'Relations and Functions': 'Algebra',
    'Inverse Trigonometric Functions': 'Trigonometry',
    'Matrices': 'Algebra',
    'Determinants': 'Algebra',
    'Continuity and Differentiability': 'Calculus',
    'Applications of Derivatives': 'Calculus',
    'Integrals': 'Calculus',
    'Applications of Integrals': 'Calculus',
    'Differential Equations': 'Calculus',
    'Vectors': 'Vectors and 3D',
    'Three-Dimensional Geometry': 'Vectors and 3D',
    'Linear Programming': 'Applied Mathematics',
    'Principle of Mathematical Induction': 'Algebra',
    'Complex Numbers': 'Algebra',
    'Quadratic Equations': 'Algebra',
    'Permutations and Combinations': 'Algebra',
    'Binomial Theorem': 'Algebra',
    'Sequence and Series': 'Algebra',
    'Straight Lines': 'Coordinate Geometry',
    'Conic Sections': 'Coordinate Geometry',
    'Limits and Derivatives': 'Calculus',
    'Mathematical Reasoning': 'Sets and Logic',
    'Application of Calculus in Commerce': 'Applied Mathematics',

    // Science
    'Living World': 'Life Science',
    'Plants': 'Life Science',
    'Animals': 'Life Science',
    'Human Body': 'Life Science',
    'Materials': 'Physical Science',
    'Matter': 'Physical Science',
    'Environment': 'Environmental Science',
    'Health and Hygiene': 'Health Education',
    'Food and Health': 'Health Education',
    'Weather, Air and Water': 'Earth and Space',
    'Weather and Climate': 'Earth and Space',
    'Air': 'Earth and Space',
    'Water': 'Earth and Space',
    'Our Earth': 'Earth and Space',
    'Energy and Machines': 'Physical Science',
    'Energy and Force': 'Physical Science',
    'Earth and Space': 'Earth and Space',
    'Physics': 'Physical Science',
    'Chemistry': 'Physical Science',
    'Biology': 'Life Science',
    'Travel and Communication': 'Social Studies',

    // English
    'Reading Comprehension': 'Reading',
    'Writing': 'Writing',
    'Grammar': 'Language Conventions',
    'Grammar and Usage': 'Language Conventions',
    'Vocabulary': 'Vocabulary',
    'Listening and Speaking': 'Oral Language',
    'Literature': 'Literary Analysis',
    'Creative Writing': 'Writing',
    'Academic Writing': 'Writing',

    // Social Science
    'Family and Community': 'Social Studies',
    'Our Country': 'Social Studies',
    'Physical Features': 'Geography',
    'Our Heritage': 'History',
    'Maps and Globe': 'Geography',
    'Maps and Directions': 'Geography',
    'Transport and Communication': 'Social Studies',
    'Occupations': 'Social Studies',
    'Earth and Maps': 'Geography',
    'Continents': 'Geography',
    'Natural Resources': 'Geography',
    'Early Civilizations': 'History',
    'India Through the Ages': 'History',
    'Government and Citizenship': 'Civics',
    'United Nations': 'Civics',
    'Environment and Resources': 'Geography',
    'History and Heritage': 'History',
    'History': 'History',
    'Geography': 'Geography',
    'Civics': 'Civics',
    'Political Science': 'Civics',
    'Economics': 'Economics'
  };
  return mapping[baseStrand] || baseStrand;
}

// Helper: Get ancestor descriptions for breadcrumb trail
function getAncestorDescriptions(strand: string, subject: string): string[] {
  const base = strand.split(' - ')[0].trim();

  if (subject === 'MATH') {
    if (base.includes('Number') || base === 'Integers' || base.includes('Rational') || base.includes('Irrational')) {
      return ['Mathematics', 'Number'];
    } else if (base.includes('Geometry') || base === 'Shapes' || base === 'Similarity') {
      return ['Mathematics', 'Geometry'];
    } else if (base === 'Measurement' || base === 'Mensuration') {
      return ['Mathematics', 'Measurement'];
    } else if (base === 'Statistics' || base === 'Data Handling') {
      return ['Mathematics', 'Statistics'];
    } else if (base === 'Probability') {
      return ['Mathematics', 'Probability'];
    } else if (base === 'Algebra' || base === 'Sets' || base.includes('Quadratic') || base.includes('Complex')) {
      return ['Mathematics', 'Algebra'];
    } else if (base === 'Trigonometry' || base === 'Inverse Trigonometric Functions') {
      return ['Mathematics', 'Trigonometry'];
    } else if (base === 'Coordinate Geometry' || base === 'Straight Lines' || base === 'Conic Sections') {
      return ['Mathematics', 'Coordinate Geometry'];
    } else if (base === 'Vectors' || base === 'Three-Dimensional Geometry') {
      return ['Mathematics', 'Vectors'];
    } else if (base.includes('Calculus') || base.includes('Derivative') || base.includes('Integral') || base.includes('Limit') || base.includes('Differential')) {
      return ['Mathematics', 'Calculus'];
    } else if (base.includes('Commercial') || base.includes('Interest') || base.includes('Profit') || base.includes('Percentage')) {
      return ['Mathematics', 'Commercial Mathematics'];
    } else if (base.includes('Fraction') || base.includes('Decimal')) {
      return ['Mathematics', 'Fractions'];
    } else if (base.includes('Exponent') || base.includes('Square') || base.includes('Cube')) {
      return ['Mathematics', 'Number Operations'];
    } else if (base === 'Money' || base === 'Time') {
      return ['Mathematics', 'Measurement'];
    } else if (base.includes('Linear Programming')) {
      return ['Mathematics', 'Applied Mathematics'];
    }
    return ['Mathematics'];
  }

  if (subject === 'SCIENCE') {
    if (base === 'Physics' || base.startsWith('Physics')) {
      return ['Science', 'Physical Science', 'Physics'];
    } else if (base === 'Chemistry' || base.startsWith('Chemistry')) {
      return ['Science', 'Physical Science', 'Chemistry'];
    } else if (base === 'Biology' || base.startsWith('Biology') || base === 'Living World' || base === 'Plants' || base === 'Animals' || base === 'Human Body') {
      return ['Science', 'Life Science'];
    } else if (base.includes('Environment') || base.includes('Water') || base === 'Air' || base.includes('Weather') || base.includes('Climate') || base === 'Our Earth' || base === 'Earth and Space') {
      return ['Science', 'Earth and Space'];
    } else if (base === 'Materials' || base === 'Matter') {
      return ['Science', 'Physical Science'];
    } else if (base.includes('Health')) {
      return ['Science', 'Health'];
    } else if (base.includes('Energy') || base.includes('Machines')) {
      return ['Science', 'Physical Science'];
    }
    return ['Science'];
  }

  if (subject === 'ENGLISH') {
    if (base.includes('Reading')) {
      return ['English', 'Reading'];
    } else if (base === 'Writing' || base === 'Creative Writing' || base === 'Academic Writing') {
      return ['English', 'Writing'];
    } else if (base === 'Grammar' || base === 'Grammar and Usage') {
      return ['English', 'Language'];
    } else if (base === 'Vocabulary') {
      return ['English', 'Vocabulary'];
    } else if (base.includes('Listening') || base.includes('Speaking')) {
      return ['English', 'Oral Language'];
    } else if (base === 'Literature') {
      return ['English', 'Literature'];
    }
    return ['English'];
  }

  if (subject === 'SOCIAL_SCIENCE') {
    if (base === 'History' || base.includes('History')) {
      return ['Social Science', 'History'];
    } else if (base === 'Geography' || base.includes('Geography') || base.includes('Maps') || base === 'Continents' || base === 'Physical Features' || base === 'Earth and Maps' || base === 'Environment and Resources') {
      return ['Social Science', 'Geography'];
    } else if (base === 'Civics' || base.includes('Civics') || base.includes('Government') || base === 'United Nations') {
      return ['Social Science', 'Civics'];
    } else if (base === 'Political Science' || base.includes('Political Science')) {
      return ['Social Science', 'Political Science'];
    } else if (base === 'Economics' || base.includes('Economics')) {
      return ['Social Science', 'Economics'];
    } else if (base.includes('Family') || base.includes('Community') || base === 'Occupations' || base === 'Our Country') {
      return ['Social Science', 'Social Studies'];
    } else if (base.includes('Travel') || base.includes('Transport') || base.includes('Communication')) {
      return ['Social Science', 'Social Studies'];
    } else if (base === 'Our Heritage' || base === 'Early Civilizations' || base === 'India Through the Ages' || base === 'History and Heritage') {
      return ['Social Science', 'History'];
    }
    return ['Social Science'];
  }

  return [subject];
}

// Helper: Group standards by strand
function groupByStrand<T extends AnyICSEStandard>(standards: T[]): Record<string, T[]> {
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

async function seedICSECurriculum(options: SeedOptions = {}) {
  const { mathOnly, scienceOnly, englishOnly, socialScienceOnly } = options;
  const seedAll = !mathOnly && !scienceOnly && !englishOnly && !socialScienceOnly;

  console.log('\n========================================');
  console.log('  ICSE (India / CISCE) Curriculum Seeder');
  console.log('  (Classes 1-12)');
  console.log('========================================\n');

  // Show stats before seeding
  console.log('Curriculum Statistics:');
  if (seedAll || mathOnly) {
    console.log(`  Mathematics: ${getTotalICSEMathStandardsCount()} standards`);
  }
  if (seedAll || scienceOnly) {
    console.log(`  Science: ${getTotalICSEScienceStandardsCount()} standards`);
  }
  if (seedAll || englishOnly) {
    console.log(`  English: ${getTotalICSEEnglishStandardsCount()} standards`);
  }
  if (seedAll || socialScienceOnly) {
    console.log(`  Social Science: ${getTotalICSESocialScienceStandardsCount()} standards`);
  }

  try {
    // Step 1: Create or update the Jurisdiction
    console.log('\n[1/5] Creating jurisdiction...');
    const jurisdiction = await prisma.curriculumJurisdiction.upsert({
      where: { code: 'INDIAN_ICSE' },
      update: {
        name: 'Indian Certificate of Secondary Education (CISCE)',
        country: 'IN',
        version: '2027-28',
        sourceUrl: 'https://cisce.org/regulations-and-syllabus-icse-2028/',
        lastSyncedAt: new Date()
      },
      create: {
        code: 'INDIAN_ICSE',
        name: 'Indian Certificate of Secondary Education (CISCE)',
        country: 'IN',
        version: '2027-28',
        sourceUrl: 'https://cisce.org/regulations-and-syllabus-icse-2028/',
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
        icseMathCurriculum,
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
        icseScienceCurriculum,
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
        icseEnglishCurriculum,
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
        icseSocialScienceCurriculum,
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
            code: 'INDIAN_ICSE'
          }
        }
      }
    });

    console.log('\n  Verification - Total ICSE standards in database:');
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
    standards: AnyICSEStandard[];
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
    const setCode = `IN.ICSE.C${classData.class}.${subjectCode}`;
    const subjectDisplay = subject.charAt(0) + subject.slice(1).toLowerCase().replace('_', ' ');
    const standardSet = await prisma.standardSet.upsert({
      where: {
        jurisdictionId_code: {
          jurisdictionId,
          code: setCode
        }
      },
      update: {
        title: `Class ${classData.class} ${subjectDisplay}`,
        subject: SUBJECT_MAP[subject],
        educationLevels: [`C${classData.class}`],
        gradeLevel: classData.class,
        ageRangeMin: classData.ageRangeMin,
        ageRangeMax: classData.ageRangeMax,
        documentTitle: `CISCE ICSE ${subjectDisplay} for Class ${classData.class}`,
        documentYear: '2028'
      },
      create: {
        jurisdictionId,
        code: setCode,
        title: `Class ${classData.class} ${subjectDisplay}`,
        subject: SUBJECT_MAP[subject],
        educationLevels: [`C${classData.class}`],
        gradeLevel: classData.class,
        ageRangeMin: classData.ageRangeMin,
        ageRangeMax: classData.ageRangeMax,
        documentTitle: `CISCE ICSE ${subjectDisplay} for Class ${classData.class}`,
        documentYear: '2028'
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
            guidance: undefined,
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
            guidance: undefined,
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
seedICSECurriculum(options)
  .then(() => {
    console.log('\nDone!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to seed:', error);
    process.exit(1);
  });
