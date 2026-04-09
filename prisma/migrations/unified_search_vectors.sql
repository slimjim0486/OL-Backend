-- Unified Search — Full-Text Search Vectors for Teacher Intelligence
-- Adds / updates PostgreSQL tsvector columns used by /api/teacher/search.
--
-- Prisma does not support tsvector columns directly, so this is a standalone
-- SQL migration in the same style as backlinks_search_vector.sql.
--
-- Run via:
--   DATABASE_URL="postgresql://..." psql "$DATABASE_URL" -f prisma/migrations/unified_search_vectors.sql

-- ============================================================================
-- TeacherStreamEntry
-- Existing backlinks migration created this column already in some envs.
-- Here we upgrade the trigger so it indexes both note content and extracted tags.
-- ============================================================================

ALTER TABLE "TeacherStreamEntry"
  ADD COLUMN IF NOT EXISTS search_vector tsvector;

CREATE OR REPLACE FUNCTION update_teacher_stream_entry_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'A') ||
    setweight(
      to_tsvector(
        'english',
        regexp_replace(COALESCE(NEW."extractedTags"::text, ''), '[{}\[\]":,]+', ' ', 'g')
      ),
      'B'
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS teacher_stream_entry_search_update ON "TeacherStreamEntry";
CREATE TRIGGER teacher_stream_entry_search_update
  BEFORE INSERT OR UPDATE OF content, "extractedTags" ON "TeacherStreamEntry"
  FOR EACH ROW EXECUTE FUNCTION update_teacher_stream_entry_search_vector();

UPDATE "TeacherStreamEntry"
SET search_vector =
  setweight(to_tsvector('english', COALESCE(content, '')), 'A') ||
  setweight(
    to_tsvector(
      'english',
      regexp_replace(COALESCE("extractedTags"::text, ''), '[{}\[\]":,]+', ' ', 'g')
    ),
    'B'
  )
WHERE search_vector IS NULL
   OR search_vector <> (
     setweight(to_tsvector('english', COALESCE(content, '')), 'A') ||
     setweight(
       to_tsvector(
         'english',
         regexp_replace(COALESCE("extractedTags"::text, ''), '[{}\[\]":,]+', ' ', 'g')
       ),
       'B'
     )
   );

CREATE INDEX IF NOT EXISTS idx_teacher_stream_entry_search_vector
  ON "TeacherStreamEntry" USING GIN(search_vector);

-- ============================================================================
-- TeacherMaterial
-- Title carries the strongest weight; JSON content + notes provide recall.
-- ============================================================================

ALTER TABLE "TeacherMaterial"
  ADD COLUMN IF NOT EXISTS search_vector tsvector;

CREATE OR REPLACE FUNCTION update_teacher_material_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(
      to_tsvector(
        'english',
        regexp_replace(COALESCE(NEW.content::text, ''), '[{}\[\]":,]+', ' ', 'g')
      ),
      'B'
    ) ||
    setweight(to_tsvector('english', COALESCE(NEW.notes, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS teacher_material_search_update ON "TeacherMaterial";
CREATE TRIGGER teacher_material_search_update
  BEFORE INSERT OR UPDATE OF title, content, notes ON "TeacherMaterial"
  FOR EACH ROW EXECUTE FUNCTION update_teacher_material_search_vector();

UPDATE "TeacherMaterial"
SET search_vector =
  setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
  setweight(
    to_tsvector(
      'english',
      regexp_replace(COALESCE(content::text, ''), '[{}\[\]":,]+', ' ', 'g')
    ),
    'B'
  ) ||
  setweight(to_tsvector('english', COALESCE(notes, '')), 'B')
WHERE search_vector IS NULL;

CREATE INDEX IF NOT EXISTS idx_teacher_material_search_vector
  ON "TeacherMaterial" USING GIN(search_vector);

-- ============================================================================
-- TeachingGraphNode
-- Only TOPIC nodes are queried by unified search, but indexing all labels keeps
-- the trigger straightforward and useful for future search surfaces.
-- ============================================================================

ALTER TABLE "TeachingGraphNode"
  ADD COLUMN IF NOT EXISTS search_vector tsvector;

CREATE OR REPLACE FUNCTION update_teaching_graph_node_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.label, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.subject, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS teaching_graph_node_search_update ON "TeachingGraphNode";
CREATE TRIGGER teaching_graph_node_search_update
  BEFORE INSERT OR UPDATE OF label, subject ON "TeachingGraphNode"
  FOR EACH ROW EXECUTE FUNCTION update_teaching_graph_node_search_vector();

UPDATE "TeachingGraphNode"
SET search_vector =
  setweight(to_tsvector('english', COALESCE(label, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(subject, '')), 'C')
WHERE search_vector IS NULL;

CREATE INDEX IF NOT EXISTS idx_teaching_graph_node_search_vector
  ON "TeachingGraphNode" USING GIN(search_vector);

-- ============================================================================
-- StudentMention
-- Name is primary; signals/topics/subjects make searches like "fractions" or
-- "struggling" find the right student profile.
-- ============================================================================

ALTER TABLE "StudentMention"
  ADD COLUMN IF NOT EXISTS search_vector tsvector;

CREATE OR REPLACE FUNCTION update_student_mention_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.signals, ' '), '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.topics, ' '), '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.subjects, ' '), '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS student_mention_search_update ON "StudentMention";
CREATE TRIGGER student_mention_search_update
  BEFORE INSERT OR UPDATE OF name, signals, topics, subjects ON "StudentMention"
  FOR EACH ROW EXECUTE FUNCTION update_student_mention_search_vector();

UPDATE "StudentMention"
SET search_vector =
  setweight(to_tsvector('english', COALESCE(name, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(array_to_string(signals, ' '), '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(array_to_string(topics, ' '), '')), 'C') ||
  setweight(to_tsvector('english', COALESCE(array_to_string(subjects, ' '), '')), 'C')
WHERE search_vector IS NULL;

CREATE INDEX IF NOT EXISTS idx_student_mention_search_vector
  ON "StudentMention" USING GIN(search_vector);
