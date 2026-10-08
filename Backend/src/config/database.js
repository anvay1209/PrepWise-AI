const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");

dotenv.config();

dns.setDefaultResultOrder("ipv4first");
async function connectToDB() {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!uri) {
        console.error("MongoDB connection string is missing. Set MONGODB_URI or MONGO_URI in your .env file.");
        process.exit(1);
    }

    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 15000,
        });

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

module.exports = connectToDB;