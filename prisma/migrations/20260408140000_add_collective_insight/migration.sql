-- Phase 4.9 Item E — Collective Insights
-- Adds the CollectiveInsight table that stores cross-teacher aggregated
-- signal data keyed by curriculum standard code. Populated by the weekly
-- collectiveInsightsAggregationJob and read by nudgeService to emit
-- COLLECTIVE_INSIGHT nudges.
--
-- Privacy: the aggregation pipeline only writes rows once a k-anonymity
-- threshold of distinct teachers has been reached for a
-- (standardCode, curriculumType, gradeRange, signalType) tuple.

CREATE TABLE "CollectiveInsight" (
    "id" TEXT NOT NULL,
    "standardCode" TEXT NOT NULL,
    "curriculumType" TEXT NOT NULL,
    "gradeRange" TEXT NOT NULL,
    "signalType" TEXT NOT NULL,
    "teacherCount" INTEGER NOT NULL,
    "signalCount" INTEGER NOT NULL,
    "aggregatedPatterns" JSONB NOT NULL,
    "lastComputedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CollectiveInsight_pkey" PRIMARY KEY ("id")
);

-- Unique scope: one row per (standard, curriculum, grade, signalType) tuple
CREATE UNIQUE INDEX "CollectiveInsight_standardCode_curriculumType_gradeRange_si_key"
    ON "CollectiveInsight"("standardCode", "curriculumType", "gradeRange", "signalType");

-- Read path: nudge generator queries by curriculum + grade first, then
-- filters by standardCode — having both indexes keeps either access pattern fast
CREATE INDEX "CollectiveInsight_curriculumType_gradeRange_idx"
    ON "CollectiveInsight"("curriculumType", "gradeRange");

CREATE INDEX "CollectiveInsight_standardCode_idx"
    ON "CollectiveInsight"("standardCode");

-- Aggregation job uses this to garbage-collect stale rows
CREATE INDEX "CollectiveInsight_lastComputedAt_idx"
    ON "CollectiveInsight"("lastComputedAt");
