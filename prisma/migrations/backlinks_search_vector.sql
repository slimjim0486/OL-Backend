-- Backlinks Feature — Full-Text Search for Stream Entries
-- Adds a PostgreSQL tsvector column + trigger + GIN index on TeacherStreamEntry
-- so we can quickly find unlinked mentions of topics and students.
--
-- tsvector is not a native Prisma type, so this is a standalone migration.
-- Prisma ignores the column (it's managed entirely in SQL).
--
-- Run via:
--   DATABASE_URL="postgresql://..." psql "$DATABASE_URL" -f prisma/migrations/backlinks_search_vector.sql

-- 1. Add the tsvector column (nullable; trigger will populate it)
ALTER TABLE "TeacherStreamEntry"
  ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- 2. Backfill existing entries
UPDATE "TeacherStreamEntry"
  SET search_vector = to_tsvector('english', COALESCE(content, ''))
  WHERE search_vector IS NULL;

-- 3. Auto-update trigger for new/edited entries
CREATE OR REPLACE FUNCTION update_teacher_stream_entry_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', COALESCE(NEW.content, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS teacher_stream_entry_search_update ON "TeacherStreamEntry";
CREATE TRIGGER teacher_stream_entry_search_update
  BEFORE INSERT OR UPDATE OF content ON "TeacherStreamEntry"
  FOR EACH ROW EXECUTE FUNCTION update_teacher_stream_entry_search_vector();

-- 4. GIN index for fast full-text queries
CREATE INDEX IF NOT EXISTS idx_teacher_stream_entry_search_vector
  ON "TeacherStreamEntry" USING GIN(search_vector);
