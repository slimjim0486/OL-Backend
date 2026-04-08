// Material Service — Teacher Intelligence Platform
// CRUD for materials, generation via content bridge pattern, search, stats
import { IntelligenceMaterialType } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { genAI, TEACHER_CONTENT_SAFETY_SETTINGS } from '../../config/gemini.js';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';
import { contentGenerationService } from './contentGenerationService.js';
import { sseService } from './sseService.js';

const FLASH_MODEL = config.gemini.models.flash;

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
// DIRECT GEMINI GENERATION (for types without dedicated engines)
// ============================================

async function generateWithGemini(
  type: string,
  topic: string,
  subject: string,
  gradeLevel: string,
  curriculum: string,
  teacherContext: string,
  prompt: string
): Promise<any> {
  const model = genAI.getGenerativeModel({
    model: FLASH_MODEL,
    safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 6000,
      responseMimeType: 'application/json',
    },
  });

  const fullPrompt = [
    `You are an expert K-8 teacher creating educational content.`,
    gradeLevel ? `Grade level: ${gradeLevel}` : '',
    subject ? `Subject: ${subject}` : '',
    curriculum ? `Curriculum: ${curriculum}` : '',
    teacherContext ? `\nTeacher context:\n${teacherContext}` : '',
    `\n${prompt}`,
  ].filter(Boolean).join('\n');

  const result = await model.generateContent(fullPrompt);
  const text = result.response.text();

  try {
    return JSON.parse(text);
  } catch {
    // Try extracting JSON from markdown code block
    const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) {
      return JSON.parse(match[1].trim());
    }
    // Return raw text wrapped
    return { title: `${type}: ${topic}`, content: text };
  }
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
    case 'WORKSHEET': {
      generatedContent = await generateWithGemini(
        'WORKSHEET', topic, subject, gradeLevel, curriculum, additionalContext,
        `Create a detailed worksheet for "${topic}" suitable for ${gradeLevel} students.\n\nInclude:\n- 8-12 practice problems of increasing difficulty\n- Clear instructions for each section\n- Mix of question types (multiple choice, short answer, open-ended)\n- A complete answer key at the end\n\nFormat the output as JSON: { "title": string, "instructions": string, "sections": [{ "name": string, "problems": [{ "question": string, "type": "multiple_choice"|"short_answer"|"open_ended", "options"?: string[], "answer": string }] }], "answerKey": [{ "problem": number, "answer": string }] }`
      );
      title = `Worksheet: ${topic}`;
      break;
    }
    case 'RETEACH_ACTIVITY': {
      generatedContent = await generateWithGemini(
        'RETEACH_ACTIVITY', topic, subject, gradeLevel, curriculum, additionalContext,
        `Create a reteach activity for "${topic}" for ${gradeLevel} students who didn't grasp the concept the first time.\n\nInclude:\n- Alternative explanation using a different approach than traditional instruction\n- 2-3 guided practice problems with scaffolding\n- A hands-on or visual activity\n- 2-3 independent practice problems\n- Quick check questions to confirm understanding\n\nFormat as JSON: { "title": string, "alternativeExplanation": string, "visualAid": string, "guidedPractice": [{ "prompt": string, "scaffolding": string, "answer": string }], "activity": { "name": string, "materials": string[], "steps": string[] }, "independentPractice": [{ "question": string, "answer": string }], "checkForUnderstanding": string[] }`
      );
      title = `Reteach: ${topic}`;
      break;
    }
    case 'PARENT_UPDATE': {
      generatedContent = await generateWithGemini(
        'PARENT_UPDATE', topic, subject, gradeLevel, curriculum, additionalContext,
        `Create a parent-friendly update about what students are learning about "${topic}" in ${subject || 'class'}.\n\nInclude:\n- Brief summary of what we're learning (2-3 sentences, jargon-free)\n- Why this topic matters\n- 2-3 things parents can do at home to support learning\n- Key vocabulary with simple definitions\n- What's coming next\n\nKeep language warm, encouraging, and accessible to all parents.\n\nFormat as JSON: { "title": string, "greeting": string, "summary": string, "whyItMatters": string, "homeActivities": [{ "activity": string, "description": string }], "vocabulary": [{ "term": string, "definition": string }], "comingUp": string, "closing": string }`
      );
      title = `Parent Update: ${topic}`;
      break;
    }
    case 'SUB_PLAN': {
      generatedContent = await generateWithGemini(
        'SUB_PLAN', topic, subject, gradeLevel, curriculum, additionalContext,
        `Create a full-day substitute teacher plan for a ${gradeLevel} ${subject || 'general'} class currently studying "${topic}".\n\nInclude:\n- Overview and important notes for the sub\n- Detailed schedule with times\n- For each period: activity description, materials needed, student instructions\n- Emergency procedures and contacts placeholders\n- End-of-day wrap-up\n\nMake instructions very explicit — assume the substitute has no background in this subject.\n\nFormat as JSON: { "title": string, "overview": string, "importantNotes": string[], "schedule": [{ "time": string, "activity": string, "duration": string, "instructions": string, "materials": string[] }], "emergencyNotes": string, "endOfDay": string }`
      );
      title = `Sub Plan: ${topic}`;
      break;
    }
    default:
      throw new Error(`Material type ${input.materialType} is not yet supported for stream generation`);
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

