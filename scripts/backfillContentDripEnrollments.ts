import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { contentDripService } from '../src/services/teacher/contentDripService.js';

const prisma = new PrismaClient();

const SINCE = (process.env.SINCE || '2026-03-19T00:00:00.000Z').trim();
const RESET = process.env.RESET === 'true';
const LIMIT = Number.parseInt(process.env.LIMIT || '0', 10);
const sinceDate = new Date(SINCE);

if (Number.isNaN(sinceDate.getTime())) {
  throw new Error(`Invalid SINCE date: ${SINCE}`);
}

async function main() {
  const teachers = await prisma.teacher.findMany({
    where: {
      createdAt: { gte: sinceDate },
      agentProfile: {
        is: {
          onboardingComplete: true,
        },
      },
    },
    select: {
      id: true,
      email: true,
      createdAt: true,
      dripEnrollment: {
        select: {
          id: true,
          status: true,
          currentStep: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
    take: LIMIT > 0 ? LIMIT : undefined,
  });

  let enrolled = 0;
  let updated = 0;
  let skipped = 0;

  for (const teacher of teachers) {
    const existing = teacher.dripEnrollment;

    if (existing && !RESET) {
      skipped += 1;
      console.log(`[skip] ${teacher.email} already enrolled (${existing.status}, step ${existing.currentStep})`);
      continue;
    }

    await contentDripService.enrollTeacher(teacher.id, {
      reset: RESET,
      force: true,
      queueImmediate: true,
    });

    if (existing) {
      updated += 1;
      console.log(`[reset] ${teacher.email}`);
    } else {
      enrolled += 1;
      console.log(`[enrolled] ${teacher.email}`);
    }
  }

  console.log(JSON.stringify({
    since: sinceDate.toISOString(),
    totalCandidates: teachers.length,
    enrolled,
    updated,
    skipped,
  }, null, 2));
}

main()
  .catch((error) => {
    console.error('Backfill failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

