-- Add freeform topic progress to curriculum state for better onboarding + chat context
ALTER TABLE "CurriculumState"
  ADD COLUMN IF NOT EXISTS "topicProgress" JSONB NOT NULL DEFAULT '{}'::jsonb;
