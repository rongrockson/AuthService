import mongoose from 'mongoose';
import logger from '../utils/logger.js';

/**
 * Establishes a connection to MongoDB using the URI from environment variables.
 * Logs connection status.
 * 
 * @param {string} mongoURI - MongoDB connection string
 */
const connectDB = async (mongoURI) => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        logger.info('MongoDB connected successfully.');
    } catch (error) {
        logger.error('MongoDB connection error:', error);
        process.exit(1);  // Terminate the process on failure
    }
};

export default connectDB;
