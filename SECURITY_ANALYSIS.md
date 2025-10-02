# 🔒 Security Analysis & Vulnerability Report

## Executive Summary

This document provides a comprehensive security analysis of the Spotify Clone application. Multiple critical vulnerabilities have been identified that require immediate attention before deploying to production.

**Overall Security Rating:** ⚠️ **HIGH RISK**

---

## 🚨 Critical Vulnerabilities

### 1. Exposed API Credentials in Frontend Code

**Severity:** 🔴 **CRITICAL**  
**CVSS Score:** 9.1 (Critical)

#### Affected Files
1. `/spotify-clone/src/components/mainContent/fetchSongDetails.js`
2. `/extra.js`
3. `/spotify-clone/src/components/youtubeSearch.js`
4. `/spotify-clone/src/components/mainContent/centreContent/category_details.js`

#### Exposed Credentials

```javascript
// Spotify API Credentials
client_id: 'fa99f1012dea4fa292a3b9a593e5fd19'
client_secret: '909967f80ec44c33b1738a2e09edbe5d'
refresh_token: 'AQDJClGX6vWk1SX2hRWG4zM9wzYu275O2v1QWZU8noz9ZdU6HaBjogRdbkrOXZjK09d1mj8bSzCy9MxSwRjsJB26sQpYLjyXmUonHXrcmj1RA9xmadMnN3zx2hido4qVUrA'

// Genius API Credentials
GENIUS_ACCESS_TOKEN: 'C2iYY-_2fgk9N7ceEYWHIbaGODy-9lXmMfa33lFmefytcaFRChuB3EmiAAE5YBqO'

// YouTube API (Empty but exposed)
API_KEY: ''
```

#### Attack Vectors

1. **Source Code Inspection**
   - Anyone can view credentials in browser DevTools
   - Credentials visible in production bundle
   - No obfuscation or protection

2. **API Quota Exhaustion**
   - Attackers can use your Spotify credentials
   - Exhaust daily API quotas
   - Cause service disruption

3. **Account Takeover**
   - Refresh token can be used to access Spotify account
   - Unauthorized modifications to playlists
   - Access to private user data

4. **Token Replay Attacks**
   - Stolen tokens can be reused indefinitely
   - No token rotation implemented
   - No expiration handling

#### Impact Assessment

**Business Impact:**
- 🔴 Service disruption due to API quota exhaustion
- 🔴 Unauthorized access to Spotify account
- 🔴 Potential account suspension by Spotify
- 🔴 Data breach (user listening history)
- 🔴 Reputation damage

**Technical Impact:**
- 🔴 API key revocation required
- 🔴 Complete credential rotation needed
- 🔴 Application downtime during migration
- 🔴 Potential data loss

#### Remediation Steps

**Immediate Actions (Within 24 Hours):**
```bash
# 1. Revoke all exposed credentials
# - Go to Spotify Developer Dashboard
# - Revoke current refresh token
# - Generate new client secret

# 2. Revoke Genius API token
# - Log into Genius API dashboard
# - Revoke exposed token
# - Generate new token

# 3. Remove credentials from code
git rm --cached spotify-clone/src/components/mainContent/fetchSongDetails.js
git rm --cached extra.js
# Edit files to remove credentials
git commit -m "Remove exposed credentials"
git push
```

**Short-term Fix (1 Week):**

1. **Create Backend Proxy Endpoints**

```javascript
// backend/src/routes/spotifyProxy.js
import express from 'express';
const router = express.Router();

// Proxy endpoint for Spotify API
router.get('/spotify/track/:id', async (req, res) => {
  const accessToken = await getAccessToken(); // Server-side only
  const response = await fetch(
    `https://api.spotify.com/v1/tracks/${req.params.id}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` }
    }
  );
  const data = await response.json();
  res.json(data);
});

