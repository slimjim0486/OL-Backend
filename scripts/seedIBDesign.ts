/**
 * Seed Script: IB Design Curriculum Standards
 *
 * Populates the database with IB Design standards spanning all programmes:
 * - PYP: Age Bands 1-4 (Ages 3-12) → IB_PYP jurisdiction
 * - MYP: Years 1-5 (Grades 6-10) → IB_MYP_DP jurisdiction
 * - DP: Years 1-2 (Grades 11-12) → IB_MYP_DP jurisdiction
 *
 * Design uses flat arrays rather than year-grouped structures.
 * Standards are grouped by notation prefix to derive year/level.
 *
 * Run with: npx tsx scripts/seedIBDesign.ts
 */

import { PrismaClient } from '@prisma/client';
import {
  ibPYPDesignStandards,
  ibMYPDesignStandards,
  ibDPDesignTechnologyStandards,
  getDesignStandardsSummary,
  IBDesignStandard
} from '../src/config/ibDesignCurriculum';

const prisma = new PrismaClient();

// ============================================================================
// LEVEL DEFINITIONS - derive from notation patterns
// ============================================================================

interface DesignLevel {
  code: string;          // e.g., 'AB1', 'M1', 'D1'
  label: string;
  gradeEquivalent: string;
  gradeLevel: number;
  ageRangeMin: number;
  ageRangeMax: number;
  programme: 'PYP' | 'MYP' | 'DP';
  notationPrefix: string; // regex-like prefix to match standards
}

const designLevels: DesignLevel[] = [
  // PYP Age Bands
  { code: 'AB1', label: 'PYP Age Band 1 (Ages 3-5)', gradeEquivalent: 'Pre-K to K', gradeLevel: 0, ageRangeMin: 3, ageRangeMax: 5, programme: 'PYP', notationPrefix: 'IB.PYP.AB1.DES.' },
  { code: 'AB2', label: 'PYP Age Band 2 (Ages 5-7)', gradeEquivalent: 'K-1', gradeLevel: 1, ageRangeMin: 5, ageRangeMax: 7, programme: 'PYP', notationPrefix: 'IB.PYP.AB2.DES.' },
  { code: 'AB3', label: 'PYP Age Band 3 (Ages 7-9)', gradeEquivalent: 'Grades 2-3', gradeLevel: 3, ageRangeMin: 7, ageRangeMax: 9, programme: 'PYP', notationPrefix: 'IB.PYP.AB3.DES.' },
  { code: 'AB4', label: 'PYP Age Band 4 (Ages 9-12)', gradeEquivalent: 'Grades 4-5', gradeLevel: 5, ageRangeMin: 9, ageRangeMax: 12, programme: 'PYP', notationPrefix: 'IB.PYP.AB4.DES.' },
  // MYP Years
  { code: 'M1', label: 'MYP Year 1 (Grade 6)', gradeEquivalent: 'Grade 6', gradeLevel: 6, ageRangeMin: 11, ageRangeMax: 12, programme: 'MYP', notationPrefix: 'IB.MYP.M1.DES.' },
  { code: 'M2', label: 'MYP Year 2 (Grade 7)', gradeEquivalent: 'Grade 7', gradeLevel: 7, ageRangeMin: 12, ageRangeMax: 13, programme: 'MYP', notationPrefix: 'IB.MYP.M2.DES.' },
  { code: 'M3', label: 'MYP Year 3 (Grade 8)', gradeEquivalent: 'Grade 8', gradeLevel: 8, ageRangeMin: 13, ageRangeMax: 14, programme: 'MYP', notationPrefix: 'IB.MYP.M3.DES.' },
  { code: 'M4', label: 'MYP Year 4 (Grade 9)', gradeEquivalent: 'Grade 9', gradeLevel: 9, ageRangeMin: 14, ageRangeMax: 15, programme: 'MYP', notationPrefix: 'IB.MYP.M4.DES.' },
  { code: 'M5', label: 'MYP Year 5 (Grade 10)', gradeEquivalent: 'Grade 10', gradeLevel: 10, ageRangeMin: 15, ageRangeMax: 16, programme: 'MYP', notationPrefix: 'IB.MYP.M5.DES.' },
  // DP Years
  { code: 'D1', label: 'DP Year 1 (Grade 11)', gradeEquivalent: 'Grade 11', gradeLevel: 11, ageRangeMin: 16, ageRangeMax: 17, programme: 'DP', notationPrefix: 'IB.DP.D1.DT.' },
  { code: 'D2', label: 'DP Year 2 (Grade 12)', gradeEquivalent: 'Grade 12', gradeLevel: 12, ageRangeMin: 17, ageRangeMax: 18, programme: 'DP', notationPrefix: 'IB.DP.D2.DT.' },
];

