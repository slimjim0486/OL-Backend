// Classroom Management Service — Generates personalized behavior strategies
// Uses teacher context (experience, classroom, student groups) for tailored advice
import { genAI, TEACHER_CONTENT_SAFETY_SETTINGS } from '../../config/gemini.js';
import { config } from '../../config/index.js';
import { generateAndParseJson } from '../../utils/modelJson.js';
import { logger } from '../../utils/logger.js';

// ============================================
// TYPES
// ============================================

export interface BehaviorStrategyInput {
  challengeType?: string;
  context?: string;
  gradeLevel?: string;
  subject?: string;
  urgency?: 'immediate' | 'long_term';
  additionalContext?: string;
}

export interface BehaviorStrategyResult {
  title: string;
  summary: string;
  immediateStrategies: Array<{
    name: string;
    description: string;
    whenToUse: string;
  }>;
  preventiveApproaches: Array<{
    name: string;
    description: string;
    implementation: string;
  }>;
  longTermSystems: Array<{
    name: string;
    description: string;
    steps: string[];
  }>;
  lessonIntegrationTips: string[];
  tokensUsed: number;
  modelUsed: string;
}

// ============================================
// PROMPT BUILDER
// ============================================

function buildBehaviorStrategyPrompt(input: BehaviorStrategyInput): string {
  const challenge = input.challengeType || 'general classroom management';
  const grade = input.gradeLevel || 'elementary';
  const subject = input.subject || 'general';
  const situationContext = input.context || '';
  const urgency = input.urgency || 'long_term';

  return `You are an expert classroom management consultant who gives practical, evidence-based strategies to teachers. You understand that classroom management is the #1 stressor for teachers and your advice must be immediately actionable.

TEACHER REQUEST:
- Challenge: ${challenge}
- Grade level: ${grade}
- Subject: ${subject}
${situationContext ? `- Situation details: ${situationContext}` : ''}
- Focus: ${urgency === 'immediate' ? 'I need strategies I can use RIGHT NOW' : 'I want to build better long-term systems'}

${input.additionalContext ? `TEACHER CONTEXT (use this to personalize your advice):\n${input.additionalContext}\n` : ''}
IMPORTANT GUIDELINES:
- Be specific and practical — no vague advice like "be consistent" without explaining HOW
- Tailor strategies to the grade level (K-2 need very different approaches than 6-8)
- If the teacher has classroom management data in their context, build ON what already works for them
- For new teachers (< 3 years experience), provide more step-by-step scaffolding
- For veteran teachers, be concise and respect their expertise — offer fresh angles, not basics
- Never suggest punitive-only approaches — focus on proactive, relationship-based, and restorative strategies
- Include at least one strategy that can be embedded directly into lesson design

Return ONLY valid JSON:
{
  "title": "Short descriptive title for this strategy set",
  "summary": "2-3 sentence overview of the approach",
  "immediateStrategies": [
    {
      "name": "Strategy name",
      "description": "What to do — specific, actionable steps",
      "whenToUse": "The exact moment or trigger to deploy this"
    }
  ],
  "preventiveApproaches": [
    {
      "name": "Approach name",
      "description": "How it prevents the behavior issue",
      "implementation": "Step-by-step setup instructions"
    }
  ],
  "longTermSystems": [
    {
      "name": "System name",
      "description": "What it is and why it works",
      "steps": ["Step 1", "Step 2", "Step 3"]
    }
  ],
  "lessonIntegrationTips": [
    "Specific tip for embedding management into lesson planning"
  ]
}

Provide 2-3 strategies per category. Be concise but specific.`;
}

// ============================================
// GENERATION
// ============================================

async function generateStrategies(
  teacherId: string,
  input: BehaviorStrategyInput,
  additionalContext?: string
): Promise<BehaviorStrategyResult> {
  const inputWithContext = {
    ...input,
    additionalContext: additionalContext || input.additionalContext,
  };

  const prompt = buildBehaviorStrategyPrompt(inputWithContext);

  const parsedResult = await generateAndParseJson<Omit<BehaviorStrategyResult, 'tokensUsed' | 'modelUsed'>>({
    contextLabel: 'behavior-strategy',
    prompts: [prompt],
    invoke: (attemptPrompt: string) => {
      const model = genAI.getGenerativeModel({
        model: config.gemini.models.flash,
        safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4000,
          responseMimeType: 'application/json',
        },
      });
      return model.generateContent(attemptPrompt);
    },
    normalize: (value: any) => {
      if (!value || typeof value !== 'object') {
        return {
          title: 'Classroom Management Strategies',
          summary: '',
          immediateStrategies: [],
          preventiveApproaches: [],
          longTermSystems: [],
          lessonIntegrationTips: [],
        };
      }
      return {
        title: value.title || 'Classroom Management Strategies',
        summary: value.summary || '',
        immediateStrategies: Array.isArray(value.immediateStrategies) ? value.immediateStrategies : [],
        preventiveApproaches: Array.isArray(value.preventiveApproaches) ? value.preventiveApproaches : [],
        longTermSystems: Array.isArray(value.longTermSystems) ? value.longTermSystems : [],
        lessonIntegrationTips: Array.isArray(value.lessonIntegrationTips) ? value.lessonIntegrationTips : [],
      };
    },
  });

  const parsed = parsedResult.data;

  logger.info('Generated behavior strategies', {
    teacherId,
    challenge: input.challengeType,
    tokensUsed: parsedResult.tokensUsed,
  });

  return {
    ...parsed,
    tokensUsed: parsedResult.tokensUsed,
    modelUsed: 'flash',
  };
}

// ============================================
// EXPORTS
// ============================================

export const classroomManagementService = {
  generateStrategies,
};
