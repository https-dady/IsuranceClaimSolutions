const express = require("express");

const {
    getAdmins,
    createSecondaryAdmin,
    removeSecondaryAdmin,
    getDashboard
} = require("../controllers/adminController");

const {
    protect,
    requireMainAdmin,
    requireAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();


/*
=========================================================
ADMIN DASHBOARD
=========================================================
Main Admin + Secondary Admin
=========================================================
*/

router.get(
    "/dashboard",
    protect,
    requireAdmin,
    getDashboard
);


/*
=========================================================
ADMIN MANAGEMENT
=========================================================
Main Admin only
=========================================================
*/

router.get(
    "/",
    protect,
    requireMainAdmin,
    getAdmins
);


/*
=========================================================
CREATE SECONDARY ADMIN
=========================================================
Main Admin only
=========================================================
*/

router.post(
    "/create-secondary-admin",
    protect,
    requireMainAdmin,
    createSecondaryAdmin
);


/*
=========================================================
REMOVE SECONDARY ADMIN
=========================================================
Main Admin only
=========================================================
*/

router.patch(
    "/remove/:userId",
    protect,
    requireMainAdmin,
    removeSecondaryAdmin
);


module.exports = router;