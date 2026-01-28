-- Add trial tracking columns
ALTER TABLE "Teacher" ADD COLUMN "trialStartedAt" TIMESTAMP;
ALTER TABLE "Teacher" ADD COLUMN "trialUsed" BOOLEAN DEFAULT false;

-- Update default monthly quota for FREE tier (new signups only)
ALTER TABLE "Teacher" ALTER COLUMN "monthlyTokenQuota" SET DEFAULT 30000;
