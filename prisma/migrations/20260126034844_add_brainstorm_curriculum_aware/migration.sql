-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('BADGE_EARNED', 'LEVEL_UP', 'STREAK_MILESTONE', 'LESSON_COMPLETED', 'WEEKLY_DIGEST');

-- CreateEnum
CREATE TYPE "DisabilityCategory" AS ENUM ('SPECIFIC_LEARNING_DISABILITY', 'SPEECH_LANGUAGE_IMPAIRMENT', 'OTHER_HEALTH_IMPAIRMENT', 'AUTISM_SPECTRUM', 'EMOTIONAL_DISTURBANCE', 'INTELLECTUAL_DISABILITY', 'DEVELOPMENTAL_DELAY', 'MULTIPLE_DISABILITIES', 'HEARING_IMPAIRMENT', 'VISUAL_IMPAIRMENT', 'ORTHOPEDIC_IMPAIRMENT', 'TRAUMATIC_BRAIN_INJURY', 'DEAF_BLINDNESS');

-- CreateEnum
CREATE TYPE "IEPSubjectArea" AS ENUM ('READING_FLUENCY', 'READING_COMPREHENSION', 'WRITTEN_EXPRESSION', 'MATH_CALCULATION', 'MATH_PROBLEM_SOLVING', 'SPEECH_ARTICULATION', 'EXPRESSIVE_LANGUAGE', 'RECEPTIVE_LANGUAGE', 'SOCIAL_SKILLS', 'BEHAVIOR_SELF_REGULATION', 'EXECUTIVE_FUNCTIONING', 'FINE_MOTOR', 'GROSS_MOTOR', 'ADAPTIVE_LIVING_SKILLS', 'TRANSITION_VOCATIONAL');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'ANALYST');

-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('FREE', 'FAMILY', 'FAMILY_PLUS', 'ANNUAL');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'EXPIRED', 'PAST_DUE');

-- CreateEnum
CREATE TYPE "AgeGroup" AS ENUM ('YOUNG', 'OLDER');

-- CreateEnum
CREATE TYPE "CurriculumType" AS ENUM ('BRITISH', 'AMERICAN', 'INDIAN_CBSE', 'INDIAN_ICSE', 'IB', 'ARABIC');

-- CreateEnum
CREATE TYPE "LearningStyle" AS ENUM ('VISUAL', 'AUDITORY', 'READING', 'KINESTHETIC');

-- CreateEnum
CREATE TYPE "ConsentMethod" AS ENUM ('CREDIT_CARD', 'KBQ', 'MANUAL_REVIEW');

