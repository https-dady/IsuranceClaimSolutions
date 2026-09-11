const Feedback = require("../models/Feedback");
const Query = require("../models/Query");


// =========================================================
// GET MY QUERIES FOR FEEDBACK
// =========================================================

const getMyQueriesForFeedback = async (req, res) => {
    try {
        const queries = await Query.find({
            user: req.user.userId
        })
            .select(
                "queryId insuranceDetails claimDetails queryDetails status createdAt"
            )
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            queries
        });
    } catch (error) {
        console.error(
            "Get queries for feedback error:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch queries"
        });
    }
};


// =========================================================
// CREATE FEEDBACK
// =========================================================

const createFeedback = async (req, res) => {
    try {
        const {
            queryId,
            rating,
            message
        } = req.body;

        if (!queryId) {
            return res.status(400).json({
                message: "Query is required"
            });
        }

        if (
            rating === undefined ||
            rating === null ||
            rating === ""
        ) {
            return res.status(400).json({
                message: "Rating is required"
            });
        }

        const numericRating = Number(rating);

        if (
            !Number.isInteger(numericRating) ||
            numericRating < 1 ||
            numericRating > 5
        ) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            });
        }

        if (
            !message ||
            !message.trim()
        ) {
            return res.status(400).json({
                message: "Feedback message is required"
            });
        }


        // =====================================================
        // VERIFY QUERY BELONGS TO LOGGED-IN USER
        // =====================================================

        const query = await Query.findOne({
            queryId: queryId.trim(),
            user: req.user.userId
        });

        if (!query) {
            return res.status(404).json({
                message: "Query not found"
            });
        }


        // =====================================================
        // CHECK DUPLICATE FEEDBACK
        // =====================================================

        const existingFeedback = await Feedback.findOne({
            user: req.user.userId,
            query: query._id
        });

        if (existingFeedback) {
            return res.status(409).json({
                message:
                    "Feedback already submitted for this query"
            });
        }


        // =====================================================
        // CREATE FEEDBACK
        // =====================================================

        const feedback = await Feedback.create({
            user: req.user.userId,
            query: query._id,
            rating: numericRating,
            message: message.trim()
        });


        const populatedFeedback =
            await Feedback.findById(feedback._id)
                .populate(
                    "user",
                    "name email"
                )
                .populate(
                    "query",
                    "queryId"
                );


        return res.status(201).json({
            message: "Feedback submitted successfully",
            feedback: populatedFeedback
        });

    } catch (error) {
        console.error(
            "Create feedback error:",
            error
        );


        // =====================================================
        // HANDLE UNIQUE INDEX DUPLICATE
        // =====================================================

        if (error.code === 11000) {
            return res.status(409).json({
                message:
                    "Feedback already submitted for this query"
            });
        }


        return res.status(500).json({
            message: "Failed to submit feedback"
        });
    }
};


// =========================================================
// GET MY FEEDBACKS
// =========================================================

const getMyFeedbacks = async (req, res) => {
    try {
        const feedbacks =
            await Feedback.find({
                user: req.user.userId
            })
                .populate(
                    "user",
                    "name email"
                )
                .populate(
                    "query",
                    "queryId insuranceDetails claimDetails queryDetails"
                )
                .sort({
                    createdAt: -1
                });

        return res.status(200).json({
            feedbacks
        });

    } catch (error) {
        console.error(
            "Get my feedbacks error:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch feedbacks"
        });
    }
};


// =========================================================
// GET SINGLE USER FEEDBACK
// =========================================================

const getMyFeedbackById = async (req, res) => {
    try {
        const feedback =
            await Feedback.findOne({
                _id: req.params.feedbackId,
                user: req.user.userId
            })
                .populate(
                    "user",
                    "name email"
                )
                .populate(
                    "query",
                    "queryId insuranceDetails claimDetails queryDetails"
                );

        if (!feedback) {
            return res.status(404).json({
                message: "Feedback not found"
            });
        }

        return res.status(200).json({
            feedback
        });

    } catch (error) {
        console.error(
            "Get my feedback error:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch feedback"
        });
    }
};


// =========================================================
// UPDATE MY FEEDBACK
// =========================================================

