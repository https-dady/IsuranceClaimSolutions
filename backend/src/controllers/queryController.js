const mongoose = require("mongoose");
const Query = require("../models/Query");
const User = require("../models/User");
const Document = require("../models/Document");

const cloudinary = require("../config/cloudinary");
const uploadToCloudinary = require("../utils/cloudinaryUpload");

const {
    sendQuerySubmissionConfirmation,
    sendNewQueryAdminNotification,
    sendQueryUpdateNotification
} = require("../services/emailService");

const generateQueryId = require("../utils/generateQueryId");


const QUERY_STATUSES = [
    "Query Submitted",
    "Under Initial Review",
    "Document Review",
    "Claim Processing",
    "Resolution"
];


/*
=========================================================
FIND QUERY BY MONGODB ID OR USER-FACING QUERY ID
=========================================================
*/

const findQueryByIdOrQueryId = async (identifier) => {
    if (!identifier) {
        return null;
    }

    if (identifier.startsWith("ICS-")) {
        return Query.findOne({
            queryId: identifier
        });
    }

    if (mongoose.Types.ObjectId.isValid(identifier)) {
        return Query.findById(identifier);
    }

    return Query.findOne({
        queryId: identifier
    });
};


/*
=========================================================
PARSE MULTIPART JSON FIELDS
=========================================================
*/

const parseJsonField = (value) => {
    if (typeof value !== "string") {
        return value;
    }

    try {
        return JSON.parse(value);
    } catch (error) {
        return null;
    }
};


/*
=========================================================
CREATE QUERY
=========================================================
*/

