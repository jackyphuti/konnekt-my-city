# Google OAuth Setup Guide

## Problem You're Experiencing

When you try to sign up with Google on your phone:
1. ✅ You can choose your Google account
2. ❌ After selection, you get "This site can't be reached" error

**Root Cause**: Google OAuth is not properly configured in Supabase, OR the redirect URL doesn't match.

---

## Step 1: Get Google OAuth Credentials

### 1a. Go to Google Cloud Console
- Visit: https://console.cloud.google.com/
- Create a new project or select existing one

### 1b. Create OAuth 2.0 Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Choose **Web application**
4. Set **Name**: "Konnekt My City"

### 1c. Add Authorized Redirect URIs
Add these redirect URLs to your OAuth app:

**For Supabase Production:**
```
https://xtcxmhecspvuttdjknmh.supabase.co/auth/v1/callback?provider=google
```

**For Local Development (if testing locally):**
```
http://localhost:3000/auth/callback
http://localhost:3001/auth/callback
http://localhost:3002/auth/callback
http://localhost:3003/auth/callback
http://10.127.40.216:3000/auth/callback
```

**For Capacitor Mobile (Android):**
```
https://xtcxmhecspvuttdjknmh.supabase.co/auth/v1/callback?provider=google
```

### 1d. Copy Your Credentials
- Copy **Client ID** 
- Copy **Client Secret**
- Save them safely (don't commit to git!)

---

## Step 2: Configure Supabase Provider

### 2a. Go to Supabase Dashboard
- URL: https://app.supabase.com/
- Select your project: **konnekt-my-city**

### 2b. Navigate to Authentication
1. Click **Authentication** in left sidebar
2. Click **Providers**
3. Find and click **Google**

### 2c. Enable and Configure Google Provider
1. Toggle **Enable Sign in with Google** to ON
2. Paste your **Client ID** from Google
3. Paste your **Client Secret** from Google
4. Click **Save**

### 2d. Verify Configuration
Your Supabase Auth page should show:
```
✅ Google (Enabled)
```

---

## Step 3: Update Your App Configuration

### Add Environment Variables (if not already set)
In `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL="https://xtcxmhecspvuttdjknmh.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_DU0wJAQSPhTglAmemY7YTQ_5yzMb24_"
```

### Ensure Correct Redirect URL in App
The redirect URL should be:
- **Local Dev**: `http://localhost:3000/auth/callback` ✅ (auto-detected from origin)
- **Phone Dev**: Will use phone's IP (auto-detected)
- **Production**: Same as Supabase config

---

## Step 4: Test Google OAuth

### Test on Web Browser
1. Go to `http://localhost:3003/auth/sign-up` (or your local port)
2. Click **Continue with Google**
3. Choose your Google account
4. You should be redirected to dashboard
5. ✅ Success!

### Test on Phone
1. Open app on phone at your development server
2. Click **Continue with Google**
3. Should redirect back to app automatically
4. ✅ Success!

---

## Common Issues & Fixes

### Issue 1: "This site can't be reached" After Choosing Account

**Causes:**
1. Google OAuth not enabled in Supabase
2. Redirect URL mismatch between Google and Supabase
3. Client ID/Secret wrong or missing

**Fix:**
```bash
# Verify in Supabase
1. Go to Authentication → Providers → Google
2. Check if toggle is ON (blue)
3. Verify Client ID matches Google Console
4. Verify Client Secret is set
5. Check redirect URL in Google Console includes:
   https://xtcxmhecspvuttdjknmh.supabase.co/auth/v1/callback?provider=google
```

### Issue 2: Redirect Back to Sign-up With Error

**This is progress!** The callback route is working. Check:
1. Check browser console for error details
2. Look at error message on screen
3. Verify all credentials are correct

### Issue 3: Works on Web but Not on Phone

**Causes:**
- Phone using different network IP
- Phone's redirect URL not in Google OAuth settings
- Capacitor configuration issue

**Fix:**
```bash
# Add your phone's IP to Google OAuth redirect URLs:
http://10.127.40.216:3000/auth/callback
http://10.127.40.216:3001/auth/callback
http://10.127.40.216:3002/auth/callback
http://10.127.40.216:3003/auth/callback
```

### Issue 4: "Supabase is not configured"

**Cause:** Missing environment variables

**Fix:**
```bash
# Check .env.local has:
NEXT_PUBLIC_SUPABASE_URL="https://xtcxmhecspvuttdjknmh.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_..."
```

---

## Troubleshooting Checklist

- [ ] Google OAuth credentials created in Google Cloud Console
- [ ] Client ID copied from Google Console
- [ ] Client Secret copied from Google Console
- [ ] Google provider ENABLED in Supabase (toggle is blue/ON)
- [ ] Client ID pasted in Supabase
- [ ] Client Secret pasted in Supabase
- [ ] Supabase changes saved
- [ ] Redirect URL in Google Console includes: `https://xtcxmhecspvuttdjknmh.supabase.co/auth/v1/callback?provider=google`
- [ ] Environment variables in `.env.local` are correct
- [ ] App restarted after env changes
- [ ] Tried signing up with fresh browser/incognito

---

## Quick Verification Script

Run this in browser console while on sign-up page:

```javascript
// Check if Supabase is configured
console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log("Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 20) + "...")
console.log("Environment:", process.env.NODE_ENV)
```

Expected output:
```
Supabase URL: https://xtcxmhecspvuttdjknmh.supabase.co
Supabase Key: sb_publishable_DU0wJAQSPh...
Environment: production (or development)
```

---

## After Setup: What Should Happen

### Sign-up Flow:
1. User clicks "Continue with Google"
2. Redirects to Google login
3. User selects account
4. Google redirects to Supabase
5. Supabase redirects to `/auth/callback` with code
6. App exchanges code for session
7. User redirected to `/dashboard` (or `/municipal` if municipal official)
8. ✅ User logged in!

---

## Need Help?

1. **Check Supabase logs**: https://app.supabase.com/project/[project-id]/logs
2. **Check Google OAuth audit**: Google Cloud Console → APIs & Services → OAuth 2.0 Playground
3. **Enable debug mode**: Check browser DevTools → Network tab during OAuth flow
4. **View the redirect URL**: It should show the code parameter when redirecting to callback

---

## Environment Variables Reference

```bash
# Required for Google OAuth to work:
NEXT_PUBLIC_SUPABASE_URL="https://xtcxmhecspvuttdjknmh.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_DU0wJAQSPhTglAmemY7YTQ_5yzMb24_"

# Optional but recommended for local development:
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL="http://localhost:3000/auth/callback"
```

---

**Last Updated**: Nov 18, 2025
**Status**: Google OAuth handler created and callback route improved ✅
