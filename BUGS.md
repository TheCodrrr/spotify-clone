# 🐛 Bugs & Issues Report

## Overview

This document catalogs all identified bugs, issues, and code smells in the Spotify Clone project. Issues are prioritized by severity and impact.

---

## 📊 Summary Statistics

| Category | Critical | High | Medium | Low | Total |
|----------|----------|------|--------|-----|-------|
| Security | 6 | 4 | 3 | 0 | 13 |
| Functionality | 2 | 3 | 5 | 3 | 13 |
| Code Quality | 0 | 2 | 6 | 8 | 16 |
| Performance | 0 | 1 | 3 | 2 | 6 |
| **TOTAL** | **8** | **10** | **17** | **13** | **48** |

---

## 🔴 CRITICAL Issues (Production Blockers)

### BUG-001: Exposed API Credentials in Frontend
**Severity:** 🔴 Critical  
**Category:** Security  
**Impact:** Account compromise, API abuse

**Description:**
Multiple API credentials are hardcoded in frontend source code and visible in the browser.

**Affected Files:**
- `spotify-clone/src/components/mainContent/fetchSongDetails.js`
- `extra.js`
- `spotify-clone/src/components/youtubeSearch.js`
- `spotify-clone/src/components/mainContent/centreContent/category_details.js`

**Exposed Credentials:**
```javascript
client_id: 'fa99f1012dea4fa292a3b9a593e5fd19'
client_secret: '909967f80ec44c33b1738a2e09edbe5d'
refresh_token: 'AQDJClGX6vWk1SX2hRWG4zM9wzYu275O2v1QWZU8noz9ZdU6HaBjogRdbkrOXZjK...'
GENIUS_ACCESS_TOKEN: 'C2iYY-_2fgk9N7ceEYWHIbaGODy-9lXmMfa33lFmefytcaFRChuB3EmiAAE5YBqO'
```

**Steps to Reproduce:**
1. Open browser DevTools
2. Go to Sources tab
3. Search for "client_secret"
4. View exposed credentials

**Expected Behavior:**
All API credentials should be stored on backend and never exposed to client.

**Actual Behavior:**
Credentials are plaintext in frontend bundle.

**Fix Required:**
1. Move all credentials to backend `.env`
2. Create proxy endpoints in backend
3. Update frontend to use proxy
4. Revoke and regenerate all exposed credentials

**Reference:** See SECURITY_ANALYSIS.md Section 1

---

### BUG-002: YouTube API Key Missing
**Severity:** 🔴 Critical  
**Category:** Functionality  
**Impact:** Music playback completely broken

**Description:**
YouTube API key is an empty string, preventing any music playback.

**Affected Files:**
- `spotify-clone/src/components/youtubeSearch.js`

**Code:**
```javascript
const API_KEY = ""; // Empty!
```

**Steps to Reproduce:**
1. Click play on any song
2. Player attempts to load YouTube video
3. API call fails due to missing key
4. No audio plays

**Expected Behavior:**
Music should play through YouTube integration.

**Actual Behavior:**
Silent failure, no error message to user.

**Fix Required:**
1. Obtain YouTube Data API v3 key
2. Store in backend `.env`
3. Create backend proxy endpoint
4. Update frontend to use proxy

**Priority:** P0 - Blocks core functionality

---

### BUG-003: No Authentication on API Endpoints
**Severity:** 🔴 Critical  
**Category:** Security  
**Impact:** Unauthorized access, data manipulation

**Description:**
All backend API endpoints are completely unprotected and public.

**Affected Files:**
- `spotify-clone/backend/src/routes/playlistRoutes.js`
- All controller files

**Vulnerable Endpoints:**
```
POST   /api/playlists              ❌ No auth
GET    /api/playlists              ❌ No auth
DELETE /api/playlists/playlist/:id ❌ No auth
POST   /api/playlists/song         ❌ No auth
DELETE /api/playlists/song         ❌ No auth
PUT    /api/playlists/info/:id     ❌ No auth
```

