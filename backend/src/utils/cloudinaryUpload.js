const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = (fileBuffer, originalName, mimeType) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "auto",
                folder: "insurance-claim-solutions/documents",
                public_id: `${Date.now()}-${originalName
                    .replace(/\s+/g, "-")
                    .replace(/[^a-zA-Z0-9._-]/g, "")}`
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                resolve(result);
            }
        );

        uploadStream.end(fileBuffer);
    });
};

module.exports = uploadToCloudinary;