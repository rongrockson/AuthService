import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import config from './config.js';

export const configurePassport = (passport, authService) => {
    console.log('Configuring passport witn url:', `${config.backendURL}/auth/google/callback`);
    passport.use(new GoogleStrategy({
        clientID: config.googleClientID,
        clientSecret: config.googleClientSecret,
        callbackURL: `${config.backendURL}/auth/google/callback`,  // Full URL is necessary
        scope: ['profile', 'email']  // Required scopes
    }, (accessToken, refreshToken, profile, done) => {
        // The profile object contains the user's Google profile information
        return done(null, profile);
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        // Add your logic to fetch user from the database using `id`
        done(null, id);
    });
};
