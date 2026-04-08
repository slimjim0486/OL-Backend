// Context Assembler Service — Reads memory layers and formats into Gemini prompt context
import {
  TeacherAgent,
  TeacherStyleProfile,
  ClassroomContext,
  CurriculumState,
  AgentInteraction,
  AgentInteractionType,
} from '@prisma/client';
import { agentMemoryService, AgentMemorySnapshot } from './agentMemoryService.js';
import { getCurriculumConfig } from '../../config/curricula.js';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

// ============================================
// TYPES
// ============================================

export type TaskType =
  | 'CHAT'
  | 'CONTENT_GENERATION'
  | 'PLANNING'
  | 'QUIZ_GENERATION'
  | 'FLASHCARD_GENERATION'
  | 'SUB_PLAN'
  | 'IEP'
  | 'WEEKLY_PREP'
  | 'PARENT_COMMUNICATION'
  | 'REPORT_COMMENTS'
  | 'CLASSROOM_MANAGEMENT';

export interface AssembledContext {
  systemPrompt: string;
  identityContext: string;
  classroomContext: string;
  curriculumContext: string;
  styleContext: string;
  recentHistoryContext: string;
  graphContext: string;
}

interface AssemblyOptions {
  subject?: string;
  classroomId?: string;
  maxCharsPerSection?: number;
}

// Character limits per section (to stay within token budget)
const SECTION_LIMITS = {
  identity: 800,
  classroom: 1800,
  // Bumped from 1000 → 1800 to fit 5 standard descriptions (~600 chars)
  // on top of the existing curriculum state summary.
  curriculum: 1800,
  style: 600,
  history: 1500,
};

// ============================================
// CONTEXT ASSEMBLY
// ============================================

async function assembleContext(
  teacherId: string,
  taskType: TaskType,
  opts?: AssemblyOptions
): Promise<AssembledContext> {
  const snapshot = await agentMemoryService.getFullMemorySnapshot(teacherId);
  if (!snapshot) {
    return buildEmptyContext();
  }

  // Pre-load curriculum standard descriptions for the recent "standardsTaught"
  // codes across the teacher's relevant curriculum states. This lets
  // buildCurriculumContext embed the actual learning-objective text in the
  // prompt instead of just the notation codes. Async prefetch here keeps
  // buildCurriculumContext itself synchronous and side-effect free.
  const standardDescriptions = await loadStandardDescriptionsForStates(
    snapshot.curriculumStates,
    opts?.subject
  );

  const context = buildContextFromSnapshot(
    snapshot,
    taskType,
    opts,
    standardDescriptions
  );

  // Layer 6: Teaching Graph Context (async, non-fatal)
  try {
    const graphCtx = await buildGraphContext(teacherId);
    if (graphCtx) {
      context.graphContext = graphCtx;
      // Re-build system prompt with graph context included
      context.systemPrompt += `\n\n=== TEACHING GRAPH ===\n${graphCtx}`;
    }
  } catch (err) {
    logger.warn('Failed to build graph context', { teacherId, error: (err as Error).message });
  }

  return context;
}

/**
 * Look up the actual learning-objective text for the codes in each relevant
 * curriculum state's standardsTaught. Returns a Map<notation, description> so
 * buildCurriculumContext can enrich its output without becoming async.
 * Caps lookup to the first 5 codes per state and at most the first 3 states,
 * matching buildCurriculumContext's own slicing behavior.
 */
async function loadStandardDescriptionsForStates(
  states: CurriculumState[],
  subject?: string
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (!states.length) return map;

  // Mirror buildCurriculumContext's "3 relevant states, 5 codes each" slicing
  let relevant = states;
  if (subject) {
    const filtered = states.filter((s) => s.subject === subject);
    if (filtered.length) relevant = filtered;
  }

  const codesToFetch = new Set<string>();
  for (const state of relevant.slice(0, 3)) {
    if (state.standardsTaught?.length) {
      for (const code of state.standardsTaught.slice(0, 5)) {
        if (code) codesToFetch.add(code);
      }
    }
  }
  if (codesToFetch.size === 0) return map;

  try {
    const rows = await prisma.learningStandard.findMany({
      where: { notation: { in: [...codesToFetch] } },
      select: { notation: true, description: true },
    });
    for (const row of rows) {
      if (row.notation) map.set(row.notation, row.description);
    }
  } catch (err) {
    logger.warn('Failed to load standard descriptions for curriculum context', {
      codes: codesToFetch.size,
      error: (err as Error).message,
    });
  }

  return map;
}

