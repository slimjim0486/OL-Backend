import { logger } from './logger.js';

type RootPreference = 'object' | 'array';

interface ParseModelJsonOptions<T> {
  contextLabel: string;
  preferRoot?: RootPreference;
  normalize?: (parsed: any) => T;
}

interface GenerateAndParseJsonOptions<T> extends ParseModelJsonOptions<T> {
  prompts: string[];
  invoke: (prompt: string) => Promise<any>;
  estimatedTokens?: number;
}

export interface GeminiResponseText {
  text: string;
  tokensUsed: number;
  finishReason?: string;
}

export interface GeneratedJsonResult<T> {
  data: T;
  text: string;
  tokensUsed: number;
  finishReason?: string;
}

export function truncatePromptText(text: string | undefined, maxChars: number): string {
  const normalized = String(text || '').trim();
  if (!normalized) return '';
  if (normalized.length <= maxChars) return normalized;
  return `${normalized.slice(0, maxChars)}\n...[truncated]`;
}

export function getGeminiResponseText(
  result: any,
  contextLabel: string,
  estimatedTokens = 0
): GeminiResponseText {
  const response = result?.response;
  if (!response) {
    throw new Error(`${contextLabel} returned no response object`);
  }

  const promptFeedback = response.promptFeedback;
  if (promptFeedback?.blockReason) {
    throw new Error(`${contextLabel} was blocked: ${promptFeedback.blockReason}`);
  }

  const candidate = response.candidates?.[0];
  const finishReason = candidate?.finishReason;
  if (!candidate) {
    throw new Error(`${contextLabel} returned no candidates`);
  }

  if (finishReason === 'SAFETY' || finishReason === 'BLOCKED') {
    throw new Error(`${contextLabel} was blocked: ${finishReason}`);
  }

  let text = '';
  try {
    text = String(response.text?.() || '').trim();
  } catch (error) {
    throw new Error(
      `${contextLabel} response text could not be read: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  if (!text) {
    throw new Error(`${contextLabel} returned empty content${finishReason ? ` (${finishReason})` : ''}`);
  }

  return {
    text,
    tokensUsed: response.usageMetadata?.totalTokenCount || estimatedTokens,
    finishReason,
  };
}

export async function generateAndParseJson<T>(
  options: GenerateAndParseJsonOptions<T>
): Promise<GeneratedJsonResult<T>> {
  const prompts = options.prompts.filter((prompt) => String(prompt || '').trim().length > 0);
  if (!prompts.length) {
    throw new Error(`No prompts provided for ${options.contextLabel}`);
  }

  let totalTokensUsed = 0;
  let lastText = '';
  let lastFinishReason: string | undefined;
  let lastError: Error | undefined;

  for (let index = 0; index < prompts.length; index++) {
    try {
      const result = await options.invoke(prompts[index]);
      const response = getGeminiResponseText(result, options.contextLabel, options.estimatedTokens);
      totalTokensUsed += response.tokensUsed;
      lastText = response.text;
      lastFinishReason = response.finishReason;

      const data = parseModelJson<T>(response.text, {
        contextLabel: options.contextLabel,
        preferRoot: options.preferRoot,
        normalize: options.normalize,
      });

      return {
        data,
        text: response.text,
        tokensUsed: totalTokensUsed,
        finishReason: response.finishReason,
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      logger.warn(`${options.contextLabel} parse attempt failed`, {
        attempt: index + 1,
        totalAttempts: prompts.length,
        error: lastError.message,
        responseStart: lastText.substring(0, 250),
        responseEnd: lastText.substring(Math.max(0, lastText.length - 250)),
      });
    }
  }

  const error = new Error(
    `Failed to parse ${options.contextLabel} JSON${lastError ? `: ${lastError.message}` : ''}`
  );
  (error as Error & { responseText?: string; finishReason?: string }).responseText = lastText;
  (error as Error & { responseText?: string; finishReason?: string }).finishReason = lastFinishReason;
  throw error;
}

export function parseModelJson<T>(text: string, options: ParseModelJsonOptions<T>): T {
  const normalized = String(text || '').replace(/^\uFEFF/, '').trim();
  if (!normalized) {
    throw new Error(`${options.contextLabel} response was empty`);
  }

  const candidates = buildJsonCandidates(normalized, options.preferRoot || 'object');
  let lastError: Error | undefined;

  for (const candidate of candidates) {
    for (const variant of buildCandidateVariants(candidate)) {
      try {
        const parsed = JSON.parse(variant);
        if (options.normalize) {
          return options.normalize(parsed);
        }
        return parsed as T;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
      }
    }
  }

  throw new Error(
    `${options.contextLabel} JSON parse failed${lastError ? `: ${lastError.message}` : ''}`
  );
}

function buildJsonCandidates(text: string, preferRoot: RootPreference): string[] {
  const candidates = new Set<string>();
  candidates.add(text);

  const codeBlockMatches = [...text.matchAll(/```(?:json)?\s*([\s\S]*?)```/gi)];
  for (const match of codeBlockMatches) {
    if (match[1]?.trim()) {
      candidates.add(match[1].trim());
    }
  }

  const firstStructuredStart = getFirstStructuredStart(text, preferRoot);
  if (firstStructuredStart >= 0) {
    candidates.add(text.slice(firstStructuredStart).trim());
  }

  const objectMatch = text.match(/\{[\s\S]*\}/);
  const arrayMatch = text.match(/\[[\s\S]*\]/);

  if (preferRoot === 'object') {
    if (objectMatch?.[0]) candidates.add(objectMatch[0].trim());
    if (arrayMatch?.[0]) candidates.add(arrayMatch[0].trim());
  } else {
    if (arrayMatch?.[0]) candidates.add(arrayMatch[0].trim());
    if (objectMatch?.[0]) candidates.add(objectMatch[0].trim());
  }

  return [...candidates].filter(Boolean);
}

function getFirstStructuredStart(text: string, preferRoot: RootPreference): number {
  const objectIndex = text.indexOf('{');
  const arrayIndex = text.indexOf('[');

  if (preferRoot === 'object') {
    if (objectIndex >= 0) return objectIndex;
    return arrayIndex;
  }

  if (arrayIndex >= 0) return arrayIndex;
  return objectIndex;
}

function buildCandidateVariants(candidate: string): string[] {
  const normalized = normalizeJsonQuotes(candidate.trim());
  const variants = new Set<string>();

  const cleaned = removeTrailingCommas(normalized);
  const trimmedExtraClosers = trimExtraClosingDelimiters(cleaned);

  variants.add(normalized);
  variants.add(cleaned);
  variants.add(trimmedExtraClosers);

  try {
    variants.add(attemptTruncatedJSONRepair(trimmedExtraClosers));
  } catch {
    // Ignore repair failure; other variants may still parse.
  }

  return [...variants].filter(Boolean);
}

function normalizeJsonQuotes(text: string): string {
  return text
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'");
}

function removeTrailingCommas(text: string): string {
  return text.replace(/,\s*([}\]])/g, '$1');
}

function trimExtraClosingDelimiters(text: string): string {
  let candidate = text;
  let openBraces = (candidate.match(/\{/g) || []).length;
  let closeBraces = (candidate.match(/\}/g) || []).length;
  let openBrackets = (candidate.match(/\[/g) || []).length;
  let closeBrackets = (candidate.match(/\]/g) || []).length;

  while ((closeBraces > openBraces || closeBrackets > openBrackets) && /[\]\}]\s*$/.test(candidate)) {
    candidate = candidate.replace(/[\]\}]\s*$/, '');
    openBraces = (candidate.match(/\{/g) || []).length;
    closeBraces = (candidate.match(/\}/g) || []).length;
    openBrackets = (candidate.match(/\[/g) || []).length;
    closeBrackets = (candidate.match(/\]/g) || []).length;
  }

  return candidate;
}

function attemptTruncatedJSONRepair(candidate: string): string {
  const cutPoints = getStructuralCommaPositions(candidate);
  const attempts = [candidate.length, ...cutPoints.reverse()];

  for (const cutPoint of attempts) {
    let repaired = candidate.slice(0, cutPoint);
    repaired = repaired.replace(/[\s,]+$/, '');
    repaired = repaired.replace(/:\s*$/, '');
    repaired = closeOpenJsonString(repaired);
    repaired = closeOpenJsonStructures(repaired);
    repaired = removeTrailingCommas(repaired);

    try {
      JSON.parse(repaired);
      return repaired;
    } catch {
      // Try the next structural cut point.
    }
  }

  throw new Error('JSON response was truncated and could not be repaired');
}

function getStructuralCommaPositions(text: string): number[] {
  const positions: number[] = [];
  let inString = false;
  let escaped = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (!inString && char === ',') {
      positions.push(i);
    }
  }

  return positions;
}

function closeOpenJsonString(text: string): string {
  let inString = false;
  let escaped = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
    }
  }

  const sanitized = escaped ? text.slice(0, -1) : text;
  return inString ? `${sanitized}"` : sanitized;
}

function closeOpenJsonStructures(text: string): string {
  const stack: string[] = [];
  let inString = false;
  let escaped = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === '{' || char === '[') {
      stack.push(char);
    } else if (char === '}' && stack[stack.length - 1] === '{') {
      stack.pop();
    } else if (char === ']' && stack[stack.length - 1] === '[') {
      stack.pop();
    }
  }

  let repaired = text;
  for (let i = stack.length - 1; i >= 0; i--) {
    repaired += stack[i] === '{' ? '}' : ']';
  }

  return repaired;
}
