import { describe, expect, it } from 'vitest';
import {
  applyFlowLock,
  deriveActiveFlowFromMessages,
  detectExplicitFlowSwitch,
  mapIntentToFlow,
} from './agentFlowPolicy.js';

describe('agentFlowPolicy', () => {
  describe('deriveActiveFlowFromMessages', () => {
    it('uses the most recent assistant flow action', () => {
      const messages = [
        {
          role: 'ASSISTANT',
          actionType: 'coach_weekly_prep_prompt',
        },
        {
          role: 'USER',
          content: 'Reading longer paragraphs in sync',
        },
        {
          role: 'ASSISTANT',
          actionResult: { type: 'lesson' },
        },
      ];

      expect(deriveActiveFlowFromMessages(messages as any)).toBe('weekly_prep');
    });

    it('returns null when no known flow action exists', () => {
      const messages = [{ role: 'ASSISTANT', content: 'How can I help?' }];
      expect(deriveActiveFlowFromMessages(messages as any)).toBeNull();
    });
  });

  describe('detectExplicitFlowSwitch', () => {
    it('detects explicit switches by target tool', () => {
      expect(detectExplicitFlowSwitch('switch to lesson planning now')).toBe('lesson');
      expect(detectExplicitFlowSwitch('open my weekly prep calendar')).toBe('weekly_prep');
      expect(detectExplicitFlowSwitch('please generate a quiz on fractions')).toBe('quiz');
      expect(detectExplicitFlowSwitch('take me to flashcards')).toBe('flashcards');
      expect(detectExplicitFlowSwitch('create IEP goals for this student')).toBe('iep');
      expect(detectExplicitFlowSwitch('open my sub plans')).toBe('sub_plan');
    });

    it('does not treat passive follow-up details as flow switches', () => {
      expect(detectExplicitFlowSwitch('reading longer paragraphs in sync')).toBeNull();
      expect(detectExplicitFlowSwitch('pick any')).toBeNull();
      expect(detectExplicitFlowSwitch('sounds good')).toBeNull();
    });
  });

  describe('applyFlowLock', () => {
    it('blocks cross-flow intents when no explicit switch is present', () => {
      const result = applyFlowLock({
        activeFlow: 'weekly_prep',
        explicitSwitchTarget: null,
        intentType: 'generate_lesson',
      });

      expect(result.intentType).toBe('chat');
      expect(result.blockedCrossFlowTarget).toBe('lesson');
    });

    it('allows cross-flow intents when an explicit switch is present', () => {
      const result = applyFlowLock({
        activeFlow: 'weekly_prep',
        explicitSwitchTarget: 'lesson',
        intentType: 'generate_lesson',
      });

      expect(result.intentType).toBe('generate_lesson');
      expect(result.blockedCrossFlowTarget).toBeNull();
    });

    it('keeps matching-flow intents unchanged', () => {
      const result = applyFlowLock({
        activeFlow: 'quiz',
        explicitSwitchTarget: null,
        intentType: 'generate_quiz',
      });

      expect(result.intentType).toBe('generate_quiz');
      expect(result.blockedCrossFlowTarget).toBeNull();
      expect(mapIntentToFlow('generate_quiz')).toBe('quiz');
    });
  });
});
