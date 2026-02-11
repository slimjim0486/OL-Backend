-- Add organization seat-billing fields for teacher organizations.
-- This migration is idempotent to be safe across environments.

DO $$ BEGIN
  CREATE TYPE "OrgBillingInterval" AS ENUM ('MONTHLY', 'ANNUAL');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "Organization"
  ADD COLUMN IF NOT EXISTS "stripeSubscriptionId" TEXT,
  ADD COLUMN IF NOT EXISTS "subscriptionExpiresAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "billingInterval" "OrgBillingInterval" NOT NULL DEFAULT 'MONTHLY',
  ADD COLUMN IF NOT EXISTS "seatLimit" INTEGER NOT NULL DEFAULT 10;
