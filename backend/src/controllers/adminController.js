const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Query = require("../models/Query");

const {
    sendVerificationOTP
} = require("../services/emailService");


/*
=========================================================
GET ADMINS
=========================================================
*/

const getAdmins = async (req, res) => {
    try {
        const admins = await User.find({
            type: "admin"
        })
            .select(
                "-password -emailVerificationOTP -emailVerificationOTPExpires -passwordResetOTP -passwordResetOTPExpires"
            )
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Admins fetched successfully",
            admins
        });
    } catch (error) {
        console.error("Get admins error:", error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


/*
=========================================================
CREATE SECONDARY ADMIN
=========================================================

Main Admin creates a completely new Secondary Admin.

This does NOT use the old promotion flow.

Created account:

type = admin
role = secondary_admin
emailVerified = false

The existing email verification OTP flow is reused.
=========================================================
*/

const createSecondaryAdmin = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            password,
            confirmPassword
        } = req.body;


        /*
        =====================================================
        VALIDATE REQUIRED FIELDS
        =====================================================
        */

        if (
            !name ||
            !email ||
            !phone ||
            !password ||
            !confirmPassword
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }


        /*
        =====================================================
        PASSWORD CONFIRMATION
        =====================================================
        */

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match"
            });
        }


        /*
        =====================================================
        PASSWORD LENGTH
        =====================================================
        */

        if (password.length < 6) {
            return res.status(400).json({
                message:
                    "Password must be at least 6 characters long"
            });
        }


        /*
        =====================================================
        NORMALIZE EMAIL
        =====================================================
        */

        const normalizedEmail =
            email.toLowerCase().trim();


        /*
        =====================================================
        CHECK EXISTING EMAIL
        =====================================================
        */

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }


        /*
        =====================================================
        HASH PASSWORD
        =====================================================
        */

        const hashedPassword =
            await bcrypt.hash(password, 10);


        /*
        =====================================================
        GENERATE EMAIL VERIFICATION OTP
        =====================================================
        */

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        const otpExpires = new Date(
            Date.now() + 10 * 60 * 1000
        );


        /*
        =====================================================
        CREATE SECONDARY ADMIN
        =====================================================
        */

        const admin = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            phone: phone.trim(),
            password: hashedPassword,

            emailVerified: false,

            emailVerificationOTP: otp,
            emailVerificationOTPExpires:
                otpExpires,

            type: "admin",
            role: "secondary_admin"
        });


        /*
        =====================================================
        SEND VERIFICATION OTP
        =====================================================
        */

        try {
            await sendVerificationOTP(
                admin.email,
                otp
            );
        } catch (emailError) {
            console.error(
                "Secondary Admin verification email failed:",
                emailError
            );

            /*
            If email could not be sent, remove the
            newly-created account so that an unusable
            admin account is not left in the database.
            */

            await User.findByIdAndDelete(
                admin._id
            );

            return res.status(500).json({
                message:
                    "Secondary Admin could not be created because verification email could not be sent."
            });
        }


        /*
        =====================================================
        SUCCESS RESPONSE
        =====================================================
        */

        return res.status(201).json({
            message:
                "Secondary Admin created successfully. Verification OTP sent to email.",

            userId: admin._id,

            email: admin.email
        });

    } catch (error) {
        console.error(
            "Create Secondary Admin error:",
            error
        );

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


/*
=========================================================
OLD PROMOTION FUNCTION
=========================================================

Kept here for compatibility with the existing controller.

The new Admin Management frontend will NOT use this
promotion flow.

New Secondary Admins are created using
createSecondaryAdmin().
=========================================================
*/

const promoteToSecondaryAdmin = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (
            user.type === "admin" &&
            user.role === "main_admin"
        ) {
            return res.status(400).json({
                message: "Main Admin cannot be promoted"
            });
        }

        if (
            user.type === "admin" &&
            user.role === "secondary_admin"
        ) {
            return res.status(400).json({
                message: "User is already a Secondary Admin"
            });
        }

        user.type = "admin";
        user.role = "secondary_admin";

        await user.save();

        return res.status(200).json({
            message:
                "User promoted to Secondary Admin successfully"
        });
    } catch (error) {
        console.error(
            "Promote Secondary Admin error:",
            error
        );

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


/*
=========================================================
REMOVE SECONDARY ADMIN
=========================================================
*/

const removeSecondaryAdmin = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (
            user.type !== "admin" ||
            user.role !== "secondary_admin"
        ) {
            return res.status(400).json({
                message: "User is not a Secondary Admin"
            });
        }


        /*
        =====================================================
        UNASSIGN ALL QUERIES
        =====================================================

        When a Secondary Admin is removed, all queries
        assigned to that admin become unassigned.
        */

        await Query.updateMany(
            {
                assignedAdmin: user._id
            },
            {
                $set: {
                    assignedAdmin: null
                }
            }
        );


        /*
        =====================================================
        REMOVE ADMIN ACCESS
        =====================================================
        */

        user.type = "user";
        user.role = "user";

        await user.save();

        return res.status(200).json({
            message:
                "Secondary Admin access removed successfully"
        });

    } catch (error) {
        console.error(
            "Remove Secondary Admin error:",
            error
        );

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


/*
=========================================================
ADMIN DASHBOARD
=========================================================

Dashboard data is calculated directly from MongoDB.

Frontend dashboard concepts:

Pending Review
    -> Query Submitted

Under Review
    -> Under Initial Review
    -> Document Review
    -> Claim Processing

Assigned Queries
    -> assignedAdmin exists

Resolved Claims
    -> Resolution
=========================================================
*/

const getDashboard = async (req, res) => {
    try {
        const totalQueries = await Query.countDocuments({});

        const pendingReview = await Query.countDocuments({
            status: "Query Submitted"
        });

        const underReview = await Query.countDocuments({
            status: {
                $in: [
                    "Under Initial Review",
                    "Document Review",
                    "Claim Processing"
                ]
            }
        });

        const assignedQueries = await Query.countDocuments({
            assignedAdmin: {
                $ne: null
            }
        });

        const resolvedClaims = await Query.countDocuments({
            status: "Resolution"
        });


        /*
        =====================================================
        RECENT QUERIES
        =====================================================
        */

        const recentQueries = await Query.find({})
            .populate("user", "name email")
            .populate(
                "assignedAdmin",
                "name email role"
            )
            .sort({ createdAt: -1 })
            .limit(4);


        const formattedRecentQueries =
            recentQueries.map(
                (query) => ({
                    id: query.queryId,

                    user: query.user
                        ? query.user.name
                        : "Unknown User",

                    email: query.user
                        ? query.user.email
                        : "",

                    type:
                        query.insuranceDetails
                            ?.insuranceType ||
                        "",

                    amount:
                        query.claimDetails
                            ?.claimAmount ?? 0,

                    status: query.status,

                    assignedTo:
                        query.assignedAdmin
                            ? query.assignedAdmin.name
                            : null,

                    priority:
                        query.priority || null,

                    date: query.createdAt
                })
            );


        /*
        =====================================================
        STATUS OVERVIEW
        =====================================================
        */

        const calculatePercentage = (count) => {
            if (totalQueries === 0) {
                return 0;
            }

            return Number(
                (
                    (count / totalQueries) *
                    100
                ).toFixed(1)
            );
        };


        const statusOverview = [
            {
                label: "Pending Review",
                count: pendingReview,
                percentage:
                    calculatePercentage(
                        pendingReview
                    )
            },

            {
                label: "Under Review",
                count: underReview,
                percentage:
                    calculatePercentage(
                        underReview
                    )
            },

            {
                label: "Assigned",
                count: assignedQueries,
                percentage:
                    calculatePercentage(
                        assignedQueries
                    )
            },

            {
                label: "Resolved",
                count: resolvedClaims,
                percentage:
                    calculatePercentage(
                        resolvedClaims
                    )
            }
        ];


        /*
        =====================================================
        DASHBOARD RESPONSE
        =====================================================
        */

        return res.status(200).json({
            message:
                "Admin dashboard fetched successfully",

            stats: {
                totalQueries,
                pendingReview,
                underReview,
                assignedQueries,
                resolvedClaims
            },

            recentQueries:
                formattedRecentQueries,

            statusOverview
        });

    } catch (error) {
        console.error(
            "Get admin dashboard error:",
            error
        );

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


module.exports = {
    getAdmins,
    createSecondaryAdmin,
    promoteToSecondaryAdmin,
    removeSecondaryAdmin,
    getDashboard
};