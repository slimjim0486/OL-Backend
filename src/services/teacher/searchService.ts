import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';

const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 20;

interface UnifiedSearchOptions {
  teacherId: string;
  query: string;
  limit?: number;
}

interface StudentSearchRow {
  id: string;
  name: string;
  type: string;
  mentionCount: number;
  lastMention: string | null;
  lastMentionDate: Date | null;
  rank: number;
}

interface TopicSearchRow {
  id: string;
  name: string;
  subject: string | null;
  noteCount: number;
  materialCount: number;
  lastTouchedAt: Date | null;
  rank: number;
}

interface StreamSearchRow {
  id: string;
  content: string;
  createdAt: Date;
  snippet: string | null;
  rank: number;
}

interface MaterialSearchRow {
  id: string;
  title: string;
  type: string;
  createdAt: Date;
  snippet: string | null;
  rank: number;
}

interface TagSearchRow {
  id: string;
  name: string;
  kind: 'topic' | 'subject';
  usageCount: number;
}

const escapeLike = (value: string): string =>
  value.replace(/[\\%_]/g, '\\$&');

const normalizeLimit = (limit?: number): number => {
  if (!limit || Number.isNaN(limit)) return DEFAULT_LIMIT;
  return Math.min(Math.max(limit, 1), MAX_LIMIT);
};

const buildShortRankSql = (column: string, query: string) => {
  const escapedQuery = escapeLike(query);
  const exact = query.toLowerCase();
  const prefix = `${escapedQuery}%`;
  const contains = `%${escapedQuery}%`;

  return Prisma.sql`
    CASE
      WHEN LOWER(${Prisma.raw(column)}) = ${exact} THEN 3
      WHEN LOWER(${Prisma.raw(column)}) LIKE LOWER(${prefix}) ESCAPE '\\' THEN 2
      ELSE 1
    END
  `;
};

async function searchStudents(
  teacherId: string,
  query: string,
  limit: number,
  shortQuery: boolean,
): Promise<StudentSearchRow[]> {
  const likePattern = `%${escapeLike(query)}%`;
  const rankSql = shortQuery
    ? buildShortRankSql('name', query)
    : Prisma.sql`ts_rank(search_vector, plainto_tsquery('english', ${query}))`;
  const whereSql = shortQuery
    ? Prisma.sql`LOWER(name) LIKE LOWER(${likePattern}) ESCAPE '\\'`
    : Prisma.sql`search_vector @@ plainto_tsquery('english', ${query})`;

  return prisma.$queryRaw<StudentSearchRow[]>`
    SELECT
      id,
      name,
      type,
      "mentionCount",
      CASE
        WHEN array_length(signals, 1) IS NULL THEN NULL
        ELSE signals[array_length(signals, 1)]
      END AS "lastMention",
      "lastMentionedAt" AS "lastMentionDate",
      ${rankSql}::float AS rank
    FROM "StudentMention"
    WHERE "teacherId" = ${teacherId}
      AND ${whereSql}
    ORDER BY rank DESC, "mentionCount" DESC, "lastMentionedAt" DESC
    LIMIT ${limit}
  `;
}

