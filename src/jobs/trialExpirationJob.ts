/**
 * Trial Expiration Job
 *
 * Sends expiring/expired trial emails and marks trials as used.
 */

import cron from 'node-cron';
import { processTrialExpirations } from '../services/teacher/trialService.js';
import { logger } from '../utils/logger.js';

const TRIAL_EXPIRATION_CRON = '0 * * * *'; // hourly

export function scheduleTrialExpirationChecks(): void {
  cron.schedule(
    TRIAL_EXPIRATION_CRON,
    async () => {
      logger.info('Running trial expiration checks');
      try {
        await processTrialExpirations();
      } catch (error) {
        logger.error('Trial expiration job failed', { error });
      }
    },
    { timezone: 'UTC' }
  );

  logger.info('Trial expiration checks scheduled hourly');
}

export default scheduleTrialExpirationChecks;
