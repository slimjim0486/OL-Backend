/**
 * Alignment Service
 * Uses AI to match lesson content to curriculum standards
 */

import { genAI, CHILD_SAFETY_SETTINGS } from '../../config/gemini.js';
import { config } from '../../config/index.js';
import { CurriculumType, Subject } from '@prisma/client';
import { logger } from '../../utils/logger.js';
import { curriculumService, StandardWithContext } from './curriculumService.js';

export interface AlignedStandard {
  id: string;
  notation: string | null;
  description: string;
  strand: string | null;
  alignmentStrength: number; // 0.0 - 1.0
  isPrimary: boolean; // Is this a primary alignment (vs supporting)?
  relevanceNote?: string; // AI explanation of why this standard applies
  gradeLevel: number | null;
}

export interface AlignmentResult {
  alignedStandards: AlignedStandard[];
  primaryStandards: AlignedStandard[]; // Standards with isPrimary = true
  totalStandardsChecked: number;
  curriculumUsed: string;
  subjectUsed: string;
  gradeLevelUsed: number;
  tokensUsed?: number;
}

/**
 * Parse grade level from string to number
 * Handles various formats: "3", "Grade 3", "Year 3", "K", etc.
 */
function parseGradeLevel(gradeStr: string | undefined | null): number {
  if (!gradeStr) return 4; // Default to Grade 4

  const str = gradeStr.toString().toLowerCase().trim();

  // Handle "K" for Kindergarten
  if (str === 'k' || str === 'kindergarten' || str === 'pre-k') {
    return 0;
  }

  // Extract number from string
  const numMatch = str.match(/\d+/);
  if (numMatch) {
    const num = parseInt(numMatch[0], 10);
    // Clamp to valid range 0-9
    return Math.max(0, Math.min(9, num));
  }

  return 4; // Default
}

/**
 * Align lesson content to curriculum standards using AI
 *
 * @param lessonContent - The text content of the lesson
 * @param detectedSubject - Subject detected from AI analysis (e.g., "MATH", "SCIENCE")
 * @param detectedGradeLevel - Grade level detected from AI analysis (e.g., "5", "Grade 5")
 * @param curriculumType - The curriculum to align to (e.g., "BRITISH")
 * @param childGradeLevel - The child's actual grade level (fallback)
 */
