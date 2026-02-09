/**
 * Seed Script: IB Arts Curriculum Standards (Visual Arts & Music)
 *
 * Populates the database with IB Arts standards spanning all programmes:
 * - PYP: Age Bands 1-4 (Ages 3-12) → IB_PYP jurisdiction
 * - MYP: Years 1-5 (Grades 6-10) → IB_MYP_DP jurisdiction
 * - DP: Years 1-2 (Grades 11-12) → IB_MYP_DP jurisdiction
 *
 * Run with: npx tsx scripts/seedIBArts.ts
 */

import { PrismaClient } from '@prisma/client';
import {
  ibArtsLevels,
  getArtsStandardsCount,
  IBArtStandard,
  IBArtLevel
} from '../src/config/ibArtsCurriculum';

const prisma = new PrismaClient();

// Helper: Get conceptual area from strand/discipline
function getConceptualArea(std: IBArtStandard): string {
  if (std.discipline === 'Visual Arts') {
    const mapping: Record<string, string> = {
      'Responding': 'Art Appreciation',
      'Creating': 'Art Making',
      'Investigating': 'Art Research',
      'Developing Skills': 'Art Techniques',
      'Thinking Creatively': 'Creative Process',
      'Visual Arts in Context': 'Art History',
      'Visual Arts Methods': 'Art Techniques',
      'Communicating Visual Arts': 'Art Presentation',
    };
    return mapping[std.strand] || 'Visual Arts';
  } else {
    const mapping: Record<string, string> = {
      'Responding': 'Music Appreciation',
      'Creating': 'Music Making',
      'Investigating': 'Music Research',
      'Developing Skills': 'Music Performance',
      'Thinking Creatively': 'Music Composition',
      'Researcher': 'Music Research',
      'Creator': 'Music Composition',
      'Performer': 'Music Performance',
    };
    return mapping[std.strand] || 'Music';
  }
}

// Helper: Get ancestor descriptions
function getAncestorDescriptions(std: IBArtStandard): string[] {
  if (std.discipline === 'Visual Arts') {
    if (['Responding', 'Investigating'].includes(std.strand)) {
      return ['Arts', 'Visual Arts', 'Appreciation'];
    } else if (['Creating', 'Developing Skills', 'Visual Arts Methods'].includes(std.strand)) {
      return ['Arts', 'Visual Arts', 'Making'];
    } else if (['Thinking Creatively', 'Communicating Visual Arts'].includes(std.strand)) {
      return ['Arts', 'Visual Arts', 'Expression'];
    } else if (std.strand === 'Visual Arts in Context') {
      return ['Arts', 'Visual Arts', 'Context'];
    }
    return ['Arts', 'Visual Arts'];
  } else {
    if (['Responding', 'Investigating', 'Researcher'].includes(std.strand)) {
      return ['Arts', 'Music', 'Appreciation'];
    } else if (['Creating', 'Thinking Creatively', 'Creator'].includes(std.strand)) {
      return ['Arts', 'Music', 'Composition'];
    } else if (['Developing Skills', 'Performer'].includes(std.strand)) {
      return ['Arts', 'Music', 'Performance'];
    }
    return ['Arts', 'Music'];
  }
}

// Map PYP age band to gradeLevel
function getGradeLevel(level: IBArtLevel): number {
  const gradeMap: Record<string, number> = {
    'A1': 0, 'A2': 1, 'A3': 3, 'A4': 5,   // PYP age bands
    'MYP1': 6, 'MYP2': 7, 'MYP3': 8, 'MYP4': 9, 'MYP5': 10,  // MYP years
    'DP1': 11, 'DP2': 12,  // DP years
  };
  return gradeMap[level.level] ?? 0;
}

