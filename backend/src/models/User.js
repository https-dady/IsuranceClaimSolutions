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

        /*
        =========================================================
        PHONE VERIFICATION
        =========================================================

        Provider integration will be added after the
        SMS/WhatsApp OTP provider is finalized.
        =========================================================
        */

        phoneVerified: {
            type: Boolean,
            default: false
        },

        /*
        =========================================================
        PROFILE PHOTO
        =========================================================

        Actual image:
            -> Cloudinary

        MongoDB stores only:
            -> Cloudinary secure URL
            -> Cloudinary public ID
        =========================================================
        */

        profilePhotoUrl: {
            type: String,
            default: null,
            trim: true
        },

        profilePhotoPublicId: {
            type: String,
            default: null,
            trim: true
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