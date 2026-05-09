# Route Guard Protection

## Overview
This application now implements **route guard protection** to prevent unauthorized access to protected routes. Authentication tokens are stored in `localStorage` for persistence across browser tabs and sessions.

## How It Works

### Authentication Storage:
- **localStorage:** Authentication persists across all tabs and browser sessions
- All tabs in the same browser share the same authentication
- Closing and reopening browser maintains login state
- ✅ Standard web application behavior

### Route Protection:
- Public routes accessible without login
- Protected routes require valid authentication token
- Unauthorized users (no token) redirected to `/home`
- Same browser tabs share authentication state

## What Changed

### Authentication Data (Stored in localStorage):
- `authorization` - JWT access token
- `refreshToken` - JWT refresh token
- `user` - User profile data
- `authenticated` - Authentication status flag
- `isNewUser` - New user flag

### Non-Authentication Data (Also in localStorage):
- `riskCriteriaId`, `riskId` - Risk criteria settings
- `completedSteps` - Onboarding progress
- `adminId` - Admin identifier
- `teams_access_token`, `teams_refresh_token` - Microsoft Teams tokens
- `microsoft_graph_token` - Microsoft Graph API token
- `jira_access_token`, `jira_refresh_token` - Jira integration tokens
- Other integration and settings data

## Testing Scenarios

### ✅ Scenario 1: Same Browser, New Tab
1. Login in Tab 1 → Navigate to `/dashboard1`
2. Open new Tab 2 → Copy URL from Tab 1
3. Paste URL in Tab 2
4. **Result:** User remains logged in, dashboard loads ✅

### ✅ Scenario 2: Browser Refresh
1. Login → Navigate to `/assets`
2. Press F5 or refresh browser
3. **Result:** User remains logged in, page reloads ✅

### ✅ Scenario 3: Close & Reopen Browser
1. Login → Navigate to `/vulnerabilityregister`
2. Close entire browser
3. Reopen browser → Navigate to same URL
4. **Result:** User remains logged in (until logout or token expires) ✅

### ✅ Scenario 4: Incognito/Private Mode (Unauthorized)
1. Login in normal browser → Navigate to `/dashboard1`
2. Copy URL
3. Open incognito window → Paste URL
4. **Result:** Redirected to `/home` (no shared localStorage) ✅

### ✅ Scenario 5: Different Browser (Unauthorized)
1. Login in Chrome → Navigate to `/assets`
2. Copy URL
3. Open Firefox → Paste URL
4. **Result:** Redirected to `/home` (separate storage) ✅

## Route Protection

### Public Routes (No Authentication Required):
- `/`, `/home`
- `/login`, `/signup`, `/signin`
- `/forgotpassword`, `/reset-password/:token`, `/set-password/:token`
- `/auth`, `/choose-account`
- `/pricingplan`, `/partner`
- `/vulnerabilityexplorer`, `/riskcriteria`
- OAuth callbacks: `/jira/callback`, `/slack/callback`, `/microsoft/callback`

### Protected Routes (Authentication Required):
- All routes not listed as public
- Examples: 
  - Admin: `/dashboard1`, `/assets`, `/vulnerabilityregister`, `/yourteam`, etc.
  - User: `/userdashboard`, `/userassets`, `/pendingvulnerabilities`, etc.

## Implementation Details

### Modified Files:
1. **`src/stores/authStore.ts`**
   - Uses `localStorage` for authentication persistence
   - Updated methods: `setAuth()`, `login()`, `userLogin()`, `logout()`, `restoreFromStorage()`, etc.
   - All auth tokens stored in localStorage

2. **`src/router/index.ts`**
   - Added `beforeEach` route guard
   - Checks for authentication token in localStorage
   - Redirects unauthorized users (no token) to `/home`
   - Allows access if token exists (authentication state restored automatically)

3. **`src/components/admin-component/NotificationPanel.vue`**
   - Fixed notification persistence across page refreshes
   - View All/View Less functionality improvements
   - Always fetch all notifications (read + unread)

## Console Warnings

When unauthorized access is attempted, you'll see:
```
🚫 Unauthorized access attempt to: /dashboard1 - Redirecting to /home
```

## Developer Notes

### Adding New Public Routes:
Edit `src/router/index.ts` and add the route path to the `publicRoutes` array:
```typescript
const publicRoutes = [
  // ... existing routes
  "/your-new-public-route",
];
```

### Adding New Protected Routes:
No changes needed! All routes are protected by default unless explicitly listed in `publicRoutes`.

### Authentication Flow:
1. User logs in → Token saved to `localStorage`
2. User navigates to protected route → Route guard checks for token
3. Token exists → Access granted, authStore restores authentication state
4. No token → Redirect to `/home`

## Behavior Summary

### ✅ Users Stay Logged In:
- Same browser, all tabs
- Browser refresh
- Close and reopen browser
- Until explicit logout or token expiration

### ❌ Users Must Login Again:
- Incognito/Private mode
- Different browser
- Different device
- After clearing browser data/localStorage

## Security Considerations

1. **Token Persistence:** Tokens persist in localStorage until logout
2. **Shared Tabs:** All tabs in same browser share authentication
3. **XSS Protection:** Ensure proper CSP headers and input sanitization
4. **Token Expiration:** Backend should implement token expiration
5. **Logout:** Properly clears all authentication data from localStorage

## Login Flow

### Admin Login:
1. Navigate to `/signin`
2. Enter credentials
3. Successful login → Redirects to:
   - `/scoping-form-2` (if scoping not done)
   - `/communication` (if communication not done)
   - `/riskcriteria` (if risk criteria not done)
   - `/admindashboardonboarding` (if all onboarding complete)

### User Login:
1. Navigate to `/auth`
2. Enter credentials
3. Successful login → Redirects to `/userdashboard`

---

**Last Updated:** January 2025
**Version:** 2.0.0 (Reverted to localStorage for persistence)
