const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        query: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Query",
            default: null
        },

        documentType: {
            type: String,
            required: true,
            trim: true
        },

        fileName: {
            type: String,
            required: true,
            trim: true
        },

        fileType: {
            type: String,
            required: true,
            trim: true
        },

        fileSize: {
            type: Number,
            required: true
        },

        cloudinaryPublicId: {
            type: String,
            required: true,
            trim: true
        },

        cloudinaryUrl: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "pending",
                "approved",
                "rejected"
            ],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Document", documentSchema);