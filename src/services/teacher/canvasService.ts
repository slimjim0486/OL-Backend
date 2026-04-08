// Canvas Service — Teacher Intelligence Platform (Phase 4-5)
// CRUD for unit planning canvases, sequence validation, coverage checks
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { genAI, TEACHER_CONTENT_SAFETY_SETTINGS } from '../../config/gemini.js';
import { logger } from '../../utils/logger.js';

// ============================================
// TYPES
// ============================================

interface CanvasItem {
  id: string;
  type: 'topic' | 'material' | 'note' | 'timeColumn';
  position: { x: number; y: number };
  size: { width: number; height: number };
  graphNodeId?: string;
  topicLabel?: string;
  subjectColor?: string;
  materialId?: string;
  materialTitle?: string;
  materialType?: string;
  text?: string;
  color?: string;
  label?: string;
}

interface CanvasConnection {
  id: string;
  fromItemId: string;
  toItemId: string;
  label?: string;
  style?: 'solid' | 'dashed';
}

interface CanvasData {
  viewport: { x: number; y: number; zoom: number };
  items: CanvasItem[];
  connections: CanvasConnection[];
}

interface CreateCanvasInput {
  title: string;
  description?: string;
}

interface UpdateCanvasInput {
  title?: string;
  description?: string | null;
  canvasData?: CanvasData;
}

interface SequenceValidation {
  connectionId: string;
  fromTopic: string;
  toTopic: string;
  isValid: boolean;
  message?: string;
}

interface CoverageResult {
  coveredTopics: string[];
  missingTopics: Array<{ label: string; subject?: string; standardCodes?: string[] }>;
  totalCurriculumTopics: number;
  coveragePercentage: number;
}

// ============================================
// CRUD
// ============================================

async function createCanvas(teacherId: string, input: CreateCanvasInput) {
  const canvas = await prisma.teacherCanvas.create({
    data: {
      teacherId,
      title: input.title,
      description: input.description || null,
    },
  });
  logger.info('Canvas created', { teacherId, canvasId: canvas.id });
  return canvas;
}

async function listCanvases(teacherId: string) {
  const canvases = await prisma.teacherCanvas.findMany({
    where: { teacherId, isArchived: false },
    select: {
      id: true,
      title: true,
      description: true,
      updatedAt: true,
      createdAt: true,
      canvasData: true,
    },
    orderBy: { updatedAt: 'desc' },
  });

  // Add item count summary
  return canvases.map((c) => {
    const data = c.canvasData as any;
    const items = data?.items || [];
    return {
      ...c,
      itemCount: items.length,
      topicCount: items.filter((i: any) => i.type === 'topic').length,
      materialCount: items.filter((i: any) => i.type === 'material').length,
    };
  });
}

async function getCanvas(teacherId: string, canvasId: string) {
  const canvas = await prisma.teacherCanvas.findFirst({
    where: { id: canvasId, teacherId, isArchived: false },
  });
  if (!canvas) {
    throw Object.assign(new Error('Canvas not found'), { status: 404 });
  }
  return canvas;
}

async function updateCanvas(teacherId: string, canvasId: string, input: UpdateCanvasInput) {
  // Verify ownership
  const existing = await prisma.teacherCanvas.findFirst({
    where: { id: canvasId, teacherId, isArchived: false },
  });
  if (!existing) {
    throw Object.assign(new Error('Canvas not found'), { status: 404 });
  }

  const data: any = {};
  if (input.title !== undefined) data.title = input.title;
  if (input.description !== undefined) data.description = input.description;
  if (input.canvasData !== undefined) data.canvasData = input.canvasData as any;

  const canvas = await prisma.teacherCanvas.update({
    where: { id: canvasId },
    data,
  });

  return canvas;
}

async function archiveCanvas(teacherId: string, canvasId: string) {
  const existing = await prisma.teacherCanvas.findFirst({
    where: { id: canvasId, teacherId, isArchived: false },
  });
  if (!existing) {
    throw Object.assign(new Error('Canvas not found'), { status: 404 });
  }

  await prisma.teacherCanvas.update({
    where: { id: canvasId },
    data: { isArchived: true },
  });
}

// ============================================
// SEQUENCE VALIDATION
// ============================================

