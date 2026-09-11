const User = require("../models/User");

const getUsers = async (req, res) => {
    try {
        const users = await User.find({})
            .select("-password -emailVerificationOTP -emailVerificationOTPExpires -passwordResetOTP -passwordResetOTPExpires")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Users fetched successfully",
            users
        });
    } catch (error) {
        console.error("Get users error:", error);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};

module.exports = {
    getUsers
};