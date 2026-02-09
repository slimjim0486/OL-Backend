/**
 * Seed Script: British National Curriculum Computing Standards
 *
 * Populates the database with British NC Computing standards for Years 1-13
 * - KS1: Years 1-2 (Primary)
 * - KS2: Years 3-6 (Primary)
 * - KS3: Years 7-9 (Secondary)
 * - KS4: Years 10-11 (GCSE)
 * - KS5: Years 12-13 (A-Level)
 *
 * Run with: npx tsx scripts/seedBritishComputingCurriculum.ts
 */

import { PrismaClient } from '@prisma/client';
import {
  britishComputingCurriculum,
  getBritishComputingStandardCount,
  BritishNCComputingStandard
} from '../src/config/britishComputingCurriculum';

const prisma = new PrismaClient();

// Helper: Group standards by strand
function groupByStrand(standards: BritishNCComputingStandard[]): Record<string, BritishNCComputingStandard[]> {
  return standards.reduce((groups, std) => {
    const strand = std.strand;
    if (!groups[strand]) {
      groups[strand] = [];
    }
    groups[strand].push(std);
    return groups;
  }, {} as Record<string, BritishNCComputingStandard[]>);
}

// Helper: Get conceptual area from strand
function getConceptualArea(strand: string): string {
  const mapping: Record<string, string> = {
    'Algorithms': 'Computational Thinking',
    'Programming': 'Programming',
    'Logical Reasoning': 'Computational Thinking',
    'Digital Literacy': 'Digital Literacy',
    'Online Safety': 'Digital Citizenship',
    'Networks': 'Networks',
    'Computational Abstractions': 'Computational Thinking',
    'Programming Languages': 'Programming',
    'Boolean Logic and Binary': 'Computer Science Theory',
    'Systems and Architecture': 'Computer Architecture',
    'Creative Projects': 'Digital Creation',
    'Online Safety and Security': 'Digital Citizenship',
    'Data Representation': 'Data Science',
    'Cyber Security': 'Digital Citizenship',
    'Ethics and Impacts': 'Digital Citizenship',
    'Advanced Programming': 'Programming',
    'Data Structures and Algorithms': 'Computer Science Theory',
    'Computer Architecture': 'Computer Architecture',
    'Networking and Web': 'Networks',
    'Databases': 'Data Science',
    'Theory of Computation': 'Computer Science Theory',
    'Programming Project': 'Programming',
  };
  return mapping[strand] || strand;
}

// Helper: Get ancestor descriptions
function getAncestorDescriptions(strand: string): string[] {
  if (['Algorithms', 'Logical Reasoning', 'Computational Abstractions', 'Boolean Logic and Binary', 'Theory of Computation'].includes(strand)) {
    return ['Computing', 'Computer Science'];
  } else if (['Programming', 'Programming Languages', 'Advanced Programming', 'Programming Project', 'Data Structures and Algorithms'].includes(strand)) {
    return ['Computing', 'Programming'];
  } else if (['Digital Literacy', 'Creative Projects'].includes(strand)) {
    return ['Computing', 'Digital Literacy'];
  } else if (['Online Safety', 'Online Safety and Security', 'Cyber Security', 'Ethics and Impacts'].includes(strand)) {
    return ['Computing', 'Digital Citizenship'];
  } else if (['Networks', 'Networking and Web', 'Systems and Architecture', 'Computer Architecture'].includes(strand)) {
    return ['Computing', 'Systems'];
  } else if (['Data Representation', 'Databases'].includes(strand)) {
    return ['Computing', 'Data'];
  }
  return ['Computing'];
}