export async function alignContentToStandards(
  lessonContent: string,
  detectedSubject: string | undefined,
  detectedGradeLevel: string | undefined,
  curriculumType: CurriculumType,
  childGradeLevel?: number | null
): Promise<AlignmentResult> {
  // Normalize subject
  const subject = curriculumService.normalizeSubject(detectedSubject);

  if (!subject) {
    logger.info('No valid subject detected, skipping alignment', { detectedSubject });
    return {
      alignedStandards: [],
      primaryStandards: [],
      totalStandardsChecked: 0,
      curriculumUsed: curriculumType,
      subjectUsed: 'UNKNOWN',
      gradeLevelUsed: childGradeLevel || 4,
    };
  }

  // Determine grade level to use
  const gradeLevel = parseGradeLevel(detectedGradeLevel) || childGradeLevel || 4;

  logger.info('Starting content-standard alignment', {
    subject,
    gradeLevel,
    curriculumType,
    contentLength: lessonContent.length,
  });

  // Get standards for this grade and adjacent grades (for fuzzy matching)
  const standards = await curriculumService.getStandardsWithAdjacentGrades(
    curriculumType,
    subject,
    gradeLevel,
    true // Include adjacent grades
  );

  if (standards.length === 0) {
    logger.warn('No standards found for alignment', {
      curriculumType,
      subject,
      gradeLevel,
    });
    return {
      alignedStandards: [],
      primaryStandards: [],
      totalStandardsChecked: 0,
      curriculumUsed: curriculumType,
      subjectUsed: subject,
      gradeLevelUsed: gradeLevel,
    };
  }

  // Prepare standards for AI prompt (limit to avoid token overflow)
  // Group by strand for better organization
  const standardsByStrand = groupStandardsByStrand(standards);
  const standardsForPrompt = formatStandardsForPrompt(standardsByStrand, 100); // Max 100 standards

  logger.info(`Prepared ${standards.length} standards for alignment`, {
    strands: Object.keys(standardsByStrand),
    standardsInPrompt: standardsForPrompt.split('\n').filter(l => l.startsWith('-')).length,
  });

  // Build AI prompt
  const prompt = buildAlignmentPrompt(lessonContent, standardsForPrompt, subject, gradeLevel);

  // Call Gemini for alignment
  const model = genAI.getGenerativeModel({
    model: config.gemini.models.flash, // Use Flash for speed
    safetySettings: CHILD_SAFETY_SETTINGS,
    generationConfig: {
      temperature: 0.2, // Low temperature for consistent results
      maxOutputTokens: 4000,
      responseMimeType: 'application/json',
    },
  });

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const tokensUsed = result.response.usageMetadata?.totalTokenCount;

    // Parse AI response with robust error handling
    let aiAlignments: Array<{
      notation: string;
      alignmentStrength: number;
      isPrimary: boolean;
      relevanceNote?: string;
    }> = [];

    try {
      aiAlignments = JSON.parse(responseText);
    } catch (parseError) {
      // Try to extract valid JSON array from response
      const jsonMatch = responseText.match(/\[[\s\S]*?\]/);
      if (jsonMatch) {
        try {
          aiAlignments = JSON.parse(jsonMatch[0]);
        } catch {
          logger.warn('Could not parse AI alignment response', {
            responsePreview: responseText.substring(0, 200)
          });
        }
      }
    }

    // Validate and filter results
    aiAlignments = aiAlignments.filter(a =>
      a && typeof a.notation === 'string' &&
      typeof a.alignmentStrength === 'number'
    );

    logger.info('AI alignment completed', {
      alignmentsFound: aiAlignments.length,
      tokensUsed,
    });

    // Map AI results back to full standard objects
    const alignedStandards: AlignedStandard[] = [];

    for (const alignment of aiAlignments) {
      const standard = standards.find(s => s.notation === alignment.notation);
      if (standard) {
        alignedStandards.push({
          id: standard.id,
          notation: standard.notation,
          description: standard.description,
          strand: standard.strand,
          alignmentStrength: alignment.alignmentStrength,
          isPrimary: alignment.isPrimary,
          relevanceNote: alignment.relevanceNote,
          gradeLevel: standard.standardSet.gradeLevel,
        });
      }
    }

    // Sort by alignment strength
    alignedStandards.sort((a, b) => b.alignmentStrength - a.alignmentStrength);

    return {
      alignedStandards,
      primaryStandards: alignedStandards.filter(s => s.isPrimary),
      totalStandardsChecked: standards.length,
      curriculumUsed: curriculumType,
      subjectUsed: subject,
      gradeLevelUsed: gradeLevel,
      tokensUsed,
    };
  } catch (error) {
    logger.error('AI alignment failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    // Return empty result on error - don't fail the whole lesson
    return {
      alignedStandards: [],
      primaryStandards: [],
      totalStandardsChecked: standards.length,
      curriculumUsed: curriculumType,
      subjectUsed: subject,
      gradeLevelUsed: gradeLevel,
    };
  }
}

/**
 * Group standards by strand for organized prompt
 */
function groupStandardsByStrand(standards: StandardWithContext[]): Record<string, StandardWithContext[]> {
  const grouped: Record<string, StandardWithContext[]> = {};

  for (const standard of standards) {
    const strand = standard.strand || 'General';
    if (!grouped[strand]) {
      grouped[strand] = [];
    }
    grouped[strand].push(standard);
  }

  return grouped;
}

/**
 * Format standards for AI prompt in a readable way
 */
function formatStandardsForPrompt(
  standardsByStrand: Record<string, StandardWithContext[]>,
  maxStandards: number
): string {
  const lines: string[] = [];
  let count = 0;

  for (const [strand, standards] of Object.entries(standardsByStrand)) {
    if (count >= maxStandards) break;

    lines.push(`\n### ${strand}`);

    for (const standard of standards) {
      if (count >= maxStandards) break;

      const gradeNote = standard.standardSet.gradeLevel
        ? ` (Year ${standard.standardSet.gradeLevel})`
        : '';
      lines.push(`- ${standard.notation}${gradeNote}: ${standard.description}`);
      count++;
    }
  }

  return lines.join('\n');
}

