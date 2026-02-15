-- Enforce at-most-one weekly prep per agent per week.
--
-- NOTE: If this migration fails due to duplicates, investigate with:
--   SELECT "agentId", "weekStartDate", COUNT(*)
--   FROM "AgentWeeklyPrep"
--   GROUP BY 1,2
--   HAVING COUNT(*) > 1;
-- Then resolve duplicates (merge or delete) before re-running.

CREATE UNIQUE INDEX IF NOT EXISTS "AgentWeeklyPrep_agentId_weekStartDate_key"
ON "AgentWeeklyPrep" ("agentId", "weekStartDate");