-- CreateEnum
CREATE TYPE "ConsentStatus" AS ENUM ('PENDING', 'VERIFIED', 'FAILED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "VoiceConsentStatus" AS ENUM ('PENDING', 'GRANTED', 'DENIED', 'REVOKED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "VoiceContextType" AS ENUM ('QUIZ_ANSWER', 'CHAT_MESSAGE', 'EXERCISE_ANSWER', 'FLASHCARD_RESPONSE');

-- CreateEnum
CREATE TYPE "Subject" AS ENUM ('MATH', 'SCIENCE', 'ENGLISH', 'ARABIC', 'ISLAMIC_STUDIES', 'SOCIAL_STUDIES', 'HISTORY', 'GEOGRAPHY', 'PHYSICAL_EDUCATION', 'HEALTH', 'COMPUTER_SCIENCE', 'READING', 'FOREIGN_LANGUAGE', 'ECONOMICS', 'DRAMA', 'ENVIRONMENTAL_STUDIES', 'ART', 'MUSIC', 'OTHER');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('PDF', 'IMAGE', 'YOUTUBE', 'TEXT', 'CAMERA', 'PPT');

-- CreateEnum
CREATE TYPE "ProcessingStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "MessageRole" AS ENUM ('USER', 'ASSISTANT', 'SYSTEM');

-- CreateEnum
CREATE TYPE "QuizType" AS ENUM ('MULTIPLE_CHOICE', 'TRUE_FALSE', 'FILL_BLANK', 'MATCHING');

-- CreateEnum
CREATE TYPE "XPReason" AS ENUM ('LESSON_COMPLETE', 'LESSON_PROGRESS', 'FLASHCARD_REVIEW', 'FLASHCARD_CORRECT', 'QUIZ_COMPLETE', 'QUIZ_PERFECT', 'CHAT_QUESTION', 'DAILY_CHALLENGE', 'STREAK_BONUS', 'BADGE_EARNED', 'FIRST_OF_DAY', 'TEXT_SELECTION', 'EXERCISE_CORRECT', 'EXERCISE_PERFECT', 'NOTE_CREATED', 'NOTE_EDITED', 'WELCOME_BONUS');

-- CreateEnum
CREATE TYPE "BadgeCategory" AS ENUM ('LEARNING', 'STREAK', 'MASTERY', 'SOCIAL', 'SPECIAL');

-- CreateEnum
CREATE TYPE "BadgeRarity" AS ENUM ('COMMON', 'RARE', 'EPIC', 'LEGENDARY');

-- CreateEnum
CREATE TYPE "ChallengeType" AS ENUM ('LESSONS', 'QUESTIONS', 'FLASHCARDS', 'TIME', 'STREAK');

-- CreateEnum
CREATE TYPE "SelectionAction" AS ENUM ('ASK', 'FLASHCARD', 'QUIZ', 'SAVE', 'READ');

-- CreateEnum
CREATE TYPE "SafetyIncidentType" AS ENUM ('PROFANITY', 'PII_DETECTED', 'INAPPROPRIATE_TOPIC', 'JAILBREAK_ATTEMPT', 'HARMFUL_CONTENT', 'BLOCKED_BY_GEMINI', 'PARENT_OVERRIDE');

-- CreateEnum
CREATE TYPE "SafetySeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ExerciseType" AS ENUM ('FILL_IN_BLANK', 'MATH_PROBLEM', 'SHORT_ANSWER', 'MULTIPLE_CHOICE', 'TRUE_FALSE');

-- CreateEnum
CREATE TYPE "AnswerType" AS ENUM ('TEXT', 'NUMBER', 'SELECTION');

-- CreateEnum
CREATE TYPE "ExerciseDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "NoteContentFormat" AS ENUM ('PLAIN', 'RICH_TEXT');

-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('SCHOOL', 'DISTRICT', 'TUTORING_CENTER', 'HOMESCHOOL_COOP', 'OTHER');

-- CreateEnum
CREATE TYPE "OrgSubscriptionTier" AS ENUM ('STARTER', 'PROFESSIONAL', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "TeacherSubscriptionTier" AS ENUM ('FREE', 'BASIC', 'PROFESSIONAL');

-- CreateEnum
CREATE TYPE "TeacherRole" AS ENUM ('TEACHER', 'DEPARTMENT_HEAD', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "TeacherContentType" AS ENUM ('LESSON', 'QUIZ', 'FLASHCARD_DECK', 'INFOGRAPHIC', 'WORKSHEET', 'STUDY_GUIDE');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "DocumentAnalysisStatus" AS ENUM ('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "TokenOperation" AS ENUM ('CONTENT_ANALYSIS', 'LESSON_GENERATION', 'QUIZ_GENERATION', 'FLASHCARD_GENERATION', 'INFOGRAPHIC_GENERATION', 'GRADING_SINGLE', 'GRADING_BATCH', 'FEEDBACK_GENERATION', 'CHAT', 'BRAINSTORM', 'AUDIO_UPDATE', 'SUB_PLAN_GENERATION', 'IEP_GOAL_GENERATION');

-- CreateEnum
CREATE TYPE "ScoringType" AS ENUM ('POINTS', 'PERCENTAGE', 'LETTER_GRADE', 'PASS_FAIL');

-- CreateEnum
CREATE TYPE "GradingJobStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'PARTIALLY_COMPLETED');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING', 'PROCESSING', 'GRADED', 'FLAGGED', 'REVIEWED', 'FINALIZED', 'ERROR');

-- CreateEnum
CREATE TYPE "AudioStatus" AS ENUM ('DRAFT', 'GENERATING', 'READY', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "LessonAudioStatus" AS ENUM ('NONE', 'GENERATING', 'READY', 'FAILED');

-- CreateEnum
CREATE TYPE "ShareChannel" AS ENUM ('WHATSAPP', 'EMAIL', 'INSTAGRAM', 'FACEBOOK', 'TWITTER', 'SMS', 'COPY_LINK', 'QR_CODE', 'OTHER');

-- CreateEnum
CREATE TYPE "ReferralStatus" AS ENUM ('PENDING', 'SIGNED_UP', 'TRIALING', 'CONVERTED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ShareableContentType" AS ENUM ('BADGE', 'STREAK_MILESTONE', 'QUIZ_RESULT', 'PROGRESS_REPORT', 'LEVEL_UP', 'TEACHER_AUDIO');

-- CreateEnum
CREATE TYPE "RewardType" AS ENUM ('FREE_MONTH', 'SUBSCRIPTION_CREDIT', 'TEACHER_CREDITS', 'DISCOUNT_COUPON');

-- CreateEnum
CREATE TYPE "RewardStatus" AS ENUM ('PENDING', 'AVAILABLE', 'APPLIED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "EquivalenceType" AS ENUM ('EXACT', 'PARTIAL', 'PREREQUISITE', 'ADVANCED', 'RELATED');

-- CreateEnum
CREATE TYPE "AlignableContentType" AS ENUM ('LESSON', 'QUIZ', 'FLASHCARD_DECK', 'EXERCISE', 'TEACHER_CONTENT');

-- CreateEnum
CREATE TYPE "StandardMasteryStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'APPROACHING', 'PROFICIENT', 'MASTERED');

-- CreateEnum
CREATE TYPE "ParentSummaryStatus" AS ENUM ('DRAFT', 'READY', 'SENT', 'VIEWED');

-- CreateEnum
CREATE TYPE "ExportStatus" AS ENUM ('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ExportFormat" AS ENUM ('PDF', 'PPTX');

-- CreateTable
CREATE TABLE "Parent" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "phone" TEXT,
    "country" TEXT NOT NULL DEFAULT 'AE',
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Dubai',
    "googleId" TEXT,
    "appleId" TEXT,
    "authProvider" TEXT NOT NULL DEFAULT 'email',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerifiedAt" TIMESTAMP(3),
    "kbqAnswers" JSONB,
    "preferredLanguage" TEXT NOT NULL DEFAULT 'en',
    "subscriptionTier" "SubscriptionTier" NOT NULL DEFAULT 'FREE',
    "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "subscriptionExpiresAt" TIMESTAMP(3),
    "trialEndsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "Parent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentPrivacyPreferences" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "learningAnalytics" BOOLEAN NOT NULL DEFAULT true,
    "usageAnalytics" BOOLEAN NOT NULL DEFAULT true,
    "personalization" BOOLEAN NOT NULL DEFAULT true,
    "thirdPartyAnalytics" BOOLEAN NOT NULL DEFAULT false,
    "improvementResearch" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParentPrivacyPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentNotificationPreference" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "pushEnabled" BOOLEAN NOT NULL DEFAULT true,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT false,
    "achievementAlerts" BOOLEAN NOT NULL DEFAULT true,
    "streakAlerts" BOOLEAN NOT NULL DEFAULT true,
    "lessonAlerts" BOOLEAN NOT NULL DEFAULT true,
    "weeklyDigest" BOOLEAN NOT NULL DEFAULT true,
    "quietHoursEnabled" BOOLEAN NOT NULL DEFAULT false,
    "quietHoursStart" INTEGER,
    "quietHoursEnd" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParentNotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentPushToken" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "deviceType" TEXT NOT NULL,
    "deviceName" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUsed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParentPushToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentNotificationLog" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "data" JSONB,
    "channel" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),
    "clickedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParentNotificationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Child" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "pin" CHAR(4) NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "ageGroup" "AgeGroup" NOT NULL,
    "pinAttempts" INTEGER NOT NULL DEFAULT 0,
    "pinLockedUntil" TIMESTAMP(3),
    "gradeLevel" INTEGER,
    "curriculumType" "CurriculumType",
    "preferredLanguage" TEXT NOT NULL DEFAULT 'en',
    "learningStyle" "LearningStyle",
    "voiceEnabled" BOOLEAN NOT NULL DEFAULT true,
    "avatarVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastActiveAt" TIMESTAMP(3),

    CONSTRAINT "Child_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consent" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "method" "ConsentMethod" NOT NULL,
    "status" "ConsentStatus" NOT NULL,
    "verificationData" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "consentGivenAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Consent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoiceConsent" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "status" "VoiceConsentStatus" NOT NULL DEFAULT 'PENDING',
    "consentGivenAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VoiceConsent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoiceTranscriptionLog" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "audioLengthMs" INTEGER NOT NULL,
    "transcriptionMs" INTEGER NOT NULL,
    "modelUsed" TEXT NOT NULL,
    "confidenceScore" DOUBLE PRECISION,
    "contextType" "VoiceContextType" NOT NULL,
    "contextId" TEXT,
    "wasRetried" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VoiceTranscriptionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentLessonUsage" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "month" DATE NOT NULL,
    "lessonsCreated" INTEGER NOT NULL DEFAULT 0,
    "notified70Pct" BOOLEAN NOT NULL DEFAULT false,
    "notified90Pct" BOOLEAN NOT NULL DEFAULT false,
    "notified100Pct" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParentLessonUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "subject" "Subject",
    "gradeLevel" TEXT,
    "sourceType" "SourceType" NOT NULL,
    "originalFileUrl" TEXT,
    "originalFileName" TEXT,
    "originalFileSize" INTEGER,
    "youtubeUrl" TEXT,
    "youtubeVideoId" TEXT,
    "extractedText" TEXT,
    "formattedContent" TEXT,
    "chapters" JSONB,
    "keyConcepts" TEXT[],
    "vocabulary" JSONB,
    "suggestedQuestions" TEXT[],
    "processingStatus" "ProcessingStatus" NOT NULL DEFAULT 'PENDING',
    "processingError" TEXT,
    "aiConfidence" DOUBLE PRECISION,
    "safetyReviewed" BOOLEAN NOT NULL DEFAULT false,
    "safetyFlags" TEXT[],
    "audioSummaryUrl" TEXT,
    "audioSummaryDuration" INTEGER,
    "audioSummaryStatus" "LessonAudioStatus" NOT NULL DEFAULT 'NONE',
    "percentComplete" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastAccessedAt" TIMESTAMP(3),
    "timeSpentSeconds" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "lessonId" TEXT,
    "role" "MessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "modelUsed" TEXT,
    "tokensUsed" INTEGER,
    "responseTimeMs" INTEGER,
    "safetyRatings" JSONB,
    "wasFiltered" BOOLEAN NOT NULL DEFAULT false,
    "filterReason" TEXT,
    "audioUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlashcardDeck" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "lessonId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "subject" "Subject",
    "isAIGenerated" BOOLEAN NOT NULL DEFAULT false,
    "masteryLevel" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastStudiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FlashcardDeck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flashcard" (
    "id" TEXT NOT NULL,
    "deckId" TEXT NOT NULL,
    "front" TEXT NOT NULL,
    "back" TEXT NOT NULL,
    "imageUrl" TEXT,
    "audioUrl" TEXT,
    "easeFactor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "interval" INTEGER NOT NULL DEFAULT 1,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "nextReviewAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "timesReviewed" INTEGER NOT NULL DEFAULT 0,
    "timesCorrect" INTEGER NOT NULL DEFAULT 0,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Flashcard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quiz" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "QuizType" NOT NULL,
    "questions" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizAttempt" (
    "id" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "timeSpentSeconds" INTEGER NOT NULL,
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProgress" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "currentXP" INTEGER NOT NULL DEFAULT 0,
    "totalXP" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "subjectProgress" JSONB,
    "lessonsCompleted" INTEGER NOT NULL DEFAULT 0,
    "questionsAnswered" INTEGER NOT NULL DEFAULT 0,
    "flashcardsReviewed" INTEGER NOT NULL DEFAULT 0,
    "perfectScores" INTEGER NOT NULL DEFAULT 0,
    "totalStudyTimeSeconds" INTEGER NOT NULL DEFAULT 0,
    "hasReceivedWelcomeBonus" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "XPTransaction" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" "XPReason" NOT NULL,
    "sourceType" TEXT,
    "sourceId" TEXT,
    "wasBonus" BOOLEAN NOT NULL DEFAULT false,
    "bonusMultiplier" DOUBLE PRECISION,
    "bonusReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "XPTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Streak" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "current" INTEGER NOT NULL DEFAULT 0,
    "longest" INTEGER NOT NULL DEFAULT 0,
    "lastActivityDate" DATE NOT NULL,
    "freezeAvailable" BOOLEAN NOT NULL DEFAULT false,
    "freezeUsedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Streak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Badge" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "category" "BadgeCategory" NOT NULL,
    "rarity" "BadgeRarity" NOT NULL,
    "requirements" JSONB NOT NULL,
    "xpReward" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EarnedBadge" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EarnedBadge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyChallenge" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "type" "ChallengeType" NOT NULL,
    "target" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "xpReward" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChallengeCompletion" (
    "id" TEXT NOT NULL,
    "challengeId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "ChallengeCompletion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TextSelection" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "selectedText" TEXT NOT NULL,
    "beforeContext" TEXT,
    "afterContext" TEXT,
    "pageNumber" INTEGER,
    "actionType" "SelectionAction" NOT NULL,
    "userQuestion" TEXT,
    "resultData" JSONB NOT NULL,
    "xpAwarded" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TextSelection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "lessonId" TEXT,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "originalText" TEXT,
    "subject" "Subject",
    "contentFormat" "NoteContentFormat" NOT NULL DEFAULT 'RICH_TEXT',
    "coverColor" TEXT DEFAULT '#FFD93D',
    "coverStickers" TEXT[],
    "coverPattern" TEXT DEFAULT 'dots',
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NoteComment" (
    "id" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "emoji" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NoteComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InteractiveExercise" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "type" "ExerciseType" NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "questionText" TEXT NOT NULL,
    "contextText" TEXT,
    "originalPosition" TEXT,
    "expectedAnswer" TEXT NOT NULL,
    "acceptableAnswers" TEXT[],
    "answerType" "AnswerType" NOT NULL DEFAULT 'TEXT',
    "options" JSONB,
    "hint1" TEXT,
    "hint2" TEXT,
    "explanation" TEXT,
    "difficulty" "ExerciseDifficulty" NOT NULL DEFAULT 'MEDIUM',
    "xpReward" INTEGER NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InteractiveExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseAttempt" (
    "id" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "submittedAnswer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "attemptNumber" INTEGER NOT NULL DEFAULT 1,
    "aiFeedback" TEXT,
    "xpAwarded" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExerciseAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SafetyLog" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "incidentType" "SafetyIncidentType" NOT NULL,
    "severity" "SafetySeverity" NOT NULL,
    "inputText" TEXT,
    "outputText" TEXT,
    "lessonId" TEXT,
    "geminiSafetyRatings" JSONB,
    "flags" TEXT[],
    "wasBlocked" BOOLEAN NOT NULL DEFAULT false,
    "parentNotified" BOOLEAN NOT NULL DEFAULT false,
    "parentNotifiedAt" TIMESTAMP(3),
    "parentAction" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SafetyLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "OrganizationType" NOT NULL,
    "stripeCustomerId" TEXT,
    "subscriptionTier" "OrgSubscriptionTier" NOT NULL DEFAULT 'STARTER',
    "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "monthlyTokenQuota" BIGINT NOT NULL DEFAULT 1000000,
    "currentMonthUsage" BIGINT NOT NULL DEFAULT 0,
    "quotaResetDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "googleId" TEXT,
    "authProvider" TEXT NOT NULL DEFAULT 'email',
    "schoolName" TEXT,
    "primarySubject" "Subject",
    "gradeRange" TEXT,
    "preferredCurriculum" "CurriculumType",
    "preferredGradeRange" TEXT,
    "country" TEXT,
    "countryCode" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT true,
    "emailVerifiedAt" TIMESTAMP(3),
    "notifyProductUpdates" BOOLEAN NOT NULL DEFAULT true,
    "notifyTipsAndTutorials" BOOLEAN NOT NULL DEFAULT true,
    "notifyUsageAlerts" BOOLEAN NOT NULL DEFAULT true,
    "notifyWeeklyDigest" BOOLEAN NOT NULL DEFAULT false,
    "organizationId" TEXT,
    "role" "TeacherRole" NOT NULL DEFAULT 'TEACHER',
    "subscriptionTier" "TeacherSubscriptionTier" NOT NULL DEFAULT 'FREE',
    "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "subscriptionExpiresAt" TIMESTAMP(3),
    "trialEndsAt" TIMESTAMP(3),
    "monthlyTokenQuota" BIGINT NOT NULL DEFAULT 100000,
    "currentMonthUsage" BIGINT NOT NULL DEFAULT 0,
    "quotaResetDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rolledOverCredits" INTEGER NOT NULL DEFAULT 0,
    "bonusCredits" INTEGER NOT NULL DEFAULT 0,
    "notifiedWarning70" BOOLEAN NOT NULL DEFAULT false,
    "notifiedWarning90" BOOLEAN NOT NULL DEFAULT false,
    "notifiedLimitReached" BOOLEAN NOT NULL DEFAULT false,
    "lastNotificationReset" TIMESTAMP(3),
    "googleDriveTokens" JSONB,
    "tutorialCompletedAt" TIMESTAMP(3),
    "lastActiveAt" TIMESTAMP(3),
    "lessonCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherCreditPackPurchase" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "packId" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeacherCreditPackPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenUsageLog" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "operation" "TokenOperation" NOT NULL,
    "tokensUsed" INTEGER NOT NULL,
    "modelUsed" TEXT NOT NULL,
    "resourceType" TEXT,
    "resourceId" TEXT,
    "estimatedCost" DECIMAL(10,6),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenUsageLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrgTokenUsageLog" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "operation" "TokenOperation" NOT NULL,
    "tokensUsed" INTEGER NOT NULL,
    "modelUsed" TEXT NOT NULL,
    "resourceType" TEXT,
    "resourceId" TEXT,
    "estimatedCost" DECIMAL(10,6),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrgTokenUsageLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherContent" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "subject" "Subject",
    "gradeLevel" TEXT,
    "contentType" "TeacherContentType" NOT NULL,
    "sourceType" "SourceType",
    "originalFileUrl" TEXT,
    "originalFileName" TEXT,
    "extractedText" TEXT,
    "lessonContent" JSONB,
    "quizContent" JSONB,
    "flashcardContent" JSONB,
    "infographicUrl" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "templateId" TEXT,
    "tokensUsed" INTEGER NOT NULL DEFAULT 0,
    "aiModelUsed" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeacherContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentTemplate" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "contentType" "TeacherContentType" NOT NULL,
    "subject" "Subject",
    "gradeLevel" TEXT,
    "structure" JSONB NOT NULL,
    "defaultSettings" JSONB,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rubric" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "subject" "Subject",
    "gradeLevel" TEXT,
    "criteria" JSONB NOT NULL,
    "maxScore" INTEGER NOT NULL,
    "scoringType" "ScoringType" NOT NULL DEFAULT 'POINTS',
    "passingThreshold" DOUBLE PRECISION,
    "gradingPrompt" TEXT,
    "confidenceThreshold" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rubric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GradingJob" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "rubricId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "GradingJobStatus" NOT NULL DEFAULT 'PENDING',
    "totalSubmissions" INTEGER NOT NULL DEFAULT 0,
    "gradedCount" INTEGER NOT NULL DEFAULT 0,
    "errorCount" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "processingError" TEXT,
    "totalTokensUsed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GradingJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GradingSubmission" (
    "id" TEXT NOT NULL,
    "gradingJobId" TEXT NOT NULL,
    "studentIdentifier" TEXT NOT NULL,
    "fileUrl" TEXT,
    "fileName" TEXT,
    "extractedText" TEXT,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "criteriaScores" JSONB,
    "totalScore" DOUBLE PRECISION,
    "percentageScore" DOUBLE PRECISION,
    "letterGrade" TEXT,
    "overallFeedback" TEXT,
    "strengths" TEXT[],
    "improvements" TEXT[],
    "confidenceScore" DOUBLE PRECISION,
    "flaggedForReview" BOOLEAN NOT NULL DEFAULT false,
    "flagReason" TEXT,
    "teacherReviewed" BOOLEAN NOT NULL DEFAULT false,
    "teacherOverride" JSONB,
    "teacherNotes" TEXT,
    "finalizedAt" TIMESTAMP(3),
    "tokensUsed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GradingSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Classroom" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subject" "Subject",
    "gradeLevel" TEXT,
    "accessCode" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Classroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherAudioUpdate" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "script" TEXT NOT NULL,
    "customNotes" TEXT,
    "audioUrl" TEXT,
    "duration" INTEGER,
    "language" TEXT NOT NULL DEFAULT 'en',
    "voiceId" TEXT,
    "lessonIds" TEXT[],
    "status" "AudioStatus" NOT NULL DEFAULT 'DRAFT',
    "tokensUsed" INTEGER NOT NULL DEFAULT 0,
    "modelUsed" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "TeacherAudioUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubstitutePlan" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "gradeLevel" TEXT,
    "schedule" JSONB NOT NULL,
    "classroomInfo" JSONB,
    "activities" JSONB NOT NULL,
    "materials" JSONB,
    "emergencyInfo" JSONB,
    "studentNotes" JSONB,
    "backupActivities" JSONB,
    "lessonIds" TEXT[],
    "pdfUrl" TEXT,
    "tokensUsed" INTEGER NOT NULL DEFAULT 0,
    "modelUsed" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubstitutePlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IEPGoalSession" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "studentIdentifier" TEXT,
    "gradeLevel" TEXT NOT NULL,
    "disabilityCategory" "DisabilityCategory" NOT NULL,
    "subjectArea" "IEPSubjectArea" NOT NULL,
    "presentLevels" TEXT NOT NULL,
    "strengths" TEXT,
    "challenges" TEXT,
    "generatedGoals" JSONB NOT NULL,
    "selectedGoals" JSONB,
    "selectedAccommodations" JSONB,
    "accommodations" JSONB NOT NULL,
    "progressMonitoring" JSONB,
    "goalStartDate" DATE,
    "goalEndDate" DATE,
    "tokensUsed" INTEGER NOT NULL DEFAULT 0,
    "modelUsed" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IEPGoalSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrainstormSession" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "title" TEXT,
    "curriculumType" "CurriculumType",
    "gradeLevel" TEXT,
    "subject" "Subject",
    "lessonId" TEXT,
    "lessonTitle" TEXT,
    "lessonContent" TEXT,
    "referencedStandardIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "totalTokens" INTEGER NOT NULL DEFAULT 0,
    "flashTokens" INTEGER NOT NULL DEFAULT 0,
    "proTokens" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrainstormSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrainstormMessage" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" "MessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "model" TEXT,
    "tokens" INTEGER NOT NULL DEFAULT 0,
    "standardReferences" JSONB,
    "imageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "imagePrompt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BrainstormMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'ANALYST',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerifiedAt" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivitySession" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "durationMinutes" INTEGER NOT NULL DEFAULT 0,
    "activities" JSONB NOT NULL DEFAULT '{}',
    "xpEarned" INTEGER NOT NULL DEFAULT 0,
    "lessonsStarted" INTEGER NOT NULL DEFAULT 0,
    "lessonsCompleted" INTEGER NOT NULL DEFAULT 0,
    "createdDate" DATE NOT NULL,
    "weekStart" DATE NOT NULL,
    "monthStart" DATE NOT NULL,
    "platform" TEXT,
    "deviceType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivitySession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyAnalyticsSnapshot" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "dauCount" INTEGER NOT NULL DEFAULT 0,
    "newUsersCount" INTEGER NOT NULL DEFAULT 0,
    "totalSessions" INTEGER NOT NULL DEFAULT 0,
    "avgSessionMinutes" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalXpAwarded" INTEGER NOT NULL DEFAULT 0,
    "lessonsCreated" INTEGER NOT NULL DEFAULT 0,
    "lessonsCompleted" INTEGER NOT NULL DEFAULT 0,
    "totalFreeUsers" INTEGER NOT NULL DEFAULT 0,
    "totalFamilyUsers" INTEGER NOT NULL DEFAULT 0,
    "totalFamilyPlusUsers" INTEGER NOT NULL DEFAULT 0,
    "estimatedMrr" DECIMAL(10,2) NOT NULL,
    "teacherDauCount" INTEGER NOT NULL DEFAULT 0,
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyAnalyticsSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CohortRetentionSnapshot" (
    "id" TEXT NOT NULL,
    "cohortMonth" DATE NOT NULL,
    "monthNumber" INTEGER NOT NULL,
    "cohortSize" INTEGER NOT NULL,
    "activeUsers" INTEGER NOT NULL,
    "retentionRate" DOUBLE PRECISION NOT NULL,
    "segment" TEXT DEFAULT 'all',
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CohortRetentionSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurriculumJurisdiction" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT,
    "organization" TEXT,
    "sourceUrl" TEXT,
    "lastSyncedAt" TIMESTAMP(3),
    "version" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurriculumJurisdiction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StandardSet" (
    "id" TEXT NOT NULL,
    "jurisdictionId" TEXT NOT NULL,
    "externalId" TEXT,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subject" "Subject" NOT NULL,
    "educationLevels" TEXT[],
    "gradeLevel" INTEGER,
    "ageRangeMin" INTEGER,
    "ageRangeMax" INTEGER,
    "phase" INTEGER,
    "keyStage" INTEGER,
    "documentTitle" TEXT,
    "documentYear" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StandardSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningStandard" (
    "id" TEXT NOT NULL,
    "standardSetId" TEXT NOT NULL,
    "externalId" TEXT,
    "notation" TEXT,
    "description" TEXT NOT NULL,
    "shortDescription" TEXT,
    "parentId" TEXT,
    "depth" INTEGER NOT NULL DEFAULT 0,
    "position" INTEGER NOT NULL DEFAULT 0,
    "strand" TEXT,
    "conceptualArea" TEXT,
    "bloomsLevel" TEXT,
    "isStatutory" BOOLEAN NOT NULL DEFAULT true,
    "guidance" TEXT,
    "ancestorDescriptions" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningStandard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StandardEquivalence" (
    "id" TEXT NOT NULL,
    "sourceStandardId" TEXT NOT NULL,
    "targetStandardId" TEXT NOT NULL,
    "equivalenceType" "EquivalenceType" NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.8,
    "notes" TEXT,
    "verifiedBy" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StandardEquivalence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentStandardAlignment" (
    "id" TEXT NOT NULL,
    "contentType" "AlignableContentType" NOT NULL,
    "contentId" TEXT NOT NULL,
    "standardId" TEXT NOT NULL,
    "alignmentStrength" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "alignedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentStandardAlignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChildStandardProgress" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "standardId" TEXT NOT NULL,
    "status" "StandardMasteryStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "masteryScore" DOUBLE PRECISION,
    "attemptsCount" INTEGER NOT NULL DEFAULT 0,
    "correctCount" INTEGER NOT NULL DEFAULT 0,
    "lastAttemptAt" TIMESTAMP(3),
    "firstMasteredAt" TIMESTAMP(3),
    "curriculumType" "CurriculumType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChildStandardProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurriculumSwitch" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "fromCurriculum" "CurriculumType" NOT NULL,
    "toCurriculum" "CurriculumType" NOT NULL,
    "fromGrade" INTEGER,
    "toGrade" INTEGER,
    "gapAnalysis" JSONB,
    "recommendedLessons" JSONB,
    "analysisCompletedAt" TIMESTAMP(3),
    "acknowledgedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CurriculumSwitch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "parentId" TEXT,
    "teacherId" TEXT,
    "totalReferrals" INTEGER NOT NULL DEFAULT 0,
    "successfulReferrals" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReferralCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL,
    "referralCodeId" TEXT NOT NULL,
    "referredParentId" TEXT,
    "referredTeacherId" TEXT,
    "channel" "ShareChannel" NOT NULL,
    "status" "ReferralStatus" NOT NULL DEFAULT 'PENDING',
    "attributedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "signedUpAt" TIMESTAMP(3),
    "subscribedAt" TIMESTAMP(3),
    "referrerRewardId" TEXT,
    "refereeDiscountId" TEXT,
    "referrerRewarded" BOOLEAN NOT NULL DEFAULT false,
    "refereeRewarded" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShareableContent" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "parentId" TEXT,
    "teacherId" TEXT,
    "contentType" "ShareableContentType" NOT NULL,
    "snapshotData" JSONB NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "referralCodeId" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShareableContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShareEvent" (
    "id" TEXT NOT NULL,
    "shareableContentId" TEXT,
    "parentId" TEXT,
    "teacherId" TEXT,
    "channel" "ShareChannel" NOT NULL,
    "platform" TEXT,
    "wasOpened" BOOLEAN NOT NULL DEFAULT false,
    "openedAt" TIMESTAMP(3),
    "convertedToSignup" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShareEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralReward" (
    "id" TEXT NOT NULL,
    "referralId" TEXT NOT NULL,
    "parentId" TEXT,
    "teacherId" TEXT,
    "rewardType" "RewardType" NOT NULL,
    "amount" DECIMAL(10,2),
    "stripeCouponId" TEXT,
    "description" TEXT NOT NULL,
    "status" "RewardStatus" NOT NULL DEFAULT 'PENDING',
    "appliedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReferralReward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentSharingPreferences" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "enableSharing" BOOLEAN NOT NULL DEFAULT true,
    "childSettings" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParentSharingPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OllieMemory" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "lastSessionAt" TIMESTAMP(3),
    "lastTopic" TEXT,
    "lastSubject" TEXT,
    "lastLessonId" TEXT,
    "weeklyPatterns" JSONB,
    "recentStruggles" JSONB,
    "recentWins" JSONB,
    "totalLessonsCompleted" INTEGER NOT NULL DEFAULT 0,
    "totalCorrectAnswers" INTEGER NOT NULL DEFAULT 0,
    "totalQuestionsAttempted" INTEGER NOT NULL DEFAULT 0,
    "strongestSubjects" TEXT[],
    "growthAreas" TEXT[],
    "persistenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "preferredEncouragementStyle" TEXT,
    "preferredTimeOfDay" TEXT,
    "preferredSessionLength" INTEGER,
    "memorableMoments" JSONB,
    "recentGreetingTemplates" JSONB,
    "upcomingMilestones" JSONB,
    "lastWeeklyUpdate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OllieMemory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentMemorySummary" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "headline" TEXT NOT NULL,
    "weeklyNarrative" TEXT,
    "weeklyHighlights" JSONB,
    "weeklyInsights" JSONB,
    "celebrationMoments" JSONB,
    "focusAreas" JSONB,
    "parentActionSuggestion" TEXT,
    "upcomingGoals" JSONB,
    "originalLanguage" TEXT NOT NULL DEFAULT 'en',
    "translatedTo" TEXT,
    "translatedContent" JSONB,
    "status" "ParentSummaryStatus" NOT NULL DEFAULT 'DRAFT',
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),
    "viewedAt" TIMESTAMP(3),
    "tokensUsed" INTEGER NOT NULL DEFAULT 0,
    "modelUsed" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParentMemorySummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherExport" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "contentTitle" TEXT NOT NULL,
    "format" "ExportFormat" NOT NULL,
    "filename" TEXT NOT NULL,
    "fileSize" INTEGER,
    "r2Key" TEXT,
    "r2Url" TEXT,
    "presentationId" TEXT,
    "editUrl" TEXT,
    "status" "ExportStatus" NOT NULL DEFAULT 'QUEUED',
    "errorMessage" TEXT,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "emailSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "TeacherExport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherDocumentAnalysis" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "filename" TEXT,
    "mimeType" TEXT NOT NULL,
    "status" "DocumentAnalysisStatus" NOT NULL DEFAULT 'QUEUED',
    "result" JSONB,
    "errorMessage" TEXT,
    "tokensUsed" INTEGER,
    "modelUsed" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "TeacherDocumentAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherTriggerLog" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "triggerName" TEXT NOT NULL,
    "monthKey" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "TeacherTriggerLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Parent_email_key" ON "Parent"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Parent_googleId_key" ON "Parent"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "Parent_appleId_key" ON "Parent"("appleId");

-- CreateIndex
CREATE INDEX "Parent_email_idx" ON "Parent"("email");

-- CreateIndex
CREATE INDEX "Parent_subscriptionTier_subscriptionStatus_idx" ON "Parent"("subscriptionTier", "subscriptionStatus");

-- CreateIndex
CREATE INDEX "Parent_createdAt_idx" ON "Parent"("createdAt");

-- CreateIndex
CREATE INDEX "Parent_country_idx" ON "Parent"("country");

-- CreateIndex
CREATE UNIQUE INDEX "ParentPrivacyPreferences_parentId_key" ON "ParentPrivacyPreferences"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "ParentNotificationPreference_parentId_key" ON "ParentNotificationPreference"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "ParentPushToken_token_key" ON "ParentPushToken"("token");

-- CreateIndex
CREATE INDEX "ParentPushToken_parentId_idx" ON "ParentPushToken"("parentId");

-- CreateIndex
CREATE INDEX "ParentPushToken_token_idx" ON "ParentPushToken"("token");

-- CreateIndex
CREATE INDEX "ParentNotificationLog_parentId_idx" ON "ParentNotificationLog"("parentId");

-- CreateIndex
CREATE INDEX "ParentNotificationLog_childId_idx" ON "ParentNotificationLog"("childId");

-- CreateIndex
CREATE INDEX "ParentNotificationLog_type_idx" ON "ParentNotificationLog"("type");

-- CreateIndex
CREATE INDEX "ParentNotificationLog_sentAt_idx" ON "ParentNotificationLog"("sentAt");

-- CreateIndex
CREATE INDEX "Child_parentId_idx" ON "Child"("parentId");

-- CreateIndex
CREATE INDEX "Child_parentId_ageGroup_idx" ON "Child"("parentId", "ageGroup");

-- CreateIndex
CREATE INDEX "Child_parentId_lastActiveAt_idx" ON "Child"("parentId", "lastActiveAt");

-- CreateIndex
CREATE INDEX "Child_createdAt_idx" ON "Child"("createdAt");

-- CreateIndex
CREATE INDEX "Consent_parentId_status_idx" ON "Consent"("parentId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "VoiceConsent_childId_key" ON "VoiceConsent"("childId");

-- CreateIndex
CREATE INDEX "VoiceConsent_childId_status_idx" ON "VoiceConsent"("childId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "VoiceConsent_parentId_childId_key" ON "VoiceConsent"("parentId", "childId");

-- CreateIndex
CREATE INDEX "VoiceTranscriptionLog_childId_createdAt_idx" ON "VoiceTranscriptionLog"("childId", "createdAt");

-- CreateIndex
CREATE INDEX "VoiceTranscriptionLog_contextType_createdAt_idx" ON "VoiceTranscriptionLog"("contextType", "createdAt");

-- CreateIndex
CREATE INDEX "ParentLessonUsage_parentId_month_idx" ON "ParentLessonUsage"("parentId", "month");

-- CreateIndex
CREATE UNIQUE INDEX "ParentLessonUsage_parentId_month_key" ON "ParentLessonUsage"("parentId", "month");

-- CreateIndex
CREATE INDEX "Lesson_childId_createdAt_idx" ON "Lesson"("childId", "createdAt");

-- CreateIndex
CREATE INDEX "Lesson_processingStatus_idx" ON "Lesson"("processingStatus");

-- CreateIndex
CREATE INDEX "Lesson_childId_completedAt_idx" ON "Lesson"("childId", "completedAt");

-- CreateIndex
CREATE INDEX "Lesson_childId_subject_processingStatus_idx" ON "Lesson"("childId", "subject", "processingStatus");

-- CreateIndex
CREATE INDEX "Lesson_childId_processingStatus_createdAt_idx" ON "Lesson"("childId", "processingStatus", "createdAt");

-- CreateIndex
CREATE INDEX "ChatMessage_childId_createdAt_idx" ON "ChatMessage"("childId", "createdAt");

-- CreateIndex
CREATE INDEX "ChatMessage_lessonId_idx" ON "ChatMessage"("lessonId");

-- CreateIndex
CREATE INDEX "ChatMessage_childId_lessonId_createdAt_idx" ON "ChatMessage"("childId", "lessonId", "createdAt");

-- CreateIndex
CREATE INDEX "FlashcardDeck_childId_idx" ON "FlashcardDeck"("childId");

-- CreateIndex
CREATE INDEX "Flashcard_deckId_nextReviewAt_idx" ON "Flashcard"("deckId", "nextReviewAt");

-- CreateIndex
CREATE INDEX "Quiz_lessonId_idx" ON "Quiz"("lessonId");

-- CreateIndex
CREATE INDEX "QuizAttempt_quizId_idx" ON "QuizAttempt"("quizId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProgress_childId_key" ON "UserProgress"("childId");

-- CreateIndex
CREATE INDEX "XPTransaction_childId_createdAt_idx" ON "XPTransaction"("childId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Streak_childId_key" ON "Streak"("childId");

-- CreateIndex
CREATE UNIQUE INDEX "Badge_code_key" ON "Badge"("code");

-- CreateIndex
CREATE INDEX "EarnedBadge_childId_idx" ON "EarnedBadge"("childId");

-- CreateIndex
CREATE INDEX "EarnedBadge_childId_earnedAt_idx" ON "EarnedBadge"("childId", "earnedAt");

-- CreateIndex
CREATE UNIQUE INDEX "EarnedBadge_childId_badgeId_key" ON "EarnedBadge"("childId", "badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyChallenge_date_key" ON "DailyChallenge"("date");

-- CreateIndex
CREATE INDEX "DailyChallenge_date_idx" ON "DailyChallenge"("date");

-- CreateIndex
CREATE UNIQUE INDEX "ChallengeCompletion_challengeId_childId_key" ON "ChallengeCompletion"("challengeId", "childId");

-- CreateIndex
CREATE INDEX "TextSelection_childId_createdAt_idx" ON "TextSelection"("childId", "createdAt");

-- CreateIndex
CREATE INDEX "TextSelection_lessonId_idx" ON "TextSelection"("lessonId");

-- CreateIndex
CREATE INDEX "Note_childId_subject_idx" ON "Note"("childId", "subject");

-- CreateIndex
CREATE INDEX "Note_childId_lessonId_idx" ON "Note"("childId", "lessonId");

-- CreateIndex
CREATE INDEX "Note_childId_isPinned_orderIndex_idx" ON "Note"("childId", "isPinned", "orderIndex");

-- CreateIndex
CREATE INDEX "NoteComment_noteId_createdAt_idx" ON "NoteComment"("noteId", "createdAt");

-- CreateIndex
CREATE INDEX "InteractiveExercise_lessonId_orderIndex_idx" ON "InteractiveExercise"("lessonId", "orderIndex");

-- CreateIndex
CREATE INDEX "ExerciseAttempt_exerciseId_childId_idx" ON "ExerciseAttempt"("exerciseId", "childId");

-- CreateIndex
CREATE INDEX "ExerciseAttempt_childId_createdAt_idx" ON "ExerciseAttempt"("childId", "createdAt");

-- CreateIndex
CREATE INDEX "SafetyLog_childId_createdAt_idx" ON "SafetyLog"("childId", "createdAt");

-- CreateIndex
CREATE INDEX "SafetyLog_severity_idx" ON "SafetyLog"("severity");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE INDEX "Organization_slug_idx" ON "Organization"("slug");

-- CreateIndex
CREATE INDEX "Organization_subscriptionStatus_quotaResetDate_idx" ON "Organization"("subscriptionStatus", "quotaResetDate");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_email_key" ON "Teacher"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_googleId_key" ON "Teacher"("googleId");

-- CreateIndex
CREATE INDEX "Teacher_email_idx" ON "Teacher"("email");

-- CreateIndex
CREATE INDEX "Teacher_organizationId_idx" ON "Teacher"("organizationId");

-- CreateIndex
CREATE INDEX "Teacher_subscriptionStatus_quotaResetDate_idx" ON "Teacher"("subscriptionStatus", "quotaResetDate");

-- CreateIndex
CREATE INDEX "Teacher_lastActiveAt_idx" ON "Teacher"("lastActiveAt");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherCreditPackPurchase_stripeSessionId_key" ON "TeacherCreditPackPurchase"("stripeSessionId");

-- CreateIndex
CREATE INDEX "TeacherCreditPackPurchase_teacherId_createdAt_idx" ON "TeacherCreditPackPurchase"("teacherId", "createdAt");

-- CreateIndex
CREATE INDEX "TokenUsageLog_teacherId_createdAt_idx" ON "TokenUsageLog"("teacherId", "createdAt");

-- CreateIndex
CREATE INDEX "TokenUsageLog_operation_idx" ON "TokenUsageLog"("operation");

-- CreateIndex
CREATE INDEX "TokenUsageLog_teacherId_operation_createdAt_idx" ON "TokenUsageLog"("teacherId", "operation", "createdAt");

-- CreateIndex
CREATE INDEX "OrgTokenUsageLog_organizationId_createdAt_idx" ON "OrgTokenUsageLog"("organizationId", "createdAt");

-- CreateIndex
CREATE INDEX "OrgTokenUsageLog_teacherId_createdAt_idx" ON "OrgTokenUsageLog"("teacherId", "createdAt");

-- CreateIndex
CREATE INDEX "OrgTokenUsageLog_organizationId_operation_createdAt_idx" ON "OrgTokenUsageLog"("organizationId", "operation", "createdAt");

-- CreateIndex
CREATE INDEX "TeacherContent_teacherId_contentType_idx" ON "TeacherContent"("teacherId", "contentType");

-- CreateIndex
CREATE INDEX "TeacherContent_subject_gradeLevel_idx" ON "TeacherContent"("subject", "gradeLevel");

-- CreateIndex
CREATE INDEX "TeacherContent_status_idx" ON "TeacherContent"("status");

-- CreateIndex
CREATE INDEX "ContentTemplate_teacherId_idx" ON "ContentTemplate"("teacherId");

-- CreateIndex
CREATE INDEX "Rubric_teacherId_idx" ON "Rubric"("teacherId");

-- CreateIndex
CREATE INDEX "Rubric_subject_idx" ON "Rubric"("subject");

-- CreateIndex
CREATE INDEX "GradingJob_teacherId_status_idx" ON "GradingJob"("teacherId", "status");

-- CreateIndex
CREATE INDEX "GradingJob_rubricId_idx" ON "GradingJob"("rubricId");

-- CreateIndex
CREATE INDEX "GradingSubmission_gradingJobId_status_idx" ON "GradingSubmission"("gradingJobId", "status");

-- CreateIndex
CREATE INDEX "GradingSubmission_flaggedForReview_idx" ON "GradingSubmission"("flaggedForReview");

-- CreateIndex
CREATE UNIQUE INDEX "Classroom_accessCode_key" ON "Classroom"("accessCode");

-- CreateIndex
CREATE INDEX "Classroom_teacherId_idx" ON "Classroom"("teacherId");

-- CreateIndex
CREATE INDEX "Classroom_accessCode_idx" ON "Classroom"("accessCode");

-- CreateIndex
CREATE INDEX "TeacherAudioUpdate_teacherId_idx" ON "TeacherAudioUpdate"("teacherId");

-- CreateIndex
CREATE INDEX "TeacherAudioUpdate_teacherId_status_idx" ON "TeacherAudioUpdate"("teacherId", "status");

-- CreateIndex
CREATE INDEX "TeacherAudioUpdate_teacherId_createdAt_idx" ON "TeacherAudioUpdate"("teacherId", "createdAt");

-- CreateIndex
CREATE INDEX "SubstitutePlan_teacherId_idx" ON "SubstitutePlan"("teacherId");

-- CreateIndex
CREATE INDEX "SubstitutePlan_teacherId_date_idx" ON "SubstitutePlan"("teacherId", "date");

-- CreateIndex
CREATE INDEX "SubstitutePlan_teacherId_createdAt_idx" ON "SubstitutePlan"("teacherId", "createdAt");

-- CreateIndex
CREATE INDEX "IEPGoalSession_teacherId_idx" ON "IEPGoalSession"("teacherId");

-- CreateIndex
CREATE INDEX "IEPGoalSession_teacherId_disabilityCategory_idx" ON "IEPGoalSession"("teacherId", "disabilityCategory");

-- CreateIndex
CREATE INDEX "IEPGoalSession_teacherId_createdAt_idx" ON "IEPGoalSession"("teacherId", "createdAt");

-- CreateIndex
CREATE INDEX "BrainstormSession_teacherId_createdAt_idx" ON "BrainstormSession"("teacherId", "createdAt");

-- CreateIndex
CREATE INDEX "BrainstormSession_teacherId_curriculumType_idx" ON "BrainstormSession"("teacherId", "curriculumType");

-- CreateIndex
CREATE INDEX "BrainstormSession_teacherId_subject_idx" ON "BrainstormSession"("teacherId", "subject");

-- CreateIndex
CREATE INDEX "BrainstormMessage_sessionId_createdAt_idx" ON "BrainstormMessage"("sessionId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE INDEX "Admin_email_idx" ON "Admin"("email");

-- CreateIndex
CREATE INDEX "ActivitySession_createdDate_idx" ON "ActivitySession"("createdDate");

-- CreateIndex
CREATE INDEX "ActivitySession_childId_createdDate_idx" ON "ActivitySession"("childId", "createdDate");

-- CreateIndex
CREATE INDEX "ActivitySession_weekStart_idx" ON "ActivitySession"("weekStart");

-- CreateIndex
CREATE INDEX "ActivitySession_monthStart_idx" ON "ActivitySession"("monthStart");

-- CreateIndex
CREATE UNIQUE INDEX "DailyAnalyticsSnapshot_date_key" ON "DailyAnalyticsSnapshot"("date");

-- CreateIndex
CREATE INDEX "DailyAnalyticsSnapshot_date_idx" ON "DailyAnalyticsSnapshot"("date");

-- CreateIndex
CREATE INDEX "CohortRetentionSnapshot_cohortMonth_idx" ON "CohortRetentionSnapshot"("cohortMonth");

-- CreateIndex
CREATE INDEX "CohortRetentionSnapshot_computedAt_idx" ON "CohortRetentionSnapshot"("computedAt");

-- CreateIndex
CREATE UNIQUE INDEX "CohortRetentionSnapshot_cohortMonth_monthNumber_segment_key" ON "CohortRetentionSnapshot"("cohortMonth", "monthNumber", "segment");

-- CreateIndex
CREATE UNIQUE INDEX "CurriculumJurisdiction_code_key" ON "CurriculumJurisdiction"("code");

-- CreateIndex
CREATE INDEX "CurriculumJurisdiction_code_idx" ON "CurriculumJurisdiction"("code");

-- CreateIndex
CREATE INDEX "CurriculumJurisdiction_country_idx" ON "CurriculumJurisdiction"("country");

-- CreateIndex
CREATE INDEX "StandardSet_jurisdictionId_subject_gradeLevel_idx" ON "StandardSet"("jurisdictionId", "subject", "gradeLevel");

-- CreateIndex
CREATE INDEX "StandardSet_subject_educationLevels_idx" ON "StandardSet"("subject", "educationLevels");

-- CreateIndex
CREATE UNIQUE INDEX "StandardSet_jurisdictionId_code_key" ON "StandardSet"("jurisdictionId", "code");

-- CreateIndex
CREATE INDEX "LearningStandard_standardSetId_position_idx" ON "LearningStandard"("standardSetId", "position");

-- CreateIndex
CREATE INDEX "LearningStandard_notation_idx" ON "LearningStandard"("notation");

-- CreateIndex
CREATE INDEX "LearningStandard_strand_conceptualArea_idx" ON "LearningStandard"("strand", "conceptualArea");

-- CreateIndex
CREATE UNIQUE INDEX "LearningStandard_standardSetId_notation_key" ON "LearningStandard"("standardSetId", "notation");

-- CreateIndex
CREATE INDEX "StandardEquivalence_sourceStandardId_idx" ON "StandardEquivalence"("sourceStandardId");

-- CreateIndex
CREATE INDEX "StandardEquivalence_targetStandardId_idx" ON "StandardEquivalence"("targetStandardId");

-- CreateIndex
CREATE UNIQUE INDEX "StandardEquivalence_sourceStandardId_targetStandardId_key" ON "StandardEquivalence"("sourceStandardId", "targetStandardId");

-- CreateIndex
CREATE INDEX "ContentStandardAlignment_standardId_idx" ON "ContentStandardAlignment"("standardId");

-- CreateIndex
CREATE INDEX "ContentStandardAlignment_contentType_contentId_idx" ON "ContentStandardAlignment"("contentType", "contentId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentStandardAlignment_contentType_contentId_standardId_key" ON "ContentStandardAlignment"("contentType", "contentId", "standardId");

-- CreateIndex
CREATE INDEX "ChildStandardProgress_childId_status_idx" ON "ChildStandardProgress"("childId", "status");

-- CreateIndex
CREATE INDEX "ChildStandardProgress_childId_curriculumType_idx" ON "ChildStandardProgress"("childId", "curriculumType");

-- CreateIndex
CREATE UNIQUE INDEX "ChildStandardProgress_childId_standardId_key" ON "ChildStandardProgress"("childId", "standardId");

-- CreateIndex
CREATE INDEX "CurriculumSwitch_childId_idx" ON "CurriculumSwitch"("childId");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralCode_code_key" ON "ReferralCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralCode_parentId_key" ON "ReferralCode"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralCode_teacherId_key" ON "ReferralCode"("teacherId");

-- CreateIndex
CREATE INDEX "ReferralCode_code_idx" ON "ReferralCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Referral_referredParentId_key" ON "Referral"("referredParentId");

-- CreateIndex
CREATE UNIQUE INDEX "Referral_referredTeacherId_key" ON "Referral"("referredTeacherId");

-- CreateIndex
CREATE INDEX "Referral_referralCodeId_idx" ON "Referral"("referralCodeId");

-- CreateIndex
CREATE INDEX "Referral_status_idx" ON "Referral"("status");

-- CreateIndex
CREATE INDEX "Referral_channel_idx" ON "Referral"("channel");

-- CreateIndex
CREATE INDEX "Referral_createdAt_idx" ON "Referral"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ShareableContent_token_key" ON "ShareableContent"("token");

-- CreateIndex
CREATE INDEX "ShareableContent_token_idx" ON "ShareableContent"("token");

-- CreateIndex
CREATE INDEX "ShareableContent_parentId_idx" ON "ShareableContent"("parentId");

-- CreateIndex
CREATE INDEX "ShareableContent_teacherId_idx" ON "ShareableContent"("teacherId");

-- CreateIndex
CREATE INDEX "ShareableContent_contentType_idx" ON "ShareableContent"("contentType");

-- CreateIndex
CREATE INDEX "ShareEvent_channel_idx" ON "ShareEvent"("channel");

-- CreateIndex
CREATE INDEX "ShareEvent_createdAt_idx" ON "ShareEvent"("createdAt");

-- CreateIndex
CREATE INDEX "ShareEvent_parentId_idx" ON "ShareEvent"("parentId");

-- CreateIndex
CREATE INDEX "ShareEvent_teacherId_idx" ON "ShareEvent"("teacherId");

-- CreateIndex
CREATE INDEX "ReferralReward_parentId_idx" ON "ReferralReward"("parentId");

-- CreateIndex
CREATE INDEX "ReferralReward_teacherId_idx" ON "ReferralReward"("teacherId");

-- CreateIndex
CREATE INDEX "ReferralReward_status_idx" ON "ReferralReward"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ParentSharingPreferences_parentId_key" ON "ParentSharingPreferences"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "OllieMemory_childId_key" ON "OllieMemory"("childId");

-- CreateIndex
CREATE INDEX "OllieMemory_childId_idx" ON "OllieMemory"("childId");

-- CreateIndex
CREATE INDEX "OllieMemory_lastSessionAt_idx" ON "OllieMemory"("lastSessionAt");

-- CreateIndex
CREATE INDEX "ParentMemorySummary_parentId_idx" ON "ParentMemorySummary"("parentId");

-- CreateIndex
CREATE INDEX "ParentMemorySummary_childId_idx" ON "ParentMemorySummary"("childId");

-- CreateIndex
CREATE INDEX "ParentMemorySummary_status_periodEnd_idx" ON "ParentMemorySummary"("status", "periodEnd");

-- CreateIndex
CREATE UNIQUE INDEX "ParentMemorySummary_childId_periodStart_periodEnd_key" ON "ParentMemorySummary"("childId", "periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "TeacherExport_teacherId_createdAt_idx" ON "TeacherExport"("teacherId", "createdAt");

-- CreateIndex
CREATE INDEX "TeacherExport_teacherId_status_idx" ON "TeacherExport"("teacherId", "status");

-- CreateIndex
CREATE INDEX "TeacherExport_status_createdAt_idx" ON "TeacherExport"("status", "createdAt");

-- CreateIndex
CREATE INDEX "TeacherDocumentAnalysis_teacherId_createdAt_idx" ON "TeacherDocumentAnalysis"("teacherId", "createdAt");

-- CreateIndex
CREATE INDEX "TeacherDocumentAnalysis_teacherId_status_idx" ON "TeacherDocumentAnalysis"("teacherId", "status");

-- CreateIndex
CREATE INDEX "TeacherTriggerLog_teacherId_idx" ON "TeacherTriggerLog"("teacherId");

-- CreateIndex
CREATE INDEX "TeacherTriggerLog_triggerName_idx" ON "TeacherTriggerLog"("triggerName");

-- CreateIndex
CREATE INDEX "TeacherTriggerLog_teacherId_triggerName_idx" ON "TeacherTriggerLog"("teacherId", "triggerName");

-- AddForeignKey
ALTER TABLE "ParentPrivacyPreferences" ADD CONSTRAINT "ParentPrivacyPreferences_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentNotificationPreference" ADD CONSTRAINT "ParentNotificationPreference_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentPushToken" ADD CONSTRAINT "ParentPushToken_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentNotificationLog" ADD CONSTRAINT "ParentNotificationLog_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consent" ADD CONSTRAINT "Consent_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceConsent" ADD CONSTRAINT "VoiceConsent_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceConsent" ADD CONSTRAINT "VoiceConsent_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoiceTranscriptionLog" ADD CONSTRAINT "VoiceTranscriptionLog_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentLessonUsage" ADD CONSTRAINT "ParentLessonUsage_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlashcardDeck" ADD CONSTRAINT "FlashcardDeck_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlashcardDeck" ADD CONSTRAINT "FlashcardDeck_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "FlashcardDeck"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XPTransaction" ADD CONSTRAINT "XPTransaction_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Streak" ADD CONSTRAINT "Streak_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EarnedBadge" ADD CONSTRAINT "EarnedBadge_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EarnedBadge" ADD CONSTRAINT "EarnedBadge_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeCompletion" ADD CONSTRAINT "ChallengeCompletion_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "DailyChallenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextSelection" ADD CONSTRAINT "TextSelection_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextSelection" ADD CONSTRAINT "TextSelection_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteComment" ADD CONSTRAINT "NoteComment_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteComment" ADD CONSTRAINT "NoteComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InteractiveExercise" ADD CONSTRAINT "InteractiveExercise_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseAttempt" ADD CONSTRAINT "ExerciseAttempt_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "InteractiveExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseAttempt" ADD CONSTRAINT "ExerciseAttempt_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SafetyLog" ADD CONSTRAINT "SafetyLog_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherCreditPackPurchase" ADD CONSTRAINT "TeacherCreditPackPurchase_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenUsageLog" ADD CONSTRAINT "TokenUsageLog_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgTokenUsageLog" ADD CONSTRAINT "OrgTokenUsageLog_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherContent" ADD CONSTRAINT "TeacherContent_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherContent" ADD CONSTRAINT "TeacherContent_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ContentTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentTemplate" ADD CONSTRAINT "ContentTemplate_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rubric" ADD CONSTRAINT "Rubric_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradingJob" ADD CONSTRAINT "GradingJob_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradingJob" ADD CONSTRAINT "GradingJob_rubricId_fkey" FOREIGN KEY ("rubricId") REFERENCES "Rubric"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GradingSubmission" ADD CONSTRAINT "GradingSubmission_gradingJobId_fkey" FOREIGN KEY ("gradingJobId") REFERENCES "GradingJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherAudioUpdate" ADD CONSTRAINT "TeacherAudioUpdate_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubstitutePlan" ADD CONSTRAINT "SubstitutePlan_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IEPGoalSession" ADD CONSTRAINT "IEPGoalSession_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrainstormSession" ADD CONSTRAINT "BrainstormSession_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrainstormMessage" ADD CONSTRAINT "BrainstormMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "BrainstormSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivitySession" ADD CONSTRAINT "ActivitySession_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandardSet" ADD CONSTRAINT "StandardSet_jurisdictionId_fkey" FOREIGN KEY ("jurisdictionId") REFERENCES "CurriculumJurisdiction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningStandard" ADD CONSTRAINT "LearningStandard_standardSetId_fkey" FOREIGN KEY ("standardSetId") REFERENCES "StandardSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningStandard" ADD CONSTRAINT "LearningStandard_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "LearningStandard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandardEquivalence" ADD CONSTRAINT "StandardEquivalence_sourceStandardId_fkey" FOREIGN KEY ("sourceStandardId") REFERENCES "LearningStandard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandardEquivalence" ADD CONSTRAINT "StandardEquivalence_targetStandardId_fkey" FOREIGN KEY ("targetStandardId") REFERENCES "LearningStandard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentStandardAlignment" ADD CONSTRAINT "ContentStandardAlignment_standardId_fkey" FOREIGN KEY ("standardId") REFERENCES "LearningStandard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildStandardProgress" ADD CONSTRAINT "ChildStandardProgress_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildStandardProgress" ADD CONSTRAINT "ChildStandardProgress_standardId_fkey" FOREIGN KEY ("standardId") REFERENCES "LearningStandard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumSwitch" ADD CONSTRAINT "CurriculumSwitch_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralCode" ADD CONSTRAINT "ReferralCode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralCode" ADD CONSTRAINT "ReferralCode_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referralCodeId_fkey" FOREIGN KEY ("referralCodeId") REFERENCES "ReferralCode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referredParentId_fkey" FOREIGN KEY ("referredParentId") REFERENCES "Parent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referredTeacherId_fkey" FOREIGN KEY ("referredTeacherId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareableContent" ADD CONSTRAINT "ShareableContent_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareableContent" ADD CONSTRAINT "ShareableContent_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareableContent" ADD CONSTRAINT "ShareableContent_referralCodeId_fkey" FOREIGN KEY ("referralCodeId") REFERENCES "ReferralCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareEvent" ADD CONSTRAINT "ShareEvent_shareableContentId_fkey" FOREIGN KEY ("shareableContentId") REFERENCES "ShareableContent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralReward" ADD CONSTRAINT "ReferralReward_referralId_fkey" FOREIGN KEY ("referralId") REFERENCES "Referral"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralReward" ADD CONSTRAINT "ReferralReward_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralReward" ADD CONSTRAINT "ReferralReward_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParentSharingPreferences" ADD CONSTRAINT "ParentSharingPreferences_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OllieMemory" ADD CONSTRAINT "OllieMemory_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherExport" ADD CONSTRAINT "TeacherExport_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherExport" ADD CONSTRAINT "TeacherExport_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "TeacherContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherDocumentAnalysis" ADD CONSTRAINT "TeacherDocumentAnalysis_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherTriggerLog" ADD CONSTRAINT "TeacherTriggerLog_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
