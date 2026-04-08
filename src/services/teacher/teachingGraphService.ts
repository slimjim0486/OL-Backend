// Teaching Graph Service — Teacher Intelligence Platform
// Thought-centric graph: teacher's notes, materials, and topic clusters.
// Curriculum standards are invisible metadata on TOPIC nodes, never shown as graph nodes.
import { GraphNodeType, EdgeType, Prisma, Subject } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import { curriculumAdapterService } from './curriculumAdapterService.js';

// ============================================
// TYPES
// ============================================

export interface GraphData {
  nodes: Array<{
    id: string;
    type: GraphNodeType;
    label: string;
    weight: number;
    subject: string | null;
    streamEntryId: string | null;
    materialId: string | null;
    lastTouchedAt: string | null;
  }>;
  edges: Array<{
    id: string;
    sourceId: string;
    targetId: string;
    type: EdgeType;
    weight: number;
  }>;
  stats: {
    topics: number;
    notes: number;
    materials: number;
    subjects: number;
  };
}

export interface CoverageData {
  subjects: Array<{
    subject: string;
    totalStandards: number;
    coveredStandards: number;
    percentage: number;
    gaps: Array<{ code: string; description: string }>;
  }>;
  overall: {
    totalStandards: number;
    coveredStandards: number;
    percentage: number;
  };
}

// ============================================
// NODE & EDGE OPERATIONS
// ============================================

/**
 * Infer subject from a topic label using keyword matching.
 * Falls back to the provided default subject if no match.
 */
function inferSubjectFromTopic(topicLabel: string, defaultSubject?: string | null): string | null {
  const t = topicLabel.toLowerCase();

  const MATH_KEYWORDS = ['fraction', 'decimal', 'algebra', 'geometry', 'multiplication', 'division',
    'addition', 'subtraction', 'number', 'equation', 'arithmetic', 'measurement', 'place value',
    'percent', 'ratio', 'proportion', 'graph', 'counting', 'shape', 'angle', 'symmetry', 'area',
    'perimeter', 'volume', 'statistics', 'probability', 'data', 'numeracy', 'maths', 'math',
    'calculation', 'integer', 'negative number', 'coordinate'];

  const SCIENCE_KEYWORDS = ['science', 'biology', 'chemistry', 'physics', 'experiment', 'hypothesis',
    'water cycle', 'ecosystem', 'habitat', 'photosynthesis', 'gravity', 'force', 'energy',
    'electricity', 'magnet', 'plant', 'animal', 'cell', 'evolution', 'climate', 'weather',
    'solar system', 'planet', 'rock', 'material', 'chemical', 'reaction', 'atom', 'molecule'];

  const ENGLISH_KEYWORDS = ['reading', 'writing', 'grammar', 'spelling', 'vocabulary', 'comprehension',
    'phonics', 'literature', 'poem', 'poetry', 'story', 'narrative', 'essay', 'persuasive',
    'punctuation', 'sentence', 'paragraph', 'creative writing', 'fiction', 'non-fiction',
    'author', 'character', 'book', 'text', 'language', 'english', 'literacy'];

  const HISTORY_KEYWORDS = ['history', 'historical', 'civilization', 'war', 'ancient', 'medieval',
    'revolution', 'empire', 'dynasty', 'century', 'king', 'queen', 'archaeology'];

  const GEOGRAPHY_KEYWORDS = ['geography', 'continent', 'country', 'river', 'mountain', 'ocean',
    'map', 'climate zone', 'population', 'migration', 'volcano', 'earthquake', 'landscape'];

  const ART_KEYWORDS = ['art', 'painting', 'drawing', 'sculpture', 'colour', 'color', 'sketch',
    'design', 'craft', 'pottery', 'print', 'textile', 'collage'];

  const COMPUTING_KEYWORDS = ['computing', 'coding', 'programming', 'algorithm', 'computer',
    'software', 'debug', 'loop', 'variable', 'scratch', 'digital', 'internet', 'cyber'];

  const COMMUNICATION_KEYWORDS = ['email', 'parent communication', 'newsletter', 'send update',
    'parent meeting', 'report card', 'conference', 'phone call', 'message parent', 'parent email',
    'communication', 'announcement', 'notify', 'inform parent', 'letter home', 'update parent'];

  const PLANNING_KEYWORDS = ['lesson planning', 'weekly plan', 'schedule', 'timetable', 'prep',
    'planning', 'organise', 'organize', 'to-do', 'todo', 'deadline', 'meeting', 'staff meeting',
    'professional development', 'training', 'admin', 'time management', 'substitute', 'sub plan'];

  if (MATH_KEYWORDS.some(k => t.includes(k))) return 'mathematics';
  if (SCIENCE_KEYWORDS.some(k => t.includes(k))) return 'science';
  if (ENGLISH_KEYWORDS.some(k => t.includes(k))) return 'english';
  if (HISTORY_KEYWORDS.some(k => t.includes(k))) return 'history';
  if (GEOGRAPHY_KEYWORDS.some(k => t.includes(k))) return 'geography';
  if (ART_KEYWORDS.some(k => t.includes(k))) return 'art';
  if (COMPUTING_KEYWORDS.some(k => t.includes(k))) return 'computing';
  if (COMMUNICATION_KEYWORDS.some(k => t.includes(k))) return 'communication';
  if (PLANNING_KEYWORDS.some(k => t.includes(k))) return 'planning';

  return defaultSubject?.toLowerCase() || null;
}

