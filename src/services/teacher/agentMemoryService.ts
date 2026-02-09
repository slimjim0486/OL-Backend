// Agent Memory Service — CRUD for the 5-layer teacher AI assistant memory
import {
  TeacherAgent,
  TeacherStyleProfile,
  ClassroomContext,
  CurriculumState,
  AgentInteraction,
  AgentSetupStatus,
  AgentInteractionType,
  AgentTone,
  Subject,
  CurriculumType,
  Prisma,
} from '@prisma/client';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

export type OnboardingResetFromStep = 'identity' | 'classroom' | 'curriculum';

// ============================================
// TYPES
// ============================================

export interface AgentIdentityUpdate {
  schoolName?: string;
  schoolType?: string;
  gradesTaught?: string[];
  subjectsTaught?: Subject[];
  curriculumType?: CurriculumType;
  yearsExperience?: number;
  teachingPhilosophy?: string;
  preferredPlanningDay?: string;
  preferredDeliveryTime?: string;
  timezone?: string;
  agentTone?: AgentTone;
}

export interface ClassroomContextInput {
  id?: string;
  name: string;
  gradeLevel?: string;
  subject?: Subject;
  studentCount?: number;
  studentGroups?: any;
  schedule?: any;
  resources?: any;
  isActive?: boolean;
}

export interface CurriculumStateInput {
  subject: Subject;
  gradeLevel?: string;
  schoolYear: string;
  standardsTaught?: string[];
  standardsAssessed?: string[];
  standardsSkipped?: string[];
  pacingGuide?: any;
  currentWeek?: number;
  topicProgress?: any;
  identifiedGaps?: any;
}

export interface InteractionInput {
  type: AgentInteractionType;
  summary?: string;
  input?: string;
  outputType?: string;
  outputId?: string;
  wasApproved?: boolean;
  wasEdited?: boolean;
  wasRegenerated?: boolean;
  tokensUsed?: number;
  modelUsed?: string;
  contextSnapshot?: any;
}

export interface StyleSignal {
  dimension: string; // e.g., "lessonLength", "detailLevel"
  value: string; // e.g., "detailed", "concise"
  source: string; // e.g., "edit", "approval", "regeneration"
  timestamp: string;
  contentType?: string; // e.g., "lesson", "quiz", "flashcard", "sub_plan"
  subject?: string; // e.g., "MATH", "ELA"
}

export interface AgentMemorySnapshot {
  agent: TeacherAgent;
  styleProfile: TeacherStyleProfile | null;
  classrooms: ClassroomContext[];
  curriculumStates: CurriculumState[];
  recentInteractions: AgentInteraction[];
}

export interface TeacherNameUpdate {
  firstName?: string;
  lastName?: string;
}

// ============================================
// LAYER 1: AGENT IDENTITY
// ============================================

async function getOrCreateAgent(teacherId: string): Promise<TeacherAgent> {
  const existing = await prisma.teacherAgent.findUnique({
    where: { teacherId },
  });
  if (existing) return existing;

  // Pre-populate from Teacher record if possible
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    select: {
      schoolName: true,
      primarySubject: true,
      preferredCurriculum: true,
      preferredGradeRange: true,
    },
  });

  const agent = await prisma.teacherAgent.create({
    data: {
      teacherId,
      schoolName: teacher?.schoolName,
      curriculumType: teacher?.preferredCurriculum,
      subjectsTaught: teacher?.primarySubject ? [teacher.primarySubject] : [],
      gradesTaught: teacher?.preferredGradeRange ? [teacher.preferredGradeRange] : [],
    },
  });

  // Create empty style profile
  await prisma.teacherStyleProfile.create({
    data: { agentId: agent.id },
  });

  logger.info('Created TeacherAgent', { teacherId, agentId: agent.id });
  return agent;
}

async function getAgent(teacherId: string): Promise<TeacherAgent | null> {
  return prisma.teacherAgent.findUnique({
    where: { teacherId },
    include: {
      styleProfile: true,
      classrooms: { where: { isActive: true } },
      curriculumStates: true,
    },
  });
}

async function updateIdentity(
  teacherId: string,
  data: AgentIdentityUpdate
): Promise<TeacherAgent> {
  return prisma.teacherAgent.update({
    where: { teacherId },
    data,
  });
}

async function completeSetupStep(
  teacherId: string,
  step: AgentSetupStatus
): Promise<TeacherAgent> {
  const updateData: Prisma.TeacherAgentUpdateInput = {
    setupStatus: step,
  };
  if (step === AgentSetupStatus.FULLY_SETUP) {
    updateData.onboardingComplete = true;
  }
  return prisma.teacherAgent.update({
    where: { teacherId },
    data: updateData,
  });
}

