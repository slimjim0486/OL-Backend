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

Tell me about yourself — what school do you teach at, and what grades and subjects do you teach?`,

  classroom: `Great, thanks for sharing that! Now let me learn about your classroom.

How many students do you have? Do you use any grouping system (like leveled groups, table groups, etc.)? Any important things I should know about your classroom setup?`,

  curriculum: `Perfect! One last thing — what are you teaching right now?

You can answer for just one subject to start. If you want, also share what's coming up next. (You can also say "skip for now".)`,

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
    // Confirmation is special: don't finalize unless the teacher explicitly confirms.
    if (step === 'confirmation') {
      const normalized = userMessage.trim().toLowerCase();
      const confirmed =
        normalized === 'looks good' ||
        normalized === 'looks great' ||
        normalized === 'all good' ||
        normalized === 'yes' ||
        normalized === 'yep' ||
        normalized === 'correct' ||
        normalized === 'confirmed';

      if (confirmed) {
        await agentMemoryService.completeSetupStep(teacherId, STEP_TO_STATUS.confirmation);
        return {
          parsedData: { confirmed: true },
          agentMessage: "Perfect. You're all set. How can I help you today?",
          nextStep: null,
          isComplete: true,
        };
      }

      // Treat the message as corrections: try extracting updates from identity/classroom/curriculum
      const [idData, classroomData, curriculumData] = await Promise.all([
        extractStructuredData('identity', userMessage),
        extractStructuredData('classroom', userMessage),
        extractStructuredData('curriculum', userMessage),
      ]);

      await populateMemoryLayer(teacherId, agent.id, 'identity', idData);
      await populateMemoryLayer(teacherId, agent.id, 'classroom', classroomData);
      await populateMemoryLayer(teacherId, agent.id, 'curriculum', curriculumData);

      const agentMessage = await generateConfirmationMessage(teacherId);
      return {
        parsedData: { identity: idData, classroom: classroomData, curriculum: curriculumData },
        agentMessage,
        nextStep: {
          step: 'confirmation',
          prompt: STEP_PROMPTS.confirmation,
          progress: 100,
          isComplete: false,
        },
        isComplete: false,
      };
    }

    // Allow teachers to explicitly skip curriculum details.
    if (step === 'curriculum') {
      const normalized = userMessage.trim().toLowerCase();
      const wantsSkip =
        normalized === 'skip' ||
        normalized === 'skip for now' ||
        normalized === 'skip curriculum' ||
        normalized === 'later' ||
        normalized === 'not sure' ||
        normalized === 'not sure yet' ||
        normalized === 'idk' ||
        normalized === "i don't know" ||
        normalized === "i dont know" ||
        normalized === 'n/a' ||
        normalized === 'na';

      if (wantsSkip) {
        await agentMemoryService.completeSetupStep(teacherId, STEP_TO_STATUS.curriculum);
        const agentMessage = await generateConfirmationMessage(teacherId);
        return {
          parsedData: { skippedCurriculum: true },
          agentMessage,
          nextStep: {
            step: 'confirmation',
            prompt: STEP_PROMPTS.confirmation,
            progress: Math.round((STEP_ORDER.indexOf('confirmation') / STEP_ORDER.length) * 100),
            isComplete: false,
          },
          isComplete: false,
        };
      }
    }

    // Extract structured data from user message using Gemini
    const parsedData = await extractStructuredData(step, userMessage);

    // If we didn't get enough info for the curriculum step, do not advance.
    // This prevents framework-only answers from skipping the actual topic progress question.
    if (step === 'curriculum') {
      const subjects = Array.isArray(parsedData?.subjects) ? parsedData.subjects : [];
      let valid = normalizeCurriculumSubjects(subjects);

      if (valid.length === 0) {
        const fallbackSubject = getSingleKnownSubject(agent.subjectsTaught);
        if (fallbackSubject) {
          valid = normalizeCurriculumSubjects(subjects, fallbackSubject);
        }
      }

      if (valid.length > 0) {
        parsedData.subjects = valid;
      } else {
        const knownSubjects = normalizeSubjectArray(agent.subjectsTaught);
        let clarificationPrompt =
          `Quick question so I can personalize things:\n\n` +
          `What are you teaching right now? If you want, also share what's coming up next.\n\n` +
          `Tip: you can start with a subject, like "MATH: Fractions. Next: Decimals". Or say "skip for now".`;

        if (knownSubjects.length === 1) {
          clarificationPrompt =
            `Quick question for **${knownSubjects[0]}**:\n\n` +
            `What are you teaching right now? (Optional: what's coming up next.)\n\n` +
            `You can also say "skip for now".`;
        } else if (knownSubjects.length > 1) {
          clarificationPrompt =
            `Quick question so I can personalize things:\n\n` +
            `What are you teaching right now? (Optional: what's coming up next.)\n\n` +
            `Subjects you selected: ${knownSubjects.join(', ')}\n` +
            `Tip: you can start with a subject, like "MATH: Fractions". Or say "skip for now".`;
        }

        return {
          parsedData,
          agentMessage: clarificationPrompt,
          nextStep: {
            step: 'curriculum',
            prompt: STEP_PROMPTS.curriculum,
            progress: Math.round((STEP_ORDER.indexOf('curriculum') / STEP_ORDER.length) * 100),
            isComplete: false,
          },
          isComplete: false,
        };
      }
    }

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
      // For confirmation step, show the actual profile summary instead of a generic transition
      if (nextStepName === 'confirmation') {
        agentMessage = await generateConfirmationMessage(teacherId);
      } else {
        agentMessage = await generateTransitionMessage(step, nextStepName, parsedData);
      }
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
  } catch (error: any) {
    logger.error('Onboarding response processing failed', {
      errorMessage: error?.message || String(error),
      errorStack: error?.stack,
      teacherId,
      step
    });
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
  "firstName": "string or null",
  "lastName": "string or null",
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
    "coveredTopics": ["topics they've already covered this year (freeform strings)"],
    "currentTopic": "what they're teaching now",
    "upNextTopics": ["what's coming up next (freeform strings)"],
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
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
    },
  });

  const prompt = `${schemas[step]}\n\nTeacher's message: "${userMessage}"\n\nExtract the data as JSON. Use null for anything not mentioned.`;

  const result = await model.generateContent(prompt);
  let text = result.response.text().trim();
  // Strip markdown code fences if present
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }
  logger.info('Gemini onboarding extraction result', { step, rawText: text.substring(0, 500) });
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
      await agentMemoryService.updateTeacherNameIfBlank(teacherId, {
        firstName: typeof data.firstName === 'string' ? data.firstName : undefined,
        lastName: typeof data.lastName === 'string' ? data.lastName : undefined,
      });

      await agentMemoryService.updateIdentity(teacherId, {
        schoolName: data.schoolName || undefined,
        schoolType: data.schoolType || undefined,
        gradesTaught: Array.isArray(data.gradesTaught) && data.gradesTaught.length ? data.gradesTaught : undefined,
        subjectsTaught: Array.isArray(data.subjectsTaught) && data.subjectsTaught.length
          ? data.subjectsTaught
              .filter((s: string) => Object.values(Subject).includes(s as Subject))
          : undefined,
        curriculumType: normalizeCurriculumType(data.curriculumType),
        yearsExperience: data.yearsExperience || undefined,
        teachingPhilosophy: data.teachingPhilosophy || undefined,
      });
      break;
    }

    case 'classroom': {
      const classrooms = data.classrooms || [];
      const existing = await agentMemoryService.getClassroomContexts(agentId);

      for (const classroom of classrooms) {
        const incomingName =
          typeof classroom.name === 'string' && classroom.name.trim() ? classroom.name.trim() : '';

        // Heuristics to avoid creating duplicate "My Classroom" rows during retries/corrections.
        const matched =
          incomingName
            ? existing.find((c) => c.name.toLowerCase() === incomingName.toLowerCase())
            : undefined;
        const singleFallback = !matched && existing.length === 1 ? existing[0] : undefined;

        const resolvedId = matched?.id || singleFallback?.id;
        const resolvedName =
          incomingName && incomingName.toLowerCase() !== 'my classroom'
            ? incomingName
            : matched?.name || singleFallback?.name || incomingName || 'My Classroom';

        await agentMemoryService.upsertClassroomContext(agentId, {
          ...(resolvedId ? { id: resolvedId } : {}),
          name: resolvedName,
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
          const topicProgress: Record<string, any> = {};
          if (typeof subj.currentTopic === 'string' && subj.currentTopic.trim()) {
            topicProgress.currentTopic = subj.currentTopic.trim();
          }
          if (Array.isArray(subj.coveredTopics) && subj.coveredTopics.length) {
            topicProgress.coveredTopics = subj.coveredTopics.filter(Boolean).map((t: any) => String(t)).slice(0, 200);
          }
          if (Array.isArray(subj.upNextTopics) && subj.upNextTopics.length) {
            topicProgress.upNextTopics = subj.upNextTopics.filter(Boolean).map((t: any) => String(t)).slice(0, 200);
          }

          await agentMemoryService.updateCurriculumState(agentId, subj.subject, {
            subject: subj.subject,
            schoolYear: getCurrentSchoolYear(),
            standardsTaught: Array.isArray(subj.standardsTaught) && subj.standardsTaught.length
              ? subj.standardsTaught
              : undefined,
            currentWeek: typeof subj.currentWeek === 'number' && subj.currentWeek >= 1
              ? subj.currentWeek
              : undefined,
            topicProgress: Object.keys(topicProgress).length ? topicProgress : undefined,
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
        maxOutputTokens: 1024,
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
  const agent = await agentMemoryService.getAgent(teacherId) as any;
  if (!agent) return "You're all set! I'm ready to help you create content.";

  const parts: string[] = ["Here's what I know about you:\n"];

  if (agent.schoolName) parts.push(`**School:** ${agent.schoolName}`);
  if (agent.gradesTaught?.length) parts.push(`**Grades:** ${agent.gradesTaught.join(', ')}`);
  if (agent.subjectsTaught?.length) parts.push(`**Subjects:** ${agent.subjectsTaught.join(', ')}`);
  if (agent.curriculumType) parts.push(`**Curriculum:** ${agent.curriculumType}`);

  // Include classroom info
  if (agent.classrooms?.length) {
    for (const c of agent.classrooms) {
      const classInfo: string[] = [];
      if (c.studentCount) classInfo.push(`${c.studentCount} students`);
      if (c.gradeLevel) classInfo.push(`Grade ${c.gradeLevel}`);
      if (classInfo.length) parts.push(`**Classroom:** ${classInfo.join(', ')}`);
      if (c.studentGroups && Array.isArray(c.studentGroups) && c.studentGroups.length) {
        const groups = c.studentGroups.map((g: any) => g.name || g.level).join(', ');
        parts.push(`**Student Groups:** ${groups}`);
      }
    }
  }

  // Include curriculum info
  if (agent.curriculumStates?.length) {
    for (const cs of agent.curriculumStates) {
      const tp = (cs as any).topicProgress;
      const currentTopic =
        tp && typeof tp === 'object' && typeof tp.currentTopic === 'string' ? tp.currentTopic.trim() : '';
      if (currentTopic) parts.push(`**Currently teaching (${cs.subject}):** ${currentTopic}`);
    }
  }

  parts.push("\nDoes everything look right? Say **\"looks good\"** to finish setup, or tell me what needs to be changed.");

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
      maxOutputTokens: 8192,
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

function normalizeSubjectArray(input: unknown): Subject[] {
  if (!Array.isArray(input)) return [];
  const deduped = input.filter((s) => Object.values(Subject).includes(s as Subject));
  return Array.from(new Set(deduped as Subject[]));
}

function getSingleKnownSubject(subjects: unknown): Subject | undefined {
  const knownSubjects = normalizeSubjectArray(subjects);
  return knownSubjects.length === 1 ? knownSubjects[0] : undefined;
}

function normalizeCurriculumSubjects(
  rawSubjects: unknown,
  fallbackSubject?: Subject
): Array<Record<string, any>> {
  if (!Array.isArray(rawSubjects)) return [];

  const normalized: Array<Record<string, any> | null> = rawSubjects
    .map((raw): Record<string, any> | null => {
      if (!raw || typeof raw !== 'object') return null;
      const subjectValue = (raw as any).subject;
      const resolvedSubject: Subject | undefined = Object.values(Subject).includes(subjectValue as Subject)
        ? (subjectValue as Subject)
        : fallbackSubject;

      if (!resolvedSubject) return null;

      const coveredTopics = Array.isArray((raw as any).coveredTopics)
        ? (raw as any).coveredTopics.filter(Boolean).map((topic: any) => String(topic))
        : [];
      const upNextTopics = Array.isArray((raw as any).upNextTopics)
        ? (raw as any).upNextTopics.filter(Boolean).map((topic: any) => String(topic))
        : [];
      const standardsTaught = Array.isArray((raw as any).standardsTaught)
        ? (raw as any).standardsTaught.filter(Boolean).map((std: any) => String(std))
        : [];
      const currentTopic = typeof (raw as any).currentTopic === 'string'
        ? (raw as any).currentTopic.trim()
        : '';
      const currentWeekRaw = (raw as any).currentWeek;
      const currentWeek =
        typeof currentWeekRaw === 'number'
          ? currentWeekRaw
          : typeof currentWeekRaw === 'string' && currentWeekRaw.trim() !== '' && !Number.isNaN(Number(currentWeekRaw))
            ? Number(currentWeekRaw)
            : undefined;

      if (!currentTopic && coveredTopics.length === 0 && upNextTopics.length === 0 && standardsTaught.length === 0 && !currentWeek) {
        return null;
      }

      return {
        subject: resolvedSubject,
        currentTopic: currentTopic || undefined,
        coveredTopics: coveredTopics.length ? coveredTopics : undefined,
        upNextTopics: upNextTopics.length ? upNextTopics : undefined,
        standardsTaught: standardsTaught.length ? standardsTaught : undefined,
        currentWeek: typeof currentWeek === 'number' && currentWeek >= 1 ? currentWeek : undefined,
      };
    });

  return normalized.filter((entry): entry is Record<string, any> => entry !== null);
}

function normalizeCurriculumType(value: any): CurriculumType | undefined {
  if (!value) return undefined;
  if (Object.values(CurriculumType).includes(value)) return value as CurriculumType;
  if (typeof value !== 'string') return undefined;

  const v = value.toLowerCase().trim();
  if (v.includes('american') || v.includes('us') || v.includes('usa') || v.includes('common core')) return CurriculumType.AMERICAN;
  if (v.includes('british') || v.includes('uk') || v.includes('gcse') || v.includes('a-level')) return CurriculumType.BRITISH;
  if (v === 'ib' || v.includes('international baccalaureate')) return CurriculumType.IB;
  if (v.includes('cbse')) return CurriculumType.INDIAN_CBSE;
  if (v.includes('icse')) return CurriculumType.INDIAN_ICSE;
  if (v.includes('arabic') || v.includes('uae') || v.includes('ksa')) return CurriculumType.ARABIC;

  return undefined;
}

// ============================================
// QUICK SETUP (Streamlined 2-step onboarding)
// ============================================

interface QuickSetupInput {
  firstName: string;
  gradesTaught: string[];
  subjectsTaught: string[];
  currentTopic?: string;
}

async function quickSetup(teacherId: string, data: QuickSetupInput): Promise<{
  agent: any;
  success: boolean;
}> {
  const agent = await agentMemoryService.getOrCreateAgent(teacherId);

  // Update teacher name
  if (data.firstName) {
    await agentMemoryService.updateTeacherNameIfBlank(teacherId, {
      firstName: data.firstName,
    });
  }

  // Filter to valid subjects
  const validSubjects = data.subjectsTaught.filter(
    (s: string) => Object.values(Subject).includes(s as Subject)
  ) as Subject[];

  // Update agent identity with minimal data
  await agentMemoryService.updateIdentity(teacherId, {
    gradesTaught: data.gradesTaught,
    subjectsTaught: validSubjects.length ? validSubjects : undefined,
    curriculumType: CurriculumType.AMERICAN,
  });

  // Create a default classroom
  const existingClassrooms = await agentMemoryService.getClassroomContexts(agent.id);
  if (existingClassrooms.length === 0) {
    await agentMemoryService.upsertClassroomContext(agent.id, {
      name: 'My Classroom',
    });
  }

  // Mark fully set up
  await agentMemoryService.completeSetupStep(teacherId, AgentSetupStatus.FULLY_SETUP);

  // Fetch updated agent
  const updatedAgent = await agentMemoryService.getAgent(teacherId);

  logger.info('Quick setup completed', { teacherId, gradesTaught: data.gradesTaught, subjectsTaught: validSubjects });

  return {
    agent: updatedAgent,
    success: true,
  };
}

// ============================================
// EXPORTS
// ============================================

export const agentOnboardingService = {
  getNextOnboardingStep,
  getOnboardingStatus,
  processOnboardingResponse,
  parsePacingGuide,
  quickSetup,
};
