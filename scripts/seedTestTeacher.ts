// Seed script to create test teacher account
import bcrypt from 'bcrypt';
import { PrismaClient, TeacherRole, TeacherSubscriptionTier } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'teacher@test.com';
  const password = 'Teacher123';
  const passwordHash = await bcrypt.hash(password, 12);

  // Check if already exists
  const existing = await prisma.teacher.findUnique({
    where: { email },
  });

  if (existing) {
    console.log('Test teacher already exists, updating password...');
    await prisma.teacher.update({
      where: { email },
      data: { passwordHash },
    });
    console.log('Password updated!');
  } else {
    console.log('Creating test teacher account...');
    await prisma.teacher.create({
      data: {
        email,
        passwordHash,
        firstName: 'Test',
        lastName: 'Teacher',
        emailVerified: true,
        role: TeacherRole.TEACHER,
        subscriptionTier: TeacherSubscriptionTier.FREE,
        monthlyTokenQuota: BigInt(30000),
        currentMonthUsage: BigInt(0),
        quotaResetDate: new Date(),
      },
    });
    console.log('Test teacher created!');
  }

  console.log('\n✅ Test teacher account ready:');
  console.log('   Email: teacher@test.com');
  console.log('   Password: Teacher123');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
