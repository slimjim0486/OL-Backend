/**
 * Events Routes — Server-Sent Events for real-time updates
 * Teacher Intelligence Platform
 *
 * EventSource API does not support custom headers.
 * Token is accepted via query parameter for SSE connections.
 */
import { Router, Request, Response, NextFunction } from 'express';
import { authenticateTeacher } from '../../middleware/teacherAuth.js';
import { sseService } from '../../services/teacher/sseService.js';

const router = Router();

// SSE endpoint — long-lived connection for real-time updates
// Uses query param ?token=<jwt> since EventSource doesn't support Authorization header
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  // Support token via query param for EventSource
  if (req.query.token && !req.headers.authorization) {
    req.headers.authorization = `Bearer ${req.query.token}`;
  }

  authenticateTeacher(req, res, (err?: any) => {
    if (err) return next(err);

    const teacherId = (req as any).teacher.id;

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

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
  });
});

export default router;
