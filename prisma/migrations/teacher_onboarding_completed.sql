-- Add onboardingCompleted flag to Teacher model for intelligence platform onboarding.
-- Backfill: teachers who already have curriculum + grade + subject set are marked complete.

ALTER TABLE "Teacher"
  ADD COLUMN IF NOT EXISTS "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false;

-- Backfill existing teachers who already completed onboarding
UPDATE "Teacher"
SET "onboardingCompleted" = true
WHERE "preferredCurriculum" IS NOT NULL
  AND "gradeRange" IS NOT NULL
  AND "primarySubject" IS NOT NULL;
