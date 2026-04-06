// Teaching Graph Service — Teacher Intelligence Platform
// Builds and queries the teaching graph from stream entries + curriculum standards
import { GraphNodeType, NodeStatus, EdgeType } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import { curriculumAdapterService, GraphCurriculumStandard } from './curriculumAdapterService.js';

// ============================================
// TYPES
// ============================================

export interface GraphData {
  nodes: Array<{
    id: string;
    type: GraphNodeType;
    label: string;
    weight: number;
    status: NodeStatus;
    externalId: string | null;
    lastTouchedAt: string | null;
  }>;
  edges: Array<{
    id: string;
    sourceId: string;
    targetId: string;
    type: EdgeType;
    weight: number;
    isGap: boolean;
  }>;
  stats: {
    totalNodes: number;
    topicsCovered: number;
    topicsTotal: number;
    standardsCovered: number;
    standardsTotal: number;
    gaps: number;
  };
}

// ============================================
// NODE & EDGE OPERATIONS
// ============================================

/**
 * Find or create a graph node. Uses upsert to avoid duplicates.
 */
async function upsertNode(
  teacherId: string,
  type: GraphNodeType,
  label: string,
  externalId?: string
) {
  return prisma.teachingGraphNode.upsert({
    where: {
      teacherId_type_label: { teacherId, type, label },
    },
    create: {
      teacherId,
      type,
      label,
      externalId: externalId || null,
      weight: 0,
      status: 'UNTOUCHED',
    },
    update: {}, // Don't overwrite existing data on conflict
  });
}

/**
 * Increment a node's weight and update its status.
 */
async function touchNode(nodeId: string, weightIncrement: number = 1) {
  const node = await prisma.teachingGraphNode.findUnique({ where: { id: nodeId } });
  if (!node) return null;

  const newWeight = node.weight + weightIncrement;
  let newStatus: NodeStatus = 'UNTOUCHED';
  if (newWeight > 0 && newWeight < 3) newStatus = 'MENTIONED';
  else if (newWeight >= 3 && newWeight < 8) newStatus = 'COVERED';
  else if (newWeight >= 8) newStatus = 'DEEP';

  return prisma.teachingGraphNode.update({
    where: { id: nodeId },
    data: {
      weight: newWeight,
      status: newStatus,
      lastTouchedAt: new Date(),
    },
  });
}

/**
 * Find or create an edge between two nodes.
 */
async function upsertEdge(
  teacherId: string,
  sourceId: string,
  targetId: string,
  type: EdgeType,
  isGap: boolean = false
) {
  return prisma.teachingGraphEdge.upsert({
    where: {
      sourceId_targetId_type: { sourceId, targetId, type },
    },
    create: {
      teacherId,
      sourceId,
      targetId,
      type,
      weight: 1,
      isGap,
    },
    update: {
      weight: { increment: 1 },
    },
  });
}

// ============================================
// GRAPH BUILDING FROM STREAM ENTRIES
// ============================================

/**
 * Process a stream entry's extracted tags into graph nodes and edges.
 * Called by the graph-update BullMQ job after tag extraction.
 */
