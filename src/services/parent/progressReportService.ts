/**
 * Progress Report Service
 *
 * Generates curriculum-appropriate progress reports for parents.
 * Each curriculum type has different metrics, terminology, and presentation styles.
 */

import { CurriculumType, Child, ChildStandardProgress } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { getCurriculumConfig, CurriculumConfig } from '../../config/curricula.js';

// Curriculum-specific metric interfaces
export interface BritishMetrics {
  workingTowards: number;        // Count of standards at "working towards"
  atExpected: number;            // Count at "at expected level"
  greaterDepth: number;          // Count at "greater depth"
  satsPrep: string;              // SATs preparation status
  readingBand?: string;          // Reading band level if applicable
  phonicsProgress?: string;      // Phonics progress for younger children
}

export interface CBSEMetrics {
  averageScore: number;          // Average percentage score
  questionsAttempted: number;    // Total questions attempted
  chaptersCompleted: string[];   // List of completed chapters/topics
  improvementTrend: 'improving' | 'stable' | 'declining';
  subjectBreakdown: Record<string, number>; // Subject-wise scores
}

export interface AmericanMetrics {
  standardsMastered: number;     // Count of mastered standards
  standardsInProgress: number;   // Count of in-progress standards
  effortScore: number;           // 1-5 star rating for effort
  growthIndicator: string;       // Growth description
  lexileLevel?: string;          // Lexile level if applicable
}

export interface IBMetrics {
  conceptualUnderstanding: 'emerging' | 'developing' | 'deep' | 'extending';
  inquirySkills: string;         // Description of inquiry skills development
  learnerProfileAttributes: string[]; // Active learner profile attributes
  approachesToLearning: string;  // ATL skills description
}

export interface CurriculumMetrics {
  british?: BritishMetrics;
  cbse?: CBSEMetrics;
  american?: AmericanMetrics;
  ib?: IBMetrics;
}

export interface ProgressReportData {
  childId: string;
  childDisplayName: string;
  curriculumType: CurriculumType;
  curriculumDisplayName: string;
  reportDate: Date;
  periodStart: Date;
  periodEnd: Date;

  // Summary in curriculum-appropriate language
  summary: string;

  // Curriculum-specific metrics
  metrics: CurriculumMetrics;

  // Parent communication style
  communicationTone: 'professional' | 'formal' | 'friendly' | 'reflective';

  // Key highlights
  highlights: string[];

  // Areas for focus (using curriculum-appropriate terminology)
  areasForFocus: string[];

  // Recent activity
  recentActivity: {
    lessonsCompleted: number;
    exercisesAttempted: number;
    flashcardsReviewed: number;
    quizzesTaken: number;
  };
}

/**
 * Child with related data needed for progress reports
 */
type ChildWithProgress = Child & {
  standardProgress: ChildStandardProgress[];
  lessons: { id: string; subject: string | null; completedAt: Date | null }[];
  exerciseAttempts: { id: string; isCorrect: boolean; createdAt: Date }[];
  flashcardDecks: { id: string; flashcards: { id: string }[] }[];
};

class ProgressReportService {
  /**
   * Generate a curriculum-appropriate progress report for a child
   */
  async generateProgressReport(
    childId: string,
    periodDays: number = 7
  ): Promise<ProgressReportData> {
    const periodEnd = new Date();
    const periodStart = new Date();
    periodStart.setDate(periodStart.getDate() - periodDays);

    // Fetch child with all relevant progress data
    const child = await prisma.child.findUnique({
      where: { id: childId },
      include: {
        standardProgress: {
          where: {
            updatedAt: { gte: periodStart },
          },
        },
        lessons: {
          where: {
            createdAt: { gte: periodStart },
          },
          select: {
            id: true,
            subject: true,
            completedAt: true,
          },
        },
        exerciseAttempts: {
          where: {
            createdAt: { gte: periodStart },
          },
          select: {
            id: true,
            isCorrect: true,
            createdAt: true,
          },
        },
        flashcardDecks: {
          include: {
            flashcards: {
              select: { id: true },
            },
          },
        },
      },
    }) as ChildWithProgress | null;

    if (!child) {
      throw new Error(`Child not found: ${childId}`);
    }

    const curriculumType = child.curriculumType || 'AMERICAN';
    const config = getCurriculumConfig(curriculumType);

    // Generate curriculum-specific metrics
    const metrics = this.generateCurriculumMetrics(child, curriculumType, config);

    // Generate summary in curriculum-appropriate language
    const summary = this.generateSummary(child, curriculumType, config, metrics);

    // Generate highlights and areas for focus
    const highlights = this.generateHighlights(child, curriculumType, config);
    const areasForFocus = this.generateAreasForFocus(child, curriculumType, config);

    // Calculate recent activity
    const recentActivity = {
      lessonsCompleted: child.lessons.filter(l => l.completedAt).length,
      exercisesAttempted: child.exerciseAttempts.length,
      flashcardsReviewed: child.flashcardDecks.reduce(
        (sum, deck) => sum + deck.flashcards.length,
        0
      ),
      quizzesTaken: 0, // TODO: Add quiz tracking when implemented
    };

    return {
      childId: child.id,
      childDisplayName: child.displayName,
      curriculumType,
      curriculumDisplayName: config.displayName,
      reportDate: new Date(),
      periodStart,
      periodEnd,
      summary,
      metrics,
      communicationTone: config.parentExpectations.communicationTone,
      highlights,
      areasForFocus,
      recentActivity,
    };
  }

