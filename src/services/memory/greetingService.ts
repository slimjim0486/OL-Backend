// Ollie's Personalized Greeting Service
// Generates context-aware greetings based on child's memory

import { AgeGroup } from '@prisma/client';
import { logger } from '../../utils/logger.js';
import { memoryService } from './memoryService.js';
import {
  GreetingTemplateType,
  GreetingContext,
  PersonalizedGreeting,
  OllieMemoryContext,
} from './memoryTypes.js';

// ============================================
// GREETING TEMPLATES
// ============================================

const GREETING_TEMPLATES: Record<
  GreetingTemplateType,
  { young: string[]; older: string[] }
> = {
  // 1. Return After Streak Continuation (active streak > 2 days)
  streak_continuation: {
    young: [
      "Yay, {displayName}! You're on fire - {streakCount} days in a row! 🔥 Ready to keep exploring {lastTopic}? You were doing SO good!",
      "Wow {displayName}! {streakCount} days of learning - you're a superstar! ⭐ Want to learn more about {lastTopic}?",
      "Look at you, {displayName}! {streakCount} days learning - amazing! 🎉 Let's keep going with {lastTopic}!",
    ],
    older: [
      "Hey {displayName}! You're on fire - that's {streakCount} days in a row! Ready to keep exploring {lastTopic}? You were SO close to mastering it yesterday!",
      "{displayName}! {streakCount}-day streak going strong! Want to pick up where we left off with {lastTopic}?",
      "Nice one, {displayName}! {streakCount} days straight. Your consistency is paying off. Ready to continue with {lastTopic}?",
    ],
  },

  // 2. Return After Break (2-7 days)
  return_after_break: {
    young: [
      "Hey {displayName}! It's been {daysSince} days - I missed you! 💙 Last time we learned about {lastTopic}. Want to try again?",
      "You're back, {displayName}! I'm so happy! 🌟 We were learning {lastTopic} - want to continue or try something new?",
      "{displayName}! I was hoping you'd come back! 🎈 Ready to learn something fun?",
    ],
    older: [
      "Hey {displayName}! It's been {daysSince} days - I missed you! Last time, we were learning about {lastTopic}. Want to pick up where we left off, or try something new?",
      "Welcome back, {displayName}! Been {daysSince} days since our last session. Should we continue with {lastTopic} or explore something different?",
      "Good to see you, {displayName}! It's been a few days. Ready to jump back into learning?",
    ],
  },

  // 3. Return After Long Break (7+ days)
  return_after_long_break: {
    young: [
      "Yay, {displayName}! You're back! 🎉 I've been waiting for you! Ready for some fun learning?",
      "Welcome back, {displayName}! It's been a while - I have SO many cool things to show you! 🌈",
      "{displayName}! I'm so excited to see you! 💫 Let's learn something amazing today!",
    ],
    older: [
      "Welcome back, {displayName}! It's been a while - {daysSince} days! I've been keeping track of all the cool things waiting for you to learn. Ready to jump back in? No pressure - we can start with something fun!",
      "Hey {displayName}! It's great to see you again after {daysSince} days. Want to ease back in with something light, or dive into a challenge?",
      "Look who's back! {displayName}, I've missed our learning sessions. Should we start fresh or pick up where we left off?",
    ],
  },

  // 4. Return Same Day
  same_day_return: {
    young: [
      "You're back, {displayName}! Yay! 🎉 Want to learn more {lastTopic} or try something new?",
      "Wow {displayName}, back for more already? That's awesome! 🌟 Let's keep going!",
      "{displayName}! You came back to learn more! I love it! 💙 What should we explore?",
    ],
    older: [
      "Back for more already, {displayName}? {enthusiasticPhrase} Want to continue with {lastTopic} or try something new?",
      "Hey again, {displayName}! Great to see your enthusiasm. Ready for another round?",
      "{displayName}! Double session today - nice! Should we keep going with {lastTopic} or switch things up?",
    ],
  },

  // 5. Morning Session (before 12 PM)
  morning_session: {
    young: [
      "Good morning, {displayName}! 🌞 Your brain is fresh and ready to learn! What should we explore today?",
      "Rise and shine, {displayName}! ☀️ Ready for some morning learning fun?",
      "Morning, {displayName}! 🌅 Great time to learn something new! What sounds fun?",
    ],
    older: [
      "Good morning, {displayName}! Your brain is fresh and ready to learn. I have some {lastSubject} waiting for you - let's make today awesome!",
      "Morning, {displayName}! Research shows morning is a great time for learning. Ready to tackle something challenging?",
      "Hey {displayName}! Early bird gets the knowledge! What would you like to work on?",
    ],
  },

  // 6. Optimal Time Detected
  optimal_time: {
    young: [
      "Hi {displayName}! It's {time} - your super learning time! 🧠✨ Ready to be amazing?",
      "Perfect timing, {displayName}! This is when you learn best! 🌟 Let's go!",
      "{displayName}! You're here at your favorite learning time! 🎯 This is going to be great!",
    ],
    older: [
      "It's {time} - that's usually when you do your best work, {displayName}! Your brain is ready for a challenge. What do you say?",
      "Perfect timing, {displayName}! Based on your patterns, this is your sweet spot for learning. Ready to make the most of it?",
      "{displayName}! You're here at your peak focus time. Let's put that brain power to good use!",
    ],
  },

  // 7. Milestone Approaching
  milestone_approaching: {
    young: [
      "Hey {displayName}! Guess what? You're just {count} {thing} away from {milestone}! 🎯 Let's make it happen!",
      "Ooh {displayName}! You're SO close to {milestone}! Just {count} more! 🌟 You can do it!",
      "Exciting news, {displayName}! You're almost at {milestone}! 🎉 Let's get there today!",
    ],
    older: [
      "Hey {displayName}! Guess what? You're just {count} {thing} away from {milestone}! Ready to make it happen today?",
      "{displayName}, you're on the edge of something awesome - {count} {thing} from {milestone}! Let's cross that finish line!",
      "Close one, {displayName}! {milestone} is right around the corner. Just {count} more {thing} to go!",
    ],
  },

  // 8. After Tough Previous Session
  after_tough_session: {
    young: [
      "Welcome back, {displayName}! 💪 I know {topic} was tricky, but you were so brave to try! Want to try something different today?",
      "Hi {displayName}! 🌈 Yesterday was hard, but that's how we learn! Ready for a fresh start?",
      "{displayName}! Every learning adventure has bumpy roads! 🚀 Today's going to be great!",
    ],
    older: [
      "Welcome back, {displayName}! I know {topic} was tricky yesterday, but guess what? Every try makes your brain stronger! Want to try a different approach today, or tackle something else first?",
      "Hey {displayName}! Yesterday's challenge with {topic} was tough, but persistence is what matters. Ready to give it another shot or take a break from it?",
      "{displayName}! I noticed {topic} gave you some trouble. That's totally normal - the best learners face challenges. What would you like to do today?",
    ],
  },

  // 9. Default (fallback when no context available)
  default: {
    young: [
      "Hi {displayName}! 👋 I'm Ollie and I'm SO excited to learn with you today! What sounds fun?",
      "Hey there, {displayName}! 🌟 Ready for a learning adventure?",
      "Welcome, {displayName}! 🎈 Let's discover something amazing together!",
    ],
    older: [
      "Hey {displayName}! I'm Ollie, your learning buddy. What would you like to explore today?",
      "Hi {displayName}! Ready to learn something new? I'm here to help!",
      "Welcome, {displayName}! Got a subject in mind, or should we find something interesting together?",
    ],
  },
};

