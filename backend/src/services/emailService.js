const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
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


module.exports = {
    sendVerificationOTP,
    sendPasswordResetOTP
};