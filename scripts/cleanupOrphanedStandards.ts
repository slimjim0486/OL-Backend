/**
 * Cleanup script to remove orphaned standards from previous data versions
 */

import { PrismaClient } from '@prisma/client';
import { britishNCMathematics } from '../src/config/britishCurriculum';

const prisma = new PrismaClient();

async function cleanupOrphanedStandards() {
  console.log('\n========================================');
  console.log('  Orphaned Standards Cleanup');
  console.log('========================================\n');

  // Get all valid notations from current curriculum data
  const validNotations = new Set<string>();
  for (const year of britishNCMathematics.years) {
    for (const standard of year.standards) {
      validNotations.add(standard.notation);
    }
  }
  console.log(`Valid notations in curriculum file: ${validNotations.size}`);

  // Get all standard sets for UK National Curriculum
  const jurisdiction = await prisma.curriculumJurisdiction.findFirst({
    where: { code: 'UK_NATIONAL_CURRICULUM' }
  });

  if (!jurisdiction) {
    console.log('No jurisdiction found. Nothing to clean up.');
    return;
  }

  const standardSets = await prisma.standardSet.findMany({
    where: { jurisdictionId: jurisdiction.id },
    orderBy: { gradeLevel: 'asc' }
  });

  console.log(`\nChecking ${standardSets.length} standard sets...\n`);

  let totalOrphaned = 0;
  let totalDeleted = 0;

  for (const set of standardSets) {
    // Get all standards in this set
    const standards = await prisma.learningStandard.findMany({
      where: { standardSetId: set.id },
      select: { id: true, notation: true }
    });

    // Find orphaned standards (not in validNotations)
    const orphaned = standards.filter(s => !s.notation || !validNotations.has(s.notation));

    const expected = britishNCMathematics.years.find(y => y.year === set.gradeLevel)?.standards.length || 0;

    if (orphaned.length > 0) {
      console.log(`Year ${set.gradeLevel} (${set.code}):`);
      console.log(`  Current: ${standards.length}, Expected: ${expected}, Orphaned: ${orphaned.length}`);

      // Show first few orphaned notations
      const orphanedNotations = orphaned.slice(0, 5).map(s => s.notation || 'null').join(', ');
      console.log(`  Sample orphaned: ${orphanedNotations}${orphaned.length > 5 ? '...' : ''}`);

      // Delete orphaned standards
      const result = await prisma.learningStandard.deleteMany({
        where: { id: { in: orphaned.map(s => s.id) } }
      });

      console.log(`  Deleted: ${result.count}\n`);
      totalOrphaned += orphaned.length;
      totalDeleted += result.count;
    } else {
      console.log(`Year ${set.gradeLevel}: ${standards.length} standards ✓`);
    }
  }

  // Also check for any standard sets that shouldn't exist (old Years 7, 8 with wrong codes)
  const oldSets = await prisma.standardSet.findMany({
    where: {
      jurisdictionId: jurisdiction.id,
      code: {
        notIn: [
          'UK.KS1.Y1.MA', 'UK.KS1.Y2.MA',
          'UK.KS2.Y3.MA', 'UK.KS2.Y4.MA', 'UK.KS2.Y5.MA', 'UK.KS2.Y6.MA',
          'UK.KS3.Y7.MA', 'UK.KS3.Y8.MA', 'UK.KS3.Y9.MA'
        ]
      }
    }
  });

  if (oldSets.length > 0) {
    console.log(`\nFound ${oldSets.length} obsolete standard sets to delete:`);
    for (const oldSet of oldSets) {
      console.log(`  - ${oldSet.code}`);

      // Delete standards in this set first
      const deletedStandards = await prisma.learningStandard.deleteMany({
        where: { standardSetId: oldSet.id }
      });
      console.log(`    Deleted ${deletedStandards.count} standards`);

      // Delete the set
      await prisma.standardSet.delete({ where: { id: oldSet.id } });
      console.log(`    Deleted standard set`);
    }
  }

  // Final verification
  console.log('\n========================================');
  console.log('  Final Verification');
  console.log('========================================\n');

  const finalSets = await prisma.standardSet.findMany({
    where: { jurisdictionId: jurisdiction.id },
    orderBy: { gradeLevel: 'asc' }
  });

  let grandTotal = 0;
  for (const set of finalSets) {
    const count = await prisma.learningStandard.count({
      where: { standardSetId: set.id }
    });
    const expected = britishNCMathematics.years.find(y => y.year === set.gradeLevel)?.standards.length || 0;
    const status = count === expected ? '✓' : `❌ (expected ${expected})`;
    console.log(`  Year ${set.gradeLevel}: ${count} standards ${status}`);
    grandTotal += count;
  }

  console.log(`\n  Grand Total: ${grandTotal} standards`);
  console.log(`  Expected: ${britishNCMathematics.years.reduce((sum, y) => sum + y.standards.length, 0)} standards`);

  if (totalDeleted > 0) {
    console.log(`\n  Cleaned up ${totalDeleted} orphaned standards`);
  } else {
    console.log('\n  No orphaned standards found');
  }

  await prisma.$disconnect();
}

cleanupOrphanedStandards()
  .then(() => {
    console.log('\nDone!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Cleanup failed:', error);
    process.exit(1);
  });
