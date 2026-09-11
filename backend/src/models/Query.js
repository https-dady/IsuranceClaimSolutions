const mongoose = require("mongoose");

const querySchema = new mongoose.Schema(
    {
        queryId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        personalDetails: {
            fullName: {
                type: String,
                required: true,
                trim: true
            },

            email: {
                type: String,
                required: true,
                lowercase: true,
                trim: true
            },

            phone: {
                type: String,
                required: true,
                trim: true
            }
        },

        address: {
            addressLine1: {
                type: String,
                required: true,
                trim: true
            },

            addressLine2: {
                type: String,
                trim: true
            },

            landmark: {
                type: String,
                trim: true
            },

            city: {
                type: String,
                required: true,
                trim: true
            },

            state: {
                type: String,
                required: true,
                trim: true
            },

            pincode: {
                type: String,
                required: true,
                trim: true
            }
        },

        insuranceDetails: {
            insuranceType: {
                type: String,
                enum: [
                    "Health",
                    "Motor",
                    "Life",
                    "Property",
                    "Travel",
                    "Other"
                ],
                required: true
            },

            insuranceCompany: {
                type: String,
                required: true,
                trim: true
            },

            policyNumber: {
                type: String,
                required: true,
                trim: true
            }
        },

        claimDetails: {
            claimNumber: {
                type: String,
                required: true,
                trim: true
            },

            claimAmount: {
                type: Number,
                required: true
            },

            issueType: {
                type: String,
                enum: [
                    "Claim Rejected",
                    "Claim Delayed",
                    "Claim Under-Settled",
                    "No Response from Insurance Company",
                    "Other Issue"
                ],
                required: true
            },

            issueDate: {
                type: Date,
                required: true
            }
        },

        queryDetails: {
            issueDescription: {
                type: String,
                required: true,
                trim: true
            },

            additionalDetails: {
                type: String,
                trim: true
            }
        },

        status: {
            type: String,
            enum: [
                "Query Submitted",
                "Under Initial Review",
                "Document Review",
                "Claim Processing",
                "Resolution"
            ],
            default: "Query Submitted"
        },

        assignedAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        adminNotes: {
            type: String,
            trim: true
        },

        timeline: [
            {
                status: {
                    type: String,
                    enum: [
                        "Query Submitted",
                        "Under Initial Review",
                        "Document Review",
                        "Claim Processing",
                        "Resolution"
                    ],
                    required: true
                },

                note: {
                    type: String,
                    trim: true
                },

                updatedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },

                updatedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Query", querySchema);