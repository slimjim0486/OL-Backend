/**
 * Seed Script: British National Curriculum Mathematics Standards
 *
 * Populates the database with British NC Mathematics standards for Years 1-9
 * - KS1: Years 1-2 (Primary)
 * - KS2: Years 3-6 (Primary)
 * - KS3: Years 7-9 (Secondary)
 *
 * Verified against official GOV.UK documentation: 2025-01-14
 *
 * Run with: npx tsx scripts/seedBritishCurriculum.ts
 */

import { PrismaClient } from '@prisma/client';
import {
  britishNCMathematics,
  getTotalStandardsCount,
  BritishNCStandard,
  BritishNCYear
} from '../src/config/britishCurriculum';

const prisma = new PrismaClient();

// Strand to code mapping for notation generation
const strandCodes: Record<string, string> = {
  // KS1/KS2 strands
  'Number - Place Value': 'NPV',
  'Number - Addition and Subtraction': 'NAS',
  'Number - Multiplication and Division': 'NMD',
  'Number - Fractions': 'NFR',
  'Number - Fractions (including decimals and percentages)': 'NFR',
  'Number - Addition, Subtraction, Multiplication and Division': 'NASMD',
  'Number - Operations': 'NOP',
  'Measurement': 'MEA',
  'Geometry - Properties of Shapes': 'GPS',
  'Geometry - Position and Direction': 'GPD',
  'Statistics': 'STA',
  'Algebra': 'ALG',
  'Ratio and Proportion': 'RAT',
  // KS3 strands
  'Number': 'NUM',
  'Geometry and Measures': 'GEO',
  'Ratio, Proportion and Rates of Change': 'RAT',
  'Probability': 'PRB',
  'Working Mathematically - Develop Fluency': 'WMF',
  'Working Mathematically - Reason Mathematically': 'WMR',
  'Working Mathematically - Solve Problems': 'WMS'
};

