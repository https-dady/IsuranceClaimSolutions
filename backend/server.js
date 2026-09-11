const dotenv = require("dotenv");

dotenv.config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

const cloudinaryTestRoutes = require("./src/routes/cloudinaryTestRoutes");

const documentRoutes = require("./src/routes/documentRoutes");

const adminDocumentRoutes = require("./src/routes/adminDocumentRoutes");

const profileRoutes = require("./src/routes/profileRoutes");


connectDB();


const PORT = process.env.PORT || 5000;


app.use(
    "/api/cloudinary-test",
    cloudinaryTestRoutes
);

app.use(
    "/api/documents",
    documentRoutes
);

app.use(
    "/api/documents/admin",
    adminDocumentRoutes
);

app.use(
    "/api/profile",
    profileRoutes
);


app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});