const User = require("../models/User");
const Query = require("../models/Query");


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


        const formattedRecentQueries = recentQueries.map(
            (query) => ({
                id: query.queryId,

                user: query.user
                    ? query.user.name
                    : "Unknown User",

                email: query.user
                    ? query.user.email
                    : "",

                type:
                    query.insuranceDetails?.insuranceType ||
                    "",

                amount:
                    query.claimDetails?.claimAmount ?? 0,

                status: query.status,

                assignedTo: query.assignedAdmin
                    ? query.assignedAdmin.name
                    : null,

                priority: query.priority || null,

                date: query.createdAt
            })
        );


        /*
        =====================================================
        STATUS OVERVIEW
        =====================================================

        These are the same dashboard concepts used by
        the existing frontend.

        Percentages are calculated from total queries.
        =====================================================
        */

        const calculatePercentage = (count) => {
            if (totalQueries === 0) {
                return 0;
            }

            return Number(
                ((count / totalQueries) * 100).toFixed(1)
            );
        };


        const statusOverview = [
            {
                label: "Pending Review",
                count: pendingReview,
                percentage:
                    calculatePercentage(pendingReview)
            },
            {
                label: "Under Review",
                count: underReview,
                percentage:
                    calculatePercentage(underReview)
            },
            {
                label: "Assigned",
                count: assignedQueries,
                percentage:
                    calculatePercentage(assignedQueries)
            },
            {
                label: "Resolved",
                count: resolvedClaims,
                percentage:
                    calculatePercentage(resolvedClaims)
            }
        ];


        /*
        =====================================================
        DASHBOARD RESPONSE
        =====================================================
        */

        return res.status(200).json({
            message: "Admin dashboard fetched successfully",

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
    promoteToSecondaryAdmin,
    removeSecondaryAdmin,
    getDashboard
};