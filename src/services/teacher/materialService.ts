// Material Service — Teacher Intelligence Platform
// CRUD for materials, generation via content bridge pattern, search, stats
import { IntelligenceMaterialType } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import { contentGenerationService } from './contentGenerationService.js';
import { sseService } from './sseService.js';

// ============================================
// TYPES
// ============================================

export interface ListMaterialsInput {
  page?: number;
  limit?: number;
  subject?: string;
  type?: IntelligenceMaterialType;
  dateFrom?: string;
  dateTo?: string;
  standard?: string;
}

export interface UpdateMaterialInput {
  title?: string;
  content?: any;
  approved?: boolean;
  edited?: boolean;
  editDiff?: any;
  rating?: number;
  usedInClass?: boolean;
  notes?: string;
}

export interface GenerateFromStreamInput {
  materialType: IntelligenceMaterialType;
  additionalContext?: string;
}

// ============================================
// CRUD
// ============================================

async function listMaterials(teacherId: string, input: ListMaterialsInput) {
  const page = input.page || 1;
  const limit = Math.min(input.limit || 20, 50);
  const skip = (page - 1) * limit;

  const where: any = { teacherId };

  if (input.subject) where.subject = input.subject;
  if (input.type) where.type = input.type;
  if (input.standard) {
    where.standards = { has: input.standard };
  }
  if (input.dateFrom || input.dateTo) {
    where.createdAt = {};
    if (input.dateFrom) where.createdAt.gte = new Date(input.dateFrom);
    if (input.dateTo) where.createdAt.lte = new Date(input.dateTo);
  }

  const [materials, total] = await Promise.all([
    prisma.teacherMaterial.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.teacherMaterial.count({ where }),
  ]);

  return {
    materials,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function getMaterial(teacherId: string, materialId: string) {
  const material = await prisma.teacherMaterial.findFirst({
    where: { id: materialId, teacherId },
  });

  if (!material) {
    throw new Error('Material not found');
  }

  return material;
}

async function updateMaterial(teacherId: string, materialId: string, input: UpdateMaterialInput) {
  const material = await prisma.teacherMaterial.findFirst({
    where: { id: materialId, teacherId },
  });

  if (!material) {
    throw new Error('Material not found');
  }

  const updated = await prisma.teacherMaterial.update({
    where: { id: materialId },
    data: input,
  });

  logger.info('Material updated', { teacherId, materialId });
  return updated;
}

async function deleteMaterial(teacherId: string, materialId: string) {
  const material = await prisma.teacherMaterial.findFirst({
    where: { id: materialId, teacherId },
  });

  if (!material) {
    throw new Error('Material not found');
  }

  await prisma.teacherMaterial.delete({
    where: { id: materialId },
  });

  logger.info('Material deleted', { teacherId, materialId });
}

async function searchMaterials(teacherId: string, query: string) {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const materials = await prisma.teacherMaterial.findMany({
    where: {
      teacherId,
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { notes: { contains: query, mode: 'insensitive' } },
      ],
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return materials;
}

async function getMaterialStats(teacherId: string) {
  const [total, byType, bySubject] = await Promise.all([
    prisma.teacherMaterial.count({ where: { teacherId } }),
    prisma.teacherMaterial.groupBy({
      by: ['type'],
      where: { teacherId },
      _count: true,
    }),
    prisma.teacherMaterial.groupBy({
      by: ['subject'],
      where: { teacherId },
      _count: true,
    }),
  ]);

  // Get unique topics count
  const allMaterials = await prisma.teacherMaterial.findMany({
    where: { teacherId },
    select: { topics: true },
  });
  const uniqueTopics = new Set(allMaterials.flatMap(m => m.topics));

  return {
    total,
    uniqueTopics: uniqueTopics.size,
    byType: byType.map(t => ({ type: t.type, count: t._count })),
    bySubject: bySubject.map(s => ({ subject: s.subject, count: s._count })),
  };
}

async function getMaterialsByTopic(teacherId: string, topic: string) {
  const materials = await prisma.teacherMaterial.findMany({
    where: {
      teacherId,
      topics: { has: topic },
    },
    orderBy: { createdAt: 'desc' },
  });

  return materials;
}

// ============================================
// GENERATION (Content Bridge Pattern)
// ============================================

async function generateFromStream(
  teacherId: string,
  entryId: string,
  input: GenerateFromStreamInput
) {
  // Load the stream entry
  const entry = await prisma.teacherStreamEntry.findFirst({
    where: { id: entryId, teacherId },
  });

  if (!entry) {
    throw new Error('Stream entry not found');
  }

  const tags = entry.extractedTags as any;
  const topic = tags?.topics?.[0] || 'Topic from note';
  const subject = tags?.subjects?.[0] || '';
  const standards = tags?.standards || [];

  // Load teacher profile for context
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    select: {
      gradeRange: true,
      primarySubject: true,
      preferredCurriculum: true,
      agentProfile: {
        select: {
          gradesTaught: true,
          subjectsTaught: true,
          curriculumType: true,
        },
      },
    },
  });

  const gradeLevel = teacher?.gradeRange || teacher?.agentProfile?.gradesTaught?.[0] || '';
  const curriculum = teacher?.preferredCurriculum || teacher?.agentProfile?.curriculumType || '';

  // Build additional context from stream entry
  const additionalContext = [
    `Teacher's note: "${entry.content}"`,
    input.additionalContext || '',
  ].filter(Boolean).join('\n');

  let generatedContent: any;
  let title = '';

  // Route to appropriate generation service based on material type
  // Note: generateQuiz and generateFlashcards take (teacherId, contentId, input)
  // where contentId can be empty string for standalone generation.
  // generateLesson takes (teacherId, input).
  // Return types are full objects (not wrapped in .content).
  switch (input.materialType) {
    case 'LESSON_PLAN': {
      const result = await contentGenerationService.generateLesson(teacherId, {
        topic,
        subject: subject as any,
        gradeLevel,
        curriculum,
        additionalContext,
        targetStandards: standards.map((s: any) => ({ notation: s.code, description: s.description })),
      });
      generatedContent = result;
      title = `Lesson: ${topic}`;
      break;
    }
    case 'QUIZ': {
      // generateQuiz takes (teacherId, contentId, { content, gradeLevel, ... })
      // where content is the text to generate quiz from
      const quizContent = `Topic: ${topic}\n${additionalContext}`;
      const result = await contentGenerationService.generateQuiz(teacherId, '', {
        content: quizContent,
        gradeLevel,
      });
      generatedContent = result;
      title = `Quiz: ${topic}`;
      break;
    }
    case 'FLASHCARDS': {
      // generateFlashcards takes (teacherId, contentId, { content, gradeLevel, ... })
      const flashcardContent = `Topic: ${topic}\n${additionalContext}`;
      const result = await contentGenerationService.generateFlashcards(teacherId, '', {
        content: flashcardContent,
        gradeLevel,
      });
      generatedContent = result;
      title = `Flashcards: ${topic}`;
      break;
    }
    default:
      throw new Error(`Material type ${input.materialType} is not yet supported for stream generation. Supported types: LESSON_PLAN, QUIZ, FLASHCARDS`);
  }

  // Save as TeacherMaterial
  const material = await prisma.teacherMaterial.create({
    data: {
      teacherId,
      title,
      type: input.materialType,
      content: generatedContent,
      subject: subject || 'general',
      topics: tags?.topics || [],
      standards: standards.map((s: any) => s.code),
      gradeLevel: gradeLevel || '',
      curriculum: curriculum || '',
      sourceStreamEntryId: entryId,
    },
  });

  // Link material to stream entry
  await prisma.teacherStreamEntry.update({
    where: { id: entryId },
    data: {
      linkedMaterialIds: {
        push: material.id,
      },
    },
  });

  // Send SSE event
  sseService.sendEvent(teacherId, {
    type: 'material-generated',
    data: { materialId: material.id, entryId, type: input.materialType },
  });

  logger.info('Material generated from stream', {
    teacherId,
    materialId: material.id,
    entryId,
    type: input.materialType,
  });

  return material;
}

async function approveMaterial(teacherId: string, materialId: string) {
  return updateMaterial(teacherId, materialId, { approved: true });
}

async function rateMaterial(teacherId: string, materialId: string, rating: number) {
  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }
  return updateMaterial(teacherId, materialId, { rating });
}

async function markMaterialUsed(teacherId: string, materialId: string) {
  return updateMaterial(teacherId, materialId, { usedInClass: true });
}

// ============================================
// EXPORT
// ============================================

export const materialService = {
  listMaterials,
  getMaterial,
  updateMaterial,
  deleteMaterial,
  searchMaterials,
  getMaterialStats,
  getMaterialsByTopic,
  generateFromStream,
  approveMaterial,
  rateMaterial,
  markMaterialUsed,
};