async function resetOnboarding(
  teacherId: string,
  fromStep: OnboardingResetFromStep = 'identity'
): Promise<TeacherAgent> {
  const agent = await getOrCreateAgent(teacherId);

  // Resetting should not delete memory by default; it just re-opens the onboarding gate.
  // Map the desired starting step to the status *before* that step begins.
  const setupStatus =
    fromStep === 'identity'
      ? AgentSetupStatus.NOT_STARTED
      : fromStep === 'classroom'
        ? AgentSetupStatus.IDENTITY_COMPLETE
        : AgentSetupStatus.CLASSROOM_COMPLETE; // fromStep === 'curriculum'

  return prisma.teacherAgent.update({
    where: { id: agent.id },
    data: {
      setupStatus,
      onboardingComplete: false,
    },
  });
}

async function updateTeacherNameIfBlank(
  teacherId: string,
  data: TeacherNameUpdate
): Promise<void> {
  const nextFirst = typeof data.firstName === 'string' ? data.firstName.trim() : '';
  const nextLast = typeof data.lastName === 'string' ? data.lastName.trim() : '';
  if (!nextFirst && !nextLast) return;

  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    select: { firstName: true, lastName: true },
  });
  if (!teacher) return;

  // Only fill missing values to avoid accidentally overwriting a verified profile.
  const update: Record<string, string> = {};
  if (!teacher.firstName && nextFirst) update.firstName = nextFirst;
  if (!teacher.lastName && nextLast) update.lastName = nextLast;
  if (!Object.keys(update).length) return;

  await prisma.teacher.update({
    where: { id: teacherId },
    data: update,
  });
}

// ============================================
// LAYER 2: STYLE PROFILE
// ============================================

async function getStyleProfile(agentId: string): Promise<TeacherStyleProfile | null> {
  return prisma.teacherStyleProfile.findUnique({
    where: { agentId },
  });
}

async function recordStyleSignal(agentId: string, signal: StyleSignal): Promise<void> {
  const profile = await prisma.teacherStyleProfile.findUnique({
    where: { agentId },
  });
  if (!profile) return;

  const signals = (profile.styleSignals as unknown as StyleSignal[]) || [];
  signals.push(signal);
  // Keep rolling window of last 100 signals
  const trimmed = signals.slice(-100);

  // Update counters based on signal source
  const counterUpdate: Prisma.TeacherStyleProfileUpdateInput = {
    styleSignals: trimmed as any,
  };
  if (signal.source === 'approval') {
    counterUpdate.totalApprovals = { increment: 1 };
  } else if (signal.source === 'edit') {
    counterUpdate.totalEdits = { increment: 1 };
  } else if (signal.source === 'regeneration') {
    counterUpdate.totalRegenerations = { increment: 1 };
  }

  await prisma.teacherStyleProfile.update({
    where: { agentId },
    data: counterUpdate,
  });
}

async function getHighConfidencePreferences(
  agentId: string,
  threshold = 0.6
): Promise<Record<string, any>> {
  const profile = await prisma.teacherStyleProfile.findUnique({
    where: { agentId },
  });
  if (!profile) return {};

  const preferences = (profile.preferences as Record<string, any>) || {};
  const confidenceScores = (profile.confidenceScores as Record<string, number>) || {};
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(preferences)) {
    if ((confidenceScores[key] || 0) >= threshold) {
      result[key] = value;
    }
  }
  return result;
}

async function updateStylePreferences(
  agentId: string,
  preferences: Record<string, any>,
  confidenceScores: Record<string, number>
): Promise<void> {
  const profile = await prisma.teacherStyleProfile.findUnique({
    where: { agentId },
  });
  if (!profile) return;

  const existingPrefs = (profile.preferences as Record<string, any>) || {};
  const existingScores = (profile.confidenceScores as Record<string, number>) || {};

  await prisma.teacherStyleProfile.update({
    where: { agentId },
    data: {
      preferences: { ...existingPrefs, ...preferences },
      confidenceScores: { ...existingScores, ...confidenceScores },
    },
  });
}

// ============================================
// LAYER 3: CLASSROOM CONTEXT
// ============================================

async function getClassroomContexts(agentId: string): Promise<ClassroomContext[]> {
  return prisma.classroomContext.findMany({
    where: { agentId, isActive: true },
    orderBy: { createdAt: 'asc' },
  });
}

async function upsertClassroomContext(
  agentId: string,
  data: ClassroomContextInput
): Promise<ClassroomContext> {
  if (data.id) {
    return prisma.classroomContext.update({
      where: { id: data.id },
      data: {
        name: data.name,
        gradeLevel: data.gradeLevel,
        subject: data.subject,
        studentCount: data.studentCount,
        studentGroups: data.studentGroups ?? [],
        schedule: data.schedule ?? {},
        resources: data.resources ?? {},
        isActive: data.isActive ?? true,
      },
    });
  }
  return prisma.classroomContext.create({
    data: {
      agentId,
      name: data.name,
      gradeLevel: data.gradeLevel,
      subject: data.subject,
      studentCount: data.studentCount,
      studentGroups: data.studentGroups ?? [],
      schedule: data.schedule ?? {},
      resources: data.resources ?? {},
    },
  });
}