// Helper: Get conceptual area from strand
function getConceptualArea(std: IBDesignStandard): string {
  const mapping: Record<string, string> = {
    'Design Process': 'Design Thinking',
    'Materials and Tools': 'Materials',
    'Problem Solving': 'Problem Solving',
    'Digital Awareness': 'Digital Literacy',
    'Digital and Computational': 'Digital Design',
    'Sustainability and Impact': 'Sustainability',
    'Inquiring and Analysing': 'Research',
    'Developing Ideas': 'Ideation',
    'Creating the Solution': 'Prototyping',
    'Evaluating': 'Evaluation',
    'Digital Design': 'Digital Design',
    'Product Design': 'Product Design',
    'Human Factors and Ergonomics': 'Human Factors',
    'Resource Management': 'Sustainability',
    'Modelling': 'Prototyping',
    'Materials': 'Materials Science',
    'Innovation and Design': 'Innovation',
    'Classic Design': 'Design History',
    'User-Centred Design': 'UX Design',
    'Sustainability': 'Sustainability',
    'Innovation and Markets': 'Business',
    'Commercial Production': 'Manufacturing',
    'Design Project': 'Design Practice',
  };
  return mapping[std.strand] || std.strand;
}

// Helper: Get ancestor descriptions
function getAncestorDescriptions(std: IBDesignStandard): string[] {
  if (['Design Process', 'Inquiring and Analysing', 'Developing Ideas', 'Creating the Solution', 'Evaluating'].includes(std.strand)) {
    return ['Design', 'Design Process'];
  } else if (['Materials and Tools', 'Materials', 'Modelling'].includes(std.strand)) {
    return ['Design', 'Materials and Making'];
  } else if (['Problem Solving', 'Design Project'].includes(std.strand)) {
    return ['Design', 'Problem Solving'];
  } else if (['Digital Awareness', 'Digital and Computational', 'Digital Design'].includes(std.strand)) {
    return ['Design', 'Digital Design'];
  } else if (['Sustainability and Impact', 'Sustainability', 'Resource Management'].includes(std.strand)) {
    return ['Design', 'Sustainability'];
  } else if (['Human Factors and Ergonomics', 'User-Centred Design'].includes(std.strand)) {
    return ['Design', 'Human Factors'];
  } else if (['Innovation and Design', 'Innovation and Markets', 'Classic Design'].includes(std.strand)) {
    return ['Design', 'Innovation'];
  } else if (['Commercial Production'].includes(std.strand)) {
    return ['Design', 'Manufacturing'];
  } else if (['Product Design'].includes(std.strand)) {
    return ['Design', 'Product Design'];
  }
  return ['Design'];
}

// Group flat arrays of standards by their notation prefix
function groupStandardsByLevel(standards: IBDesignStandard[], levels: DesignLevel[]): Map<string, IBDesignStandard[]> {
  const grouped = new Map<string, IBDesignStandard[]>();

  for (const level of levels) {
    grouped.set(level.code, []);
  }

  for (const std of standards) {
    for (const level of levels) {
      if (std.notation.startsWith(level.notationPrefix)) {
        grouped.get(level.code)!.push(std);
        break;
      }
    }
  }

  return grouped;
}