  /**
   * Generate curriculum-specific metrics based on child's progress
   */
  private generateCurriculumMetrics(
    child: ChildWithProgress,
    curriculumType: CurriculumType,
    config: CurriculumConfig
  ): CurriculumMetrics {
    const progress = child.standardProgress;
    const exerciseAttempts = child.exerciseAttempts;

    switch (curriculumType) {
      case 'BRITISH':
        return {
          british: this.generateBritishMetrics(progress, child),
        };

      case 'INDIAN_CBSE':
      case 'INDIAN_ICSE':
        return {
          cbse: this.generateCBSEMetrics(progress, exerciseAttempts, child),
        };

      case 'AMERICAN':
        return {
          american: this.generateAmericanMetrics(progress, exerciseAttempts),
        };

      case 'IB':
        return {
          ib: this.generateIBMetrics(progress),
        };

      default:
        return {
          american: this.generateAmericanMetrics(progress, exerciseAttempts),
        };
    }
  }

  /**
   * Generate British National Curriculum metrics
   */
  private generateBritishMetrics(
    progress: ChildStandardProgress[],
    child: ChildWithProgress
  ): BritishMetrics {
    // Categorize standards by mastery level
    let workingTowards = 0;
    let atExpected = 0;
    let greaterDepth = 0;

    for (const p of progress) {
      const score = p.masteryScore ?? 0;
      if (score < 0.5) {
        workingTowards++;
      } else if (score < 0.8) {
        atExpected++;
      } else {
        greaterDepth++;
      }
    }

    // Determine SATs preparation status based on overall progress
    const total = progress.length || 1;
    const avgScore = progress.reduce((sum, p) => sum + (p.masteryScore ?? 0), 0) / total;
    let satsPrep = 'On track';
    if (avgScore >= 0.8) {
      satsPrep = 'Well prepared';
    } else if (avgScore < 0.5) {
      satsPrep = 'Additional support recommended';
    }

    return {
      workingTowards,
      atExpected,
      greaterDepth,
      satsPrep,
      phonicsProgress: child.gradeLevel && child.gradeLevel <= 2 ? 'Progressing well' : undefined,
    };
  }

  /**
   * Generate CBSE/ICSE metrics
   */
  private generateCBSEMetrics(
    progress: ChildStandardProgress[],
    exerciseAttempts: { id: string; isCorrect: boolean; createdAt: Date }[],
    child: ChildWithProgress
  ): CBSEMetrics {
    // Calculate average score
    const correctCount = exerciseAttempts.filter(a => a.isCorrect).length;
    const totalCount = exerciseAttempts.length || 1;
    const averageScore = Math.round((correctCount / totalCount) * 100);

    // Get completed chapters from lessons
    const chaptersCompleted = [...new Set(
      child.lessons
        .filter(l => l.completedAt && l.subject)
        .map(l => l.subject as string)
    )];

    // Determine improvement trend (simplified - would need historical data)
    let improvementTrend: 'improving' | 'stable' | 'declining' = 'stable';
    if (averageScore >= 75) {
      improvementTrend = 'improving';
    } else if (averageScore < 50) {
      improvementTrend = 'declining';
    }

    return {
      averageScore,
      questionsAttempted: totalCount,
      chaptersCompleted,
      improvementTrend,
      subjectBreakdown: {}, // TODO: Add subject-wise breakdown
    };
  }

