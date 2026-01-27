# Firebase Setup Guide for EcoStay CMS

## Overview
Your EcoStay CMS now supports **Firebase Firestore** for cloud data persistence. All changes are automatically synced to Firebase while maintaining LocalStorage as a backup for offline access.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `ecostay-cms` (or similar)
4. Accept the terms and click **"Create project"**
5. Wait for project creation to complete

## Step 2: Enable Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **"Create Database"**
3. Choose **"Start in Test Mode"** (for development)
   - ⚠️ **Important**: In production, set proper security rules (see Security Rules section below)
4. Select region closest to you (e.g., `us-central1`)
5. Click **"Enable"**

## Step 3: Get Your Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll to **"Your apps"** section
3. Click **"Web"** icon (if not already shown)
4. Copy the Firebase configuration object

Your config will look like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "ecostay-cms.firebaseapp.com",
  projectId: "ecostay-cms",
  storageBucket: "ecostay-cms.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

## Step 4: Update script-firebase.js with Your Config

1. Open `script-firebase.js`
2. Find the **FIREBASE CONFIGURATION** section (around line 4)
3. Replace the placeholder values:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",                    // ← Replace
  authDomain: "YOUR_PROJECT.firebaseapp.com", // ← Replace
  projectId: "YOUR_PROJECT_ID",               // ← Replace
  storageBucket: "YOUR_PROJECT.appspot.com",  // ← Replace
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // ← Replace
  appId: "YOUR_APP_ID"                        // ← Replace
};
```

## Step 5: Test the Connection

1. Open `admin.html` in your browser
2. Make a small change (e.g., edit the headline)
3. Click **"Save All"**
4. You should see a toast message:
   - ✅ **"✓ Changes saved to Firebase!"** = Success
   - ⚠️ **"Saved locally, but Firebase sync failed"** = Check your config or internet
   - 💾 **"Changes saved locally (Firebase not configured)"** = Config not set up yet

## Step 6: Verify Data in Firebase

1. Go to **Firestore Database** in Firebase Console
2. You should see a collection called `siteConfig`
3. Inside, there's a document called `main`
4. Click it to see all your site configuration data

## Firebase Data Structure

Your complete site configuration is stored in a single Firestore document at:
```
Collection: siteConfig
Document: main
```

The document contains:
- `theme` - Color settings
- `navbar` - Navigation configuration
- `hero` - Hero section content
- `mission` - Mission & vision
- `impact` - Impact statistics
- `team` - Team members array
- `testimonials` - Testimonials array
- `events` - Events array
- `footer` - Footer configuration

## How It Works

### On Page Load:
1. Tries to load config from Firebase
2. If Firebase unavailable, uses LocalStorage
3. Updates LocalStorage cache

### On Save:
1. Immediately saves to LocalStorage (instant UI update)
2. Asynchronously saves to Firebase (background sync)
3. Shows status toast

### Offline Access:
- ✅ Can still view site (uses LocalStorage)
- ✅ Can still edit in admin (uses LocalStorage)
- ⚠️ Changes won't sync to Firebase until connection restored
- ℹ️ When you reconnect, changes auto-sync on next save

## Firebase Security Rules (Production)

For **development/testing**, Test Mode allows anyone to read/write. For **production**, replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated admins can read/write
    match /siteConfig/{document=**} {
      allow read, write: if request.auth != null && 
        request.auth.token.admin == true;
    }
  }
}
```

Steps to apply:
1. Go to **Firestore Database** → **Rules** tab
2. Paste the rules above
3. Click **"Publish"**
4. Set up Firebase Authentication for your admin users

## Troubleshooting

### "Firebase not configured" message?
- [ ] Double-check all values in firebaseConfig match Firebase Console exactly
- [ ] Ensure no typos in projectId
- [ ] Try pasting config directly from Firebase Console

### Changes not syncing to Firebase?
- [ ] Check internet connection
- [ ] Open browser console (F12) and look for error messages
- [ ] Verify Firestore database is enabled in Firebase
- [ ] Check Firebase security rules allow writes

### "Test Mode has expired"?
- [ ] Go to Firebase Console → Firestore Rules
- [ ] Update the expiration date or set production rules
- [ ] See Firebase Security Rules section above

### Want to clear Firebase data?
- [ ] Go to Firebase Console → Firestore Database
- [ ] Right-click the `siteConfig` collection
- [ ] Select **"Delete collection"**
- [ ] On next save, your current config will be re-uploaded

## Migrating Existing LocalStorage Data to Firebase

If you already have data in LocalStorage:
1. It will automatically sync to Firebase on the first save
2. No additional steps needed!
3. The LocalStorage version becomes the "source of truth"

## Disabling Firebase (Use LocalStorage Only)

To revert to LocalStorage-only mode:
1. Open `script-firebase.js`
2. Change firebaseConfig.projectId to: `"YOUR_PROJECT_ID"`
3. The system will automatically fall back to LocalStorage

## Next Steps

- ✅ Set up proper authentication (see Firebase Auth docs)
- ✅ Configure backups and versioning
- ✅ Set production security rules
- ✅ Monitor Firestore usage in Firebase Console
- ✅ Consider adding Firestore Functions for automation

## Reference Links

- [Firebase Console](https://console.firebase.google.com/)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [Firebase Pricing](https://firebase.google.com/pricing)

---

**Need help?** Check the browser console (F12 → Console tab) for detailed error messages!
