/**
 * Seed Script: British National Curriculum Art and Design Standards
 *
 * Populates the database with British NC Art and Design standards for Years 1-13
 * - KS1: Years 1-2 (Primary)
 * - KS2: Years 3-6 (Primary)
 * - KS3: Years 7-9 (Secondary)
 * - KS4: Years 10-11 (GCSE)
 * - KS5: Years 12-13 (A-Level)
 *
 * Run with: npx tsx scripts/seedBritishArtDesignCurriculum.ts
 */

import { PrismaClient } from '@prisma/client';
import {
  britishArtDesignCurriculum,
  getBritishArtDesignStandardCount,
  BritishNCArtDesignStandard
} from '../src/config/britishArtDesignCurriculum';

const prisma = new PrismaClient();

// Helper: Group standards by strand
function groupByStrand(standards: BritishNCArtDesignStandard[]): Record<string, BritishNCArtDesignStandard[]> {
  return standards.reduce((groups, std) => {
    const strand = std.strand;
    if (!groups[strand]) {
      groups[strand] = [];
    }
    groups[strand].push(std);
    return groups;
  }, {} as Record<string, BritishNCArtDesignStandard[]>);
}

// Helper: Get conceptual area from strand
function getConceptualArea(strand: string): string {
  const mapping: Record<string, string> = {
    'Materials and Making': 'Art Materials',
    'Drawing, Painting, Sculpture': 'Art Techniques',
    'Techniques': 'Art Techniques',
    'Artist Knowledge': 'Art History',
    'Sketchbooks': 'Art Practice',
    'Recording Observations': 'Art Practice',
    'Media and Techniques': 'Art Techniques',
    'Proficiency and Materials': 'Art Materials',
    'Analysis and Evaluation': 'Art Criticism',
    'Art History': 'Art History',
    'Critical Understanding': 'Art Criticism',
    'Generating Ideas': 'Creative Process',
    'Investigation and Experimentation': 'Art Practice',
    'Presentation and Realisation': 'Art Presentation',
    'Specialist Areas': 'Art Specialisms',
    'Integrated Study': 'Art Practice',
    'Creative Capabilities': 'Creative Process',
    'Research and Response': 'Art Research',
    'Personal Investigation': 'Art Research',
    'Extended Project': 'Art Practice',
  };
  return mapping[strand] || strand;
}

// Helper: Get ancestor descriptions
function getAncestorDescriptions(strand: string): string[] {
  if (['Materials and Making', 'Proficiency and Materials'].includes(strand)) {
    return ['Art and Design', 'Materials'];
  } else if (['Drawing, Painting, Sculpture', 'Techniques', 'Media and Techniques'].includes(strand)) {
    return ['Art and Design', 'Techniques'];
  } else if (['Artist Knowledge', 'Art History'].includes(strand)) {
    return ['Art and Design', 'Art History'];
  } else if (['Recording Observations', 'Sketchbooks', 'Investigation and Experimentation'].includes(strand)) {
    return ['Art and Design', 'Practice'];
  } else if (['Critical Understanding', 'Analysis and Evaluation'].includes(strand)) {
    return ['Art and Design', 'Criticism'];
  } else if (['Generating Ideas', 'Creative Capabilities'].includes(strand)) {
    return ['Art and Design', 'Creative Process'];
  } else if (['Presentation and Realisation', 'Extended Project', 'Integrated Study'].includes(strand)) {
    return ['Art and Design', 'Presentation'];
  } else if (['Research and Response', 'Personal Investigation'].includes(strand)) {
    return ['Art and Design', 'Research'];
  } else if (strand === 'Specialist Areas') {
    return ['Art and Design', 'Specialist Areas'];
  }
  return ['Art and Design'];
}

async function seedBritishArtDesignCurriculum() {
  console.log('\n========================================');
  console.log('  British NC Art & Design Seeder');
  console.log('  (Years 1-13 - Verified Data)');
  console.log('========================================\n');

  const totalStandards = getBritishArtDesignStandardCount();
  console.log('Curriculum Statistics:');
  console.log(`  Total Years: ${britishArtDesignCurriculum.years.length}`);
  console.log(`  Total Standards: ${totalStandards}`);
  console.log('\nStandards by Year:');
  britishArtDesignCurriculum.years.forEach(y => {
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

    for (const yearData of britishArtDesignCurriculum.years) {
      const setCode = `UK.KS${yearData.keyStage}.Y${yearData.year}.ART`;
      const standardSet = await prisma.standardSet.upsert({
        where: {
          jurisdictionId_code: {
            jurisdictionId: jurisdiction.id,
            code: setCode
          }
        },
        update: {
          title: `Year ${yearData.year} Art and Design`,
          subject: 'ART',
          educationLevels: [`Y${yearData.year}`],
          gradeLevel: yearData.year,
          ageRangeMin: yearData.ageRangeMin,
          ageRangeMax: yearData.ageRangeMax,
          documentTitle: 'National curriculum in England: art and design programmes of study',
          documentYear: '2014'
        },
        create: {
          jurisdictionId: jurisdiction.id,
          code: setCode,
          title: `Year ${yearData.year} Art and Design`,
          subject: 'ART',
          educationLevels: [`Y${yearData.year}`],
          gradeLevel: yearData.year,
          ageRangeMin: yearData.ageRangeMin,
          ageRangeMax: yearData.ageRangeMax,
          documentTitle: 'National curriculum in England: art and design programmes of study',
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

    for (const yearData of britishArtDesignCurriculum.years) {
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
seedBritishArtDesignCurriculum()
  .then(() => {
    console.log('\nDone!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to seed:', error);
    process.exit(1);
  });
