import { env } from './src/config/env.js';
import { logger } from './src/utils/logger.js';
import { connectDB } from './src/config/db.js';
import { redis } from './src/config/redis.js';
// import app from './src/app.js';

/**
 * Start Server Sequence
 */
const startServer = async () => {
  try {
    console.log('🚀 Starting server initialization...');

    // Connect to Database
    await connectDB();
    console.log('✅ Database connection initialized');

    const { default: app } = await import('./src/app.js');
    console.log('✅ App module loaded');

    const PORT = env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`✅ Server running in ${env.NODE_ENV} mode on port ${PORT}`);
      console.log('🚀 UPSC Backend API is ready');
    });
  } catch (error) {
    console.error(`❌ Failed to start server: ${error.message}`);
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
