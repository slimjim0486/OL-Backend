-- Add settings/profile fields to Teacher model
-- termDates: JSON array of { label, start, end } for academic terms
-- showNameOnShared: whether to show teacher name on shared materials
-- allowRemix: whether to allow others to remix shared materials

ALTER TABLE "Teacher" ADD COLUMN IF NOT EXISTS "termDates" JSONB;
ALTER TABLE "Teacher" ADD COLUMN IF NOT EXISTS "showNameOnShared" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Teacher" ADD COLUMN IF NOT EXISTS "allowRemix" BOOLEAN NOT NULL DEFAULT true;