async function seedIBArts() {
  console.log('\n========================================');
  console.log('  IB Arts Curriculum Seeder');
  console.log('  (PYP + MYP + DP)');
  console.log('========================================\n');

  const totalStandards = getArtsStandardsCount();
  console.log('Curriculum Statistics:');
  console.log(`  Total Standards: ${totalStandards}`);
  console.log('\nStandards by Level:');
  ibArtsLevels.forEach(l => {
    console.log(`  ${l.levelLabel} (${l.programme}): ${l.standards.length} standards`);
  });

  try {
    // Ensure both jurisdictions exist
    console.log('\n[1/3] Creating jurisdictions...');

    const pypJurisdiction = await prisma.curriculumJurisdiction.upsert({
      where: { code: 'IB_PYP' },
      update: { lastSyncedAt: new Date() },
      create: {
        code: 'IB_PYP',
        name: 'International Baccalaureate Primary Years Programme',
        country: 'INTERNATIONAL',
        version: '2018',
        sourceUrl: 'https://www.ibo.org/programmes/primary-years-programme/',
        lastSyncedAt: new Date()
      }
    });
    console.log(`  PYP: ${pypJurisdiction.id}`);

    const mypDpJurisdiction = await prisma.curriculumJurisdiction.upsert({
      where: { code: 'IB_MYP_DP' },
      update: { lastSyncedAt: new Date() },
      create: {
        code: 'IB_MYP_DP',
        name: 'International Baccalaureate MYP & Diploma Programme',
        country: 'INTERNATIONAL',
        version: '2020',
        sourceUrl: 'https://www.ibo.org/programmes/',
        lastSyncedAt: new Date()
      }
    });
    console.log(`  MYP/DP: ${mypDpJurisdiction.id}`);

    // Step 2: Create StandardSets for each level
    console.log('\n[2/3] Creating standard sets...');
    const standardSets: Map<string, string> = new Map();

    for (const levelData of ibArtsLevels) {
      const jurisdictionId = levelData.programme === 'PYP' ? pypJurisdiction.id : mypDpJurisdiction.id;
      const setCode = `IB.${levelData.programme}.${levelData.level}.AR`;

      const standardSet = await prisma.standardSet.upsert({
        where: {
          jurisdictionId_code: {
            jurisdictionId,
            code: setCode
          }
        },
        update: {
          title: `IB ${levelData.programme} Arts - ${levelData.levelLabel}`,
          subject: 'ART',
          educationLevels: [levelData.gradeEquivalent],
          gradeLevel: getGradeLevel(levelData),
          ageRangeMin: levelData.ageRangeMin,
          ageRangeMax: levelData.ageRangeMax,
          documentTitle: `IB ${levelData.programme} Arts Scope and Sequence`,
          documentYear: levelData.programme === 'PYP' ? '2009' : '2022'
        },
        create: {
          jurisdictionId,
          code: setCode,
          title: `IB ${levelData.programme} Arts - ${levelData.levelLabel}`,
          subject: 'ART',
          educationLevels: [levelData.gradeEquivalent],
          gradeLevel: getGradeLevel(levelData),
          ageRangeMin: levelData.ageRangeMin,
          ageRangeMax: levelData.ageRangeMax,
          documentTitle: `IB ${levelData.programme} Arts Scope and Sequence`,
          documentYear: levelData.programme === 'PYP' ? '2009' : '2022'
        }
      });

      standardSets.set(levelData.level, standardSet.id);
      console.log(`  ${levelData.levelLabel}: ${standardSet.id}`);
    }

    // Step 3: Create Learning Standards
    console.log('\n[3/3] Creating learning standards...');
    let totalCreated = 0;
    let totalUpdated = 0;

    for (const levelData of ibArtsLevels) {
      const standardSetId = standardSets.get(levelData.level);
      if (!standardSetId) continue;

      let levelCreated = 0;
      let levelUpdated = 0;

      // Group by discipline then strand
      const strandGroups: Record<string, IBArtStandard[]> = {};
      for (const std of levelData.standards) {
        const key = `${std.discipline}:${std.strand}`;
        if (!strandGroups[key]) {
          strandGroups[key] = [];
        }
        strandGroups[key].push(std);
      }

      let position = 0;
      for (const [, standards] of Object.entries(strandGroups)) {
        for (const std of standards) {
          const result = await prisma.learningStandard.upsert({
            where: {
              standardSetId_notation: {
                standardSetId,
                notation: std.notation
              }
            },
            update: {
              description: std.description,
              strand: `${std.discipline} - ${std.strand}`,
              conceptualArea: getConceptualArea(std),
              isStatutory: true,
              guidance: std.isHL ? 'HL only' : undefined,
              position,
              depth: 0,
              ancestorDescriptions: getAncestorDescriptions(std)
            },
            create: {
              standardSetId,
              notation: std.notation,
              description: std.description,
              strand: `${std.discipline} - ${std.strand}`,
              conceptualArea: getConceptualArea(std),
              isStatutory: true,
              guidance: std.isHL ? 'HL only' : undefined,
              position,
              depth: 0,
              ancestorDescriptions: getAncestorDescriptions(std)
            }
          });

          position++;
          if (result.createdAt.getTime() === result.updatedAt.getTime()) {
            levelCreated++;
            totalCreated++;
          } else {
            levelUpdated++;
            totalUpdated++;
          }
        }
      }

      console.log(`  ${levelData.levelLabel}: Created ${levelCreated}, Updated ${levelUpdated}`);
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
seedIBArts()
  .then(() => {
    console.log('\nDone!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to seed:', error);
    process.exit(1);
  });
