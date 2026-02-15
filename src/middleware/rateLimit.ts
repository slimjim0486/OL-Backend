// Rate limiting middleware configurations
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
import { RateLimitError } from './errorHandler.js';

type AnyAccessTokenPayload = {
  sub?: string;
  type?: 'parent' | 'child' | 'teacher' | 'admin' | string;
};

function getAuthRateLimitKey(req: any): string | null {
  const authHeader: string | undefined = req?.headers?.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.substring(7);
  try {
    const payload = jwt.verify(token, config.jwtAccessSecret) as AnyAccessTokenPayload;
    if (!payload?.sub || !payload?.type) return null;
    return `${payload.type}:${payload.sub}`;
  } catch {
    // Invalid/expired token; fall back to IP-based limiting.
    return null;
  }
}

function getStandardKey(req: any): string {
  // Prefer authenticated identity when available; prevents many users behind a proxy/NAT from sharing a bucket.
  return getAuthRateLimitKey(req) || req.ip;
}

// Standard rate limit for most endpoints
export const standardRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // 500 requests per window (increased from 100)
  message: { success: false, error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
  // Don't count CORS preflight, and avoid rate limiting webhooks (mounted before this limiter, but safe to skip anyway).
  skip: (req) => req.method === 'OPTIONS' || req.originalUrl?.startsWith('/api/webhooks'),
  keyGenerator: (req) => getStandardKey(req),
  handler: (req, _res, next) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      forwardedFor: req.headers['x-forwarded-for'],
      path: req.originalUrl,
      method: req.method,
      key: getStandardKey(req),
    });
    next(new RateLimitError('Too many requests, please try again later'));
  },
});

// Strict rate limit for auth endpoints
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 attempts per window (increased from 10)
  message: { success: false, error: 'Too many authentication attempts' },
  standardHeaders: true,
  legacyHeaders: false,
  // Auth endpoints are typically unauthenticated; key by IP.
  skip: (req) => req.method === 'OPTIONS',
  handler: (_req, _res, next) => {
    next(new RateLimitError('Too many authentication attempts, please try again later'));
  },
});

// Rate limit for AI chat (to prevent abuse)
export const chatRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // 20 messages per minute
  message: { success: false, error: 'Slow down! Let me think about your question.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS',
  handler: (_req, _res, next) => {
    next(new RateLimitError('Slow down! Let me think about your question.'));
  },
});

// Rate limit for uploads
export const uploadRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 uploads per hour
  message: { success: false, error: 'Upload limit reached' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS',
  handler: (_req, _res, next) => {
    next(new RateLimitError('Upload limit reached, please try again later'));
  },
});

// Rate limit for email sending (signup, password reset)
export const emailRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 emails per hour
  message: { success: false, error: 'Too many email requests' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS',
  handler: (_req, _res, next) => {
    next(new RateLimitError('Too many email requests, please try again later'));
  },
});
