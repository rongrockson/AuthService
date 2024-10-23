import axios from 'axios';
import config from '../config/config.js';

class AuthService {
    constructor(authRepository) {
        this.authRepository = authRepository;
    }

    async findOrCreateUser(googleId, email, name) {
        let user = await this.authRepository.findUserByGoogleId(googleId);
        if (!user) {
            user = await this.authRepository.createUser(googleId, email, name);
        }
        return user;
    }

    async notifyLogin(email) {
        return axios.post(`${config.notifyServiceURL}/notify/login`, { email });
    }

    async notifyLogout(email) {
        return axios.post(`${config.notifyServiceURL}/notify/logout`, { email });
    }

    async setUserRole(userId, role) {
        return this.authRepository.setUserRole(userId, role);  // Pass the internal userId (MongoDB _id)
    }
}

export default AuthService;