  /**
   * Generate American Common Core metrics
   */
  private generateAmericanMetrics(
    progress: ChildStandardProgress[],
    exerciseAttempts: { id: string; isCorrect: boolean; createdAt: Date }[]
  ): AmericanMetrics {
    // Count standards by mastery status
    const standardsMastered = progress.filter(p => (p.masteryScore ?? 0) >= 0.8).length;
    const standardsInProgress = progress.filter(
      p => (p.masteryScore ?? 0) >= 0.3 && (p.masteryScore ?? 0) < 0.8
    ).length;

    // Calculate effort score (1-5 stars based on activity)
    const activityLevel = exerciseAttempts.length;
    let effortScore = 3;
    if (activityLevel >= 50) {
      effortScore = 5;
    } else if (activityLevel >= 30) {
      effortScore = 4;
    } else if (activityLevel >= 10) {
      effortScore = 3;
    } else if (activityLevel >= 5) {
      effortScore = 2;
    } else {
      effortScore = 1;
    }

    // Determine growth indicator
    let growthIndicator = 'Making steady progress';
    if (standardsMastered >= 5) {
      growthIndicator = 'Showing excellent growth!';
    } else if (standardsMastered >= 2) {
      growthIndicator = 'Building strong foundations';
    }

    return {
      standardsMastered,
      standardsInProgress,
      effortScore,
      growthIndicator,
    };
  }

  /**
   * Generate IB PYP metrics
   */
  private generateIBMetrics(progress: ChildStandardProgress[]): IBMetrics {
    // Determine conceptual understanding level
    const avgScore = progress.length > 0
      ? progress.reduce((sum, p) => sum + (p.masteryScore ?? 0), 0) / progress.length
      : 0;

    let conceptualUnderstanding: IBMetrics['conceptualUnderstanding'] = 'emerging';
    if (avgScore >= 0.85) {
      conceptualUnderstanding = 'extending';
    } else if (avgScore >= 0.65) {
      conceptualUnderstanding = 'deep';
    } else if (avgScore >= 0.4) {
      conceptualUnderstanding = 'developing';
    }

    // Determine learner profile attributes being developed
    const learnerProfileAttributes: string[] = [];
    if (progress.some(p => p.attemptsCount >= 5)) {
      learnerProfileAttributes.push('Thinker');
    }
    if (progress.length >= 3) {
      learnerProfileAttributes.push('Inquirer');
    }
    if (progress.some(p => (p.masteryScore ?? 0) >= 0.7)) {
      learnerProfileAttributes.push('Knowledgeable');
    }
    if (learnerProfileAttributes.length === 0) {
      learnerProfileAttributes.push('Growing learner');
    }

    return {
      conceptualUnderstanding,
      inquirySkills: conceptualUnderstanding === 'extending'
        ? 'Demonstrating strong inquiry skills and independent thinking'
        : conceptualUnderstanding === 'deep'
        ? 'Developing good questioning and exploration skills'
        : 'Building foundational inquiry abilities',
      learnerProfileAttributes,
      approachesToLearning: 'Developing thinking and research skills',
    };
  }

  /**
   * Generate summary in curriculum-appropriate language
   */
  private generateSummary(
    child: ChildWithProgress,
    curriculumType: CurriculumType,
    config: CurriculumConfig,
    metrics: CurriculumMetrics
  ): string {
    const terminology = config.parentExpectations.keyTerminology;

    switch (curriculumType) {
      case 'BRITISH': {
        const british = metrics.british!;
        const total = british.workingTowards + british.atExpected + british.greaterDepth;
        const atExpectedPercent = total > 0 ? Math.round((british.atExpected / total) * 100) : 0;
        const greaterDepthPercent = total > 0 ? Math.round((british.greaterDepth / total) * 100) : 0;
        return `${child.displayName} is ${terminology.progress} against NC expectations. ${atExpectedPercent}% of work at expected level, ${greaterDepthPercent}% at ${terminology.advanced}.`;
      }

      case 'INDIAN_CBSE':
      case 'INDIAN_ICSE': {
        const cbse = metrics.cbse!;
        const trendText = cbse.improvementTrend === 'improving' ? 'Improving' :
                         cbse.improvementTrend === 'declining' ? 'Needs attention' : 'Stable';
        return `This week's performance: Average score ${cbse.averageScore}%. ${cbse.questionsAttempted} questions attempted. ${cbse.chaptersCompleted.length > 0 ? `Topics covered: ${cbse.chaptersCompleted.join(', ')}.` : ''} Trend: ${trendText}.`;
      }

      case 'AMERICAN': {
        const american = metrics.american!;
        const stars = '⭐'.repeat(american.effortScore);
        return `What a great week! ${child.displayName} ${terminology.mastery} ${american.standardsMastered} new standards and is working on ${american.standardsInProgress} more. Effort score: ${stars}`;
      }

      case 'IB': {
        const ib = metrics.ib!;
        return `${child.displayName} has been exploring and ${terminology.progress}. ${ib.inquirySkills} Growing: ${ib.learnerProfileAttributes.join(', ')}.`;
      }

      default:
        return `${child.displayName} is making good progress in their learning journey.`;
    }
  }

