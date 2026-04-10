// Completion Service — Teacher Intelligence Platform
// Hybrid inline completions: local prefix matching + AI fallback
// Surface-aware: stream, parent_email, iep_goal, sub_plan, report_comment
import { prisma } from '../../config/database.js';
import { genAI, TEACHER_CONTENT_SAFETY_SETTINGS } from '../../config/gemini.js';
import { logger } from '../../utils/logger.js';

// ============================================
// TYPES
// ============================================

export type CompletionSurface = 'stream' | 'parent_email' | 'iep_goal' | 'sub_plan' | 'report_comment';

export interface CompletionContext {
  studentName?: string;
  subject?: string;
  materialType?: string;
  topic?: string;
}

export interface CompletionResult {
  text: string;
  confidence: number;
  source: 'local' | 'ai';
}

// ============================================
// THRESHOLDS
// ============================================

const MIN_ENTRIES_FOR_COMPLETIONS = 50;
const MIN_ACCOUNT_AGE_DAYS = 21;
const MIN_INPUT_LENGTH = 15;
const MAX_COMPLETION_LENGTH = 80;
const AI_TIMEOUT_MS = 2500;
const LOCAL_CONFIDENCE_THRESHOLD = 0.5;

// Surface → human-readable label for AI prompts
const SURFACE_LABELS: Record<CompletionSurface, string> = {
  stream: 'note-taking stream',
  parent_email: 'parent email',
  iep_goal: 'IEP goal',
  sub_plan: 'substitute teacher plan',
  report_comment: 'report card comment',
};

// ============================================
// ELIGIBILITY CHECK (read-only)
// ============================================

async function checkEligibility(teacherId: string): Promise<boolean> {
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    select: { completionsEnabled: true, completionsEligible: true },
  });
  return Boolean(teacher?.completionsEnabled && teacher?.completionsEligible);
}

// ============================================
// LAYER 1: LOCAL PREFIX MATCHING
// ============================================

/**
 * Gather text samples for prefix matching based on surface.
 * Stream entries are ALWAYS included — they contain the teacher's natural voice.
 */
