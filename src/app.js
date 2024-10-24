import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import passport from 'passport';
import dotenv from 'dotenv';
import User from './models/User.js';
import AuthRepository from './repositories/authRepository.js';
import AuthService from './services/authService.js';
import AuthController from './controllers/authController.js';
import authRoutes from './routes/authRoutes.js';
import { handleError, AppError } from './utils/errorHandler.js';
import logger from './utils/logger.js';
import { configurePassport } from './config/passport.js';
import config from './config/config.js';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js'; // Import the connectDB function
dotenv.config();


const app = express();

app.use(cors({
    origin: config.frontendURL,
    credentials: true,
}));

app.use(cookieParser());

app.use(express.json());
connectDB(config.mongoURI);

const authRepository = new AuthRepository(User);
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

configurePassport(passport, authService);

app.use(passport.initialize());

app.use('/auth', authRoutes(authController));

app.use((err, req, res, next) => {
    if (!err.isOperational) {
        logger.error('Unexpected error:', err);
        err = new AppError('An unexpected error occurred', 500);
    }
    handleError(err, res);
});

const PORT = config.port || 5000;
app.listen(PORT, () => logger.info(`Auth service running on port ${PORT}`));
