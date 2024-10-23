// auth-service/routes/authRoutes.js
import express from 'express';
import passport from 'passport';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

export default (authController) => {
    router.get('/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

    router.get('/google/callback',
        passport.authenticate('google', { session: false }),
        authController.googleCallback.bind(authController)
    );

    router.post('/logout', authenticateToken, authController.logout.bind(authController));

    router.post('/set-role', authenticateToken, authController.setRole.bind(authController));
    router.get('/status', authenticateToken, authController.checkAuthStatus.bind(authController));


    return router;
};