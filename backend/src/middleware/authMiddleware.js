const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Authorization token is required"
            });
        }

        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Invalid authorization format"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();
    } catch (error) {
        console.error(
            "Authentication middleware error:",
            error.message
        );

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};


const requireMainAdmin = (req, res, next) => {
    if (
        !req.user ||
        req.user.type !== "admin" ||
        req.user.role !== "main_admin"
    ) {
        return res.status(403).json({
            message: "Main Admin access required"
        });
    }

    next();
};


const requireAdmin = (req, res, next) => {
    if (
        !req.user ||
        req.user.type !== "admin"
    ) {
        return res.status(403).json({
            message: "Admin access required"
        });
    }

    next();
};


module.exports = {
    protect,
    requireMainAdmin,
    requireAdmin
};