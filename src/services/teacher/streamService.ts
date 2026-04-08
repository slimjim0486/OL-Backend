// Stream Service — Teacher Intelligence Platform
// CRUD for stream entries, full-text search, tag corrections
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import { streakService } from './streakService.js';

// ============================================
// TYPES
// ============================================

export interface CreateStreamEntryInput {
  content: string;
}

export interface ListStreamEntriesInput {
  page?: number;
  limit?: number;
  subject?: string;
  topic?: string;
  dateFrom?: string;
  dateTo?: string;
  pinned?: boolean;
}

export interface UpdateStreamEntryInput {
  content?: string;
  pinned?: boolean;
  archived?: boolean;
}

export interface TagCorrections {
  dismissed?: string[];
  added?: Array<{ type: string; value: string }>;
  corrected?: Array<{ original: string; corrected: string }>;
}

// ============================================
// CRUD
// ============================================

async function createEntry(teacherId: string, input: CreateStreamEntryInput & { timezone?: string }) {
  const entry = await prisma.teacherStreamEntry.create({
    data: {
      teacherId,
      content: input.content,
      extractionStatus: 'pending',
    },
  });

  // Update streak (non-fatal)
  try {
    await streakService.updateStreak(teacherId, input.timezone);
  } catch (err) {
    logger.error('Failed to update streak', { teacherId, error: (err as Error).message });
  }

  logger.info('Stream entry created', { teacherId, entryId: entry.id });
  return entry;
}

async function listEntries(teacherId: string, input: ListStreamEntriesInput) {
  const page = input.page || 1;
  const limit = Math.min(input.limit || 20, 50);
  const skip = (page - 1) * limit;

  const where: any = {
    teacherId,
    archived: false,
  };

  if (input.pinned !== undefined) {
    where.pinned = input.pinned;
  }

  if (input.dateFrom || input.dateTo) {
    where.createdAt = {};
    if (input.dateFrom) where.createdAt.gte = new Date(input.dateFrom);
    if (input.dateTo) where.createdAt.lte = new Date(input.dateTo);
  }

  // Filter by subject or topic from extractedTags JSON
  if (input.subject || input.topic) {
    const jsonConditions: any[] = [];

    if (input.subject) {
      jsonConditions.push({
        extractedTags: { path: ['subjects'], array_contains: [input.subject] },
      });
    }

    if (input.topic) {
      jsonConditions.push({
        extractedTags: { path: ['topics'], array_contains: [input.topic] },
      });
    }

    if (jsonConditions.length === 1) {
      Object.assign(where, jsonConditions[0]);
    } else {
      where.AND = [...(where.AND || []), ...jsonConditions];
    }
  }

  const [entries, total] = await Promise.all([
    prisma.teacherStreamEntry.findMany({
      where,
      orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
      skip,
      take: limit,
    }),
    prisma.teacherStreamEntry.count({ where }),
  ]);

  return {
    entries,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function getEntry(teacherId: string, entryId: string) {
  const entry = await prisma.teacherStreamEntry.findFirst({
    where: { id: entryId, teacherId },
  });

  if (!entry) {
    throw new Error('Stream entry not found');
  }

  return entry;
}

async function updateEntry(teacherId: string, entryId: string, input: UpdateStreamEntryInput) {
  const entry = await prisma.teacherStreamEntry.findFirst({
    where: { id: entryId, teacherId },
  });

  if (!entry) {
    throw new Error('Stream entry not found');
  }

  const data: any = {};
  if (input.content !== undefined) {
    data.content = input.content;
    // Re-queue extraction if content changed; clear stale tags and corrections
    data.extractionStatus = 'pending';
    data.extractedTags = null;
    data.tagCorrections = null;
  }
  if (input.pinned !== undefined) data.pinned = input.pinned;
  if (input.archived !== undefined) data.archived = input.archived;

  const updated = await prisma.teacherStreamEntry.update({
    where: { id: entryId },
    data,
  });

  const contentChanged = input.content !== undefined;
  logger.info('Stream entry updated', { teacherId, entryId, contentChanged });

  return { entry: updated, contentChanged };
}

async function deleteEntry(teacherId: string, entryId: string) {
  const entry = await prisma.teacherStreamEntry.findFirst({
    where: { id: entryId, teacherId },
  });

  if (!entry) {
    throw new Error('Stream entry not found');
  }

  await prisma.teacherStreamEntry.update({
    where: { id: entryId },
    data: { archived: true },
  });

  logger.info('Stream entry archived', { teacherId, entryId });
}

async function correctTags(teacherId: string, entryId: string, corrections: TagCorrections) {
  // Use transaction to avoid lost updates if concurrent corrections happen
  return prisma.$transaction(async (tx) => {
    const entry = await tx.teacherStreamEntry.findFirst({
      where: { id: entryId, teacherId },
    });

    if (!entry) {
      throw new Error('Stream entry not found');
    }

    // Merge new corrections with existing
    const existingCorrections = (entry.tagCorrections as any) || { dismissed: [], added: [], corrected: [] };
    const merged = {
      dismissed: [...(existingCorrections.dismissed || []), ...(corrections.dismissed || [])],
      added: [...(existingCorrections.added || []), ...(corrections.added || [])],
      corrected: [...(existingCorrections.corrected || []), ...(corrections.corrected || [])],
    };

    const updated = await tx.teacherStreamEntry.update({
      where: { id: entryId },
      data: { tagCorrections: merged },
    });

    logger.info('Stream tags corrected', { teacherId, entryId, corrections });
    return updated;
  });
}

async function searchEntries(teacherId: string, query: string) {
  if (!query || query.trim().length === 0) {
    return [];
  }

  // Use PostgreSQL ILIKE for simple search (full-text search can be added later via raw query)
  const entries = await prisma.teacherStreamEntry.findMany({
    where: {
      teacherId,
      archived: false,
      content: {
        contains: query,
        mode: 'insensitive',
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return entries;
}

// ============================================
// EXPORT
// ============================================

export const streamService = {
  createEntry,
  listEntries,
  getEntry,
  updateEntry,
  deleteEntry,
  correctTags,
  searchEntries,
};