/**
 * Compute the current academic school year string in "YYYY-YYYY" form.
 * Uses August as the typical academic cutover for US/UK — before August,
 * use the year pair ending at the current year; from August on, start a
 * new pair. Non-US curricula (CBSE, ARABIC) use different cycles, but a
 * single default is acceptable for Phase 4.8 Option B since the value is
 * only used as a de-dupe key for CurriculumState — the legacy onboarding
 * flow can still create alternate-year states explicitly.
 */
export function computeCurrentSchoolYear(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  return month >= 7 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
}

/**
 * Normalize a TeachingGraphNode.subject (lowercase free-text like "mathematics",
 * "computing", "communication") to a Prisma Subject enum value for curriculum
 * state sync. Returns null for intelligence-portal pseudo-subjects (planning,
 * communication, admin) that don't belong to any curriculum framework.
 *
 * Shared shape with `normalizeLessonSubject` in agentOrchestratorService.ts,
 * but tailored for topic-node inputs — handles the lowercase free-text format
 * that `inferSubjectFromTopic` produces, and explicitly drops pseudo-subjects.
 */
export function normalizeTopicSubjectToEnum(
  subject: string | null | undefined
): Subject | null {
  if (!subject) return null;
  const raw = subject.trim().toLowerCase();
  if (!raw) return null;

  // Pseudo-subjects that exist on topic nodes but don't map to curriculum standards.
  const SKIP = new Set(['communication', 'planning', 'admin', 'other']);
  if (SKIP.has(raw)) return null;

  const MAP: Record<string, Subject> = {
    math: 'MATH',
    maths: 'MATH',
    mathematics: 'MATH',
    science: 'SCIENCE',
    biology: 'SCIENCE',
    chemistry: 'SCIENCE',
    physics: 'SCIENCE',
    english: 'ENGLISH',
    ela: 'ENGLISH',
    literacy: 'ENGLISH',
    language_arts: 'ENGLISH',
    reading: 'READING',
    history: 'HISTORY',
    geography: 'GEOGRAPHY',
    social_studies: 'SOCIAL_STUDIES',
    socialstudies: 'SOCIAL_STUDIES',
    civics: 'SOCIAL_STUDIES',
    art: 'ART',
    music: 'MUSIC',
    computing: 'COMPUTER_SCIENCE',
    computer_science: 'COMPUTER_SCIENCE',
    computerscience: 'COMPUTER_SCIENCE',
    cs: 'COMPUTER_SCIENCE',
    pe: 'PHYSICAL_EDUCATION',
    physical_education: 'PHYSICAL_EDUCATION',
  };

  return MAP[raw] ?? null;
}

/**
 * Find or create a TOPIC node. Uses upsert to avoid duplicates.
 */
async function upsertTopicNode(
  teacherId: string,
  label: string,
  subject?: string | null
) {
  // Infer the correct subject from the topic label rather than blindly trusting the caller
  const inferredSubject = inferSubjectFromTopic(label, subject);
  return prisma.teachingGraphNode.upsert({
    where: {
      teacherId_type_label: { teacherId, type: 'TOPIC', label: label.toLowerCase() },
    },
    create: {
      teacherId,
      type: 'TOPIC',
      label: label.toLowerCase(),
      subject: inferredSubject,
      weight: 0,
    },
    update: {
      // Update subject if inference gives a better result
      ...(inferredSubject ? { subject: inferredSubject } : {}),
    },
  });
}

/**
 * Create a STREAM_ENTRY node linked to its source entry.
 * Label stores the entryId (for unique constraint). Display text comes from the
 * joined streamEntry relation in getFullGraph().
 */
async function createStreamEntryNode(
  teacherId: string,
  entryId: string,
  subject?: string | null
) {
  return prisma.teachingGraphNode.upsert({
    where: {
      teacherId_type_label: { teacherId, type: 'STREAM_ENTRY', label: entryId },
    },
    create: {
      teacherId,
      type: 'STREAM_ENTRY',
      label: entryId, // ID for uniqueness; display text resolved via streamEntry relation
      streamEntryId: entryId,
      subject: subject?.toLowerCase() || null,
      weight: 1,
      lastTouchedAt: new Date(),
    },
    update: {
      lastTouchedAt: new Date(),
      ...(subject ? { subject: subject.toLowerCase() } : {}),
    },
  });
}

/**
 * Create a MATERIAL node linked to its source material.
 * Label stores the materialId (for unique constraint). Display text comes from the
 * joined material relation in getFullGraph().
 */
async function createMaterialNode(
  teacherId: string,
  materialId: string,
  subject?: string | null
) {
  return prisma.teachingGraphNode.upsert({
    where: {
      teacherId_type_label: { teacherId, type: 'MATERIAL', label: materialId },
    },
    create: {
      teacherId,
      type: 'MATERIAL',
      label: materialId, // ID for uniqueness; display text resolved via material relation
      materialId,
      subject: subject?.toLowerCase() || null,
      weight: 1,
      lastTouchedAt: new Date(),
    },
    update: {
      lastTouchedAt: new Date(),
      ...(subject ? { subject: subject.toLowerCase() } : {}),
    },
  });
}

