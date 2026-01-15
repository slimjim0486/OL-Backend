/**
 * Seed Script: British National Curriculum English Standards
 *
 * Populates the database with British NC English standards for Years 1-9
 * - KS1: Years 1-2 (Primary)
 * - KS2: Years 3-6 (Primary)
 * - KS3: Years 7-9 (Secondary)
 *
 * Verified against official GOV.UK documentation: 2025-01-15
 *
 * Run with: npx tsx scripts/seedBritishEnglishCurriculum.ts
 */

import { PrismaClient } from '@prisma/client';
import {
  britishNCEnglish,
  getTotalEnglishStandardsCount,
  BritishNCEnglishStandard,
  BritishNCEnglishYear
} from '../src/config/britishEnglishCurriculum';

const prisma = new PrismaClient();

// Strand to code mapping for notation generation
const strandCodes: Record<string, string> = {
  // KS1/KS2 strands
  'Spoken Language': 'SL',
  'Reading - Word Reading': 'RWR',
  'Reading - Comprehension': 'RC',
  'Writing - Transcription (Spelling)': 'WTS',
  'Writing - Transcription (Handwriting)': 'WTH',
  'Writing - Composition': 'WC',
  'Writing - Vocabulary, Grammar and Punctuation': 'WVG',
  // KS3 strands
  'Reading': 'R',
  'Writing': 'W',
  'Grammar and Vocabulary': 'GV',
  'Spoken English': 'SE'
};

