/**
 * Events Routes — Server-Sent Events for real-time updates
 * Teacher Intelligence Platform
 *
 * EventSource API does not support custom headers.
 * The frontend first requests a short-lived one-time SSE token over the
 * authenticated API, then uses that token to open the EventSource connection.
 */
import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { authenticateTeacher } from '../../middleware/teacherAuth.js';
import { redis } from '../../config/redis.js';
import { sseService } from '../../services/teacher/sseService.js';
import { UnauthorizedError } from '../../middleware/errorHandler.js';

const router = Router();
const SSE_TOKEN_TTL_SECONDS = 60;

function sseTokenKey(token: string): string {
  return `teacher:sse:${token}`;
}

router.post('/token', authenticateTeacher, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teacherId = (req as any).teacher.id;
    const token = crypto.randomBytes(32).toString('base64url');
    await redis.set(sseTokenKey(token), teacherId, 'EX', SSE_TOKEN_TTL_SECONDS);
    res.json({ token, expiresIn: SSE_TOKEN_TTL_SECONDS });
  } catch (error) {
    next(error);
  }
});

// SSE endpoint — long-lived connection for real-time updates
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sseToken = typeof req.query.sseToken === 'string' ? req.query.sseToken : '';
    if (!sseToken) {
      throw new UnauthorizedError('SSE token required');
    }

    const teacherId = await redis.get(sseTokenKey(sseToken));
    if (!teacherId) {
      throw new UnauthorizedError('Invalid or expired SSE token');
    }
    await redis.del(sseTokenKey(sseToken));

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
    res.setHeader('Referrer-Policy', 'no-referrer');

    // Flush headers
    res.flushHeaders();

    // Send initial connection event
    res.write(`event: connected\ndata: ${JSON.stringify({ teacherId })}\n\n`);

    // Register connection
    sseService.addConnection(teacherId, res);

    // Cleanup on disconnect
    req.on('close', () => {
      sseService.removeConnection(teacherId, res);
    });
  } catch (error) {
    next(error);
  }
});

export default router;
