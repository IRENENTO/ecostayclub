# Quick Start Guide - EcoStay Club

## 🚀 Getting Started

### Option 1: Open Directly in Browser
1. Navigate to your project folder: `c:\my-projects\club`
2. Double-click `index.html` to open in your default browser
3. You'll see the login landing page

### Option 2: Use Live Server (Recommended)
1. Open the project in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"
4. Your browser will open automatically

## 🔐 Test Login

### Quick Test (Landing Page)
1. On the landing page, you'll see the login form
2. Use these credentials:
   - **Email:** `user@ecostay.rw`
   - **Password:** `user1234`
3. Click "Login"
4. You'll be redirected to the main site with your dashboard visible

### Create New Account
1. Click the "Register" tab on the landing page
2. Fill in:
   - Full Name: Your Name
   - Email: your@email.com
   - Password: (minimum 8 characters)
3. Click "Create Account"
4. You'll be logged in automatically

## 📊 Dashboard Features

After logging in, you'll see:

### 1. Profile Card
- Your avatar
- Name and email
- Member statistics

### 2. Membership Status
- Current membership level
- Member ID
- Join button (if not a member yet)

### 3. Quick Actions
- Register for Events
- Support Projects
- Get Help (Chatbot)

### 4. Recent Activity
- Your recent actions
- Upcoming events

### 5. Impact Statistics
- Trees Planted
- CO2 Sequestered
- Active Members
- Progress bars showing goals

## 🎯 What to Test

### ✅ Login Flow
- [ ] Login with test credentials
- [ ] Dashboard appears automatically
- [ ] User info displays correctly
- [ ] Avatar loads properly

### ✅ Navigation
- [ ] Scroll through the dashboard
- [ ] Click on "Events" in navbar
- [ ] Try "Quick Actions" buttons
- [ ] Test mobile menu (resize browser)

### ✅ User Actions
- [ ] Edit profile (click user dropdown → Edit Profile)
- [ ] Join club (if not a member)
- [ ] Register for events
- [ ] Use chatbot

### ✅ Logout
- [ ] Click user dropdown → Logout
- [ ] Confirm you're back to landing page
- [ ] Try logging in again

## 🔧 Admin Access

### Admin Dashboard
1. Login with:
   - **Email:** `admin@ecostay.org`
   - **Password:** `admin123`
2. You'll be redirected to `admin.html`
3. Full admin panel with:
   - Member management
   - User management
   - Event management
   - Analytics

### Admin on Main Site
1. Login with:
   - **Email:** `admin@ecostay.rw`
   - **Password:** `admin123`
2. Stay on main site with admin privileges
3. Access to all features

## 🐛 Troubleshooting

### Dashboard Not Showing?
1. Open browser console (F12)
2. Check for errors
3. Clear localStorage: `localStorage.clear()`
4. Refresh page and login again

### Stuck on Landing Page?
1. Make sure you're using correct credentials
2. Check browser console for errors
3. Try a different browser
4. Clear cache and cookies

### Avatar Not Loading?
- Default avatars are generated automatically
- Check internet connection (uses external API)
- Avatar will show initials if image fails

## 📱 Mobile Testing

1. Open browser DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select a mobile device
4. Test all features on mobile view

## 🎨 Features to Explore

### 1. Language Switcher
- Top right corner: EN | FR | RW
- Changes all text on the site
- Preference is saved

### 2. Dark Mode
- Click moon icon in navbar
- Toggle between light/dark themes
- Preference is saved

### 3. Chatbot
- Click chat button (bottom right)
- Ask about events, joining, donations
- Get instant responses

### 4. Donate
- Scroll to "Support Our Impact"
- Select amount
- Click "Pay with Mobile Money"
- USSD code will open

## 📈 Next Steps

After testing:
1. ✅ Verify all features work
2. ✅ Test on different browsers
3. ✅ Test on mobile devices
4. ✅ Check admin dashboard
5. ✅ Review analytics

## 🆘 Need Help?

### Common Issues:
- **Login fails:** Check credentials match exactly
- **Dashboard hidden:** Clear localStorage and retry
- **Slow loading:** Check internet connection
- **Errors in console:** Check browser compatibility

### Contact:
- Check `LOGIN_DASHBOARD_FIXES.md` for technical details
- Review code comments in `script.js`
- Test with different browsers

---

## ✨ Success Checklist

- [ ] Can login successfully
- [ ] Dashboard appears after login
- [ ] User info displays correctly
- [ ] Can navigate all sections
- [ ] Can edit profile
- [ ] Can logout and login again
- [ ] Mobile view works
- [ ] Dark mode works
- [ ] Language switcher works
- [ ] Chatbot responds

**If all checked, your system is working perfectly! 🎉**

---
**Version:** 2.0
**Last Updated:** February 2026
