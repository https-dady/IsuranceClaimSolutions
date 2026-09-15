const https = require("https");


/*
=========================================================
BREVO EMAIL CONFIGURATION
=========================================================
*/

const BREVO_API_HOST = "api.brevo.com";
const BREVO_API_PATH = "/v3/smtp/email";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_EMAIL = process.env.BREVO_EMAIL;
const BREVO_SENDER_NAME =
    process.env.BREVO_SENDER_NAME || "Insurance Claim Solution";


/*
=========================================================
SEND EMAIL THROUGH BREVO
=========================================================
*/

const sendBrevoEmail = ({
    to,
    toName,
    subject,
    textContent
}) => {
    return new Promise((resolve, reject) => {
        if (!BREVO_API_KEY) {
            return reject(
                new Error("BREVO_API_KEY is not configured.")
            );
        }

        if (!BREVO_EMAIL) {
            return reject(
                new Error("BREVO_EMAIL is not configured.")
            );
        }

        const payload = JSON.stringify({
            sender: {
                name: BREVO_SENDER_NAME,
                email: BREVO_EMAIL
            },

            to: [
                {
                    email: to,
                    ...(toName ? { name: toName } : {})
                }
            ],

            subject,
            textContent
        });

        const request = https.request(
            {
                hostname: BREVO_API_HOST,
                path: BREVO_API_PATH,
                method: "POST",

                headers: {
                    accept: "application/json",
                    "api-key": BREVO_API_KEY,
                    "content-type": "application/json",
                    "content-length": Buffer.byteLength(payload)
                },

                timeout: 15000
            },

            (response) => {
                let responseData = "";

                response.on("data", (chunk) => {
                    responseData += chunk;
                });

                response.on("end", () => {
                    if (
                        response.statusCode >= 200 &&
                        response.statusCode < 300
                    ) {
                        resolve(responseData);
                        return;
                    }

                    reject(
                        new Error(
                            `Brevo email failed with status ${response.statusCode}: ${responseData}`
                        )
                    );
                });
            }
        );

        request.on("timeout", () => {
            request.destroy(
                new Error("Brevo email request timed out.")
            );
        });

        request.on("error", (error) => {
            reject(error);
        });

        request.write(payload);
        request.end();
    });
};


/*
=========================================================
EMAIL VERIFICATION OTP
=========================================================
*/

const sendVerificationOTP = async (
    email,
    otp
) => {
    const recipientName = email.split("@")[0];

    await sendBrevoEmail({
        to: email,
        toName: recipientName,

        subject:
            "Insurance Claim Solution - Email Verification",

        textContent:
            `Hello ${recipientName},\n\n` +
            `Welcome to Insurance Claim Solution.\n\n` +
            `Your email verification OTP is: ${otp}\n\n` +
            `This OTP is valid for 10 minutes. Please do not share this OTP with anyone.\n\n` +
            `If you did not request this verification, please ignore this email.\n\n` +
            `Regards,\n` +
            `Insurance Claim Solution`
    });
};


/*
=========================================================
PASSWORD RESET OTP
=========================================================
*/

const sendPasswordResetOTP = async (
    email,
    otp
) => {
    const recipientName = email.split("@")[0];

    await sendBrevoEmail({
        to: email,
        toName: recipientName,

        subject:
            "Insurance Claim Solution - Password Reset",

        textContent:
            `Hello ${recipientName},\n\n` +
            `We received a request to reset the password for your Insurance Claim Solution account.\n\n` +
            `Your password reset OTP is: ${otp}\n\n` +
            `This OTP is valid for 10 minutes. Please do not share this OTP with anyone.\n\n` +
            `If you did not request a password reset, please ignore this email. Your password will remain unchanged.\n\n` +
            `Regards,\n` +
            `Insurance Claim Solution`
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
    await sendBrevoEmail({
        to: email,
        toName: fullName,

        subject:
            "Insurance Claim Solution - Query Submitted",

        textContent:
            `Hello ${fullName},\n\n` +
            `Your insurance claim query has been submitted successfully to Insurance Claim Solution.\n\n` +
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
            `Our team will review your query and keep you informed about further updates.\n\n` +
            `Please keep your Query ID (${queryId}) for future reference.\n\n` +
            `You can log in to your Insurance Claim Solution account to view your query and its latest status.\n\n` +
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

    await sendBrevoEmail({
        to: email,

        subject:
            "Insurance Claim Solution - New Query Submitted",

        textContent:
            `Hello Admin,\n\n` +
            `A new insurance claim query has been submitted through Insurance Claim Solution and requires review.\n\n` +
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
    const recipientName = email.split("@")[0];

    await sendBrevoEmail({
        to: email,
        toName: recipientName,

        subject:
            "Insurance Claim Solution - Query Updated",

        textContent:
            `Hello ${recipientName},\n\n` +
            `There has been an update to your insurance claim query.\n\n` +
            `Query ID: ${queryId}\n` +
            `Current Status: ${status}\n\n` +
            `Admin Notes:\n` +
            `${adminNotes || "No additional notes"}\n\n` +
            `Please log in to your Insurance Claim Solution account to view the latest details of your query.\n\n` +
            `Regards,\n` +
            `Insurance Claim Solution`
    });
};


/*
=========================================================
EXPORTS
=========================================================
*/

module.exports = {
    sendVerificationOTP,
    sendPasswordResetOTP,
    sendQuerySubmissionConfirmation,
    sendNewQueryAdminNotification,
    sendQueryUpdateNotification
};