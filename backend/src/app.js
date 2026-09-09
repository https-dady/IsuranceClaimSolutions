const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Auth Routes
app.use("/api/auth", authRoutes);

// Health Check
app.get("/", (req, res) => {
    res.json({
        message: "Insurance Claim Solution Backend Running"
    });
});

module.exports = app;