// ============================================
// GENERATION FROM GRAPH NODE
// ============================================

async function generateFromNode(
  teacherId: string,
  nodeId: string,
  input: GenerateFromStreamInput
) {
  // Load the graph node
  const node = await prisma.teachingGraphNode.findFirst({
    where: { id: nodeId, teacherId },
  });

  if (!node) {
    throw new Error('Graph node not found');
  }

  // Load related stream entries for context
  const relatedEdges = await prisma.teachingGraphEdge.findMany({
    where: {
      teacherId,
      OR: [
        { sourceId: nodeId },
        { targetId: nodeId },
      ],
    },
    include: {
      source: true,
      target: true,
    },
    take: 10,
  });

  // Find related stream entry IDs (STREAM_ENTRY nodes store entry ID as streamEntryId)
  const streamEntryExternalIds = relatedEdges
    .flatMap(e => [e.source, e.target])
    .filter(n => n.type === 'STREAM_ENTRY' && n.streamEntryId)
    .map(n => n.streamEntryId!);

  // Get actual stream entries related to this node
  const relatedEntries = streamEntryExternalIds.length > 0
    ? await prisma.teacherStreamEntry.findMany({
        where: { teacherId, archived: false, id: { in: streamEntryExternalIds } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      })
    : [];

  // Load teacher profile
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    select: {
      gradeRange: true,
      primarySubject: true,
      preferredCurriculum: true,
    },
  });

  const gradeLevel = teacher?.gradeRange || '';
  const curriculum = teacher?.preferredCurriculum || '';
  const topic = node.label;
  const subject = topic;

  // Curriculum grounding: look up the actual standard descriptions for the
  // codes linked to this topic node. This is what makes Ollie "aligned to
  // curriculum" at the prompt level, not just as post-hoc metadata.
  // Cap at 8 to control prompt size for node-level generation.
  const linkedCodes = node.linkedStandardCodes || [];
  let standardsBlock = '';
  if (linkedCodes.length > 0) {
    try {
      const standards = await prisma.learningStandard.findMany({
        where: { notation: { in: linkedCodes } },
        select: { notation: true, description: true, strand: true },
        take: 8,
      });
      if (standards.length > 0) {
        standardsBlock =
          'Curriculum standards this material must address (align learning objectives, vocabulary, and assessment questions to these exact standards):\n' +
          standards
            .map((s) => {
              const strandPrefix = s.strand ? ` [${s.strand}]` : '';
              return `- ${s.notation}${strandPrefix}: ${s.description}`;
            })
            .join('\n');
      }
    } catch (err) {
      // Non-fatal: grounding failure should not block generation
      logger.warn('Failed to load standard descriptions for node generation', {
        nodeId,
        error: (err as Error).message,
      });
    }
  }

  // Build context from node and related entries
  const contextParts = [
    `Generate content about: "${node.label}" (${node.type})`,
    standardsBlock,
    relatedEntries.length > 0
      ? `Teacher's related notes:\n${relatedEntries.map(e => `- ${e.content.slice(0, 200)}`).join('\n')}`
      : '',
    input.additionalContext || '',
  ].filter(Boolean).join('\n\n');

  let generatedContent: any;
  let title = '';

  switch (input.materialType) {
    case 'LESSON_PLAN': {
      const result = await contentGenerationService.generateLesson(teacherId, {
        topic,
        subject: subject as any,
        gradeLevel,
        curriculum,
        additionalContext: contextParts,
      });
      generatedContent = result;
      title = `Lesson: ${topic}`;
      break;
    }
    case 'QUIZ': {
      const result = await contentGenerationService.generateQuiz(teacherId, '', {
        content: contextParts,
        gradeLevel,
      });
      generatedContent = result;
      title = `Quiz: ${topic}`;
      break;
    }
    case 'FLASHCARDS': {
      const result = await contentGenerationService.generateFlashcards(teacherId, '', {
        content: contextParts,
        gradeLevel,
      });
      generatedContent = result;
      title = `Flashcards: ${topic}`;
      break;
    }
    case 'WORKSHEET': {
      generatedContent = await generateWithGemini(
        'WORKSHEET', topic, subject, gradeLevel, curriculum, contextParts,
        `Create a detailed worksheet for "${topic}" suitable for ${gradeLevel} students.\n\nInclude:\n- 8-12 practice problems of increasing difficulty\n- Clear instructions for each section\n- Mix of question types (multiple choice, short answer, open-ended)\n- A complete answer key at the end\n\nFormat the output as JSON: { "title": string, "instructions": string, "sections": [{ "name": string, "problems": [{ "question": string, "type": "multiple_choice"|"short_answer"|"open_ended", "options"?: string[], "answer": string }] }], "answerKey": [{ "problem": number, "answer": string }] }`
      );
      title = `Worksheet: ${topic}`;
      break;
    }
    case 'RETEACH_ACTIVITY': {
      generatedContent = await generateWithGemini(
        'RETEACH_ACTIVITY', topic, subject, gradeLevel, curriculum, contextParts,
        `Create a reteach activity for "${topic}" for ${gradeLevel} students who didn't grasp the concept the first time.\n\nInclude:\n- Alternative explanation using a different approach\n- 2-3 guided practice problems with scaffolding\n- A hands-on or visual activity\n- 2-3 independent practice problems\n- Quick check questions to confirm understanding\n\nFormat as JSON: { "title": string, "alternativeExplanation": string, "guidedPractice": [{ "prompt": string, "scaffolding": string, "answer": string }], "activity": { "name": string, "materials": string[], "steps": string[] }, "independentPractice": [{ "question": string, "answer": string }], "checkForUnderstanding": string[] }`
      );
      title = `Reteach: ${topic}`;
      break;
    }
    case 'PARENT_UPDATE': {
      generatedContent = await generateWithGemini(
        'PARENT_UPDATE', topic, subject, gradeLevel, curriculum, contextParts,
        `Create a parent-friendly update about what students are learning about "${topic}".\n\nInclude:\n- Brief summary (2-3 sentences, jargon-free)\n- Why this topic matters\n- 2-3 things parents can do at home\n- Key vocabulary with simple definitions\n\nFormat as JSON: { "title": string, "summary": string, "whyItMatters": string, "homeActivities": [{ "activity": string, "description": string }], "vocabulary": [{ "term": string, "definition": string }], "closing": string }`
      );
      title = `Parent Update: ${topic}`;
      break;
    }
    case 'SUB_PLAN': {
      generatedContent = await generateWithGemini(
        'SUB_PLAN', topic, subject, gradeLevel, curriculum, contextParts,
        `Create a substitute teacher plan for a ${gradeLevel} class currently studying "${topic}".\n\nInclude:\n- Overview and important notes\n- Detailed schedule with times\n- For each period: activity, materials, student instructions\n- End-of-day wrap-up\n\nFormat as JSON: { "title": string, "overview": string, "importantNotes": string[], "schedule": [{ "time": string, "activity": string, "duration": string, "instructions": string, "materials": string[] }], "endOfDay": string }`
      );
      title = `Sub Plan: ${topic}`;
      break;
    }
    default:
      throw new Error(`Material type ${input.materialType} is not yet supported for node generation`);
  }

  const material = await prisma.teacherMaterial.create({
    data: {
      teacherId,
      title,
      type: input.materialType,
      content: generatedContent,
      subject: subject || 'general',
      topics: [topic],
      standards: node.linkedStandardCodes || [],
      gradeLevel: gradeLevel || '',
      curriculum: curriculum || '',
      sourceGraphNodeId: nodeId,
    },
  });

  // Update the graph with the new material (creates MATERIAL node, links to topics)
  const { teachingGraphService } = await import('./teachingGraphService.js');
  await teachingGraphService.processMaterial(
    teacherId,
    material.id,
    title,
    subject || 'general',
    [topic],
  );

  sseService.sendEvent(teacherId, {
    type: 'material-generated',
    data: { materialId: material.id, nodeId, type: input.materialType },
  });

  logger.info('Material generated from graph node', {
    teacherId,
    materialId: material.id,
    nodeId,
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
  generateFromNode,
  approveMaterial,
  rateMaterial,
  markMaterialUsed,
};
