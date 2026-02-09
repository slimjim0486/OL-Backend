/**
 * Migration Script: Create TeacherAgent records for existing teachers
 *
 * This script:
 * 1. Creates TeacherAgent with setupStatus: NOT_STARTED for each teacher
 * 2. Pre-populates from existing Teacher fields (schoolName, subject, curriculum)
 * 3. Creates empty TeacherStyleProfile
 * 4. Is idempotent (safe to re-run via unique constraint)
 *
 * Usage:
 *   cd backend && npx tsx scripts/migrateTeachersToAgent.ts
 */

import { PrismaClient, AgentSetupStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting teacher-to-agent migration...\n');

  // Get all teachers that don't have an agent profile yet
  const teachers = await prisma.teacher.findMany({
    where: {
      agentProfile: null, // Only teachers without an agent
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      schoolName: true,
      primarySubject: true,
      preferredCurriculum: true,
      preferredGradeRange: true,
    },
  });

  console.log(`Found ${teachers.length} teachers without agent profiles.\n`);

  if (teachers.length === 0) {
    console.log('Nothing to migrate. All teachers already have agent profiles.');
    return;
  }

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const teacher of teachers) {
    try {
      // Create TeacherAgent with pre-populated fields
      const agent = await prisma.teacherAgent.create({
        data: {
          teacherId: teacher.id,
          setupStatus: AgentSetupStatus.NOT_STARTED,
          schoolName: teacher.schoolName,
          curriculumType: teacher.preferredCurriculum,
          subjectsTaught: teacher.primarySubject ? [teacher.primarySubject] : [],
          gradesTaught: teacher.preferredGradeRange ? [teacher.preferredGradeRange] : [],
        },
      });

      // Create empty style profile
      await prisma.teacherStyleProfile.create({
        data: { agentId: agent.id },
      });

      created++;
      if (created % 50 === 0) {
        console.log(`  Progress: ${created}/${teachers.length} created...`);
      }
    } catch (error: any) {
      if (error.code === 'P2002') {
        // Unique constraint violation — agent already exists (idempotent)
        skipped++;
      } else {
        errors++;
        console.error(`  Error for teacher ${teacher.email}: ${error.message}`);
      }
    }
  }

  console.log(`\nMigration complete!`);
  console.log(`  Created: ${created}`);
  console.log(`  Skipped (already exist): ${skipped}`);
  console.log(`  Errors: ${errors}`);
}

main()
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
