/**
 * Master Seed Script: All Curriculum Standards
 *
 * Orchestrates all curriculum seed scripts with grouped execution.
 *
 * Usage:
 *   npx tsx scripts/seedAllCurricula.ts           # Run all groups
 *   npx tsx scripts/seedAllCurricula.ts --group=1  # Run only group 1 (US)
 *   npx tsx scripts/seedAllCurricula.ts --group=2  # Run only group 2 (British)
 *   npx tsx scripts/seedAllCurricula.ts --group=3  # Run only group 3 (CBSE)
 *   npx tsx scripts/seedAllCurricula.ts --group=4  # Run only group 4 (IB)
 *   npx tsx scripts/seedAllCurricula.ts --verify    # Run verification after seeding
 *   npx tsx scripts/seedAllCurricula.ts --verify-only # Only verify, don't seed
 *
 * Groups:
 *   1. US Standards (Common Core, NGSS, C3)
 *   2. British National Curriculum (Math, English, Science, History, Geography, Art, Computing)
 *   3. Indian CBSE (4 core subjects + Computer Science)
 *   4. IB Programmes (PYP, MYP/DP - Math, English, Science, Social Studies, Arts, Design)
 */

import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import path from 'path';

const prisma = new PrismaClient();

interface SeedScript {
  name: string;
  file: string;
  group: number;
  description: string;
}

const SEED_SCRIPTS: SeedScript[] = [
  // Group 1: US Standards
  { name: 'Common Core (Math + ELA)', file: 'seedCommonCore.ts', group: 1, description: 'CCSS K-12 Math + ELA standards' },
  { name: 'NGSS Science', file: 'seedNGSSCurriculum.ts', group: 1, description: 'Next Generation Science Standards K-12' },
  { name: 'C3 Social Studies', file: 'seedC3SocialStudies.ts', group: 1, description: 'C3 Framework for Social Studies K-8' },

  // Group 2: British National Curriculum
  { name: 'British Mathematics', file: 'seedBritishCurriculum.ts', group: 2, description: 'NC Mathematics Y1-13' },
  { name: 'British English', file: 'seedBritishEnglishCurriculum.ts', group: 2, description: 'NC English Y1-13' },
  { name: 'British Science', file: 'seedBritishScienceCurriculum.ts', group: 2, description: 'NC Science Y1-13' },
  { name: 'British History', file: 'seedBritishHistoryCurriculum.ts', group: 2, description: 'NC History Y1-9' },
  { name: 'British Geography', file: 'seedBritishGeographyCurriculum.ts', group: 2, description: 'NC Geography Y1-9' },
  { name: 'British Art & Design', file: 'seedBritishArtDesignCurriculum.ts', group: 2, description: 'NC Art & Design Y1-13' },
  { name: 'British Computing', file: 'seedBritishComputingCurriculum.ts', group: 2, description: 'NC Computing Y1-13' },

  // Group 3: Indian CBSE
  { name: 'CBSE (4 subjects)', file: 'seedCBSECurriculum.ts', group: 3, description: 'Math, Science, English, Social Science C1-8' },
  { name: 'CBSE Computer Science', file: 'seedCBSEComputerScience.ts', group: 3, description: 'Computer Science C9-12' },

  // Group 4: IB Programmes
  { name: 'IB PYP (4 subjects)', file: 'seedIBPYP.ts', group: 4, description: 'PYP Math, English, Science, Social Studies' },
  { name: 'IB MYP/DP (4 subjects)', file: 'seedIBMYPDP.ts', group: 4, description: 'MYP/DP Math, English, Science, Individuals & Societies' },
  { name: 'IB Arts', file: 'seedIBArts.ts', group: 4, description: 'Visual Arts & Music (PYP + MYP + DP)' },
  { name: 'IB Design', file: 'seedIBDesign.ts', group: 4, description: 'Design Technology (PYP + MYP + DP)' },
];

const GROUP_NAMES: Record<number, string> = {
  1: 'US Standards',
  2: 'British National Curriculum',
  3: 'Indian CBSE',
  4: 'IB Programmes',
};

async function runSeedScript(script: SeedScript): Promise<{ success: boolean; duration: number; error?: string }> {
  const scriptPath = path.join(__dirname, script.file);
  const startTime = Date.now();

  try {
    console.log(`\n  Running: ${script.name}...`);
    execSync(`npx tsx "${scriptPath}"`, {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe',
      timeout: 600000, // 10 minutes max per script
    });
    const duration = Date.now() - startTime;
    console.log(`  Done: ${script.name} (${(duration / 1000).toFixed(1)}s)`);
    return { success: true, duration };
  } catch (error: any) {
    const duration = Date.now() - startTime;
    const stderr = error.stderr?.toString() || error.message || 'Unknown error';
    console.error(`  FAILED: ${script.name} (${(duration / 1000).toFixed(1)}s)`);
    console.error(`    Error: ${stderr.split('\n')[0]}`);
    return { success: false, duration, error: stderr.split('\n')[0] };
  }
}

