// Grading Prompt Builder - Curriculum-aware prompts for AI grading
// Generates prompts that produce feedback aligned with educational philosophies
import { CurriculumType, ScoringType } from '@prisma/client';
import { CURRICULUM_CONFIGS, CurriculumConfig } from '../../config/curricula.js';
import { RubricCriterion } from '../teacher/rubricService.js';

// ============================================
// TYPES
// ============================================

export interface GradingPromptInput {
  rubricName: string;
  rubricDescription?: string;
  subject?: string;
  gradeLevel?: string;
  criteria: RubricCriterion[];
  maxScore: number;
  scoringType: ScoringType;
  passingThreshold?: number;
  confidenceThreshold: number;
  customInstructions?: string;
  curriculumType?: CurriculumType;
  studentSubmission: string;
  studentIdentifier?: string;
}

export interface GradingResponseSchema {
  criteriaScores: Array<{
    criterionId: string;
    score: number;
    feedback: string;
    confidence: number;
  }>;
  overallFeedback: string;
  strengths: string[];
  improvements: string[];
  confidenceScore: number;
  flagForReview: boolean;
  flagReason?: string;
}

// ============================================
// CURRICULUM-SPECIFIC FEEDBACK STYLES
// ============================================

function getCurriculumFeedbackGuidance(config: CurriculumConfig): string {
  const { feedbackStyle, assessmentStyle, parentExpectations } = config;
  const { keyTerminology } = parentExpectations;

  return `
FEEDBACK STYLE (${config.displayName}):
- Philosophy: ${config.philosophy}
- Approach: ${feedbackStyle.approach}
- Tone: ${parentExpectations.communicationTone}
- Score Display: ${assessmentStyle.scoreDisplay}
- Encouragement Level: ${assessmentStyle.encouragementLevel}

FEEDBACK EXAMPLES TO EMULATE:
${feedbackStyle.examples.map((ex: string, i: number) => `${i + 1}. "${ex}"`).join('\n')}

TERMINOLOGY TO USE:
- For excellent work: "${keyTerminology.advanced}"
- For good work: "${keyTerminology.mastery}"
- For developing work: "${keyTerminology.struggling}"
- For progress: "${keyTerminology.progress}"

MISTAKE HANDLING:
${assessmentStyle.mistakeHandling}
`;
}

function getCurriculumSpecificInstructions(curriculumType?: CurriculumType): string {
  if (!curriculumType || !CURRICULUM_CONFIGS[curriculumType]) {
    // Default to American style
    return getCurriculumFeedbackGuidance(CURRICULUM_CONFIGS.AMERICAN);
  }

  return getCurriculumFeedbackGuidance(CURRICULUM_CONFIGS[curriculumType]);
}

// ============================================
// SCORING TYPE GUIDANCE
// ============================================

function getScoringGuidance(scoringType: ScoringType, maxScore: number, passingThreshold?: number): string {
  switch (scoringType) {
    case 'POINTS':
      return `
SCORING: Award points for each criterion based on the rubric levels.
- Maximum total score: ${maxScore} points
${passingThreshold ? `- Passing threshold: ${passingThreshold} points` : ''}
- Calculate total by summing weighted criterion scores`;

    case 'PERCENTAGE':
      return `
SCORING: Calculate percentage scores for each criterion.
- Express final score as a percentage (0-100%)
${passingThreshold ? `- Passing threshold: ${passingThreshold}%` : ''}
- Calculate total percentage based on weighted criterion percentages`;

    case 'LETTER_GRADE':
      return `
SCORING: Assign letter grades based on performance.
- A: 90-100% (Excellent)
- B: 80-89% (Good)
- C: 70-79% (Satisfactory)
- D: 60-69% (Needs Improvement)
- F: Below 60% (Unsatisfactory)
- Calculate final letter grade from weighted criterion scores`;

    case 'PASS_FAIL':
      return `
SCORING: Determine if submission meets passing criteria.
- PASS: Meets minimum expectations across all criteria
- FAIL: Does not meet minimum expectations
${passingThreshold ? `- Passing threshold: ${passingThreshold}% of criteria must be at proficient level or above` : ''}`;

    default:
      return `SCORING: Award points from 0 to ${maxScore} based on rubric levels.`;
  }
}

