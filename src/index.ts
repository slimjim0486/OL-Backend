// NanoBanana K-6 AI Learning Platform - Backend Entry Point
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { config, validateEnv } from './config/index.js';
import { prisma } from './config/database.js';
import { redis } from './config/redis.js';
import { logger } from './utils/logger.js';
import {
  errorHandler,
  notFoundHandler,
  standardRateLimit,
} from './middleware/index.js';
import { attachRequestId, requestLogger } from './middleware/requestLogger.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import childRoutes from './routes/child.routes.js';
import profileRoutes from './routes/profile.routes.js';
import parentRoutes from './routes/parent.routes.js';
import lessonRoutes from './routes/lesson.routes.js';
import chatRoutes from './routes/chat.routes.js';
import flashcardRoutes from './routes/flashcard.routes.js';
import quizRoutes from './routes/quiz.routes.js';
import aiRoutes from './routes/ai.routes.js';
import exerciseRoutes from './routes/exercise.routes.js';
import noteRoutes from './routes/note.routes.js';
import safetyRoutes from './routes/safety.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import privacyRoutes from './routes/privacy.routes.js';
import reportsRoutes from './routes/reports.routes.js';
import supportRoutes from './routes/support.routes.js';
import teacherRoutes from './routes/teacher/index.js';
import parentSubscriptionRoutes from './routes/parent/index.js';
import adminRoutes from './routes/admin/index.js';
import ocrRoutes from './routes/ocr.routes.js';
import webhookRoutes from './routes/webhook.routes.js';

// Cron Jobs
import { scheduleBrevoInactivityChecks } from './jobs/brevoInactivityChecks.js';
import { scheduleDailyGamesRefresh } from './jobs/gamesDailyRefreshJob.js';
import { scheduleWeeklyPrepDelivery } from './jobs/scheduledWeeklyPrepJob.js';
import { scheduleMonthlyReviewJob, shutdownMonthlyReviewJob } from './jobs/monthlyReviewJob.js';
import { scheduleDownloadReminders } from './jobs/downloadReminderJob.js';
import contactRoutes from './routes/contact.routes.js';
import gamificationRoutes from './routes/gamification.routes.js';
import currencyRoutes from './routes/currency.routes.js';
import leadsRoutes from './routes/leads.routes.js';
import referralRoutes from './routes/referral.routes.js';
import shareRoutes from './routes/share.routes.js';
import curriculumRoutes from './routes/curriculum.routes.js';
import progressRoutes from './routes/progress.routes.js';
import voiceRoutes from './routes/voice.routes.js';

// Services initialization
import { initializeContentProcessor, shutdownContentProcessor } from './services/learning/contentProcessor.js';
import { badgeService } from './services/gamification/badgeService.js';
import {
  initializeMemoryAggregationJob,
  shutdownMemoryAggregationJob,
  initializeExportJob,
  shutdownExportJob,
  initializeDocumentAnalysisJob,
  shutdownDocumentAnalysisJob,
  initializeWeeklyPrepJob,
  shutdownWeeklyPrepJob,
  initializeGradingBatchJob,
  shutdownGradingBatchJob,
} from './jobs/index.js';

// Validate environment
try {
  validateEnv();
} catch (error) {
  logger.error('Environment validation failed', { error });
  process.exit(1);
}

const app = express();
const DB_CONNECT_MAX_ATTEMPTS = 10;
const DB_CONNECT_BASE_DELAY_MS = 2000;

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function connectDatabaseWithRetry(): Promise<void> {
  for (let attempt = 1; attempt <= DB_CONNECT_MAX_ATTEMPTS; attempt += 1) {
    try {
      await prisma.$connect();
      logger.info('Database connected');
      return;
    } catch (error) {
      if (attempt === DB_CONNECT_MAX_ATTEMPTS) {
        throw error;
      }

      const delayMs = Math.min(DB_CONNECT_BASE_DELAY_MS * attempt, 10000);
      logger.warn('Database connection failed; retrying', {
        attempt,
        maxAttempts: DB_CONNECT_MAX_ATTEMPTS,
        retryDelayMs: delayMs,
      });
      await sleep(delayMs);
    }
  }
}

