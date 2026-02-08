import mongoose from "mongoose";

const RefreshTokenSchema = new mongoose.Schema(
    {
        tokenHash: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        expiresAt: { type: Date, required: true },

        // optional device info (pro)
        userAgent: { type: String, default: "" },
        ip: { type: String, default: "" },
    },
    { _id: false }
);

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, maxlength: 80 },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        passwordHash: { type: String, required: true },

        isEmailVerified: { type: Boolean, default: false },

        // email verification token (store HASH only)
        emailVerifyTokenHash: { type: String, default: null },
        emailVerifyTokenExpiresAt: { type: Date, default: null },

        // reset password token (store HASH only)
        resetPasswordTokenHash: { type: String, default: null },
        resetPasswordTokenExpiresAt: { type: Date, default: null },

        refreshTokens: { type: [RefreshTokenSchema], default: [] },

        lastLoginAt: { type: Date, default: null },

        resetTokenHash: { type: String, default: null },
        resetTokenExp: { type: Date, default: null },
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);