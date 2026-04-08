/**
 * Verification Script: Curriculum Standards Data Integrity
 *
 * Validates seeded data:
 * 1. Count standards per jurisdiction/subject/grade
 * 2. Check notation uniqueness within standard sets
 * 3. Find orphan standard sets (zero children)
 * 4. List all jurisdictions with summary stats
 * 5. Verify curriculumService getJurisdictionCode() mappings match DB
 *
 * Run with: npx tsx scripts/verifyCurriculumData.ts
 */

import { PrismaClient, Subject } from '@prisma/client';

const prisma = new PrismaClient();

interface VerificationResult {
  passed: boolean;
  message: string;
  details?: string[];
}

async function verifyJurisdictions(): Promise<VerificationResult> {
  console.log('\n[1/5] Verifying Jurisdictions...');

  const jurisdictions = await prisma.curriculumJurisdiction.findMany({
    orderBy: { code: 'asc' }
  });

  const expectedCodes = [
    'IB_MYP_DP',
    'IB_PYP',
    'INDIAN_CBSE',
    'INDIAN_ICSE',
    'UK_NATIONAL_CURRICULUM',
    'US_C3',
    'US_COMMON_CORE',
    'US_NGSS',
  ];

  const foundCodes = jurisdictions.map(j => j.code).sort();
  const missing = expectedCodes.filter(c => !foundCodes.includes(c));

  console.log(`  Found ${jurisdictions.length} jurisdictions:`);
  for (const j of jurisdictions) {
    console.log(`    ${j.code.padEnd(25)} | ${j.name}`);
  }

  if (missing.length > 0) {
    return {
      passed: false,
      message: `Missing jurisdictions: ${missing.join(', ')}`,
      details: missing.map(c => `Missing: ${c}`)
    };
  }

  return {
    passed: true,
    message: `All ${expectedCodes.length} expected jurisdictions found`
  };
}

async function verifyStandardCounts(): Promise<VerificationResult> {
  console.log('\n[2/5] Verifying Standard Counts...');

  const jurisdictions = await prisma.curriculumJurisdiction.findMany({
    orderBy: { code: 'asc' }
  });

  const issues: string[] = [];

  console.log(`\n  ${'Jurisdiction'.padEnd(27)} | ${'Subject'.padEnd(18)} | ${'Sets'.padStart(5)} | ${'Standards'.padStart(10)}`);
  console.log('  ' + '-'.repeat(70));

  let totalSets = 0;
  let totalStandards = 0;

  for (const j of jurisdictions) {
    // Get subject breakdown for this jurisdiction
    const subjectGroups = await prisma.standardSet.groupBy({
      by: ['subject'],
      where: { jurisdictionId: j.id },
      _count: { id: true },
      orderBy: { subject: 'asc' }
    });

    for (const sg of subjectGroups) {
      const standardCount = await prisma.learningStandard.count({
        where: {
          standardSet: {
            jurisdictionId: j.id,
            subject: sg.subject
          }
        }
      });

      totalSets += sg._count.id;
      totalStandards += standardCount;

      console.log(
        `  ${j.code.padEnd(27)} | ${sg.subject.padEnd(18)} | ${String(sg._count.id).padStart(5)} | ${String(standardCount).padStart(10)}`
      );

      // Flag subjects with zero standards
      if (standardCount === 0) {
        issues.push(`${j.code} / ${sg.subject}: 0 standards in ${sg._count.id} sets`);
      }
    }
  }

  console.log('  ' + '-'.repeat(70));
  console.log(`  ${'TOTAL'.padEnd(27)} | ${''.padEnd(18)} | ${String(totalSets).padStart(5)} | ${String(totalStandards).padStart(10)}`);

  if (issues.length > 0) {
    return {
      passed: false,
      message: `${issues.length} subjects have 0 standards`,
      details: issues
    };
  }

  return {
    passed: true,
    message: `${totalStandards} standards across ${totalSets} sets in ${jurisdictions.length} jurisdictions`
  };
}

async function verifyNotationUniqueness(): Promise<VerificationResult> {
  console.log('\n[3/5] Verifying Notation Uniqueness...');

  // Check for duplicate notations within the same standard set
  const duplicates = await prisma.$queryRaw<Array<{ standardSetId: string; notation: string; cnt: bigint }>>`
    SELECT "standardSetId", "notation", COUNT(*) as cnt
    FROM "LearningStandard"
    GROUP BY "standardSetId", "notation"
    HAVING COUNT(*) > 1
  `;

  if (duplicates.length > 0) {
    const details = duplicates.map(d => `Set ${d.standardSetId}: "${d.notation}" appears ${d.cnt} times`);
    console.log(`  Found ${duplicates.length} duplicate notations!`);
    details.forEach(d => console.log(`    ${d}`));

    return {
      passed: false,
      message: `${duplicates.length} duplicate notations found`,
      details
    };
  }

  const totalStandards = await prisma.learningStandard.count();
  console.log(`  All ${totalStandards} standards have unique notations within their sets.`);

  return {
    passed: true,
    message: `${totalStandards} standards all have unique notations`
  };
}