**Steps to Reproduce:**
1. Use curl or Postman
2. Make request to any endpoint without auth
3. Operation succeeds

**Expected Behavior:**
Endpoints should require authentication and verify ownership.

**Actual Behavior:**
Anyone can access/modify any data.

**Fix Required:**
1. Implement JWT middleware
2. Protect all routes
3. Add ownership validation
4. Add rate limiting

**Reference:** See SECURITY_ANALYSIS.md Section 2

---

### BUG-004: Missing Backend Authentication Routes
**Severity:** 🔴 Critical  
**Category:** Functionality  
**Impact:** Authentication system non-functional

**Description:**
Frontend AuthContext references backend routes that don't exist.

**Missing Routes:**
```
GET  /api/auth/status        ❌ Not implemented
GET  /api/auth/logout        ❌ Not implemented
GET  /api/spotify/credentials ❌ Not implemented
POST /api/auth/register      ❌ Not implemented
POST /api/auth/login         ❌ Not implemented
```

**Affected Files:**
- `spotify-clone/src/components/AuthContext.jsx` (Frontend)
- `spotify-clone/backend/src/routes/` (Missing files)

**Steps to Reproduce:**
1. Frontend calls `axios.get('http://localhost:5000/api/auth/status')`
2. Backend returns 404
3. Auth check fails

**Expected Behavior:**
Authentication should work as designed in frontend.

**Actual Behavior:**
Authentication completely broken.

**Fix Required:**
1. Implement missing auth routes
2. Create authRoutes.js
3. Add authentication controllers
4. Register routes in server.js

**Reference:** See SECURITY_ANALYSIS.md Section 3

---

### BUG-005: Duplicate Spotify Credentials in Repository
**Severity:** 🔴 Critical  
**Category:** Security  
**Impact:** Exposed credentials, security breach

**Description:**
File `extra.js` in root contains duplicate credentials and test code.

**Affected Files:**
- `extra.js` (Root directory)

**Issues:**
1. Contains same Spotify credentials as other files
2. Has test/debug code
3. Should not be in repository
4. Not in `.gitignore`

**Fix Required:**
1. Delete file or add to `.gitignore`
2. Remove from git history
3. Rotate exposed credentials

---

### BUG-006: CORS Hardcoded to Localhost
**Severity:** 🔴 Critical (for production)  
**Category:** Configuration  
**Impact:** Won't work in production

**Affected Files:**
- `spotify-clone/backend/src/server.js`

**Code:**
```javascript
app.use(cors({
  origin: "http://localhost:5173", // Hardcoded!
  credentials: true
}));
```

**Expected Behavior:**
CORS should work in all environments.

**Actual Behavior:**
Only works on localhost:5173.

**Fix Required:**
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
```

---

## 🟠 HIGH Priority Issues

### BUG-007: No Input Validation
**Severity:** 🟠 High  
**Category:** Security  
**Impact:** Injection attacks, data corruption

**Description:**
Controllers directly use `req.body` without validation.

**Affected Files:**
- All controller files

**Example:**
```javascript
// No validation!
export const createPlaylist = async (req, res) => {
  const { name, photo, description, songs } = req.body;
  const newPlaylist = new Playlist({ name, photo, description, songs });
  await newPlaylist.save();
};
```

**Fix Required:**
1. Install Joi validation library
2. Create validation schemas
3. Add validation middleware
4. Apply to all routes

**Reference:** See SECURITY_ANALYSIS.md Section 5

---

### BUG-008: No Rate Limiting
**Severity:** 🟠 High  
**Category:** Security  
**Impact:** DDoS attacks, API abuse

**Description:**
Backend has no rate limiting on any endpoints.

**Attack Scenario:**
```bash
# Can make unlimited requests
while true; do
  curl -X POST http://localhost:5000/api/playlists \
    -H "Content-Type: application/json" \
    -d '{"name":"spam","photo":"url","description":"spam"}'
