import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    supabaseId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    emailVerified: { type: Boolean, default: false },
    provider: { type: String, enum: ['google', 'email'], default: 'email' },

    name: { type: String, trim: true },
    phone: { type: String, trim: true },
    avatar: { type: String, trim: true },
    organization: { type: String, trim: true },
    role: { type: String, trim: true, enum: ['recruiter', 'hiring_manager', 'admin'], default: 'recruiter' },

    linkedinUrl: { type: String, trim: true },
    githubUrl: { type: String, trim: true },
    twitterUrl: { type: String, trim: true },

    notificationPreferences: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: false }
    },

    profileCompleted: { type: Boolean, default: false },
    lastLogin: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const User = mongoose.model('User', userSchema);

export default User;