import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import axios from "axios";
import ytdl from "ytdl-core";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

app.use(session({
    secret: process.env.SESSION_SECRET || "spotify-clone-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(passport.initialize());
app.use(passport.session());

const userSchema = new mongoose.Schema({
    googleId: String,
    email: String,
    name: String,
    picture: String,
    spotifyTokens: {
        accessToken: String,
        refreshToken: String,
        expiresAt: Date
    }
});

const User = mongoose.model("User", userSchema);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            user = new User({
                googleId: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName,
                picture: profile.photos[0].value
            });
            await user.save();
        }

        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

app.get("/api/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));

app.get("/api/auth/google/callback", 
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        res.redirect("/api/auth/spotify");
    }
);

app.get("/api/auth/spotify", (req, res) => {
    if (!req.user) {
        return res.redirect("/login");
    }

    const scope = "user-read-private user-read-email user-read-playback-state user-modify-playback-state user-read-currently-playing user-library-read user-library-modify playlist-read-private playlist-modify-private";
    const redirectUri = encodeURIComponent(`${process.env.SERVER_URL}/api/auth/spotify/callback`);

    res.redirect(`https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`);
});

app.get("/api/auth/spotify/callback", async (req, res) => {
    const code = req.query.code;

    if (!req.user) {
        return res.redirect("/login");
    }

    try {
        const tokenResponse = await axios({
            method: "post",
            url: "https://accounts.spotify.com/api/token",
            params: {
                grant_type: "authorization_code",
                code,
                redirect_uri: `${process.env.SERVER_URL}/api/auth/spotify/callback`
            },
            headers: {
                "Authorization": `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64")}`
            }
        });

        const { access_token, refresh_token, expires_in } = tokenResponse.data;

        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + expires_in);

        req.user.spotifyTokens = {
            accessToken: access_token,
            refreshToken: refresh_token,
            expiresAt
        };

        await req.user.save();

        res.redirect(`${process.env.CLIENT_URL}`);
    } catch (error) {
        console.error("Error exchanging Spotify code for tokens:", error);
        res.redirect(`${process.env.CLIENT_URL}/login?error=spotify_auth_failed`);
    }
});

// Improved YouTube search with multiple details
app.get("/api/youtube/search", async (req, res) => {
    const { songName, artist, album, releaseYear } = req.query;

    if (!songName) {
        return res.status(400).json({ error: "Song name is required" });
    }

    // Build search query with available details
    let searchQuery = `${songName}`;
    if (artist) searchQuery += ` by ${artist}`;
    if (album) searchQuery += ` from album ${album}`;
    if (releaseYear) searchQuery += ` ${releaseYear}`;
    searchQuery += " official music video";

    try {
        const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
            params: {
                q: searchQuery,
                part: "snippet",
                maxResults: 5,
                key: YOUTUBE_API_KEY,
                type: "video",
                videoCategoryId: 10, // Category 10 is for music videos
                videoDuration: "short" // Avoid lengthy podcasts or unrelated content
            }
        });

        if (response.data.items.length > 0) {
            const videoId = response.data.items[0].id.videoId;
            res.json({ videoId, url: `https://www.youtube.com/watch?v=${videoId}` });
        } else {
            res.status(404).json({ error: "No matching videos found" });
        }
    } catch (error) {
        console.error("Error fetching YouTube video:", error);
        res.status(500).json({ error: "Failed to fetch video" });
    }
});

app.get("/api/auth/status", (req, res) => {
    if (req.user) {
        res.json({
            authenticated: true,
            user: {
                name: req.user.name,
                email: req.user.email,
                picture: req.user.picture
            }
        });
    } else {
        res.json({ authenticated: false });
    }
});

async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName: "spotify-management",
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
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

app.get("/", (req, res) => {
    res.send("Spotify Management API is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
