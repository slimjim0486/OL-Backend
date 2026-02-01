-- CreateEnum TeacherDownloadProductType
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'TeacherDownloadProductType') THEN
        CREATE TYPE "TeacherDownloadProductType" AS ENUM ('PDF', 'BUNDLE');
    END IF;
END$$;

-- CreateTable TeacherDownloadPurchase
CREATE TABLE IF NOT EXISTS "TeacherDownloadPurchase" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "productType" "TeacherDownloadProductType" NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeacherDownloadPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "TeacherDownloadPurchase_stripeSessionId_key" ON "TeacherDownloadPurchase"("stripeSessionId");
CREATE INDEX IF NOT EXISTS "TeacherDownloadPurchase_teacherId_contentId_idx" ON "TeacherDownloadPurchase"("teacherId", "contentId");
CREATE INDEX IF NOT EXISTS "TeacherDownloadPurchase_contentId_idx" ON "TeacherDownloadPurchase"("contentId");
CREATE INDEX IF NOT EXISTS "TeacherDownloadPurchase_teacherId_createdAt_idx" ON "TeacherDownloadPurchase"("teacherId", "createdAt");

-- AddForeignKey TeacherDownloadPurchase -> Teacher
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'TeacherDownloadPurchase_teacherId_fkey') THEN
        ALTER TABLE "TeacherDownloadPurchase" ADD CONSTRAINT "TeacherDownloadPurchase_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END$$;

-- AddForeignKey TeacherDownloadPurchase -> TeacherContent
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'TeacherDownloadPurchase_contentId_fkey') THEN
        ALTER TABLE "TeacherDownloadPurchase" ADD CONSTRAINT "TeacherDownloadPurchase_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "TeacherContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END$$;
