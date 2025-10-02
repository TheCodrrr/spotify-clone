# 🎵 Spotify Clone 🎵

A full-stack music streaming web application inspired by Spotify. Browse playlists, stream songs via YouTube, and enjoy a seamless, stylish UI — all built using the MERN stack and Spotify's public API.

---

## 📚 Documentation

This project includes comprehensive technical documentation:

- **[📖 Technical Documentation](./TECHNICAL_DOCUMENTATION.md)** - Complete technical overview, architecture, and API documentation
- **[🔒 Security Analysis](./SECURITY_ANALYSIS.md)** - Security vulnerabilities and remediation steps
- **[🚀 Improvements Guide](./IMPROVEMENTS.md)** - Recommended improvements and best practices

> **⚠️ Important:** Please review the [Security Analysis](./SECURITY_ANALYSIS.md) before deploying to production. The application contains critical security vulnerabilities that must be addressed.

---

## 🚀 Features

- 🎧 Browse curated playlists from a specific Spotify account
- 🔍 Search and play songs by fetching details from YouTube
- 🌐 URL-based routing like `/playlist/playlist_name`
- 📦 Efficient data fetching with caching
- 🔄 Global playback state management using React Context
- 📱 Fully responsive and beautifully animated UI

---

## 🛠️ Tech Stack

### 🖥️ Frontend
- **React** (18.3.1) - UI library
- **Vite** (6.1.1) - Build tool and dev server
- **React Router DOM** (6.27.0) - Client-side routing
- **Axios** (1.8.4) - HTTP client
- **React Player** (2.16.0) - YouTube playback

### 🔗 Backend
- **Node.js** + **Express.js** (4.21.2) - Server framework
- **MongoDB** + **Mongoose** (8.12.1) - Database
- **Cloudinary** (1.41.3) - Image hosting
- **Passport** (0.7.0) - Authentication middleware
- **JWT** (9.0.2) - Token-based authentication

### 🌐 External APIs
- **Spotify Web API** - Music metadata and playlists
- **YouTube Data API v3** - Song playback
- **Genius API** - Song lyrics

### 🧠 State Management
- **React Context API** - Global state management

### 🗂️ Database
- **MongoDB Atlas (Cloud)** - NoSQL database
