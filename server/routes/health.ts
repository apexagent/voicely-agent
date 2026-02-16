import { Router, Request, Response } from 'express';
import { db } from '../db';
import { sql } from 'drizzle-orm';
import { logger } from '../utils/logger';

const router = Router();

// Basic health check - returns 200 if server is running
router.get('/health', async (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Readiness check - verifies all dependencies are working
router.get('/ready', async (_req: Request, res: Response) => {
  try {
    // Check database connectivity with a simple query
    await db.execute(sql`SELECT 1`);

    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'ok',
        memory: {
          used: process.memoryUsage().heapUsed,
          total: process.memoryUsage().heapTotal,
        },
      },
    });
  } catch (error) {
    logger.error('Readiness check failed', error);
    res.status(503).json({
      status: 'not_ready',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'error',
      },
    });
  }
});

// Metrics endpoint - basic system metrics
router.get('/metrics', async (_req: Request, res: Response) => {
  const memUsage = process.memoryUsage();
  
  res.status(200).json({
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      rss: memUsage.rss,
      external: memUsage.external,
    },
    cpu: process.cpuUsage(),
    env: process.env.NODE_ENV,
    version: process.version,
  });
});

export default router;
