-- AlterTable - Add sharing fields to TeacherContent
ALTER TABLE "TeacherContent" ADD COLUMN IF NOT EXISTS "sharedAt" TIMESTAMP(3);
ALTER TABLE "TeacherContent" ADD COLUMN IF NOT EXISTS "shareCategory" TEXT;
ALTER TABLE "TeacherContent" ADD COLUMN IF NOT EXISTS "downloadCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "TeacherContent" ADD COLUMN IF NOT EXISTS "viewCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "TeacherContent" ADD COLUMN IF NOT EXISTS "likeCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "TeacherContent" ADD COLUMN IF NOT EXISTS "isFeatured" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "TeacherContent" ADD COLUMN IF NOT EXISTS "remixedFromId" TEXT;

-- AlterTable - Add public profile fields to Teacher
ALTER TABLE "Teacher" ADD COLUMN IF NOT EXISTS "bio" TEXT;
ALTER TABLE "Teacher" ADD COLUMN IF NOT EXISTS "isProfilePublic" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Teacher" ADD COLUMN IF NOT EXISTS "followerCount" INTEGER NOT NULL DEFAULT 0;

-- CreateEnum (ShareCategory) - handled by Prisma but we need to ensure it exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ShareCategory') THEN
        CREATE TYPE "ShareCategory" AS ENUM ('CURRICULUM_ALIGNED', 'PROJECT_BASED', 'DIFFERENTIATED', 'ASSESSMENT', 'ENRICHMENT', 'INTERVENTION', 'SEASONAL', 'STEM', 'LITERACY', 'OTHER');
    END IF;
END$$;

-- CreateTable ContentLike
CREATE TABLE IF NOT EXISTS "ContentLike" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex for ContentLike
CREATE UNIQUE INDEX IF NOT EXISTS "ContentLike_teacherId_contentId_key" ON "ContentLike"("teacherId", "contentId");
CREATE INDEX IF NOT EXISTS "ContentLike_contentId_idx" ON "ContentLike"("contentId");

-- CreateIndex for TeacherContent (sharing discovery)
CREATE INDEX IF NOT EXISTS "TeacherContent_isPublic_status_sharedAt_idx" ON "TeacherContent"("isPublic", "status", "sharedAt");
CREATE INDEX IF NOT EXISTS "TeacherContent_subject_gradeLevel_isPublic_idx" ON "TeacherContent"("subject", "gradeLevel", "isPublic");
CREATE INDEX IF NOT EXISTS "TeacherContent_downloadCount_idx" ON "TeacherContent"("downloadCount");

-- AddForeignKey ContentLike -> Teacher
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ContentLike_teacherId_fkey') THEN
        ALTER TABLE "ContentLike" ADD CONSTRAINT "ContentLike_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END$$;

-- AddForeignKey ContentLike -> TeacherContent
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ContentLike_contentId_fkey') THEN
        ALTER TABLE "ContentLike" ADD CONSTRAINT "ContentLike_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "TeacherContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END$$;

-- AddForeignKey TeacherContent.remixedFromId -> TeacherContent (self-referential)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'TeacherContent_remixedFromId_fkey') THEN
        ALTER TABLE "TeacherContent" ADD CONSTRAINT "TeacherContent_remixedFromId_fkey" FOREIGN KEY ("remixedFromId") REFERENCES "TeacherContent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END$$;
