/**
 * One-off trace: print the curriculum grounding block that
 * streamExtractionService.fetchCurriculumGroundingForProfile would produce
 * for a real teacher in production. Used to manually verify Phase 4.8 Item 1
 * before / after deploy.
 *
 * Run with: npx tsx scripts/traceExtractionGrounding.ts <teacherId>
 */
import { PrismaClient } from '@prisma/client';
import { streamExtractionService } from '../src/services/teacher/streamExtractionService';
// Re-implement the (private) grounding fetch using the same primitives the
// service uses, since fetchCurriculumGroundingForProfile is not exported.
import { curriculumAdapterService } from '../src/services/teacher/curriculumAdapterService';
import { normalizeTopicSubjectToEnum } from '../src/services/teacher/teachingGraphService';

const prisma = new PrismaClient();

const GROUNDING_MAX_STANDARDS = 50;
const GROUNDING_DESCRIPTION_MAX_CHARS = 120;
const GROUNDING_MAX_SUBJECTS = 3;

async function fetchGrounding(profile: any): Promise<string> {
  const curriculum = profile.preferredCurriculum;
  const gradeLevel = profile.gradeRange || profile.gradesTaught?.[0] || '';
  if (!curriculum || !gradeLevel) return '';

  const rawSubjects: string[] = [
    profile.primarySubject ?? '',
    ...(profile.subjectsTaught ?? []),
  ].filter(Boolean);
  const normalizedSubjects = new Set<string>();
  for (const raw of rawSubjects) {
    const normalized = normalizeTopicSubjectToEnum(raw);
    if (normalized) normalizedSubjects.add(normalized);
    if (normalizedSubjects.size >= GROUNDING_MAX_SUBJECTS) break;
  }

  const standards = await curriculumAdapterService.getStandardsForTeacher(
    curriculum,
    gradeLevel,
    [...normalizedSubjects]
  );
  if (!standards.length) return '';

  const limited = standards.slice(0, GROUNDING_MAX_STANDARDS);
  const byStrand = new Map<string, typeof limited>();
  for (const s of limited) {
    const key = s.strand || '(general)';
    const list = byStrand.get(key) || [];
    list.push(s);
    byStrand.set(key, list);
  }

  const lines: string[] = [];
  for (const [strand, list] of byStrand) {
    lines.push(`  [${strand}]`);
    for (const s of list) {
      const desc =
        s.description.length > GROUNDING_DESCRIPTION_MAX_CHARS
          ? s.description.slice(0, GROUNDING_DESCRIPTION_MAX_CHARS - 3) + '...'
          : s.description;
      lines.push(`  - ${s.code}: ${desc}`);
    }
  }
  return lines.join('\n');
}

async function main() {
  const teacherId = process.argv[2] || '3c858a1b-a54e-43d8-83c7-54b6bf95bca9';

  const profile = await streamExtractionService.getTeacherProfile(teacherId);
  console.log('\n=== Profile resolved by getTeacherProfile() ===');
  console.log(JSON.stringify(profile, null, 2));

  console.log('\n=== Curriculum grounding block (what Gemini will see) ===');
  const grounding = await fetchGrounding(profile);
  if (!grounding) {
    console.log('(empty — profile lacks curriculum/grade or lookup failed)');
  } else {
    console.log(grounding);
    console.log(`\n  Block size: ${grounding.length} chars`);
  }

  await prisma.$disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('Trace failed:', err);
  prisma.$disconnect();
  process.exit(1);
});
