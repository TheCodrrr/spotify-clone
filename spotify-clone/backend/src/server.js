// server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import axios from "axios";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware to parse JSON requests and handle CORS
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true
}));

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET || "spotify-clone-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// User model schema
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

// Passport serialization
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

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Find or create user
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

// Authentication routes
app.get("/api/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));

app.get("/api/auth/google/callback", 
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        // Redirect to Spotify auth
        res.redirect("/api/auth/spotify");
    }
);

// Spotify authorization routes
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
        // Exchange code for tokens
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
        
        // Calculate expiration time
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + expires_in);
        
        // Store tokens in user document
        req.user.spotifyTokens = {
            accessToken: access_token,
            refreshToken: refresh_token,
            expiresAt
        };
        
        await req.user.save();
        
        // Redirect to frontend
        res.redirect(`${process.env.CLIENT_URL}`);
    } catch (error) {
        console.error("Error exchanging Spotify code for tokens:", error);
        res.redirect(`${process.env.CLIENT_URL}/login?error=spotify_auth_failed`);
    }
});

// Check if user is authenticated
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

// Endpoint to get Spotify credentials
app.get("/api/spotify/credentials", async (req, res) => {
    if (!req.user || !req.user.spotifyTokens) {
        return res.status(401).json({ error: "User not authenticated with Spotify" });
    }
    
    // Check if token is expired and refresh if needed
    const now = new Date();
    if (now >= req.user.spotifyTokens.expiresAt) {
        try {
            const refreshResponse = await axios({
                method: "post",
                url: "https://accounts.spotify.com/api/token",
                params: {
                    grant_type: "refresh_token",
                    refresh_token: req.user.spotifyTokens.refreshToken
                },
                headers: {
                    "Authorization": `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64")}`
                }
            });
            
            const { access_token, expires_in } = refreshResponse.data;
            
            // Update token in database
            const expiresAt = new Date();
            expiresAt.setSeconds(expiresAt.getSeconds() + expires_in);
            
            req.user.spotifyTokens.accessToken = access_token;
            req.user.spotifyTokens.expiresAt = expiresAt;
            
            await req.user.save();
        } catch (error) {
            console.error("Error refreshing token:", error);
            return res.status(500).json({ error: "Failed to refresh token" });
        }
    }
    
    // Return the credentials
    res.json({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        accessToken: req.user.spotifyTokens.accessToken
    });
});

// Proxy for Spotify API requests
app.get("/api/spotify/proxy/*", async (req, res) => {
    if (!req.user || !req.user.spotifyTokens) {
        return res.status(401).json({ error: "User not authenticated with Spotify" });
    }
    
    const endpoint = req.params[0];
    
    try {
        const response = await axios({
            method: "get",
            url: `https://api.spotify.com/v1/${endpoint}`,
            headers: {
                "Authorization": `Bearer ${req.user.spotifyTokens.accessToken}`
            }
        });
        
        res.json(response.data);
    } catch (error) {
        console.error("Error proxying Spotify API request:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { error: "API request failed" });
    }
});

// Logout route
app.get("/api/auth/logout", (req, res) => {
    req.logout(() => {
        res.redirect(`${process.env.CLIENT_URL}`);
    });
});

// Async function to connect to MongoDB
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

// Connect to the database
connectDB();

// A simple route to test the API
app.get("/", (req, res) => {
    res.send("Spotify Management API is running!");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});