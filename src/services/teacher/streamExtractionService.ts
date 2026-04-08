// Stream Extraction Service — AI tag extraction from teacher stream entries
// Uses Gemini Flash for fast, cheap extraction of subjects, topics, standards, signals
import { genAI, TEACHER_CONTENT_SAFETY_SETTINGS } from '../../config/gemini.js';
import { config } from '../../config/index.js';
import { prisma } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import { curriculumAdapterService } from './curriculumAdapterService.js';
import { normalizeTopicSubjectToEnum } from './teachingGraphService.js';

const FLASH_MODEL = config.gemini.models.flash;

// Upper bounds for the curriculum grounding block injected into the extraction
// prompt. Phase 4.8 Item 1 — keeps prompt growth bounded while giving Gemini
// enough real standards to pick from instead of hallucinating codes.
const GROUNDING_MAX_STANDARDS = 50;
const GROUNDING_DESCRIPTION_MAX_CHARS = 120;
const GROUNDING_MAX_SUBJECTS = 3;

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

export interface Recommendation {
  text: string;
  type: 'generate' | 'explore' | 'tip';
  materialType?: string; // LESSON_PLAN, QUIZ, WORKSHEET, RETEACH_ACTIVITY, PARENT_UPDATE, SUB_PLAN, FLASHCARDS
  topic?: string;
}

export interface StudentMentionExtracted {
  name: string;
  type: 'INDIVIDUAL' | 'GROUP';
}

export interface CurriculumSignals {
  /**
   * True when the current entry's topic(s) are a prerequisite for something
   * the teacher has flagged as an upcoming topic in their curriculum state.
   * Populated by streamExtractionJob AFTER the graph has been updated — not
   * by the Gemini extraction itself.
   *
   * Graceful no-op until `LearningStandard.prerequisites`/`progressesTo` are
   * populated (Phase 4.8 Phase B data backfill). Will always be false while
   * the data is still dark.
   */
  isPrerequisiteForUpcoming: boolean;
}

export interface ExtractedTags {
  subjects: string[];
  topics: string[];
  standards: Array<{ code: string; description: string }>;
  signals: Array<{ type: string; content: string }>;
  recommendations: Recommendation[];
  studentMentions: StudentMentionExtracted[];
  /**
   * Post-extraction curriculum signals — added by streamExtractionJob after
   * the graph has been updated. Optional so legacy entries without it still
   * parse cleanly. Frontend should default to `false` when absent.
   */
  curriculumSignals?: CurriculumSignals;
}

// ============================================
// EXTRACTION
// ============================================

/**
 * Build a compact curriculum grounding block for the extraction prompt.
 * Queries LearningStandard for the teacher's curriculum + grade + subjects
 * and formats up to GROUNDING_MAX_STANDARDS rows grouped by strand. Returns
 * the empty string if the teacher's profile doesn't have enough context OR
 * if the lookup fails (non-fatal — extraction still runs without grounding).
 *
 * Phase 4.8 Item 1: gives Gemini a menu of real standards to pick from
 * instead of hallucinating codes from its training data. Without this, the
 * `matchStandard` fuzzy-matching step in processStreamEntry has to rescue
 * invented notations — with this, Gemini usually picks real ones on the
 * first try.
 */
async function fetchCurriculumGroundingForProfile(
  profile: TeacherProfile
): Promise<string> {
  // Need curriculum + at least one grade reference to fetch anything sensible.
  const curriculum = profile.preferredCurriculum;
  const gradeLevel =
    profile.gradeRange || profile.gradesTaught?.[0] || '';
  if (!curriculum || !gradeLevel) return '';

  // Union of primary subject + subjectsTaught, normalized to Prisma Subject
  // enum values via the shared normalizer. Drops pseudo-subjects (planning,
  // communication, admin) and unrecognized inputs. Capped to keep the
  // resulting standards list bounded.
  const rawSubjects: string[] = [
    profile.primarySubject ?? '',
    ...(profile.subjectsTaught ?? []),
  ].filter(Boolean) as string[];

  const normalizedSubjects = new Set<string>();
  for (const raw of rawSubjects) {
    const normalized = normalizeTopicSubjectToEnum(raw);
    if (normalized) normalizedSubjects.add(normalized);
    if (normalizedSubjects.size >= GROUNDING_MAX_SUBJECTS) break;
  }

  try {
    const standards = await curriculumAdapterService.getStandardsForTeacher(
      curriculum,
      gradeLevel,
      [...normalizedSubjects]
    );
    if (!standards.length) return '';

    // Already ordered by depth asc, position asc — take the foundational
    // slice first. 50 standards is ~5-6K chars = ~1.5K tokens, within Flash budget.
    const limited = standards.slice(0, GROUNDING_MAX_STANDARDS);

    // Group by strand for readability. Preserve the original order within
    // each strand (so depth asc, position asc is maintained).
    const byStrand = new Map<string, typeof limited>();
    for (const s of limited) {
      const key = s.strand || '(general)';
      const list = byStrand.get(key) || [];
      list.push(s);
      byStrand.set(key, list);
    }

    const lines: string[] = [];
    for (const [strand, list] of byStrand) {
      lines.push(`  [${strand}]`);
      for (const s of list) {
        const desc =
          s.description.length > GROUNDING_DESCRIPTION_MAX_CHARS
            ? s.description.slice(0, GROUNDING_DESCRIPTION_MAX_CHARS - 3) + '...'
            : s.description;
        lines.push(`  - ${s.code}: ${desc}`);
      }
    }
    return lines.join('\n');
  } catch (err) {
    logger.warn('Curriculum grounding fetch failed', {
      curriculum,
      gradeLevel,
      error: (err as Error).message,
    });
    return '';
  }
}