export default router;
```

2. **Update Frontend to Use Proxy**

```javascript
// frontend/src/services/spotify.js
const fetchSongDetails = async (songId) => {
  const response = await axios.get(
    `http://localhost:5000/api/spotify/track/${songId}`
  );
  return response.data;
};
```

3. **Store Credentials in Environment Variables**

```bash
# backend/.env
SPOTIFY_CLIENT_ID=your_new_client_id
SPOTIFY_CLIENT_SECRET=your_new_client_secret
SPOTIFY_REFRESH_TOKEN=your_new_refresh_token
GENIUS_ACCESS_TOKEN=your_new_genius_token
YOUTUBE_API_KEY=your_youtube_api_key
```

**Long-term Solution:**
- Implement OAuth 2.0 authorization code flow
- Let users authenticate with their own Spotify accounts
- Store user tokens securely in database
- Implement token refresh mechanism
- Add token encryption at rest

---

### 2. Missing Authentication on API Endpoints

**Severity:** 🔴 **HIGH**  
**CVSS Score:** 8.2 (High)

#### Issue Description

All backend API endpoints are completely public and unprotected:

```javascript
// Anyone can access these without authentication
POST   /api/playlists              // Create playlists
GET    /api/playlists              // View all playlists
DELETE /api/playlists/playlist/:id // Delete any playlist
POST   /api/playlists/song         // Add songs to any playlist
DELETE /api/playlists/song         // Remove songs from any playlist
```

#### Attack Scenarios

1. **Unauthorized Data Access**
   - Anyone can view all playlists
   - No user ownership validation
   - Privacy violation

2. **Data Manipulation**
   - Malicious users can delete any playlist
   - Add inappropriate content to playlists
   - Corrupt database data

3. **Resource Exhaustion**
   - Create thousands of fake playlists
   - Exhaust database storage
   - DDoS attack vector

4. **No Rate Limiting**
   - Unlimited requests allowed
   - API abuse possible
   - Server overload risk

#### Remediation

**1. Implement JWT Authentication Middleware**

```javascript
// backend/src/middleware/auth.js
import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};
```

**2. Protect Routes**

```javascript
// backend/src/routes/playlistRoutes.js
import { authenticate } from '../middleware/auth.js';

router.post('/', authenticate, createPlaylist);
router.get('/', authenticate, getPlaylists);
router.delete('/playlist/:id', authenticate, deletePlaylist);
```

**3. Add Ownership Validation**

```javascript
// backend/src/controllers/PlaylistControllers.js
export const deletePlaylist = async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);
  
  // Verify ownership
  if (playlist.userId.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Access denied' });
  }
  
  await playlist.remove();
  res.json({ message: 'Playlist deleted' });
};
```

**4. Implement Rate Limiting**

```javascript
// backend/src/middleware/rateLimit.js
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});

