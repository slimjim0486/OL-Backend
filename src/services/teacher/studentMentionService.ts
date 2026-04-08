// Student Mention Service — Silent entity linking across stream entries
// Detects student names from extraction, links across entries, enables search/timeline
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import { Prisma, StudentEntityType } from '@prisma/client';

// ============================================
// TYPES
// ============================================

interface StudentMentionInput {
  name: string;
  type: 'INDIVIDUAL' | 'GROUP';
}

interface ExtractedTagsForMentions {
  subjects?: string[];
  topics?: string[];
  signals?: Array<{ type: string; content: string }>;
  studentMentions?: StudentMentionInput[];
}

// ============================================
// PROCESSING (called after stream extraction)
// ============================================

async function processEntryMentions(
  teacherId: string,
  entryId: string,
  extractedTags: ExtractedTagsForMentions
): Promise<void> {
  const mentions = extractedTags.studentMentions;
  if (!mentions || mentions.length === 0) return;

  const subjects = extractedTags.subjects || [];
  const topics = extractedTags.topics || [];
  const signalTexts = (extractedTags.signals || []).map(s => s.content);

  for (const mention of mentions) {
    const normalizedName = mention.name.toLowerCase().trim();
    if (!normalizedName) continue;

    try {
      const existing = await prisma.studentMention.findUnique({
        where: { teacherId_normalizedName: { teacherId, normalizedName } },
      });

      if (existing) {
        // Append entryId if not already present
        const updatedEntryIds = existing.streamEntryIds.includes(entryId)
          ? existing.streamEntryIds
          : [...existing.streamEntryIds, entryId];

        // Deduplicate subjects, topics, signals
        const mergedSubjects = [...new Set([...existing.subjects, ...subjects])];
        const mergedTopics = [...new Set([...existing.topics, ...topics])];
        const mergedSignals = [...new Set([...existing.signals, ...signalTexts])];

        await prisma.studentMention.update({
          where: { id: existing.id },
          data: {
            streamEntryIds: updatedEntryIds,
            subjects: mergedSubjects,
            topics: mergedTopics,
            signals: mergedSignals,
            mentionCount: updatedEntryIds.length,
            lastMentionedAt: new Date(),
          },
        });
      } else {
        await prisma.studentMention.create({
          data: {
            teacherId,
            name: mention.name.trim(),
            type: mention.type as StudentEntityType,
            normalizedName,
            streamEntryIds: [entryId],
            subjects,
            topics,
            signals: signalTexts,
            mentionCount: 1,
          },
        });
      }
    } catch (err) {
      // Log but don't fail the extraction job
      logger.error('Failed to process student mention', {
        teacherId,
        entryId,
        name: mention.name,
        error: (err as Error).message,
      });
    }
  }

  logger.info('Student mentions processed', {
    teacherId,
    entryId,
    count: mentions.length,
  });
}

// ============================================
// QUERIES
// ============================================

