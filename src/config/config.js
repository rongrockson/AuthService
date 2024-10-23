import dotenv from 'dotenv';
dotenv.config();
const config = {
    googleClientID: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    mongoURI: process.env.MONGODB_URI,
    email: process.env.EMAIL,
    emailPassword: process.env.EMAIL_PASSWORD,
    port: process.env.PORT || 5000,
    jwt: process.env.JWT_SECRET,
    frontendURL: process.env.FRONTEND_URL,
    notifyServiceURL: process.env.NOTIFY_SERVICE_URL,
    env: process.env.NODE_ENV,
};

export default config;