async function assembleChatContext(
  teacherId: string,
  _sessionId?: string
): Promise<AssembledContext> {
  return assembleContext(teacherId, 'CHAT');
}

function buildContextFromSnapshot(
  snapshot: AgentMemorySnapshot,
  taskType: TaskType,
  opts?: AssemblyOptions,
  standardDescriptions?: Map<string, string>
): AssembledContext {
  const identityContext = buildIdentityContext(snapshot.agent);
  const classroomContext = buildClassroomContext(
    snapshot.classrooms,
    taskType,
    opts?.subject,
    opts?.classroomId
  );
  const curriculumContext = buildCurriculumContext(
    snapshot.curriculumStates,
    snapshot.agent,
    taskType,
    opts?.subject,
    standardDescriptions
  );
  const styleContext = buildStyleContext(snapshot.styleProfile, taskType);
  const recentHistoryContext = buildHistoryContext(
    snapshot.recentInteractions,
    taskType
  );

  const systemPrompt = buildSystemPrompt(
    identityContext,
    classroomContext,
    curriculumContext,
    styleContext,
    recentHistoryContext,
    taskType
  );

  return {
    systemPrompt,
    identityContext,
    classroomContext,
    curriculumContext,
    styleContext,
    recentHistoryContext,
    graphContext: '', // Populated async in assembleContext()
  };
}

// ============================================
// IDENTITY CONTEXT (Layer 1)
// ============================================

function buildIdentityContext(agent: TeacherAgent): string {
  const parts: string[] = [];

  if (agent.schoolName) parts.push(`School: ${agent.schoolName}`);
  if (agent.schoolType) parts.push(`Type: ${agent.schoolType}`);
  if (agent.gradesTaught?.length) parts.push(`Grades: ${agent.gradesTaught.join(', ')}`);
  if (agent.subjectsTaught?.length) parts.push(`Subjects: ${agent.subjectsTaught.join(', ')}`);
  if (agent.curriculumType) {
    const currConfig = getCurriculumConfig(agent.curriculumType);
    parts.push(`Curriculum: ${currConfig?.displayName || agent.curriculumType}`);
  }
  if (agent.yearsExperience != null) parts.push(`Experience: ${agent.yearsExperience} years`);
  if (agent.teachingPhilosophy) {
    parts.push(`Philosophy: ${truncate(agent.teachingPhilosophy, 200)}`);
  }
  if (agent.planningAutonomy) {
    parts.push('Planning autonomy: planner');
  }
  if (agent.agentTone) parts.push(`Preferred content voice/tone: ${agent.agentTone.toLowerCase()} — apply this to all generated lesson text`);
  if ((agent as any).managementApproach) parts.push(`Classroom management approach: ${(agent as any).managementApproach}`);

  return parts.join('\n') || 'No teacher identity set up yet.';
}

// ============================================
// CLASSROOM CONTEXT (Layer 3)
// ============================================

