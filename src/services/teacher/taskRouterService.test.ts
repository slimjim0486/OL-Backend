import { describe, expect, it } from 'vitest';
import { taskRouterService } from './taskRouterService.js';

describe('taskRouterService lesson follow-up routing', () => {
  it('classifies lesson detail replies as generate_lesson after a lesson clarification prompt', async () => {
    const recentMessages = [
      {
        role: 'ASSISTANT',
        content:
          "Great choice! 5th Grade Reading is such a rich area to dive into. To help me get the ball rolling with the Lesson Plan tool, what's our focus for this week? Are we: 1) Starting or continuing a specific novel or short story? 2) Focusing on a specific Common Core skill? 3) Working on a specific reading project or literature circles?",
      },
    ];

    const intent = await taskRouterService.classifyIntent(
      'reading longer paragraphs in sync',
      recentMessages
    );

    expect(intent.type).toBe('generate_lesson');
    expect(intent.extractedParams.topic).toContain('reading longer paragraphs in sync');
    expect(intent.extractedParams.subject).toBe('ENGLISH');
    expect(intent.extractedParams.gradeLevel).toBe('5');
  });

  it('keeps generic acknowledgements as chat follow-ups', async () => {
    const recentMessages = [
      {
        role: 'ASSISTANT',
        content:
          "Great choice! 5th Grade Reading is such a rich area to dive into. To help me get the ball rolling with the Lesson Plan tool, what's our focus for this week?",
      },
    ];

    const intent = await taskRouterService.classifyIntent('sounds good', recentMessages);

    expect(intent.type).toBe('chat');
  });
});
