import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { contentDripService } from '../src/services/teacher/contentDripService.js';

const prisma = new PrismaClient();

const TEACHER_EMAIL = (process.env.TEACHER_EMAIL || 'saleem@mydscvr.ai').trim().toLowerCase();
const RESET = process.env.RESET === 'true';
const RESUME = process.env.RESUME === 'true';

async function main() {
  const teacher = await prisma.teacher.findUnique({
    where: { email: TEACHER_EMAIL },
    select: {
      id: true,
      email: true,
      firstName: true,
      dripEnrollment: true,
    },
  });

  if (!teacher) {
    throw new Error(`Teacher not found for ${TEACHER_EMAIL}`);
  }

  if (RESUME && teacher.dripEnrollment) {
    await contentDripService.resumeEnrollment(teacher.id);
  }

  const result = await contentDripService.processTeacherByEmail(teacher.email, {
    reset: RESET,
    force: true,
  });

  const enrollment = await prisma.contentDripEnrollment.findUnique({
    where: { teacherId: teacher.id },
  });

  console.log(JSON.stringify({
    teacherEmail: teacher.email,
    reset: RESET,
    resumed: RESUME,
    result,
    enrollment,
  }, null, 2));
}

main()
  .catch((error) => {
    console.error('Content drip pilot failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

