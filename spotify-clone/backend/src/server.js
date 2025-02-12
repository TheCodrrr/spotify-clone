// server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

// Load environment variables from .env file
dotenv.config();

const app = express();


// Middleware to parse JSON requests and handle CORS
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000", // ✅ Replace with frontend URL
    credentials: true
}));

const PORT = process.env.PORT || 5000;

// Async function to connect to MongoDB
async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "spotify-management", // Use the specific database
      // authSource: "admin", // Uncomment if needed (usually not required with Atlas)
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000, // Keep sockets open for 45 seconds
    });

    console.log("✅ MongoDB Connected Successfully!");
    console.log(`📂 Database Name: ${conn.connection.name}`);
    console.log(`🌍 MongoDB Host: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1); // Exit the process if connection fails
  }
}

// Connect to the database
connectDB();

// A simple route to test the API
app.get("/", (req, res) => {
  res.send("Spotify Management API is running!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
