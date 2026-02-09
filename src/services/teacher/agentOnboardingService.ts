// Agent Onboarding Service — Conversational onboarding for the AI teaching assistant
import { AgentSetupStatus, Subject, CurriculumType } from '@prisma/client';
import { genAI, TEACHER_CONTENT_SAFETY_SETTINGS } from '../../config/gemini.js';
import { config } from '../../config/index.js';
import { agentMemoryService } from './agentMemoryService.js';
import { logger } from '../../utils/logger.js';

// ============================================
// TYPES
// ============================================

export type OnboardingStepName = 'identity' | 'classroom' | 'curriculum' | 'confirmation';

export interface OnboardingStep {
  step: OnboardingStepName;
  prompt: string;
  progress: number; // 0-100
  isComplete: boolean;
}

export interface OnboardingResponse {
  parsedData: Record<string, any>;
  agentMessage: string;
  nextStep: OnboardingStep | null;
  isComplete: boolean;
}

export interface PacingGuideData {
  weeks: Array<{
    weekNumber: number;
    topics: string[];
    standards: string[];
  }>;
  totalWeeks: number;
  subject: string;
}

// ============================================
// STEP DEFINITIONS
// ============================================

const STEP_ORDER: OnboardingStepName[] = ['identity', 'classroom', 'curriculum', 'confirmation'];

const STEP_PROMPTS: Record<OnboardingStepName, string> = {
  identity: `Hi! I'm your AI teaching assistant. I'd love to get to know you so I can help you create better content for your students.

Tell me about yourself — what's your name, what school do you teach at, what grades and subjects do you teach, and what curriculum do you follow? Feel free to share as much or as little as you'd like!`,

  classroom: `Great, thanks for sharing that! Now let me learn about your classroom.

How many students do you have? Do you use any grouping system (like leveled groups, table groups, etc.)? Any important things I should know about your classroom setup?`,

  curriculum: `Perfect! One last thing — where are you in your curriculum right now?

What topics or standards have you covered so far this year? What are you working on this week? If you have a pacing guide, you can upload it and I'll extract the details automatically.`,

  confirmation: `Here's a summary of what I've learned about you. Does everything look right? You can say "looks good" to finish, or tell me what needs to be changed.`,
};

const STEP_TO_STATUS: Record<OnboardingStepName, AgentSetupStatus> = {
  identity: AgentSetupStatus.IDENTITY_COMPLETE,
  classroom: AgentSetupStatus.CLASSROOM_COMPLETE,
  curriculum: AgentSetupStatus.CURRICULUM_COMPLETE,
  confirmation: AgentSetupStatus.FULLY_SETUP,
};

// ============================================
// ONBOARDING FLOW
// ============================================

async function getNextOnboardingStep(teacherId: string): Promise<OnboardingStep> {
  const agent = await agentMemoryService.getOrCreateAgent(teacherId);
  const currentStatus = agent.setupStatus;

  const stepIndex = getStepIndex(currentStatus);
  const nextStep = STEP_ORDER[stepIndex] || 'confirmation';

  return {
    step: nextStep,
    prompt: STEP_PROMPTS[nextStep],
    progress: Math.round((stepIndex / STEP_ORDER.length) * 100),
    isComplete: currentStatus === AgentSetupStatus.FULLY_SETUP,
  };
}

async function getOnboardingStatus(teacherId: string): Promise<{
  currentStep: OnboardingStepName;
  progress: number;
  isComplete: boolean;
  agentSummary: Record<string, any> | null;
}> {
  const agent = await agentMemoryService.getAgent(teacherId);
  if (!agent) {
    return { currentStep: 'identity', progress: 0, isComplete: false, agentSummary: null };
  }

  const stepIndex = getStepIndex(agent.setupStatus);
  const isComplete = agent.setupStatus === AgentSetupStatus.FULLY_SETUP;

  return {
    currentStep: STEP_ORDER[stepIndex] || 'confirmation',
    progress: isComplete ? 100 : Math.round((stepIndex / STEP_ORDER.length) * 100),
    isComplete,
    agentSummary: isComplete
      ? {
          schoolName: agent.schoolName,
          gradesTaught: agent.gradesTaught,
          subjectsTaught: agent.subjectsTaught,
          curriculumType: agent.curriculumType,
        }
      : null,
  };
}