/**
 * Build the AI prompt for alignment
 */
function buildAlignmentPrompt(
  lessonContent: string,
  standardsText: string,
  subject: string,
  gradeLevel: number
): string {
  // Truncate lesson content if too long
  const maxContentLength = 6000;
  const truncatedContent = lessonContent.length > maxContentLength
    ? lessonContent.substring(0, maxContentLength) + '\n\n[Content truncated...]'
    : lessonContent;

  return `You are an expert curriculum alignment specialist. Analyze the following lesson content and identify which curriculum standards it addresses.

## LESSON CONTENT
Subject: ${subject}
Target Grade: Year ${gradeLevel}

${truncatedContent}

## AVAILABLE CURRICULUM STANDARDS
${standardsText}

## YOUR TASK
Identify which standards this lesson content addresses. For each match:
1. Consider if the content teaches, reinforces, or assesses the standard
2. Rate alignment strength (0.0-1.0):
   - 1.0 = Directly teaches this exact skill/concept
   - 0.7-0.9 = Strongly related, covers most of the standard
   - 0.5-0.6 = Partially covers, or prepares for this standard
   - 0.3-0.4 = Tangentially related
   - Below 0.3 = Not a meaningful match (don't include)
3. Mark as primary (true) if it's a main focus of the lesson, or false if supporting

## RESPONSE FORMAT
Return a JSON array of matched standards. Only include standards with alignmentStrength >= 0.3.
Limit to the top 10 most relevant standards.

Example:
[
  {
    "notation": "UK.KS2.Y5.MA.NFR.1",
    "alignmentStrength": 0.95,
    "isPrimary": true,
    "relevanceNote": "Lesson directly teaches adding fractions with same denominators"
  },
  {
    "notation": "UK.KS2.Y5.MA.NFR.3",
    "alignmentStrength": 0.6,
    "isPrimary": false,
    "relevanceNote": "Prerequisites covered in examples"
  }
]

If no standards match well (all below 0.3), return an empty array: []

Respond with ONLY the JSON array, no other text.`;
}

/**
 * Quick alignment check - just identifies primary standards without detailed analysis
 * Useful for displaying "This lesson covers: X, Y, Z" without full alignment
 */
export async function quickAlignmentCheck(
  lessonSummary: string,
  keyConcepts: string[],
  subject: string | undefined,
  gradeLevel: number,
  curriculumType: CurriculumType
): Promise<string[]> {
  const normalizedSubject = curriculumService.normalizeSubject(subject);

  if (!normalizedSubject) {
    return [];
  }

  // Get standards for exact grade only
  const standards = await curriculumService.getStandardsForGrade(
    curriculumType,
    normalizedSubject,
    gradeLevel
  );

  if (standards.length === 0) {
    return [];
  }

  // Build a simplified prompt
  const conceptsText = keyConcepts.join(', ');
  const standardsList = standards
    .slice(0, 50) // Limit for speed
    .map(s => `${s.notation}: ${s.description}`)
    .join('\n');

  const prompt = `Given this lesson summary and key concepts, list the notation codes of standards that are DIRECTLY addressed (max 5).

Summary: ${lessonSummary}
Key Concepts: ${conceptsText}

Standards:
${standardsList}

Return ONLY a JSON array of notation strings, e.g.: ["UK.KS2.Y5.MA.NFR.1", "UK.KS2.Y5.MA.NFR.2"]
If no direct matches, return: []`;

  try {
    const model = genAI.getGenerativeModel({
      model: config.gemini.models.flash,
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 500,
        responseMimeType: 'application/json',
      },
    });

    const result = await model.generateContent(prompt);
    const notations = JSON.parse(result.response.text()) as string[];

    return notations.slice(0, 5);
  } catch (error) {
    logger.error('Quick alignment check failed', { error });
    return [];
  }
}

export const alignmentService = {
  alignContentToStandards,
  quickAlignmentCheck,
  parseGradeLevel,
};