// ============================================
// PROMPT BUILDER
// ============================================

export function buildGradingSystemPrompt(input: GradingPromptInput): string {
  const {
    subject,
    gradeLevel,
    criteria,
    scoringType,
    maxScore,
    passingThreshold,
    confidenceThreshold,
    customInstructions,
    curriculumType,
  } = input;

  const curriculumGuidance = getCurriculumSpecificInstructions(curriculumType);
  const scoringGuidance = getScoringGuidance(scoringType, maxScore, passingThreshold);

  return `You are an expert ${subject || 'academic'} educator specializing in grading student work for ${gradeLevel || 'K-12'} students. Your role is to provide fair, constructive, and curriculum-aligned feedback.

${curriculumGuidance}

${scoringGuidance}

GRADING PRINCIPLES:
1. Be objective and consistent in applying the rubric criteria
2. Provide specific, actionable feedback for each criterion
3. Identify genuine strengths - be specific about what the student did well
4. Suggest improvements that are achievable and relevant
5. Maintain age-appropriate language and expectations
6. Consider effort and growth, not just final product

CONFIDENCE SCORING:
- Assign a confidence score (0-1) to your overall grading
- Lower confidence for:
  * Very short or incomplete submissions
  * Off-topic content
  * Unclear or illegible portions
  * Ambiguous rubric alignment
- Flag for teacher review if confidence is below ${confidenceThreshold}

FLAGGING CRITERIA - Flag for teacher review when:
- Confidence score is below ${confidenceThreshold}
- Submission appears off-topic or doesn't match assignment
- Content raises concerns (plagiarism indicators, inappropriate content)
- Extreme scores (all maximum or all minimum)
- Unable to assess one or more criteria

${customInstructions ? `\nADDITIONAL TEACHER INSTRUCTIONS:\n${customInstructions}` : ''}

IMPORTANT: Your feedback should be encouraging while being honest. Students learn best when they understand both what they did well and how they can improve.`;
}

export function buildGradingUserPrompt(input: GradingPromptInput): string {
  const {
    rubricName,
    rubricDescription,
    subject,
    gradeLevel,
    criteria,
    maxScore,
    studentSubmission,
    studentIdentifier,
  } = input;

  // Format criteria for the prompt
  const criteriaText = criteria.map((criterion, index) => {
    const levelsText = criterion.levels
      .sort((a, b) => b.score - a.score) // Highest score first
      .map(level => `      - Score ${level.score} (${level.label}): ${level.description}`)
      .join('\n');

    return `
  ${index + 1}. ${criterion.name} (Weight: ${criterion.weight}%)
     Description: ${criterion.description}
     Scoring Levels:
${levelsText}`;
  }).join('\n');

  return `GRADING ASSIGNMENT

RUBRIC: ${rubricName}
${rubricDescription ? `Description: ${rubricDescription}` : ''}
Subject: ${subject || 'General'}
Grade Level: ${gradeLevel || 'Not specified'}
Maximum Score: ${maxScore}

CRITERIA:
${criteriaText}

---

STUDENT SUBMISSION${studentIdentifier ? ` (${studentIdentifier})` : ''}:

${studentSubmission}

---

Please grade this submission according to the rubric above. For each criterion:
1. Assign a score based on the scoring levels
2. Provide specific feedback explaining the score
3. Rate your confidence in the assessment (0-1)

Then provide:
- Overall feedback (2-3 sentences summarizing performance)
- Key strengths (2-4 specific things done well)
- Areas for improvement (2-4 actionable suggestions)
- Overall confidence score
- Whether to flag for teacher review (and why if flagging)

Respond in the following JSON format:
{
  "criteriaScores": [
    {
      "criterionId": "criterion-id",
      "score": 3,
      "feedback": "Specific feedback for this criterion...",
      "confidence": 0.85
    }
  ],
  "overallFeedback": "Overall assessment of the submission...",
  "strengths": ["Strength 1", "Strength 2"],
  "improvements": ["Improvement 1", "Improvement 2"],
  "confidenceScore": 0.8,
  "flagForReview": false,
  "flagReason": null
}`;
}

