const express = require("express");

const {
    getAdminDocuments,
    getAdminDocumentById
} = require("../controllers/documentController");

const {
    protect,
    requireAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/",
    protect,
    requireAdmin,
    getAdminDocuments
);

router.get(
    "/:documentId",
    protect,
    requireAdmin,
    getAdminDocumentById
);

module.exports = router;