async function processStreamEntry(teacherId: string, entryId: string) {
  const entry = await prisma.teacherStreamEntry.findFirst({
    where: { id: entryId, teacherId },
  });

  if (!entry || !entry.extractedTags) {
    logger.warn('No extracted tags for stream entry', { entryId });
    return;
  }

  const tags = entry.extractedTags as any;
  const topics: string[] = tags.topics || [];
  const standards: Array<{ code: string; description: string }> = tags.standards || [];

  // Load teacher profile for curriculum matching
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    select: {
      preferredCurriculum: true,
      agentProfile: { select: { curriculumType: true } },
    },
  });
  const curriculum = teacher?.preferredCurriculum || teacher?.agentProfile?.curriculumType || 'BRITISH';

  // 1. Create/update STREAM_ENTRY node
  const entryNode = await upsertNode(teacherId, 'STREAM_ENTRY', entryId);
  await touchNode(entryNode.id);

  // 2. Create/update TOPIC nodes and MENTIONS edges
  const topicNodes = [];
  for (const topic of topics) {
    const topicNode = await upsertNode(teacherId, 'TOPIC', topic.toLowerCase());
    await touchNode(topicNode.id);
    await upsertEdge(teacherId, entryNode.id, topicNode.id, 'MENTIONS');
    topicNodes.push(topicNode);
  }

  // 3. Match extracted standards to real LearningStandard records
  for (const standard of standards) {
    const matched = await curriculumAdapterService.matchStandard(
      standard.code,
      curriculum,
    );

    if (matched) {
      const standardNode = await upsertNode(
        teacherId,
        'STANDARD',
        matched.code,
        matched.id
      );
      await touchNode(standardNode.id);
      await upsertEdge(teacherId, entryNode.id, standardNode.id, 'MENTIONS');

      // Link standard to related topic nodes
      for (const topicNode of topicNodes) {
        await upsertEdge(teacherId, topicNode.id, standardNode.id, 'RELATED');
      }

      // Create PREREQUISITE edges from curriculum data
      for (const prereqId of matched.prerequisites) {
        const prereqStandard = await curriculumAdapterService.getStandardById(prereqId);
        if (prereqStandard) {
          const prereqNode = await upsertNode(
            teacherId,
            'STANDARD',
            prereqStandard.code,
            prereqStandard.id
          );
          // Check if prerequisite is covered
          const isGap = prereqNode.status === 'UNTOUCHED';
          await upsertEdge(teacherId, prereqNode.id, standardNode.id, 'PREREQUISITE', isGap);
        }
      }
    }
  }

  // 4. Create RELATED edges between co-occurring topics
  for (let i = 0; i < topicNodes.length; i++) {
    for (let j = i + 1; j < topicNodes.length; j++) {
      await upsertEdge(teacherId, topicNodes[i].id, topicNodes[j].id, 'RELATED');
    }
  }

  logger.info('Graph updated from stream entry', {
    teacherId,
    entryId,
    topicsAdded: topics.length,
    standardsMatched: standards.length,
  });
}

// ============================================
// CURRICULUM SEEDING
// ============================================

/**
 * Seed UNTOUCHED standard nodes for a teacher's curriculum.
 * Called once after onboarding to populate the graph backbone.
 */
async function seedCurriculumNodes(
  teacherId: string,
  curriculum: string,
  gradeLevel: string,
  subjects: string[]
) {
  const standards = await curriculumAdapterService.getStandardsForTeacher(
    curriculum,
    gradeLevel,
    subjects
  );

  let created = 0;
  for (const standard of standards) {
    await upsertNode(teacherId, 'STANDARD', standard.code, standard.id);
    created++;
  }

  // Create PREREQUISITE edges between standards
  for (const standard of standards) {
    const node = await prisma.teachingGraphNode.findFirst({
      where: { teacherId, type: 'STANDARD', label: standard.code },
    });
    if (!node) continue;

    for (const prereqId of standard.prerequisites) {
      const prereqStandard = standards.find(s => s.id === prereqId);
      if (prereqStandard) {
        const prereqNode = await prisma.teachingGraphNode.findFirst({
          where: { teacherId, type: 'STANDARD', label: prereqStandard.code },
        });
        if (prereqNode) {
          await upsertEdge(teacherId, prereqNode.id, node.id, 'PREREQUISITE', true);
        }
      }
    }
  }

  logger.info('Curriculum nodes seeded', { teacherId, curriculum, gradeLevel, created });
  return { created };
}

// ============================================
// GRAPH QUERIES
// ============================================

/**
 * Get the full graph for visualization.
 */
