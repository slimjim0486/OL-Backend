-- Fix shareCategory column type from TEXT to ShareCategory enum
-- This migration is needed because the original migration was applied before the enum conversion was added

-- Ensure the ShareCategory enum exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ShareCategory') THEN
        CREATE TYPE "ShareCategory" AS ENUM ('CURRICULUM_ALIGNED', 'PROJECT_BASED', 'DIFFERENTIATED', 'ASSESSMENT', 'ENRICHMENT', 'INTERVENTION', 'SEASONAL', 'STEM', 'LITERACY', 'OTHER');
    END IF;
END$$;

-- Convert shareCategory column from TEXT to ShareCategory enum if needed
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'TeacherContent'
          AND column_name = 'shareCategory'
          AND udt_name = 'text'
    ) THEN
        ALTER TABLE "TeacherContent"
        ALTER COLUMN "shareCategory" TYPE "ShareCategory"
        USING (
            CASE
                WHEN "shareCategory" IN (
                    'CURRICULUM_ALIGNED',
                    'PROJECT_BASED',
                    'DIFFERENTIATED',
                    'ASSESSMENT',
                    'ENRICHMENT',
                    'INTERVENTION',
                    'SEASONAL',
                    'STEM',
                    'LITERACY',
                    'OTHER'
                ) THEN "shareCategory"::"ShareCategory"
                ELSE NULL
            END
        );
    END IF;
END$$;
