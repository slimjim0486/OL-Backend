// PostgreSQL connection via Prisma
import { Prisma, PrismaClient } from '@prisma/client';
import { config } from './index.js';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var prismaRetryMiddlewareAttached: boolean | undefined;
}

// Use singleton pattern to prevent multiple connections in development
export const prisma = global.prisma || new PrismaClient({
  log: config.debug ? ['query', 'info', 'warn', 'error'] : ['error'],
});

if (!config.isProduction) {
  global.prisma = prisma;
}

const TRANSIENT_DB_ERROR_CODES = new Set(['P1001', 'P1002', 'P1017']);
const MAX_DB_QUERY_RETRIES = 2;
const BASE_RETRY_DELAY_MS = 250;

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const isTransientDatabaseError = (error: unknown): error is Prisma.PrismaClientKnownRequestError =>
  error instanceof Prisma.PrismaClientKnownRequestError &&
  TRANSIENT_DB_ERROR_CODES.has(error.code);

if (!global.prismaRetryMiddlewareAttached) {
  // Retry short-lived connection outages without failing user requests immediately.
  prisma.$use(async (params, next) => {
    for (let attempt = 0; attempt <= MAX_DB_QUERY_RETRIES; attempt += 1) {
      try {
        return await next(params);
      } catch (error) {
        const shouldRetry = isTransientDatabaseError(error) && attempt < MAX_DB_QUERY_RETRIES;
        if (!shouldRetry) {
          throw error;
        }

        const retryDelayMs = BASE_RETRY_DELAY_MS * (attempt + 1);
        await sleep(retryDelayMs);
      }
    }

    throw new Error('Database query retry exhausted unexpectedly');
  });

  global.prismaRetryMiddlewareAttached = true;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
