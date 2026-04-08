/**
 * One-off diagnostic: compare expected standard counts from the source config
 * files against what is actually in the database. Flags any seeder that
 * appears to have been updated since its last run (source count > DB count).
 *
 * Run with: npx tsx scripts/diffCurriculumCounts.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Check {
  label: string;
  jurisdictionCode: string;
  subject: string;
  expected: number;
}

async function loadChecks(): Promise<Check[]> {
  const checks: Check[] = [];
  const tryAdd = async (label: string, jurisdictionCode: string, subject: string, loader: () => Promise<number>) => {
    try {
      const expected = await loader();
      checks.push({ label, jurisdictionCode, subject, expected });
    } catch (e) {
      console.warn(`  [skip] ${label}: ${(e as Error).message}`);
    }
  };

  // CBSE
  await tryAdd('CBSE Math', 'INDIAN_CBSE', 'MATH', async () => (await import('../src/config/cbseMathCurriculum')).getTotalCBSEMathStandardsCount());
  await tryAdd('CBSE Science', 'INDIAN_CBSE', 'SCIENCE', async () => (await import('../src/config/cbseScienceCurriculum')).getTotalCBSEScienceStandardsCount());
  await tryAdd('CBSE English', 'INDIAN_CBSE', 'ENGLISH', async () => (await import('../src/config/cbseEnglishCurriculum')).getTotalCBSEEnglishStandardsCount());
  await tryAdd('CBSE Social Science', 'INDIAN_CBSE', 'SOCIAL_STUDIES', async () => (await import('../src/config/cbseSocialScienceCurriculum')).getTotalCBSESocialScienceStandardsCount());

  // ICSE
  await tryAdd('ICSE Math', 'INDIAN_ICSE', 'MATH', async () => (await import('../src/config/icseMathCurriculum')).getTotalICSEMathStandardsCount());
  await tryAdd('ICSE Science', 'INDIAN_ICSE', 'SCIENCE', async () => (await import('../src/config/icseScienceCurriculum')).getTotalICSEScienceStandardsCount());
  await tryAdd('ICSE English', 'INDIAN_ICSE', 'ENGLISH', async () => (await import('../src/config/icseEnglishCurriculum')).getTotalICSEEnglishStandardsCount());
  await tryAdd('ICSE Social Science', 'INDIAN_ICSE', 'SOCIAL_STUDIES', async () => (await import('../src/config/icseSocialScienceCurriculum')).getTotalICSESocialScienceStandardsCount());

  // British National Curriculum
  await tryAdd('British Math', 'UK_NATIONAL_CURRICULUM', 'MATH', async () => (await import('../src/config/britishCurriculum')).getTotalStandardsCount());
  await tryAdd('British English', 'UK_NATIONAL_CURRICULUM', 'ENGLISH', async () => (await import('../src/config/britishEnglishCurriculum')).getTotalEnglishStandardsCount());
  await tryAdd('British Science', 'UK_NATIONAL_CURRICULUM', 'SCIENCE', async () => (await import('../src/config/britishScienceCurriculum')).getTotalScienceStandardsCount());
  await tryAdd('British History', 'UK_NATIONAL_CURRICULUM', 'HISTORY', async () => (await import('../src/config/britishHistoryCurriculum')).getTotalHistoryStandardsCount());
  await tryAdd('British Geography', 'UK_NATIONAL_CURRICULUM', 'GEOGRAPHY', async () => (await import('../src/config/britishGeographyCurriculum')).getTotalGeographyStandardsCount());

  // US Common Core + NGSS + C3
  await tryAdd('Common Core Math', 'US_COMMON_CORE', 'MATH', async () => (await import('../src/config/commonCoreMath')).getTotalCommonCoreMathStandardsCount());
  await tryAdd('Common Core ELA', 'US_COMMON_CORE', 'ENGLISH', async () => (await import('../src/config/commonCoreELA')).getTotalCommonCoreELAStandardsCount());
  await tryAdd('NGSS Science', 'US_NGSS', 'SCIENCE', async () => (await import('../src/config/ngssScienceCurriculum')).getTotalNGSSStandardsCount());
  await tryAdd('C3 Social Studies', 'US_C3', 'SOCIAL_STUDIES', async () => (await import('../src/config/c3SocialStudies')).getTotalC3StandardsCount());

  // IB PYP
  await tryAdd('IB PYP Math', 'IB_PYP', 'MATH', async () => (await import('../src/config/ibPYPMathCurriculum')).getTotalMathStandardsCount());
  await tryAdd('IB PYP English', 'IB_PYP', 'ENGLISH', async () => (await import('../src/config/ibPYPEnglishCurriculum')).getTotalEnglishStandardsCount());
  await tryAdd('IB PYP Social Studies', 'IB_PYP', 'SOCIAL_STUDIES', async () => (await import('../src/config/ibPYPSocialStudies')).getTotalIBPYPSocialStudiesCount());

  // IB MYP/DP
  await tryAdd('IB MYP/DP English', 'IB_MYP_DP', 'ENGLISH', async () => (await import('../src/config/ibMYPDPEnglishCurriculum')).getTotalIBMYPDPEnglishStandardsCount());

  return checks;
}

async function main() {
  const checks = await loadChecks();

  console.log('\n  Source → DB comparison');
  console.log('  ' + '-'.repeat(70));
  console.log(`  ${'Subject'.padEnd(28)} | ${'Expected'.padStart(9)} | ${'Actual'.padStart(7)} | Status`);
  console.log('  ' + '-'.repeat(70));

  let anyDelta = false;
  for (const check of checks) {
    const actual = await prisma.learningStandard.count({
      where: {
        standardSet: {
          jurisdiction: { code: check.jurisdictionCode },
          subject: check.subject as any,
        },
      },
    });
    const delta = check.expected - actual;
    const status = delta === 0 ? 'OK' : delta > 0 ? `NEEDS SEED (+${delta})` : `OVER BY ${-delta}`;
    if (delta !== 0) anyDelta = true;
    console.log(
      `  ${check.label.padEnd(28)} | ${String(check.expected).padStart(9)} | ${String(actual).padStart(7)} | ${status}`
    );
  }
  console.log('  ' + '-'.repeat(70));
  console.log(anyDelta ? '\n  Deltas found — some seeders need re-run.' : '\n  All checked subjects are fully seeded.');

  await prisma.$disconnect();
  process.exit(anyDelta ? 1 : 0);
}

main().catch(err => {
  console.error(err);
  process.exit(2);
});
