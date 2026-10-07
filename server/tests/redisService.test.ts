import { describe, it, expect } from 'vitest';
import { checkRedisConnection, getCachedScan, setCachedScan } from '../src/config/redis.js';

describe('Redis Cache & Health Service', () => {
  it('should successfully connect to Redis and return PONG', async () => {
    const isConnected = await checkRedisConnection();
    expect(isConnected).toBe(true);
  });

  it('should store and retrieve scan data in Redis cache', async () => {
    const testUrl = 'https://test-redis-cache.example.com';
    const testData = {
      score: 95,
      violationsCount: 1,
      pageTitle: 'Redis Cache Test Page',
      timestamp: new Date().toISOString(),
    };

    await setCachedScan(testUrl, testData, 60);
    const cached = await getCachedScan(testUrl);

    expect(cached).not.toBeNull();
    expect(cached?.score).toBe(95);
    expect(cached?.pageTitle).toBe('Redis Cache Test Page');
  });

  it('should return null for non-existent cache keys', async () => {
    const nonExistent = await getCachedScan('https://does-not-exist-cache.org');
    expect(nonExistent).toBeNull();
  });
});
