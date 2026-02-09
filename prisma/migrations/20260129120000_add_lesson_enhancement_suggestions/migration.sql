-- AlterEnum
ALTER TYPE "TokenOperation" ADD VALUE IF NOT EXISTS 'LESSON_ENHANCEMENT_ANALYSIS';

-- CreateEnum
CREATE TYPE "SuggestionCategory" AS ENUM ('STANDARDS_ALIGNMENT', 'DIFFERENTIATION', 'PEDAGOGICAL_TECHNIQUE', 'ENGAGEMENT_ENHANCEMENT', 'ASSESSMENT_IMPROVEMENT', 'CONTENT_GAP');

-- CreateEnum
CREATE TYPE "SuggestionStatus" AS ENUM ('PENDING', 'ANALYZING', 'READY', 'FAILED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "SuggestionInteraction" AS ENUM ('VIEWED', 'EXPANDED', 'APPLIED', 'DISMISSED', 'BRAINSTORM_CLICKED');

-- CreateTable
CREATE TABLE "LessonEnhancementAnalysis" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "status" "SuggestionStatus" NOT NULL DEFAULT 'PENDING',
    "contentHash" TEXT,
    "analysisModel" TEXT,
    "tokensUsed" INTEGER NOT NULL DEFAULT 0,
    "curriculumType" "CurriculumType",
    "gradeLevel" TEXT,
    "subject" "Subject",
    "errorMessage" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonEnhancementAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonSuggestion" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "category" "SuggestionCategory" NOT NULL,
    "priority" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "actionPrompt" TEXT,
    "relatedStandardIds" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "requiredTier" "TeacherSubscriptionTier",
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.8,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LessonSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuggestionInteractionLog" (
    "id" TEXT NOT NULL,
    "suggestionId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "interaction" "SuggestionInteraction" NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SuggestionInteractionLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LessonEnhancementAnalysis_contentId_key" ON "LessonEnhancementAnalysis"("contentId");

-- CreateIndex
CREATE INDEX "LessonEnhancementAnalysis_teacherId_status_idx" ON "LessonEnhancementAnalysis"("teacherId", "status");

-- CreateIndex
CREATE INDEX "LessonEnhancementAnalysis_contentId_idx" ON "LessonEnhancementAnalysis"("contentId");

-- CreateIndex
CREATE INDEX "LessonEnhancementAnalysis_status_createdAt_idx" ON "LessonEnhancementAnalysis"("status", "createdAt");

-- CreateIndex
CREATE INDEX "LessonSuggestion_analysisId_priority_idx" ON "LessonSuggestion"("analysisId", "priority");

-- CreateIndex
CREATE INDEX "SuggestionInteractionLog_suggestionId_idx" ON "SuggestionInteractionLog"("suggestionId");

-- CreateIndex
CREATE INDEX "SuggestionInteractionLog_teacherId_createdAt_idx" ON "SuggestionInteractionLog"("teacherId", "createdAt");

-- AddForeignKey
ALTER TABLE "LessonEnhancementAnalysis" ADD CONSTRAINT "LessonEnhancementAnalysis_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "TeacherContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonEnhancementAnalysis" ADD CONSTRAINT "LessonEnhancementAnalysis_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonSuggestion" ADD CONSTRAINT "LessonSuggestion_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "LessonEnhancementAnalysis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuggestionInteractionLog" ADD CONSTRAINT "SuggestionInteractionLog_suggestionId_fkey" FOREIGN KEY ("suggestionId") REFERENCES "LessonSuggestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