/**
 * Find or create an edge between two nodes. Increments weight on re-occurrence.
 */
async function upsertEdge(
  teacherId: string,
  sourceId: string,
  targetId: string,
  type: EdgeType
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
    },
    update: {
      weight: { increment: 1 },
    },
  });
}

/**
 * Recalculate a TOPIC node's weight based on connected entries + materials.
 */
async function recalcTopicWeight(nodeId: string) {
  const counts = await prisma.teachingGraphEdge.count({
    where: {
      targetId: nodeId,
      type: 'ABOUT',
    },
  });

  await prisma.teachingGraphNode.update({
    where: { id: nodeId },
    data: {
      weight: counts,
      lastTouchedAt: new Date(),
    },
  });
}

// ============================================
// GRAPH BUILDING FROM STREAM ENTRIES
// ============================================

/**
 * Process a stream entry's extracted tags into graph nodes and edges.
 * Called by the stream extraction BullMQ job after tag extraction.
 *
 * Pipeline:
 * 1. Extract human-readable topics → create TOPIC nodes
 * 2. Create STREAM_ENTRY node → link to topics (ABOUT edges)
 * 3. Invisible curriculum matching → store linkedStandardCodes on TOPIC nodes
 * 4. Co-occurrence → RELATED edges between topics mentioned together
 * 5. Temporal sequence → SEQUENCE edge from previous topic to current
 * 6. Update topic weights
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
  const subjects: string[] = tags.subjects || [];
  const standards: Array<{ code: string; description: string }> = tags.standards || [];
  const primarySubject = subjects[0] || null;

  // Load teacher profile for curriculum matching
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    select: {
      preferredCurriculum: true,
      agentProfile: { select: { curriculumType: true } },
    },
  });
  const curriculum = teacher?.preferredCurriculum || teacher?.agentProfile?.curriculumType || 'BRITISH';

  // Step 1: Create/update TOPIC nodes (human-readable labels)
  const topicNodes = [];
  for (const topic of topics) {
    const topicNode = await upsertTopicNode(teacherId, topic, primarySubject);
    topicNodes.push(topicNode);
  }

  // Step 2: Create STREAM_ENTRY node and link to topics (ABOUT edges)
  const entryNode = await createStreamEntryNode(teacherId, entryId, primarySubject);

  for (const topicNode of topicNodes) {
    await upsertEdge(teacherId, entryNode.id, topicNode.id, 'ABOUT');
  }

  // Step 3: Invisible curriculum matching — store linkedStandardCodes on TOPIC nodes
  for (const topicNode of topicNodes) {
    try {
      const matchedCodes: string[] = [];

      // Try to match extracted standard codes to real standards
      for (const standard of standards) {
        const matched = await curriculumAdapterService.matchStandard(
          standard.code,
          curriculum,
        );
        if (matched) {
          matchedCodes.push(matched.code);
        }
      }

      // Also try matching topic label against standard descriptions via keyword matching
      const topicStandards = await curriculumAdapterService.matchStandardsByTopic(
        topicNode.label,
        curriculum,
        primarySubject || undefined,
      );
      for (const ts of topicStandards) {
        if (!matchedCodes.includes(ts.code)) {
          matchedCodes.push(ts.code);
        }
      }

      // Merge new codes with existing (don't overwrite)
      if (matchedCodes.length > 0) {
        const existing = topicNode.linkedStandardCodes || [];
        const merged = [...new Set([...existing, ...matchedCodes])];
        await prisma.teachingGraphNode.update({
          where: { id: topicNode.id },
          data: { linkedStandardCodes: merged },
        });
      }
    } catch (err) {
      // Non-fatal: curriculum matching failure shouldn't block graph building
      logger.warn('Failed to match standards for topic', {
        topic: topicNode.label,
        error: (err as Error).message,
      });
    }
  }

  // Step 3.5: Curriculum prerequisite edges
  // For each topic node, walk its standards' `prerequisites` (DB IDs),
  // translate back to notations, find OTHER topic nodes belonging to this
  // teacher that cover those notations, and draw a directed
  // PREREQUISITE edge: prerequisite_topic → current_topic.
  //
  // Depends on LearningStandard.prerequisites being populated — this is a
  // no-op for curricula whose prereq data hasn't been backfilled yet, so it
  // degrades gracefully to zero edges rather than failing.
  //
  // Non-fatal: any error logs a warning and stream processing continues.
  for (const topicNode of topicNodes) {
    try {
      // Re-fetch to get the post-Step-3 linkedStandardCodes (Step 3 writes
      // to the DB without updating the local object).
      const fresh = await prisma.teachingGraphNode.findUnique({
        where: { id: topicNode.id },
        select: { linkedStandardCodes: true },
      });
      const codes = fresh?.linkedStandardCodes || [];
      if (codes.length === 0) continue;

      // Load the full standards so we can see their prerequisites
      const standards = await prisma.learningStandard.findMany({
        where: { notation: { in: codes } },
        select: { prerequisites: true },
      });

      // Collect all prereq IDs across this topic's standards
      const prereqIds = new Set<string>();
      for (const s of standards) {
        for (const pid of s.prerequisites || []) prereqIds.add(pid);
      }
      if (prereqIds.size === 0) continue;

      // Resolve prereq IDs → notations (linkedStandardCodes stores notations,
      // not IDs, so we need this translation to match against topic nodes).
      const prereqStandards = await prisma.learningStandard.findMany({
        where: { id: { in: [...prereqIds] } },
        select: { notation: true },
      });
      const prereqNotations = prereqStandards
        .map((s) => s.notation)
        .filter((n): n is string => Boolean(n));
      if (prereqNotations.length === 0) continue;

      // Find this teacher's OTHER topic nodes that cover any of these prereqs
      const prereqTopicNodes = await prisma.teachingGraphNode.findMany({
        where: {
          teacherId,
          type: 'TOPIC',
          id: { not: topicNode.id },
          linkedStandardCodes: { hasSome: prereqNotations },
        },
        select: { id: true },
      });

      // Draw directed PREREQUISITE edges: prereq_topic → current_topic
      for (const prereqTopic of prereqTopicNodes) {
        await upsertEdge(teacherId, prereqTopic.id, topicNode.id, 'PREREQUISITE');
      }
    } catch (err) {
      logger.warn('Failed to create prerequisite edges for topic', {
        topicNodeId: topicNode.id,
        error: (err as Error).message,
      });
    }
  }

  // Step 4: Co-occurrence — RELATED edges between topics mentioned together
  for (let i = 0; i < topicNodes.length; i++) {
    for (let j = i + 1; j < topicNodes.length; j++) {
      await upsertEdge(teacherId, topicNodes[i].id, topicNodes[j].id, 'RELATED');
    }
  }

  // Step 5: Temporal sequence — SEQUENCE edge from previous entry's topics
  if (topicNodes.length > 0) {
    try {
      const previousEntry = await prisma.teacherStreamEntry.findFirst({
        where: {
          teacherId,
          id: { not: entryId },
          archived: false,
          NOT: { extractedTags: { equals: Prisma.DbNull } },
        },
        orderBy: { createdAt: 'desc' },
        select: { id: true, extractedTags: true },
      });

      if (previousEntry?.extractedTags) {
        const prevTags = previousEntry.extractedTags as any;
        const prevTopics: string[] = prevTags.topics || [];

        for (const prevTopic of prevTopics) {
          const prevTopicNode = await prisma.teachingGraphNode.findFirst({
            where: { teacherId, type: 'TOPIC', label: prevTopic.toLowerCase() },
          });

          if (prevTopicNode) {
            // Only create SEQUENCE if the topics are different
            for (const currentTopicNode of topicNodes) {
              if (prevTopicNode.id !== currentTopicNode.id) {
                await upsertEdge(teacherId, prevTopicNode.id, currentTopicNode.id, 'SEQUENCE');
              }
            }
          }
        }
      }
    } catch (err) {
      logger.warn('Failed to create sequence edges', { error: (err as Error).message });
    }
  }

  // Step 5.5: Sync topic linkedStandardCodes → CurriculumState.standardsTaught
  // Keeps CurriculumState as a mirror of the teaching graph's curriculum coverage
  // so downstream services (contextAssembler, standardsAnalysisService,
  // proactiveSuggestionService) read grounded standards data. Without this sync,
  // `CurriculumState.standardsTaught` stays empty forever (nothing else writes
  // to it in practice) and the context assembler path silently falls through.
  // Non-fatal: sync failure never blocks graph building.
  if (topicNodes.length > 0) {
    try {
      // Re-fetch topic nodes to get the post-Step-3 linkedStandardCodes.
      // The in-memory topicNodes array is stale because Step 3 wrote to the
      // DB without updating the local objects.
      const freshTopics = await prisma.teachingGraphNode.findMany({
        where: { id: { in: topicNodes.map((t) => t.id) } },
        select: { id: true, subject: true, linkedStandardCodes: true },
      });

      // Group codes by normalized Subject enum, skipping pseudo-subjects.
      const codesBySubject = new Map<Subject, Set<string>>();
      for (const topic of freshTopics) {
        if (!topic.linkedStandardCodes?.length) continue;
        const normalizedSubject = normalizeTopicSubjectToEnum(
          topic.subject || primarySubject || undefined
        );
        if (!normalizedSubject) continue;
        if (!codesBySubject.has(normalizedSubject)) {
          codesBySubject.set(normalizedSubject, new Set());
        }
        const set = codesBySubject.get(normalizedSubject)!;
        for (const code of topic.linkedStandardCodes) {
          if (code) set.add(code);
        }
      }

      if (codesBySubject.size > 0) {
        // TeacherAgent.teacherId is @unique in the schema.
        const agent = await prisma.teacherAgent.findUnique({
          where: { teacherId },
          select: { id: true },
        });

        if (agent) {
          const currentYear = computeCurrentSchoolYear();

          for (const [subject, codeSet] of codesBySubject) {
            // Read the current-year state (if any) to compute the union.
            // Upsert against the (agentId, subject, schoolYear) composite unique
            // so the write is race-safe vs concurrent onboarding writes.
            const existing = await prisma.curriculumState.findUnique({
              where: {
                agentId_subject_schoolYear: {
                  agentId: agent.id,
                  subject,
                  schoolYear: currentYear,
                },
              },
              select: { id: true, standardsTaught: true },
            });

            const merged = new Set(existing?.standardsTaught || []);
            const beforeSize = merged.size;
            for (const code of codeSet) merged.add(code);

            if (merged.size === beforeSize && existing) {
              // Nothing new to write.
              continue;
            }

            await prisma.curriculumState.upsert({
              where: {
                agentId_subject_schoolYear: {
                  agentId: agent.id,
                  subject,
                  schoolYear: currentYear,
                },
              },
              create: {
                agentId: agent.id,
                subject,
                schoolYear: currentYear,
                standardsTaught: [...merged],
              },
              update: {
                standardsTaught: [...merged],
              },
            });

            logger.info(
              existing ? 'Synced standardsTaught from graph' : 'Created CurriculumState from graph sync',
              {
                teacherId,
                subject,
                schoolYear: currentYear,
                added: merged.size - beforeSize,
                total: merged.size,
              }
            );
          }
        }
      }
    } catch (err) {
      // Non-fatal — sync failure never blocks graph building.
      logger.warn('Failed to sync linkedStandardCodes to CurriculumState.standardsTaught', {
        teacherId,
        entryId,
        error: (err as Error).message,
      });
    }
  }

  // Step 6: Update topic node weights
  for (const topicNode of topicNodes) {
    await recalcTopicWeight(topicNode.id);
  }

  logger.info('Graph updated from stream entry', {
    teacherId,
    entryId,
    topicsAdded: topics.length,
  });
}

// ============================================
// GRAPH BUILDING FROM MATERIALS
// ============================================

/**
 * Process a generated or imported material into the graph.
 * Creates MATERIAL node, links to topics (ABOUT) and source entry (GENERATED_FROM).
 */
