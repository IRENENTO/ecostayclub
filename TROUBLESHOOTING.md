# 🔧 TROUBLESHOOTING GUIDE - Login Issues

## Quick Fix Steps

### Step 1: Test with Simple Login Page
1. Open `test-login.html` in your browser
2. Try logging in with: `user@ecostay.rw` / `user1234`
3. If this works, the issue is with `index.html`

### Step 2: Check Browser Console
1. Open `index.html`
2. Press `F12` to open Developer Tools
3. Go to "Console" tab
4. Look for these messages:
   - ✅ "Script.js loaded successfully"
   - ✅ "Landing login form found"
   - ✅ "Page loaded, initializing..."

### Step 3: Check for Errors
Look for RED error messages in console:
- ❌ "Cannot read property..." → Script loading issue
- ❌ "Uncaught TypeError..." → Function not found
- ❌ "Failed to load resource..." → File path issue

### Step 4: Clear Browser Cache
1. Press `Ctrl + Shift + Delete`
2. Select "Cached images and files"
3. Click "Clear data"
4. Refresh page with `Ctrl + F5`

### Step 5: Clear LocalStorage
Open Console (F12) and run:
```javascript
localStorage.clear();
location.reload();
```

## Common Issues & Solutions

### Issue 1: "Nothing happens when I click Login"
**Solution:**
1. Open Console (F12)
2. Type: `typeof handleLogin`
3. Should show: `"function"`
4. If shows `"undefined"`, script didn't load

**Fix:**
- Check if `script.js` exists in the same folder
- Try opening with Live Server instead of double-clicking
- Check file path in HTML: `<script type="module" src="script.js"></script>`

### Issue 2: "Register tab doesn't show"
**Solution:**
1. Open Console (F12)
2. Type: `switchTab('register', true)`
3. Register form should appear

**Fix:**
- Check if `switchTab` function exists: `typeof switchTab`
- Make sure script.js is loaded
- Try clicking the Register button again

### Issue 3: "Stuck on landing page after login"
**Solution:**
1. Check Console for errors
2. Verify user was saved: `localStorage.getItem('ecostay_user')`
3. Should show user data

**Fix:**
```javascript
// Run in console:
localStorage.setItem('ecostay_user', JSON.stringify({
  name: 'Test User',
  email: 'test@test.com',
  is_member: true
}));
location.reload();
```

### Issue 4: "Forms are not visible"
**Solution:**
Check CSS display properties in Console:
```javascript
document.getElementById('landingLoginForm').style.display
document.getElementById('landingRegisterForm').style.display
```

**Fix:**
```javascript
// Show login form:
document.getElementById('landingLoginForm').style.display = 'block';
document.getElementById('landingLoginForm').classList.remove('u-hidden');
```

## Testing Checklist

Run these commands in Console (F12) to verify everything:

```javascript
// 1. Check if script loaded
console.log('Script loaded:', typeof handleLogin !== 'undefined');

// 2. Check if forms exist
console.log('Login form:', !!document.getElementById('landingLoginForm'));
console.log('Register form:', !!document.getElementById('landingRegisterForm'));

// 3. Check if functions exist
console.log('Functions:', {
  switchTab: typeof switchTab,
  handleLogin: typeof handleLogin,
  checkLogin: typeof checkLogin
});

// 4. Test login manually
handleLogin('user@ecostay.rw', 'user1234');
```

## Manual Login (Emergency)

If nothing works, run this in Console:

```javascript
// Create user session
const user = {
  id: 1,
  name: 'Test User',
  email: 'user@ecostay.rw',
  avatar: 'https://ui-avatars.com/api/?name=Test+User&background=1A4D2E&color=fff',
  is_member: true
};

// Save to localStorage
localStorage.setItem('ecostay_user', JSON.stringify(user));
localStorage.setItem('currentUser', JSON.stringify(user));

// Hide landing page
document.getElementById('auth-landing').style.display = 'none';
document.getElementById('main-content').style.display = 'block';

// Show dashboard
document.getElementById('dashboard').style.display = 'block';
document.getElementById('dashboard').classList.remove('u-hidden');

// Update UI
checkLogin();

console.log('✅ Manual login complete!');
```

## File Path Issues

### Check these files exist:
- ✅ `index.html`
- ✅ `script.js`
- ✅ `public/styles.css`
- ✅ `test-login.html`

### Verify paths in index.html:
```html
<link rel="stylesheet" href="/styles.css?v=1.5">
<script type="module" src="script.js"></script>
```

Should be:
```html
<link rel="stylesheet" href="public/styles.css">
<script type="module" src="script.js"></script>
```

## Browser Compatibility

### Recommended Browsers:
- ✅ Chrome/Edge (Latest)
- ✅ Firefox (Latest)
- ⚠️ Safari (May have issues with modules)

### If using Safari:
Remove `type="module"` from script tag:
```html
<script src="script.js"></script>
```

## Still Not Working?

### Option 1: Use Test Page
1. Open `test-login.html`
2. Login there
3. It will redirect to `index.html` with session

### Option 2: Simplify
1. Remove `type="module"` from script tag
2. Clear all localStorage
3. Hard refresh (Ctrl + F5)
4. Try again

### Option 3: Check Network
1. Open DevTools → Network tab
2. Refresh page
3. Check if `script.js` loads (should be 200 OK)
4. If 404, file path is wrong

## Debug Commands

Copy and paste these in Console:

```javascript
// Full diagnostic
console.log('=== ECOSTAY DEBUG ===');
console.log('1. Script loaded:', typeof handleLogin !== 'undefined');
console.log('2. Forms exist:', {
  landing: !!document.getElementById('landingLoginForm'),
  modal: !!document.getElementById('loginForm')
});
console.log('3. Current user:', localStorage.getItem('ecostay_user'));
console.log('4. Auth landing visible:', 
  !document.getElementById('auth-landing').classList.contains('u-hidden'));
console.log('5. Main content visible:', 
  !document.getElementById('main-content').classList.contains('u-hidden'));
console.log('===================');
```

## Contact Support

If none of these work:
1. Take screenshot of Console errors
2. Note which browser you're using
3. Check if `test-login.html` works
4. Report the issue with details

---

**Quick Test:** Open `test-login.html` first. If that works, the main page should too!