async function seedBritishEnglishCurriculum() {
  console.log('\n========================================');
  console.log('  British National Curriculum English Seeder');
  console.log('  (Years 1-9 - Verified Data)');
  console.log('========================================\n');

  // Show stats before seeding
  const totalStandards = getTotalEnglishStandardsCount();
  console.log('Curriculum Statistics:');
  console.log(`  Total Years: ${britishNCEnglish.years.length}`);
  console.log(`  Total Standards: ${totalStandards}`);
  console.log('\nStandards by Year:');
  britishNCEnglish.years.forEach(y => {
    console.log(`  Year ${y.year} (KS${y.keyStage}): ${y.standards.length} standards`);
  });

  try {
    // Step 1: Get or create the Jurisdiction (should already exist from Math seeding)
    console.log('\n[1/3] Getting/Creating jurisdiction...');
    const jurisdiction = await prisma.curriculumJurisdiction.upsert({
      where: { code: britishNCEnglish.code },
      update: {
        name: britishNCEnglish.name,
        country: britishNCEnglish.country,
        version: britishNCEnglish.version,
        sourceUrl: britishNCEnglish.sourceUrl,
        lastSyncedAt: new Date()
      },
      create: {
        code: britishNCEnglish.code,
        name: britishNCEnglish.name,
        country: britishNCEnglish.country,
        version: britishNCEnglish.version,
        sourceUrl: britishNCEnglish.sourceUrl,
        lastSyncedAt: new Date()
      }
    });
    console.log(`  Using jurisdiction: ${jurisdiction.name} (${jurisdiction.id})`);

    // Step 2: Create StandardSets for each year (English)
    console.log('\n[2/3] Creating standard sets for each year (English)...');
    const standardSets: Map<number, string> = new Map();

    for (const yearData of britishNCEnglish.years) {
      const setCode = `UK.KS${yearData.keyStage}.Y${yearData.year}.EN`;
      const standardSet = await prisma.standardSet.upsert({
        where: {
          jurisdictionId_code: {
            jurisdictionId: jurisdiction.id,
            code: setCode
          }
        },
        update: {
          title: `Year ${yearData.year} English`,
          subject: 'ENGLISH',
          educationLevels: [`Y${yearData.year}`],
          gradeLevel: yearData.year,
          ageRangeMin: yearData.ageRangeMin,
          ageRangeMax: yearData.ageRangeMax,
          documentTitle: 'National curriculum in England: English programmes of study',
          documentYear: '2014'
        },
        create: {
          jurisdictionId: jurisdiction.id,
          code: setCode,
          title: `Year ${yearData.year} English`,
          subject: 'ENGLISH',
          educationLevels: [`Y${yearData.year}`],
          gradeLevel: yearData.year,
          ageRangeMin: yearData.ageRangeMin,
          ageRangeMax: yearData.ageRangeMax,
          documentTitle: 'National curriculum in England: English programmes of study',
          documentYear: '2014'
        }
      });

      standardSets.set(yearData.year, standardSet.id);
      console.log(`  Year ${yearData.year}: ${standardSet.id}`);
    }

    // Step 3: Create Learning Standards
    console.log('\n[3/3] Creating learning standards...');
    let totalCreated = 0;
    let totalUpdated = 0;

    for (const yearData of britishNCEnglish.years) {
      const standardSetId = standardSets.get(yearData.year);
      if (!standardSetId) continue;

      console.log(`\n  Year ${yearData.year}:`);
      let yearCreated = 0;
      let yearUpdated = 0;

      // Group standards by strand for better organization
      const strandGroups = groupByStrand(yearData.standards);

      for (const [strand, standards] of Object.entries(strandGroups)) {
        for (let i = 0; i < standards.length; i++) {
          const std = standards[i];
          const position = i;

          // Determine ancestor descriptions based on strand
          const ancestorDescriptions = getAncestorDescriptions(strand);

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
              conceptualArea: getConceptualArea(std.strand),
              isStatutory: std.isStatutory,
              guidance: std.guidance,
              position,
              depth: 0,
              ancestorDescriptions
            },
            create: {
              standardSetId,
              notation: std.notation,
              description: std.description,
              strand: std.strand,
              conceptualArea: getConceptualArea(std.strand),
              isStatutory: std.isStatutory,
              guidance: std.guidance,
              position,
              depth: 0,
              ancestorDescriptions
            }
          });

          // Check if it was created or updated
          if (result.createdAt.getTime() === result.updatedAt.getTime()) {
            yearCreated++;
            totalCreated++;
          } else {
            yearUpdated++;
            totalUpdated++;
          }
        }
      }

      console.log(`    Created: ${yearCreated}, Updated: ${yearUpdated}`);
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
      _count: { id: true }
    });

    console.log('\n  Verification - Standards per year:');
    for (const [year, setId] of standardSets) {
      const count = dbCounts.find(c => c.standardSetId === setId)?._count?.id || 0;
      const expected = britishNCEnglish.years.find(y => y.year === year)?.standards.length || 0;
      const status = count === expected ? '✓' : `❌ (expected ${expected})`;
      console.log(`    Year ${year}: ${count} standards ${status}`);
    }

  } catch (error) {
    console.error('\nError seeding curriculum:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Helper: Group standards by strand
function groupByStrand(standards: BritishNCEnglishStandard[]): Record<string, BritishNCEnglishStandard[]> {
  return standards.reduce((groups, std) => {
    const strand = std.strand;
    if (!groups[strand]) {
      groups[strand] = [];
    }
    groups[strand].push(std);
    return groups;
  }, {} as Record<string, BritishNCEnglishStandard[]>);
}

// Helper: Get conceptual area from strand
function getConceptualArea(strand: string): string {
  const mapping: Record<string, string> = {
    // KS1/KS2 strands
    'Spoken Language': 'Speaking and Listening',
    'Reading - Word Reading': 'Decoding and Fluency',
    'Reading - Comprehension': 'Reading Comprehension',
    'Writing - Transcription (Spelling)': 'Spelling',
    'Writing - Transcription (Handwriting)': 'Handwriting',
    'Writing - Composition': 'Writing Composition',
    'Writing - Vocabulary, Grammar and Punctuation': 'Grammar and Punctuation',
    // KS3 strands
    'Reading': 'Reading',
    'Writing': 'Writing',
    'Grammar and Vocabulary': 'Grammar and Vocabulary',
    'Spoken English': 'Speaking and Listening'
  };
  return mapping[strand] || strand;
}

// Helper: Get ancestor descriptions for breadcrumb trail
function getAncestorDescriptions(strand: string): string[] {
  // Main category mapping
  if (strand === 'Spoken Language' || strand === 'Spoken English') {
    return ['English', 'Speaking and Listening'];
  } else if (strand.startsWith('Reading')) {
    return ['English', 'Reading'];
  } else if (strand.startsWith('Writing')) {
    return ['English', 'Writing'];
  } else if (strand === 'Grammar and Vocabulary') {
    return ['English', 'Grammar'];
  }

  return ['English'];
}

// Run the seeder
seedBritishEnglishCurriculum()
  .then(() => {
    console.log('\nDone!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to seed:', error);
    process.exit(1);
  });
