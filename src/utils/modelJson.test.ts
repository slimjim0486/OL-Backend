import { describe, expect, it } from 'vitest';
import {
  generateAndParseJson,
  getGeminiResponseText,
  parseModelJson,
  truncatePromptText,
} from './modelJson.js';

describe('modelJson utilities', () => {
  it('repairs truncated object JSON by trimming the incomplete tail', () => {
    const parsed = parseModelJson<{ title: string; questions: Array<{ id: string }> }>(
      `{
        "title": "Ecosystems Quiz",
        "questions": [
          { "id": "q1" },
          { "id": "q2", "explanatio`,
      {
        contextLabel: 'Quiz response',
        normalize: (value) => value as { title: string; questions: Array<{ id: string }> },
      }
    );

    expect(parsed.title).toBe('Ecosystems Quiz');
    expect(parsed.questions).toHaveLength(2);
  });

  it('extracts JSON when the model wraps it in prose', () => {
    const parsed = parseModelJson<{ title: string }>(
      `Here is your JSON:\n\n{"title":"Parent Email"}\n\nThanks!`,
      {
        contextLabel: 'Parent email',
        normalize: (value) => value as { title: string },
      }
    );

    expect(parsed.title).toBe('Parent Email');
  });

  it('reads Gemini text and usage metadata safely', () => {
    const response = getGeminiResponseText(
      {
        response: {
          text: () => ' {"ok": true} ',
          usageMetadata: { totalTokenCount: 123 },
          candidates: [{ finishReason: 'STOP' }],
        },
      },
      'Structured response',
      50
    );

    expect(response.text).toBe('{"ok": true}');
    expect(response.tokensUsed).toBe(123);
    expect(response.finishReason).toBe('STOP');
  });

  it('retries with the second prompt when the first attempt is malformed', async () => {
    let attempt = 0;
    const result = await generateAndParseJson<{ value: string }>({
      contextLabel: 'Retry case',
      prompts: ['first', 'second'],
      invoke: async () => {
        attempt += 1;
        if (attempt === 1) {
          return {
            response: {
              text: () => '{"value":"broken',
              usageMetadata: { totalTokenCount: 100 },
              candidates: [{ finishReason: 'MAX_TOKENS' }],
            },
          };
        }

        return {
          response: {
            text: () => '{"value":"fixed"}',
            usageMetadata: { totalTokenCount: 120 },
            candidates: [{ finishReason: 'STOP' }],
          },
        };
      },
      normalize: (value) => {
        if (value?.value !== 'fixed') {
          throw new Error('Value not finalized yet');
        }
        return value as { value: string };
      },
    });

    expect(result.data.value).toBe('fixed');
    expect(result.tokensUsed).toBe(220);
  });

  it('truncates prompt text safely', () => {
    expect(truncatePromptText('abcdef', 4)).toContain('[truncated]');
  });
});
