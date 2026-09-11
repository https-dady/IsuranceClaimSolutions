require("dotenv").config();

const bcrypt = require("bcryptjs");

const connectDB = require("../src/config/db");
const User = require("../src/models/User");

const createMainAdmin = async () => {
    try {
        await connectDB();

        const name = process.env.MAIN_ADMIN_NAME;
        const email = process.env.MAIN_ADMIN_EMAIL;
        const password = process.env.MAIN_ADMIN_PASSWORD;

        if (!name || !email || !password) {
            throw new Error(
                "Main Admin environment variables are missing"
            );
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingMainAdmin = await User.findOne({
            role: "main_admin"
        });

        if (existingMainAdmin) {
            console.log("Main Admin already exists.");
            await User.db.close();
            process.exit(0);
        }

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            console.log(
                "A user with this email already exists."
            );
            await User.db.close();
            process.exit(1);
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        await User.create({
            name: name.trim(),
            email: normalizedEmail,
            phone: "0000000000",
            password: hashedPassword,
            emailVerified: true,
            type: "admin",
            role: "main_admin"
        });

        console.log(
            "Main Admin created successfully."
        );

        console.log(
            `Email: ${normalizedEmail}`
        );

        await User.db.close();

        process.exit(0);

    } catch (error) {
        console.error(
            "Main Admin creation failed:",
            error.message
        );

        process.exit(1);
    }
};

createMainAdmin();