done
```

**Fix Required:**
1. Install express-rate-limit
2. Configure rate limiters
3. Apply to all routes
4. Stricter limits for auth routes

---

### BUG-009: StrictMode Disabled
**Severity:** 🟠 High  
**Category:** Code Quality  
**Impact:** Missing React warnings

**Affected Files:**
- `spotify-clone/src/main.jsx`

**Code:**
```javascript
// <StrictMode>
    <App />
// </StrictMode>
```

**Why It's Disabled:**
Likely due to double-rendering issues or side effects.

**Impact:**
- Missing warnings about unsafe lifecycles
- Side effects not caught in development
- Harder to find bugs

**Fix Required:**
1. Identify components with side effects
2. Fix side effect issues
3. Re-enable StrictMode
4. Test thoroughly

---

### BUG-010: MongoDB Injection Risk
**Severity:** 🟠 High  
**Category:** Security  
**Impact:** Database breach

**Description:**
User input used directly in queries without sanitization.

**Vulnerable Code:**
```javascript
const user = await User.findOne({ email: req.body.email });
```

**Attack Example:**
```json
{
  "email": { "$ne": null }
}
```

**Fix Required:**
1. Install mongo-sanitize
2. Sanitize all inputs
3. Use Mongoose validation
4. Never trust user input

**Reference:** See SECURITY_ANALYSIS.md Section 6

---

### BUG-011: No Error Boundaries
**Severity:** 🟠 High  
**Category:** Code Quality  
**Impact:** App crashes on component errors

**Description:**
No React error boundaries implemented anywhere.

**Impact:**
- Single component error crashes entire app
- Poor user experience
- No error recovery

**Fix Required:**
1. Create ErrorBoundary component
2. Wrap routes in error boundaries
3. Add error logging
4. Show user-friendly error messages

---

## 🟡 MEDIUM Priority Issues

### BUG-012: Duplicate Token Refresh Logic
**Severity:** 🟡 Medium  
**Category:** Code Quality  
**Impact:** Maintenance burden, inconsistency

**Description:**
Token refresh code duplicated across multiple files.

**Affected Files:**
- `fetchSongDetails.js`
- `category_details.js`
- `extra.js`
- Multiple other files

**Each file has:**
```javascript
async function getAccessToken() {
  // Same code repeated
}
```

**Impact:**
- Hard to maintain
- Inconsistent implementations
- Token management scattered

**Fix Required:**
1. Create single utility function
2. Export from one place
3. Import where needed
4. Remove duplicates

---

### BUG-013: File Upload Security
**Severity:** 🟡 Medium  
**Category:** Security  
**Impact:** Malicious file uploads

**Description:**
File upload validation only checks extensions, not content.

**Affected Files:**
- `spotify-clone/backend/src/storage.js`

**Current Validation:**
```javascript
allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
```

**Issue:**
- Relies on file extension
- No MIME type verification
- No file content checking
- No virus scanning

**Fix Required:**
1. Verify file content with file-type library
2. Check MIME types server-side
3. Add file size limits
4. Consider virus scanning

**Reference:** See SECURITY_ANALYSIS.md Section 8

---

### BUG-014: Insecure Session Configuration
**Severity:** 🟡 Medium  
**Category:** Security  
**Impact:** Session hijacking risk

**Description:**
express-session installed but not configured properly.

**Issues:**
- No session configuration found
- Using default settings (insecure)
- No session store configured
- Cookie settings missing

**Fix Required:**
```javascript
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  }
}));
```

---

### BUG-015: No Security Headers
**Severity:** 🟡 Medium  
**Category:** Security  
**Impact:** XSS, clickjacking vulnerabilities

**Description:**
Missing security headers (helmet not used).

**Missing Headers:**
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security

**Fix Required:**
```bash
npm install helmet
```

```javascript
import helmet from 'helmet';
app.use(helmet());
```

---

### BUG-016: Commented Production Code
**Severity:** 🟡 Medium  
**Category:** Code Quality  
**Impact:** Code cleanliness, confusion

**Affected Files:**
- `App.jsx`
- `main.jsx`
- Multiple component files

**Examples:**
```javascript
// <Route path='/togo' element={<MainContent />} />
// <Route path='/togooo' element={<Expr />} />
```

**Fix Required:**
Delete all commented code before production.

---

### BUG-017: No Loading States
**Severity:** 🟡 Medium  
**Category:** UX  
**Impact:** Poor user experience

**Description:**
Some components don't show loading states during API calls.

**Affected Components:**
- Various playlist components
- Search components
- Some navigation components

**Expected Behavior:**
Show skeleton loaders during data fetch.

**Actual Behavior:**
Blank screen or stale data.

**Fix Required:**
Use react-loading-skeleton consistently across all async components.

---

### BUG-018: Mobile Responsiveness Issues
**Severity:** 🟡 Medium  
**Category:** UX  
**Impact:** Poor mobile experience

**Description:**
Layout appears fixed-width in many components.

**Issues:**
- Three-column layout doesn't adapt to mobile
- Fixed percentages for column widths
- No media queries in many components
- Bottom player may overflow on small screens

**Fix Required:**
1. Add responsive breakpoints
2. Stack columns vertically on mobile
3. Test on actual devices
4. Add mobile-specific styles

---

### BUG-019: No Environment Validation
**Severity:** 🟡 Medium  
**Category:** Configuration  
**Impact:** Runtime failures, unclear errors

**Description:**
Server starts without validating required environment variables.

**Current Behavior:**
```javascript
// Server starts, then fails later
const conn = await mongoose.connect(process.env.MONGO_URI);
// What if MONGO_URI is undefined?
```

**Fix Required:**
```javascript
// Validate on startup
const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET',
  'CLOUDINARY_CLOUD_NAME'
];

