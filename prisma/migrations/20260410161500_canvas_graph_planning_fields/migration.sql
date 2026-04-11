-- Canvas -> Graph Planning Feedback
-- Adds fields to TeachingGraphNode so the nudge system knows which topics
-- are planned for which weeks on teacher canvases.

ALTER TABLE "TeachingGraphNode"
  ADD COLUMN IF NOT EXISTS "plannedForTerm" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "plannedWeekLabel" TEXT;

CREATE INDEX IF NOT EXISTS "TeachingGraphNode_teacherId_plannedForTerm_idx"
  ON "TeachingGraphNode" ("teacherId", "plannedForTerm");

-- Planning hash on TeacherCanvas for dirty-check optimization.
ALTER TABLE "TeacherCanvas"
  ADD COLUMN IF NOT EXISTS "planningHash" TEXT;
