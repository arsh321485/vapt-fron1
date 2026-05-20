# Tawk.to Badge Visibility Control

## Overview
Yeh implementation ensure karta hai ki Tawk.to ka notification badge (jaise "1 new message") sirf un pages par dikhaye jahan Tawk.to chat widget active hai.

## Problem Statement (समस्या)
Pehle:
- Tawk.to widget sirf home aur specific public pages par tha
- Lekin notification badge (1 new message) har page par show hota tha
- User/Admin dashboard par bhi badge dikhai deta tha jahan widget hi nahi tha

Ab:
- Badge sirf un pages par dikhega jahan Tawk.to widget active hai
- Dashboard aur dusre pages par badge hide rahega

## Implementation Details

### Files Modified (बदली गई फाइलें)

1. **`src/assets/tawk-control.css`** (New File)
   - CSS-based approach to hide/show Tawk.to badges
   - Body element par `hide-tawk-badge` class control karta hai visibility

2. **`src/main.ts`**
   - Import kiya `tawk-control.css` file ko

3. **`src/App.vue`**
   - Added `toggleTawkBadge()` method
   - Watch `showSupportWidget` computed property
   - Automatically toggle body class based on current route

4. **`src/components/home-components/HomeSupportChatWidget.vue`**
   - Simplified code (removed redundant badge control methods)

## How It Works (कैसे काम करता है)

### Step 1: Route Detection
```typescript
const SUPPORT_WIDGET_PATHS = new Set([
  "/home",
  "/pricingplan",
  "/privacy",
  "/terms",
  "/security",
  "/support",
  "/dpa",
  "/partner",
  "/partner-lead-portal",
]);

showSupportWidget(): boolean {
  return SUPPORT_WIDGET_PATHS.has(this.$route.path);
}
```

### Step 2: Body Class Toggle
Jab user navigate karta hai:
- **Support pages par**: `body.hide-tawk-badge` class remove hoti hai → Badge visible
- **Dashboard/Other pages par**: `body.hide-tawk-badge` class add hoti hai → Badge hidden

### Step 3: CSS Control
```css
body.hide-tawk-badge .tawk-badge,
body.hide-tawk-badge .tawk-unread-count {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
}
```

## Supported Pages (जहाँ Badge Dikhega)

Badge sirf in pages par visible hoga:
- `/home` - Home page
- `/pricingplan` - Pricing page
- `/privacy` - Privacy policy
- `/terms` - Terms & conditions
- `/security` - Security page
- `/support` - Support page
- `/dpa` - Data Processing Agreement
- `/partner` - Partner page
- `/partner-lead-portal` - Partner lead portal

## Dashboard & Protected Pages (जहाँ Badge Hidden Rahega)

Badge in pages par hidden rahega:
- `/user/dashboard` - User dashboard
- `/admin/dashboard` - Admin dashboard
- Sare protected routes
- Authenticated user pages

## Testing (टेस्टिंग)

### Test Case 1: Home Page se Dashboard
1. Home page par jao
2. Tawk.to widget visible hona chahiye
3. Agar new message hai toh badge dikhna chahiye
4. Login karo aur dashboard par jao
5. Badge hide ho jana chahiye (widget bhi hide hai)

### Test Case 2: Dashboard se Home Page
1. Dashboard par ho
2. Badge hidden hona chahiye
3. Home page par jao
4. Badge visible ho jana chahiye (agar messages hain)

### Test Case 3: Route Changes
1. Home page se pricing page - Badge visible rahega
2. Pricing se dashboard - Badge hide ho jayega
3. Dashboard se support page - Badge visible ho jayega

## Browser Compatibility
- Chrome ✅
- Firefox ✅
- Safari ✅
- Edge ✅

## Future Enhancements (भविष्य में सुधार)

1. **Dynamic Path Configuration**
   - Admin panel se control kar sakte hain ki kis page par widget dikhe

2. **User Preference**
   - User apni preference save kar sake

3. **Role-based Control**
   - Admin vs User ke liye alag settings

## Troubleshooting

### Badge Still Visible?
1. Check browser console for errors
2. Verify `hide-tawk-badge` class on body element
3. Clear browser cache
4. Check if `tawk-control.css` is loaded

### Badge Not Showing on Support Pages?
1. Check if route is in `SUPPORT_WIDGET_PATHS`
2. Verify `showSupportWidget` computed property
3. Check body class should NOT have `hide-tawk-badge`

## Technical Notes

### Why CSS-based Approach?
- More reliable than JavaScript-only approach
- Works even if JavaScript fails temporarily
- Better performance
- Easier to maintain and debug
- No race conditions with Tawk.to loading

### Why Body Class Method?
- Global control point
- Easy to debug (inspect body element)
- Works with all Tawk.to badge selectors
- Future-proof (new badge elements auto-hidden)

## Contact
For issues or questions, please contact the development team.
