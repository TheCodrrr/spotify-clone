import express from "express";
import { YouTubePlayer } from "../controllers/YoutubeControllers.js";

const router = express.Router();

// Search for YouTube video by query
router.post("/search", YouTubePlayer);

export default router;