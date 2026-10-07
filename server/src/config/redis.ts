import { Redis } from 'ioredis';
import { embeddedRedis } from './embeddedRedis.js';

let redisClient: Redis | null = null;
let isRedisConnected = false;

const memoryCache = new Map<string, { data: any; expiry: number }>();

/**
 * Initializes Redis connection with auto-starting embedded fallback if local Redis daemon is absent.
 */
export async function initializeRedis(): Promise<Redis | null> {
  if (redisClient && isRedisConnected) return redisClient;

  const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

  // If pointing to localhost/127.0.0.1, ensure the embedded engine is ready
  if (redisUrl.includes('localhost') || redisUrl.includes('127.0.0.1')) {
    try {
      const urlObj = new URL(redisUrl);
      const port = parseInt(urlObj.port || '6379', 10);
      await embeddedRedis.start(port, '127.0.0.1');
    } catch {
      await embeddedRedis.start(6379, '127.0.0.1');
    }
  }

  try {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      connectTimeout: 5000,
      retryStrategy(times: number) {
        if (times > 5) {
          return null;
        }
        return Math.min(times * 300, 1500);
      },
      lazyConnect: false,
      enableOfflineQueue: true,
    });

    redisClient.on('connect', () => {
      isRedisConnected = true;
      console.log('⚡ Redis Cache & Job Queue Connected at', redisUrl.replace(/\/\/[^@]*@/, '//***@'));
    });

    redisClient.on('ready', () => {
      isRedisConnected = true;
    });

    redisClient.on('error', (err: any) => {
      isRedisConnected = false;
      console.warn('⚠️ Redis Connection Warning:', err.message);
    });

    redisClient.on('close', () => {
      isRedisConnected = false;
    });

    // Test with real PING
    try {
      const pingRes = await redisClient.ping();
      if (pingRes === 'PONG') {
        isRedisConnected = true;
      }
    } catch {
      isRedisConnected = false;
    }

    return redisClient;
  } catch (err: any) {
    isRedisConnected = false;
    console.warn('⚠️ Redis init error:', err.message);
    return null;
  }
}

// Auto-initialize on module load
initializeRedis().catch(() => {});

export function getRedisClient(): Redis | null {
  return redisClient;
}

export const redis = redisClient;

/**
 * Performs a live socket-level Redis PING test.
 */
export async function checkRedisConnection(): Promise<boolean> {
  if (!redisClient) {
    await initializeRedis();
  }

  if (!redisClient) return false;

  try {
    const ping = await redisClient.ping();
    isRedisConnected = (ping === 'PONG' || ping === 'pong');
    return isRedisConnected;
  } catch (err) {
    isRedisConnected = false;
    return false;
  }
}

/**
 * High-performance Cache Layer with TTL and memory fallback
 */
export async function getCachedScan(url: string): Promise<any | null> {
  const cacheKey = `scan:url:${url.toLowerCase().trim()}`;
  
  if (isRedisConnected && redisClient) {
    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) return JSON.parse(cached);
    } catch {
      // Fallback to memory
    }
  }

  // Memory fallback check
  const mem = memoryCache.get(cacheKey);
  if (mem && mem.expiry > Date.now()) {
    return mem.data;
  } else if (mem) {
    memoryCache.delete(cacheKey);
  }

  return null;
}

export async function setCachedScan(url: string, data: any, ttlSeconds: number = 120): Promise<void> {
  const cacheKey = `scan:url:${url.toLowerCase().trim()}`;

  if (isRedisConnected && redisClient) {
    try {
      await redisClient.set(cacheKey, JSON.stringify(data), 'EX', ttlSeconds);
    } catch {
      // Fallback
    }
  }

  // Memory fallback set
  memoryCache.set(cacheKey, {
    data,
    expiry: Date.now() + ttlSeconds * 1000,
  });
}
