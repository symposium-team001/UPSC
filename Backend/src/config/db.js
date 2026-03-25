import mongoose from 'mongoose';
import { env as config } from './env.js';
import { logger } from '../utils/logger.js';

const MONGO_OPTIONS = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let retryCount = 0;
const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000;

/**
 * Connect to MongoDB with retry logic
 * @returns {Promise<void>}
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGO_URI, MONGO_OPTIONS);
    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    retryCount = 0; // Reset retry count on success
  } catch (error) {
    logger.error(`❌ MongoDB Connection Error: ${error.message}`);
    
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      logger.info(`🔄 Retrying MongoDB connection in ${RETRY_INTERVAL / 1000}s... (Attempt ${retryCount}/${MAX_RETRIES})`);
      setTimeout(connectDB, RETRY_INTERVAL);
    } else {
      logger.error('💥 Max retries reached. Could not connect to MongoDB.');
      process.exit(1);
    }
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  logger.info('📡 Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  logger.error(`⚠️ Mongoose connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  logger.info('🔌 Mongoose disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    logger.info('🛑 Mongoose connection closed due to app termination');
    process.exit(0);
  } catch (error) {
    logger.error(`Error during graceful shutdown: ${error.message}`);
    process.exit(1);
  }
});
