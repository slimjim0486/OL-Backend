-- Unified Notification System for Teacher Intelligence Platform
-- Adds TeacherNotification model, enums, and preference fields

-- Enums
DO $$
BEGIN
  CREATE TYPE "TeacherNotificationType" AS ENUM (
    'MATERIAL_SAVED',
    'MATERIAL_REMIXED',
    'STREAK_MILESTONE',
    'TERM_WRAPPED_READY',
    'WEEKLY_DIGEST',
    'STREAK_REENGAGEMENT',
    'FIRST_NOTE_WELCOME'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "TeacherNotificationChannel" AS ENUM (
    'STREAM_WHISPER',
    'BELL',
    'EMAIL',
    'PUSH'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Teacher notification preferences
ALTER TABLE "Teacher"
  ADD COLUMN IF NOT EXISTS "emailStreakEnabled" BOOLEAN NOT NULL DEFAULT true;

-- TeacherNotification table
CREATE TABLE IF NOT EXISTS "TeacherNotification" (
  "id"          TEXT NOT NULL,
  "teacherId"   TEXT NOT NULL,
  "type"        "TeacherNotificationType" NOT NULL,
  "channel"     "TeacherNotificationChannel" NOT NULL,
  "title"       TEXT NOT NULL,
  "body"        TEXT NOT NULL,
  "actionUrl"   TEXT,
  "actionLabel" TEXT,
  "metadata"    JSONB,
  "read"        BOOLEAN NOT NULL DEFAULT false,
  "dismissed"   BOOLEAN NOT NULL DEFAULT false,
  "showAfter"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt"   TIMESTAMP(3),
  "emailSentAt" TIMESTAMP(3),
  "emailId"     TEXT,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TeacherNotification_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "TeacherNotification_teacherId_fkey" FOREIGN KEY ("teacherId")
    REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS "TeacherNotification_teacherId_channel_read_dismissed_idx"
  ON "TeacherNotification"("teacherId", "channel", "read", "dismissed");
CREATE INDEX IF NOT EXISTS "TeacherNotification_teacherId_channel_showAfter_expiresAt_idx"
  ON "TeacherNotification"("teacherId", "channel", "showAfter", "expiresAt");
CREATE INDEX IF NOT EXISTS "TeacherNotification_teacherId_type_idx"
  ON "TeacherNotification"("teacherId", "type");
