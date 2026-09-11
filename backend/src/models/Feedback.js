const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        query: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Query",
            required: true
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        message: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

feedbackSchema.index(
    { user: 1, query: 1 },
    { unique: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);