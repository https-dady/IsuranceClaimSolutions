const multer = require("multer");

const allowedMimeTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png"
];

const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 1 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(
                new Error(
                    "Only PDF, JPG, JPEG and PNG files are allowed"
                )
            );
        }

        cb(null, true);
    }
});

const handleDocumentUpload = (req, res, next) => {
    upload.array("documents")(req, res, (error) => {
        if (error instanceof multer.MulterError) {
            if (error.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({
                    message: "Each file must not exceed 1 MB"
                });
            }

            if (error.code === "LIMIT_UNEXPECTED_FILE") {
                return res.status(400).json({
                    message: "Unexpected document field"
                });
            }

            return res.status(400).json({
                message: error.message
            });
        }

        if (error) {
            return res.status(400).json({
                message: error.message
            });
        }

        next();
    });
};

module.exports = handleDocumentUpload;