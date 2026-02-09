import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const email = process.argv[2] || 'support@orbitlearn.app';

  const teacher = await prisma.teacher.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      subscriptionTier: true,
      monthlyTokenQuota: true,
      currentMonthUsage: true,
      quotaResetDate: true,
      rolledOverCredits: true,
      bonusCredits: true,
      notifiedWarning70: true,
      notifiedWarning90: true,
      notifiedLimitReached: true,
      lastNotificationReset: true,
      createdAt: true,
    }
  });

  if (!teacher) {
    console.log('Teacher not found:', email);
    return;
  }

  console.log('=== Teacher Account ===');
  console.log('Email:', teacher.email);
  console.log('Name:', teacher.firstName, teacher.lastName);
  console.log('Tier:', teacher.subscriptionTier);
  console.log('Created:', teacher.createdAt);

  // Calculate percentages
  const quota = Number(teacher.monthlyTokenQuota);
  const used = Number(teacher.currentMonthUsage);
  const remaining = quota - used;
  const usedPercent = ((used / quota) * 100).toFixed(1);
  const remainingPercent = ((remaining / quota) * 100).toFixed(1);

  console.log('\n=== Usage Summary ===');
  console.log('Monthly Quota (tokens):', quota.toLocaleString());
  console.log('Used (tokens):', used.toLocaleString());
  console.log('Remaining (tokens):', remaining.toLocaleString());
  console.log('Used %:', usedPercent + '%');
  console.log('Remaining %:', remainingPercent + '%');
  console.log('Rolled Over Credits:', teacher.rolledOverCredits);
  console.log('Bonus Credits:', teacher.bonusCredits);

  console.log('\n=== Notification Flags ===');
  console.log('70% Warning Sent:', teacher.notifiedWarning70);
  console.log('90% Warning Sent:', teacher.notifiedWarning90);
  console.log('Limit Reached Sent:', teacher.notifiedLimitReached);
  console.log('Quota Reset Date:', teacher.quotaResetDate);
  console.log('Last Notification Reset:', teacher.lastNotificationReset);

  // Check recent usage logs
  const recentUsage = await prisma.tokenUsageLog.findMany({
    where: { teacherId: teacher.id },
    orderBy: { createdAt: 'desc' },
    take: 15,
    select: {
      operation: true,
      tokensUsed: true,
      creditsUsed: true,
      createdAt: true,
    }
  });

  console.log('\n=== Recent Usage Logs (last 15) ===');
  if (recentUsage.length === 0) {
    console.log('No usage logs found');
  } else {
    recentUsage.forEach(log => {
      const date = log.createdAt.toISOString().split('T')[0];
      console.log(`${date} | ${log.operation.padEnd(22)} | ${log.tokensUsed.toString().padStart(6)} tokens (${log.creditsUsed} credits)`);
    });
  }

  // Sum of usage logs this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const monthlyLogs = await prisma.tokenUsageLog.aggregate({
    where: {
      teacherId: teacher.id,
      createdAt: { gte: startOfMonth }
    },
    _sum: { tokensUsed: true }
  });

  console.log('\n=== Sync Check ===');
  console.log('currentMonthUsage in Teacher record:', used.toLocaleString());
  console.log('Sum of TokenUsageLog this month:', (monthlyLogs._sum.tokensUsed || 0).toLocaleString());

  const difference = used - (monthlyLogs._sum.tokensUsed || 0);
  if (difference !== 0) {
    console.log('⚠️  MISMATCH! Difference:', difference.toLocaleString());
  } else {
    console.log('✅ Data is in sync');
  }
}

check().catch(console.error).finally(() => prisma.$disconnect());
