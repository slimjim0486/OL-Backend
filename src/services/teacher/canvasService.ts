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

  // Sync graph planning flags when canvas data changes
  if (input.canvasData) {
    try {
      await syncGraphPlanning(teacherId, canvasId, input.canvasData);
    } catch (err) {
      logger.warn('Graph planning sync failed (non-fatal)', { canvasId, error: (err as Error).message });
    }
  }

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
// CANVAS → GRAPH PLANNING SYNC
// ============================================

/**
 * Sync canvas topic placement back to TeachingGraphNode.
 * Sets plannedForTerm=true and plannedWeekLabel for topics on this canvas.
 * Clears flags for topics removed from the canvas.
 * Uses a hash to skip DB writes when nothing changed (common during drag auto-saves).
 */
async function syncGraphPlanning(
  teacherId: string,
  canvasId: string,
  canvasData: CanvasData
): Promise<void> {
  const items = canvasData.items || [];
  const topicItems = items.filter((i) => i.type === 'topic' && i.graphNodeId);
  const timeColumns = items
    .filter((i) => i.type === 'timeColumn')
    .sort((a, b) => a.position.x - b.position.x);

  // Build {graphNodeId, weekLabel} tuples
  const planning = topicItems.map((topic) => {
    // Find nearest time column to the left of this topic
    let weekLabel: string | null = null;
    for (let i = timeColumns.length - 1; i >= 0; i--) {
      if (timeColumns[i].position.x < topic.position.x) {
        weekLabel = timeColumns[i].label || null;
        break;
      }
    }
    return { graphNodeId: topic.graphNodeId!, weekLabel };
  });

  // Compute a simple hash to skip redundant writes
  const hashInput = planning
    .map((p) => `${p.graphNodeId}:${p.weekLabel || ''}`)
    .sort()
    .join('|');

  // Check against last sync (stored on canvas)
  const canvas = await prisma.teacherCanvas.findUnique({
    where: { id: canvasId },
    select: { planningHash: true },
  });

  // planningHash field may not exist yet (migration pending) — treat null as "never synced"
  if ((canvas as any)?.planningHash === hashInput && hashInput.length > 0) {
    return; // Nothing changed
  }

  const graphNodeIds = planning.map((p) => p.graphNodeId);
  const otherCanvasGraphNodeIds = await getGraphNodeIdsFromOtherCanvases(teacherId, canvasId);
  const plannedAnywhereIds = [...new Set([...graphNodeIds, ...otherCanvasGraphNodeIds])];

  // Set plannedForTerm + weekLabel for topics on this canvas
  for (const p of planning) {
    await prisma.teachingGraphNode.updateMany({
      where: { id: p.graphNodeId, teacherId },
      data: { plannedForTerm: true, plannedWeekLabel: p.weekLabel },
    });
  }

  // Clear plannedForTerm for topics no longer on ANY canvas
  // (Only clear nodes owned by this teacher that aren't in any active canvas)
  if (plannedAnywhereIds.length > 0) {
    await prisma.teachingGraphNode.updateMany({
      where: {
        teacherId,
        plannedForTerm: true,
        id: { notIn: plannedAnywhereIds },
      },
      data: { plannedForTerm: false, plannedWeekLabel: null },
    });
  } else {
    // No topics on canvas — clear all
    await prisma.teachingGraphNode.updateMany({
      where: { teacherId, plannedForTerm: true },
      data: { plannedForTerm: false, plannedWeekLabel: null },
    });
  }

  // Save hash to avoid re-syncing on next auto-save
  try {
    await prisma.teacherCanvas.update({
      where: { id: canvasId },
      data: { planningHash: hashInput } as any,
    });
  } catch { /* planningHash column may not exist yet */ }
}

async function getGraphNodeIdsFromOtherCanvases(
  teacherId: string,
  canvasId: string
): Promise<string[]> {
  const canvases = await prisma.teacherCanvas.findMany({
    where: {
      teacherId,
      isArchived: false,
      id: { not: canvasId },
    },
    select: { canvasData: true },
  });

  const ids = new Set<string>();
  for (const canvas of canvases) {
    const data = canvas.canvasData as unknown as CanvasData | null;
    for (const item of data?.items || []) {
      if (item.type === 'topic' && item.graphNodeId) {
        ids.add(item.graphNodeId);
      }
    }
  }
  return [...ids];
}

