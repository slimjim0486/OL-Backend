import { TokenOperation } from '@prisma/client';
import { genAI, TEACHER_CONTENT_SAFETY_SETTINGS } from '../../config/gemini.js';
import { config } from '../../config/index.js';
import { quotaService } from './quotaService.js';
import { logger } from '../../utils/logger.js';
import { getGeminiResponseText, parseModelJson } from '../../utils/modelJson.js';

const MODEL = config.gemini.models.flash;

export interface LessonReviewInput {
  lessonText: string;
  title?: string;
  subject?: string;
  gradeLevel?: string;
  teacherNotes?: string;
}

export interface LessonRubricCategory {
  category: string;
  score: number; // 1-4
  whatIsWorking?: string;
  whatToImprove?: string;
  nextStep?: string;
}

export interface LessonReviewReport {
  lessonTitle?: string;
  overallScore?: number; // 0-100
  overallRating?: string; // "Strong", "Developing", etc.
  summary?: string;
  rubric?: LessonRubricCategory[];
  strengths?: string[];
  improvements?: Array<{
    title: string;
    why: string;
    how: string;
  }>;
  questions?: string[];
}

export interface LessonReviewResult {
  report: LessonReviewReport;
  markdown: string;
  tokensUsed: number;
  modelUsed: string;
}

function truncate(text: string, max: number): string {
  const s = String(text || '');
  if (s.length <= max) return s;
  return `${s.slice(0, max)}...`;
}

function trimLessonTextForPrompt(text: string, maxChars: number): { text: string; truncated: boolean } {
  const raw = String(text || '').trim();
  if (raw.length <= maxChars) return { text: raw, truncated: false };

  // Keep start + end so we capture objectives and closures/assessments.
  const head = raw.slice(0, Math.floor(maxChars * 0.75));
  const tail = raw.slice(-Math.floor(maxChars * 0.25));
  return {
    text: `${head}\n\n[...TRUNCATED...]\n\n${tail}`,
    truncated: true,
  };
}

function safeNumber(value: unknown, fallback: number): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function computeOverallScore(rubric?: LessonRubricCategory[]): number | null {
  if (!Array.isArray(rubric) || rubric.length === 0) return null;
  const scores = rubric
    .map((r) => safeNumber((r as any)?.score, NaN))
    .filter((n) => Number.isFinite(n))
    .map((n) => clamp(n, 1, 4));
  if (scores.length === 0) return null;
  const avg4 = scores.reduce((a, b) => a + b, 0) / scores.length;
  return Math.round((avg4 / 4) * 100);
}

function formatLessonReviewMarkdown(input: LessonReviewInput, report: LessonReviewReport): string {
  const title =
    report.lessonTitle ||
    input.title ||
    'Lesson Review';
  const overallScore = Number.isFinite(report.overallScore as any)
    ? clamp(Math.round(Number(report.overallScore)), 0, 100)
    : computeOverallScore(report.rubric) ?? null;

  const overallRating = report.overallRating ? String(report.overallRating) : null;
  const summary = report.summary ? String(report.summary).trim() : '';
  const strengths = Array.isArray(report.strengths) ? report.strengths.filter(Boolean).map(String) : [];
  const improvements = Array.isArray(report.improvements) ? report.improvements : [];
  const questions = Array.isArray(report.questions) ? report.questions.filter(Boolean).map(String) : [];
  const rubric = Array.isArray(report.rubric) ? report.rubric : [];

  const metaParts: string[] = [];
  if (input.subject) metaParts.push(`**Subject:** ${input.subject}`);
  if (input.gradeLevel) metaParts.push(`**Grade:** ${input.gradeLevel}`);
  if (metaParts.length === 0) metaParts.push('**Context:** (subject/grade not provided)');

  const lines: string[] = [];
  lines.push(`## Rubric Lesson Review`);
  lines.push(`**Lesson:** ${title}`);
  lines.push(metaParts.join(' · '));
  if (overallScore != null) {
    lines.push(`**Overall:** ${overallScore}/100${overallRating ? ` (${overallRating})` : ''}`);
  }
  lines.push('');

  if (summary) {
    lines.push(`### Executive Summary`);
    lines.push(summary);
    lines.push('');
  }

  if (rubric.length > 0) {
    lines.push(`### Rubric`);
    lines.push(`| Area | Score (1-4) | What's working | Needs work | Next step |`);
    lines.push(`|---|---:|---|---|---|`);

    for (const row of rubric.slice(0, 10)) {
      const area = truncate(String(row.category || 'Area'), 60).replace(/\|/g, '\\|');
      const score = clamp(safeNumber((row as any).score, 2), 1, 4);
      const working = truncate(String((row as any).whatIsWorking || ''), 140).replace(/\|/g, '\\|');
      const improve = truncate(String((row as any).whatToImprove || ''), 140).replace(/\|/g, '\\|');
      const next = truncate(String((row as any).nextStep || ''), 120).replace(/\|/g, '\\|');
      lines.push(`| ${area} | ${score} | ${working} | ${improve} | ${next} |`);
    }
    lines.push('');
  }

  if (strengths.length > 0) {
    lines.push(`### What's Good`);
    strengths.slice(0, 6).forEach((s) => lines.push(`- ${s}`));
    lines.push('');
  }

  if (improvements.length > 0) {
    lines.push(`### What Needs Work (High Impact)`);
    improvements.slice(0, 5).forEach((item, idx) => {
      const titleLine = item?.title ? String(item.title) : `Improvement ${idx + 1}`;
      const why = item?.why ? String(item.why) : '';
      const how = item?.how ? String(item.how) : '';
      lines.push(`${idx + 1}. **${titleLine}**`);
      if (why) lines.push(`Why: ${why}`);
      if (how) lines.push(`How: ${how}`);
    });
    lines.push('');
  }

  if (questions.length > 0) {
    lines.push(`### Questions To Clarify`);
    questions.slice(0, 6).forEach((q) => lines.push(`- ${q}`));
    lines.push('');
  }

  if (input.teacherNotes) {
    lines.push(`---`);
    lines.push(`**Your notes considered:** ${truncate(String(input.teacherNotes).trim(), 400)}`);
  }

  return lines.join('\n');
}