// Apply to all routes
app.use('/api/', apiLimiter);
```

---

### 3. Incomplete Authentication System

**Severity:** 🔴 **HIGH**  
**CVSS Score:** 7.8 (High)

#### Issues Identified

1. **Frontend Expects Routes That Don't Exist**

```javascript
// AuthContext.jsx references these:
GET  /api/auth/status        // ❌ Not implemented
GET  /api/auth/logout        // ❌ Not implemented
GET  /api/spotify/credentials // ❌ Not implemented
```

2. **User Model Exists But No Auth Routes**
   - User schema has password field
   - No registration endpoint
   - No login endpoint
   - No password hashing verification

3. **Passport.js Installed But Not Configured**
   - `passport` and `passport-google-oauth20` in dependencies
   - No configuration files
   - No Google OAuth strategy setup

#### Remediation

**1. Implement Missing Auth Routes**

```javascript
// backend/src/routes/authRoutes.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });
    
    await user.save();
    
    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({ token, user: { id: user._id, name, email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ token, user: { id: user._id, name: user.name, email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Auth status
router.get('/status', authenticate, (req, res) => {
  res.json({ authenticated: true, user: req.user });
});

// Logout (if using sessions)
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out' });
});

export default router;
```

**2. Configure Google OAuth**

```javascript
// backend/src/config/passport.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        let user = await User.findOne({ email: profile.emails[0].value });
        
        if (!user) {
          // Create new user
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: 'google-oauth' // Placeholder for OAuth users
          });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
```

---

### 4. CORS Misconfiguration

**Severity:** 🟡 **MEDIUM**  
**CVSS Score:** 5.3 (Medium)

#### Issue

```javascript
// backend/src/server.js
app.use(cors({
  origin: "http://localhost:5173", // ❌ Hardcoded
  credentials: true
}));
```

#### Problems
1. Hardcoded origin won't work in production
2. Only allows requests from localhost:5173
3. No support for multiple environments
4. Credentials enabled for all requests

#### Remediation

```javascript
// backend/src/server.js
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

### 5. No Input Validation

**Severity:** 🟡 **MEDIUM**  
**CVSS Score:** 6.1 (Medium)

#### Issues

1. **No Request Body Validation**
   - Controllers directly use `req.body` without validation
   - Potential for injection attacks
   - No data type checking

2. **No Sanitization**
   - User input not sanitized
   - XSS vulnerability risk
   - NoSQL injection possible

#### Example Vulnerable Code

```javascript
// ❌ Vulnerable
export const createPlaylist = async (req, res) => {
  const { name, photo, description, songs } = req.body; // No validation!
  const newPlaylist = new Playlist({ name, photo, description, songs });
  await newPlaylist.save();
};
```

#### Remediation

**1. Install Validation Library**

```bash
npm install joi
```

**2. Create Validation Schemas**

```javascript
// backend/src/validators/playlistValidator.js
import Joi from 'joi';

export const createPlaylistSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  photo: Joi.string().uri().required(),
  description: Joi.string().max(500).required(),
  songs: Joi.array().items(
    Joi.object({
      songId: Joi.string().required(),
      name: Joi.string().required(),
      image: Joi.string().uri().required(),
      artists: Joi.array().items(Joi.string()).required(),
      duration: Joi.number().positive().required(),
      album: Joi.string().required()
    })
  )
});

export const addSongSchema = Joi.object({
  playlistId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  song: Joi.object({
    songId: Joi.string().required(),
    name: Joi.string().required(),
    image: Joi.string().uri().required(),
    artists: Joi.array().items(Joi.string()).required(),
    duration: Joi.number().positive().required(),
    album: Joi.string().required()
  }).required()
});
```

**3. Create Validation Middleware**

```javascript
// backend/src/middleware/validate.js
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(d => d.message)
      });
    }
    
    next();
  };
};
```

**4. Apply to Routes**

```javascript
// backend/src/routes/playlistRoutes.js
import { validate } from '../middleware/validate.js';
import { createPlaylistSchema, addSongSchema } from '../validators/playlistValidator.js';

router.post('/', authenticate, validate(createPlaylistSchema), createPlaylist);
router.post('/song', authenticate, validate(addSongSchema), addSongToPlaylist);
```

---

### 6. MongoDB Injection Risk

**Severity:** 🟡 **MEDIUM**  
**CVSS Score:** 5.9 (Medium)

#### Issue

Direct use of user input in MongoDB queries without sanitization:

```javascript
// Potentially vulnerable
const playlist = await Playlist.findById(req.params.id);
const user = await User.findOne({ email: req.body.email });
```

#### Attack Example

```javascript
// Malicious input
{
  "email": { "$ne": null }
}

// Would match any user where email is not null
```

#### Remediation

**1. Use Mongoose Schema Validation**

```javascript
// Already using Mongoose schemas - good!
// But add additional validation
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v),
      message: 'Invalid email format'
    }
  }
});
```

**2. Sanitize Inputs**

```bash
npm install mongo-sanitize
```

```javascript
import mongoSanitize from 'mongo-sanitize';

// Sanitize all inputs
app.use((req, res, next) => {
  req.body = mongoSanitize(req.body);
  req.params = mongoSanitize(req.params);
  req.query = mongoSanitize(req.query);
  next();
});
```

---

### 7. Insecure Session Configuration

**Severity:** 🟡 **MEDIUM**  
**CVSS Score:** 5.4 (Medium)

#### Issue

`express-session` is installed but not properly configured:

```javascript
// No session configuration found!
// Default settings are insecure
```

#### Remediation

```javascript
// backend/src/server.js
import session from 'express-session';
import MongoStore from 'connect-mongo';

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 14 * 24 * 60 * 60 // 14 days
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true, // Prevent XSS
    maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    sameSite: 'strict' // CSRF protection
  }
}));
```

---

### 8. File Upload Vulnerabilities

**Severity:** 🟡 **MEDIUM**  
**CVSS Score:** 5.8 (Medium)

#### Current Configuration

```javascript
// backend/src/storage.js
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'playlists',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

const upload = multer({ 
  storage, 
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});
```

#### Issues
1. No MIME type validation on server
2. Relies on client-provided file extension
3. No virus scanning
4. No file content verification

#### Remediation

```javascript
// backend/src/storage.js
import fileType from 'file-type';

const fileFilter = async (req, file, cb) => {
  // Read first chunk to verify file type
  const buffer = await file.stream.read();
  const type = await fileType.fromBuffer(buffer);
  
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (!type || !allowedTypes.includes(type.mime)) {
    cb(new Error('Invalid file type'), false);
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1
  },
  fileFilter
});
```

---

## 🟢 Additional Security Recommendations

### 1. Implement Security Headers

```bash
npm install helmet
```

```javascript
// backend/src/server.js
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.spotify.com", "https://www.googleapis.com"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### 2. Add Request Logging

```bash
npm install morgan winston
```

```javascript
// backend/src/middleware/logger.js
import morgan from 'morgan';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

export const requestLogger = morgan('combined', {
  stream: { write: (message) => logger.info(message.trim()) }
});
```

### 3. Implement Error Handling

```javascript
// backend/src/middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'An error occurred' 
    : err.message;
  
  res.status(err.status || 500).json({
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};
```

### 4. Add API Versioning

```javascript
// backend/src/server.js
app.use('/api/v1/playlists', playlistRoutes);
app.use('/api/v1/auth', authRoutes);
```

### 5. Implement HTTPS in Production

```javascript
// backend/src/server.js
import https from 'https';
import fs from 'fs';

if (process.env.NODE_ENV === 'production') {
  const options = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH)
  };
  
  https.createServer(options, app).listen(PORT);
} else {
  app.listen(PORT);
}
```

### 6. Add Database Connection Security

```javascript
// backend/src/server.js
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  sslValidate: true,
  authSource: 'admin',
  retryWrites: true,
  w: 'majority'
};

