// Stream Extraction Service — AI tag extraction from teacher stream entries
// Uses Gemini Flash for fast, cheap extraction of subjects, topics, standards, signals
import { genAI, TEACHER_CONTENT_SAFETY_SETTINGS } from '../../config/gemini.js';
import { config } from '../../config/index.js';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

const FLASH_MODEL = config.gemini.models.flash;

// ============================================
// TYPES
// ============================================

export interface TeacherProfile {
  gradeRange?: string | null;
  primarySubject?: string | null;
  preferredCurriculum?: string | null;
  gradesTaught?: string[];
  subjectsTaught?: string[];
}

export interface ExtractedTags {
  subjects: string[];
  topics: string[];
  standards: Array<{ code: string; description: string }>;
  signals: Array<{ type: string; content: string }>;
}

// ============================================
// EXTRACTION
// ============================================

function buildExtractionPrompt(content: string, profile: TeacherProfile): string {
  const gradeInfo = profile.gradeRange || profile.gradesTaught?.join(', ') || 'unknown';
  const subjectInfo = profile.primarySubject || profile.subjectsTaught?.join(', ') || 'unknown';
  const curriculumInfo = profile.preferredCurriculum || 'unknown';

  return `You are an AI assistant that extracts structured metadata from a teacher's informal notes.

Teacher context:
- Grade level: ${gradeInfo}
- Subject(s): ${subjectInfo}
- Curriculum: ${curriculumInfo}

Extract the following from the teacher's note:

1. **subjects**: Academic subjects mentioned (e.g., "mathematics", "science", "english", "reading", "social studies"). Use lowercase.
2. **topics**: Specific topics or concepts mentioned (e.g., "fractions", "water cycle", "persuasive writing", "multiplication"). Use lowercase.
3. **standards**: Any curriculum standards that could be linked to the topics. Provide the most likely standard code and a short description. Only include if you are reasonably confident.
4. **signals**: Teaching signals detected. Types:
   - "reteach": Student needs to revisit a topic
   - "schedule": Something planned for a specific time/day
   - "observation": Student behavior or performance observation
   - "preference": Teaching preference or material preference
   - "reflection": Teacher reflecting on what worked/didn't work
   - "idea": New teaching idea or approach
   - "concern": A concern or challenge
   - "success": Something that went well

IMPORTANT: Extract what's actually in the note. Don't invent or assume. If nothing matches a category, return an empty array for it.

Respond with ONLY valid JSON:
{
  "subjects": ["string"],
  "topics": ["string"],
  "standards": [{"code": "string", "description": "string"}],
  "signals": [{"type": "string", "content": "string"}]
}

Teacher's note:
"""
${content}
"""`;
}

async function extractTags(
  entryContent: string,
  profile: TeacherProfile
): Promise<{ tags: ExtractedTags; tokensUsed: number }> {
  const prompt = buildExtractionPrompt(entryContent, profile);

  const model = genAI.getGenerativeModel({
    model: FLASH_MODEL,
    safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 2000,
      responseMimeType: 'application/json',
    },
  });

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  const tokensUsed = response.usageMetadata?.totalTokenCount || 500;

  let tags: ExtractedTags;
  try {
    // Try parsing directly
    tags = JSON.parse(text);
  } catch {
    // Try extracting JSON from markdown code block
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      tags = JSON.parse(jsonMatch[1]);
    } else {
      logger.warn('Failed to parse extraction response', { text: text.substring(0, 500) });
      tags = { subjects: [], topics: [], standards: [], signals: [] };
    }
  }

  // Normalize: ensure arrays exist
  tags.subjects = tags.subjects || [];
  tags.topics = tags.topics || [];
  tags.standards = tags.standards || [];
  tags.signals = tags.signals || [];

  return { tags, tokensUsed };
}

async function getTeacherProfile(teacherId: string): Promise<TeacherProfile> {
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    select: {
      gradeRange: true,
      primarySubject: true,
      preferredCurriculum: true,
      agentProfile: {
        select: {
          gradesTaught: true,
          subjectsTaught: true,
          curriculumType: true,
        },
      },
    },
  });

  if (!teacher) {
    throw new Error('Teacher not found');
  }

  return {
    gradeRange: teacher.gradeRange,
    primarySubject: teacher.primarySubject,
    preferredCurriculum: teacher.preferredCurriculum || teacher.agentProfile?.curriculumType || null,
    gradesTaught: teacher.agentProfile?.gradesTaught || [],
    subjectsTaught: teacher.agentProfile?.subjectsTaught?.map(s => s.toString()) || [],
  };
}

// ============================================
// EXPORT
// ============================================

export const streamExtractionService = {
  extractTags,
  getTeacherProfile,
  buildExtractionPrompt,
};