function buildClassroomContext(
  classrooms: ClassroomContext[],
  taskType: TaskType,
  subject?: string,
  classroomId?: string
): string {
  if (!classrooms.length) return '';

  // For content generation, filter to relevant classroom
  let relevant = classrooms;
  if (classroomId) {
    relevant = classrooms.filter((c) => c.id === classroomId);
  } else if (taskType === 'WEEKLY_PREP') {
    // For weekly prep, include ALL classrooms (we need the full picture)
    relevant = classrooms;
  } else if (subject && (taskType === 'CONTENT_GENERATION' || taskType === 'QUIZ_GENERATION')) {
    relevant = classrooms.filter(
      (c) => c.subject === subject || !c.subject
    );
  }

  if (!relevant.length) relevant = classrooms;

  const parts: string[] = [];
  for (const cr of relevant.slice(0, 5)) {
    const lines: string[] = [`Classroom: ${cr.name}`];
    if (cr.gradeLevel) lines.push(`  Grade: ${cr.gradeLevel}`);
    if (cr.subject) lines.push(`  Subject: ${cr.subject}`);
    if (cr.studentCount) lines.push(`  Students: ${cr.studentCount} — consider this for activity groupings`);

    const groups = cr.studentGroups as any[];
    if (Array.isArray(groups) && groups.length) {
      const groupSummary = groups
        .map((g: any) => `${g.name || 'Group'}(${g.level || 'mixed'}, ${g.count || '?'} students)`)
        .join(', ');
      lines.push(`  Groups: ${groupSummary}`);
    }

    // Classroom management profile
    const mgmt = (cr as any).managementProfile as Record<string, any> | null;
    if (mgmt && typeof mgmt === 'object' && Object.keys(mgmt).length > 0) {
      lines.push('  Management:');
      if (Array.isArray(mgmt.attentionSignals) && mgmt.attentionSignals.length) {
        lines.push(`    Attention signals: ${mgmt.attentionSignals.join(', ')}`);
      }
      if (Array.isArray(mgmt.transitionStrategies) && mgmt.transitionStrategies.length) {
        lines.push(`    Transition strategies: ${mgmt.transitionStrategies.join(', ')}`);
      }
      if (mgmt.pacingPreferences) {
        const pacing = mgmt.pacingPreferences;
        const pacingParts: string[] = [];
        if (pacing.maxLectureMinutes) pacingParts.push(`max lecture ${pacing.maxLectureMinutes} min`);
        if (pacing.movementBreakFrequency) pacingParts.push(`movement breaks every ${pacing.movementBreakFrequency} min`);
        if (pacing.preferredActivityLength) pacingParts.push(`activities ~${pacing.preferredActivityLength} min`);
        if (pacingParts.length) lines.push(`    Pacing: ${pacingParts.join(', ')}`);
      }
      if (Array.isArray(mgmt.challengeAreas) && mgmt.challengeAreas.length) {
        lines.push(`    Challenges: ${mgmt.challengeAreas.join(', ')}`);
      }
      if (Array.isArray(mgmt.successStrategies) && mgmt.successStrategies.length) {
        lines.push(`    Strategies that work: ${mgmt.successStrategies.join(', ')}`);
      }
      if (Array.isArray(mgmt.accommodations) && mgmt.accommodations.length) {
        lines.push(`    Accommodations: ${mgmt.accommodations.join(', ')}`);
      }
      if (mgmt.routines && typeof mgmt.routines === 'object') {
        const routineEntries = Object.entries(mgmt.routines).filter(([, v]) => v);
        if (routineEntries.length) {
          const routineSummary = routineEntries.map(([k, v]) => `${k}: ${v}`).join('; ');
          lines.push(`    Routines: ${routineSummary}`);
        }
      }
    }

    parts.push(lines.join('\n'));
  }

  return truncate(parts.join('\n\n'), SECTION_LIMITS.classroom);
}

// ============================================
// CURRICULUM CONTEXT (Layer 4)
// ============================================

function buildCurriculumContext(
  states: CurriculumState[],
  agent: TeacherAgent,
  taskType: TaskType,
  subject?: string,
  standardDescriptions?: Map<string, string>
): string {
  if (!states.length) return '';

  // Filter to relevant subject for content tasks
  let relevant = states;
  if (subject) {
    relevant = states.filter((s) => s.subject === subject);
  }
  if (!relevant.length) relevant = states;

  const parts: string[] = [];
  for (const state of relevant.slice(0, 3)) {
    const lines: string[] = [`${state.subject} (${state.schoolYear})`];
    if (state.gradeLevel) lines.push(`  Grade: ${state.gradeLevel}`);
    lines.push(`  Current week: ${state.currentWeek}`);

    const topicProgress = state.topicProgress as any;
    if (topicProgress && typeof topicProgress === 'object') {
      if (typeof topicProgress.currentTopic === 'string' && topicProgress.currentTopic.trim()) {
        lines.push(`  Current topic: ${truncate(topicProgress.currentTopic.trim(), 120)}`);
      }
      if (Array.isArray(topicProgress.coveredTopics) && topicProgress.coveredTopics.length) {
        const covered = topicProgress.coveredTopics.filter(Boolean).slice(0, 5);
        if (covered.length) {
          lines.push(`  Covered topics (${topicProgress.coveredTopics.length}): ${covered.join(', ')}${topicProgress.coveredTopics.length > 5 ? '...' : ''}`);
        }
      }
      if (Array.isArray(topicProgress.upNextTopics) && topicProgress.upNextTopics.length) {
        const upNext = topicProgress.upNextTopics.filter(Boolean).slice(0, 4);
        if (upNext.length) {
          lines.push(`  Up next: ${upNext.join(', ')}${topicProgress.upNextTopics.length > 4 ? '...' : ''}`);
        }
      }
    }

    if (state.standardsTaught?.length) {
      // Prefer enriched descriptions when the pre-loaded map is available.
      const recentCodes = state.standardsTaught.slice(0, 5);
      const enrichedLines: string[] = [];
      if (standardDescriptions && standardDescriptions.size > 0) {
        for (const code of recentCodes) {
          const description = standardDescriptions.get(code);
          if (description) {
            enrichedLines.push(`    - ${code}: ${truncate(description, 140)}`);
          }
        }
      }
      if (enrichedLines.length > 0) {
        lines.push(
          `  Standards covered (${state.standardsTaught.length} total${state.standardsTaught.length > 5 ? ', showing ' + enrichedLines.length : ''}):`
        );
        for (const el of enrichedLines) lines.push(el);
      } else {
        // Fallback: codes-only when descriptions unavailable (empty table, old codes, etc.)
        lines.push(`  Standards taught (${state.standardsTaught.length}): ${recentCodes.join(', ')}${state.standardsTaught.length > 5 ? '...' : ''}`);
      }
    }
    if (state.standardsAssessed?.length) {
      lines.push(`  Standards assessed: ${state.standardsAssessed.length}`);
    }

    const gaps = state.identifiedGaps as any[];
    if (Array.isArray(gaps) && gaps.length) {
      const gapSummary = gaps.slice(0, 3).map((g: any) => g.description || g.standardId).join('; ');
      lines.push(`  Gaps: ${gapSummary}`);
    }

    parts.push(lines.join('\n'));
  }

  return truncate(parts.join('\n\n'), SECTION_LIMITS.curriculum);
}