// Enthusiastic phrases for same-day returns
const ENTHUSIASTIC_PHRASES = {
  young: [
    "I love it!",
    "So awesome!",
    "You're amazing!",
    "Yippee!",
  ],
  older: [
    "Love the enthusiasm!",
    "That's the spirit!",
    "Awesome dedication!",
    "Great to see that energy!",
  ],
};

// ============================================
// GREETING SERVICE
// ============================================

export const greetingService = {
  /**
   * Generate a personalized greeting for a child
   */
  async getPersonalizedGreeting(childId: string): Promise<PersonalizedGreeting> {
    try {
      // Get memory context
      const context = await memoryService.getMemoryContext(childId);

      // Get recently used greetings to avoid repetition
      const recentGreetings = await memoryService.getRecentGreetings(childId);

      // Build greeting context
      const greetingContext = this.buildGreetingContext(context);

      // Select appropriate greeting type
      const templateType = this.selectGreetingType(greetingContext, recentGreetings);

      // Generate greeting from template
      const greeting = this.generateGreeting(templateType, greetingContext);

      // Generate suggestions
      const suggestions = this.generateSuggestions(context);

      // Record the greeting type used
      await memoryService.recordGreetingUsed(childId, templateType);

      logger.info('Generated personalized greeting', {
        childId,
        templateType,
        ageGroup: context.ageGroup,
      });

      return {
        templateType,
        greeting,
        suggestions,
      };
    } catch (error) {
      logger.error('Error generating personalized greeting', { childId, error });

      // Return a safe fallback greeting
      const child = await memoryService.getDefaultMemoryContext(childId);
      return {
        templateType: 'default',
        greeting: this.getRandomTemplate('default', child.ageGroup)
          .replace('{displayName}', child.displayName),
        suggestions: [],
      };
    }
  },

  /**
   * Build greeting context from memory context
   */
  buildGreetingContext(memory: OllieMemoryContext): GreetingContext {
    const now = new Date();
    return {
      displayName: memory.displayName,
      streakCount: memory.currentStreak,
      daysSinceLastSession: memory.daysSinceLastSession,
      lastTopic: memory.lastTopic,
      lastSubject: memory.lastSubject,
      preferredTimeOfDay: memory.preferredTimeOfDay,
      currentHour: now.getHours(),
      isActiveToday: memory.isActiveToday,
      sessionsToday: memory.sessionsToday,
      recentStruggles: memory.recentStruggles,
      upcomingMilestones: memory.upcomingMilestones,
      ageGroup: memory.ageGroup,
    };
  },

  /**
   * Select the most appropriate greeting type based on context
   */
  selectGreetingType(
    context: GreetingContext,
    recentlyUsed: string[]
  ): GreetingTemplateType {
    const candidates: { type: GreetingTemplateType; priority: number }[] = [];

    // Priority 1: Streak continuation (active streak > 2)
    if (context.streakCount > 2 && context.daysSinceLastSession === 1) {
      candidates.push({ type: 'streak_continuation', priority: 1 });
    }

    // Priority 2: Milestone approaching
    if (context.upcomingMilestones) {
      const ms = context.upcomingMilestones;
      const remaining = ms.target - ms.current;
      if (remaining <= 3 && remaining > 0) {
        candidates.push({ type: 'milestone_approaching', priority: 2 });
      }
    }

    // Priority 3: After tough session (struggles detected)
    if (
      context.recentStruggles.length > 0 &&
      context.daysSinceLastSession !== null &&
      context.daysSinceLastSession <= 1
    ) {
      const recentStruggle = context.recentStruggles[0];
      if (recentStruggle.correctRate < 0.5) {
        candidates.push({ type: 'after_tough_session', priority: 3 });
      }
    }

    // Priority 4: Same day return
    if (context.isActiveToday && context.sessionsToday > 1) {
      candidates.push({ type: 'same_day_return', priority: 4 });
    }

    // Priority 5: Optimal time
    if (context.preferredTimeOfDay) {
      const preferredHour = parseInt(context.preferredTimeOfDay.split(':')[0]);
      if (Math.abs(context.currentHour - preferredHour) <= 1) {
        candidates.push({ type: 'optimal_time', priority: 5 });
      }
    }

    // Priority 6: Morning session
    if (context.currentHour < 12 && context.currentHour >= 6) {
      candidates.push({ type: 'morning_session', priority: 6 });
    }

    // Priority 7: Return after long break (7+ days)
    if (context.daysSinceLastSession !== null && context.daysSinceLastSession >= 7) {
      candidates.push({ type: 'return_after_long_break', priority: 7 });
    }

    // Priority 8: Return after break (2-7 days)
    if (
      context.daysSinceLastSession !== null &&
      context.daysSinceLastSession >= 2 &&
      context.daysSinceLastSession < 7
    ) {
      candidates.push({ type: 'return_after_break', priority: 8 });
    }

    // Always add default as fallback
    candidates.push({ type: 'default', priority: 10 });

    // Filter out recently used greetings (unless only default is left)
    const filtered = candidates.filter(
      c => !recentlyUsed.includes(c.type) || c.type === 'default'
    );

    // Use filtered if we have options, otherwise fall back to all candidates
    const finalCandidates = filtered.length > 0 ? filtered : candidates;

    // Sort by priority and return highest priority
    finalCandidates.sort((a, b) => a.priority - b.priority);
    return finalCandidates[0].type;
  },

  /**
   * Generate greeting text from template
   */
  generateGreeting(
    templateType: GreetingTemplateType,
    context: GreetingContext
  ): string {
    const template = this.getRandomTemplate(templateType, context.ageGroup);

    // Replace placeholders with context values
    let greeting = template
      .replace(/{displayName}/g, context.displayName)
      .replace(/{streakCount}/g, String(context.streakCount))
      .replace(/{daysSince}/g, String(context.daysSinceLastSession || 0))
      .replace(/{lastTopic}/g, context.lastTopic || 'your lesson')
      .replace(/{lastSubject}/g, context.lastSubject || 'learning')
      .replace(/{time}/g, this.formatTime(context.currentHour))
      .replace(/{enthusiasticPhrase}/g, this.getEnthusiasticPhrase(context.ageGroup));

    // Handle milestone placeholders
    if (context.upcomingMilestones) {
      const ms = context.upcomingMilestones;
      greeting = greeting
        .replace(/{count}/g, String(ms.target - ms.current))
        .replace(/{thing}/g, this.getMilestoneUnit(ms.type))
        .replace(/{milestone}/g, ms.name);
    }

    // Handle struggle topic placeholder
    if (context.recentStruggles.length > 0) {
      greeting = greeting.replace(/{topic}/g, context.recentStruggles[0].topic);
    }

    return greeting;
  },

  /**
   * Get a random template for the given type and age group
   */
  getRandomTemplate(type: GreetingTemplateType, ageGroup: AgeGroup): string {
    const templates = GREETING_TEMPLATES[type];
    const ageTemplates = ageGroup === 'YOUNG' ? templates.young : templates.older;
    return ageTemplates[Math.floor(Math.random() * ageTemplates.length)];
  },

  /**
   * Get an enthusiastic phrase for same-day returns
   */
  getEnthusiasticPhrase(ageGroup: AgeGroup): string {
    const phrases = ageGroup === 'YOUNG'
      ? ENTHUSIASTIC_PHRASES.young
      : ENTHUSIASTIC_PHRASES.older;
    return phrases[Math.floor(Math.random() * phrases.length)];
  },

  /**
   * Format hour to readable time
   */
  formatTime(hour: number): string {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  },

  /**
   * Get unit description for milestone type
   */
  getMilestoneUnit(type: string): string {
    switch (type) {
      case 'streak':
        return 'day';
      case 'level':
        return 'XP';
      case 'badge':
        return 'step';
      default:
        return 'step';
    }
  },

  /**
   * Generate learning suggestions based on context
   */
  generateSuggestions(context: OllieMemoryContext): string[] {
    const suggestions: string[] = [];

    // Suggest continuing with last topic
    if (context.lastTopic) {
      suggestions.push(`Continue with ${context.lastTopic}`);
    }

    // Suggest strongest subject
    if (context.strongestSubjects.length > 0) {
      suggestions.push(`Practice ${context.strongestSubjects[0]} (your strong suit!)`);
    }

    // Suggest growth area with encouragement
    if (context.growthAreas.length > 0 && context.persistenceScore > 0.3) {
      suggestions.push(`Work on ${context.growthAreas[0]} (you've been improving!)`);
    }

    // Add general suggestions
    if (suggestions.length < 2) {
      suggestions.push('Explore something new');
    }

    return suggestions.slice(0, 3);
  },

  /**
   * Generate a greeting for the start of a chat session
   * This is the main entry point for the chat routes
   */
  async generateSessionGreeting(childId: string): Promise<{
    greeting: string;
    suggestions: string[];
    memoryContext: OllieMemoryContext;
  }> {
    // Record session start
    await memoryService.recordSessionStart(childId);

    // Get personalized greeting
    const { greeting, suggestions } = await this.getPersonalizedGreeting(childId);

    // Get memory context for AI prompt
    const memoryContext = await memoryService.getMemoryContext(childId);

    return {
      greeting,
      suggestions,
      memoryContext,
    };
  },
};