async function runVerification() {
  console.log('\n\n========================================');
  console.log('  VERIFICATION');
  console.log('========================================\n');

  const jurisdictions = await prisma.curriculumJurisdiction.findMany({
    include: {
      _count: {
        select: { standardSets: true }
      }
    },
    orderBy: { code: 'asc' }
  });

  console.log('  Jurisdiction Summary:');
  console.log('  ' + '-'.repeat(80));
  console.log(`  ${'Jurisdiction'.padEnd(30)} | ${'Sets'.padStart(5)} | ${'Standards'.padStart(10)} | ${'Country'.padEnd(15)}`);
  console.log('  ' + '-'.repeat(80));

  let totalSets = 0;
  let totalStandards = 0;

  for (const j of jurisdictions) {
    const standardCount = await prisma.learningStandard.count({
      where: { standardSet: { jurisdictionId: j.id } }
    });

    totalSets += j._count.standardSets;
    totalStandards += standardCount;

    console.log(
      `  ${j.code.padEnd(30)} | ${String(j._count.standardSets).padStart(5)} | ${String(standardCount).padStart(10)} | ${j.country.padEnd(15)}`
    );
  }

  console.log('  ' + '-'.repeat(80));
  console.log(
    `  ${'TOTAL'.padEnd(30)} | ${String(totalSets).padStart(5)} | ${String(totalStandards).padStart(10)} |`
  );
  console.log('  ' + '-'.repeat(80));

  // Subject breakdown
  console.log('\n  Subject Breakdown:');
  const subjectCounts = await prisma.standardSet.groupBy({
    by: ['subject'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } }
  });

  for (const sc of subjectCounts) {
    const standardCount = await prisma.learningStandard.count({
      where: { standardSet: { subject: sc.subject } }
    });
    console.log(`    ${sc.subject.padEnd(20)}: ${String(sc._count.id).padStart(3)} sets, ${String(standardCount).padStart(5)} standards`);
  }

  // Check for orphan standard sets (no learning standards)
  const orphanSets = await prisma.standardSet.findMany({
    where: {
      learningStandards: {
        none: {}
      }
    },
    select: { code: true, title: true }
  });

  if (orphanSets.length > 0) {
    console.log(`\n  WARNING: ${orphanSets.length} standard sets have no learning standards:`);
    orphanSets.forEach(s => console.log(`    - ${s.code}: ${s.title}`));
  } else {
    console.log('\n  All standard sets have learning standards.');
  }

  return { totalJurisdictions: jurisdictions.length, totalSets, totalStandards };
}

async function main() {
  const args = process.argv.slice(2);
  const groupArg = args.find(a => a.startsWith('--group='));
  const targetGroup = groupArg ? parseInt(groupArg.split('=')[1]) : null;
  const shouldVerify = args.includes('--verify');
  const verifyOnly = args.includes('--verify-only');

  console.log('\n╔════════════════════════════════════════╗');
  console.log('║    Orbit Learn Curriculum Data Seeder  ║');
  console.log('║    All Jurisdictions & Standards        ║');
  console.log('╚════════════════════════════════════════╝\n');

  if (verifyOnly) {
    const result = await runVerification();
    console.log(`\n  Summary: ${result.totalJurisdictions} jurisdictions, ${result.totalSets} sets, ${result.totalStandards} standards`);
    await prisma.$disconnect();
    process.exit(0);
  }

  const scriptsToRun = targetGroup
    ? SEED_SCRIPTS.filter(s => s.group === targetGroup)
    : SEED_SCRIPTS;

  if (targetGroup) {
    console.log(`Running Group ${targetGroup}: ${GROUP_NAMES[targetGroup]}`);
  } else {
    console.log('Running all groups...');
  }

  console.log(`  ${scriptsToRun.length} scripts to execute\n`);

  const results: Array<{ script: SeedScript; success: boolean; duration: number; error?: string }> = [];
  const startTime = Date.now();

  // Run scripts by group
  const groups = [...new Set(scriptsToRun.map(s => s.group))].sort();

  for (const group of groups) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`  Group ${group}: ${GROUP_NAMES[group]}`);
    console.log(`${'='.repeat(50)}`);

    const groupScripts = scriptsToRun.filter(s => s.group === group);
    for (const script of groupScripts) {
      const result = await runSeedScript(script);
      results.push({ script, ...result });
    }
  }

  // Summary table
  const totalDuration = Date.now() - startTime;

  console.log('\n\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║                    SEEDING RESULTS                              ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  console.log(`  ${'Script'.padEnd(35)} | ${'Status'.padEnd(8)} | ${'Time'.padStart(8)}`);
  console.log('  ' + '-'.repeat(60));

  for (const r of results) {
    const status = r.success ? 'OK' : 'FAILED';
    const time = `${(r.duration / 1000).toFixed(1)}s`;
    console.log(`  ${r.script.name.padEnd(35)} | ${status.padEnd(8)} | ${time.padStart(8)}`);
  }

  console.log('  ' + '-'.repeat(60));

  const succeeded = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`\n  Results: ${succeeded} succeeded, ${failed} failed`);
  console.log(`  Total time: ${(totalDuration / 1000).toFixed(1)}s`);

  if (failed > 0) {
    console.log('\n  Failed scripts:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`    - ${r.script.name}: ${r.error}`);
    });
  }

  // Run verification if requested
  if (shouldVerify) {
    await runVerification();
  }

  await prisma.$disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