async function seedBritishComputingCurriculum() {
  console.log('\n========================================');
  console.log('  British NC Computing Seeder');
  console.log('  (Years 1-13 - Verified Data)');
  console.log('========================================\n');

  const totalStandards = getBritishComputingStandardCount();
  console.log('Curriculum Statistics:');
  console.log(`  Total Years: ${britishComputingCurriculum.years.length}`);
  console.log(`  Total Standards: ${totalStandards}`);
  console.log('\nStandards by Year:');
  britishComputingCurriculum.years.forEach(y => {
    console.log(`  Year ${y.year} (KS${y.keyStage}): ${y.standards.length} standards`);
  });

  try {
    // Step 1: Create or update the Jurisdiction
    console.log('\n[1/3] Creating jurisdiction...');
    const jurisdiction = await prisma.curriculumJurisdiction.upsert({
      where: { code: 'UK_NATIONAL_CURRICULUM' },
      update: {
        lastSyncedAt: new Date()
      },
      create: {
        code: 'UK_NATIONAL_CURRICULUM',
        name: 'British National Curriculum',
        country: 'GB',
        version: '2014',
        sourceUrl: 'https://www.gov.uk/government/collections/national-curriculum',
        lastSyncedAt: new Date()
      }
    });
    console.log(`  Created/Updated: ${jurisdiction.name} (${jurisdiction.id})`);

    // Step 2: Create StandardSets for each year
    console.log('\n[2/3] Creating standard sets for each year...');
    const standardSets: Map<number, string> = new Map();

    for (const yearData of britishComputingCurriculum.years) {
      const setCode = `UK.KS${yearData.keyStage}.Y${yearData.year}.COM`;
      const standardSet = await prisma.standardSet.upsert({
        where: {
          jurisdictionId_code: {
            jurisdictionId: jurisdiction.id,
            code: setCode
          }
        },
        update: {
          title: `Year ${yearData.year} Computing`,
          subject: 'COMPUTER_SCIENCE',
          educationLevels: [`Y${yearData.year}`],
          gradeLevel: yearData.year,
          ageRangeMin: yearData.ageRangeMin,
          ageRangeMax: yearData.ageRangeMax,
          documentTitle: 'National curriculum in England: computing programmes of study',
          documentYear: '2014'
        },
        create: {
          jurisdictionId: jurisdiction.id,
          code: setCode,
          title: `Year ${yearData.year} Computing`,
          subject: 'COMPUTER_SCIENCE',
          educationLevels: [`Y${yearData.year}`],
          gradeLevel: yearData.year,
          ageRangeMin: yearData.ageRangeMin,
          ageRangeMax: yearData.ageRangeMax,
          documentTitle: 'National curriculum in England: computing programmes of study',
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

    for (const yearData of britishComputingCurriculum.years) {
      const standardSetId = standardSets.get(yearData.year);
      if (!standardSetId) continue;

      let yearCreated = 0;
      let yearUpdated = 0;

      const strandGroups = groupByStrand(yearData.standards);

      for (const [strand, standards] of Object.entries(strandGroups)) {
        for (let i = 0; i < standards.length; i++) {
          const std = standards[i];

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
              position: i,
              depth: 0,
              ancestorDescriptions: getAncestorDescriptions(std.strand)
            },
            create: {
              standardSetId,
              notation: std.notation,
              description: std.description,
              strand: std.strand,
              conceptualArea: getConceptualArea(std.strand),
              isStatutory: std.isStatutory,
              guidance: std.guidance,
              position: i,
              depth: 0,
              ancestorDescriptions: getAncestorDescriptions(std.strand)
            }
          });

          if (result.createdAt.getTime() === result.updatedAt.getTime()) {
            yearCreated++;
            totalCreated++;
          } else {
            yearUpdated++;
            totalUpdated++;
          }
        }
      }

      console.log(`  Year ${yearData.year}: Created ${yearCreated}, Updated ${yearUpdated}`);
    }

    // Summary
    console.log('\n========================================');
    console.log('  Seeding Complete!');
    console.log('========================================');
    console.log(`  Total Created: ${totalCreated}`);
    console.log(`  Total Updated: ${totalUpdated}`);
    console.log(`  Total Standards: ${totalCreated + totalUpdated}`);

  } catch (error) {
    console.error('\nError seeding curriculum:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeder
seedBritishComputingCurriculum()
  .then(() => {
    console.log('\nDone!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to seed:', error);
    process.exit(1);
  });
