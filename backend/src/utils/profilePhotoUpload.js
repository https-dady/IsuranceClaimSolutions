const cloudinary = require("../config/cloudinary");

const uploadProfilePhotoToCloudinary = (
    fileBuffer,
    originalName,
    mimeType
) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "image",
                folder: "insurance-claim-solutions/profile-photos",
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

module.exports = uploadProfilePhotoToCloudinary;