  /**
   * Generate highlights based on curriculum type
   */
  private generateHighlights(
    child: ChildWithProgress,
    curriculumType: CurriculumType,
    config: CurriculumConfig
  ): string[] {
    const highlights: string[] = [];
    const terminology = config.parentExpectations.keyTerminology;

    // Common highlights
    const lessonsCompleted = child.lessons.filter(l => l.completedAt).length;
    if (lessonsCompleted > 0) {
      highlights.push(`Completed ${lessonsCompleted} lesson${lessonsCompleted > 1 ? 's' : ''}`);
    }

    // Curriculum-specific highlights
    const masteredCount = child.standardProgress.filter(p => (p.masteryScore ?? 0) >= 0.8).length;
    if (masteredCount > 0) {
      switch (curriculumType) {
        case 'BRITISH':
          highlights.push(`Achieved ${terminology.advanced} in ${masteredCount} area${masteredCount > 1 ? 's' : ''}`);
          break;
        case 'AMERICAN':
          highlights.push(`${terminology.mastery} ${masteredCount} standard${masteredCount > 1 ? 's' : ''}!`);
          break;
        case 'IB':
          highlights.push(`Demonstrated ${terminology.mastery} in ${masteredCount} concept${masteredCount > 1 ? 's' : ''}`);
          break;
        default:
          highlights.push(`Showed ${terminology.mastery} in ${masteredCount} topic${masteredCount > 1 ? 's' : ''}`);
      }
    }

    // Exercise performance
    const correctExercises = child.exerciseAttempts.filter(a => a.isCorrect).length;
    if (correctExercises > 5) {
      highlights.push(`Correctly answered ${correctExercises} practice problems`);
    }

    return highlights.length > 0 ? highlights : ['Engaging with learning materials'];
  }

  /**
   * Generate areas for focus using curriculum-appropriate terminology
   */
  private generateAreasForFocus(
    child: ChildWithProgress,
    curriculumType: CurriculumType,
    config: CurriculumConfig
  ): string[] {
    const areas: string[] = [];
    const terminology = config.parentExpectations.keyTerminology;

    // Find standards that need work
    const needsWork = child.standardProgress.filter(p => (p.masteryScore ?? 0) < 0.5);

    if (needsWork.length > 0) {
      switch (curriculumType) {
        case 'BRITISH':
          areas.push(`${needsWork.length} area${needsWork.length > 1 ? 's' : ''} ${terminology.struggling} expected level`);
          break;
        case 'INDIAN_CBSE':
        case 'INDIAN_ICSE':
          areas.push(`${needsWork.length} topic${needsWork.length > 1 ? 's' : ''} ${terminology.struggling}`);
          break;
        case 'AMERICAN':
          areas.push(`${needsWork.length} standard${needsWork.length > 1 ? 's' : ''} still ${terminology.struggling}`);
          break;
        case 'IB':
          areas.push(`${needsWork.length} concept${needsWork.length > 1 ? 's' : ''} at ${terminology.struggling} stage`);
          break;
        default:
          areas.push(`${needsWork.length} area${needsWork.length > 1 ? 's' : ''} to focus on`);
      }
    }

    // Check for low activity
    if (child.exerciseAttempts.length < 5) {
      areas.push('Encourage more practice activities');
    }

    return areas.length > 0 ? areas : ['Continue regular practice'];
  }
}

export const progressReportService = new ProgressReportService();