async function verifyOrphanSets(): Promise<VerificationResult> {
  console.log('\n[4/5] Checking for Orphan Standard Sets...');

  const orphanSets = await prisma.standardSet.findMany({
    where: {
      standards: {
        none: {}
      }
    },
    select: {
      code: true,
      title: true,
      jurisdiction: {
        select: { code: true }
      }
    }
  });

  if (orphanSets.length > 0) {
    const details = orphanSets.map(s => `${s.jurisdiction.code} / ${s.code}: ${s.title}`);
    console.log(`  Found ${orphanSets.length} orphan standard sets (no standards):`);
    details.forEach(d => console.log(`    ${d}`));

    return {
      passed: false,
      message: `${orphanSets.length} orphan standard sets found`,
      details
    };
  }

  const totalSets = await prisma.standardSet.count();
  console.log(`  All ${totalSets} standard sets have at least one learning standard.`);

  return {
    passed: true,
    message: `No orphan sets (${totalSets} total)`
  };
}

async function verifyJurisdictionMappings(): Promise<VerificationResult> {
  console.log('\n[5/5] Verifying Jurisdiction Code Mappings...');

  // These are the mappings from curriculumService.getJurisdictionCode()
  const expectedMappings: Array<{ curriculumType: string; subject?: string; expectedCode: string }> = [
    { curriculumType: 'AMERICAN', subject: undefined, expectedCode: 'US_COMMON_CORE' },
    { curriculumType: 'AMERICAN', subject: 'SCIENCE', expectedCode: 'US_NGSS' },
    { curriculumType: 'AMERICAN', subject: 'SOCIAL_STUDIES', expectedCode: 'US_C3' },
    { curriculumType: 'BRITISH', subject: undefined, expectedCode: 'UK_NATIONAL_CURRICULUM' },
    { curriculumType: 'IB', subject: undefined, expectedCode: 'IB_PYP' },
    { curriculumType: 'INDIAN_CBSE', subject: undefined, expectedCode: 'INDIAN_CBSE' },
    { curriculumType: 'INDIAN_ICSE', subject: undefined, expectedCode: 'INDIAN_ICSE' },
  ];

  const issues: string[] = [];

  for (const mapping of expectedMappings) {
    const jurisdiction = await prisma.curriculumJurisdiction.findUnique({
      where: { code: mapping.expectedCode }
    });

    if (!jurisdiction) {
      issues.push(`${mapping.curriculumType}${mapping.subject ? ` + ${mapping.subject}` : ''} → ${mapping.expectedCode}: NOT FOUND`);
      console.log(`  MISSING: ${mapping.expectedCode} (${mapping.curriculumType})`);
    } else {
      const standardCount = await prisma.learningStandard.count({
        where: { standardSet: { jurisdictionId: jurisdiction.id } }
      });
      console.log(`  OK: ${mapping.curriculumType}${mapping.subject ? ` + ${mapping.subject}` : ''} → ${mapping.expectedCode} (${standardCount} standards)`);
    }
  }

  // Also check IB_MYP_DP exists for grade >= 6
  const mypDp = await prisma.curriculumJurisdiction.findUnique({
    where: { code: 'IB_MYP_DP' }
  });
  if (mypDp) {
    const mypDpCount = await prisma.learningStandard.count({
      where: { standardSet: { jurisdictionId: mypDp.id } }
    });
    console.log(`  OK: IB (grade >= 6) → IB_MYP_DP (${mypDpCount} standards)`);
  } else {
    issues.push('IB_MYP_DP jurisdiction not found');
  }

  if (issues.length > 0) {
    return {
      passed: false,
      message: `${issues.length} mapping issues`,
      details: issues
    };
  }

  return {
    passed: true,
    message: 'All jurisdiction mappings verified'
  };
}

async function main() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║  Curriculum Data Verification Report   ║');
  console.log('╚════════════════════════════════════════╝');

  const results: Array<{ name: string; result: VerificationResult }> = [];

  try {
    results.push({ name: 'Jurisdictions', result: await verifyJurisdictions() });
    results.push({ name: 'Standard Counts', result: await verifyStandardCounts() });
    results.push({ name: 'Notation Uniqueness', result: await verifyNotationUniqueness() });
    results.push({ name: 'Orphan Sets', result: await verifyOrphanSets() });
    results.push({ name: 'Jurisdiction Mappings', result: await verifyJurisdictionMappings() });
  } catch (error) {
    console.error('\nVerification error:', error);
  }

  // Final summary
  console.log('\n\n╔════════════════════════════════════════════════════════╗');
  console.log('║             VERIFICATION SUMMARY                       ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  let allPassed = true;

  for (const r of results) {
    const icon = r.result.passed ? 'PASS' : 'FAIL';
    console.log(`  [${icon}] ${r.name}: ${r.result.message}`);
    if (!r.result.passed) {
      allPassed = false;
      if (r.result.details) {
        r.result.details.slice(0, 5).forEach(d => console.log(`         - ${d}`));
        if (r.result.details.length > 5) {
          console.log(`         ... and ${r.result.details.length - 5} more`);
        }
      }
    }
  }

  console.log(`\n  Overall: ${allPassed ? 'ALL CHECKS PASSED' : 'SOME CHECKS FAILED'}\n`);

  await prisma.$disconnect();
  process.exit(allPassed ? 0 : 1);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