// ============================================
// STYLE CONTEXT (Layer 2)
// ============================================

// Map task types to content type keys used in _byContentType
const TASK_TO_CONTENT_TYPE: Partial<Record<TaskType, string>> = {
  QUIZ_GENERATION: 'quiz',
  FLASHCARD_GENERATION: 'flashcard',
  CONTENT_GENERATION: 'lesson',
  SUB_PLAN: 'sub_plan',
  IEP: 'iep',
  WEEKLY_PREP: 'lesson',
};

// Natural language labels for preference dimensions
const DIMENSION_LABELS: Record<string, Record<string, string>> = {
  lessonLength: { shorter: 'concise, shorter content', longer: 'detailed, longer content' },
  detailLevel: { more_detail: 'high detail with thorough explanations', less_detail: 'streamlined with less detail' },
  vocabularyLevel: { more_advanced: 'more advanced vocabulary', simpler: 'simpler, accessible vocabulary' },
  scaffolding: { more_scaffolding: 'heavy scaffolding with examples and steps', less_scaffolding: 'lighter scaffolding' },
  formality: { more_formal: 'formal, professional tone', more_casual: 'casual, conversational tone' },
  questionCount: { more_questions: 'more questions', fewer_questions: 'fewer questions' },
  structurePreference: { more_structured: 'well-structured with headings, lists, and tables', less_structured: 'flowing prose with minimal structure' },
};

function buildStyleContext(profile: TeacherStyleProfile | null, taskType?: TaskType): string {
  if (!profile) return '';

  const prefs = (profile.preferences as Record<string, any>) || {};
  const scores = (profile.confidenceScores as Record<string, number>) || {};

  if (Object.keys(prefs).length === 0) return '';

  const parts: string[] = [];

  // Build natural language global preferences
  const globalDescs: string[] = [];
  for (const [key, value] of Object.entries(prefs)) {
    if (key.startsWith('_')) continue; // Skip internal keys like _byContentType
    const confidence = scores[key] || 0;
    if (confidence >= 0.5) {
      const label = DIMENSION_LABELS[key]?.[value as string] || `${formatPreferenceKey(key)}: ${value}`;
      globalDescs.push(label);
    }
  }

  if (globalDescs.length > 0) {
    parts.push(`This teacher prefers ${globalDescs.join(', ')}.`);
  }

  // Content-type-specific preferences
  const byContentType = prefs._byContentType as Record<string, Record<string, string>> | undefined;
  if (byContentType && Object.keys(byContentType).length > 0) {
    // If taskType maps to a content type, show those prefs prominently
    const relevantCT = taskType ? TASK_TO_CONTENT_TYPE[taskType] : undefined;

    if (relevantCT && byContentType[relevantCT]) {
      const ctPrefs = byContentType[relevantCT];
      const ctDescs: string[] = [];
      for (const [key, value] of Object.entries(ctPrefs)) {
        const label = DIMENSION_LABELS[key]?.[value] || `${formatPreferenceKey(key)}: ${value}`;
        ctDescs.push(label);
      }
      if (ctDescs.length > 0) {
        parts.push(`For ${relevantCT}s specifically, they prefer ${ctDescs.join(', ')}.`);
      }
    }

    // Show other content type prefs briefly
    for (const [ct, ctPrefs] of Object.entries(byContentType)) {
      if (ct === relevantCT) continue;
      const ctDescs: string[] = [];
      for (const [key, value] of Object.entries(ctPrefs)) {
        const label = DIMENSION_LABELS[key]?.[value] || `${formatPreferenceKey(key)}: ${value}`;
        ctDescs.push(label);
      }
      if (ctDescs.length > 0) {
        parts.push(`For ${ct}s: ${ctDescs.join(', ')}.`);
      }
    }
  }

  if (profile.totalApprovals + profile.totalEdits + profile.totalRegenerations > 0) {
    parts.push(`(Based on ${profile.totalApprovals} approvals, ${profile.totalEdits} edits, ${profile.totalRegenerations} regenerations)`);
  }

  return truncate(parts.join('\n'), SECTION_LIMITS.style);
}

