// Ollie's Contextual Encouragement Service
// Generates personalized encouragement based on child's memory and performance

import { AgeGroup, Subject } from '@prisma/client';
import { logger } from '../../utils/logger.js';
import { memoryService } from './memoryService.js';
import {
  EncouragementType,
  EncouragementContext,
  PersonalizedEncouragement,
  OllieMemoryContext,
  RecentStruggle,
} from './memoryTypes.js';

// ============================================
// ENCOURAGEMENT TEMPLATES
// ============================================

const ENCOURAGEMENT_TEMPLATES: Record<
  EncouragementType,
  { young: string[]; older: string[] }
> = {
  // 1. Correct - Standard
  correct_standard: {
    young: [
      "Yay! You got it, {displayName}! 🌟",
      "Woohoo! That's right! ⭐",
      "Amazing! You're so smart! 🎉",
      "Perfect! Great job! 💫",
    ],
    older: [
      "Correct! Nice work, {displayName}!",
      "That's right! You've got this!",
      "Exactly! Great thinking!",
      "Perfect! Keep it up!",
    ],
  },

  // 2. Correct with Struggle-to-Success Callback
  correct_with_callback: {
    young: [
      "WOW {displayName}! You got it! Remember when {struggledTopic} was tricky? Look at you now! 🌟",
      "Amazing! You figured out {struggledTopic}! I knew you could do it! 🎉",
      "You did it! {struggledTopic} is not so tricky anymore, is it? You're awesome! ✨",
    ],
    older: [
      "WOW, {displayName}! Do you realize what just happened? You used to find {struggledTopic} challenging, and you just nailed it! That's real growth!",
      "Look at that! {struggledTopic} was tough before, but now you're solving it like a pro. Your persistence paid off!",
      "Remember when {struggledTopic} felt impossible? You just proved you can do it! That's amazing progress!",
    ],
  },

  // 3. Correct Streak (5+ in a row)
  correct_streak: {
    young: [
      "{correctInARow} in a row! You're on FIRE, {displayName}! 🔥🔥🔥",
      "WOW! {correctInARow} correct! You're unstoppable! 🚀",
      "Amazing streak! {correctInARow}! Keep going! ⭐⭐⭐",
    ],
    older: [
      "{correctInARow} in a row, {displayName}! You're absolutely crushing it!",
      "That's {correctInARow} correct answers! Your focus is incredible right now!",
      "Impressive streak - {correctInARow}! You're really getting the hang of this!",
    ],
  },

  // 4. Wrong - First Attempt
  wrong_first_attempt: {
    young: [
      "Hmm, not quite! Let's think about this together! 🤔",
      "Oops! That's okay - try again! You can do it! 💪",
      "Almost! Let's try one more time! 🌟",
    ],
    older: [
      "Not quite, but good effort! Think about what we learned and try again.",
      "Hmm, that's not it. Take your time - what do you remember about this topic?",
      "Close! Review the concept and give it another shot.",
    ],
  },

  // 5. Wrong - High Persistence
  wrong_persistence: {
    young: [
      "I love how hard you're trying, {displayName}! 💪 Let's think about it differently!",
      "You're not giving up - that's so great! Here's a hint: {hint}",
      "Keep trying! Each try makes your brain stronger! 🧠",
    ],
    older: [
      "I love that you keep trying, {displayName}! That persistence is how real learning happens. Let me give you a hint: {hint}",
      "You're not giving up, and that's exactly what great learners do. Here's another way to think about it: {hint}",
      "Every attempt is making your brain stronger! Here's a different approach: {hint}",
    ],
  },

  // 6. Wrong - After Success History
  wrong_after_success: {
    young: [
      "That's okay! Remember when you mastered {masteredTopic}? You can do this too! 💪",
      "Oops! But remember how you got {masteredTopic}? Same thing here - you've got this!",
    ],
    older: [
      "Not quite, but remember how you conquered {masteredTopic}? You can apply that same thinking here.",
      "This is tricky, but you've tackled hard things before - like {masteredTopic}! Use that same approach.",
    ],
  },

  // 7. Quiz - Improvement
  quiz_improvement: {
    young: [
      "Wow {displayName}! {score}%! That's better than last time! You're getting SO good! 🎉",
      "Amazing! {score}%! You went from {firstScore}% to {score}%! 🚀",
    ],
    older: [
      "{score}%! That's a {improvement}% improvement from your last attempt, {displayName}! Your practice is clearly paying off!",
      "Great progress! You went from {firstScore}% to {score}%. That's what consistent effort looks like!",
    ],
  },

  // 8. Quiz - Below Expectations but Growing
  quiz_below_expectations: {
    young: [
      "{score}% is a great start, {displayName}! Each try helps you learn more! 🌱",
      "You got {score}%! Let's practice the tricky parts together! 💪",
    ],
    older: [
      "{score}% - not your best, but remember: you've improved before and you will again. Let's look at what tripped you up.",
      "This quiz was challenging! {score}% gives us a clear picture of what to practice. You've overcome tough topics before.",
    ],
  },

  // 9. Lesson Complete - Standard
  lesson_complete: {
    young: [
      "Yay! You finished the lesson, {displayName}! That's number {totalLessons}! 🎉",
      "All done! You're such a great learner! 🌟",
      "Lesson complete! You did it! ⭐",
    ],
    older: [
      "Lesson complete! That's {totalLessons} lessons now, {displayName}. You're building a solid foundation!",
      "Great work finishing this lesson! Ready to test what you learned?",
      "Another lesson in the books! Your knowledge is really growing!",
    ],
  },

  // 10. Lesson Complete - On Struggled Topic
  lesson_persistence: {
    young: [
      "You finished the {topic} lesson! Remember when this was hard? Look at you now! 🌟🌟🌟",
      "All done with {topic}! You're SO brave for sticking with it! 💪",
    ],
    older: [
      "You finished the {topic} lesson - a topic that used to challenge you! That takes real determination.",
      "Completed! {topic} was tough, but you stuck with it. That persistence is what sets great learners apart.",
    ],
  },
};

