// SSE Service — Server-Sent Events for real-time updates
// In-memory connection map; upgrade to Redis pub/sub for multi-server
import { Response } from 'express';
import { logger } from '../../utils/logger.js';

interface SSEEvent {
  type: string;
  data: any;
}

const connections = new Map<string, Set<Response>>();
const MAX_CONNECTIONS_PER_TEACHER = 5;

// Heartbeat interval (30s) to keep connections alive
const HEARTBEAT_INTERVAL = 30000;
let heartbeatTimer: NodeJS.Timeout | null = null;

function addConnection(teacherId: string, res: Response): void {
  if (!connections.has(teacherId)) {
    connections.set(teacherId, new Set());
  }

  const teacherConnections = connections.get(teacherId)!;

  // Evict oldest connection if limit exceeded
  if (teacherConnections.size >= MAX_CONNECTIONS_PER_TEACHER) {
    const oldest = teacherConnections.values().next().value;
    if (oldest) {
      try { oldest.end(); } catch {}
      teacherConnections.delete(oldest);
    }
  }

  teacherConnections.add(res);

  // Start heartbeat if not running
  if (!heartbeatTimer) {
    heartbeatTimer = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);
  }

  logger.info('SSE connection added', { teacherId, totalConnections: teacherConnections.size });
}

function removeConnection(teacherId: string, res: Response): void {
  const teacherConnections = connections.get(teacherId);
  if (teacherConnections) {
    teacherConnections.delete(res);
    if (teacherConnections.size === 0) {
      connections.delete(teacherId);
    }
  }

  // Stop heartbeat if no connections
  if (connections.size === 0 && heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }

  logger.info('SSE connection removed', { teacherId });
}

function sendEvent(teacherId: string, event: SSEEvent): void {
  const teacherConnections = connections.get(teacherId);
  if (!teacherConnections || teacherConnections.size === 0) {
    return;
  }

  const message = `event: ${event.type}\ndata: ${JSON.stringify(event.data)}\n\n`;

  for (const res of teacherConnections) {
    try {
      res.write(message);
    } catch (err) {
      // Connection broken, will be cleaned up
      teacherConnections.delete(res);
    }
  }
}

function sendHeartbeat(): void {
  const keepalive = ':keepalive\n\n';
  for (const [teacherId, teacherConnections] of connections) {
    for (const res of teacherConnections) {
      try {
        res.write(keepalive);
      } catch {
        teacherConnections.delete(res);
      }
    }
    if (teacherConnections.size === 0) {
      connections.delete(teacherId);
    }
  }
}

function getConnectionCount(): number {
  let count = 0;
  for (const set of connections.values()) {
    count += set.size;
  }
  return count;
}

export const sseService = {
  addConnection,
  removeConnection,
  sendEvent,
  getConnectionCount,
};
