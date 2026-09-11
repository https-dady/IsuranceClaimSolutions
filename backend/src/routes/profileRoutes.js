const express = require("express");

const {
    getMyProfile,
    updateMyProfile,
    updateProfilePhoto
} = require("../controllers/profileController");

const {
    protect
} = require("../middleware/authMiddleware");

const profilePhotoUpload = require("../middleware/profilePhotoUpload");

const router = express.Router();


/*
=========================================================
GET MY PROFILE
=========================================================
*/

router.get(
    "/me",
    protect,
    getMyProfile
);


/*
=========================================================
UPDATE MY PROFILE
=========================================================
*/

router.patch(
    "/me",
    protect,
    updateMyProfile
);


/*
=========================================================
UPDATE PROFILE PHOTO
=========================================================
*/

router.patch(
    "/me/photo",
    protect,
    profilePhotoUpload.single("profilePhoto"),
    updateProfilePhoto
);


module.exports = router;