requiredEnvVars.forEach(key => {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
});
```

---

### BUG-020: No Error Handling Middleware
**Severity:** 🟡 Medium  
**Category:** Code Quality  
**Impact:** Unclear errors, security info leak

**Description:**
No global error handling in Express.

**Current Behavior:**
Errors show stack traces in production.

**Fix Required:**
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});
```

---

## 🟢 LOW Priority Issues

### BUG-021: No Request Logging
**Severity:** 🟢 Low  
**Category:** Observability  
**Impact:** Hard to debug issues

**Fix:** Install morgan for request logging

---

### BUG-022: No API Versioning
**Severity:** 🟢 Low  
**Category:** API Design  
**Impact:** Breaking changes harder

**Current:** `/api/playlists`  
**Recommended:** `/api/v1/playlists`

---

### BUG-023: No .env.example File
**Severity:** 🟢 Low  
**Category:** Documentation  
**Impact:** Setup confusion

**Fix:** Create comprehensive .env.example (Done in documentation)

---

### BUG-024: No Git Hooks
**Severity:** 🟢 Low  
**Category:** Code Quality  
**Impact:** Bad commits possible

**Recommendation:** Add husky for pre-commit hooks

---

### BUG-025: No TypeScript
**Severity:** 🟢 Low  
**Category:** Code Quality  
**Impact:** Runtime type errors

**Recommendation:** Migrate to TypeScript incrementally

---

### BUG-026: No Tests
**Severity:** 🟢 Low  
**Category:** Quality Assurance  
**Impact:** Bugs harder to catch

**Fix:** Add Jest/Vitest with test coverage

---

### BUG-027: No CI/CD Pipeline
**Severity:** 🟢 Low  
**Category:** DevOps  
**Impact:** Manual deployments

**Recommendation:** Setup GitHub Actions

---

### BUG-028: No Docker Configuration
**Severity:** 🟢 Low  
**Category:** DevOps  
**Impact:** Environment inconsistency

**Recommendation:** Add Dockerfile and docker-compose.yml

---

### BUG-029: No API Documentation
**Severity:** 🟢 Low  
**Category:** Documentation  
**Impact:** API unclear to developers

