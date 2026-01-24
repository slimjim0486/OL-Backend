/**
 * Brevo Service Exports
 *
 * Usage:
 *   import { trackLessonCreated, trackCreditUsage } from '../services/brevo';
 */

export {
  addContactToList,
  upsertBrevoContact,
  trackBrevoEvent,
  trackLessonCreated,
  trackCreditUsage,
  trackTeacherSignup,
  trackTeacherActivity,
  trackTeacherUpgrade,
  syncAllTeachersToBrevo,
} from './brevoTrackingService.js';

export {
  runBrevoInactivityChecks,
  scheduleBrevoInactivityChecks,
} from '../../jobs/brevoInactivityChecks.js';