async function searchTopics(
  teacherId: string,
  query: string,
  limit: number,
  shortQuery: boolean,
): Promise<TopicSearchRow[]> {
  const likePattern = `%${escapeLike(query)}%`;
  const rankSql = shortQuery
    ? buildShortRankSql('n.label', query)
    : Prisma.sql`ts_rank(n.search_vector, plainto_tsquery('english', ${query}))`;
  const whereSql = shortQuery
    ? Prisma.sql`LOWER(n.label) LIKE LOWER(${likePattern}) ESCAPE '\\'`
    : Prisma.sql`n.search_vector @@ plainto_tsquery('english', ${query})`;

  return prisma.$queryRaw<TopicSearchRow[]>`
    SELECT
      n.id,
      n.label AS name,
      n.subject,
      COALESCE(note_counts.count, 0)::int AS "noteCount",
      COALESCE(material_counts.count, 0)::int AS "materialCount",
      n."lastTouchedAt",
      ${rankSql}::float AS rank
    FROM "TeachingGraphNode" n
    LEFT JOIN LATERAL (
      SELECT COUNT(*) AS count
      FROM "TeachingGraphEdge" e
      JOIN "TeachingGraphNode" source ON source.id = e."sourceId"
      WHERE e."targetId" = n.id
        AND e.type = 'ABOUT'
        AND source.type = 'STREAM_ENTRY'
    ) AS note_counts ON true
    LEFT JOIN LATERAL (
      SELECT COUNT(*) AS count
      FROM "TeachingGraphEdge" e
      JOIN "TeachingGraphNode" source ON source.id = e."sourceId"
      WHERE e."targetId" = n.id
        AND e.type = 'ABOUT'
        AND source.type = 'MATERIAL'
    ) AS material_counts ON true
    WHERE n."teacherId" = ${teacherId}
      AND n.type = 'TOPIC'
      AND ${whereSql}
    ORDER BY rank DESC, "noteCount" DESC, n."lastTouchedAt" DESC NULLS LAST, n.label ASC
    LIMIT ${limit}
  `;
}

async function searchStreamEntries(
  teacherId: string,
  query: string,
  limit: number,
  shortQuery: boolean,
): Promise<StreamSearchRow[]> {
  const likePattern = `%${escapeLike(query)}%`;
  const rankSql = shortQuery
    ? buildShortRankSql('content', query)
    : Prisma.sql`ts_rank(search_vector, plainto_tsquery('english', ${query}))`;
  const snippetSql = shortQuery
    ? Prisma.sql`LEFT(content, 150)`
    : Prisma.sql`
        LEFT(
          ts_headline(
            'english',
            content,
            plainto_tsquery('english', ${query}),
            'MaxWords=25, MinWords=10, StartSel=<mark>, StopSel=</mark>'
          ),
          150
        )
      `;
  const whereSql = shortQuery
    ? Prisma.sql`LOWER(content) LIKE LOWER(${likePattern}) ESCAPE '\\'`
    : Prisma.sql`search_vector @@ plainto_tsquery('english', ${query})`;

  return prisma.$queryRaw<StreamSearchRow[]>`
    SELECT
      id,
      content,
      "createdAt",
      ${snippetSql} AS snippet,
      ${rankSql}::float AS rank
    FROM "TeacherStreamEntry"
    WHERE "teacherId" = ${teacherId}
      AND archived = false
      AND ${whereSql}
    ORDER BY rank DESC, "createdAt" DESC
    LIMIT ${limit}
  `;
}

async function searchMaterials(
  teacherId: string,
  query: string,
  limit: number,
  shortQuery: boolean,
): Promise<MaterialSearchRow[]> {
  const likePattern = `%${escapeLike(query)}%`;
  const materialTextSql = Prisma.sql`
    regexp_replace(
      COALESCE(title, '') || ' ' || COALESCE(notes, '') || ' ' || COALESCE(content::text, ''),
      '[{}\\[\\]":,]+',
      ' ',
      'g'
    )
  `;
  const rankSql = shortQuery
    ? buildShortRankSql('title', query)
    : Prisma.sql`ts_rank(search_vector, plainto_tsquery('english', ${query}))`;
  const snippetSql = shortQuery
    ? Prisma.sql`LEFT(${materialTextSql}, 150)`
    : Prisma.sql`
        LEFT(
          ts_headline(
            'english',
            ${materialTextSql},
            plainto_tsquery('english', ${query}),
            'MaxWords=25, MinWords=10, StartSel=<mark>, StopSel=</mark>'
          ),
          150
        )
      `;
  const whereSql = shortQuery
    ? Prisma.sql`
        (
          LOWER(title) LIKE LOWER(${likePattern}) ESCAPE '\\'
          OR LOWER(COALESCE(notes, '')) LIKE LOWER(${likePattern}) ESCAPE '\\'
          OR LOWER(COALESCE(content::text, '')) LIKE LOWER(${likePattern}) ESCAPE '\\'
        )
      `
    : Prisma.sql`search_vector @@ plainto_tsquery('english', ${query})`;

  return prisma.$queryRaw<MaterialSearchRow[]>`
    SELECT
      id,
      title,
      type,
      "createdAt",
      ${snippetSql} AS snippet,
      ${rankSql}::float AS rank
    FROM "TeacherMaterial"
    WHERE "teacherId" = ${teacherId}
      AND ${whereSql}
    ORDER BY rank DESC, "createdAt" DESC
    LIMIT ${limit}
  `;
}