async function getScanPool(
  teacherId: string,
  surface: CompletionSurface,
  context: CompletionContext
): Promise<string[]> {
  // Stream entries are always in the pool
  const streamEntries = await prisma.teacherStreamEntry.findMany({
    where: { teacherId, archived: false },
    select: { content: true },
    orderBy: { createdAt: 'desc' },
    take: surface === 'stream' ? 200 : 100,
  });

  const pool = streamEntries.map((e) => e.content);

  if (surface === 'parent_email') {
    try {
      const comms = await prisma.teacherCommunication.findMany({
        where: { teacherId, type: 'PARENT_EMAIL' },
        select: { content: true },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
      pool.push(...comms.map((c) => c.content).filter(Boolean));
    } catch { /* non-fatal */ }
  }

  if (surface === 'sub_plan') {
    try {
      const plans = await prisma.teacherMaterial.findMany({
        where: { teacherId, type: 'SUB_PLAN' },
        select: { content: true },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });
      pool.push(...plans.map((p) => typeof p.content === 'string' ? p.content : '').filter(Boolean));
    } catch { /* non-fatal */ }
  }

  if (surface === 'iep_goal') {
    // No dedicated IEP material type — scan stream entries mentioning the student
    // (already included above). Also pull any existing communications for voice data.
    try {
      const comms = await prisma.teacherCommunication.findMany({
        where: { teacherId },
        select: { content: true },
        orderBy: { createdAt: 'desc' },
        take: 30,
      });
      pool.push(...comms.map((c) => c.content).filter(Boolean));
    } catch { /* non-fatal */ }
  }

  if (surface === 'report_comment') {
    try {
      const comms = await prisma.teacherCommunication.findMany({
        where: { teacherId, type: 'REPORT_CARD_COMMENT' },
        select: { content: true },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
      pool.push(...comms.map((c) => c.content).filter(Boolean));
    } catch { /* non-fatal */ }
  }

  return pool;
}

async function getLocalCompletion(
  teacherId: string,
  currentInput: string,
  surface: CompletionSurface,
  context: CompletionContext
): Promise<CompletionResult | null> {
  const inputLower = currentInput.toLowerCase().trim();

  const pool = await getScanPool(teacherId, surface, context);
  if (pool.length === 0) return null;

  const minPrefixLen = Math.max(10, inputLower.length - 20);

  for (let prefixLen = inputLower.length; prefixLen >= minPrefixLen; prefixLen--) {
    const prefix = inputLower.slice(-prefixLen);
    const continuations: Map<string, number> = new Map();
    let matchCount = 0;

    for (const content of pool) {
      const contentLower = content.toLowerCase();
      const idx = contentLower.indexOf(prefix);
      if (idx === -1) continue;

      matchCount++;
      const afterPrefix = content.slice(idx + prefix.length).trim();
      if (!afterPrefix) continue;

      const sentenceEnd = afterPrefix.search(/[.!?\n]/);
      const continuation = sentenceEnd > 0
        ? afterPrefix.slice(0, Math.min(sentenceEnd + 1, MAX_COMPLETION_LENGTH))
        : afterPrefix.slice(0, MAX_COMPLETION_LENGTH);

      if (continuation.length < 3) continue;

      const key = continuation.toLowerCase();
      continuations.set(key, (continuations.get(key) || 0) + 1);
    }

    if (matchCount === 0) continue;

    let bestContinuation = '';
    let bestCount = 0;
    for (const [cont, count] of continuations) {
      if (count > bestCount) {
        bestCount = count;
        bestContinuation = cont;
      }
    }

    if (!bestContinuation) continue;

    const confidence = bestCount / Math.max(matchCount, 1);
    if (confidence >= LOCAL_CONFIDENCE_THRESHOLD) {
      // Return original-case version
      for (const content of pool) {
        const contentLower = content.toLowerCase();
        const idx = contentLower.indexOf(prefix);
        if (idx === -1) continue;
        const afterPrefix = content.slice(idx + prefix.length).trim();
        if (afterPrefix.toLowerCase().startsWith(bestContinuation.slice(0, 10).toLowerCase())) {
          const sentenceEnd = afterPrefix.search(/[.!?\n]/);
          const result = sentenceEnd > 0
            ? afterPrefix.slice(0, Math.min(sentenceEnd + 1, MAX_COMPLETION_LENGTH))
            : afterPrefix.slice(0, MAX_COMPLETION_LENGTH);
          return { text: result, confidence, source: 'local' };
        }
      }
      return { text: bestContinuation, confidence, source: 'local' };
    }
  }

  return null;
}

// ============================================
// STYLE GUIDANCE (from Edit Intelligence Loop)
// ============================================

function buildStyleGuidance(prefs: any): string {
  if (!prefs) return '';
  const lines: string[] = [];

  if (prefs.vocabularyTendency === 'simplifies_consistently')
    lines.push('Use simple, everyday language. Avoid jargon.');
  if (prefs.vocabularyTendency === 'elevates_consistently')
    lines.push('Use precise academic vocabulary.');

  if (prefs.lengthTendency === 'shortens_consistently')
    lines.push('Keep it brief — this teacher prefers concise text.');
  if (prefs.lengthTendency === 'lengthens_consistently')
    lines.push('This teacher writes detailed, thorough text.');

  if (prefs.toneTendency === 'more_casual')
    lines.push('Use a warm, casual tone.');
  if (prefs.toneTendency === 'more_formal')
    lines.push('Use a professional, formal tone.');
  if (prefs.toneTendency === 'more_encouraging')
    lines.push('Use an encouraging, positive tone.');

  // High-confidence learned patterns
  const patterns = Array.isArray(prefs.learnedPatterns) ? prefs.learnedPatterns : [];
  const confident = patterns
    .filter((p: any) => p && typeof p.pattern === 'string' && (p.confidence ?? 0) >= 0.7)
    .slice(0, 3);
  if (confident.length > 0) {
    lines.push('Specific style patterns:');
    confident.forEach((p: any) => lines.push(`  - ${p.pattern}`));
  }

  return lines.length > 0 ? lines.join('\n') : '';
}

// ============================================
// LAYER 2: AI COMPLETION (Gemini Flash)
// ============================================

async function getAICompletion(
  teacherId: string,
  currentInput: string,
  recentEntries: string[],
  surface: CompletionSurface,
  context: CompletionContext
): Promise<CompletionResult | null> {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: { gradeRange: true, primarySubject: true, preferredCurriculum: true },
    });

    const profileStr = [
      teacher?.gradeRange,
      teacher?.primarySubject,
      teacher?.preferredCurriculum,
    ].filter(Boolean).join(', ');

    const today = new Date().toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long',
    });

    // Build style guidance from edit intelligence loop (non-fatal, single DB query)
    let styleGuidance = '';
    try {
      const profile = await prisma.teacherPreferenceProfile.findUnique({
        where: { teacherId },
        select: {
          totalEdits: true,
          vocabularyTendency: true,
          lengthTendency: true,
          toneTendency: true,
          learnedPatterns: true,
          typePreferences: true,
        },
      });
      if (profile && (profile.totalEdits ?? 0) >= 5) {
        // Check for per-surface tone override
        const typePrefs = profile.typePreferences as any;
        const surfaceType = surface === 'parent_email' ? 'PARENT_UPDATE' : surface === 'sub_plan' ? 'SUB_PLAN' : null;
        if (surfaceType && typePrefs?.[surfaceType]?.toneTendency) {
          styleGuidance = buildStyleGuidance({ ...profile, toneTendency: typePrefs[surfaceType].toneTendency });
        } else {
          styleGuidance = buildStyleGuidance(profile);
        }
      }
    } catch { /* non-fatal */ }

    const surfaceLabel = SURFACE_LABELS[surface] || surface;
    const contextLines: string[] = [];
    if (context.studentName) contextLines.push(`Student: ${context.studentName}`);
    if (context.subject) contextLines.push(`Subject: ${context.subject}`);
    if (context.topic) contextLines.push(`Topic: ${context.topic}`);

    const prompt = `You are a completion engine for a teacher's ${surfaceLabel}.
Complete the teacher's current sentence. Return ONLY the completion text (the part after what they've already typed), no explanation. Maximum 1 sentence, maximum ${MAX_COMPLETION_LENGTH} characters.
If you're not confident, return exactly: NONE
NEVER guess student names — if the input seems to reference a student, return NONE.

Teacher profile: ${profileStr || 'Unknown'}
Current date: ${today}
${contextLines.length > 0 ? contextLines.join('\n') + '\n' : ''}${styleGuidance ? '\nStyle guidance:\n' + styleGuidance + '\n' : ''}
Their recent notes:
${recentEntries.slice(0, 10).join('\n')}

They are currently typing: "${currentInput}"

Complete the sentence:`;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      safetySettings: TEACHER_CONTENT_SAFETY_SETTINGS,
      generationConfig: {
        maxOutputTokens: 60,
        temperature: 0.3,
      },
    });

    const result = await Promise.race([
      model.generateContent(prompt),
      new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('AI completion timeout')), AI_TIMEOUT_MS)
      ),
    ]);

    if (!result) return null;

    const text = (result as any).response?.text()?.trim();
    if (!text || text === 'NONE' || text.length < 3) return null;

    const truncated = text.slice(0, MAX_COMPLETION_LENGTH);

    return {
      text: truncated,
      confidence: 0.7,
      source: 'ai',
    };
  } catch (error) {
    if ((error as Error).message !== 'AI completion timeout') {
      logger.error('AI completion failed', { teacherId, surface, error: (error as Error).message });
    }
    return null;
  }
}