// ============================================
// BATCH GRADING OPTIMIZATION
// ============================================

export function buildBatchGradingSystemPrompt(input: Omit<GradingPromptInput, 'studentSubmission' | 'studentIdentifier'>): string {
  // Same as single grading system prompt but with batch-specific instructions
  const basePrompt = buildGradingSystemPrompt({
    ...input,
    studentSubmission: '', // Not used in system prompt
  });

  return `${basePrompt}

BATCH GRADING MODE:
- You will grade multiple submissions in sequence
- Apply the same standards consistently across all submissions
- Do not let previous submissions influence grading of current submission
- Each submission should be graded independently`;
}

// ============================================
// TOKEN ESTIMATION
// ============================================

export function estimateGradingTokens(
  criteria: RubricCriterion[],
  submissionLength: number
): number {
  // Base tokens for system prompt
  const systemPromptTokens = 800;

  // Tokens per criterion (description + levels)
  const criteriaTokens = criteria.reduce((sum, c) => {
    const levelTokens = c.levels.reduce((lSum, l) => lSum + (l.description.length / 4), 0);
    return sum + (c.description.length / 4) + levelTokens + 50;
  }, 0);

  // Tokens for submission (rough: 1 token ≈ 4 characters)
  const submissionTokens = Math.ceil(submissionLength / 4);

  // Tokens for response (estimate based on criteria count)
  const responseTokens = 500 + (criteria.length * 150);

  // Total with buffer
  const total = systemPromptTokens + criteriaTokens + submissionTokens + responseTokens;

  return Math.ceil(total * 1.2); // 20% buffer
}

// ============================================
// RESPONSE PARSING
// ============================================

export function parseGradingResponse(responseText: string): GradingResponseSchema | null {
  try {
    // Try to parse as-is first
    return JSON.parse(responseText);
  } catch {
    // Try to extract JSON from markdown code blocks
    const jsonBlockMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonBlockMatch) {
      try {
        return JSON.parse(jsonBlockMatch[1].trim());
      } catch {
        // Continue to next attempt
      }
    }

    // Try to find JSON object
    const jsonObjectMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonObjectMatch) {
      try {
        return JSON.parse(jsonObjectMatch[0]);
      } catch {
        // Parse failed
      }
    }

    return null;
  }
}

export function validateGradingResponse(
  response: GradingResponseSchema,
  criteria: RubricCriterion[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check all criteria are scored
  const scoredIds = new Set(response.criteriaScores.map(s => s.criterionId));
  for (const criterion of criteria) {
    if (!scoredIds.has(criterion.id)) {
      errors.push(`Missing score for criterion: ${criterion.name}`);
    }
  }

  // Validate scores are within level ranges
  for (const score of response.criteriaScores) {
    const criterion = criteria.find(c => c.id === score.criterionId);
    if (criterion) {
      const validScores = criterion.levels.map(l => l.score);
      if (!validScores.includes(score.score)) {
        errors.push(`Invalid score ${score.score} for ${criterion.name}. Valid scores: ${validScores.join(', ')}`);
      }
    }
  }

  // Validate confidence scores
  if (response.confidenceScore < 0 || response.confidenceScore > 1) {
    errors.push('Overall confidence score must be between 0 and 1');
  }

  for (const score of response.criteriaScores) {
    if (score.confidence < 0 || score.confidence > 1) {
      errors.push(`Criterion ${score.criterionId} confidence must be between 0 and 1`);
    }
  }

  // Check required fields
  if (!response.overallFeedback || response.overallFeedback.trim().length === 0) {
    errors.push('Overall feedback is required');
  }

  if (!response.strengths || response.strengths.length === 0) {
    errors.push('At least one strength must be identified');
  }

  if (!response.improvements || response.improvements.length === 0) {
    errors.push('At least one improvement suggestion is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export default {
  buildGradingSystemPrompt,
  buildGradingUserPrompt,
  buildBatchGradingSystemPrompt,
  estimateGradingTokens,
  parseGradingResponse,
  validateGradingResponse,
};
