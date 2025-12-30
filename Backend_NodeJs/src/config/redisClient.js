import redis from 'redis';
import baseLogger from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

const logger = baseLogger.child({ context: 'RedisClient' });

const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
    logger.error(`Redis error: ${err}`);
});

redisClient.on('connect', () => {
    logger.info('Connected to Redis server');
});

await redisClient.connect();

export default redisClient;