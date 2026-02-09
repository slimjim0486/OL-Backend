-- Remove unused LESSON_ENHANCEMENT_ANALYSIS from TokenOperation enum
-- This value was added for the Ollie Co-Teacher feature which has been removed

-- First, update any existing records that might use this value to CONTENT_ANALYSIS
UPDATE "TokenUsageLog" SET "operation" = 'CONTENT_ANALYSIS' WHERE "operation" = 'LESSON_ENHANCEMENT_ANALYSIS';
UPDATE "OrgTokenUsageLog" SET "operation" = 'CONTENT_ANALYSIS' WHERE "operation" = 'LESSON_ENHANCEMENT_ANALYSIS';

-- Create new enum type without LESSON_ENHANCEMENT_ANALYSIS
CREATE TYPE "TokenOperation_new" AS ENUM (
  'CONTENT_ANALYSIS',
  'LESSON_GENERATION',
  'QUIZ_GENERATION',
  'FLASHCARD_GENERATION',
  'INFOGRAPHIC_GENERATION',
  'GRADING_SINGLE',
  'GRADING_BATCH',
  'FEEDBACK_GENERATION',
  'CHAT',
  'BRAINSTORM',
  'AUDIO_UPDATE',
  'SUB_PLAN_GENERATION',
  'IEP_GOAL_GENERATION',
  'GAMES'
);

-- Update columns to use new enum
ALTER TABLE "TokenUsageLog" ALTER COLUMN "operation" TYPE "TokenOperation_new" USING ("operation"::text::"TokenOperation_new");
ALTER TABLE "OrgTokenUsageLog" ALTER COLUMN "operation" TYPE "TokenOperation_new" USING ("operation"::text::"TokenOperation_new");

-- Drop old enum and rename new one
DROP TYPE "TokenOperation";
ALTER TYPE "TokenOperation_new" RENAME TO "TokenOperation";
