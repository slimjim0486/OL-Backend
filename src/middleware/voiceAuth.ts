// Voice Authorization Middleware
// Enforces voice consent before allowing voice input operations
import { Request, Response, NextFunction } from 'express';
import { voiceConsentService } from '../services/auth/voiceConsentService.js';
import { sttService } from '../services/ai/sttService.js';
import { ForbiddenError, ServiceUnavailableError } from './errorHandler.js';

/**
 * Middleware to require voice consent for the current child session
 * Must be used after authenticate middleware
 */
export function requireVoiceConsent() {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Must be a child session
      if (!req.child) {
        throw new ForbiddenError('Voice features are only available for child sessions');
      }

      // Check if voice service is available
      if (!sttService.isAvailable()) {
        throw new ServiceUnavailableError('Voice input is currently unavailable');
      }

      // Check voice consent
      const hasConsent = await voiceConsentService.hasVoiceConsent(req.child.id);

      if (!hasConsent) {
        throw new ForbiddenError(
          'Voice features require parental consent. Please ask a parent to enable voice input in settings.'
        );
      }

      // Attach consent info to request for later use
      const consentInfo = await voiceConsentService.getVoiceConsentStatus(req.child.id);
      req.voiceConsent = {
        hasConsent: consentInfo.hasConsent,
        expiresAt: consentInfo.expiresAt || null,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Middleware to check if voice is available (doesn't require consent, just checks service)
 * Useful for showing/hiding voice UI elements
 */
export function checkVoiceAvailability() {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const isServiceAvailable = sttService.isAvailable();
      let hasConsent = false;

      if (req.child && isServiceAvailable) {
        hasConsent = await voiceConsentService.hasVoiceConsent(req.child.id);
      }

      req.voiceConsent = {
        hasConsent,
        serviceAvailable: isServiceAvailable,
      };

      next();
    } catch (error) {
      // Don't fail the request if voice check fails
      req.voiceConsent = {
        hasConsent: false,
        serviceAvailable: false,
      };
      next();
    }
  };
}

/**
 * Middleware to optionally check voice consent (doesn't block if no consent)
 * Attaches voice status to request for conditional behavior in routes
 */
export function optionalVoiceConsent() {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.child) {
        req.voiceConsent = { hasConsent: false };
        return next();
      }

      const isServiceAvailable = sttService.isAvailable();

      if (!isServiceAvailable) {
        req.voiceConsent = { hasConsent: false, serviceAvailable: false };
        return next();
      }

      const consentInfo = await voiceConsentService.getVoiceConsentStatus(req.child.id);
      req.voiceConsent = {
        hasConsent: consentInfo.hasConsent,
        serviceAvailable: true,
        expiresAt: consentInfo.expiresAt || null,
      };

      next();
    } catch (error) {
      // Don't fail the request, just mark voice as unavailable
      req.voiceConsent = { hasConsent: false };
      next();
    }
  };
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      voiceConsent?: {
        hasConsent: boolean;
        serviceAvailable?: boolean;
        expiresAt?: Date | null;
      };
    }
  }
}