async function processMaterial(
  teacherId: string,
  materialId: string,
  _title: string,
  subject: string,
  topics: string[],
  sourceStreamEntryId?: string | null
) {
  // Create MATERIAL node (label is materialId for uniqueness; display text from material relation)
  const materialNode = await createMaterialNode(teacherId, materialId, subject);

  // Link to TOPIC nodes (ABOUT edges)
  for (const topic of topics) {
    const topicNode = await upsertTopicNode(teacherId, topic, subject);
    await upsertEdge(teacherId, materialNode.id, topicNode.id, 'ABOUT');
    await recalcTopicWeight(topicNode.id);
  }

  // Link to source stream entry (GENERATED_FROM edge)
  if (sourceStreamEntryId) {
    const sourceEntryNode = await prisma.teachingGraphNode.findFirst({
      where: { teacherId, type: 'STREAM_ENTRY', streamEntryId: sourceStreamEntryId },
    });
    if (sourceEntryNode) {
      await upsertEdge(teacherId, materialNode.id, sourceEntryNode.id, 'GENERATED_FROM');
    }
  }

  logger.info('Graph updated from material', { teacherId, materialId, topics });
}

// ============================================
// CURRICULUM METADATA SEEDING (INVISIBLE)
// ============================================

/**
 * Seed curriculum metadata for a teacher's onboarding config.
 * Does NOT create any visible graph nodes — graph starts empty.
 * Just stores the teacher's curriculum/grade/subject for future standard matching.
 */
