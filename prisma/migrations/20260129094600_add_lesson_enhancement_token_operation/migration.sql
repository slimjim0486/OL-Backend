-- Add missing token operation used by lesson analysis service
ALTER TYPE "TokenOperation" ADD VALUE IF NOT EXISTS 'LESSON_ENHANCEMENT_ANALYSIS';