async function processOnboardingResponse(
  teacherId: string,
  step: OnboardingStepName,
  userMessage: string
): Promise<OnboardingResponse> {
  const agent = await agentMemoryService.getOrCreateAgent(teacherId);

  try {
    // Extract structured data from user message using Gemini
    const parsedData = await extractStructuredData(step, userMessage);

    // Populate appropriate memory layer
    await populateMemoryLayer(teacherId, agent.id, step, parsedData);

    // Advance setup status
    await agentMemoryService.completeSetupStep(teacherId, STEP_TO_STATUS[step]);

    // Determine next step
    const nextStepIndex = STEP_ORDER.indexOf(step) + 1;
    const isComplete = nextStepIndex >= STEP_ORDER.length;

    let nextStep: OnboardingStep | null = null;
    let agentMessage: string;

    if (isComplete) {
      agentMessage = await generateConfirmationMessage(teacherId);
    } else {
      const nextStepName = STEP_ORDER[nextStepIndex];
      agentMessage = await generateTransitionMessage(step, nextStepName, parsedData);
      nextStep = {
        step: nextStepName,
        prompt: STEP_PROMPTS[nextStepName],
        progress: Math.round(((nextStepIndex) / STEP_ORDER.length) * 100),
        isComplete: false,
      };
    }

    return {
      parsedData,
      agentMessage,
      nextStep,
      isComplete,
    };
  } catch (error) {
    logger.error('Onboarding response processing failed', { error, teacherId, step });
    return {
      parsedData: {},
      agentMessage: `I had trouble understanding that. Could you try rephrasing? ${STEP_PROMPTS[step]}`,
      nextStep: {
        step,
        prompt: STEP_PROMPTS[step],
        progress: Math.round((STEP_ORDER.indexOf(step) / STEP_ORDER.length) * 100),
        isComplete: false,
      },
      isComplete: false,
    };
  }
}

// ============================================
// STRUCTURED DATA EXTRACTION
// ============================================

async function extractStructuredData(
  step: OnboardingStepName,
  userMessage: string
): Promise<Record<string, any>> {
  const schemas: Record<OnboardingStepName, string> = {
    identity: `Extract from the teacher's message:
{
  "schoolName": "string or null",
  "schoolType": "public|private|charter|homeschool or null",
  "gradesTaught": ["array of grade levels mentioned, e.g., '3rd', 'Year 5'"],
  "subjectsTaught": ["array of subjects from: MATH, SCIENCE, ENGLISH, ARABIC, ISLAMIC_STUDIES, SOCIAL_STUDIES, HISTORY, GEOGRAPHY, READING, ART, MUSIC, COMPUTER_SCIENCE, OTHER"],
  "curriculumType": "AMERICAN|BRITISH|IB|INDIAN_CBSE|INDIAN_ICSE|ARABIC or null",
  "yearsExperience": "number or null",
  "teachingPhilosophy": "string or null"
}`,

    classroom: `Extract from the teacher's message:
{
  "classrooms": [{
    "name": "classroom name or default like 'My Classroom'",
    "studentCount": "number or null",
    "gradeLevel": "string or null",
    "subject": "subject or null",
    "studentGroups": [{"name": "group name", "level": "advanced|on-level|below-level|mixed", "count": "number or null", "notes": "string or null"}]
  }]
}`,

    curriculum: `Extract from the teacher's message:
{
  "subjects": [{
    "subject": "MATH|SCIENCE|ENGLISH|etc",
    "currentTopic": "what they're teaching now",
    "standardsTaught": ["any standards mentioned"],
    "currentWeek": "week number if mentioned, null otherwise"
  }]
}`,

    confirmation: `{
  "confirmed": true,
  "changes": []
}`,
  };

  const model = genAI.getGenerativeModel({
    model: config.gemini.models.flash,
    safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 500,
      responseMimeType: 'application/json',
    },
  });

  const prompt = `${schemas[step]}\n\nTeacher's message: "${userMessage}"\n\nExtract the data as JSON. Use null for anything not mentioned.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  return JSON.parse(text);
}

// ============================================
// MEMORY POPULATION
// ============================================

async function populateMemoryLayer(
  teacherId: string,
  agentId: string,
  step: OnboardingStepName,
  data: Record<string, any>
): Promise<void> {
  switch (step) {
    case 'identity': {
      await agentMemoryService.updateIdentity(teacherId, {
        schoolName: data.schoolName || undefined,
        schoolType: data.schoolType || undefined,
        gradesTaught: data.gradesTaught || [],
        subjectsTaught: (data.subjectsTaught || []).filter((s: string) =>
          Object.values(Subject).includes(s as Subject)
        ),
        curriculumType: data.curriculumType && Object.values(CurriculumType).includes(data.curriculumType)
          ? data.curriculumType
          : undefined,
        yearsExperience: data.yearsExperience || undefined,
        teachingPhilosophy: data.teachingPhilosophy || undefined,
      });
      break;
    }

    case 'classroom': {
      const classrooms = data.classrooms || [];
      for (const classroom of classrooms) {
        await agentMemoryService.upsertClassroomContext(agentId, {
          name: classroom.name || 'My Classroom',
          gradeLevel: classroom.gradeLevel,
          subject: classroom.subject && Object.values(Subject).includes(classroom.subject)
            ? classroom.subject
            : undefined,
          studentCount: classroom.studentCount,
          studentGroups: classroom.studentGroups || [],
        });
      }
      break;
    }

    case 'curriculum': {
      const subjects = data.subjects || [];
      for (const subj of subjects) {
        if (subj.subject && Object.values(Subject).includes(subj.subject)) {
          await agentMemoryService.updateCurriculumState(agentId, subj.subject, {
            subject: subj.subject,
            schoolYear: getCurrentSchoolYear(),
            standardsTaught: subj.standardsTaught || [],
            currentWeek: subj.currentWeek || 1,
          });
        }
      }
      break;
    }

    case 'confirmation':
      // No data to populate, just finalize
      break;
  }
}

// ============================================
// MESSAGE GENERATION
// ============================================

async function generateTransitionMessage(
  completedStep: OnboardingStepName,
  nextStep: OnboardingStepName,
  parsedData: Record<string, any>
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: config.gemini.models.flash,
      safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 200,
      },
    });

    const prompt = `You are a friendly AI teaching assistant completing onboarding. The teacher just shared their ${completedStep} information: ${JSON.stringify(parsedData)}