// ============================================
// MIDDLEWARE SETUP
// ============================================

// Trust proxy - required for Railway/reverse proxy deployments
// This allows express-rate-limit to correctly identify users via X-Forwarded-For
const isRailway =
  Boolean(process.env.RAILWAY_ENVIRONMENT) ||
  Boolean(process.env.RAILWAY_PROJECT_ID) ||
  Boolean(process.env.RAILWAY_SERVICE_ID) ||
  Boolean(process.env.RAILWAY_DEPLOYMENT_ID);

// Allow explicit override: TRUST_PROXY=true|false|<number>
const trustProxyEnv = process.env.TRUST_PROXY;
const shouldTrustProxy =
  trustProxyEnv != null ? (trustProxyEnv !== 'false' && trustProxyEnv !== '0') : (config.isProduction || isRailway);

if (shouldTrustProxy) {
  let trustProxyValue: any = 1;
  if (trustProxyEnv === 'true') trustProxyValue = true;
  else if (trustProxyEnv && trustProxyEnv !== 'false' && trustProxyEnv !== '0') {
    const maybeNum = Number(trustProxyEnv);
    if (Number.isFinite(maybeNum)) trustProxyValue = maybeNum;
  }
  app.set('trust proxy', trustProxyValue);
}

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: config.allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Disposition'], // Allow frontend to read filename from PDF exports
}));

// Request ID and logging
app.use(attachRequestId);
app.use(requestLogger);

// Stripe webhooks need raw body for signature verification
// Must be registered BEFORE express.json() middleware
// Mount once at /api/webhooks - the router handles /stripe-consent, /stripe-subscription, /stripe-family
app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhookRoutes);

// Body parsing (for all other routes)
// Increased limit to 50mb to support PPTX files with images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate limiting (API only)
// Use auth-aware keying in the limiter to avoid grouping many users behind a proxy/NAT into a single bucket.
app.use('/api', standardRateLimit);

// ============================================
// ROUTES
// ============================================

// Health check (no auth required)
app.get('/health', async (_req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    // Check Redis connection
    await redis.ping();

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: config.nodeEnv,
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Service dependencies unavailable',
    });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/children', childRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/parent/safety', safetyRoutes);
