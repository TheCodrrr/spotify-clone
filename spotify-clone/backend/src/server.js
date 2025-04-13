import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import playlistRoutes from "./routes/playlistRoutes.js";
import bodyParser from "body-parser";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.json()); // For parsing application/x-www-form-urlencoded
app.use(cors({
  origin: "http://localhost:5173", // frontend origin
  credentials: true
}));

// MongoDB Connection
async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "spotify-management", 
    //   serverSelectionTimeoutMS: 5000,
    //   socketTimeoutMS: 45000,
    });

    console.log("✅ MongoDB Connected Successfully!");
    console.log(`📂 Database Name: ${conn.connection.name}`);
    console.log(`🌍 MongoDB Host: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
}

connectDB();

// Basic check route
app.get("/", (req, res) => {
  res.send("🎵 Spotify Playlist API is running!");
});

// Playlist Routes
app.use("/api/playlists", playlistRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