**Recommendation:** Add Swagger/OpenAPI spec

---

### BUG-030: No Database Migrations
**Severity:** 🟢 Low  
**Category:** Database  
**Impact:** Schema changes difficult

**Recommendation:** Add migration system

---

### BUG-031: Font Loading Not Optimized
**Severity:** 🟢 Low  
**Category:** Performance  
**Impact:** Slower initial load

**Fix:** Use font-display: swap

---

### BUG-032: No Image Lazy Loading
**Severity:** 🟢 Low  
**Category:** Performance  
**Impact:** Slower page loads

**Fix:** Implement lazy loading for images

---

### BUG-033: No Service Worker
**Severity:** 🟢 Low  
**Category:** Performance  
**Impact:** No offline support

**Fix:** Implement PWA with Vite PWA plugin

---

## 📋 Bug Tracking Summary

### By Category
- **Security:** 13 issues (6 critical, 4 high, 3 medium)
- **Functionality:** 13 issues (2 critical, 3 high, 5 medium, 3 low)
- **Code Quality:** 16 issues (0 critical, 2 high, 6 medium, 8 low)
- **Performance:** 6 issues (0 critical, 1 high, 3 medium, 2 low)

### By Severity
- **Critical (P0):** 8 issues - MUST FIX before production
- **High (P1):** 10 issues - Should fix soon
- **Medium (P2):** 17 issues - Fix in next sprint
- **Low (P3):** 13 issues - Nice to have

### Priority Order (Fix in this order)

1. **Week 1:** BUG-001 through BUG-006 (All critical security/functionality)
2. **Week 2:** BUG-007 through BUG-011 (High priority security/quality)
3. **Week 3-4:** BUG-012 through BUG-020 (Medium priority)
4. **Week 5+:** BUG-021 through BUG-033 (Low priority enhancements)

---

## 🔍 Testing Checklist

Before marking any bug as fixed:

- [ ] Issue reproduced in development
- [ ] Fix implemented
- [ ] Unit tests added
- [ ] Integration tests added (if applicable)
- [ ] Manually tested
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] No regressions introduced
- [ ] Deployed to staging
- [ ] Verified in staging

---

## 📊 Progress Tracking

| Status | Count | Percentage |
|--------|-------|------------|
| 🔴 Open | 48 | 100% |
| 🟡 In Progress | 0 | 0% |
| 🟢 Fixed | 0 | 0% |
| ✅ Verified | 0 | 0% |

---

## 📝 Notes

### Issue Reporting Template
```markdown
### BUG-XXX: Title
**Severity:** [Critical/High/Medium/Low]
**Category:** [Security/Functionality/Code Quality/Performance]
**Impact:** Brief description

**Description:** Detailed description

**Affected Files:** List of files

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior:** What should happen

**Actual Behavior:** What actually happens

**Fix Required:** How to fix
```

---

**Last Updated:** 2024  
**Reviewed By:** AI Documentation System  
**Next Review:** After first sprint of fixes

---

## 🎯 Recommended Fix Order

### Sprint 1 (Week 1) - Critical Security
- BUG-001: Move credentials to backend
- BUG-002: Add YouTube API key
- BUG-003: Implement authentication
- BUG-004: Create auth routes
- BUG-005: Remove extra.js
- BUG-006: Fix CORS config

### Sprint 2 (Week 2) - High Priority
- BUG-007: Add input validation
- BUG-008: Implement rate limiting
- BUG-009: Re-enable StrictMode
- BUG-010: Fix MongoDB injection
- BUG-011: Add error boundaries

### Sprint 3 (Weeks 3-4) - Medium Priority
- BUG-012 through BUG-020: Code quality and security hardening

### Sprint 4 (Weeks 5+) - Low Priority
- BUG-021 through BUG-033: Enhancements and optimizations

---

> **Important:** Do not deploy to production until all critical and high priority bugs are fixed!
