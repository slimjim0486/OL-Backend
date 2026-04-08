/**
 * Backfill: TeachingGraphNode.linkedStandardCodes → CurriculumState.standardsTaught
 *
 * Phase 4.8 Option B introduced a forward-looking sync in
 * teachingGraphService.processStreamEntry that keeps CurriculumState.standardsTaught
 * in lockstep with the teaching graph's linkedStandardCodes on every new stream
 * entry. This script handles the one-time backfill for existing teachers who
 * have populated topic nodes but either:
 *   (a) have a CurriculumState for the wrong school year / with empty standardsTaught
 *   (b) have no CurriculumState at all (the intelligence-portal beta testers)
 *
 * For each teacher with coded topic nodes:
 *   1. Group codes by normalized Subject enum
 *   2. For each subject, upsert a CurriculumState for the current school year
 *      under the (agentId, subject, schoolYear) composite unique
 *   3. Union existing standardsTaught with the graph-derived codes
 *
 * Idempotent by design — reruns only add missing codes. Never overwrites.
 *
 * Run with:
 *   npx tsx scripts/backfillStandardsTaught.ts           # dry-run (default)
 *   npx tsx scripts/backfillStandardsTaught.ts --apply   # actually write
 */
import { PrismaClient, Subject } from '@prisma/client';
import {
  normalizeTopicSubjectToEnum,
  computeCurrentSchoolYear,
} from '../src/services/teacher/teachingGraphService';

const prisma = new PrismaClient();

type Action = 'create' | 'update';

interface Plan {
  teacherId: string;
  agentId: string;
  subject: Subject;
  schoolYear: string;
  action: Action;
  existingStateId: string | null;
  existingCount: number;
  addingCount: number;
  resultingCount: number;
  sampleNewCodes: string[];
}

async function buildPlan(): Promise<Plan[]> {
  const plans: Plan[] = [];
  const currentYear = computeCurrentSchoolYear();

  // Optimization: fetch ALL topic nodes with linkedStandardCodes in a single
  // query, then group by teacherId client-side. This replaces N sequential
  // queries (one per agent) with 1 batched query. Critical for the Railway
  // proxy where each round-trip is ~100-200ms.
  const allCodedTopics = await prisma.teachingGraphNode.findMany({
    where: {
      type: 'TOPIC',
      linkedStandardCodes: { isEmpty: false },
    },
    select: {
      teacherId: true,
      subject: true,
      linkedStandardCodes: true,
      label: true,
    },
  });

  if (allCodedTopics.length === 0) return plans;

  // Group topics by teacher
  const topicsByTeacher = new Map<string, typeof allCodedTopics>();
  for (const topic of allCodedTopics) {
    const list = topicsByTeacher.get(topic.teacherId) || [];
    list.push(topic);
    topicsByTeacher.set(topic.teacherId, list);
  }

  // Batched lookup: resolve agents for all teachers with coded topics at once
  const agents = await prisma.teacherAgent.findMany({
    where: { teacherId: { in: [...topicsByTeacher.keys()] } },
    select: { id: true, teacherId: true },
  });

  for (const agent of agents) {
    const topics = topicsByTeacher.get(agent.teacherId) || [];
    if (topics.length === 0) continue;

    const codesBySubject = new Map<Subject, Set<string>>();
    for (const topic of topics) {
      const subject = normalizeTopicSubjectToEnum(topic.subject);
      if (!subject) continue;
      if (!codesBySubject.has(subject)) codesBySubject.set(subject, new Set());
      const set = codesBySubject.get(subject)!;
      for (const code of topic.linkedStandardCodes) {
        if (code) set.add(code);
      }
    }
    if (codesBySubject.size === 0) continue;

    for (const [subject, codeSet] of codesBySubject) {
      const existing = await prisma.curriculumState.findUnique({
        where: {
          agentId_subject_schoolYear: {
            agentId: agent.id,
            subject,
            schoolYear: currentYear,
          },
        },
        select: { id: true, standardsTaught: true },
      });

      const existingSet = new Set(existing?.standardsTaught || []);
      const beforeSize = existingSet.size;
      const newCodes: string[] = [];
      for (const code of codeSet) {
        if (!existingSet.has(code)) newCodes.push(code);
        existingSet.add(code);
      }
      // If there's an existing state and it already has everything, skip.
      if (existing && existingSet.size === beforeSize) continue;

      plans.push({
        teacherId: agent.teacherId,
        agentId: agent.id,
        subject,
        schoolYear: currentYear,
        action: existing ? 'update' : 'create',
        existingStateId: existing?.id ?? null,
        existingCount: beforeSize,
        addingCount: newCodes.length,
        resultingCount: existingSet.size,
        sampleNewCodes: newCodes.slice(0, 5),
      });
    }
  }

  return plans;
}

