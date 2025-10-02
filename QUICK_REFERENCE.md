# 🚀 Quick Reference Guide

## Essential Information at a Glance

---

## 🔑 Key Features

| Feature | Status | Location |
|---------|--------|----------|
| Browse Playlists | ✅ Working | `/` (Homepage) |
| Search Songs | ✅ Working | `/search` |
| Play Music | ⚠️ Needs YouTube API Key | Music Player (Bottom) |
| Create Playlists | ✅ Working | `/playlist/create/:id` |
| User Authentication | ⚠️ Incomplete | Backend missing routes |
| Lyrics Display | ✅ Working | Right sidebar |

---

## 🏃 Quick Start

### Prerequisites
```bash
Node.js >= 18.x
npm >= 9.x
MongoDB Atlas account
```

### Installation
```bash
# Clone repository
git clone https://github.com/TheCodrrr/spotify-clone.git
cd spotify-clone

# Install frontend dependencies
cd spotify-clone
npm install

# Install backend dependencies
cd backend
npm install
```

### Environment Setup
```bash
# Create backend/.env
cp backend/.env.example backend/.env

# Add your credentials:
# - MongoDB URI
# - Cloudinary credentials
# - API keys (Spotify, YouTube, Genius)
```

### Run Development Servers
```bash
# Terminal 1 - Frontend (Port 5173)
cd spotify-clone
npm run dev

# Terminal 2 - Backend (Port 5000)
cd backend
npm run dev
```

### Access Application
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## 📂 Project Structure

```
spotify-clone/
├── TECHNICAL_DOCUMENTATION.md    # Comprehensive technical docs
├── SECURITY_ANALYSIS.md          # Security vulnerabilities
├── IMPROVEMENTS.md               # Recommended improvements
├── README.md                     # This file
├── extra.js                      # ⚠️ Contains exposed credentials
├── package.json                  # Root dependencies
│
├── spotify-clone/                # Frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── mainContent/      # Main UI area
│   │   │   │   ├── leftContent/     # Sidebar (20.9%)
│   │   │   │   ├── centreContent/   # Main area (56.3%)
│   │   │   │   └── rightContent/    # Now playing (22.8%)
│   │   │   ├── musicPlayer/      # Bottom player
│   │   │   ├── Navbar.jsx        # Top navigation
│   │   │   └── AuthContext.jsx   # Auth state
│   │   ├── customHooks/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── spotify-clone/backend/        # Backend application
    ├── src/
    │   ├── models/               # Mongoose schemas
    │   │   ├── User.js
    │   │   └── Playlist.js
    │   ├── controllers/          # Route handlers
    │   │   └── PlaylistControllers.js
    │   ├── routes/               # API routes
    │   │   └── playlistRoutes.js
    │   ├── cloudinaryConfig.js
    │   ├── storage.js
    │   └── server.js             # Entry point
    └── package.json
```

---

## 🔗 Important Files

| File | Purpose | Status |
|------|---------|--------|
| `extra.js` | Test/debug file with credentials | ⚠️ Should be deleted |
| `fetchSongDetails.js` | Spotify API integration | ⚠️ Has exposed credentials |
| `youtubeSearch.js` | YouTube search | ⚠️ Missing API key |
| `AuthContext.jsx` | Frontend auth state | ⚠️ References missing backend routes |

---

## 🔌 API Endpoints

### Backend (Port 5000)

#### Health Check
```http
GET /
Response: "🎵 Spotify Playlist API is running!"
```

#### Playlists
```http
GET    /api/playlists              # Get all playlists
GET    /api/playlists/:id          # Get single playlist
POST   /api/playlists              # Create playlist
POST   /api/playlists/song         # Add song to playlist
DELETE /api/playlists/song         # Remove song from playlist
PUT    /api/playlists/info/:id     # Update playlist info
DELETE /api/playlists/playlist/:id # Delete playlist
```

#### Authentication (Not Implemented Yet)
```http
POST /api/auth/register    # ❌ Missing
POST /api/auth/login       # ❌ Missing
GET  /api/auth/status      # ❌ Missing
GET  /api/auth/logout      # ❌ Missing
```