// ============================================
// GENERATE MATERIALS FROM CANVAS
// ============================================

interface GenerateMaterialsResult {
  queued: number;
  skipped: number;
  skippedLabels: string[];
  totalTopics: number;
  jobs: Array<{ graphNodeId: string; topicLabel: string; canvasItemId: string }>;
}

/**
 * Extract topics from canvas sorted left-to-right, check for existing materials,
 * and return the list of topics to generate for. Actual BullMQ queueing is done
 * by the caller (canvas route handler).
 */
async function prepareCanvasGeneration(
  teacherId: string,
  canvasId: string,
  materialType: string
): Promise<GenerateMaterialsResult> {
  const canvas = await getCanvas(teacherId, canvasId);
  const data = canvas.canvasData as unknown as CanvasData;

  // Extract topic items sorted by x-position (left-to-right)
  const topicItems = (data.items || [])
    .filter((i) => i.type === 'topic' && i.graphNodeId)
    .sort((a, b) => a.position.x - b.position.x);

  const totalTopics = (data.items || []).filter((i) => i.type === 'topic').length;

  if (topicItems.length === 0) {
    return { queued: 0, skipped: totalTopics, skippedLabels: [], totalTopics, jobs: [] };
  }

  // Check which topics already have materials of this type
  const graphNodeIds = topicItems.map((i) => i.graphNodeId!);
  const existingMaterials = await prisma.teacherMaterial.findMany({
    where: {
      teacherId,
      sourceGraphNodeId: { in: graphNodeIds },
      type: materialType as any,
    },
    select: { sourceGraphNodeId: true },
  });
  const existingNodeIds = new Set(existingMaterials.map((m) => m.sourceGraphNodeId));

  const jobs: GenerateMaterialsResult['jobs'] = [];
  const skippedLabels: string[] = [];

  for (const item of topicItems) {
    if (existingNodeIds.has(item.graphNodeId!)) {
      skippedLabels.push(item.topicLabel || 'Unknown topic');
    } else {
      jobs.push({
        graphNodeId: item.graphNodeId!,
        topicLabel: item.topicLabel || 'Unknown topic',
        canvasItemId: item.id,
      });
    }
  }

  return {
    queued: jobs.length,
    skipped: skippedLabels.length + (totalTopics - topicItems.length), // includes topics without graphNodeId
    skippedLabels,
    totalTopics,
    jobs,
  };
}

/**
 * Add a generated material as a new canvas item positioned near the source topic.
 * Read-modify-write on canvasData JSON.
 */
async function addMaterialToCanvas(
  canvasId: string,
  materialId: string,
  materialTitle: string,
  materialType: string,
  nearCanvasItemId: string
): Promise<void> {
  const itemId = `mat-${materialId.slice(0, 8)}`;

  for (let attempt = 0; attempt < 3; attempt++) {
    const canvas = await prisma.teacherCanvas.findUnique({
      where: { id: canvasId },
      select: { canvasData: true, updatedAt: true },
    });
    if (!canvas) return;

    const data = canvas.canvasData as unknown as CanvasData;
    data.items = data.items || [];

    if (data.items.some((item) => item.id === itemId || item.materialId === materialId)) {
      return;
    }

    const sourceItem = data.items.find((i) => i.id === nearCanvasItemId);
    if (!sourceItem) return;

    const newItem: CanvasItem = {
      id: itemId,
      type: 'material',
      position: { x: sourceItem.position.x + 200, y: sourceItem.position.y + 80 },
      size: { width: 180, height: 60 },
      materialId,
      materialTitle,
      materialType,
    };

    const nextData = {
      ...data,
      items: [...data.items, newItem],
    };

    const updated = await prisma.teacherCanvas.updateMany({
      where: { id: canvasId, updatedAt: canvas.updatedAt },
      data: { canvasData: nextData as any },
    });

    if (updated.count > 0) return;
    await delay(25 * (attempt + 1));
  }

  throw new Error('Canvas changed while placing generated material');
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
  prepareCanvasGeneration,
  addMaterialToCanvas,
};
