-- CreateEnum
CREATE TYPE "DripStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "ContentDripEnrollment" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "status" "DripStatus" NOT NULL DEFAULT 'ACTIVE',
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "totalSteps" INTEGER NOT NULL DEFAULT 5,
    "primarySubject" TEXT NOT NULL,
    "gradeLevel" TEXT NOT NULL,
    "curriculumType" TEXT,
    "currentTopic" TEXT NOT NULL,
    "upNextTopic" TEXT,
    "nextDeliveryAt" TIMESTAMP(3) NOT NULL,
    "lastDeliveryAt" TIMESTAMP(3),
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "generatedContentIds" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "consecutiveFailures" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,

    CONSTRAINT "ContentDripEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContentDripEnrollment_teacherId_key" ON "ContentDripEnrollment"("teacherId");

-- CreateIndex
CREATE INDEX "ContentDripEnrollment_status_nextDeliveryAt_idx" ON "ContentDripEnrollment"("status", "nextDeliveryAt");

-- CreateIndex
CREATE INDEX "ContentDripEnrollment_teacherId_idx" ON "ContentDripEnrollment"("teacherId");

-- AddForeignKey
ALTER TABLE "ContentDripEnrollment" ADD CONSTRAINT "ContentDripEnrollment_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