async function seedCurriculumMetadata(
  teacherId: string,
  curriculum: string,
  gradeLevel: string,
  subjects: string[]
) {
  // No graph nodes are created. The teacher's curriculum config is already
  // stored on the Teacher model (preferredCurriculum, gradeRange, primarySubject).
  // This function exists for future use if we need to pre-load any metadata.

  const count = await curriculumAdapterService.getStandardsCount(
    curriculum,
    gradeLevel,
    subjects[0]
  );

  logger.info('Curriculum metadata loaded for graph matching', {
    teacherId,
    curriculum,
    gradeLevel,
    subjects,
    availableStandards: count,
  });

  return { availableStandards: count };
}

// ============================================
// GRAPH QUERIES
// ============================================

/**
 * Get the full graph for visualization.
 * Returns only TOPIC, STREAM_ENTRY, MATERIAL nodes — never curriculum standards.
 */
async function getFullGraph(teacherId: string): Promise<GraphData> {
  const [nodes, edges] = await Promise.all([
    prisma.teachingGraphNode.findMany({
      where: {
        teacherId,
        // Only load valid thought-centric node types (old STANDARD/STUDENT_GROUP rows ignored)
        type: { in: ['TOPIC', 'STREAM_ENTRY', 'MATERIAL'] },
      },
      orderBy: { weight: 'desc' },
      include: {
        streamEntry: { select: { content: true } },
        material: { select: { title: true } },
      },
    }),
    prisma.teachingGraphEdge.findMany({
      where: { teacherId },
    }),
  ]);

  const topicNodes = nodes.filter(n => n.type === 'TOPIC');
  const entryNodes = nodes.filter(n => n.type === 'STREAM_ENTRY');
  const materialNodes = nodes.filter(n => n.type === 'MATERIAL');
  const uniqueSubjects = new Set(nodes.map(n => n.subject).filter(Boolean));

  return {
    nodes: nodes.map(n => {
      // Resolve display label: TOPIC nodes use their label directly,
      // STREAM_ENTRY/MATERIAL nodes resolve from the joined relation
      let displayLabel = n.label;
      if (n.type === 'STREAM_ENTRY' && n.streamEntry) {
        displayLabel = n.streamEntry.content.replace(/\n/g, ' ').substring(0, 60);
      } else if (n.type === 'MATERIAL' && n.material) {
        displayLabel = n.material.title.substring(0, 60);
      }
      return {
        id: n.id,
        type: n.type,
        label: displayLabel,
        weight: n.weight,
        subject: n.subject,
        streamEntryId: n.streamEntryId,
        materialId: n.materialId,
        lastTouchedAt: n.lastTouchedAt?.toISOString() || null,
      };
    }),
    edges: edges.map(e => ({
      id: e.id,
      sourceId: e.sourceId,
      targetId: e.targetId,
      type: e.type,
      weight: e.weight,
    })),
    stats: {
      topics: topicNodes.length,
      notes: entryNodes.length,
      materials: materialNodes.length,
      subjects: uniqueSubjects.size,
    },
  };
}