function buildExtractionPrompt(
  content: string,
  profile: TeacherProfile,
  curriculumGrounding: string = ''
): string {
  const gradeInfo = profile.gradeRange || profile.gradesTaught?.join(', ') || 'unknown';
  const subjectInfo = profile.primarySubject || profile.subjectsTaught?.join(', ') || 'unknown';
  const curriculumInfo = profile.preferredCurriculum || 'unknown';

  const groundingBlock = curriculumGrounding
    ? `\n\nAvailable curriculum standards for this teacher (use these exact codes when the note clearly relates to a listed standard — do NOT invent new codes):\n${curriculumGrounding}`
    : '';

  const standardsInstruction = curriculumGrounding
    ? 'Curriculum standards that the note clearly relates to. **ONLY use notation codes from the "Available curriculum standards" list above.** Do NOT invent, abbreviate, or guess codes. If the note does not clearly map to a listed standard, leave this array empty. The description you return must match the description in the list.'
    : 'Curriculum standards that could be linked. Only include if reasonably confident. OK to leave empty.';

  return `You are a smart teaching assistant analyzing a teacher's note. Your job is to extract metadata AND provide actionable recommendations that add real value.

Teacher context:
- Grade level: ${gradeInfo}
- Subject(s): ${subjectInfo}
- Curriculum: ${curriculumInfo}${groundingBlock}

Extract the following:

1. **subjects**: Academic subjects mentioned or implied. Use lowercase. Even if the note is about teaching conditions, infer the teacher's domain (e.g., if they teach math and mention "online teaching", subjects might include their primary subject).
2. **topics**: Teaching-relevant concepts or themes. Go broad — include both academic topics AND pedagogical topics. Examples:
   - Academic: "fractions", "water cycle", "persuasive writing"
   - Pedagogical: "online teaching", "remote learning", "differentiation", "classroom management", "student engagement", "assessment strategies"
   - Situational: "crisis teaching", "distance education", "hybrid classroom"
   Always extract at least 1-2 topics. Every teacher note is about SOMETHING.
3. **standards**: ${standardsInstruction}
4. **signals**: Teaching signals. Types: "reteach", "schedule", "observation", "preference", "reflection", "idea", "concern", "success". Keep the content field SHORT (under 30 chars).
5. **recommendations**: 2-3 specific, actionable suggestions based on this note. Each recommendation should help the teacher DO something useful RIGHT NOW. Types:
   - "generate": Suggest creating a specific material. Set materialType to one of: LESSON_PLAN, QUIZ, WORKSHEET, RETEACH_ACTIVITY, PARENT_UPDATE, SUB_PLAN, FLASHCARDS. Set topic to what the material should be about.
   - "tip": A practical teaching tip or strategy relevant to what they wrote. No materialType needed.
   - "explore": Suggest exploring a related topic or approach. Set topic to what to explore.

   Examples:
   - Note: "kids struggled with fractions today" → recommend: generate a RETEACH_ACTIVITY on "fractions", tip "Try using visual fraction bars", generate WORKSHEET on "fraction practice"
   - Note: "teaching online now due to mandate" → recommend: generate LESSON_PLAN on "engaging online lessons", tip "Use breakout rooms for small group practice", generate PARENT_UPDATE on "transitioning to online learning"
   - Note: "loved how the science experiment went" → recommend: generate LESSON_PLAN to "build on this momentum", tip "Have students write reflections to reinforce learning", explore "inquiry-based science extensions"

   ALWAYS provide 2-3 recommendations. Be specific and helpful, not generic.

6. **studentMentions**: Extract any student names or student group references mentioned.
   Return as: [{ "name": "Ahmed", "type": "INDIVIDUAL" }, { "name": "Blue group", "type": "GROUP" }]
   Only extract names that clearly refer to students. Do not extract subject names, place names,
   book character names, or other proper nouns. If unsure, omit. OK to leave empty.

Respond with ONLY valid JSON:
{
  "subjects": ["string"],
  "topics": ["string"],
  "standards": [{"code": "string", "description": "string"}],
  "signals": [{"type": "string", "content": "short description"}],
  "recommendations": [{"text": "string", "type": "generate|tip|explore", "materialType": "optional", "topic": "optional"}],
  "studentMentions": [{"name": "string", "type": "INDIVIDUAL|GROUP"}]
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
  // Pre-fetch curriculum grounding so Gemini chooses codes from a real list
  // instead of hallucinating from training data. Non-fatal — returns empty
  // string if the profile lacks context or the DB lookup fails.
  const curriculumGrounding = await fetchCurriculumGroundingForProfile(profile);
  const prompt = buildExtractionPrompt(entryContent, profile, curriculumGrounding);

  const model = genAI.getGenerativeModel({
    model: FLASH_MODEL,
    safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 3000,
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
      tags = { subjects: [], topics: [], standards: [], signals: [], recommendations: [], studentMentions: [] };
    }
  }

  // Normalize: ensure arrays exist
  tags.subjects = tags.subjects || [];
  tags.topics = tags.topics || [];
  tags.standards = tags.standards || [];
  tags.signals = tags.signals || [];
  tags.recommendations = tags.recommendations || [];
  tags.studentMentions = tags.studentMentions || [];

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
