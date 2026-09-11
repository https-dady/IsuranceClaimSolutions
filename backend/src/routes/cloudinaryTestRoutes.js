const express = require("express");
const multer = require("multer");

const uploadToCloudinary = require("../utils/cloudinaryUpload");

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1 * 1024 * 1024
    }
});

router.post(
    "/upload",
    (req, res, next) => {
        upload.single("file")(req, res, (error) => {
            if (error instanceof multer.MulterError) {
                if (error.code === "LIMIT_FILE_SIZE") {
                    return res.status(400).json({
                        message: "File size must not exceed 1 MB"
                    });
                }

                return res.status(400).json({
                    message: error.message
                });
            }

            if (error) {
                console.error("File upload middleware error:", error);

                return res.status(400).json({
                    message: "File upload failed"
                });
            }

            next();
        });
    },
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    message: "File is required"
                });
            }

            const result = await uploadToCloudinary(
                req.file.buffer,
                req.file.originalname,
                req.file.mimetype
            );

            return res.status(200).json({
                message: "File uploaded to Cloudinary successfully",
                file: {
                    fileName: req.file.originalname,
                    fileType: req.file.mimetype,
                    fileSize: req.file.size,
                    cloudinaryPublicId: result.public_id,
                    cloudinaryUrl: result.secure_url
                }
            });
        } catch (error) {
            console.error("Cloudinary test upload error:", error);

            return res.status(500).json({
                message: "Cloudinary upload failed"
            });
        }
    }
);

module.exports = router;