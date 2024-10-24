import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import logger from '../utils/logger.js';

class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async googleCallback(req, res) {
        try {
            const googleUser = req.user;

            // Extract the email correctly from googleUser.emails array
            const email = googleUser.emails && googleUser.emails[0] ? googleUser.emails[0].value : null;

            // Check if email exists
            if (!email) {
                throw new Error("Google user profile does not contain an email.");
            }

            // Use the googleUser data to find or create the user in your database
            const dbUser = await this.authService.findOrCreateUser(
                googleUser.id,  // Google ID from OAuth
                email,          // Correctly extracted email
                googleUser.name
            );

            console.log('dbUser:', JSON.stringify(dbUser));

            const userData = {
                id: dbUser._id,  // Use internal user ID from MongoDB
                email: dbUser.email,
                name: {
                    givenName: dbUser.name.givenName,
                    familyName: dbUser.name.familyName,
                },
                role: dbUser.role || null,  // Use role from DB
            };

            console.log('userData:', JSON.stringify(userData));

            // Generate JWT token with dbUser data
            const token = jwt.sign(
                userData,
                config.jwt,
                {
                    expiresIn: '24h',
                    algorithm: 'HS256'
                }
            );

            // Send login notification
            try {
                console.log('Sending login notification to:' + email);
                this.authService.notifyLogin(email);
            } catch (error) {
                logger.error('Login notification error:' + error);
            }

            // Set secure HTTP-only cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: true, // Only send cookie over HTTPS in production
                sameSite: 'lax', // Protects against CSRF
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
                path: '/',
            });

            const frontendUrl = config.frontendURL
            const redirectUrl = `${frontendUrl}/dashboard`;

            console.log('Redirecting to:', redirectUrl);
            res.redirect(redirectUrl);
        } catch (error) {
            logger.error('Google authentication error:' + error);
            res.status(500).json({ error: 'Failed to complete Google authentication' });
        }
    }





    // Logout user by clearing the JWT cookie
    async logout(req, res) {
        try {
            this.authService.notifyLogout(req.user.email);
            res.cookie('token', '', {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                expires: new Date(0), // Immediately expire the cookie
                path: '/',
            });
            res.status(200).json({ message: 'Logged out successfully' });
        } catch (error) {
            logger.error('Logout error:' + error);
            res.status(500).json({ error: 'Logout failed', message: error.message });
        }
    }

    // Set role for the user
    async setRole(req, res) {
        const { role } = req.body;
        const user = req.user;// dbUser

        if (!['user', 'manager'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        try {
            const dbUser = await this.authService.setUserRole(user.id, role);
            console.log('User role updated:' + dbUser);
            res.status(200).json({ user: dbUser });
        } catch (error) {
            logger.error('Set role error:' + error);
            res.status(500).json({ error: 'Failed to update role', message: error.message });
        }
    }

    // Check authentication status
    async checkAuthStatus(req, res) {
        try {
            const user = req.user;  // User should be attached from the JWT middleware

            if (!user) {
                return res.status(401).json({ authenticated: false });
            }

            res.status(200).json({ authenticated: true, user });
        } catch (error) {
            logger.error('Auth status check error:', error);
            res.status(500).json({ authenticated: false, message: 'Failed to check authentication status' });
        }
    }
}

export default AuthController;