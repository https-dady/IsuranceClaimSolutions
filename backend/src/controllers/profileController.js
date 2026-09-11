const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const uploadProfilePhotoToCloudinary = require("../utils/profilePhotoUpload");


/*
=========================================================
GET MY PROFILE
=========================================================
*/

const getMyProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findById(userId).select(
            "name email phone phoneVerified profilePhotoUrl type role"
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Profile fetched successfully",

            profile: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                phoneVerified: user.phoneVerified,
                profilePhotoUrl: user.profilePhotoUrl,
                type: user.type,
                role: user.role
            }
        });

    } catch (error) {
        console.error(
            "Get my profile error:",
            error
        );

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


/*
=========================================================
UPDATE MY PROFILE
=========================================================

Currently allows:
    - name
    - phone

Phone verification state is reset when phone changes.

Profile photo:
    - uploaded separately through the profile photo endpoint
=========================================================
*/

const updateMyProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const { name, phone } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (name !== undefined) {
            const trimmedName = name.trim();

            if (!trimmedName) {
                return res.status(400).json({
                    message: "Name cannot be empty"
                });
            }

            user.name = trimmedName;
        }

        if (phone !== undefined) {
            const trimmedPhone = phone.trim();

            if (!trimmedPhone) {
                return res.status(400).json({
                    message: "Phone number cannot be empty"
                });
            }

            if (trimmedPhone !== user.phone) {
                user.phone = trimmedPhone;

                /*
                New phone number must be verified again.
                */

                user.phoneVerified = false;
            }
        }

        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully",

            profile: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                phoneVerified: user.phoneVerified,
                profilePhotoUrl: user.profilePhotoUrl,
                type: user.type,
                role: user.role
            }
        });

    } catch (error) {
        console.error(
            "Update my profile error:",
            error
        );

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


/*
=========================================================
UPDATE PROFILE PHOTO
=========================================================

Actual file:
    -> Cloudinary

MongoDB:
    -> Cloudinary URL
    -> Cloudinary public ID

Only the logged-in user's own photo can be changed.
=========================================================
*/

const updateProfilePhoto = async (req, res) => {
    let uploadedPhoto = null;

    try {
        const userId = req.user.userId;

        if (!req.file) {
            return res.status(400).json({
                message: "Profile photo is required"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        /*
        Upload new photo first.
        This prevents deleting the old photo before
        the new upload succeeds.
        */

        uploadedPhoto =
            await uploadProfilePhotoToCloudinary(
                req.file.buffer,
                req.file.originalname,
                req.file.mimetype
            );

        const oldPublicId =
            user.profilePhotoPublicId;

        /*
        Save new Cloudinary references.
        */

        user.profilePhotoUrl =
            uploadedPhoto.secure_url;

        user.profilePhotoPublicId =
            uploadedPhoto.public_id;

        await user.save();

        /*
        Delete old Cloudinary photo only after
        the new photo has been successfully saved.
        */

        if (oldPublicId) {
            try {
                await cloudinary.uploader.destroy(
                    oldPublicId,
                    {
                        resource_type: "image"
                    }
                );
            } catch (deleteError) {
                console.error(
                    "Old profile photo deletion error:",
                    deleteError.message
                );
            }
        }

        return res.status(200).json({
            message:
                "Profile photo updated successfully",

            profilePhoto: {
                url: user.profilePhotoUrl,
                publicId: user.profilePhotoPublicId
            }
        });

    } catch (error) {
        console.error(
            "Update profile photo error:",
            error
        );

        /*
        If Cloudinary upload succeeded but database
        operation failed, clean up the newly uploaded
        image.
        */

        if (uploadedPhoto?.public_id) {
            try {
                await cloudinary.uploader.destroy(
                    uploadedPhoto.public_id,
                    {
                        resource_type: "image"
                    }
                );
            } catch (cleanupError) {
                console.error(
                    "Profile photo cleanup error:",
                    cleanupError.message
                );
            }
        }

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


module.exports = {
    getMyProfile,
    updateMyProfile,
    updateProfilePhoto
};