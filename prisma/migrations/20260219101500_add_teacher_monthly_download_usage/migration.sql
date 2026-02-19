-- CreateTable TeacherDownloadUsage
CREATE TABLE IF NOT EXISTS "TeacherDownloadUsage" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "month" DATE NOT NULL,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeacherDownloadUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "TeacherDownloadUsage_teacherId_month_key" ON "TeacherDownloadUsage"("teacherId", "month");
CREATE INDEX IF NOT EXISTS "TeacherDownloadUsage_teacherId_month_idx" ON "TeacherDownloadUsage"("teacherId", "month");

-- AddForeignKey TeacherDownloadUsage -> Teacher
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'TeacherDownloadUsage_teacherId_fkey') THEN
        ALTER TABLE "TeacherDownloadUsage" ADD CONSTRAINT "TeacherDownloadUsage_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END$$;