async function deleteClassroomContext(agentId: string, classroomId: string): Promise<void> {
  await prisma.classroomContext.deleteMany({
    where: { id: classroomId, agentId },
  });
}

// ============================================
// LAYER 4: CURRICULUM STATE
// ============================================

async function getCurriculumStates(agentId: string): Promise<CurriculumState[]> {
  return prisma.curriculumState.findMany({
    where: { agentId },
    orderBy: { subject: 'asc' },
  });
}

async function getCurriculumState(
  agentId: string,
  subject: Subject,
  schoolYear?: string
): Promise<CurriculumState | null> {
  const year = schoolYear || getCurrentSchoolYear();
  return prisma.curriculumState.findUnique({
    where: {
      agentId_subject_schoolYear: { agentId, subject, schoolYear: year },
    },
  });
}

async function updateCurriculumState(
  agentId: string,
  subject: Subject,
  data: Partial<CurriculumStateInput>
): Promise<CurriculumState> {
  const schoolYear = data.schoolYear || getCurrentSchoolYear();
  return prisma.curriculumState.upsert({
    where: {
      agentId_subject_schoolYear: { agentId, subject, schoolYear },
    },
    update: {
      gradeLevel: data.gradeLevel,
      standardsTaught: data.standardsTaught,
      standardsAssessed: data.standardsAssessed,
      standardsSkipped: data.standardsSkipped,
      pacingGuide: data.pacingGuide,
      currentWeek: data.currentWeek,
      topicProgress: data.topicProgress,
      identifiedGaps: data.identifiedGaps,
    },
    create: {
      agentId,
      subject,
      schoolYear,
      gradeLevel: data.gradeLevel,
      standardsTaught: data.standardsTaught || [],
      standardsAssessed: data.standardsAssessed || [],
      standardsSkipped: data.standardsSkipped || [],
      pacingGuide: data.pacingGuide,
      currentWeek: data.currentWeek || 1,
      topicProgress: data.topicProgress || {},
      identifiedGaps: data.identifiedGaps || [],
    },
  });
}

function getCurrentSchoolYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  // School year starts in August (month 7)
  if (month >= 7) {
    return `${year}-${year + 1}`;
  }
  return `${year - 1}-${year}`;
}

// ============================================
// LAYER 5: INTERACTIONS
// ============================================

async function recordInteraction(
  agentId: string,
  data: InteractionInput
): Promise<AgentInteraction> {
  return prisma.agentInteraction.create({
    data: {
      agentId,
      type: data.type,
      summary: data.summary,
      input: data.input,
      outputType: data.outputType,
      outputId: data.outputId,
      wasApproved: data.wasApproved,
      wasEdited: data.wasEdited,
      wasRegenerated: data.wasRegenerated,
      tokensUsed: data.tokensUsed || 0,
      modelUsed: data.modelUsed,
      contextSnapshot: data.contextSnapshot,
    },
  });
}

async function getRecentInteractions(
  agentId: string,
  opts?: {
    limit?: number;
    type?: AgentInteractionType;
    outputType?: string;
  }
): Promise<AgentInteraction[]> {
  return prisma.agentInteraction.findMany({
    where: {
      agentId,
      ...(opts?.type && { type: opts.type }),
      ...(opts?.outputType && { outputType: opts.outputType }),
    },
    orderBy: { createdAt: 'desc' },
    take: opts?.limit || 10,
  });
}

// ============================================
// FULL MEMORY SNAPSHOT
// ============================================

async function getFullMemorySnapshot(teacherId: string): Promise<AgentMemorySnapshot | null> {
  const agent = await prisma.teacherAgent.findUnique({
    where: { teacherId },
    include: {
      styleProfile: true,
      classrooms: { where: { isActive: true }, orderBy: { createdAt: 'asc' } },
      curriculumStates: { orderBy: { subject: 'asc' } },
    },
  });

  if (!agent) return null;

  const recentInteractions = await prisma.agentInteraction.findMany({
    where: { agentId: agent.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return {
    agent,
    styleProfile: agent.styleProfile ?? null,
    classrooms: agent.classrooms ?? [],
    curriculumStates: agent.curriculumStates ?? [],
    recentInteractions,
  };
}

// ============================================
// EXPORTS
// ============================================

export const agentMemoryService = {
  // Layer 1: Identity
  getOrCreateAgent,
  getAgent,
  updateIdentity,
  completeSetupStep,
  updateTeacherNameIfBlank,
  resetOnboarding,
  // Layer 2: Style
  getStyleProfile,
  recordStyleSignal,
  getHighConfidencePreferences,
  updateStylePreferences,
  // Layer 3: Classroom
  getClassroomContexts,
  upsertClassroomContext,
  deleteClassroomContext,
  // Layer 4: Curriculum
  getCurriculumStates,
  getCurriculumState,
  updateCurriculumState,
  // Layer 5: Interactions
  recordInteraction,
  getRecentInteractions,
  // Snapshot
  getFullMemorySnapshot,
};