// ============================================
// COMBINED PIPELINE
// ============================================

async function getCompletion(
  teacherId: string,
  currentInput: string,
  surface: CompletionSurface = 'stream',
  context: CompletionContext = {}
): Promise<CompletionResult | null> {
  if (currentInput.trim().length < MIN_INPUT_LENGTH) return null;

  const eligible = await checkEligibility(teacherId);
  if (!eligible) return null;

  // Layer 1: Local prefix matching (fast, free)
  const localResult = await getLocalCompletion(teacherId, currentInput, surface, context);
  if (localResult && localResult.confidence >= 0.6) {
    return localResult;
  }

  // Layer 2: AI fallback (slower, costs tokens)
  const recentEntries = await prisma.teacherStreamEntry.findMany({
    where: { teacherId, archived: false },
    select: { content: true },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  const aiResult = await getAICompletion(
    teacherId,
    currentInput,
    recentEntries.map((e) => e.content),
    surface,
    context
  );

  return aiResult;
}

// ============================================
// BATCH ELIGIBILITY CHECK (for cron job)
// ============================================

async function updateAllEligibility(): Promise<{ updated: number }> {
  const ineligibleTeachers = await prisma.teacher.findMany({
    where: { completionsEligible: false, completionsEnabled: true },
    select: { id: true, createdAt: true },
  });

  let updated = 0;
  for (const teacher of ineligibleTeachers) {
    const accountAgeDays = (Date.now() - teacher.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    if (accountAgeDays < MIN_ACCOUNT_AGE_DAYS) continue;

    const entryCount = await prisma.teacherStreamEntry.count({
      where: { teacherId: teacher.id, archived: false },
    });

    if (entryCount >= MIN_ENTRIES_FOR_COMPLETIONS) {
      await prisma.teacher.update({
        where: { id: teacher.id },
        data: { completionsEligible: true },
      });
      updated++;
    }
  }

  logger.info('Completions eligibility batch update', { checked: ineligibleTeachers.length, updated });
  return { updated };
}

export const completionService = {
  getCompletion,
  checkEligibility,
  updateAllEligibility,
};
