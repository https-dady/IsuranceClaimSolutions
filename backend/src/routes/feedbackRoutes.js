const express = require("express");

const {
    getMyQueriesForFeedback,
    createFeedback,
    getMyFeedbacks,
    getMyFeedbackById,
    updateMyFeedback,
    getAdminFeedbacks,
    getAdminFeedbackById
} = require("../controllers/feedbackController");

const {
    protect,
    requireAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();


// =========================================================
// USER FEEDBACK ROUTES
// =========================================================

// Get logged-in user's queries
// Used for selecting which query the feedback is about
router.get(
    "/my-queries",
    protect,
    getMyQueriesForFeedback
);


// Submit feedback
router.post(
    "/",
    protect,
    createFeedback
);


// Get logged-in user's feedbacks
router.get(
    "/my",
    protect,
    getMyFeedbacks
);


// Get single logged-in user's feedback
router.get(
    "/my/:feedbackId",
    protect,
    getMyFeedbackById
);


// Update logged-in user's feedback
router.patch(
    "/my/:feedbackId",
    protect,
    updateMyFeedback
);


// =========================================================
// ADMIN FEEDBACK ROUTES
// =========================================================

// Get all feedbacks
// Supports:
// ?search=
// ?rating=1
// ?rating=2
// ?rating=3
// ?rating=4
// ?rating=5
// ?rating=All
router.get(
    "/admin",
    protect,
    requireAdmin,
    getAdminFeedbacks
);


// Get single feedback for admin
router.get(
    "/admin/:feedbackId",
    protect,
    requireAdmin,
    getAdminFeedbackById
);


module.exports = router;