async function listStudents(
  teacherId: string,
  options: { page?: number; limit?: number; sortBy?: 'mentions' | 'recent' } = {}
) {
  const page = options.page || 1;
  const limit = Math.min(options.limit || 30, 100);
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy || 'mentions';

  const orderBy = sortBy === 'recent'
    ? { lastMentionedAt: 'desc' as const }
    : { mentionCount: 'desc' as const };

  const [students, total] = await Promise.all([
    prisma.studentMention.findMany({
      where: { teacherId },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.studentMention.count({ where: { teacherId } }),
  ]);

  return {
    students,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

async function getStudent(teacherId: string, studentId: string) {
  const student = await prisma.studentMention.findFirst({
    where: { id: studentId, teacherId },
  });

  if (!student) {
    throw new Error('Student not found');
  }

  // Fetch all linked stream entries for the timeline
  const entries = student.streamEntryIds.length > 0
    ? await prisma.teacherStreamEntry.findMany({
        where: {
          id: { in: student.streamEntryIds },
          teacherId,
        },
        orderBy: { createdAt: 'asc' },
      })
    : [];

  // Backlinks: entries where the student's name appears in text but the AI
  // extractor didn't tag them. Uses the TeacherStreamEntry.search_vector tsvector
  // index (see prisma/migrations/backlinks_search_vector.sql).
  let unlinkedMentions: any[] = [];
  try {
    unlinkedMentions = await getUnlinkedStudentMentions(
      teacherId,
      student.name,
      student.streamEntryIds,
      20,
    );
  } catch (err) {
    // Non-fatal: if the migration hasn't been applied yet, return an empty list.
    logger.warn('Failed to fetch unlinked student mentions', {
      teacherId,
      studentId,
      error: (err as Error).message,
    });
  }

  return { student, entries, unlinkedMentions };
}

/**
 * Find unlinked mentions of a student name: entries where the name appears in the
 * text but the AI extractor didn't tag it as a student. Uses the same tsvector
 * column as topic backlinks.
 */
async function getUnlinkedStudentMentions(
  teacherId: string,
  studentName: string,
  excludeIds: string[],
  limit = 20,
) {
  if (excludeIds.length === 0) {
    return prisma.$queryRaw<any[]>`
      SELECT id, "teacherId", content, "extractedTags", "extractionStatus",
             pinned, archived, "createdAt", "updatedAt"
      FROM "TeacherStreamEntry"
      WHERE "teacherId" = ${teacherId}
        AND archived = false
        AND search_vector @@ plainto_tsquery('english', ${studentName})
      ORDER BY "createdAt" DESC
      LIMIT ${limit}
    `;
  }

  return prisma.$queryRaw<any[]>`
    SELECT id, "teacherId", content, "extractedTags", "extractionStatus",
           pinned, archived, "createdAt", "updatedAt"
    FROM "TeacherStreamEntry"
    WHERE "teacherId" = ${teacherId}
      AND archived = false
      AND id NOT IN (${Prisma.join(excludeIds)})
      AND search_vector @@ plainto_tsquery('english', ${studentName})
    ORDER BY "createdAt" DESC
    LIMIT ${limit}
  `;
}

/**
 * Promote an unlinked mention to a linked entry. Appends the streamEntryId to the
 * student's streamEntryIds array and updates metadata. Merges any new subjects,
 * topics, and signals from the entry so the student's context grows.
 */
async function linkEntryToStudent(
  teacherId: string,
  studentId: string,
  streamEntryId: string,
) {
  const student = await prisma.studentMention.findFirst({
    where: { id: studentId, teacherId },
  });
  if (!student) {
    throw new Error('Student not found');
  }

  // No-op if already linked
  if (student.streamEntryIds.includes(streamEntryId)) {
    return student;
  }

  // Ensure the stream entry belongs to this teacher
  const entry = await prisma.teacherStreamEntry.findFirst({
    where: { id: streamEntryId, teacherId },
    select: { id: true, extractedTags: true, createdAt: true },
  });
  if (!entry) {
    throw new Error('Stream entry not found');
  }

  const tags = (entry.extractedTags || {}) as any;
  const entrySubjects: string[] = Array.isArray(tags.subjects) ? tags.subjects : [];
  const entryTopics: string[] = Array.isArray(tags.topics) ? tags.topics : [];
  const entrySignals: string[] = Array.isArray(tags.signals)
    ? tags.signals.map((s: any) => s.content).filter(Boolean)
    : [];

  const updatedEntryIds = [...student.streamEntryIds, streamEntryId];
  const mergedSubjects = [...new Set([...student.subjects, ...entrySubjects])];
  const mergedTopics = [...new Set([...student.topics, ...entryTopics])];
  const mergedSignals = [...new Set([...student.signals, ...entrySignals])];

  // Use the entry's createdAt to keep first/last mention dates accurate
  const firstMentionedAt =
    entry.createdAt < student.firstMentionedAt ? entry.createdAt : student.firstMentionedAt;
  const lastMentionedAt =
    entry.createdAt > student.lastMentionedAt ? entry.createdAt : student.lastMentionedAt;

  const updated = await prisma.studentMention.update({
    where: { id: studentId },
    data: {
      streamEntryIds: updatedEntryIds,
      subjects: mergedSubjects,
      topics: mergedTopics,
      signals: mergedSignals,
      mentionCount: updatedEntryIds.length,
      firstMentionedAt,
      lastMentionedAt,
    },
  });

  logger.info('Stream entry linked to student via backlink', {
    teacherId,
    studentId,
    studentName: student.name,
    streamEntryId,
  });

  return updated;
}

async function searchStudents(teacherId: string, query: string) {
  if (!query || query.trim().length === 0) return [];

  const students = await prisma.studentMention.findMany({
    where: {
      teacherId,
      normalizedName: {
        contains: query.toLowerCase().trim(),
        mode: 'insensitive',
      },
    },
    orderBy: { mentionCount: 'desc' },
    take: 20,
  });

  return students;
}

async function mergeStudents(
  teacherId: string,
  sourceId: string,
  targetId: string
) {
  const [source, target] = await Promise.all([
    prisma.studentMention.findFirst({ where: { id: sourceId, teacherId } }),
    prisma.studentMention.findFirst({ where: { id: targetId, teacherId } }),
  ]);

  if (!source || !target) {
    throw new Error('One or both student records not found');
  }

  // Merge arrays with deduplication
  const mergedEntryIds = [...new Set([...target.streamEntryIds, ...source.streamEntryIds])];
  const mergedSubjects = [...new Set([...target.subjects, ...source.subjects])];
  const mergedTopics = [...new Set([...target.topics, ...source.topics])];
  const mergedSignals = [...new Set([...target.signals, ...source.signals])];

  // Update target with merged data
  const merged = await prisma.studentMention.update({
    where: { id: targetId },
    data: {
      streamEntryIds: mergedEntryIds,
      subjects: mergedSubjects,
      topics: mergedTopics,
      signals: mergedSignals,
      mentionCount: mergedEntryIds.length,
      firstMentionedAt: source.firstMentionedAt < target.firstMentionedAt
        ? source.firstMentionedAt
        : target.firstMentionedAt,
      lastMentionedAt: source.lastMentionedAt > target.lastMentionedAt
        ? source.lastMentionedAt
        : target.lastMentionedAt,
    },
  });

  // Delete source
  await prisma.studentMention.delete({ where: { id: sourceId } });

  logger.info('Student mentions merged', {
    teacherId,
    sourceId,
    targetId,
    sourceName: source.name,
    targetName: target.name,
  });

  return merged;
}

// ============================================
// EXPORT
// ============================================

export const studentMentionService = {
  processEntryMentions,
  listStudents,
  getStudent,
  searchStudents,
  mergeStudents,
  // Backlinks
  getUnlinkedStudentMentions,
  linkEntryToStudent,
};
