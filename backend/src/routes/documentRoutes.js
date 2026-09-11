const express = require("express");

const {
    uploadDocuments,
    getMyDocuments,
    getDocumentById,
    deleteDocument,
    getAdminDocuments,
    getAdminDocumentById
} = require("../controllers/documentController");

const {
    protect,
    requireAdmin
} = require("../middleware/authMiddleware");

const handleDocumentUpload = require("../middleware/documentUploadMiddleware");

const router = express.Router();


// =========================================================
// USER DOCUMENT ROUTES
// =========================================================

// Upload documents
router.post(
    "/upload",
    protect,
    handleDocumentUpload,
    uploadDocuments
);

// Get logged-in user's documents
router.get(
    "/my",
    protect,
    getMyDocuments
);

// Get single logged-in user's document
router.get(
    "/my/:documentId",
    protect,
    getDocumentById
);

// Delete logged-in user's document
router.delete(
    "/my/:documentId",
    protect,
    deleteDocument
);


// =========================================================
// ADMIN DOCUMENT ROUTES
// =========================================================

// Get all documents
// Supports:
// ?search=
// ?status=pending
// ?status=approved
// ?status=rejected
// ?status=All
router.get(
    "/admin",
    protect,
    requireAdmin,
    getAdminDocuments
);

// Get single document for admin
router.get(
    "/admin/:documentId",
    protect,
    requireAdmin,
    getAdminDocumentById
);


module.exports = router;