---

## 🎨 Frontend Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | CentreMainContent | Homepage with playlists |
| `/search` | EnlargedBrowseCard | Browse categories |
| `/find/:searchType?/:id` | EnlargedSearchResult | Search results |
| `/song/:id` | EnlargedSong | Song details page |
| `/item/:id` | PublicPlaylist | Public playlist view |
| `/playlist/create/:id` | CreatePlaylist | Create new playlist |
| `/playlist/:name` | EnlargedPlaylistCard | Playlist details |
| `/section` | EnlargedMediumPlaylistCard | Section view |

---

## 🔒 Security Checklist

### ⚠️ Critical Issues (Fix Before Production)

- [ ] Move Spotify credentials to backend `.env`
- [ ] Move YouTube API key to backend `.env`
- [ ] Move Genius token to backend `.env`
- [ ] Delete or secure `extra.js` file
- [ ] Implement backend authentication routes
- [ ] Add JWT authentication to API routes
- [ ] Configure CORS with environment variables
- [ ] Add rate limiting
- [ ] Add input validation
- [ ] Remove all hardcoded credentials from code

**See [SECURITY_ANALYSIS.md](./SECURITY_ANALYSIS.md) for detailed information.**

---

## 🐛 Known Issues

### Critical
1. **YouTube API Key Missing** - Music playback doesn't work
   - Fix: Add YouTube Data API v3 key to backend
   
2. **Exposed API Credentials** - Security vulnerability
   - Fix: Move all credentials to backend `.env`

3. **Authentication Incomplete** - Frontend expects routes that don't exist
   - Fix: Implement missing backend auth routes

### High Priority
4. **No Route Protection** - All API endpoints are public
   - Fix: Add JWT middleware to routes

5. **No Input Validation** - Injection vulnerability risk
   - Fix: Add Joi validation

### Medium Priority
6. **CORS Hardcoded** - Won't work in production
   - Fix: Use environment variables

7. **No Error Boundaries** - App crashes on component errors
   - Fix: Add React error boundaries

**See [TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md) for complete list.**

---

## 🛠️ Common Commands

### Frontend
```bash
cd spotify-clone

npm run dev      # Start dev server (Port 5173)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend
```bash
cd backend

npm run dev      # Start with nodemon (auto-restart)
npm start        # Start production server
```

### Database
```bash
# Connect to MongoDB
mongosh "mongodb+srv://cluster.mongodb.net" --username <user>

# View collections
show collections

# Query playlists
db.playlists.find()