app.use('/api/parent/settings', settingsRoutes);
app.use('/api/parent/privacy', privacyRoutes);
app.use('/api/parent/reports', reportsRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/ocr', ocrRoutes);
app.use('/api/contact', contactRoutes);

// Teacher Portal routes
app.use('/api/teacher', teacherRoutes);

// Admin Portal routes (VC Analytics Dashboard)
app.use('/api/admin', adminRoutes);

// Parent Portal routes (subscription management)
app.use('/api/parent', parentSubscriptionRoutes);

// Gamification routes (XP, badges, streaks)
app.use('/api/gamification', gamificationRoutes);

// Currency detection routes (public - no auth required)
app.use('/api/currency', currencyRoutes);

// Lead capture routes (public - for exit-intent popups)
app.use('/api/leads', leadsRoutes);

// Referral routes (viral sharing system)
app.use('/api/referrals', referralRoutes);

// Share routes (shareable content)
app.use('/api/share', shareRoutes);

// Curriculum routes (standards mapping)
app.use('/api/curricula', curriculumRoutes);

// Progress routes (curriculum progress tracking)
app.use('/api/progress', progressRoutes);

// Voice routes (STT for child voice input)
app.use('/api/voice', voiceRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// ============================================
// SERVER STARTUP
// ============================================

async function startServer(): Promise<void> {
  try {
    // Connect to database
    await connectDatabaseWithRetry();

    // Connect to Redis
    await redis.ping();
    logger.info('Redis connected');

    // Initialize content processing queue
    try {
      initializeContentProcessor();
    } catch (error) {
      logger.warn('Content processor initialization skipped (Redis may not be available)');
    }

    // Initialize badges
    try {
      await badgeService.initializeBadges();
      logger.info('Badges initialized');
    } catch (error) {
      logger.warn('Badge initialization skipped');
    }

    // Initialize memory aggregation job (Ollie's Memory)
    try {
      await initializeMemoryAggregationJob();
      logger.info('Memory aggregation job initialized');
    } catch (error) {
      logger.warn('Memory aggregation job initialization skipped');
    }

    // Initialize export job queue (async PDF/PPTX exports)
    try {
      await initializeExportJob();
      logger.info('Export job initialized');
    } catch (error) {
      logger.warn('Export job initialization skipped');
    }

    // Initialize document analysis job queue (async PDF/PPT analysis)
    try {
      await initializeDocumentAnalysisJob();
      logger.info('Document analysis job initialized');
    } catch (error) {
      logger.warn('Document analysis job initialization skipped');
    }

    // Initialize weekly prep job queue (async weekly material generation)
    let weeklyPrepReady = false;
    try {
      await initializeWeeklyPrepJob();
      weeklyPrepReady = true;
      logger.info('Weekly prep job initialized');
    } catch (error) {
      logger.warn('Weekly prep job initialization skipped');
    }

    // Initialize batch grading job queue (async grading)
    try {
      await initializeGradingBatchJob();
      logger.info('Batch grading job initialized');
    } catch (error) {
      logger.warn('Batch grading job initialization skipped');
    }

    // Start server
    const server = app.listen(config.port, () => {
      logger.info(`NanoBanana K-6 Backend running on port ${config.port}`);
      logger.info(`Environment: ${config.nodeEnv}`);
      logger.info(`Frontend URL: ${config.frontendUrl}`);

      // Schedule Brevo inactivity checks (B6, B7, B8 behavioral triggers)
      // Runs daily at 9 AM to check for inactive teachers
      scheduleBrevoInactivityChecks();
      logger.info('Brevo inactivity checks scheduled for 9:00 AM daily');

      // Schedule daily games refresh (connections + icebreakers)
      scheduleDailyGamesRefresh();
      logger.info('Daily games refresh scheduled for 00:05 UTC');

      // Schedule weekly prep delivery (checks every 30 min for teachers' preferred times)
      if (!weeklyPrepReady) {
        logger.warn('Weekly prep delivery scheduler disabled because weekly prep queue is not initialized');
      } else if (config.enableWeeklyPrepScheduler) {
        scheduleWeeklyPrepDelivery();
      } else {
        logger.info('Weekly prep delivery scheduler disabled (ENABLE_WEEKLY_PREP_SCHEDULER=false)');
      }

      // Schedule monthly review auto-generation (1st of month, 6 AM UTC)
      scheduleMonthlyReviewJob();
      logger.info('Monthly review job scheduled');

      // Schedule download reminders (10 AM daily, 1h after Brevo checks)
      scheduleDownloadReminders();
      logger.info('Download reminders scheduled for 10:00 AM daily');

    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received, shutting down gracefully...`);

      server.close(async () => {
        try {
          await shutdownContentProcessor();
          await shutdownMemoryAggregationJob();
          await shutdownExportJob();
          await shutdownDocumentAnalysisJob();
          await shutdownWeeklyPrepJob();
          await shutdownGradingBatchJob();
          shutdownMonthlyReviewJob();
          await prisma.$disconnect();
          await redis.quit();
          logger.info('Server shut down successfully');
          process.exit(0);
        } catch (error) {
          logger.error('Error during shutdown', { error });
          process.exit(1);
        }
      });

      // Force shutdown after 30 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

startServer();

export default app;
