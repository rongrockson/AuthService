import jwt from 'jsonwebtoken';
import { AppError } from '../utils/errorHandler.js';
import config from '../config/config.js';
import logger from '../utils/logger.js';

export const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        console.log('No token found');
        return next(new AppError('Authentication required', 401));
    }

    try {
        const user = jwt.verify(token, config.jwt);
        req.user = user;
        next();
    } catch (error) {
        console.log('Token error:' + error);
        next(new AppError('Invalid token', 401));
    }
};
