import { describe, expect, it } from 'vitest';
import { detectPlannerNavigationIntent } from './plannerNavigationIntent.js';

describe('detectPlannerNavigationIntent', () => {
  it('detects varied navigation wording', () => {
    const phrases = [
      'take me to my planner',
      'open weekly prep',
      'show me my schedule',
      'let me see it in calendar',
      'take me to the lesson when you are done',
      'pull up my timetable',
      'weekly prep please',
      'my planner now',
      'can i see my week plan',
      'route me to calendar',
      'bring me to the planning page',
      'bring me over to my week view',
      'navigate me to schedule',
      'move me to planner tab',
      'drop me in the planning hub',
      'pop open the planner view',
      'redirect me to my calendar',
      'open up my planner',
      'go to weekly plan page',
      'week view please',
      'planning tab now',
      'calendar screen please',
      'after you finish, open my planner',
      'once done take me to the calendar',
      'as soon as you are ready send me to schedule',
      'when completed, bring me to my lesson',
      'after this jump to weekly prep',
      'once you are done route me to planning screen',
      'show me the planning page',
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
      'show me lesson ideas for photosynthesis',
      'plan my week',
      'planner mode sounds good',
      'generate a quiz on photosynthesis',
      'create flashcards for vocabulary',
      'draft a lesson plan for tuesday',
      'what is the best planner app',
      'my school schedule is packed',
      'we need better planning this term',
      'calendar management tips for teachers',
      'can you improve this lesson',
      'show me examples of weekly plans',
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
      'once done bring me to the upcoming week planner',
      'after you finish open week 12 calendar',
      'as soon as ready send me to next week planning tab',
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