const updateMyFeedback = async (req, res) => {
    try {
        const {
            rating,
            message
        } = req.body;


        if (
            rating === undefined ||
            rating === null ||
            rating === ""
        ) {
            return res.status(400).json({
                message: "Rating is required"
            });
        }

        const numericRating = Number(rating);

        if (
            !Number.isInteger(numericRating) ||
            numericRating < 1 ||
            numericRating > 5
        ) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            });
        }

        if (
            !message ||
            !message.trim()
        ) {
            return res.status(400).json({
                message: "Feedback message is required"
            });
        }


        const feedback =
            await Feedback.findOneAndUpdate(
                {
                    _id: req.params.feedbackId,
                    user: req.user.userId
                },
                {
                    rating: numericRating,
                    message: message.trim()
                },
                {
                    new: true,
                    runValidators: true
                }
            )
                .populate(
                    "user",
                    "name email"
                )
                .populate(
                    "query",
                    "queryId insuranceDetails claimDetails queryDetails"
                );


        if (!feedback) {
            return res.status(404).json({
                message: "Feedback not found"
            });
        }


        return res.status(200).json({
            message: "Feedback updated successfully",
            feedback
        });

    } catch (error) {
        console.error(
            "Update feedback error:",
            error
        );

        return res.status(500).json({
            message: "Failed to update feedback"
        });
    }
};


// =========================================================
// GET ADMIN FEEDBACKS
// =========================================================

const getAdminFeedbacks = async (req, res) => {
    try {
        const {
            search,
            rating
        } = req.query;


        const filter = {};


        // =====================================================
        // RATING FILTER
        // =====================================================

        if (
            rating &&
            rating !== "All"
        ) {
            const numericRating = Number(rating);

            if (
                !Number.isInteger(numericRating) ||
                numericRating < 1 ||
                numericRating > 5
            ) {
                return res.status(400).json({
                    message: "Invalid feedback rating"
                });
            }

            filter.rating = numericRating;
        }


        // =====================================================
        // FETCH FEEDBACKS
        // =====================================================

        let feedbacks =
            await Feedback.find(filter)
                .populate(
                    "user",
                    "name email phone"
                )
                .populate(
                    "query",
                    "queryId insuranceDetails queryDetails"
                )
                .sort({
                    createdAt: -1
                });


        // =====================================================
        // SEARCH
        // =====================================================

        if (
            search &&
            search.trim()
        ) {
            const searchTerm =
                search.trim().toLowerCase();

            feedbacks =
                feedbacks.filter(
                    (feedback) => {

                        const userName =
                            feedback.user?.name
                                ?.toLowerCase() || "";

                        const userEmail =
                            feedback.user?.email
                                ?.toLowerCase() || "";

                        const queryId =
                            feedback.query?.queryId
                                ?.toLowerCase() || "";

                        return (
                            userName.includes(searchTerm) ||
                            userEmail.includes(searchTerm) ||
                            queryId.includes(searchTerm)
                        );
                    }
                );
        }


        // =====================================================
        // ADMIN STATS
        // =====================================================

        const totalFeedbacks =
            await Feedback.countDocuments();

        const totalRating =
            await Feedback.aggregate([
                {
                    $group: {
                        _id: null,
                        averageRating: {
                            $avg: "$rating"
                        }
                    }
                }
            ]);

        const fiveStarFeedbacks =
            await Feedback.countDocuments({
                rating: 5
            });


        const needsAttention =
            await Feedback.countDocuments({
                rating: {
                    $lte: 2
                }
            });


        const averageRating =
            totalRating.length > 0
                ? Number(
                    totalRating[0].averageRating.toFixed(2)
                )
                : 0;


        return res.status(200).json({
            feedbacks,

            stats: {
                totalFeedbacks,
                averageRating,
                fiveStarFeedbacks,
                needsAttention
            }
        });

    } catch (error) {
        console.error(
            "Get admin feedbacks error:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch admin feedbacks"
        });
    }
};


// =========================================================
// GET SINGLE ADMIN FEEDBACK
// =========================================================

const getAdminFeedbackById = async (req, res) => {
    try {
        const feedback =
            await Feedback.findById(
                req.params.feedbackId
            )
                .populate(
                    "user",
                    "name email phone"
                )
                .populate(
                    "query",
                    "queryId insuranceDetails claimDetails queryDetails"
                );


        if (!feedback) {
            return res.status(404).json({
                message: "Feedback not found"
            });
        }


        return res.status(200).json({
            feedback
        });

    } catch (error) {
        console.error(
            "Get admin feedback error:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch feedback"
        });
    }
};


// =========================================================
// EXPORTS
// =========================================================

module.exports = {
    getMyQueriesForFeedback,
    createFeedback,
    getMyFeedbacks,
    getMyFeedbackById,
    updateMyFeedback,
    getAdminFeedbacks,
    getAdminFeedbackById
};