Write a brief, warm acknowledgment (1-2 sentences) of what they shared, then transition to asking about the next topic.

Next question to ask: "${STEP_PROMPTS[nextStep]}"

Keep it natural and conversational. Don't be overly enthusiastic.`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch {
    return `Got it, thanks! ${STEP_PROMPTS[nextStep]}`;
  }
}

async function generateConfirmationMessage(teacherId: string): Promise<string> {
  const agent = await agentMemoryService.getAgent(teacherId);
  if (!agent) return "You're all set! I'm ready to help you create content.";

  const parts: string[] = ["Here's what I know about you:"];

  if (agent.schoolName) parts.push(`- School: ${agent.schoolName}`);
  if (agent.gradesTaught?.length) parts.push(`- Grades: ${agent.gradesTaught.join(', ')}`);
  if (agent.subjectsTaught?.length) parts.push(`- Subjects: ${agent.subjectsTaught.join(', ')}`);
  if (agent.curriculumType) parts.push(`- Curriculum: ${agent.curriculumType}`);

  parts.push("\nI'm all set to help you create personalized content! You can start a conversation anytime — just tell me what you need.");

  return parts.join('\n');
}

// ============================================
// PACING GUIDE PARSING
// ============================================

async function parsePacingGuide(
  teacherId: string,
  fileContent: string,
  subject: Subject
): Promise<PacingGuideData> {
  const model = genAI.getGenerativeModel({
    model: config.gemini.models.flash,
    safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 2000,
      responseMimeType: 'application/json',
    },
  });

  const prompt = `Extract a pacing guide from this document. Return JSON:
{
  "weeks": [
    { "weekNumber": 1, "topics": ["topic1", "topic2"], "standards": ["standard notation"] }
  ],
  "totalWeeks": <number>,
  "subject": "${subject}"
}

Document content:
${fileContent.substring(0, 8000)}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  return JSON.parse(text);
}

// ============================================
// HELPERS
// ============================================

function getStepIndex(status: AgentSetupStatus): number {
  switch (status) {
    case AgentSetupStatus.NOT_STARTED:
      return 0;
    case AgentSetupStatus.IDENTITY_COMPLETE:
      return 1;
    case AgentSetupStatus.CLASSROOM_COMPLETE:
      return 2;
    case AgentSetupStatus.CURRICULUM_COMPLETE:
      return 3;
    case AgentSetupStatus.FULLY_SETUP:
      return 4;
    default:
      return 0;
  }
}

function getCurrentSchoolYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  if (month >= 7) return `${year}-${year + 1}`;
  return `${year - 1}-${year}`;
}

// ============================================
// EXPORTS
// ============================================

export const agentOnboardingService = {
  getNextOnboardingStep,
  getOnboardingStatus,
  processOnboardingResponse,
  parsePacingGuide,
};