async function seedBritishCurriculum() {
  console.log('\n========================================');
  console.log('  British National Curriculum Seeder');
  console.log('  (Years 1-9 - Verified Data)');
  console.log('========================================\n');

  // Show stats before seeding
  const totalStandards = getTotalStandardsCount();
  console.log('Curriculum Statistics:');
  console.log(`  Total Years: ${britishNCMathematics.years.length}`);
  console.log(`  Total Standards: ${totalStandards}`);
  console.log('\nStandards by Year:');
  britishNCMathematics.years.forEach(y => {
    console.log(`  Year ${y.year} (KS${y.keyStage}): ${y.standards.length} standards`);
  });

  try {
    // Step 1: Create or update the Jurisdiction
    console.log('\n[1/3] Creating jurisdiction...');
    const jurisdiction = await prisma.curriculumJurisdiction.upsert({
      where: { code: britishNCMathematics.code },
      update: {
        name: britishNCMathematics.name,
        country: britishNCMathematics.country,
        version: britishNCMathematics.version,
        sourceUrl: britishNCMathematics.sourceUrl,
        lastSyncedAt: new Date()
      },
      create: {
        code: britishNCMathematics.code,
        name: britishNCMathematics.name,
        country: britishNCMathematics.country,
        version: britishNCMathematics.version,
        sourceUrl: britishNCMathematics.sourceUrl,
        lastSyncedAt: new Date()
      }
    });
    console.log(`  Created/Updated: ${jurisdiction.name} (${jurisdiction.id})`);

    // Step 2: Create StandardSets for each year
    console.log('\n[2/3] Creating standard sets for each year...');
    const standardSets: Map<number, string> = new Map();

    for (const yearData of britishNCMathematics.years) {
      const setCode = `UK.KS${yearData.keyStage}.Y${yearData.year}.MA`;
      const standardSet = await prisma.standardSet.upsert({
        where: {
          jurisdictionId_code: {
            jurisdictionId: jurisdiction.id,
            code: setCode
          }
        },
        update: {
          title: `Year ${yearData.year} Mathematics`,
          subject: 'MATH',
          educationLevels: [`Y${yearData.year}`],
          gradeLevel: yearData.year,
          ageRangeMin: yearData.ageRangeMin,
          ageRangeMax: yearData.ageRangeMax,
          documentTitle: 'National curriculum in England: mathematics programmes of study',
          documentYear: '2014'
        },
        create: {
          jurisdictionId: jurisdiction.id,
          code: setCode,
          title: `Year ${yearData.year} Mathematics`,
          subject: 'MATH',
          educationLevels: [`Y${yearData.year}`],
          gradeLevel: yearData.year,
          ageRangeMin: yearData.ageRangeMin,
          ageRangeMax: yearData.ageRangeMax,
          documentTitle: 'National curriculum in England: mathematics programmes of study',
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

    for (const yearData of britishNCMathematics.years) {
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
      console.log(`    Year ${year}: ${count} standards`);
    }

  } catch (error) {
    console.error('\nError seeding curriculum:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Helper: Group standards by strand
function groupByStrand(standards: BritishNCStandard[]): Record<string, BritishNCStandard[]> {
  return standards.reduce((groups, std) => {
    const strand = std.strand;
    if (!groups[strand]) {
      groups[strand] = [];
    }
    groups[strand].push(std);
    return groups;
  }, {} as Record<string, BritishNCStandard[]>);
}

// Helper: Get conceptual area from strand
function getConceptualArea(strand: string): string {
  const mapping: Record<string, string> = {
    // KS1/KS2 strands
    'Number - Place Value': 'Place Value',
    'Number - Addition and Subtraction': 'Operations',
    'Number - Multiplication and Division': 'Operations',
    'Number - Fractions': 'Fractions, Decimals, Percentages',
    'Number - Fractions (including decimals and percentages)': 'Fractions, Decimals, Percentages',
    'Number - Addition, Subtraction, Multiplication and Division': 'Operations',
    'Number - Operations': 'Operations',
    'Measurement': 'Measurement',
    'Geometry - Properties of Shapes': 'Properties of Shapes',
    'Geometry - Position and Direction': 'Position and Direction',
    'Statistics': 'Data Handling',
    'Algebra': 'Algebra',
    'Ratio and Proportion': 'Ratio and Proportion',
    // KS3 strands
    'Number': 'Number',
    'Geometry and Measures': 'Geometry and Measures',
    'Ratio, Proportion and Rates of Change': 'Ratio and Proportion',
    'Probability': 'Probability',
    'Working Mathematically - Develop Fluency': 'Mathematical Fluency',
    'Working Mathematically - Reason Mathematically': 'Mathematical Reasoning',
    'Working Mathematically - Solve Problems': 'Problem Solving'
  };
  return mapping[strand] || strand;
}

// Helper: Get ancestor descriptions for breadcrumb trail
function getAncestorDescriptions(strand: string): string[] {
  // Main category mapping
  const mainCategory = strand.split(' - ')[0] || strand;

  if (mainCategory === 'Number' || strand.startsWith('Number -')) {
    return ['Mathematics', 'Number'];
  } else if (strand.startsWith('Geometry') || strand === 'Geometry and Measures') {
    return ['Mathematics', 'Geometry'];
  } else if (strand === 'Measurement') {
    return ['Mathematics', 'Measurement'];
  } else if (strand === 'Statistics') {
    return ['Mathematics', 'Statistics'];
  } else if (strand === 'Algebra') {
    return ['Mathematics', 'Algebra'];
  } else if (strand.includes('Ratio') || strand.includes('Proportion')) {
    return ['Mathematics', 'Ratio and Proportion'];
  } else if (strand === 'Probability') {
    return ['Mathematics', 'Probability'];
  } else if (strand.startsWith('Working Mathematically')) {
    return ['Mathematics', 'Working Mathematically'];
  }

  return ['Mathematics'];
}

// Run the seeder
seedBritishCurriculum()
  .then(() => {
    console.log('\nDone!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to seed:', error);
    process.exit(1);
  });
