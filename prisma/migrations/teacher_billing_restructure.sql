DO $$
BEGIN
  CREATE TYPE "SubscriptionInterval" AS ENUM ('MONTHLY', 'ANNUAL');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "Teacher"
  ADD COLUMN IF NOT EXISTS "stripePriceId" TEXT,
  ADD COLUMN IF NOT EXISTS "subscriptionInterval" "SubscriptionInterval",
  ADD COLUMN IF NOT EXISTS "currentPeriodStart" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "currentPeriodEnd" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "generationsUsedThisMonth" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "generationCountResetAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "grandfatheredUntil" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "isFoundingMember" BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS "Teacher_generationCountResetAt_idx"
  ON "Teacher"("generationCountResetAt");

CREATE TABLE IF NOT EXISTS "FoundingMemberOffer" (
  "id" TEXT NOT NULL,
  "maxSlots" INTEGER NOT NULL DEFAULT 500,
  "claimedSlots" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FoundingMemberOffer_pkey" PRIMARY KEY ("id")
);

INSERT INTO "FoundingMemberOffer" ("id", "maxSlots", "claimedSlots", "isActive")
SELECT 'default_founding_plus_offer', 500, 0, TRUE
WHERE NOT EXISTS (
  SELECT 1 FROM "FoundingMemberOffer" WHERE "id" = 'default_founding_plus_offer'
);

UPDATE "Teacher"
SET "grandfatheredUntil" = COALESCE("grandfatheredUntil", NOW() + INTERVAL '3 months')
WHERE "subscriptionTier" IN ('BASIC', 'PROFESSIONAL');

UPDATE "Teacher"
SET "generationCountResetAt" = COALESCE("generationCountResetAt", NOW());
