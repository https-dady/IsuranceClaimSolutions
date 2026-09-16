const Document = require("../models/Document");
const Query = require("../models/Query");
const mongoose = require("mongoose");
const uploadToCloudinary = require("../utils/cloudinaryUpload");
const cloudinary = require("../config/cloudinary");

const deleteFromCloudinary = async (publicId) => {
    const imageResult = await cloudinary.uploader.destroy(
        publicId,
        {
            resource_type: "image"
        }
    );

    if (imageResult.result === "ok") {
        return imageResult;
    }

    const rawResult = await cloudinary.uploader.destroy(
        publicId,
        {
            resource_type: "raw"
        }
    );

    return rawResult;
};


/*
=========================================================
CREATE DOCUMENT RECORDS
=========================================================

Uploads files to Cloudinary and creates only metadata
records in MongoDB.

Actual files are never stored in MongoDB.
=========================================================
*/

const createDocumentRecords = async ({
    files,
    documentTypes,
    userId,
    queryId
}) => {
    if (!files || files.length === 0) {
        return [];
    }

    if (
        !Array.isArray(documentTypes) ||
        documentTypes.length !== files.length
    ) {
        throw new Error(
            "Each uploaded file must have a corresponding document type"
        );
    }

    const createdDocuments = [];

    try {
        for (
            let index = 0;
            index < files.length;
            index++
        ) {
            const file = files[index];
            const documentType =
                documentTypes[index];

            if (
                !documentType ||
                typeof documentType !== "string"
            ) {
                throw new Error(
                    "Invalid document type for uploaded file"
                );
            }

            const result =
                await uploadToCloudinary(
                    file.buffer,
                    file.originalname,
                    file.mimetype
                );

            const document =
                await Document.create({
                    user: userId,

                    query:
                        queryId || null,

                    documentType:
                        documentType.trim(),

                    fileName:
                        file.originalname,

                    fileType:
                        file.mimetype,

                    fileSize:
                        file.size,

                    cloudinaryPublicId:
                        result.public_id,

                    cloudinaryUrl:
                        result.secure_url,

                    status: "pending"
                });

            createdDocuments.push(
                document
            );
        }

        return createdDocuments;

    } catch (error) {

        /*
        =====================================================
        CLEANUP CLOUDINARY + MONGODB
        =====================================================
        */

        for (
            const document
            of createdDocuments
        ) {
            try {
                await deleteFromCloudinary(
                    document.cloudinaryPublicId
                );

                await Document.findByIdAndDelete(
                    document._id
                );

            } catch (cleanupError) {
                console.error(
                    "Document cleanup error:",
                    cleanupError.message
                );
            }
        }

        throw error;
    }
};


/*
=========================================================
UPLOAD DOCUMENTS
=========================================================
*/

const uploadDocuments = async (req, res) => {
    try {
        if (
            !req.files ||
            req.files.length === 0
        ) {
            return res.status(400).json({
                message:
                    "At least one document is required"
            });
        }

        let documentTypes = [];

        if (req.body.documentTypes) {
            try {
                documentTypes =
                    JSON.parse(
                        req.body.documentTypes
                    );

            } catch (error) {
                return res.status(400).json({
                    message:
                        "Invalid documentTypes format"
                });
            }
        }

        const queryId =
            req.body.queryId || null;

        let queryObjectId = null;

        if (queryId) {
            const queryConditions = [
                { queryId: queryId },
            ];

            if (
                mongoose.Types.ObjectId.isValid(
                    queryId
                )
            ) {
                queryConditions.push({
                    _id: queryId
                });
            }

            const query =
                await Query.findOne({
                    user: req.user.userId,
                    $or: queryConditions
                });

            if (!query) {
                return res.status(404).json({
                    message:
                        "Query not found or you do not have access to it"
                });
            }

            // Convert user-facing queryId to MongoDB ObjectId
            queryObjectId = query._id;
        }

        const documents =
            await createDocumentRecords({
                files: req.files,
                documentTypes,
                userId: req.user.userId,
                queryId:queryObjectId
            });

        return res.status(201).json({
            message:
                "Documents uploaded successfully",

            documents
        });

    } catch (error) {
        console.error(
            "Upload documents error:",
            error
        );

        return res.status(500).json({
            message:
                "Document upload failed"
        });
    }
};


/*
=========================================================
GET MY DOCUMENTS
=========================================================
*/

const getMyDocuments = async (req, res) => {
    try {
        const documents =
            await Document.find({
                user: req.user.userId
            })
                .populate(
                    "query",
                    "queryId"
                )
                .sort({
                    createdAt: -1
                });

        return res.status(200).json({
            documents
        });

    } catch (error) {
        console.error(
            "Get my documents error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to fetch documents"
        });
    }
};


/*
=========================================================
GET USER DOCUMENTS FOR A QUERY
=========================================================
*/

