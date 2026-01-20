/**
 * Seed Script: British National Curriculum History Standards
 *
 * Populates the database with British NC History standards for Years 1-9
 * - KS1: Years 1-2 (Primary)
 * - KS2: Years 3-6 (Primary)
 * - KS3: Years 7-9 (Secondary)
 *
 * Verified against official GOV.UK documentation: 2025-01-20
 *
 * Run with: npx tsx scripts/seedBritishHistoryCurriculum.ts
 */

import { PrismaClient } from '@prisma/client';
import {
  britishNCHistory,
  getTotalHistoryStandardsCount,
  BritishNCHistoryStandard,
  BritishNCHistoryYear
} from '../src/config/britishHistoryCurriculum';

const prisma = new PrismaClient();

async function seedBritishHistoryCurriculum() {
  console.log('\n========================================');
  console.log('  British National Curriculum History Seeder');
  console.log('  (Years 1-9 - Verified Data)');
  console.log('========================================\n');

  // Show stats before seeding
  const totalStandards = getTotalHistoryStandardsCount();
  console.log('Curriculum Statistics:');
  console.log(`  Total Years: ${britishNCHistory.years.length}`);
  console.log(`  Total Standards: ${totalStandards}`);
  console.log('\nStandards by Year:');
  britishNCHistory.years.forEach(y => {
    console.log(`  Year ${y.year} (KS${y.keyStage}): ${y.standards.length} standards`);
  });

  try {
    // Step 1: Get or create the Jurisdiction (should already exist from Math/English/Science seeding)
    console.log('\n[1/3] Getting/Creating jurisdiction...');
    const jurisdiction = await prisma.curriculumJurisdiction.upsert({
      where: { code: britishNCHistory.code },
      update: {
        name: 'British National Curriculum',
        country: britishNCHistory.country,
        version: britishNCHistory.version,
        sourceUrl: britishNCHistory.sourceUrl,
        lastSyncedAt: new Date()
      },
      create: {
        code: britishNCHistory.code,
        name: 'British National Curriculum',
        country: britishNCHistory.country,
        version: britishNCHistory.version,
        sourceUrl: britishNCHistory.sourceUrl,
        lastSyncedAt: new Date()
      }
    });
    console.log(`  Using jurisdiction: ${jurisdiction.name} (${jurisdiction.id})`);

    // Step 2: Create StandardSets for each year (History)
    console.log('\n[2/3] Creating standard sets for each year (History)...');
    const standardSets: Map<number, string> = new Map();

    for (const yearData of britishNCHistory.years) {
      const setCode = `UK.KS${yearData.keyStage}.Y${yearData.year}.HIS`;
      const standardSet = await prisma.standardSet.upsert({
        where: {
          jurisdictionId_code: {
            jurisdictionId: jurisdiction.id,
            code: setCode
          }
        },
        update: {
          title: `Year ${yearData.year} History`,
          subject: 'HISTORY',
          educationLevels: [`Y${yearData.year}`],
          gradeLevel: yearData.year,
          ageRangeMin: yearData.ageRangeMin,
          ageRangeMax: yearData.ageRangeMax,
          documentTitle: 'National curriculum in England: history programmes of study',
          documentYear: '2014'
        },
        create: {
          jurisdictionId: jurisdiction.id,
          code: setCode,
          title: `Year ${yearData.year} History`,
          subject: 'HISTORY',
          educationLevels: [`Y${yearData.year}`],
          gradeLevel: yearData.year,
          ageRangeMin: yearData.ageRangeMin,
          ageRangeMax: yearData.ageRangeMax,
          documentTitle: 'National curriculum in England: history programmes of study',
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

    for (const yearData of britishNCHistory.years) {
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
      const expected = britishNCHistory.years.find(y => y.year === year)?.standards.length || 0;
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
function groupByStrand(standards: BritishNCHistoryStandard[]): Record<string, BritishNCHistoryStandard[]> {
  return standards.reduce((groups, std) => {
    const strand = std.strand;
    if (!groups[strand]) {
      groups[strand] = [];
    }
    groups[strand].push(std);
    return groups;
  }, {} as Record<string, BritishNCHistoryStandard[]>);
}

// Helper: Get conceptual area from strand
function getConceptualArea(strand: string): string {
  const mapping: Record<string, string> = {
    // KS1 strands
    'Changes within Living Memory': 'Living Memory',
    'Events Beyond Living Memory': 'National/Global Events',
    'Significant Individuals': 'Historical Figures',
    'Local History': 'Local History',
    'Historical Skills': 'Historical Skills',
    'Historical Skills - KS1': 'Historical Skills',
    // KS2 British History strands
    'Stone Age to Iron Age': 'British Prehistory',
    'Roman Empire': 'Ancient Britain',
    'Anglo-Saxons and Scots': 'Early Medieval Britain',
    'Vikings and Anglo-Saxon Struggle': 'Early Medieval Britain',
    'British History Beyond 1066': 'Later British History',
    // KS2 World History strands
    'Earliest Civilizations': 'Ancient Civilizations',
    'Ancient Greece': 'Classical History',
    'Non-European Society': 'World History',
    'Historical Skills - KS2': 'Historical Skills',
    // KS3 British History strands
    'Medieval Britain 1066-1509': 'Medieval Britain',
    'Early Modern Britain 1509-1745': 'Early Modern Britain',
    'Industrial Britain 1745-1901': 'Industrial Britain',
    'Modern Britain 1901-Present': 'Modern Britain',
    'Thematic Study': 'Thematic History',
    'World History': 'World History',
    'Historical Skills - KS3': 'Historical Skills'
  };
  return mapping[strand] || strand;
}

// Helper: Get ancestor descriptions for breadcrumb trail
function getAncestorDescriptions(strand: string): string[] {
  // British History
  if (strand.includes('Living Memory') || strand.includes('Beyond Living Memory') ||
      strand.includes('Significant Individuals') || strand.includes('Local History')) {
    return ['History', 'British History'];
  }
  if (strand.includes('Stone Age') || strand.includes('Roman') ||
      strand.includes('Anglo-Saxon') || strand.includes('Viking') ||
      strand.includes('Beyond 1066')) {
    return ['History', 'British History'];
  }
  if (strand.includes('Medieval Britain') || strand.includes('Early Modern Britain') ||
      strand.includes('Industrial Britain') || strand.includes('Modern Britain')) {
    return ['History', 'British History'];
  }

  // World History
  if (strand.includes('Civilizations') || strand.includes('Greece') ||
      strand.includes('Non-European') || strand === 'World History') {
    return ['History', 'World History'];
  }

  // Historical Skills
  if (strand.includes('Historical Skills') || strand.includes('Aims')) {
    return ['History', 'Historical Enquiry'];
  }

  // Thematic
  if (strand.includes('Thematic')) {
    return ['History', 'Thematic Study'];
  }

  return ['History'];
}

// Run the seeder
seedBritishHistoryCurriculum()
  .then(() => {
    console.log('\nDone!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to seed:', error);
    process.exit(1);
  });