async function getFullGraph(teacherId: string): Promise<GraphData> {
  const [nodes, edges] = await Promise.all([
    prisma.teachingGraphNode.findMany({
      where: { teacherId },
      orderBy: { weight: 'desc' },
    }),
    prisma.teachingGraphEdge.findMany({
      where: { teacherId },
    }),
  ]);

  const topicNodes = nodes.filter(n => n.type === 'TOPIC');
  const standardNodes = nodes.filter(n => n.type === 'STANDARD');
  const gapEdges = edges.filter(e => e.isGap);

  return {
    nodes: nodes.map(n => ({
      id: n.id,
      type: n.type,
      label: n.label,
      weight: n.weight,
      status: n.status,
      externalId: n.externalId,
      lastTouchedAt: n.lastTouchedAt?.toISOString() || null,
    })),
    edges: edges.map(e => ({
      id: e.id,
      sourceId: e.sourceId,
      targetId: e.targetId,
      type: e.type,
      weight: e.weight,
      isGap: e.isGap,
    })),
    stats: {
      totalNodes: nodes.length,
      topicsCovered: topicNodes.filter(n => n.status !== 'UNTOUCHED').length,
      topicsTotal: topicNodes.length,
      standardsCovered: standardNodes.filter(n => n.status !== 'UNTOUCHED').length,
      standardsTotal: standardNodes.length,
      gaps: gapEdges.length,
    },
  };
}

/**
 * Get a single node with all connections and related data.
 */
async function getNodeDetail(teacherId: string, nodeId: string) {
  const node = await prisma.teachingGraphNode.findFirst({
    where: { id: nodeId, teacherId },
    include: {
      edges: {
        include: { target: true },
      },
      incomingEdges: {
        include: { source: true },
      },
    },
  });

  if (!node) throw new Error('Graph node not found');

  // If it's a standard node, get the full standard details
  let standardDetail = null;
  if (node.type === 'STANDARD' && node.externalId) {
    standardDetail = await curriculumAdapterService.getStandardById(node.externalId);
  }

  // Get related stream entries
  const relatedEntries = await prisma.teacherStreamEntry.findMany({
    where: {
      teacherId,
      archived: false,
      extractedTags: {
        path: ['topics'],
        array_contains: [node.label],
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  // Get related materials
  const relatedMaterials = await prisma.teacherMaterial.findMany({
    where: {
      teacherId,
      topics: { has: node.label },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return {
    node,
    standardDetail,
    relatedEntries,
    relatedMaterials,
  };
}

/**
 * Get all gap edges (prerequisites not yet covered).
 */
async function getGaps(teacherId: string) {
  const gaps = await prisma.teachingGraphEdge.findMany({
    where: { teacherId, isGap: true },
    include: {
      source: true,
      target: true,
    },
  });

  return gaps.map(g => ({
    id: g.id,
    prerequisite: { id: g.source.id, label: g.source.label, status: g.source.status },
    standard: { id: g.target.id, label: g.target.label, status: g.target.status },
  }));
}

/**
 * Get summary statistics for the graph.
 */
async function getStats(teacherId: string) {
  const [totalNodes, byType, byStatus] = await Promise.all([
    prisma.teachingGraphNode.count({ where: { teacherId } }),
    prisma.teachingGraphNode.groupBy({
      by: ['type'],
      where: { teacherId },
      _count: true,
    }),
    prisma.teachingGraphNode.groupBy({
      by: ['status'],
      where: { teacherId },
      _count: true,
    }),
  ]);

  const gaps = await prisma.teachingGraphEdge.count({
    where: { teacherId, isGap: true },
  });

  return {
    totalNodes,
    byType: Object.fromEntries(byType.map(t => [t.type, t._count])),
    byStatus: Object.fromEntries(byStatus.map(s => [s.status, s._count])),
    gaps,
  };
}

// ============================================
// EXPORT
// ============================================

export const teachingGraphService = {
  // Node/edge operations
  upsertNode,
  touchNode,
  upsertEdge,
  // Stream processing
  processStreamEntry,
  // Curriculum seeding
  seedCurriculumNodes,
  // Queries
  getFullGraph,
  getNodeDetail,
  getGaps,
  getStats,
};
