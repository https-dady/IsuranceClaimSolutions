const express = require("express");

const {
    getAdmins,
    promoteToSecondaryAdmin,
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


router.patch(
    "/promote/:userId",
    protect,
    requireMainAdmin,
    promoteToSecondaryAdmin
);


router.patch(
    "/remove/:userId",
    protect,
    requireMainAdmin,
    removeSecondaryAdmin
);


module.exports = router;