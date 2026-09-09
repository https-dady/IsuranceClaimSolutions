const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const {
    sendVerificationOTP,
    sendPasswordResetOTP
} = require("../services/emailService");


const signup = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            password,
            confirmPassword
        } = req.body;

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

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        const otpExpires = new Date(
            Date.now() + 10 * 60 * 1000
        );

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            phone: phone.trim(),
            password: hashedPassword,
            emailVerified: false,
            emailVerificationOTP: otp,
            emailVerificationOTPExpires: otpExpires,
            type: "user",
            role: "user"
        });

        await sendVerificationOTP(user.email, otp);

        return res.status(201).json({
            message:
                "Signup successful. Verification OTP sent to email.",
            userId: user._id,
            email: user.email
        });

    } catch (error) {
        console.error("Signup error:", error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.emailVerified) {
            return res.status(400).json({
                message: "Email is already verified"
            });
        }

        if (
            !user.emailVerificationOTP ||
            !user.emailVerificationOTPExpires
        ) {
            return res.status(400).json({
                message: "Verification OTP not found"
            });
        }

        if (new Date() > user.emailVerificationOTPExpires) {
            return res.status(400).json({
                message: "Verification OTP has expired"
            });
        }

        if (user.emailVerificationOTP !== otp.toString()) {
            return res.status(400).json({
                message: "Invalid verification OTP"
            });
        }

        user.emailVerified = true;
        user.emailVerificationOTP = undefined;
        user.emailVerificationOTPExpires = undefined;

        await user.save();

        return res.status(200).json({
            message: "Email verified successfully"
        });

    } catch (error) {
        console.error("Verify email error:", error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


const resendVerificationOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.emailVerified) {
            return res.status(400).json({
                message: "Email is already verified"
            });
        }

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        const otpExpires = new Date(
            Date.now() + 10 * 60 * 1000
        );

        user.emailVerificationOTP = otp;
        user.emailVerificationOTPExpires = otpExpires;

        await user.save();

        await sendVerificationOTP(user.email, otp);

        return res.status(200).json({
            message: "New verification OTP sent to email."
        });

    } catch (error) {
        console.error(
            "Resend verification OTP error:",
            error
        );

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        if (!user.emailVerified) {
            return res.status(403).json({
                message: "Please verify your email before login"
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                type: user.type,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn:
                    process.env.JWT_EXPIRES_IN || "1d"
            }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                emailVerified: user.emailVerified,
                type: user.type,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (!user.emailVerified) {
            return res.status(403).json({
                message:
                    "Please verify your email before resetting password"
            });
        }

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        const otpExpires = new Date(
            Date.now() + 10 * 60 * 1000
        );

        user.passwordResetOTP = otp;
        user.passwordResetOTPExpires = otpExpires;

        await user.save();

        await sendPasswordResetOTP(user.email, otp);

        return res.status(200).json({
            message: "Password reset OTP sent to email."
        });

    } catch (error) {
        console.error("Forgot password error:", error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


const verifyResetOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (
            !user.passwordResetOTP ||
            !user.passwordResetOTPExpires
        ) {
            return res.status(400).json({
                message: "Password reset OTP not found"
            });
        }

        if (new Date() > user.passwordResetOTPExpires) {
            return res.status(400).json({
                message: "Password reset OTP has expired"
            });
        }

        if (user.passwordResetOTP !== otp.toString()) {
            return res.status(400).json({
                message: "Invalid password reset OTP"
            });
        }

        return res.status(200).json({
            message:
                "Password reset OTP verified successfully"
        });

    } catch (error) {
        console.error(
            "Verify reset OTP error:",
            error
        );

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


const resetPassword = async (req, res) => {
    try {
        const {
            email,
            otp,
            newPassword,
            confirmPassword
        } = req.body;

        if (
            !email ||
            !otp ||
            !newPassword ||
            !confirmPassword
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message:
                    "Password must be at least 6 characters long"
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (
            !user.passwordResetOTP ||
            !user.passwordResetOTPExpires
        ) {
            return res.status(400).json({
                message: "Password reset OTP not found"
            });
        }

        if (new Date() > user.passwordResetOTPExpires) {
            return res.status(400).json({
                message: "Password reset OTP has expired"
            });
        }

        if (user.passwordResetOTP !== otp.toString()) {
            return res.status(400).json({
                message: "Invalid password reset OTP"
            });
        }

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        user.password = hashedPassword;
        user.passwordResetOTP = undefined;
        user.passwordResetOTPExpires = undefined;

        await user.save();

        return res.status(200).json({
            message: "Password reset successfully"
        });

    } catch (error) {
        console.error(
            "Reset password error:",
            error
        );

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


module.exports = {
    signup,
    verifyEmail,
    resendVerificationOTP,
    login,
    forgotPassword,
    verifyResetOTP,
    resetPassword
};