function formatPreferenceKey(key: string): string {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()).trim();
}

// ============================================
// HISTORY CONTEXT (Layer 5)
// ============================================

function buildHistoryContext(
  interactions: AgentInteraction[],
  taskType: TaskType
): string {
  if (!interactions.length) return '';

  // For content tasks, show fewer but more relevant interactions
  const limit = taskType === 'CHAT' ? 10 : 5;
  const relevant = interactions.slice(0, limit);

  const parts: string[] = ['Recent activity:'];
  for (const interaction of relevant) {
    const date = new Date(interaction.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const feedback = interaction.wasApproved
      ? ' [approved]'
      : interaction.wasEdited
        ? ' [edited]'
        : interaction.wasRegenerated
          ? ' [regenerated]'
          : '';
    parts.push(
      `- ${date}: ${interaction.type}${interaction.outputType ? ` → ${interaction.outputType}` : ''}${interaction.summary ? `: ${truncate(interaction.summary, 80)}` : ''}${feedback}`
    );
  }

  return truncate(parts.join('\n'), SECTION_LIMITS.history);
}

// ============================================
// SYSTEM PROMPT BUILDER
// ============================================

function buildSystemPrompt(
  identity: string,
  classroom: string,
  curriculum: string,
  style: string,
  history: string,
  taskType: TaskType
): string {
  const sections: string[] = [];

  sections.push(`You are an AI teaching assistant for Orbit Learn. You help teachers create engaging, standards-aligned educational content and provide classroom support.`);

  if (taskType === 'CHAT') {
    sections.push(`You are in a conversational chat with the teacher. Be helpful, contextual, and proactive. If the teacher's message implies content creation (e.g., "make me a quiz"), indicate the tool you'd use. Otherwise, respond conversationally with teaching expertise.`);
    sections.push(`If the teacher asks to plan the week or mentions calendar, schedule, planner, or weekly prep, keep the conversation in chat. Help them sequence the week and then offer to generate specific materials one item at a time.`);
    sections.push(
      `If the teacher message is short/ambiguous (examples: "sure", "no thanks", "2", "checklist"), treat it as a reply to the recent conversation. Infer what they likely mean based on context. If it's still ambiguous, ask ONE clarifying question and offer 2-3 concrete options they can pick from.`
    );
  } else if (taskType === 'CONTENT_GENERATION' || taskType === 'QUIZ_GENERATION' || taskType === 'FLASHCARD_GENERATION') {
    sections.push(`You are generating educational content. Use the teacher's classroom context, curriculum state, and style preferences to create personalized, relevant content that matches their teaching voice and classroom needs.`);
  } else if (taskType === 'WEEKLY_PREP') {
    sections.push(`You are generating a comprehensive weekly prep package. Plan materials for ALL subjects the teacher teaches, across all 5 school days (Mon-Fri). Consider the full curriculum state, pacing, student groups, and identified gaps. Create a progressive week where concepts build from Monday through Friday.`);
  } else if (taskType === 'PLANNING') {
    sections.push(`You are helping the teacher plan lessons and activities. Consider their full curriculum state, pacing, and identified gaps.`);
  }

  if (identity) {
    sections.push(`=== TEACHER PROFILE ===\n${identity}`);
  }
  if (classroom) {
    sections.push(`=== CLASSROOM CONTEXT ===\n${classroom}`);
  }
  if (curriculum) {
    sections.push(`=== CURRICULUM STATE ===\n${curriculum}`);
  }
  if (style) {
    const styleLabel = (taskType === 'CONTENT_GENERATION' || taskType === 'QUIZ_GENERATION' || taskType === 'FLASHCARD_GENERATION')
      ? '=== CONTENT STYLE (IMPORTANT — Apply to all generated content) ==='
      : '=== STYLE PREFERENCES ===';
    sections.push(`${styleLabel}\n${style}`);
  }
  if (history) {
    sections.push(`=== ${history}`);
  }

  return sections.join('\n\n');
}

// ============================================
// GRAPH CONTEXT (Layer 6 — Teaching Intelligence)
// ============================================

async function buildGraphContext(teacherId: string): Promise<string> {
  // Get top TOPIC nodes by weight (most-discussed topics)
  const topTopics = await prisma.teachingGraphNode.findMany({
    where: { teacherId, type: 'TOPIC', weight: { gt: 0 } },
    orderBy: { weight: 'desc' },
    take: 10,
    select: { label: true, weight: true, subject: true, linkedStandardCodes: true },
  });

  if (topTopics.length === 0) return '';

  // Get recently active topic nodes
  const recentTopics = await prisma.teachingGraphNode.findMany({
    where: { teacherId, type: 'TOPIC', lastTouchedAt: { not: null } },
    orderBy: { lastTouchedAt: 'desc' },
    take: 5,
    select: { label: true, subject: true },
  });

  // Calculate coverage for gap context
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    select: { preferredCurriculum: true, gradeRange: true, primarySubject: true },
  });

  const parts: string[] = [];

  // Most-discussed topics (high weight = many stream entries + materials)
  const heavy = topTopics.filter(n => n.weight >= 8);
  if (heavy.length > 0) {
    parts.push(`Deeply explored topics: ${heavy.map(n => n.label).join(', ')}`);
  }

  const moderate = topTopics.filter(n => n.weight >= 3 && n.weight < 8);
  if (moderate.length > 0) {
    parts.push(`Well-covered topics: ${moderate.map(n => n.label).join(', ')}`);
  }

  const light = topTopics.filter(n => n.weight > 0 && n.weight < 3);
  if (light.length > 0) {
    parts.push(`Briefly mentioned: ${light.map(n => n.label).join(', ')}`);
  }

  // Recent teaching activity
  if (recentTopics.length > 0) {
    parts.push(`Recently active: ${recentTopics.map(n => n.label).join(', ')}`);
  }

  // Coverage summary (invisible curriculum metadata)
  if (teacher?.preferredCurriculum) {
    const allCoveredCodes = new Set<string>();
    for (const topic of topTopics) {
      for (const code of topic.linkedStandardCodes) {
        allCoveredCodes.add(code);
      }
    }
    if (allCoveredCodes.size > 0) {
      parts.push(`Standards touched: ${allCoveredCodes.size} curriculum standards linked to teaching topics`);
    }
  }

  return truncate(parts.join('\n'), 1200);
}

