-- Add planning autonomy mode for the teacher AI assistant (post-onboarding autonomy control)

DO $$ BEGIN
  CREATE TYPE "PlanningAutonomy" AS ENUM ('COACH', 'PLANNER', 'AUTOPILOT');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "TeacherAgent"
  ADD COLUMN IF NOT EXISTS "planningAutonomy" "PlanningAutonomy" NOT NULL DEFAULT 'COACH';

ALTER TABLE "TeacherAgent"
  ADD COLUMN IF NOT EXISTS "planningAutonomyAcknowledged" BOOLEAN NOT NULL DEFAULT false;