async function apply(plans: Plan[]): Promise<void> {
  let applied = 0;
  for (const plan of plans) {
    // Recompute from source-of-truth topic nodes so a concurrent forward-sync
    // from processStreamEntry can't cause us to write a stale union.
    const topics = await prisma.teachingGraphNode.findMany({
      where: {
        teacherId: plan.teacherId,
        type: 'TOPIC',
        linkedStandardCodes: { isEmpty: false },
      },
      select: { subject: true, linkedStandardCodes: true },
    });
    const relevant = new Set<string>();
    for (const topic of topics) {
      if (normalizeTopicSubjectToEnum(topic.subject) !== plan.subject) continue;
      for (const code of topic.linkedStandardCodes) {
        if (code) relevant.add(code);
      }
    }

    const current = await prisma.curriculumState.findUnique({
      where: {
        agentId_subject_schoolYear: {
          agentId: plan.agentId,
          subject: plan.subject,
          schoolYear: plan.schoolYear,
        },
      },
      select: { id: true, standardsTaught: true },
    });

    const merged = new Set(current?.standardsTaught || []);
    const beforeSize = merged.size;
    for (const code of relevant) merged.add(code);
    if (current && merged.size === beforeSize) continue;

    await prisma.curriculumState.upsert({
      where: {
        agentId_subject_schoolYear: {
          agentId: plan.agentId,
          subject: plan.subject,
          schoolYear: plan.schoolYear,
        },
      },
      create: {
        agentId: plan.agentId,
        subject: plan.subject,
        schoolYear: plan.schoolYear,
        standardsTaught: [...merged],
      },
      update: {
        standardsTaught: [...merged],
      },
    });
    applied++;
    const verb = current ? 'updated' : 'created';
    console.log(
      `  [${verb}] teacher=${plan.teacherId.slice(0, 8)}… subject=${plan.subject.padEnd(18)} year=${plan.schoolYear} ${beforeSize} → ${merged.size} (+${merged.size - beforeSize})`
    );
  }
  console.log(`\n  Applied ${applied} upserts.`);
}

async function main() {
  const args = process.argv.slice(2);
  const shouldApply = args.includes('--apply');

  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║  Backfill: standardsTaught from linkedStandardCodes    ║');
  console.log(`║  Mode: ${(shouldApply ? 'APPLY (writing)' : 'DRY-RUN (no writes)').padEnd(47)} ║`);
  console.log(`║  School year: ${computeCurrentSchoolYear().padEnd(40)} ║`);
  console.log('╚════════════════════════════════════════════════════════╝');

  const plans = await buildPlan();

  if (plans.length === 0) {
    console.log('\n  Nothing to backfill — every teacher with coded topic nodes');
    console.log('  already has a CurriculumState covering the current year with');
    console.log('  standardsTaught in sync.');
    await prisma.$disconnect();
    process.exit(0);
  }

  console.log(`\n  ${plans.length} CurriculumState rows need action:\n`);
  console.log(`  ${'Action'.padEnd(7)} | ${'Teacher'.padEnd(12)} | ${'Subject'.padEnd(18)} | ${'Year'.padEnd(10)} | ${'Before'.padStart(6)} | ${'Adding'.padStart(7)} | ${'After'.padStart(6)} | Sample new codes`);
  console.log('  ' + '-'.repeat(120));

  let totalAdded = 0;
  let createCount = 0;
  let updateCount = 0;
  for (const p of plans) {
    totalAdded += p.addingCount;
    if (p.action === 'create') createCount++;
    else updateCount++;
    console.log(
      `  ${p.action.padEnd(7)} | ${(p.teacherId.slice(0, 8) + '…').padEnd(12)} | ${p.subject.padEnd(18)} | ${p.schoolYear.padEnd(10)} | ${String(p.existingCount).padStart(6)} | ${String(p.addingCount).padStart(7)} | ${String(p.resultingCount).padStart(6)} | ${p.sampleNewCodes.join(', ')}${p.addingCount > 5 ? ', …' : ''}`
    );
  }
  console.log('  ' + '-'.repeat(120));
  console.log(`  ${createCount} creates, ${updateCount} updates, ${totalAdded} codes total.`);

  if (!shouldApply) {
    console.log('\n  Dry-run complete. Re-run with --apply to write the changes.');
    await prisma.$disconnect();
    process.exit(0);
  }

  console.log('\n  Applying updates...\n');
  await apply(plans);

  await prisma.$disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('Backfill failed:', err);
  prisma.$disconnect();
  process.exit(1);
});
