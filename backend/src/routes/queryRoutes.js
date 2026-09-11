const express = require("express");

const {
    createQuery,
    getMyQueries,
    getMyQueryById,
    getAdminQueries,
    getAdminQueryById,
    assignQuery,
    unassignQuery,
    updateQuery
} = require("../controllers/queryController");

const {
    protect,
    requireMainAdmin,
    requireAdmin
} = require("../middleware/authMiddleware");

const handleDocumentUpload = require("../middleware/documentUploadMiddleware");

const router = express.Router();


/*
=========================================================
CREATE QUERY
=========================================================

Supports the normal query fields plus optional documents.
Documents use the multipart field name: documents
=========================================================
*/

router.post(
    "/",
    protect,
    handleDocumentUpload,
    createQuery
);


router.get(
    "/my",
    protect,
    getMyQueries
);

router.get(
    "/my/:queryId",
    protect,
    getMyQueryById
);

router.get(
    "/admin",
    protect,
    requireAdmin,
    getAdminQueries
);

router.get(
    "/admin/:queryId",
    protect,
    requireAdmin,
    getAdminQueryById
);

router.patch(
    "/admin/:queryId/assign",
    protect,
    requireMainAdmin,
    assignQuery
);

router.patch(
    "/admin/:queryId/unassign",
    protect,
    requireMainAdmin,
    unassignQuery
);

router.patch(
    "/admin/:queryId",
    protect,
    requireAdmin,
    updateQuery
);


module.exports = router;