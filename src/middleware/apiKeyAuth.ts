// API Key authentication middleware for enterprise LMS/programmatic access
import { Request, Response, NextFunction } from 'express';
import { apiKeyService } from '../services/enterprise/apiKeyService.js';
import { redis } from '../config/redis.js';
import { UnauthorizedError, ForbiddenError, RateLimitError } from './errorHandler.js';
import { authenticateTeacher } from './teacherAuth.js';
import { logger } from '../utils/logger.js';

/**
 * Authenticate via X-API-Key header.
 * Sets req.apiKey and req.schoolId on success.
 */
export async function authenticateApiKey(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const apiKeyHeader = req.headers['x-api-key'] as string | undefined;

    if (!apiKeyHeader) {
      throw new UnauthorizedError('API key required (X-API-Key header)');
    }

    const keyRecord = await apiKeyService.verifyApiKey(apiKeyHeader);
    if (!keyRecord) {
      throw new UnauthorizedError('Invalid or expired API key');
    }

    // Rate limit check via Redis
    const rateLimitKey = `ratelimit:apikey:${keyRecord.id}`;
    const currentCount = await redis.incr(rateLimitKey);
    if (currentCount === 1) {
      await redis.expire(rateLimitKey, 60); // 1-minute window
    }
    if (currentCount > keyRecord.rateLimit) {
      throw new RateLimitError(`Rate limit exceeded (${keyRecord.rateLimit} requests/minute)`);
    }

    // Record usage asynchronously (don't block the request)
    apiKeyService.recordUsage(keyRecord.id).catch((err) => {
      logger.error('Failed to record API key usage', { error: err, keyId: keyRecord.id });
    });

    // Set request context
    req.apiKey = {
      id: keyRecord.id,
      schoolId: keyRecord.schoolId,
      permissions: keyRecord.permissions,
      name: keyRecord.name,
    };
    req.schoolId = keyRecord.schoolId;

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Check that the API key has at least one of the required permissions.
 */
export function requirePermission(...perms: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.apiKey) {
      throw new ForbiddenError('API key authentication required');
    }

    const hasPermission = perms.some((p) => req.apiKey!.permissions.includes(p));
    if (!hasPermission) {
      throw new ForbiddenError(`Missing required permission: ${perms.join(' or ')}`);
    }

    next();
  };
}

/**
 * Authenticate an enterprise request using either JWT or API key.
 * Tries JWT first (if Authorization header exists), falls back to API key (if X-API-Key header exists).
 */
export async function authenticateEnterpriseRequest(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const hasAuthHeader = req.headers.authorization?.startsWith('Bearer ');
  const hasApiKey = !!req.headers['x-api-key'];

  if (hasAuthHeader) {
    // Try JWT authentication
    return authenticateTeacher(req, res, (err?: any) => {
      if (err) return next(err);
      // JWT-authenticated teacher must belong to a school
      if (!req.teacher?.schoolId) {
        return next(new ForbiddenError('Enterprise school membership required'));
      }
      req.schoolId = req.teacher.schoolId;
      next();
    });
  }

  if (hasApiKey) {
    return authenticateApiKey(req, res, next);
  }

  next(new UnauthorizedError('Authentication required (Bearer token or X-API-Key header)'));
}
