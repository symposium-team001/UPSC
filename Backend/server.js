// 1. Validate Environment Variables First
import { env } from './src/config/env.js';
import { logger } from './src/utils/logger.js';

// 2. Initialize Infrastructure
import { connectDB } from './src/config/db.js';
import { redis } from './src/config/redis.js';

// 3. Import Application
import app from './src/app.js';

/**
 * Start Server Sequence
 */
const startServer = async () => {
  try {
    logger.info('🚀 Starting server initialization...');

    // Connect to Database
    await connectDB();
    logger.info('✅ Database connection initialized');

    // Redis connection is handled by its singleton import, 
    // but we log its status via its own event listeners.
    logger.info('✅ Redis client initialized');

    const PORT = env.PORT || 5000;
    const server = app.listen(PORT, () => {
      logger.info(`✅ Server running in ${env.NODE_ENV} mode on port ${PORT}`);
      logger.info('🚀 UPSC Backend API is ready');
    });

    // Handle Unhandled Promise Rejections
    process.on('unhandledRejection', (err) => {
      logger.error('💥 UNHANDLED REJECTION! Shutting down...');
      logger.error(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });

  } catch (error) {
    logger.error(`❌ Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
  logger.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

startServer();
