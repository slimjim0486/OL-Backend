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
  | 'REPORT_COMMENTS';

export interface AssembledContext {
  systemPrompt: string;
  identityContext: string;
  classroomContext: string;
  curriculumContext: string;
  styleContext: string;
  recentHistoryContext: string;
}

interface AssemblyOptions {
  subject?: string;
  classroomId?: string;
  maxCharsPerSection?: number;
}

// Character limits per section (to stay within token budget)
const SECTION_LIMITS = {
  identity: 800,
  classroom: 1200,
  curriculum: 1000,
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
  return buildContextFromSnapshot(snapshot, taskType, opts);
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
  opts?: AssemblyOptions
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
    opts?.subject
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
  subject?: string
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
      lines.push(`  Standards taught (${state.standardsTaught.length}): ${state.standardsTaught.slice(0, 5).join(', ')}${state.standardsTaught.length > 5 ? '...' : ''}`);
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