/**
 * Find unlinked mentions of a topic: stream entries where the topic word appears
 * in the text but the AI didn't tag it as a primary topic. Backed by the
 * PostgreSQL tsvector index on TeacherStreamEntry.search_vector.
 */
async function getUnlinkedMentions(
  teacherId: string,
  topicLabel: string,
  excludeIds: string[],
  limit = 20,
) {
  // plainto_tsquery handles stemming ("fractions" also matches "fraction")
  // and escapes any special query chars in the topic label.
  if (excludeIds.length === 0) {
    return prisma.$queryRaw<any[]>`
      SELECT id, "teacherId", content, "extractedTags", "extractionStatus",
             pinned, archived, "createdAt", "updatedAt"
      FROM "TeacherStreamEntry"
      WHERE "teacherId" = ${teacherId}
        AND archived = false
        AND search_vector @@ plainto_tsquery('english', ${topicLabel})
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
      AND search_vector @@ plainto_tsquery('english', ${topicLabel})
    ORDER BY "createdAt" DESC
    LIMIT ${limit}
  `;
}

/**
 * Find unlinked material mentions: materials where the topic word appears in the
 * title but the material isn't linked to this topic via an ABOUT edge. Uses ILIKE
 * since TeacherMaterial doesn't carry a tsvector column — acceptable because
 * material titles are short and libraries rarely exceed a few hundred items.
 */
async function getUnlinkedMaterialMentions(
  teacherId: string,
  topicLabel: string,
  excludeIds: string[],
  limit = 10,
) {
  return prisma.teacherMaterial.findMany({
    where: {
      teacherId,
      ...(excludeIds.length > 0 ? { id: { notIn: excludeIds } } : {}),
      title: { contains: topicLabel, mode: 'insensitive' },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

/**
 * Promote an unlinked mention to a linked note by creating an ABOUT edge between
 * the stream entry's graph node and the topic node. Creates the STREAM_ENTRY graph
 * node on demand if it doesn't exist yet.
 */
async function linkEntryToNode(
  teacherId: string,
  nodeId: string,
  streamEntryId: string,
) {
  // Ensure the topic node belongs to this teacher (authorization)
  const topicNode = await prisma.teachingGraphNode.findFirst({
    where: { id: nodeId, teacherId },
  });
  if (!topicNode) {
    throw new Error('Graph node not found');
  }
  if (topicNode.type !== 'TOPIC') {
    throw new Error('Only topic nodes can be linked to stream entries');
  }

  // Ensure the stream entry belongs to this teacher
  const entry = await prisma.teacherStreamEntry.findFirst({
    where: { id: streamEntryId, teacherId },
  });
  if (!entry) {
    throw new Error('Stream entry not found');
  }

  // Find or create the STREAM_ENTRY graph node
  let entryNode = await prisma.teachingGraphNode.findUnique({
    where: { streamEntryId },
  });

  if (!entryNode) {
    entryNode = await createStreamEntryNode(teacherId, streamEntryId, topicNode.subject);
  }

  // Create the ABOUT edge (idempotent — upsertEdge increments weight on re-link)
  await upsertEdge(teacherId, entryNode.id, nodeId, 'ABOUT');

  // Refresh the topic node's weight from actual connected edges
  await recalcTopicWeight(nodeId);

  logger.info('Stream entry linked to topic node via backlink', {
    teacherId,
    topicId: nodeId,
    topicLabel: topicNode.label,
    streamEntryId,
  });

  return { success: true };
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

  // Get related stream entries (for TOPIC nodes, find entries linked via ABOUT edges)
  let relatedEntries: any[] = [];
  let linkedEntryIds: string[] = [];
  if (node.type === 'TOPIC') {
    const aboutEdges = await prisma.teachingGraphEdge.findMany({
      where: { targetId: nodeId, type: 'ABOUT' },
      include: {
        source: {
          include: { streamEntry: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    relatedEntries = aboutEdges
      .filter(e => e.source.streamEntry)
      .map(e => e.source.streamEntry!);
    linkedEntryIds = relatedEntries.map(e => e.id);
  } else if (node.type === 'STREAM_ENTRY' && node.streamEntryId) {
    const entry = await prisma.teacherStreamEntry.findUnique({
      where: { id: node.streamEntryId },
    });
    if (entry) {
      relatedEntries = [entry];
      linkedEntryIds = [entry.id];
    }
  }

  // Get related materials (for TOPIC nodes, find materials linked via ABOUT edges)
  let relatedMaterials: any[] = [];
  let linkedMaterialIds: string[] = [];
  if (node.type === 'TOPIC') {
    const aboutEdges = await prisma.teachingGraphEdge.findMany({
      where: { targetId: nodeId, type: 'ABOUT' },
      include: {
        source: {
          include: { material: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    relatedMaterials = aboutEdges
      .filter(e => e.source.material)
      .map(e => e.source.material!);
    linkedMaterialIds = relatedMaterials.map(m => m.id);
  } else if (node.type === 'MATERIAL' && node.materialId) {
    const material = await prisma.teacherMaterial.findUnique({
      where: { id: node.materialId },
    });
    if (material) {
      relatedMaterials = [material];
      linkedMaterialIds = [material.id];
    }
  }

  // Backlinks: unlinked text mentions of this topic. Only surfaced for TOPIC nodes
  // since STREAM_ENTRY/MATERIAL panels don't benefit from "also mentioned in."
  let unlinkedMentions: any[] = [];
  let unlinkedMaterialMentions: any[] = [];
  if (node.type === 'TOPIC') {
    try {
      [unlinkedMentions, unlinkedMaterialMentions] = await Promise.all([
        getUnlinkedMentions(teacherId, node.label, linkedEntryIds, 20),
        getUnlinkedMaterialMentions(teacherId, node.label, linkedMaterialIds, 10),
      ]);
    } catch (err) {
      // Non-fatal: backlinks are progressive enhancement. If the tsvector column
      // hasn't been created yet (migration not run), fall back to an empty list.
      logger.warn('Failed to fetch unlinked mentions', {
        teacherId,
        nodeId,
        error: (err as Error).message,
      });
    }
  }

  // For TOPIC nodes, compute a quiet standards coverage stat
  let standardsCoverage = null;
  if (node.type === 'TOPIC' && node.linkedStandardCodes.length > 0) {
    // Get how many total standards exist in this area
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: { preferredCurriculum: true, gradeRange: true, primarySubject: true },
    });
    if (teacher?.preferredCurriculum) {
      const totalForSubject = await curriculumAdapterService.getStandardsCount(
        teacher.preferredCurriculum,
        teacher.gradeRange || undefined,
        node.subject || teacher.primarySubject || undefined,
      );
      standardsCoverage = {
        linkedCount: node.linkedStandardCodes.length,
        totalAvailable: totalForSubject,
        codes: node.linkedStandardCodes,
      };
    }
  }

  return {
    node: {
      id: node.id,
      type: node.type,
      label: node.label,
      weight: node.weight,
      subject: node.subject,
      lastTouchedAt: node.lastTouchedAt?.toISOString() || null,
      streamEntryId: node.streamEntryId,
      materialId: node.materialId,
    },
    standardsCoverage,
    relatedEntries,
    relatedMaterials,
    unlinkedMentions,
    unlinkedMaterialMentions,
  };
}

/**
 * Get standards coverage for the teacher's curriculum.
 * Calculated by comparing TOPIC nodes' linkedStandardCodes against the full curriculum.
 */
async function getCoverage(teacherId: string): Promise<CoverageData> {
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    select: {
      preferredCurriculum: true,
      gradeRange: true,
      primarySubject: true,
    },
  });

  if (!teacher?.preferredCurriculum) {
    return {
      subjects: [],
      overall: { totalStandards: 0, coveredStandards: 0, percentage: 0 },
    };
  }

  // Collect all linkedStandardCodes from TOPIC nodes
  const topicNodes = await prisma.teachingGraphNode.findMany({
    where: { teacherId, type: 'TOPIC' },
    select: { linkedStandardCodes: true, subject: true },
  });

  const allCoveredCodes = new Set<string>();
  for (const node of topicNodes) {
    for (const code of node.linkedStandardCodes) {
      allCoveredCodes.add(code);
    }
  }

  // Get full standards for this teacher's curriculum
  const subjects = teacher.primarySubject ? [teacher.primarySubject] : [];
  const allStandards = await curriculumAdapterService.getStandardsForTeacher(
    teacher.preferredCurriculum,
    teacher.gradeRange || '',
    subjects,
  );

  // Group by subject
  const bySubject = new Map<string, { total: number; covered: number; gaps: Array<{ code: string; description: string }> }>();
  for (const std of allStandards) {
    if (!bySubject.has(std.subject)) {
      bySubject.set(std.subject, { total: 0, covered: 0, gaps: [] });
    }
    const group = bySubject.get(std.subject)!;
    group.total++;
    if (allCoveredCodes.has(std.code)) {
      group.covered++;
    } else {
      group.gaps.push({ code: std.code, description: std.description });
    }
  }

  const subjectResults = Array.from(bySubject.entries()).map(([subject, data]) => ({
    subject,
    totalStandards: data.total,
    coveredStandards: data.covered,
    percentage: data.total > 0 ? Math.round((data.covered / data.total) * 100) : 0,
    gaps: data.gaps.slice(0, 20), // Limit gaps to 20 per subject
  }));

  const totalStandards = allStandards.length;
  const coveredStandards = allCoveredCodes.size;

  return {
    subjects: subjectResults,
    overall: {
      totalStandards,
      coveredStandards: Math.min(coveredStandards, totalStandards),
      percentage: totalStandards > 0 ? Math.round((Math.min(coveredStandards, totalStandards) / totalStandards) * 100) : 0,
    },
  };
}

// ============================================
// GHOST NODES
// ============================================

export interface GhostNode {
  /** Stable ID for the ghost cluster (not a real DB row) */
  id: string;
  /** Strand / topic area name — e.g. "Working Scientifically", "Light" */
  label: string;
  /** Subject the strand belongs to (for canvas colouring) */
  subject: string;
  /** How many standards in this strand haven't been touched yet */
  standardCount: number;
  /** The individual standards, for the detail panel */
  standards: Array<{
    code: string;
    description: string;
  }>;
}

/**
 * Compute "ghost nodes" — strand-grouped curriculum gaps that the teacher
 * has never mentioned in a stream entry or attached to a real topic node.
 *
 * These are rendered on the graph as faint, dashed circles ("unexplored
 * topics") rather than stacking in the stream as warning nudges. Discovery
 * by exploration, not scolding.
 *
 * Reuses the same strand-grouping logic as the original curriculum gap
 * nudge generator so both surfaces stay consistent.
 */
async function getGhostNodes(teacherId: string): Promise<GhostNode[]> {
  // Get teacher's curriculum config
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    select: { preferredCurriculum: true, gradeRange: true, primarySubject: true },
  });

  if (!teacher?.preferredCurriculum || !teacher?.primarySubject) return [];

  // Collect linkedStandardCodes from the teacher's existing topic nodes.
  // Anything in this set has already been "touched" and should NOT appear
  // as a ghost.
  const topicNodes = await prisma.teachingGraphNode.findMany({
    where: { teacherId, type: 'TOPIC' },
    select: { label: true, linkedStandardCodes: true },
  });

  const coveredCodes = new Set<string>();
  for (const node of topicNodes) {
    for (const code of node.linkedStandardCodes) {
      coveredCodes.add(code);
    }
  }

  // Pull the full curriculum for this teacher
  const allStandards = await curriculumAdapterService.getStandardsForTeacher(
    teacher.preferredCurriculum,
    teacher.gradeRange || '',
    [teacher.primarySubject],
  );

  // Group uncovered standards by strand (e.g., "Working Scientifically",
  // "Light"). Strand is already on every LearningStandard row, so this is
  // just a bucket sort — no clustering heuristics needed.
  const clusters = new Map<string, GhostNode>();
  for (const std of allStandards) {
    if (coveredCodes.has(std.code)) continue;

    const strandKey = std.strand || std.subject || 'Uncategorized';
    const existing = clusters.get(strandKey);

    const standardEntry = {
      code: std.code,
      description: std.description,
    };

    if (existing) {
      existing.standards.push(standardEntry);
      existing.standardCount += 1;
    } else {
      clusters.set(strandKey, {
        id: `ghost:${strandKey}`,
        label: strandKey,
        subject: std.subject,
        standardCount: 1,
        standards: [standardEntry],
      });
    }
  }

  // Return sorted by standard count (biggest gaps first) so the densest
  // untouched areas render most prominently on the graph periphery.
  return Array.from(clusters.values()).sort(
    (a, b) => b.standardCount - a.standardCount,
  );
}

/**
 * Get summary statistics for the graph.
 */
async function getStats(teacherId: string) {
  const validTypes = ['TOPIC', 'STREAM_ENTRY', 'MATERIAL'] as const;

  const byType = await prisma.teachingGraphNode.groupBy({
    by: ['type'],
    where: { teacherId, type: { in: [...validTypes] } },
    _count: true,
  });

  const typeMap = Object.fromEntries(byType.map(t => [t.type, t._count]));

  const uniqueSubjects = await prisma.teachingGraphNode.findMany({
    where: { teacherId, type: { in: [...validTypes] }, subject: { not: null } },
    select: { subject: true },
    distinct: ['subject'],
  });

  return {
    topics: typeMap['TOPIC'] || 0,
    notes: typeMap['STREAM_ENTRY'] || 0,
    materials: typeMap['MATERIAL'] || 0,
    subjects: uniqueSubjects.length,
  };
}

// ============================================
// EXPORT
// ============================================

export const teachingGraphService = {
  // Node/edge operations
  upsertTopicNode,
  createStreamEntryNode,
  createMaterialNode,
  upsertEdge,
  recalcTopicWeight,
  // Stream processing
  processStreamEntry,
  // Material processing
  processMaterial,
  // Curriculum metadata (invisible seeding)
  seedCurriculumMetadata,
  // Queries
  getFullGraph,
  getNodeDetail,
  getCoverage,
  getStats,
  getGhostNodes,
  // Backlinks
  getUnlinkedMentions,
  getUnlinkedMaterialMentions,
  linkEntryToNode,
};
