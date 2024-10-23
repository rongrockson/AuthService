class AuthRepository {
    constructor(User) {
        this.User = User;
    }

    async findUserByGoogleId(googleId) {
        return this.User.findOne({ googleId });
    }

    async createUser(googleId, email, name) {
        const user = new this.User({ googleId, email, name });
        return user.save();
    }

    async setUserRole(userId, role) {
        return this.User.findByIdAndUpdate(userId, { role }, { new: true });
    }

    async findUserByGoogleId(googleId) {
        return this.User.findOne({ googleId });
    }

    async setUserRoleByGoogleId(googleId, role) {
        return this.User.findOneAndUpdate({ googleId }, { role }, { new: true });
    }

    async findOrCreateUser(googleId, email, name) {
        let user = await this.authRepository.findUserByGoogleId(googleId);
        if (!user) {
            user = await this.authRepository.createUser(googleId, email, name);
        }
        return user;
    }
}

export default AuthRepository;