const getMyQueryDocuments = async (req, res) => {
    try {
        const queryIdentifier =
            req.params.queryId;

        const queryConditions = [
            {
                queryId:
                    queryIdentifier
            },
        ];

        if (
            mongoose.Types.ObjectId.isValid(
                queryIdentifier
            )
        ) {
            queryConditions.push({
                _id:
                    queryIdentifier
            });
        }

        const query =
            await Query.findOne({
                user: req.user.userId,
                $or: queryConditions
            }).select(
                "_id queryId"
            );

        if (!query) {
            return res.status(404).json({
                message:
                    "Query not found or you do not have access to it"
            });
        }

        const documents =
            await Document.find({
                user: req.user.userId,
                query: query._id
            })
                .sort({
                    createdAt: -1
                });

        return res.status(200).json({
            documents
        });

    } catch (error) {
        console.error(
            "Get query documents error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to fetch query documents"
        });
    }
};


/*
=========================================================
GET SINGLE USER DOCUMENT
=========================================================
*/

const getDocumentById = async (req, res) => {
    try {
        const document =
            await Document.findOne({
                _id:
                    req.params.documentId,

                user:
                    req.user.userId
            })
                .populate(
                    "query",
                    "queryId"
                );

        if (!document) {
            return res.status(404).json({
                message:
                    "Document not found"
            });
        }

        return res.status(200).json({
            document
        });

    } catch (error) {
        console.error(
            "Get document error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to fetch document"
        });
    }
};


/*
=========================================================
DELETE USER DOCUMENT
=========================================================
*/

const deleteDocument = async (req, res) => {
    try {
        const document =
            await Document.findOne({
                _id:
                    req.params.documentId,

                user:
                    req.user.userId
            });

        if (!document) {
            return res.status(404).json({
                message:
                    "Document not found"
            });
        }

        const cloudinaryResult =
            await deleteFromCloudinary(
                document.cloudinaryPublicId
            );

        if (
            cloudinaryResult.result !== "ok" &&
            cloudinaryResult.result !== "not found"
        ) {
            return res.status(500).json({
                message:
                    "Failed to delete document from Cloudinary"
            });
        }

        await Document.findByIdAndDelete(
            document._id
        );

        return res.status(200).json({
            message:
                "Document deleted successfully"
        });

    } catch (error) {
        console.error(
            "Delete document error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to delete document"
        });
    }
};


/*
=========================================================
GET ADMIN DOCUMENTS
=========================================================
*/

const getAdminDocuments = async (req, res) => {
    try {
        const {
            search,
            status
        } = req.query;

        const filter = {};

        if (
            status &&
            status !== "All"
        ) {
            const allowedStatuses = [
                "pending",
                "approved",
                "rejected"
            ];

            if (
                !allowedStatuses.includes(
                    status
                )
            ) {
                return res.status(400).json({
                    message:
                        "Invalid document status"
                });
            }

            filter.status = status;
        }

        let documents =
            await Document.find(filter)
                .populate(
                    "user",
                    "name email phone"
                )
                .populate(
                    "query",
                    "queryId"
                )
                .sort({
                    createdAt: -1
                });

        if (
            search &&
            search.trim()
        ) {
            const searchTerm =
                search
                    .trim()
                    .toLowerCase();

            documents =
                documents.filter(
                    (document) => {
                        const documentName =
                            document.fileName
                                ?.toLowerCase() ||
                            "";

                        const userName =
                            document.user?.name
                                ?.toLowerCase() ||
                            "";

                        const queryId =
                            document.query?.queryId
                                ?.toLowerCase() ||
                            "";

                        return (
                            documentName.includes(
                                searchTerm
                            ) ||
                            userName.includes(
                                searchTerm
                            ) ||
                            queryId.includes(
                                searchTerm
                            )
                        );
                    }
                );
        }

        const totalDocuments =
            await Document.countDocuments();

        const pendingDocuments =
            await Document.countDocuments({
                status: "pending"
            });

        const approvedDocuments =
            await Document.countDocuments({
                status: "approved"
            });

        const rejectedDocuments =
            await Document.countDocuments({
                status: "rejected"
            });

        return res.status(200).json({
            documents,

            stats: {
                totalDocuments,
                pendingDocuments,
                approvedDocuments,
                rejectedDocuments
            }
        });

    } catch (error) {
        console.error(
            "Get admin documents error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to fetch admin documents"
        });
    }
};


/*
=========================================================
GET SINGLE ADMIN DOCUMENT
=========================================================
*/

const getAdminDocumentById = async (
    req,
    res
) => {
    try {
        const document =
            await Document.findById(
                req.params.documentId
            )
                .populate(
                    "user",
                    "name email phone"
                )
                .populate(
                    "query",
                    "queryId"
                );

        if (!document) {
            return res.status(404).json({
                message:
                    "Document not found"
            });
        }

        return res.status(200).json({
            document
        });

    } catch (error) {
        console.error(
            "Get admin document error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to fetch document"
        });
    }
};


module.exports = {
    uploadDocuments,
    createDocumentRecords,
    getMyDocuments,
    getMyQueryDocuments,
    getDocumentById,
    deleteDocument,
    getAdminDocuments,
    getAdminDocumentById
};