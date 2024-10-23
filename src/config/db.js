// config/db.js
import mongoose from 'mongoose';
import logger from '../utils/logger.js';

let isConnected = false;

const connectDB = async (mongoURI) => {
    if (isConnected) {
        logger.info('Already connected to MongoDB.');
        return;
    }

    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        isConnected = true;
        logger.info('MongoDB connected successfully.');
    } catch (error) {
        logger.error('MongoDB connection error: ' + error);
        process.exit(1);
    }
};

export default connectDB;