async function validateSequence(
  teacherId: string,
  canvasId: string
): Promise<SequenceValidation[]> {
  const canvas = await getCanvas(teacherId, canvasId);
  const data = canvas.canvasData as unknown as CanvasData;

  if (!data?.connections?.length) return [];

  // Get all topic items on the canvas
  const topicItems = (data.items || []).filter((i) => i.type === 'topic' && i.graphNodeId);
  if (topicItems.length < 2) return [];

  // Build item lookup
  const itemMap = new Map(topicItems.map((i) => [i.id, i]));

  // Get topic connections
  const topicConnections = data.connections.filter((c) => {
    return itemMap.has(c.fromItemId) && itemMap.has(c.toItemId);
  });

  if (topicConnections.length === 0) return [];

  // Get graph nodes for these topics (to access standard codes)
  const graphNodeIds = topicItems.map((i) => i.graphNodeId!).filter(Boolean);
  const graphNodes = await prisma.teachingGraphNode.findMany({
    where: { id: { in: graphNodeIds }, teacherId },
    select: { id: true, label: true, linkedStandardCodes: true, subject: true },
  });
  const nodeMap = new Map(graphNodes.map((n) => [n.id, n]));

  // Use Gemini to validate sequence relationships
  const connectionsToValidate = topicConnections.map((c) => {
    const fromItem = itemMap.get(c.fromItemId)!;
    const toItem = itemMap.get(c.toItemId)!;
    const fromNode = fromItem.graphNodeId ? nodeMap.get(fromItem.graphNodeId) : null;
    const toNode = toItem.graphNodeId ? nodeMap.get(toItem.graphNodeId) : null;
    return {
      connectionId: c.id,
      from: fromItem.topicLabel || fromNode?.label || 'Unknown',
      to: toItem.topicLabel || toNode?.label || 'Unknown',
      fromSubject: fromNode?.subject,
      toSubject: toNode?.subject,
    };
  });

  // Get teacher's curriculum context
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    select: { preferredCurriculum: true, gradeRange: true },
  });

  try {
    const prompt = `You are a curriculum sequencing expert. A teacher is planning their term and has connected topics in this order.
For each connection, determine if the sequence is pedagogically sound (teach topic A before topic B).
Curriculum: ${teacher?.preferredCurriculum || 'General'}
Grade range: ${teacher?.gradeRange || 'Elementary'}

Connections:
${connectionsToValidate.map((c, i) => `${i + 1}. "${c.from}" → "${c.to}" (subject: ${c.fromSubject || 'unknown'})`).join('\n')}

Respond as JSON array. For each connection:
- "valid": true/false
- "message": only if invalid, a brief friendly note (max 100 chars) like "Place value typically comes before fractions"
Example: [{"valid": true}, {"valid": false, "message": "Addition usually precedes multiplication"}]

Return ONLY the JSON array:`;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
      generationConfig: { maxOutputTokens: 500, temperature: 0.2 },
    });

    const result = await model.generateContent(prompt);
    const text = result.response?.text()?.trim();
    if (!text) return [];

    // Parse JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    const validations = JSON.parse(jsonMatch[0]);

    return connectionsToValidate.map((c, i) => ({
      connectionId: c.connectionId,
      fromTopic: c.from,
      toTopic: c.to,
      isValid: validations[i]?.valid !== false,
      message: validations[i]?.message || undefined,
    }));
  } catch (error) {
    logger.error('Sequence validation failed', { canvasId, error: (error as Error).message });
    return [];
  }
}

// ============================================
// COVERAGE CHECK
// ============================================

async function checkCoverage(
  teacherId: string,
  canvasId: string
): Promise<CoverageResult> {
  const canvas = await getCanvas(teacherId, canvasId);
  const data = canvas.canvasData as unknown as CanvasData;

  // Get topic items on the canvas
  const topicItems = (data.items || []).filter((i) => i.type === 'topic');
  const coveredLabels = topicItems.map((i) => i.topicLabel?.toLowerCase()).filter(Boolean) as string[];

  // Get all TOPIC nodes from the teacher's graph
  const allTopics = await prisma.teachingGraphNode.findMany({
    where: { teacherId, type: 'TOPIC' },
    select: { id: true, label: true, subject: true, linkedStandardCodes: true },
  });

  const coveredTopics: string[] = [];
  const missingTopics: CoverageResult['missingTopics'] = [];

  for (const topic of allTopics) {
    if (coveredLabels.includes(topic.label.toLowerCase())) {
      coveredTopics.push(topic.label);
    } else {
      missingTopics.push({
        label: topic.label,
        subject: topic.subject || undefined,
        standardCodes: topic.linkedStandardCodes.length > 0 ? topic.linkedStandardCodes : undefined,
      });
    }
  }

  return {
    coveredTopics,
    missingTopics,
    totalCurriculumTopics: allTopics.length,
    coveragePercentage: allTopics.length > 0
      ? Math.round((coveredTopics.length / allTopics.length) * 100)
      : 0,
  };
}

export const canvasService = {
  createCanvas,
  listCanvases,
  getCanvas,
  updateCanvas,
  archiveCanvas,
  validateSequence,
  checkCoverage,
};