async function seedIBDesign() {
  console.log('\n========================================');
  console.log('  IB Design Curriculum Seeder');
  console.log('  (PYP + MYP + DP)');
  console.log('========================================\n');

  const summary = getDesignStandardsSummary();
  console.log('Curriculum Statistics:');
  console.log(`  Total Standards: ${summary.total}`);
  console.log(`  PYP: ${summary.pyp} standards`);
  console.log(`  MYP: ${summary.myp} standards`);
  console.log(`  DP: ${summary.dp} standards (SL: ${summary.dpSL}, HL: ${summary.dpHL})`);

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

    // Group all standards by level
    const allStandards = [...ibPYPDesignStandards, ...ibMYPDesignStandards, ...ibDPDesignTechnologyStandards];
    const groupedByLevel = groupStandardsByLevel(allStandards, designLevels);

    // Step 2: Create StandardSets for each level
    console.log('\n[2/3] Creating standard sets...');
    const standardSetMap: Map<string, string> = new Map();

    for (const level of designLevels) {
      const standards = groupedByLevel.get(level.code) || [];
      if (standards.length === 0) continue;

      const jurisdictionId = level.programme === 'PYP' ? pypJurisdiction.id : mypDpJurisdiction.id;
      const setCode = `IB.${level.programme}.${level.code}.DES`;

      const standardSet = await prisma.standardSet.upsert({
        where: {
          jurisdictionId_code: {
            jurisdictionId,
            code: setCode
          }
        },
        update: {
          title: `IB Design - ${level.label}`,
          subject: 'COMPUTER_SCIENCE', // Design Technology closest fit
          educationLevels: [level.gradeEquivalent],
          gradeLevel: level.gradeLevel,
          ageRangeMin: level.ageRangeMin,
          ageRangeMax: level.ageRangeMax,
          documentTitle: `IB ${level.programme} Design Guide`,
          documentYear: level.programme === 'PYP' ? '2018' : level.programme === 'MYP' ? '2022' : '2024'
        },
        create: {
          jurisdictionId,
          code: setCode,
          title: `IB Design - ${level.label}`,
          subject: 'COMPUTER_SCIENCE', // Design Technology closest fit
          educationLevels: [level.gradeEquivalent],
          gradeLevel: level.gradeLevel,
          ageRangeMin: level.ageRangeMin,
          ageRangeMax: level.ageRangeMax,
          documentTitle: `IB ${level.programme} Design Guide`,
          documentYear: level.programme === 'PYP' ? '2018' : level.programme === 'MYP' ? '2022' : '2024'
        }
      });

      standardSetMap.set(level.code, standardSet.id);
      console.log(`  ${level.label}: ${standards.length} standards → ${standardSet.id}`);
    }

    // Step 3: Create Learning Standards
    console.log('\n[3/3] Creating learning standards...');
    let totalCreated = 0;
    let totalUpdated = 0;

    for (const level of designLevels) {
      const standards = groupedByLevel.get(level.code) || [];
      const standardSetId = standardSetMap.get(level.code);
      if (!standardSetId || standards.length === 0) continue;

      let levelCreated = 0;
      let levelUpdated = 0;

      // Group by strand
      const strandGroups: Record<string, IBDesignStandard[]> = {};
      for (const std of standards) {
        if (!strandGroups[std.strand]) {
          strandGroups[std.strand] = [];
        }
        strandGroups[std.strand].push(std);
      }

      let position = 0;
      for (const [, strandStandards] of Object.entries(strandGroups)) {
        for (const std of strandStandards) {
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
              conceptualArea: getConceptualArea(std),
              isStatutory: true,
              guidance: std.isHL ? 'HL only' : (std.pathway ? `Pathway: ${std.pathway}` : undefined),
              position,
              depth: 0,
              ancestorDescriptions: getAncestorDescriptions(std)
            },
            create: {
              standardSetId,
              notation: std.notation,
              description: std.description,
              strand: std.strand,
              conceptualArea: getConceptualArea(std),
              isStatutory: true,
              guidance: std.isHL ? 'HL only' : (std.pathway ? `Pathway: ${std.pathway}` : undefined),
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

      console.log(`  ${level.label}: Created ${levelCreated}, Updated ${levelUpdated}`);
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
seedIBDesign()
  .then(() => {
    console.log('\nDone!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to seed:', error);
    process.exit(1);
  });
