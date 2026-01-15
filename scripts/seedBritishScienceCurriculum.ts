/**
 * Seed Script: British National Curriculum Science Standards
 *
 * Populates the database with British NC Science standards for Years 1-9
 * - KS1: Years 1-2 (Primary)
 * - KS2: Years 3-6 (Primary)
 * - KS3: Years 7-9 (Secondary)
 *
 * Verified against official GOV.UK documentation: 2025-01-15
 *
 * Run with: npx tsx scripts/seedBritishScienceCurriculum.ts
 */

import { PrismaClient } from '@prisma/client';
import {
  britishNCScience,
  getTotalScienceStandardsCount,
  BritishNCScienceStandard,
  BritishNCScienceYear
} from '../src/config/britishScienceCurriculum';

const prisma = new PrismaClient();

async function seedBritishScienceCurriculum() {
  console.log('\n========================================');
  console.log('  British National Curriculum Science Seeder');
  console.log('  (Years 1-9 - Verified Data)');
  console.log('========================================\n');

  // Show stats before seeding
  const totalStandards = getTotalScienceStandardsCount();
  console.log('Curriculum Statistics:');
  console.log(`  Total Years: ${britishNCScience.years.length}`);
  console.log(`  Total Standards: ${totalStandards}`);
  console.log('\nStandards by Year:');
  britishNCScience.years.forEach(y => {
    console.log(`  Year ${y.year} (KS${y.keyStage}): ${y.standards.length} standards`);
  });

  try {
    // Step 1: Get or create the Jurisdiction (should already exist from Math/English seeding)
    console.log('\n[1/3] Getting/Creating jurisdiction...');
    const jurisdiction = await prisma.curriculumJurisdiction.upsert({
      where: { code: britishNCScience.code },
      update: {
        name: britishNCScience.name,
        country: britishNCScience.country,
        version: britishNCScience.version,
        sourceUrl: britishNCScience.sourceUrl,
        lastSyncedAt: new Date()
      },
      create: {
        code: britishNCScience.code,
        name: britishNCScience.name,
        country: britishNCScience.country,
        version: britishNCScience.version,
        sourceUrl: britishNCScience.sourceUrl,
        lastSyncedAt: new Date()
      }
    });
    console.log(`  Using jurisdiction: ${jurisdiction.name} (${jurisdiction.id})`);

    // Step 2: Create StandardSets for each year (Science)
    console.log('\n[2/3] Creating standard sets for each year (Science)...');
    const standardSets: Map<number, string> = new Map();

    for (const yearData of britishNCScience.years) {
      const setCode = `UK.KS${yearData.keyStage}.Y${yearData.year}.SC`;
      const standardSet = await prisma.standardSet.upsert({
        where: {
          jurisdictionId_code: {
            jurisdictionId: jurisdiction.id,
            code: setCode
          }
        },
        update: {
          title: `Year ${yearData.year} Science`,
          subject: 'SCIENCE',
          educationLevels: [`Y${yearData.year}`],
          gradeLevel: yearData.year,
          ageRangeMin: yearData.ageRangeMin,
          ageRangeMax: yearData.ageRangeMax,
          documentTitle: 'National curriculum in England: science programmes of study',
          documentYear: '2014'
        },
        create: {
          jurisdictionId: jurisdiction.id,
          code: setCode,
          title: `Year ${yearData.year} Science`,
          subject: 'SCIENCE',
          educationLevels: [`Y${yearData.year}`],
          gradeLevel: yearData.year,
          ageRangeMin: yearData.ageRangeMin,
          ageRangeMax: yearData.ageRangeMax,
          documentTitle: 'National curriculum in England: science programmes of study',
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

    for (const yearData of britishNCScience.years) {
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
          const ancestorDescriptions = getAncestorDescriptions(std.strand);

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
      const expected = britishNCScience.years.find(y => y.year === year)?.standards.length || 0;
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
function groupByStrand(standards: BritishNCScienceStandard[]): Record<string, BritishNCScienceStandard[]> {
  return standards.reduce((groups, std) => {
    const strand = std.strand;
    if (!groups[strand]) {
      groups[strand] = [];
    }
    groups[strand].push(std);
    return groups;
  }, {} as Record<string, BritishNCScienceStandard[]>);
}

// Helper: Get conceptual area from strand
function getConceptualArea(strand: string): string {
  const mapping: Record<string, string> = {
    // KS1/KS2 strands
    'Working Scientifically': 'Scientific Enquiry',
    'Plants': 'Biology - Life Processes',
    'Animals, including humans': 'Biology - Life Processes',
    'Everyday Materials': 'Chemistry - Materials',
    'Uses of Everyday Materials': 'Chemistry - Materials',
    'Seasonal Changes': 'Earth Science',
    'Living Things and their Habitats': 'Biology - Ecology',
    'Rocks': 'Earth Science',
    'Light': 'Physics - Light',
    'Forces and Magnets': 'Physics - Forces',
    'Forces': 'Physics - Forces',
    'States of Matter': 'Chemistry - Matter',
    'Sound': 'Physics - Sound',
    'Electricity': 'Physics - Electricity',
    'Properties and Changes of Materials': 'Chemistry - Materials',
    'Earth and Space': 'Earth Science',
    'Evolution and Inheritance': 'Biology - Evolution',
    // KS3 strands
    'Working Scientifically - Scientific Attitudes': 'Scientific Enquiry',
    'Working Scientifically - Experimental Skills': 'Scientific Enquiry',
    'Working Scientifically - Analysis and Evaluation': 'Scientific Enquiry',
    'Working Scientifically - Measurement': 'Scientific Enquiry',
    'Biology - Cells and Organisation': 'Biology - Cells',
    'Biology - Skeletal and Muscular Systems': 'Biology - Human Body',
    'Biology - Nutrition and Digestion': 'Biology - Human Body',
    'Biology - Gas Exchange Systems': 'Biology - Human Body',
    'Biology - Reproduction': 'Biology - Life Processes',
    'Biology - Photosynthesis': 'Biology - Plants',
    'Biology - Cellular Respiration': 'Biology - Energy',
    'Biology - Ecosystems': 'Biology - Ecology',
    'Biology - Genetics and Evolution': 'Biology - Evolution',
    'Chemistry - Particulate Nature of Matter': 'Chemistry - Matter',
    'Chemistry - Atoms, Elements and Compounds': 'Chemistry - Matter',
    'Chemistry - Pure and Impure Substances': 'Chemistry - Matter',
    'Chemistry - Chemical Reactions': 'Chemistry - Reactions',
    'Chemistry - Energetics': 'Chemistry - Energy',
    'Chemistry - Periodic Table': 'Chemistry - Elements',
    'Chemistry - Earth and Atmosphere': 'Earth Science',
    'Physics - Energy': 'Physics - Energy',
    'Physics - Motion and Forces': 'Physics - Forces',
    'Physics - Waves': 'Physics - Waves',
    'Physics - Electricity and Magnetism': 'Physics - Electricity',
    'Physics - Matter': 'Physics - Matter',
    'Physics - Space Physics': 'Earth Science'
  };
  return mapping[strand] || strand;
}

// Helper: Get ancestor descriptions for breadcrumb trail
function getAncestorDescriptions(strand: string): string[] {
  if (strand.startsWith('Working Scientifically')) {
    return ['Science', 'Scientific Enquiry'];
  } else if (strand.startsWith('Biology') || strand === 'Plants' || strand.includes('Animals') || strand.includes('Living Things') || strand === 'Evolution and Inheritance') {
    return ['Science', 'Biology'];
  } else if (strand.startsWith('Chemistry') || strand.includes('Materials') || strand.includes('Matter') || strand === 'Rocks') {
    return ['Science', 'Chemistry'];
  } else if (strand.startsWith('Physics') || strand === 'Light' || strand.includes('Forces') || strand === 'Sound' || strand === 'Electricity') {
    return ['Science', 'Physics'];
  } else if (strand === 'Seasonal Changes' || strand === 'Earth and Space') {
    return ['Science', 'Earth Science'];
  }

  return ['Science'];
}

// Run the seeder
seedBritishScienceCurriculum()
  .then(() => {
    console.log('\nDone!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to seed:', error);
    process.exit(1);
  });
