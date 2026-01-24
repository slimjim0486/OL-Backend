-- Brevo Tracking Schema Additions
-- Run this migration to add fields needed for behavioral email triggers

-- Add lastActiveAt and lessonCount to Teacher table
ALTER TABLE "Teacher" ADD COLUMN IF NOT EXISTS "lastActiveAt" TIMESTAMP(3);
ALTER TABLE "Teacher" ADD COLUMN IF NOT EXISTS "lessonCount" INTEGER NOT NULL DEFAULT 0;

-- Update lastActiveAt to match lastLoginAt for existing records
UPDATE "Teacher" SET "lastActiveAt" = "lastLoginAt" WHERE "lastActiveAt" IS NULL AND "lastLoginAt" IS NOT NULL;

-- Create TeacherTriggerLog table to track sent behavioral triggers
CREATE TABLE IF NOT EXISTS "TeacherTriggerLog" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "triggerName" TEXT NOT NULL,
    "monthKey" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "TeacherTriggerLog_pkey" PRIMARY KEY ("id")
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS "TeacherTriggerLog_teacherId_idx" ON "TeacherTriggerLog"("teacherId");
CREATE INDEX IF NOT EXISTS "TeacherTriggerLog_triggerName_idx" ON "TeacherTriggerLog"("triggerName");
CREATE INDEX IF NOT EXISTS "TeacherTriggerLog_teacherId_triggerName_idx" ON "TeacherTriggerLog"("teacherId", "triggerName");
CREATE INDEX IF NOT EXISTS "Teacher_lastActiveAt_idx" ON "Teacher"("lastActiveAt");

-- Add foreign key constraint
ALTER TABLE "TeacherTriggerLog" ADD CONSTRAINT "TeacherTriggerLog_teacherId_fkey"
    FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill lessonCount from existing TeacherContent records
UPDATE "Teacher" t SET "lessonCount" = (
    SELECT COUNT(*) FROM "TeacherContent" tc WHERE tc."teacherId" = t.id AND tc."contentType" = 'LESSON'
);
