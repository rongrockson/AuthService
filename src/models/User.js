// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        givenName: String,
        familyName: String
    },
    role: {
        type: String,
        enum: ['user', 'manager', null],
        default: null
    },
    lastLogin: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', function (next) {
    if (this.isModified('role')) {
        // Validate role
        if (!['user', 'manager'].includes(this.role)) {
            next(new Error('Invalid role specified'));
        }
    }
    next();
});

export default mongoose.model('User', userSchema);