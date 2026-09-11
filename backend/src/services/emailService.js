const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    service: "gmail",

    // Reuse SMTP connections for better performance
    pool: true,
    maxConnections: 5,
    maxMessages: 100,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },

    // Prevent SMTP requests from hanging indefinitely
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000
});


const sendVerificationOTP = async (email, otp) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Insurance Claim Solution - Email Verification",
        text: `Your email verification OTP is ${otp}. This OTP is valid for 10 minutes.`
    });
};


const sendPasswordResetOTP = async (email, otp) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Insurance Claim Solution - Password Reset",
        text: `Your password reset OTP is ${otp}. This OTP is valid for 10 minutes.`
    });
};


/*
=========================================================
QUERY SUBMISSION CONFIRMATION
=========================================================
*/

const sendQuerySubmissionConfirmation = async (
    email,
    queryId,
    fullName,
    insuranceType,
    insuranceCompany,
    policyNumber,
    claimNumber,
    claimAmount,
    issueType,
    issueDescription
) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject:
            "Insurance Claim Solution - Query Submitted",

        text:
            `Dear ${fullName},\n\n` +

            `Your insurance claim query has been submitted successfully.\n\n` +

            `Query ID: ${queryId}\n\n` +

            `Submitted Details:\n` +
            `Insurance Type: ${insuranceType}\n` +
            `Insurance Company: ${insuranceCompany}\n` +
            `Policy Number: ${policyNumber}\n` +
            `Claim Number: ${claimNumber}\n` +
            `Claim Amount: ${claimAmount}\n` +
            `Issue Type: ${issueType}\n` +
            `Issue Description: ${issueDescription}\n\n` +

            `Current Status: Query Submitted\n\n` +

            `Please keep your Query ID for future reference.\n` +
            `You can log in to your Insurance Claim Solution account to view your query.\n\n` +

            `Regards,\n` +
            `Insurance Claim Solution`
    });
};


/*
=========================================================
NEW QUERY NOTIFICATION - MAIN ADMIN
=========================================================
*/

const sendNewQueryAdminNotification = async (
    email,
    queryId,
    fullName,
    userEmail,
    phone,
    insuranceType,
    insuranceCompany,
    policyNumber,
    claimNumber,
    claimAmount,
    issueType,
    issueDescription
) => {
    const frontendBaseUrl =
        process.env.FRONTEND_URL ||
        "http://localhost:5173";

    const queryDetailsUrl =
        `${frontendBaseUrl}/admin/queries/${queryId}`;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject:
            "Insurance Claim Solution - New Query Submitted",

        text:
            `A new insurance claim query has been submitted.\n\n` +

            `Query ID: ${queryId}\n\n` +

            `User Details:\n` +
            `Name: ${fullName}\n` +
            `Email: ${userEmail}\n` +
            `Phone: ${phone}\n\n` +

            `Query Details:\n` +
            `Insurance Type: ${insuranceType}\n` +
            `Insurance Company: ${insuranceCompany}\n` +
            `Policy Number: ${policyNumber}\n` +
            `Claim Number: ${claimNumber}\n` +
            `Claim Amount: ${claimAmount}\n` +
            `Issue Type: ${issueType}\n` +
            `Issue Description: ${issueDescription}\n\n` +

            `Current Status: Query Submitted\n\n` +

            `View Query Details:\n` +
            `${queryDetailsUrl}\n\n` +

            `Regards,\n` +
            `Insurance Claim Solution`
    });
};


/*
=========================================================
QUERY UPDATE NOTIFICATION
=========================================================
*/

const sendQueryUpdateNotification = async (
    email,
    queryId,
    status,
    adminNotes
) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject:
            "Insurance Claim Solution - Query Updated",

        text:
            `Your insurance query has been updated.\n\n` +

            `Query ID: ${queryId}\n` +
            `Current Status: ${status}\n` +
            `Admin Notes: ${adminNotes || "No additional notes"}\n\n` +

            `Please log in to your Insurance Claim Solution account to view the latest details.`
    });
};


module.exports = {
    sendVerificationOTP,
    sendPasswordResetOTP,
    sendQuerySubmissionConfirmation,
    sendNewQueryAdminNotification,
    sendQueryUpdateNotification
};