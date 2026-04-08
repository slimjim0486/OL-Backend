// Completion Service — Teacher Intelligence Platform (Phase 4)
// Hybrid inline completions: local prefix matching + AI fallback
import { prisma } from '../../config/database.js';
import { genAI, TEACHER_CONTENT_SAFETY_SETTINGS } from '../../config/gemini.js';
import { logger } from '../../utils/logger.js';

// ============================================
// TYPES
// ============================================

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
const AI_TIMEOUT_MS = 2500; // Hard timeout for Gemini call (leave 300ms buffer for total 800ms response)
const LOCAL_CONFIDENCE_THRESHOLD = 0.5;

// ============================================
// ELIGIBILITY CHECK
// ============================================

async function checkAndUpdateEligibility(teacherId: string): Promise<boolean> {
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    select: {
      completionsEnabled: true,
      completionsEligible: true,
      createdAt: true,
    },
  });

  if (!teacher) return false;
  if (!teacher.completionsEnabled) return false;
  if (teacher.completionsEligible) return true;

  // Check thresholds
  const entryCount = await prisma.teacherStreamEntry.count({
    where: { teacherId, archived: false },
  });

  const accountAgeDays = (Date.now() - teacher.createdAt.getTime()) / (1000 * 60 * 60 * 24);

  if (entryCount >= MIN_ENTRIES_FOR_COMPLETIONS && accountAgeDays >= MIN_ACCOUNT_AGE_DAYS) {
    await prisma.teacher.update({
      where: { id: teacherId },
      data: { completionsEligible: true },
    });
    return true;
  }

  return false;
}

// ============================================
// LAYER 1: LOCAL PREFIX MATCHING
// ============================================

async function getLocalCompletion(
  teacherId: string,
  currentInput: string
): Promise<CompletionResult | null> {
  const inputLower = currentInput.toLowerCase().trim();

  // Get recent stream entries (last 200) for pattern matching
  const entries = await prisma.teacherStreamEntry.findMany({
    where: { teacherId, archived: false },
    select: { content: true },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  if (entries.length === 0) return null;

  // Try progressively shorter prefixes (from full input down to last 10 chars)
  const minPrefixLen = Math.max(10, inputLower.length - 20);

  for (let prefixLen = inputLower.length; prefixLen >= minPrefixLen; prefixLen--) {
    const prefix = inputLower.slice(-prefixLen); // Last N chars of input
    const continuations: Map<string, number> = new Map();
    let matchCount = 0;

    for (const entry of entries) {
      const contentLower = entry.content.toLowerCase();
      const idx = contentLower.indexOf(prefix);
      if (idx === -1) continue;

      matchCount++;
      const afterPrefix = entry.content.slice(idx + prefix.length).trim();
      if (!afterPrefix) continue;

      // Take first sentence or up to MAX_COMPLETION_LENGTH chars
      const sentenceEnd = afterPrefix.search(/[.!?\n]/);
      const continuation = sentenceEnd > 0
        ? afterPrefix.slice(0, Math.min(sentenceEnd + 1, MAX_COMPLETION_LENGTH))
        : afterPrefix.slice(0, MAX_COMPLETION_LENGTH);

      if (continuation.length < 3) continue;

      const key = continuation.toLowerCase();
      continuations.set(key, (continuations.get(key) || 0) + 1);
    }

    if (matchCount === 0) continue;

    // Find most common continuation
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
      // Return the original-case version
      for (const entry of entries) {
        const contentLower = entry.content.toLowerCase();
        const idx = contentLower.indexOf(prefix);
        if (idx === -1) continue;
        const afterPrefix = entry.content.slice(idx + prefix.length).trim();
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
// LAYER 2: AI COMPLETION (Gemini Flash)
// ============================================

async function getAICompletion(
  teacherId: string,
  currentInput: string,
  recentEntries: string[]
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

    const prompt = `You are a completion engine for a teacher's note-taking stream.
Complete the teacher's current sentence. Return ONLY the completion text (the part after what they've already typed), no explanation. Maximum 1 sentence, maximum ${MAX_COMPLETION_LENGTH} characters.
If you're not confident, return exactly: NONE
NEVER guess student names — if the input seems to reference a student, return NONE.

Teacher profile: ${profileStr || 'Unknown'}
Current date: ${today}
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

    // Race against timeout
    const result = await Promise.race([
      model.generateContent(prompt),
      new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('AI completion timeout')), AI_TIMEOUT_MS)
      ),
    ]);

    if (!result) return null;

    const text = (result as any).response?.text()?.trim();
    if (!text || text === 'NONE' || text.length < 3) return null;

    // Truncate to max length
    const truncated = text.slice(0, MAX_COMPLETION_LENGTH);

    return {
      text: truncated,
      confidence: 0.7,
      source: 'ai',
    };
  } catch (error) {
    if ((error as Error).message !== 'AI completion timeout') {
      logger.error('AI completion failed', { teacherId, error: (error as Error).message });
    }
    return null;
  }
}

// ============================================
// COMBINED PIPELINE
// ============================================

async function getCompletion(
  teacherId: string,
  currentInput: string
): Promise<CompletionResult | null> {
  // Skip if input too short
  if (currentInput.trim().length < MIN_INPUT_LENGTH) return null;

  // Check eligibility (fast — uses cached flag)
  const eligible = await checkAndUpdateEligibility(teacherId);
  if (!eligible) return null;

  // Layer 1: Local prefix matching (fast, free)
  const localResult = await getLocalCompletion(teacherId, currentInput);
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
    recentEntries.map((e) => e.content)
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
  checkAndUpdateEligibility,
  updateAllEligibility,
};
