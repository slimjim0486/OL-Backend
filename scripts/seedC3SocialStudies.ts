/**
 * Seed Script: US C3 Framework Social Studies Standards
 *
 * Populates the database with C3 Social Studies standards for Grades K-8
 * - Grades K-2: Early elementary standards
 * - Grades 3-5: Upper elementary standards
 * - Grades 6-8: Middle school standards
 *
 * Run with: npx tsx scripts/seedC3SocialStudies.ts
 *
 * Verified against official NCSS documentation: 2025-01-20
 */

import { PrismaClient, Subject } from '@prisma/client';
import {
  c3SocialStudiesCurriculum,
  getTotalC3StandardsCount,
  C3SocialStudiesStandard,
} from '../src/config/c3SocialStudies';

const prisma = new PrismaClient();

async function seedC3SocialStudies() {
  console.log('\n========================================');
  console.log('  US C3 Framework Social Studies Seeder');
  console.log('  (Grades K-8)');
  console.log('========================================\n');

  // Show stats before seeding
  const totalStandards = getTotalC3StandardsCount();
  console.log('Curriculum Statistics:');
  console.log(`  Total Grade Bands: ${c3SocialStudiesCurriculum.gradeBands.length}`);
  console.log(`  Total Standards: ${totalStandards}`);
  console.log('\nStandards by Grade Band:');
  c3SocialStudiesCurriculum.gradeBands.forEach((b) => {
    console.log(`  ${b.gradeLabel}: ${b.standards.length} standards`);
  });

  try {
    // Step 1: Create the Jurisdiction
    console.log('\n[1/3] Creating jurisdiction...');
    const jurisdiction = await prisma.curriculumJurisdiction.upsert({
      where: { code: c3SocialStudiesCurriculum.code },
      update: {
        name: c3SocialStudiesCurriculum.name,
        country: c3SocialStudiesCurriculum.country,
        version: c3SocialStudiesCurriculum.version,
        sourceUrl: c3SocialStudiesCurriculum.sourceUrl,
        lastSyncedAt: new Date(),
      },
      create: {
        code: c3SocialStudiesCurriculum.code,
        name: c3SocialStudiesCurriculum.name,
        country: c3SocialStudiesCurriculum.country,
        version: c3SocialStudiesCurriculum.version,
        sourceUrl: c3SocialStudiesCurriculum.sourceUrl,
        lastSyncedAt: new Date(),
      },
    });
    console.log(`  Created/Updated: ${jurisdiction.name} (${jurisdiction.id})`);

    // Step 2: Create StandardSets for each grade band
    console.log('\n[2/3] Creating standard sets for each grade band...');
    const standardSets: Map<string, string> = new Map();

    for (const bandData of c3SocialStudiesCurriculum.gradeBands) {
      const bandCode = bandData.gradeBand.replace('-', '');
      const setCode = `US.C3.${bandCode}.SS`;

      const standardSet = await prisma.standardSet.upsert({
        where: {
          jurisdictionId_code: {
            jurisdictionId: jurisdiction.id,
            code: setCode,
          },
        },
        update: {
          title: `${bandData.gradeLabel} Social Studies`,
          subject: 'SOCIAL_STUDIES' as Subject,
          educationLevels: [bandData.gradeLabel],
          gradeLevel: bandData.gradeLevel,
          ageRangeMin: bandData.ageRangeMin,
          ageRangeMax: bandData.ageRangeMax,
          documentTitle: 'College, Career, and Civic Life (C3) Framework for Social Studies',
          documentYear: '2013',
        },
        create: {
          jurisdictionId: jurisdiction.id,
          code: setCode,
          title: `${bandData.gradeLabel} Social Studies`,
          subject: 'SOCIAL_STUDIES' as Subject,
          educationLevels: [bandData.gradeLabel],
          gradeLevel: bandData.gradeLevel,
          ageRangeMin: bandData.ageRangeMin,
          ageRangeMax: bandData.ageRangeMax,
          documentTitle: 'College, Career, and Civic Life (C3) Framework for Social Studies',
          documentYear: '2013',
        },
      });

      standardSets.set(bandData.gradeBand, standardSet.id);
      console.log(`  ${bandData.gradeLabel}: ${standardSet.id}`);
    }

    // Step 3: Create Learning Standards
    console.log('\n[3/3] Creating learning standards...');
    let totalCreated = 0;
    let totalUpdated = 0;

    for (const bandData of c3SocialStudiesCurriculum.gradeBands) {
      const standardSetId = standardSets.get(bandData.gradeBand);
      if (!standardSetId) continue;

      console.log(`\n  ${bandData.gradeLabel}:`);
      let bandCreated = 0;
      let bandUpdated = 0;

      // Group standards by discipline for better organization
      const disciplineGroups = groupByDiscipline(bandData.standards);

      for (const [discipline, standards] of Object.entries(disciplineGroups)) {
        for (let i = 0; i < standards.length; i++) {
          const std = standards[i];
          const position = i;

          // Determine ancestor descriptions based on discipline
          const ancestorDescriptions = getAncestorDescriptions(std.discipline);

          const result = await prisma.learningStandard.upsert({
            where: {
              standardSetId_notation: {
                standardSetId,
                notation: std.notation,
              },
            },
            update: {
              description: std.description,
              strand: std.strand,
              conceptualArea: getConceptualArea(std.discipline),
              isStatutory: true,
              guidance: `${std.dimension} - ${std.discipline}`,
              position,
              depth: 0,
              ancestorDescriptions,
            },
            create: {
              standardSetId,
              notation: std.notation,
              description: std.description,
              strand: std.strand,
              conceptualArea: getConceptualArea(std.discipline),
              isStatutory: true,
              guidance: `${std.dimension} - ${std.discipline}`,
              position,
              depth: 0,
              ancestorDescriptions,
            },
          });

          // Check if it was created or updated
          if (result.createdAt.getTime() === result.updatedAt.getTime()) {
            bandCreated++;
            totalCreated++;
          } else {
            bandUpdated++;
            totalUpdated++;
          }
        }
      }

      console.log(`    Created: ${bandCreated}, Updated: ${bandUpdated}`);
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
      _count: { id: true },
    });

    console.log('\n  Verification - Standards per grade band:');
    for (const [gradeBand, setId] of standardSets) {
      const bandData = c3SocialStudiesCurriculum.gradeBands.find(
        (b) => b.gradeBand === gradeBand
      );
      const count = dbCounts.find((c) => c.standardSetId === setId)?._count?.id || 0;
      const expected = bandData?.standards.length || 0;
      const status = count === expected ? '✓' : `❌ (expected ${expected})`;
      console.log(`    ${bandData?.gradeLabel || gradeBand}: ${count} standards ${status}`);
    }
  } catch (error) {
    console.error('\nError seeding curriculum:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Helper: Group standards by discipline
function groupByDiscipline(
  standards: C3SocialStudiesStandard[]
): Record<string, C3SocialStudiesStandard[]> {
  return standards.reduce((groups, std) => {
    const discipline = std.discipline;
    if (!groups[discipline]) {
      groups[discipline] = [];
    }
    groups[discipline].push(std);
    return groups;
  }, {} as Record<string, C3SocialStudiesStandard[]>);
}

// Helper: Get conceptual area from discipline
function getConceptualArea(discipline: string): string {
  const mapping: Record<string, string> = {
    Inquiry: 'Inquiry Skills',
    Civics: 'Civics',
    Economics: 'Economics',
    Geography: 'Geography',
    History: 'History',
    'Sources and Evidence': 'Research Skills',
    'Communication and Action': 'Civic Engagement',
  };
  return mapping[discipline] || discipline;
}

// Helper: Get ancestor descriptions for breadcrumb trail
function getAncestorDescriptions(discipline: string): string[] {
  if (discipline === 'Inquiry') {
    return ['Social Studies', 'Inquiry'];
  }
  if (discipline === 'Civics') {
    return ['Social Studies', 'Civics'];
  }
  if (discipline === 'Economics') {
    return ['Social Studies', 'Economics'];
  }
  if (discipline === 'Geography') {
    return ['Social Studies', 'Geography'];
  }
  if (discipline === 'History') {
    return ['Social Studies', 'History'];
  }
  if (discipline === 'Sources and Evidence') {
    return ['Social Studies', 'Research Skills'];
  }
  if (discipline === 'Communication and Action') {
    return ['Social Studies', 'Civic Engagement'];
  }
  return ['Social Studies'];
}

// Run the seeder
seedC3SocialStudies()
  .then(() => {
    console.log('\nDone!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to seed:', error);
    process.exit(1);
  });
