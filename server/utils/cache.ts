import { Redis } from 'ioredis';
import { logger } from './logger';

// Redis client (optional - falls back to memory cache)
let redis: Redis | undefined;
const memoryCache = new Map<string, { value: any; expires: number }>();

// Initialize Redis if available
try {
  if (process.env.REDIS_URL) {
    redis = new Redis(process.env.REDIS_URL, {
      enableOfflineQueue: false,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    redis.on('error', (err) => {
      logger.warn('Redis error, falling back to memory cache', err);
      redis = undefined;
    });

    redis.on('connect', () => {
      logger.info('Redis connected for caching');
    });

    // Connect lazily
    redis.connect().catch((err) => {
      logger.warn('Redis connection failed, using memory cache', err);
      redis = undefined;
    });
  } else {
    logger.info('No REDIS_URL configured, using in-memory cache');
  }
} catch (error) {
  logger.warn('Redis initialization failed, using memory cache', error);
}

// Cache TTLs (Time To Live in seconds)
export const CacheTTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 900, // 15 minutes
  HOUR: 3600, // 1 hour
  DAY: 86400, // 24 hours
};

/**
 * Get value from cache
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    if (redis) {
      const value = await redis.get(key);
      if (value) {
        return JSON.parse(value) as T;
      }
    } else {
      // Memory cache fallback
      const cached = memoryCache.get(key);
      if (cached && cached.expires > Date.now()) {
        return cached.value as T;
      } else if (cached) {
        memoryCache.delete(key);
      }
    }
    return null;
  } catch (error) {
    logger.error('Cache get error', error, { key });
    return null;
  }
}

/**
 * Set value in cache
 * CRITICAL FIX: Skip caching null/undefined to prevent Redis errors
 */
export async function setCache(key: string, value: any, ttl: number = CacheTTL.MEDIUM): Promise<void> {
  try {
    // Don't cache null or undefined values - they crash Redis
    if (value === null || value === undefined) {
      logger.debug('Skipping cache for null/undefined value', { key });
      return;
    }

    if (redis) {
      await redis.setex(key, ttl, JSON.stringify(value));
    } else {
      // Memory cache fallback
      memoryCache.set(key, {
        value,
        expires: Date.now() + ttl * 1000,
      });
      
      // Cleanup old entries periodically
      if (memoryCache.size > 1000) {
        const now = Date.now();
        const entries = Array.from(memoryCache.entries());
        for (const [k, v] of entries) {
          if (v.expires < now) {
            memoryCache.delete(k);
          }
        }
      }
    }
  } catch (error) {
    logger.error('Cache set error', error, { key });
  }
}

/**
 * Delete value from cache
 */
export async function deleteCache(key: string): Promise<void> {
  try {
    if (redis) {
      await redis.del(key);
    } else {
      memoryCache.delete(key);
    }
  } catch (error) {
    logger.error('Cache delete error', error, { key });
  }
}

/**
 * Delete multiple keys matching a pattern
 */
export async function deleteCachePattern(pattern: string): Promise<void> {
  try {
    if (redis) {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } else {
      // Memory cache fallback - simple string matching
      const keys = Array.from(memoryCache.keys());
      for (const key of keys) {
        if (key.includes(pattern.replace('*', ''))) {
          memoryCache.delete(key);
        }
      }
    }
  } catch (error) {
    logger.error('Cache pattern delete error', error, { pattern });
  }
}

/**
 * Cache key generators for common patterns
 */
export const CacheKeys = {
  user: (userId: string) => `user:${userId}`,
  userStats: (userId: string) => `user:${userId}:stats`,
  agents: (userId: string) => `agents:${userId}`,
  agent: (agentId: string) => `agent:${agentId}`,
  agentAnalytics: (agentId: string) => `agent:${agentId}:analytics`,
  calls: (userId: string, limit: number) => `calls:${userId}:${limit}`,
  callsByAgent: (agentId: string, limit: number) => `calls:agent:${agentId}:${limit}`,
  activities: (userId: string, limit: number) => `activities:${userId}:${limit}`,
  leads: (userId: string, filters?: string) => `leads:${userId}:${filters || 'all'}`,
  campaigns: (userId: string) => `campaigns:${userId}`,
  voices: () => 'voices:list',
};

/**
 * Cache wrapper for functions
 */
export async function cacheWrapper<T>(
  key: string,
  ttl: number,
  fetchFn: () => Promise<T>
): Promise<T> {
  // Try to get from cache first
  const cached = await getCache<T>(key);
  if (cached !== null) {
    logger.debug('Cache hit', { key });
    return cached;
  }

  // Cache miss - fetch fresh data
  logger.debug('Cache miss', { key });
  const data = await fetchFn();

  // Store in cache
  await setCache(key, data, ttl);

  return data;
}

/**
 * Invalidate user-related caches
 */
export async function invalidateUserCache(userId: string): Promise<void> {
  await Promise.all([
    deleteCache(CacheKeys.user(userId)),
    deleteCache(CacheKeys.userStats(userId)),
    deleteCache(CacheKeys.agents(userId)),
    deleteCachePattern(`calls:${userId}:*`),
    deleteCachePattern(`activities:${userId}:*`),
    deleteCachePattern(`leads:${userId}:*`),
    deleteCache(CacheKeys.campaigns(userId)),
  ]);
  logger.debug('User cache invalidated', { userId });
}

/**
 * Invalidate agent-related caches
 */
export async function invalidateAgentCache(agentId: string, userId: string): Promise<void> {
  await Promise.all([
    deleteCache(CacheKeys.agent(agentId)),
    deleteCache(CacheKeys.agentAnalytics(agentId)),
    deleteCache(CacheKeys.agents(userId)),
    deleteCachePattern(`calls:agent:${agentId}:*`),
  ]);
  logger.debug('Agent cache invalidated', { agentId });
}

/**
 * Cleanup function
 */
export async function cleanupCache(): Promise<void> {
  if (redis) {
    await redis.quit();
    logger.info('Redis cache connection closed');
  } else {
    memoryCache.clear();
    logger.info('Memory cache cleared');
  }
}
