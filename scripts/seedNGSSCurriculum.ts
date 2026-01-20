/**
 * Seed Script: US Next Generation Science Standards (NGSS)
 *
 * Populates the database with NGSS standards for Grades K-8
 * - Kindergarten through Grade 5: Grade-specific standards
 * - Middle School (Grades 6-8): Combined MS standards
 *
 * Run with: npx tsx scripts/seedNGSSCurriculum.ts
 *
 * Verified against official NGSS documentation: 2025-01-20
 */

import { PrismaClient, Subject } from '@prisma/client';
import {
  ngssScienceCurriculum,
  getTotalNGSSStandardsCount,
  NGSSScienceStandard
} from '../src/config/ngssScienceCurriculum';

const prisma = new PrismaClient();

async function seedNGSSCurriculum() {
  console.log('\n========================================');
  console.log('  US NGSS (Next Generation Science Standards) Seeder');
  console.log('  (Grades K-8)');
  console.log('========================================\n');

  // Show stats before seeding
  const totalStandards = getTotalNGSSStandardsCount();
  console.log('Curriculum Statistics:');
  console.log(`  Total Grades: ${ngssScienceCurriculum.grades.length}`);
  console.log(`  Total Standards: ${totalStandards}`);
  console.log('\nStandards by Grade:');
  ngssScienceCurriculum.grades.forEach(g => {
    console.log(`  ${g.gradeLabel}: ${g.standards.length} standards`);
  });

  try {
    // Step 1: Create the Jurisdiction
    console.log('\n[1/3] Creating jurisdiction...');
    const jurisdiction = await prisma.curriculumJurisdiction.upsert({
      where: { code: ngssScienceCurriculum.code },
      update: {
        name: ngssScienceCurriculum.name,
        country: ngssScienceCurriculum.country,
        version: ngssScienceCurriculum.version,
        sourceUrl: ngssScienceCurriculum.sourceUrl,
        lastSyncedAt: new Date()
      },
      create: {
        code: ngssScienceCurriculum.code,
        name: ngssScienceCurriculum.name,
        country: ngssScienceCurriculum.country,
        version: ngssScienceCurriculum.version,
        sourceUrl: ngssScienceCurriculum.sourceUrl,
        lastSyncedAt: new Date()
      }
    });
    console.log(`  Created/Updated: ${jurisdiction.name} (${jurisdiction.id})`);

    // Step 2: Create StandardSets for each grade
    console.log('\n[2/3] Creating standard sets for each grade...');
    const standardSets: Map<number, string> = new Map();

    for (const gradeData of ngssScienceCurriculum.grades) {
      const gradeCode = gradeData.grade === 0 ? 'K' : gradeData.grade === 6 ? 'MS' : gradeData.grade.toString();
      const setCode = `US.NGSS.${gradeCode}.SC`;

      const standardSet = await prisma.standardSet.upsert({
        where: {
          jurisdictionId_code: {
            jurisdictionId: jurisdiction.id,
            code: setCode
          }
        },
        update: {
          title: `${gradeData.gradeLabel} Science`,
          subject: 'SCIENCE' as Subject,
          educationLevels: [gradeData.gradeLabel],
          gradeLevel: gradeData.grade,
          ageRangeMin: gradeData.ageRangeMin,
          ageRangeMax: gradeData.ageRangeMax,
          documentTitle: 'Next Generation Science Standards',
          documentYear: '2013'
        },
        create: {
          jurisdictionId: jurisdiction.id,
          code: setCode,
          title: `${gradeData.gradeLabel} Science`,
          subject: 'SCIENCE' as Subject,
          educationLevels: [gradeData.gradeLabel],
          gradeLevel: gradeData.grade,
          ageRangeMin: gradeData.ageRangeMin,
          ageRangeMax: gradeData.ageRangeMax,
          documentTitle: 'Next Generation Science Standards',
          documentYear: '2013'
        }
      });

      standardSets.set(gradeData.grade, standardSet.id);
      console.log(`  ${gradeData.gradeLabel}: ${standardSet.id}`);
    }

    // Step 3: Create Learning Standards
    console.log('\n[3/3] Creating learning standards...');
    let totalCreated = 0;
    let totalUpdated = 0;

    for (const gradeData of ngssScienceCurriculum.grades) {
      const standardSetId = standardSets.get(gradeData.grade);
      if (!standardSetId) continue;

      console.log(`\n  ${gradeData.gradeLabel}:`);
      let gradeCreated = 0;
      let gradeUpdated = 0;

      // Group standards by DCI for better organization
      const dciGroups = groupByDCI(gradeData.standards);

      for (const [dci, standards] of Object.entries(dciGroups)) {
        for (let i = 0; i < standards.length; i++) {
          const std = standards[i];
          const position = i;

          // Determine ancestor descriptions based on DCI
          const ancestorDescriptions = getAncestorDescriptions(std.dci);

          const result = await prisma.learningStandard.upsert({
            where: {
              standardSetId_notation: {
                standardSetId,
                notation: std.notation
              }
            },
            update: {
              description: std.description,
              strand: std.topic,
              conceptualArea: getConceptualArea(std.dci),
              isStatutory: true,
              guidance: std.clarification || std.assessmentBoundary || null,
              position,
              depth: 0,
              ancestorDescriptions
            },
            create: {
              standardSetId,
              notation: std.notation,
              description: std.description,
              strand: std.topic,
              conceptualArea: getConceptualArea(std.dci),
              isStatutory: true,
              guidance: std.clarification || std.assessmentBoundary || null,
              position,
              depth: 0,
              ancestorDescriptions
            }
          });

          // Check if it was created or updated
          if (result.createdAt.getTime() === result.updatedAt.getTime()) {
            gradeCreated++;
            totalCreated++;
          } else {
            gradeUpdated++;
            totalUpdated++;
          }
        }
      }

      console.log(`    Created: ${gradeCreated}, Updated: ${gradeUpdated}`);
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

    console.log('\n  Verification - Standards per grade:');
    for (const [grade, setId] of standardSets) {
      const gradeData = ngssScienceCurriculum.grades.find(g => g.grade === grade);
      const count = dbCounts.find(c => c.standardSetId === setId)?._count?.id || 0;
      const expected = gradeData?.standards.length || 0;
      const status = count === expected ? '✓' : `❌ (expected ${expected})`;
      console.log(`    ${gradeData?.gradeLabel || grade}: ${count} standards ${status}`);
    }

  } catch (error) {
    console.error('\nError seeding curriculum:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Helper: Group standards by DCI
function groupByDCI(standards: NGSSScienceStandard[]): Record<string, NGSSScienceStandard[]> {
  return standards.reduce((groups, std) => {
    const dci = std.dci;
    if (!groups[dci]) {
      groups[dci] = [];
    }
    groups[dci].push(std);
    return groups;
  }, {} as Record<string, NGSSScienceStandard[]>);
}

// Helper: Get conceptual area from DCI
function getConceptualArea(dci: string): string {
  const mapping: Record<string, string> = {
    'Physical Sciences': 'Physical Science',
    'Life Sciences': 'Life Science',
    'Earth and Space Sciences': 'Earth Science',
    'Engineering, Technology, and Applications of Science': 'Engineering'
  };
  return mapping[dci] || dci;
}

// Helper: Get ancestor descriptions for breadcrumb trail
function getAncestorDescriptions(dci: string): string[] {
  if (dci === 'Physical Sciences') {
    return ['Science', 'Physical Sciences'];
  }
  if (dci === 'Life Sciences') {
    return ['Science', 'Life Sciences'];
  }
  if (dci === 'Earth and Space Sciences') {
    return ['Science', 'Earth and Space Sciences'];
  }
  if (dci === 'Engineering, Technology, and Applications of Science') {
    return ['Science', 'Engineering'];
  }
  return ['Science'];
}

// Run the seeder
seedNGSSCurriculum()
  .then(() => {
    console.log('\nDone!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to seed:', error);
    process.exit(1);
  });