async function searchTags(
  teacherId: string,
  query: string,
  limit: number,
): Promise<TagSearchRow[]> {
  const likePattern = `%${escapeLike(query.toLowerCase())}%`;

  return prisma.$queryRaw<TagSearchRow[]>`
    WITH raw_tags AS (
      SELECT lower(trim(topic)) AS name, 'topic'::text AS kind
      FROM "TeacherMaterial", LATERAL unnest(topics) AS topic
      WHERE "teacherId" = ${teacherId}

      UNION ALL

      SELECT lower(trim(value)) AS name, 'topic'::text AS kind
      FROM "TeacherStreamEntry",
      LATERAL jsonb_array_elements_text(COALESCE("extractedTags"->'topics', '[]'::jsonb)) AS value
      WHERE "teacherId" = ${teacherId}
        AND archived = false

      UNION ALL

      SELECT lower(trim(value)) AS name, 'subject'::text AS kind
      FROM "TeacherStreamEntry",
      LATERAL jsonb_array_elements_text(COALESCE("extractedTags"->'subjects', '[]'::jsonb)) AS value
      WHERE "teacherId" = ${teacherId}
        AND archived = false
    )
    SELECT
      md5(kind || ':' || name) AS id,
      name,
      kind::text AS kind,
      COUNT(*)::int AS "usageCount"
    FROM raw_tags
    WHERE name <> ''
      AND name LIKE ${likePattern} ESCAPE '\\'
    GROUP BY kind, name
    ORDER BY
      CASE WHEN name = lower(${query}) THEN 0 ELSE 1 END,
      "usageCount" DESC,
      name ASC
    LIMIT ${limit}
  `;
}

export async function unifiedSearch({
  teacherId,
  query,
  limit,
}: UnifiedSearchOptions) {
  const normalizedQuery = query.trim();
  const normalizedLimit = normalizeLimit(limit);

  if (!normalizedQuery) {
    return {
      query: normalizedQuery,
      students: [],
      topics: [],
      streamEntries: [],
      materials: [],
      tags: [],
    };
  }

  const shortQuery = normalizedQuery.length < 3;
  const runSearches = async (forceShortQuery: boolean) => Promise.all([
    searchStudents(teacherId, normalizedQuery, normalizedLimit, forceShortQuery),
    searchTopics(teacherId, normalizedQuery, normalizedLimit, forceShortQuery),
    searchStreamEntries(teacherId, normalizedQuery, normalizedLimit, forceShortQuery),
    searchMaterials(teacherId, normalizedQuery, normalizedLimit, forceShortQuery),
    searchTags(teacherId, normalizedQuery, normalizedLimit),
  ]);

  let students: StudentSearchRow[];
  let topics: TopicSearchRow[];
  let streamEntries: StreamSearchRow[];
  let materials: MaterialSearchRow[];
  let tags: TagSearchRow[];

  try {
    [students, topics, streamEntries, materials, tags] = await runSearches(shortQuery);
  } catch (error) {
    if (shortQuery) {
      throw error;
    }
    [students, topics, streamEntries, materials, tags] = await runSearches(true);
  }

  return {
    query: normalizedQuery,
    students,
    topics,
    streamEntries,
    materials,
    tags,
  };
}
