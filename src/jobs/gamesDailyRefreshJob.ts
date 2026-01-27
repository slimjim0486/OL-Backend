/**
 * Daily Games Refresh Job
 *
 * Generates and stores daily games (connections + icebreakers)
 * so teachers can load a fresh daily challenge instantly.
 */

import cron from 'node-cron';
import { gamesService } from '../services/teacher/gamesService.js';
import { logger } from '../utils/logger.js';

const DAILY_GAMES_CRON = '5 0 * * *'; // 00:05 UTC daily

export function scheduleDailyGamesRefresh(): void {
  // Warm the cache on startup (non-blocking)
  void gamesService.refreshDailyGames().catch((error) => {
    logger.warn('Initial daily games refresh failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  });

  cron.schedule(
    DAILY_GAMES_CRON,
    async () => {
      logger.info('Running scheduled daily games refresh');
      try {
        await gamesService.refreshDailyGames();
      } catch (error) {
        logger.error('Scheduled daily games refresh failed', {
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    },
    { timezone: 'UTC' }
  );

  logger.info('Daily games refresh scheduled for 00:05 UTC');
}

export default scheduleDailyGamesRefresh;