// ============================================
// ENCOURAGEMENT SERVICE
// ============================================

export const encouragementService = {
  /**
   * Generate contextual encouragement for an answer attempt
   */
  async getExerciseEncouragement(
    childId: string,
    isCorrect: boolean,
    attemptNumber: number,
    topic?: string,
    subject?: Subject
  ): Promise<PersonalizedEncouragement> {
    try {
      // Get memory context
      const memoryContext = await memoryService.getMemoryContext(childId);

      // Record the attempt in memory
      await memoryService.recordExerciseAttempt(
        childId,
        isCorrect,
        topic || 'General',
        subject || 'OTHER'
      );

      // Get session stats
      const session = await memoryService.getSessionMemory(childId);
      const correctInSession = session?.correctAnswersInSession || 0;

      // Build encouragement context
      const context: EncouragementContext = {
        displayName: memoryContext.displayName,
        outcome: isCorrect ? 'correct' : 'incorrect',
        attemptNumber,
        correctInSession: isCorrect ? correctInSession + 1 : correctInSession,
        currentTopic: topic || null,
        currentSubject: subject || null,
        recentStruggles: memoryContext.recentStruggles,
        masteredTopics: memoryContext.recentWins.map(w => w.achievement),
        previousQuizScore: null,
        currentScore: null,
        persistenceScore: memoryContext.persistenceScore,
        totalLessonsCompleted: memoryContext.totalLessonsCompleted,
        ageGroup: memoryContext.ageGroup,
      };

      // Determine encouragement type
      const type = this.determineEncouragementType(context);

      // Generate message
      const message = this.generateEncouragement(type, context);

      // Generate hint if needed
      const hint = !isCorrect ? this.generateHint(context) : undefined;

      return { type, message, hint };
    } catch (error) {
      logger.error('Error generating exercise encouragement', { childId, error });

      // Return safe fallback
      return {
        type: isCorrect ? 'correct_standard' : 'wrong_first_attempt',
        message: isCorrect ? 'Great job!' : 'Try again!',
      };
    }
  },

  /**
   * Generate encouragement for quiz completion
   */
  async getQuizEncouragement(
    childId: string,
    score: number,
    previousScore?: number | null,
    topic?: string
  ): Promise<PersonalizedEncouragement> {
    try {
      const memoryContext = await memoryService.getMemoryContext(childId);

      // Check if this is an improvement
      const hasImproved = previousScore !== null && previousScore !== undefined && score > previousScore;
      const improvement = hasImproved ? score - previousScore : 0;

      let type: EncouragementType;
      if (hasImproved) {
        type = 'quiz_improvement';
      } else if (score < 70) {
        type = 'quiz_below_expectations';
      } else {
        type = 'correct_standard'; // Good score
      }

      const context: EncouragementContext = {
        displayName: memoryContext.displayName,
        outcome: 'complete',
        attemptNumber: 1,
        correctInSession: 0,
        currentTopic: topic || null,
        currentSubject: null,
        recentStruggles: memoryContext.recentStruggles,
        masteredTopics: memoryContext.recentWins.map(w => w.achievement),
        previousQuizScore: previousScore || null,
        currentScore: score,
        persistenceScore: memoryContext.persistenceScore,
        totalLessonsCompleted: memoryContext.totalLessonsCompleted,
        ageGroup: memoryContext.ageGroup,
      };

      const message = this.generateEncouragement(type, context);

      // Record as a win if perfect score
      if (score === 100) {
        await memoryService.recordWin(
          childId,
          `Perfect quiz on ${topic || 'a topic'}`,
          '100% accuracy',
          'quiz_perfect'
        );
      }

      return { type, message };
    } catch (error) {
      logger.error('Error generating quiz encouragement', { childId, error });
      return {
        type: 'correct_standard',
        message: `You scored ${score}%!`,
      };
    }
  },

  /**
   * Generate encouragement for lesson completion
   */
  async getLessonCompleteEncouragement(
    childId: string,
    lessonId: string,
    topic: string,
    subject: string
  ): Promise<PersonalizedEncouragement> {
    try {
      // Record lesson completion
      await memoryService.recordLessonCompletion(childId, lessonId, topic, subject);

      const memoryContext = await memoryService.getMemoryContext(childId);

      // Check if this was a struggled topic
      const wasStruggledTopic = memoryContext.recentStruggles.some(
        s => s.topic.toLowerCase().includes(topic.toLowerCase()) ||
             topic.toLowerCase().includes(s.topic.toLowerCase())
      );

      const type: EncouragementType = wasStruggledTopic
        ? 'lesson_persistence'
        : 'lesson_complete';

      const context: EncouragementContext = {
        displayName: memoryContext.displayName,
        outcome: 'complete',
        attemptNumber: 1,
        correctInSession: 0,
        currentTopic: topic,
        currentSubject: subject as Subject,
        recentStruggles: memoryContext.recentStruggles,
        masteredTopics: memoryContext.recentWins.map(w => w.achievement),
        previousQuizScore: null,
        currentScore: null,
        persistenceScore: memoryContext.persistenceScore,
        totalLessonsCompleted: memoryContext.totalLessonsCompleted,
        ageGroup: memoryContext.ageGroup,
      };

      const message = this.generateEncouragement(type, context);

      // Record milestone if applicable
      if (memoryContext.totalLessonsCompleted % 10 === 0) {
        await memoryService.recordMemorableMoment(childId, {
          type: 'milestone',
          topic,
          subject,
          description: `Completed ${memoryContext.totalLessonsCompleted} lessons!`,
        });
      }

      return { type, message };
    } catch (error) {
      logger.error('Error generating lesson complete encouragement', { childId, error });
      return {
        type: 'lesson_complete',
        message: 'Great job completing the lesson!',
      };
    }
  },

  /**
   * Determine the most appropriate encouragement type
   */
  determineEncouragementType(context: EncouragementContext): EncouragementType {
    if (context.outcome === 'correct') {
      // Check for correct streak (5+)
      if (context.correctInSession >= 5) {
        return 'correct_streak';
      }

      // Check for struggle-to-success callback
      if (context.currentTopic && context.recentStruggles.length > 0) {
        const wasStruggle = context.recentStruggles.some(
          s => s.topic.toLowerCase().includes(context.currentTopic!.toLowerCase()) ||
               context.currentTopic!.toLowerCase().includes(s.topic.toLowerCase())
        );
        if (wasStruggle) {
          return 'correct_with_callback';
        }
      }

      return 'correct_standard';
    }

    // Wrong answer cases
    if (context.attemptNumber === 1) {
      return 'wrong_first_attempt';
    }

    // High persistence (multiple attempts)
    if (context.attemptNumber >= 2 && context.persistenceScore >= 0.5) {
      return 'wrong_persistence';
    }

    // Has success history
    if (context.masteredTopics.length > 0) {
      return 'wrong_after_success';
    }

    return 'wrong_first_attempt';
  },

  /**
   * Generate encouragement message from template
   */
  generateEncouragement(type: EncouragementType, context: EncouragementContext): string {
    const templates = ENCOURAGEMENT_TEMPLATES[type];
    const ageTemplates = context.ageGroup === 'YOUNG' ? templates.young : templates.older;
    let template = ageTemplates[Math.floor(Math.random() * ageTemplates.length)];

    // Replace placeholders
    template = template
      .replace(/{displayName}/g, context.displayName)
      .replace(/{correctInARow}/g, String(context.correctInSession))
      .replace(/{totalLessons}/g, String(context.totalLessonsCompleted))
      .replace(/{topic}/g, context.currentTopic || 'this topic')
      .replace(/{score}/g, String(context.currentScore || 0))
      .replace(/{firstScore}/g, String(context.previousQuizScore || 0))
      .replace(/{improvement}/g, String(
        (context.currentScore || 0) - (context.previousQuizScore || 0)
      ));

    // Handle struggled topic reference
    if (context.recentStruggles.length > 0) {
      template = template.replace(/{struggledTopic}/g, context.recentStruggles[0].topic);
    }

    // Handle mastered topic reference
    if (context.masteredTopics.length > 0) {
      template = template.replace(/{masteredTopic}/g, context.masteredTopics[0]);
    }

    return template;
  },

  /**
   * Generate a helpful hint for wrong answers
   */
  generateHint(context: EncouragementContext): string {
    const hints = context.ageGroup === 'YOUNG'
      ? [
          'Think about what we learned step by step!',
          'Try reading the question one more time!',
          'What clues can you find in the question?',
        ]
      : [
          'Break it down into smaller steps.',
          'What do you remember about this concept?',
          'Try eliminating answers you know are wrong.',
        ];

    return hints[Math.floor(Math.random() * hints.length)];
  },
};
