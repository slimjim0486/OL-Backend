import { describe, expect, it } from 'vitest';
import { detectPlannerNavigationIntent } from './plannerNavigationIntent.js';

describe('detectPlannerNavigationIntent', () => {
  it('detects varied navigation wording', () => {
    const phrases = [
      'take me to my planner',
      'open weekly prep',
      'show me my schedule',
      'let me see it in calendar',
      'pull up my timetable',
      'weekly prep please',
      'my planner now',
      'can i see my week plan',
    ];

    for (const phrase of phrases) {
      expect(detectPlannerNavigationIntent(phrase).isNavigation).toBe(true);
    }
  });

  it('does not confuse mode changes or non-navigation contexts', () => {
    const phrases = [
      '/mode planner',
      'switch to planner mode',
      'set mode to autopilot',
      'create a lesson planner for fractions',
      'plan my week',
      'planner mode sounds good',
    ];

    for (const phrase of phrases) {
      expect(detectPlannerNavigationIntent(phrase).isNavigation).toBe(false);
    }
  });

  it('flags fresh-week requests', () => {
    const phrases = [
      'take me to my planner for new week',
      "open next week's schedule",
      'go to week 9 calendar',
      'open a fresh weekly prep',
      'show me another planner',
    ];

    for (const phrase of phrases) {
      const result = detectPlannerNavigationIntent(phrase);
      expect(result.isNavigation).toBe(true);
      expect(result.forceFresh).toBe(true);
    }
  });

  it('keeps default navigation non-fresh unless requested', () => {
    const phrases = [
      'take me to my planner',
      'open schedule',
      'weekly prep please',
    ];

    for (const phrase of phrases) {
      const result = detectPlannerNavigationIntent(phrase);
      expect(result.isNavigation).toBe(true);
      expect(result.forceFresh).toBe(false);
    }
  });
});

