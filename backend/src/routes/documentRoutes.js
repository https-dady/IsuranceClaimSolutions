const express = require("express");

const {
    uploadDocuments,
    getMyDocuments,
    getMyQueryDocuments,
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

router.post(
    "/upload",
    protect,
    handleDocumentUpload,
    uploadDocuments
);

router.get(
    "/my",
    protect,
    getMyDocuments
);

router.get(
    "/my/query/:queryId",
    protect,
    getMyQueryDocuments
);

router.get(
    "/my/:documentId",
    protect,
    getDocumentById
);

router.delete(
    "/my/:documentId",
    protect,
    deleteDocument
);

router.get(
    "/admin",
    protect,
    requireAdmin,
    getAdminDocuments
);

router.get(
    "/admin/:documentId",
    protect,
    requireAdmin,
    getAdminDocumentById
);

module.exports = router;