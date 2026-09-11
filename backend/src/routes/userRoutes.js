const express = require("express");

const {
    getUsers
} = require("../controllers/userController");

const {
    protect,
    requireMainAdmin
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/",
    protect,
    requireMainAdmin,
    getUsers
);

module.exports = router;