// ============================================
// UTILITY
// ============================================

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

function buildEmptyContext(): AssembledContext {
  return {
    systemPrompt:
      'You are an AI teaching assistant for Orbit Learn. The teacher has not completed setup yet. Help them get started by asking about their school, subjects, and grades.',
    identityContext: '',
    classroomContext: '',
    curriculumContext: '',
    styleContext: '',
    recentHistoryContext: '',
    graphContext: '',
  };
}

// ============================================
// CONTENT INJECTION HELPERS
// ============================================

function buildAdditionalContextString(context: AssembledContext): string {
  const parts: string[] = [];

  if (context.identityContext) {
    parts.push(`[Teacher Context]\n${context.identityContext}`);
  }
  if (context.classroomContext) {
    parts.push(`[Classroom Context]\n${context.classroomContext}`);
  }
  if (context.curriculumContext) {
    parts.push(`[Curriculum State]\n${context.curriculumContext}`);
  }
  if (context.styleContext) {
    parts.push(`[Style Preferences]\n${context.styleContext}`);
  }

  return parts.join('\n\n');
}

// ============================================
// EXPORTS
// ============================================

export const contextAssemblerService = {
  assembleContext,
  assembleChatContext,
  buildSystemPrompt: (identity: string, classroom: string, curriculum: string, style: string, history: string, taskType: TaskType) =>
    buildSystemPrompt(identity, classroom, curriculum, style, history, taskType),
  buildAdditionalContextString,
};