mongoose.connect(process.env.MONGO_URI, mongoOptions);
```

### 7. Implement Secrets Management

Consider using:
- AWS Secrets Manager
- HashiCorp Vault
- Azure Key Vault
- Google Cloud Secret Manager

---

## 📊 Security Testing Checklist

### Before Production Deployment

- [ ] All API credentials moved to backend
- [ ] Environment variables properly configured
- [ ] Authentication implemented on all routes
- [ ] Input validation added
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] HTTPS enabled
- [ ] Security headers implemented
- [ ] Error handling doesn't leak sensitive info
- [ ] Logging implemented
- [ ] Database connection secured
- [ ] File upload validation added
- [ ] Session security configured
- [ ] XSS protection implemented
- [ ] CSRF protection added
- [ ] SQL/NoSQL injection protection
- [ ] Dependency security audit passed
- [ ] Security testing performed

### Continuous Security

- [ ] Regular dependency updates
- [ ] Security audit schedule
- [ ] Penetration testing
- [ ] Vulnerability scanning
- [ ] Security monitoring
- [ ] Incident response plan
- [ ] Backup and recovery tested

---

## 🛠️ Security Tools Recommended

### SAST (Static Analysis)
- ESLint security plugins
- SonarQube
- Snyk

### DAST (Dynamic Analysis)
- OWASP ZAP
- Burp Suite

### Dependency Scanning
```bash
npm audit
npm audit fix
```

### Container Security (if using Docker)
- Docker Bench
- Trivy
- Clair

---

## 📞 Incident Response

If credentials are already compromised:

1. **Immediately revoke all exposed tokens**
2. **Change all passwords**
3. **Review access logs for suspicious activity**
4. **Notify users if data breach occurred**
5. **Document incident**
6. **Implement fixes**
7. **Security audit before redeployment**

---

## 📚 Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Checklist](https://github.com/goldbergyoni/nodebestpractices#6-security-best-practices)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)

---

**Last Updated:** 2024  
**Classification:** CONFIDENTIAL  
**Status:** ACTION REQUIRED
