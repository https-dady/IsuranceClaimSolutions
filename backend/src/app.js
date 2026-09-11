const express = require("express");

const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

const userRoutes = require("./routes/userRoutes");

const adminRoutes = require("./routes/adminRoutes");

const queryRoutes = require("./routes/queryRoutes");

const documentRoutes = require("./routes/documentRoutes");

const feedbackRoutes = require("./routes/feedbackRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/admins", adminRoutes);

app.use("/api/queries", queryRoutes);

app.use("/api/documents", documentRoutes);

app.use("/api/feedback", feedbackRoutes);

app.get("/", (req, res) => {

    res.json({

        message: "Insurance Claim Solution Backend Running"

    });

});

module.exports = app;