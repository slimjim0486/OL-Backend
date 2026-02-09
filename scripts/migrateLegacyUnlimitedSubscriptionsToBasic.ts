/**
 * Migration Script: Reclassify legacy "Unlimited" teacher subscriptions as BASIC (Teacher).
 *
 * Background:
 * - Historically the app mapped the single "Unlimited" subscription to the PROFESSIONAL tier.
 * - With the new pricing model, BASIC = Teacher and PROFESSIONAL = Teacher Pro.
 * - Any existing paid subscribers on the old Unlimited plan should be downgraded to BASIC
 *   so Teacher Pro feature gates work correctly.
 *
 * Safe criteria:
 * - Only updates individual teachers (organizationId = null)
 * - Only updates teachers who have an active Stripe subscription ID on file
 * - Only updates teachers currently marked as PROFESSIONAL
 *
 * Usage:
 *   cd backend && npx tsx scripts/migrateLegacyUnlimitedSubscriptionsToBasic.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Migrating legacy Unlimited subscriptions (PROFESSIONAL) -> BASIC...\n');

  const teachers = await prisma.teacher.findMany({
    where: {
      organizationId: null,
      stripeSubscriptionId: { not: null },
      subscriptionStatus: 'ACTIVE',
      subscriptionTier: 'PROFESSIONAL',
    },
    select: {
      id: true,
      email: true,
      stripeSubscriptionId: true,
      subscriptionExpiresAt: true,
    },
  });

  console.log(`Found ${teachers.length} teachers to update.\n`);

  if (teachers.length === 0) {
    console.log('Nothing to migrate.');
    return;
  }

  const result = await prisma.teacher.updateMany({
    where: {
      id: { in: teachers.map(t => t.id) },
    },
    data: {
      subscriptionTier: 'BASIC',
    },
  });

  console.log('Migration complete.');
  console.log(`Updated rows: ${result.count}`);
}

main()
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

