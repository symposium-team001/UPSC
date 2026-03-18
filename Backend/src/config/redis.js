import Redis from 'ioredis';
import { env as config } from './env.js';
import { logger } from '../utils/logger.js';

/**
 * Redis client singleton instance
 */
const redis = new Redis(config.REDIS_URL, {
  maxRetriesPerRequest: null, // Necessary for Bull and general reliability
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('connect', () => {
  logger.info('🚀 Redis connected successfully');
});

redis.on('error', (err) => {
  logger.error(`❌ Redis connection error: ${err.message}`);
});

redis.on('reconnecting', () => {
  logger.info('🔄 Redis reconnecting...');
});

export { redis };