export const lessonReviewService = {
  async reviewLesson(teacherId: string, input: LessonReviewInput): Promise<LessonReviewResult> {
    const estimatedTokens = 6000;
    await quotaService.enforceQuota(teacherId, TokenOperation.CONTENT_ANALYSIS, estimatedTokens);

    const trimmed = trimLessonTextForPrompt(input.lessonText, 45000);

    const prompt = `You are an expert instructional coach.
Your job: review a teacher's lesson and provide an honest, rubric-style report.

Tone rules:
- Be specific and direct. No generic praise.
- If information is missing, say so and ask 2-4 short clarifying questions.
- Do not mention that you are an AI. Do not include any policy text.

Context (if provided):
- Lesson title: ${input.title || 'Unknown'}
- Subject: ${input.subject || 'Unknown'}
- Grade level: ${input.gradeLevel || 'Unknown'}
- Teacher notes: ${input.teacherNotes ? truncate(input.teacherNotes, 800) : 'None'}

Rubric scoring:
- Score each area from 1 to 4 (1=missing/weak, 2=developing, 3=solid, 4=excellent).

Rubric areas (use these exact labels):
1) Objectives & Success Criteria
2) Lesson Flow & Timing
3) Student Engagement & Cognitive Demand
4) Checks for Understanding & Assessment
5) Differentiation & Accessibility (UDL)
6) Clarity of Directions & Materials
7) Standards Alignment (if inferable)
8) Classroom Feasibility (management, transitions)

Return ONLY valid JSON with this shape:
{
  "lessonTitle": "string",
  "summary": "string (short paragraph)",
  "rubric": [
    { "category": "Objectives & Success Criteria", "score": 1, "whatIsWorking": "string", "whatToImprove": "string", "nextStep": "string" }
  ],
  "strengths": ["string"],
  "improvements": [{ "title": "string", "why": "string", "how": "string" }],
  "questions": ["string"]
}

Lesson text${trimmed.truncated ? ' (NOTE: may be truncated)' : ''}:
${trimmed.text}`;

    const model = genAI.getGenerativeModel({
      model: MODEL,
      safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
      generationConfig: {
        temperature: 0.35,
        maxOutputTokens: 2500,
        responseMimeType: 'application/json',
      },
    });

    const result = await model.generateContent(prompt);
    const response = getGeminiResponseText(result, 'Lesson review', estimatedTokens);
    const responseText = response.text;
    const tokensUsed = response.tokensUsed;

    let parsed: LessonReviewReport = {};
    try {
      parsed = parseModelJson<LessonReviewReport>(responseText, {
        contextLabel: 'Lesson review',
        normalize: (value) => value as LessonReviewReport,
      });
    } catch (error) {
      logger.warn('Lesson review JSON parse failed; falling back to plain text', {
        teacherId,
        error: error instanceof Error ? error.message : String(error),
        responsePreview: responseText.slice(0, 200),
      });
      parsed = {
        lessonTitle: input.title || 'Lesson Review',
        summary: responseText,
        rubric: [],
        strengths: [],
        improvements: [],
        questions: [],
      };
    }

    // Best-effort overall score derivation.
    if (!Number.isFinite(parsed.overallScore as any)) {
      const computed = computeOverallScore(parsed.rubric);
      if (computed != null) {
        parsed.overallScore = computed;
      }
    }

    const markdown = formatLessonReviewMarkdown(input, parsed);

    await quotaService.recordUsage({
      teacherId,
      operation: TokenOperation.CONTENT_ANALYSIS,
      tokensUsed,
      modelUsed: MODEL,
      resourceType: 'lesson_review',
    });

    return {
      report: parsed,
      markdown,
      tokensUsed,
      modelUsed: MODEL,
    };
  },
};
