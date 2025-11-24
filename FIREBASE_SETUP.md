# Firebase Setup Guide

This guide will help you set up Firebase for the Training Tracker application.

## Prerequisites

- A Google account
- The Training Tracker application cloned locally

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "training-tracker")
4. (Optional) Enable Google Analytics if you want usage statistics
5. Click **"Create project"** and wait for it to be ready
6. Click **"Continue"** when done

## Step 2: Register Your Web App

1. In your Firebase project dashboard, click the **Web icon** (`</>`) to add a web app
2. Enter an app nickname (e.g., "Training Tracker Web")
3. **Do NOT** check "Also set up Firebase Hosting" (unless you plan to use it)
4. Click **"Register app"**
5. You'll see your Firebase configuration - **keep this page open**, you'll need these values later
6. Click **"Continue to console"**

## Step 3: Enable Authentication

1. In the left sidebar, click **"Authentication"**
2. Click **"Get started"** if this is your first time
3. Go to the **"Sign-in method"** tab
4. Enable **"Email/Password"**:
   - Click on "Email/Password"
   - Toggle the **Enable** switch to ON
   - Click **"Save"**
5. (Optional) Enable **"Google"** sign-in:
   - Click on "Google"
   - Toggle the **Enable** switch to ON
   - Select a support email from the dropdown
   - Click **"Save"**

## Step 4: Create Firestore Database

1. In the left sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Choose a location (select one close to your users)
4. Start in **"Test mode"** for now (we'll secure it later)
5. Click **"Create"**

## Step 5: Configure Security Rules (Important!)

⚠️ **Test mode allows anyone to read/write your database. Change this before deploying!**

1. In Firestore Database, go to the **"Rules"** tab
2. Replace the existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can access their own data
    match /users/{userId}/data/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **"Publish"**

## Step 6: Configure Your Application

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open your `.env` file and fill in the Firebase configuration values:
   - Go back to your Firebase Console
   - Click the **gear icon** ⚙️ next to "Project Overview"
   - Click **"Project settings"**
   - Scroll down to **"Your apps"** section
   - Under **"SDK setup and configuration"**, select **"Config"**
   - Copy each value to your `.env` file:

   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. Save the `.env` file

## Step 7: Test Your Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your browser to the local development URL (usually `http://localhost:5173`)

3. You should see the login screen

4. Try to create a new account with email and password

5. After logging in, try creating some exercises or training sessions

6. Log out and log back in - your data should persist

7. (Optional) Try logging in with Google if you enabled it

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Make sure your `.env` file has the correct values
- Restart your development server after changing `.env`

### "Missing or insufficient permissions"
- Check your Firestore security rules
- Make sure you're logged in
- Verify the rules match the format in Step 5

### "API key not valid"
- Double-check your `VITE_FIREBASE_API_KEY` in `.env`
- Make sure there are no extra spaces or quotes

### Google Sign-In popup closes immediately
- Make sure you've added your domain to the authorized domains list
- Go to Authentication > Settings > Authorized domains
- For local development, `localhost` should already be there

## Next Steps

- Deploy your app (Firebase Hosting, Vercel, Netlify, etc.)
- Add your production domain to Firebase authorized domains
- Monitor usage in Firebase Console
- Set up billing alerts if needed (Spark plan is free up to certain limits)

## Security Best Practices

1. **Never commit your `.env` file** - it's already in `.gitignore`
2. **Use environment variables** in production (Vercel, Netlify, etc.)
3. **Keep Firestore rules strict** - only allow authenticated users to access their own data
4. **Enable App Check** for additional security (optional, for production)
5. **Monitor your Firebase usage** to stay within free tier limits

## Support

For more information:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
