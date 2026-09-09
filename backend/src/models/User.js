const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        emailVerified: {
            type: Boolean,
            default: false
        },

        emailVerificationOTP: {
            type: String
        },

        emailVerificationOTPExpires: {
            type: Date
        },

        passwordResetOTP: {
            type: String
        },

        passwordResetOTPExpires: {
            type: Date
        },

        type: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },

        role: {
            type: String,
            enum: [
                "user",
                "main_admin",
                "secondary_admin"
            ],
            default: "user"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);