/**
 * Seed Script: British National Curriculum Geography Standards
 *
 * Populates the database with British NC Geography standards for Years 1-9
 * - KS1: Years 1-2 (Primary)
 * - KS2: Years 3-6 (Primary)
 * - KS3: Years 7-9 (Secondary)
 *
 * Verified against official GOV.UK documentation: 2025-01-20
 *
 * Run with: npx tsx scripts/seedBritishGeographyCurriculum.ts
 */

import { PrismaClient } from '@prisma/client';
import {
  britishNCGeography,
  getTotalGeographyStandardsCount,
  BritishNCGeographyStandard,
  BritishNCGeographyYear
} from '../src/config/britishGeographyCurriculum';

const prisma = new PrismaClient();

async function seedBritishGeographyCurriculum() {
  console.log('\n========================================');
  console.log('  British National Curriculum Geography Seeder');
  console.log('  (Years 1-9 - Verified Data)');
  console.log('========================================\n');

  // Show stats before seeding
  const totalStandards = getTotalGeographyStandardsCount();
  console.log('Curriculum Statistics:');
  console.log(`  Total Years: ${britishNCGeography.years.length}`);
  console.log(`  Total Standards: ${totalStandards}`);
  console.log('\nStandards by Year:');
  britishNCGeography.years.forEach(y => {
    console.log(`  Year ${y.year} (KS${y.keyStage}): ${y.standards.length} standards`);
  });

  try {
    // Step 1: Get or create the Jurisdiction (should already exist from Math/English/Science seeding)
    console.log('\n[1/3] Getting/Creating jurisdiction...');
    const jurisdiction = await prisma.curriculumJurisdiction.upsert({
      where: { code: britishNCGeography.code },
      update: {
        name: 'British National Curriculum',
        country: britishNCGeography.country,
        version: britishNCGeography.version,
        sourceUrl: britishNCGeography.sourceUrl,
        lastSyncedAt: new Date()
      },
      create: {
        code: britishNCGeography.code,
        name: 'British National Curriculum',
        country: britishNCGeography.country,
        version: britishNCGeography.version,
        sourceUrl: britishNCGeography.sourceUrl,
        lastSyncedAt: new Date()
      }
    });
    console.log(`  Using jurisdiction: ${jurisdiction.name} (${jurisdiction.id})`);

    // Step 2: Create StandardSets for each year (Geography)
    console.log('\n[2/3] Creating standard sets for each year (Geography)...');
    const standardSets: Map<number, string> = new Map();

    for (const yearData of britishNCGeography.years) {
      const setCode = `UK.KS${yearData.keyStage}.Y${yearData.year}.GEO`;
      const standardSet = await prisma.standardSet.upsert({
        where: {
          jurisdictionId_code: {
            jurisdictionId: jurisdiction.id,
            code: setCode
          }
        },
        update: {
          title: `Year ${yearData.year} Geography`,
          subject: 'GEOGRAPHY',
          educationLevels: [`Y${yearData.year}`],
          gradeLevel: yearData.year,
          ageRangeMin: yearData.ageRangeMin,
          ageRangeMax: yearData.ageRangeMax,
          documentTitle: 'National curriculum in England: geography programmes of study',
          documentYear: '2014'
        },
        create: {
          jurisdictionId: jurisdiction.id,
          code: setCode,
          title: `Year ${yearData.year} Geography`,
          subject: 'GEOGRAPHY',
          educationLevels: [`Y${yearData.year}`],
          gradeLevel: yearData.year,
          ageRangeMin: yearData.ageRangeMin,
          ageRangeMax: yearData.ageRangeMax,
          documentTitle: 'National curriculum in England: geography programmes of study',
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

    for (const yearData of britishNCGeography.years) {
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
      const expected = britishNCGeography.years.find(y => y.year === year)?.standards.length || 0;
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
function groupByStrand(standards: BritishNCGeographyStandard[]): Record<string, BritishNCGeographyStandard[]> {
  return standards.reduce((groups, std) => {
    const strand = std.strand;
    if (!groups[strand]) {
      groups[strand] = [];
    }
    groups[strand].push(std);
    return groups;
  }, {} as Record<string, BritishNCGeographyStandard[]>);
}

// Helper: Get conceptual area from strand
function getConceptualArea(strand: string): string {
  const mapping: Record<string, string> = {
    // All Key Stages - Core strands
    'Locational Knowledge': 'Locational Knowledge',
    'Place Knowledge': 'Place Knowledge',
    'Human and Physical Geography': 'Human and Physical Geography',
    'Geographical Skills and Fieldwork': 'Geographical Skills',
    'Aims': 'Geographical Aims',
    // KS3 Physical Geography strands
    'Physical Geography - Geological Timescales': 'Physical Geography',
    'Physical Geography - Plate Tectonics': 'Physical Geography',
    'Physical Geography - Rocks and Weathering': 'Physical Geography',
    'Physical Geography - Weather and Climate': 'Physical Geography',
    'Physical Geography - Glaciation': 'Physical Geography',
    'Physical Geography - Hydrology': 'Physical Geography',
    'Physical Geography - Coasts': 'Physical Geography',
    // KS3 Human Geography strands
    'Human Geography - Population and Urbanisation': 'Human Geography',
    'Human Geography - International Development': 'Human Geography',
    'Human Geography - Economic Activity': 'Human Geography',
    'Human Geography - Resource Use': 'Human Geography',
    // KS3 Interactions
    'Physical-Human Interactions': 'Physical-Human Interactions'
  };
  return mapping[strand] || strand;
}

// Helper: Get ancestor descriptions for breadcrumb trail
function getAncestorDescriptions(strand: string): string[] {
  // Locational Knowledge
  if (strand.includes('Locational Knowledge')) {
    return ['Geography', 'Locational Knowledge'];
  }

  // Place Knowledge
  if (strand.includes('Place Knowledge')) {
    return ['Geography', 'Place Knowledge'];
  }

  // Physical Geography
  if (strand.includes('Physical Geography')) {
    return ['Geography', 'Physical Geography'];
  }

  // Human Geography
  if (strand.includes('Human Geography')) {
    return ['Geography', 'Human Geography'];
  }

  // Human and Physical Geography (combined for KS1/KS2)
  if (strand.includes('Human and Physical Geography')) {
    return ['Geography', 'Human and Physical Geography'];
  }

  // Geographical Skills
  if (strand.includes('Geographical Skills') || strand.includes('Fieldwork')) {
    return ['Geography', 'Geographical Skills'];
  }

  // Interactions
  if (strand.includes('Interactions')) {
    return ['Geography', 'Physical-Human Interactions'];
  }

  // Aims
  if (strand === 'Aims') {
    return ['Geography', 'Programme Aims'];
  }

  return ['Geography'];
}

// Run the seeder
seedBritishGeographyCurriculum()
  .then(() => {
    console.log('\nDone!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to seed:', error);
    process.exit(1);
  });