const createQuery = async (req, res) => {
    let uploadedCloudinaryFiles = [];
    let createdQuery = null;

    try {
        const userId = req.user.userId;

        let {
            personalDetails,
            address,
            insuranceDetails,
            claimDetails,
            queryDetails,
            documentTypes
        } = req.body;


        /*
        =====================================================
        PARSE JSON DATA
        =====================================================
        */

        personalDetails = parseJsonField(personalDetails);
        address = parseJsonField(address);
        insuranceDetails = parseJsonField(insuranceDetails);
        claimDetails = parseJsonField(claimDetails);


        /*
        =====================================================
        QUERY DETAILS
        =====================================================
        */

        queryDetails = parseJsonField(queryDetails);


        /*
        =====================================================
        REQUIRED QUERY DETAILS
        =====================================================
        */

        if (
            !personalDetails ||
            !address ||
            !insuranceDetails ||
            !claimDetails ||
            !queryDetails
        ) {
            return res.status(400).json({
                message: "All required query details are required"
            });
        }


        /*
        =====================================================
        USER
        =====================================================
        */

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        /*
        =====================================================
        DOCUMENT TYPES
        =====================================================
        */

        const files = req.files || [];

        if (documentTypes !== undefined) {

            if (!Array.isArray(documentTypes)) {
                documentTypes = [documentTypes];
            }

            documentTypes = documentTypes.map((type) => {
                if (typeof type !== "string") {
                    return type;
                }

                return type.trim();
            });
        } else {
            documentTypes = [];
        }


        /*
        =====================================================
        DOCUMENT COUNT VALIDATION
        =====================================================
        */

        if (files.length !== documentTypes.length) {

            return res.status(400).json({
                message:
                    "Each uploaded document must have a corresponding document type"
            });
        }


        /*
        =====================================================
        GENERATE UNIQUE QUERY ID
        =====================================================
        */

        let generatedQueryId;
        let existingQuery;

        do {
            generatedQueryId = generateQueryId();

            existingQuery = await Query.findOne({
                queryId: generatedQueryId
            });

        } while (existingQuery);


        /*
        =====================================================
        UPLOAD DOCUMENTS TO CLOUDINARY
        =====================================================
        */

        const uploadedDocuments = [];

        for (let index = 0; index < files.length; index++) {

            const file = files[index];
            const documentType = documentTypes[index];


            if (!documentType) {

                return res.status(400).json({
                    message:
                        "Document type is required for every uploaded document"
                });
            }


            const result = await uploadToCloudinary(
                file.buffer,
                file.originalname,
                file.mimetype
            );


            uploadedCloudinaryFiles.push({
                publicId: result.public_id,
                mimeType: file.mimetype
            });


            uploadedDocuments.push({
                documentType,
                fileName: file.originalname,
                fileType: file.mimetype,
                fileSize: file.size,
                cloudinaryPublicId: result.public_id,
                cloudinaryUrl: result.secure_url
            });
        }


        /*
        =====================================================
        CREATE QUERY IN DATABASE
        =====================================================
        */

        createdQuery = await Query.create({
            queryId: generatedQueryId,
            user: userId,

            personalDetails,
            address,
            insuranceDetails,
            claimDetails,
            queryDetails,

            status: "Query Submitted",

            timeline: [
                {
                    status: "Query Submitted",
                    updatedBy: userId,
                    updatedAt: new Date()
                }
            ]
        });


        /*
        =====================================================
        CREATE DOCUMENT METADATA
        =====================================================
        */

        if (uploadedDocuments.length > 0) {

            const documentRecords =
                uploadedDocuments.map((document) => ({
                    user: userId,
                    query: createdQuery._id,

                    documentType: document.documentType,

                    fileName: document.fileName,
                    fileType: document.fileType,
                    fileSize: document.fileSize,

                    cloudinaryPublicId:
                        document.cloudinaryPublicId,

                    cloudinaryUrl:
                        document.cloudinaryUrl,

                    status: "pending"
                }));


            await Document.insertMany(documentRecords);
        }


        /*
        =====================================================
        QUERY SUBMISSION EMAILS
        =====================================================

        Email sending is outside the HTTP response path.
        =====================================================
        */

        setImmediate(async () => {

            const emailTasks = [

                sendQuerySubmissionConfirmation(
                    user.email,
                    createdQuery.queryId,
                    personalDetails.fullName,
                    insuranceDetails.insuranceType,
                    insuranceDetails.insuranceCompany,
                    insuranceDetails.policyNumber,
                    claimDetails.claimNumber,
                    claimDetails.claimAmount,
                    claimDetails.issueType,
                    queryDetails.issueDescription
                )
            ];


            const mainAdminEmail =
                process.env.MAIN_ADMIN_EMAIL;


            if (mainAdminEmail) {

                emailTasks.push(

                    sendNewQueryAdminNotification(
                        mainAdminEmail,
                        createdQuery.queryId,
                        personalDetails.fullName,
                        personalDetails.email,
                        personalDetails.phone,
                        insuranceDetails.insuranceType,
                        insuranceDetails.insuranceCompany,
                        insuranceDetails.policyNumber,
                        claimDetails.claimNumber,
                        claimDetails.claimAmount,
                        claimDetails.issueType,
                        queryDetails.issueDescription
                    )
                );

            } else {

                console.error(
                    "MAIN_ADMIN_EMAIL is not configured."
                );
            }


            const results =
                await Promise.allSettled(emailTasks);


            results.forEach((result, index) => {

                const recipientType =
                    index === 0
                        ? "user"
                        : "Main Admin";


                if (result.status === "fulfilled") {

                    console.log(
                        `Query submission ${recipientType} email sent successfully.`
                    );

                } else {

                    console.error(
                        `Query submission ${recipientType} email failed:`,
                        result.reason?.message ||
                        result.reason
                    );
                }
            });

        });


        /*
        =====================================================
        SUCCESS RESPONSE
        =====================================================
        */

        return res.status(201).json({

            message:
                "Query submitted successfully",

            query: {
                id: createdQuery._id,
                queryId: createdQuery.queryId,
                status: createdQuery.status,
                createdAt: createdQuery.createdAt
            }

        });


    } catch (error) {

        console.error(
            "Create query error:",
            error
        );


        /*
        =====================================================
        CLEANUP DOCUMENTS IF SOMETHING FAILED
        =====================================================
        */

        if (createdQuery) {

            try {

                await Document.deleteMany({
                    query: createdQuery._id
                });

                await Query.findByIdAndDelete(
                    createdQuery._id
                );

            } catch (cleanupError) {

                console.error(
                    "Database cleanup error:",
                    cleanupError
                );
            }
        }


        /*
        =====================================================
        CLEANUP CLOUDINARY FILES
        =====================================================
        */

        if (uploadedCloudinaryFiles.length > 0) {

            for (const file of uploadedCloudinaryFiles) {

                try {

                    await cloudinary.uploader.destroy(
                        file.publicId,
                        {
                            resource_type:
                                file.mimeType.startsWith("image/")
                                    ? "image"
                                    : "raw"
                        }
                    );

                } catch (cloudinaryError) {

                    console.error(
                        "Cloudinary cleanup error:",
                        cloudinaryError.message
                    );
                }
            }
        }


        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


/*
=========================================================
GET MY QUERIES
=========================================================
*/

const getMyQueries = async (req, res) => {

    try {

        const userId = req.user.userId;

        const queries = await Query.find({
            user: userId
        })
            .select(
                "queryId personalDetails insuranceDetails claimDetails queryDetails status assignedAdmin adminNotes timeline createdAt updatedAt"
            )
            .populate(
                "assignedAdmin",
                "name email type role"
            )
            .sort({
                createdAt: -1
            });


        return res.status(200).json({

            message:
                "Queries fetched successfully",

            queries

        });

    } catch (error) {

        console.error(
            "Get my queries error:",
            error
        );

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


/*
=========================================================
GET MY QUERY BY ID
=========================================================
*/

const getMyQueryById = async (req, res) => {

    try {

        const userId = req.user.userId;
        const { queryId } = req.params;


        if (!queryId) {

            return res.status(400).json({
                message: "Query ID is required"
            });
        }


        const query =
            await findQueryByIdOrQueryId(
                queryId
            );


        if (
            !query ||
            query.user.toString() !== userId
        ) {

            return res.status(404).json({
                message: "Query not found"
            });
        }


        await query.populate(
            "assignedAdmin",
            "name email type role"
        );


        await query.populate(
            "timeline.updatedBy",
            "name email type role"
        );


        return res.status(200).json({

            message:
                "Query fetched successfully",

            query

        });

    } catch (error) {

        console.error(
            "Get my query error:",
            error
        );

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


/*
=========================================================
GET ADMIN QUERIES
=========================================================
*/

const getAdminQueries = async (req, res) => {

    try {

        const {
            search,
            status,
            type
        } = req.query;


        const filter = {};


        /*
        =====================================================
        STATUS FILTER
        =====================================================
        */

        if (status) {

            switch (status) {

                case "Pending Review":

                    filter.status =
                        "Query Submitted";

                    break;


                case "Under Review":

                    filter.status = {
                        $in: [
                            "Under Initial Review",
                            "Document Review",
                            "Claim Processing"
                        ]
                    };

                    break;


                case "Assigned":

                    filter.assignedAdmin = {
                        $ne: null
                    };

                    break;


                case "Resolved":

                    filter.status =
                        "Resolution";

                    break;


                case "Query Submitted":
                case "Under Initial Review":
                case "Document Review":
                case "Claim Processing":
                case "Resolution":

                    filter.status = status;

                    break;


                case "All":

                    break;


                default:

                    return res.status(400).json({
                        message:
                            "Invalid status filter"
                    });
            }
        }


        /*
        =====================================================
        INSURANCE TYPE FILTER
        =====================================================
        */

        if (type) {

            switch (type) {

                case "Health Insurance":

                    filter[
                        "insuranceDetails.insuranceType"
                    ] = "Health";

                    break;


                case "Motor Insurance":

                    filter[
                        "insuranceDetails.insuranceType"
                    ] = "Motor";

                    break;


                case "Life Insurance":

                    filter[
                        "insuranceDetails.insuranceType"
                    ] = "Life";

                    break;


                case "Property Insurance":

                    filter[
                        "insuranceDetails.insuranceType"
                    ] = "Property";

                    break;


                case "Health":
                case "Motor":
                case "Life":
                case "Property":
                case "Travel":
                case "Other":

                    filter[
                        "insuranceDetails.insuranceType"
                    ] = type;

                    break;


                case "All":

                    break;


                default:

                    return res.status(400).json({
                        message:
                            "Invalid insurance type filter"
                    });
            }
        }


        /*
        =====================================================
        SEARCH FILTER
        =====================================================
        */

        if (
            search &&
            search.trim()
        ) {

            const searchRegex =
                new RegExp(
                    search.trim(),
                    "i"
                );


            filter.$or = [

                {
                    "personalDetails.fullName":
                        searchRegex
                },

                {
                    "personalDetails.email":
                        searchRegex
                },

                {
                    "personalDetails.phone":
                        searchRegex
                },

                {
                    "insuranceDetails.insuranceCompany":
                        searchRegex
                },

                {
                    "insuranceDetails.policyNumber":
                        searchRegex
                },

                {
                    "claimDetails.claimNumber":
                        searchRegex
                },

                {
                    "claimDetails.issueType":
                        searchRegex
                },

                {
                    "address.city":
                        searchRegex
                },

                {
                    "address.state":
                        searchRegex
                },

                {
                    "queryDetails.issueDescription":
                        searchRegex
                },

                {
                    queryId:
                        searchRegex
                }

            ];
        }


        /*
        =====================================================
        FETCH QUERIES
        =====================================================
        */

        const queries =
            await Query.find(filter)
                .populate(
                    "user",
                    "name email phone type role"
                )
                .populate(
                    "assignedAdmin",
                    "name email type role"
                )
                .sort({
                    createdAt: -1
                });


        /*
        =====================================================
        RESPONSE
        =====================================================
        */

        return res.status(200).json({

            message:
                "Admin queries fetched successfully",

            filters: {

                search:
                    search || "",

                status:
                    status || "All",

                type:
                    type || "All"

            },

            count:
                queries.length,

            queries

        });

    } catch (error) {

        console.error(
            "Get admin queries error:",
            error
        );

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


/*
=========================================================
GET ADMIN QUERY BY ID
=========================================================
*/

const getAdminQueryById = async (req, res) => {

    try {

        const { queryId } = req.params;


        if (!queryId) {

            return res.status(400).json({
                message:
                    "Query ID is required"
            });
        }


        const query =
            await findQueryByIdOrQueryId(
                queryId
            );


        if (!query) {

            return res.status(404).json({
                message:
                    "Query not found"
            });
        }


        await query.populate(
            "user",
            "name email phone type role"
        );


        await query.populate(
            "assignedAdmin",
            "name email type role"
        );


        await query.populate(
            "timeline.updatedBy",
            "name email type role"
        );


        const isMainAdmin =
            req.user.type === "admin" &&
            req.user.role === "main_admin";


        const isSecondaryAdmin =
            req.user.type === "admin" &&
            req.user.role === "secondary_admin";


        const isAssignedSecondaryAdmin =
            isSecondaryAdmin &&
            !!query.assignedAdmin &&
            query.assignedAdmin._id.toString() ===
                req.user.userId;


        return res.status(200).json({

            message:
                "Admin query fetched successfully",

            query,

            permissions: {

                canManage:
                    isMainAdmin ||
                    isAssignedSecondaryAdmin

            }

        });

    } catch (error) {

        console.error(
            "Get admin query error:",
            error
        );

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


/*
=========================================================
ASSIGN QUERY
=========================================================
*/

const assignQuery = async (req, res) => {

    try {

        const { queryId } = req.params;
        const { adminId } = req.body;


        if (!queryId) {

            return res.status(400).json({
                message:
                    "Query ID is required"
            });
        }


        if (!adminId) {

            return res.status(400).json({
                message:
                    "Admin ID is required"
            });
        }


        const query =
            await findQueryByIdOrQueryId(
                queryId
            );


        if (!query) {

            return res.status(404).json({
                message:
                    "Query not found"
            });
        }


        const admin =
            await User.findById(adminId);


        if (!admin) {

            return res.status(404).json({
                message:
                    "Admin not found"
            });
        }


        if (
            admin.type !== "admin" ||
            admin.role !== "secondary_admin"
        ) {

            return res.status(400).json({

                message:
                    "Query can only be assigned to a Secondary Admin"

            });
        }


        query.assignedAdmin =
            admin._id;


        await query.save();


        return res.status(200).json({

            message:
                "Query assigned successfully",

            query: {

                id:
                    query._id,

                queryId:
                    query.queryId,

                assignedAdmin:
                    query.assignedAdmin

            }

        });

    } catch (error) {

        console.error(
            "Assign query error:",
            error
        );

        return res.status(500).json({
            message:
                "Something went wrong"
        });
    }
};


/*
=========================================================
UNASSIGN QUERY
=========================================================
*/

const unassignQuery = async (req, res) => {

    try {

        const { queryId } = req.params;


        if (!queryId) {

            return res.status(400).json({
                message:
                    "Query ID is required"
            });
        }


        const query =
            await findQueryByIdOrQueryId(
                queryId
            );


        if (!query) {

            return res.status(404).json({
                message:
                    "Query not found"
            });
        }


        query.assignedAdmin =
            null;


        await query.save();


        return res.status(200).json({

            message:
                "Query unassigned successfully",

            query: {

                id:
                    query._id,

                queryId:
                    query.queryId,

                assignedAdmin:
                    null

            }

        });

    } catch (error) {

        console.error(
            "Unassign query error:",
            error
        );

        return res.status(500).json({
            message:
                "Something went wrong"
        });
    }
};


/*
=========================================================
UPDATE QUERY
=========================================================
*/

const updateQuery = async (req, res) => {

    try {

        const { queryId } = req.params;

        const {
            status,
            adminNotes
        } = req.body;


        if (!queryId) {

            return res.status(400).json({
                message:
                    "Query ID is required"
            });
        }


        if (
            status === undefined &&
            adminNotes === undefined
        ) {

            return res.status(400).json({

                message:
                    "Status or admin notes are required"

            });
        }


        if (
            status !== undefined &&
            !QUERY_STATUSES.includes(status)
        ) {

            return res.status(400).json({
                message:
                    "Invalid query status"
            });
        }


        const query =
            await findQueryByIdOrQueryId(
                queryId
            );


        if (!query) {

            return res.status(404).json({
                message:
                    "Query not found"
            });
        }


        const isMainAdmin =
            req.user.type === "admin" &&
            req.user.role === "main_admin";


        const isSecondaryAdmin =
            req.user.type === "admin" &&
            req.user.role === "secondary_admin";


        const isAssignedSecondaryAdmin =
            isSecondaryAdmin &&
            !!query.assignedAdmin &&
            query.assignedAdmin.toString() ===
                req.user.userId;


        if (
            !isMainAdmin &&
            !isAssignedSecondaryAdmin
        ) {

            return res.status(403).json({

                message:
                    "You do not have permission to manage this query"

            });
        }


        const statusChanged =
            status !== undefined &&
            status !== query.status;


        if (status !== undefined) {

            query.status =
                status;
        }


        if (adminNotes !== undefined) {

            query.adminNotes =
                adminNotes;
        }


        if (statusChanged) {

            query.timeline.push({

                status,

                note:
                    adminNotes !== undefined
                        ? adminNotes
                        : undefined,

                updatedBy:
                    req.user.userId,

                updatedAt:
                    new Date()

            });
        }


        await query.save();


        const updatedQuery =
            await findQueryByIdOrQueryId(
                query._id.toString()
            );


        await updatedQuery.populate(
            "user",
            "name email phone type role"
        );


        await updatedQuery.populate(
            "assignedAdmin",
            "name email type role"
        );


        await updatedQuery.populate(
            "timeline.updatedBy",
            "name email type role"
        );


        /*
        =====================================================
        USER QUERY UPDATE EMAIL
        =====================================================
        */

        if (statusChanged) {

            setImmediate(async () => {

                try {

                    await sendQueryUpdateNotification(

                        updatedQuery.user.email,

                        updatedQuery.queryId,

                        updatedQuery.status,

                        updatedQuery.adminNotes

                    );


                    console.log(
                        "Query update notification email sent successfully."
                    );

                } catch (emailError) {

                    console.error(
                        "Query update notification email failed:",
                        emailError.message
                    );
                }

            });
        }


        return res.status(200).json({

            message:
                "Query updated successfully",

            query:
                updatedQuery

        });

    } catch (error) {

        console.error(
            "Update query error:",
            error
        );

        return res.status(500).json({
            message:
                "Something went wrong"
        });
    }
};


/*
=========================================================
EXPORTS
=========================================================
*/

module.exports = {

    createQuery,

    getMyQueries,

    getMyQueryById,

    getAdminQueries,

    getAdminQueryById,

    assignQuery,

    unassignQuery,

    updateQuery

};