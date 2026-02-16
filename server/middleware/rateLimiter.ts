import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { Redis } from 'ioredis';
import { Request, Response } from 'express';
import { logger } from '../utils/logger';

// Initialize Redis client (optional - falls back to memory store)
let redis: Redis | undefined;
let redisStore: any = undefined;

try {
  if (process.env.REDIS_URL) {
    redis = new Redis(process.env.REDIS_URL, {
      enableOfflineQueue: false,
      maxRetriesPerRequest: 3,
    });

    redis.on('error', (err) => {
      logger.error('Redis connection error', err);
    });

    redis.on('connect', () => {
      logger.info('Redis connected for rate limiting');
    });

    redisStore = new RedisStore({
      // @ts-ignore - RedisStore types issue
      client: redis,
      prefix: 'rl:',
    });
  }
} catch (error) {
  logger.warn('Redis not available, using memory store for rate limiting', error);
}

// Standard rate limiter - 100 requests per 15 minutes per IP
export const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  store: redisStore,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later',
  },
  handler: (req: Request, res: Response) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      url: req.url,
      method: req.method,
    });
    res.status(429).json({
      success: false,
      error: 'Too many requests, please try again later',
    });
  },
});

// Strict limiter for auth endpoints - 5 requests per 15 minutes per IP
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  store: redisStore,
  skipSuccessfulRequests: true, // Don't count successful requests
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later',
  },
  handler: (req: Request, res: Response) => {
    logger.warn('Auth rate limit exceeded', {
      ip: req.ip,
      url: req.url,
    });
    res.status(429).json({
      success: false,
      error: 'Too many authentication attempts, please try again in 15 minutes',
    });
  },
});

// API limiter - 1000 requests per hour for authenticated users
export const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  store: redisStore,
  skip: (req: Request) => {
    // Skip rate limiting for authenticated users (use user-based limiting instead)
    return !!(req as any).user?.claims?.sub;
  },
  handler: (req: Request, res: Response) => {
    logger.warn('API rate limit exceeded', {
      userId: (req as any).user?.claims?.sub,
      ip: req.ip,
      url: req.url,
    });
    res.status(429).json({
      success: false,
      error: 'API rate limit exceeded, please try again later',
    });
  },
});

// Voice/AI intensive operations - 50 requests per hour
export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  store: redisStore,
  handler: (req: Request, res: Response) => {
    logger.warn('AI rate limit exceeded', {
      userId: (req as any).user?.claims?.sub,
      ip: req.ip,
      url: req.url,
    });
    res.status(429).json({
      success: false,
      error: 'AI operation rate limit exceeded, please try again later',
    });
  },
});

// Create a custom per-user limiter
export const createUserLimiter = (max: number, windowMinutes: number = 15) => {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    store: redisStore,
  });
};

// Lead capture limiter - 10 requests per hour per IP (prevents abuse of public endpoint)
export const leadCaptureLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  store: redisStore,
  message: {
    success: false,
    error: 'Too many lead capture requests, please try again later',
  },
  handler: (req: Request, res: Response) => {
    logger.warn('Lead capture rate limit exceeded', {
      ip: req.ip,
      url: req.url,
    });
    res.status(429).json({
      success: false,
      error: 'Too many requests, please try again later',
    });
  },
});

// Cleanup function
export const cleanupRateLimiter = async () => {
  if (redis) {
    await redis.quit();
    logger.info('Redis connection closed');
  }
};
