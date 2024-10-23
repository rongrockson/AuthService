import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import passport from 'passport';

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
const app = express();

app.use(cors({
    origin: config.frontendURL,  // Allow your frontend origin
    credentials: true,  // Enable credentials (cookies, authorization headers)
}));
app.use(cookieParser());

app.use(express.json());

mongoose.connect(config.mongoURI)
    .then(() => logger.info('Connected to MongoDB'))
    .catch((err) => logger.error('MongoDB connection error:', err));

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