# Query users
db.users.find()
```

---

## 🔧 Troubleshooting

### Issue: "Cannot connect to MongoDB"
**Solution:**
1. Check `MONGO_URI` in `.env`
2. Verify IP whitelist in MongoDB Atlas
3. Check network/firewall settings

### Issue: "YouTube videos won't play"
**Solution:**
1. Add YouTube Data API v3 key to backend `.env`
2. Implement backend proxy endpoint
3. Update frontend to use proxy

### Issue: "Spotify API returns 401"
**Solution:**
1. Refresh token may be expired
2. Regenerate refresh token from Spotify Dashboard
3. Update `.env` with new token

### Issue: "Image upload fails"
**Solution:**
1. Check Cloudinary credentials in `.env`
2. Verify file size < 5MB
3. Ensure file format is JPG/PNG/WEBP

### Issue: "CORS error in browser"
**Solution:**
1. Verify backend is running on port 5000
2. Check frontend dev server is on port 5173
3. Review CORS configuration in `server.js`

---

## 📊 Tech Stack Versions

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI framework |
| Vite | 6.1.1 | Build tool |
| Node.js | Latest LTS | Runtime |
| Express | 4.21.2 | Web framework |
| MongoDB | Latest | Database |
| Mongoose | 8.12.1 | ODM |

---

## 🔗 External Services

### Spotify Web API
- **Dashboard:** https://developer.spotify.com/dashboard
- **Docs:** https://developer.spotify.com/documentation/web-api
- **Required:** Client ID, Client Secret, Refresh Token

### YouTube Data API v3
- **Console:** https://console.cloud.google.com
- **Docs:** https://developers.google.com/youtube/v3
- **Required:** API Key

### Genius API
- **Dashboard:** https://genius.com/api-clients
- **Docs:** https://docs.genius.com
- **Required:** Access Token

### Cloudinary
- **Dashboard:** https://cloudinary.com/console
- **Docs:** https://cloudinary.com/documentation
- **Required:** Cloud Name, API Key, API Secret

### MongoDB Atlas
- **Console:** https://cloud.mongodb.com
- **Docs:** https://docs.mongodb.com
- **Required:** Connection URI

---

## 🎯 Next Steps

### Immediate (Do First)
1. ✅ Review all documentation files
2. ⚠️ Read [SECURITY_ANALYSIS.md](./SECURITY_ANALYSIS.md)
3. ⚠️ Fix critical security issues
4. ✅ Setup environment variables
5. ✅ Test application locally

### Short Term (1-2 Weeks)
1. Implement backend authentication
2. Add YouTube API key
3. Protect API routes
4. Add input validation
5. Test all features

### Medium Term (1 Month)
1. Add comprehensive tests
2. Implement error handling
3. Optimize performance
4. Improve mobile responsiveness
5. Add logging system

### Long Term (3+ Months)
1. Add new features (recommendations, social, etc.)
2. Implement PWA support
3. Add analytics
4. Deploy to production
5. Monitor and maintain

**See [IMPROVEMENTS.md](./IMPROVEMENTS.md) for detailed roadmap.**

---

## 📞 Getting Help

### Documentation
- **Technical Details:** [TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md)
- **Security Issues:** [SECURITY_ANALYSIS.md](./SECURITY_ANALYSIS.md)
- **Improvements:** [IMPROVEMENTS.md](./IMPROVEMENTS.md)

### External Resources
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com)
- [Vite Documentation](https://vitejs.dev)

### Community
- Open an issue on GitHub
- Check existing issues for solutions
- Refer to API documentation for external services

---

## 📋 Pre-Deployment Checklist

Before deploying to production:

### Security
- [ ] All API credentials moved to backend
- [ ] Environment variables configured
- [ ] Authentication implemented
- [ ] Routes protected with JWT
- [ ] Input validation added
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] HTTPS enabled
- [ ] Security headers added

### Functionality
- [ ] All features tested
- [ ] YouTube playback working
- [ ] Playlist CRUD operations working
- [ ] Search functionality working
- [ ] User authentication working
- [ ] Image upload working

### Performance
- [ ] Bundle size optimized
- [ ] Images optimized
- [ ] API responses cached
- [ ] Database queries optimized
- [ ] Loading states implemented

### Quality
- [ ] Tests written and passing
- [ ] Linting errors fixed
- [ ] Code documented
- [ ] Error handling implemented
- [ ] Logs configured

### DevOps
- [ ] CI/CD pipeline setup
- [ ] Monitoring configured
- [ ] Backups automated
- [ ] Domain configured
- [ ] SSL certificate installed

---

## 🎉 Project Status

**Current Version:** 0.0.0 (Development)  
**Status:** 🚧 **In Development - Not Production Ready**  
**Security Rating:** ⚠️ **HIGH RISK**

### Completion Status
- Frontend: ~70% complete
- Backend: ~50% complete
- Authentication: ~20% complete
- Testing: 0% complete
- Documentation: ✅ 100% complete

---

**Last Updated:** 2024  
**Maintainer:** Development Team  
**License:** Not specified

---

## 📝 Quick Notes

> **Remember:** This is a learning project/portfolio piece. Do not deploy to production without addressing all security vulnerabilities!

> **Tip:** Start by reading TECHNICAL_DOCUMENTATION.md for comprehensive understanding, then move to SECURITY_ANALYSIS.md for security concerns.

> **Warning:** The `extra.js` file in the root contains exposed credentials and should be deleted or moved to `.gitignore`.
