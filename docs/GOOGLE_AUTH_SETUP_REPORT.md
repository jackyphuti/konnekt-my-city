# Google OAuth Authentication Setup Report

## ❌ **Current Status: MISSING GOOGLE API KEYS**

Your application currently does NOT have Google API Keys configured, but it has code that attempts to use Google OAuth.

---

## 🔍 **What We Found:**

### **Current Implementation:**
Your code uses Supabase's built-in OAuth provider:

```typescript
// In app/auth/login/page.tsx and app/auth/sign-up/page.tsx
const { error } = await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
  },
})
```

### **Where OAuth Calls Exist:**
1. ✅ **Login Page** (`/app/auth/login/page.tsx`)
   - "Continue with Google" button
   - `handleGoogleSignIn()` function
   - OAuth redirect enabled

2. ✅ **Sign-up Page** (`/app/auth/sign-up/page.tsx`)
   - "Continue with Google" button
   - `handleGoogleSignUp()` function
   - OAuth redirect enabled

3. ✅ **Municipal Sign-up Page** (`/app/auth/municipal-sign-up/page.tsx`)
   - ⚠️ Missing Google Auth button (optional for municipal officials)

### **Environment Variables:**
- ❌ NO `GOOGLE_CLIENT_ID` in `.env.local`
- ❌ NO `GOOGLE_CLIENT_SECRET` in `.env.local`
- ❌ NO `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in `.env.local`

---

## ⚠️ **What Will Happen Currently:**

When a user clicks "Continue with Google":
1. Supabase will attempt to redirect to Google OAuth
2. **FAILS** because Google OAuth provider is not configured in Supabase
3. User gets error: "Missing OAuth configuration for provider 'google'"

---

## 🔧 **How to Fix: Setup Google OAuth**

### **Step 1: Create Google OAuth Credentials**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
5. Choose **"Web application"**
6. Add Authorized redirect URIs:
   - For development: `http://localhost:3000/auth/callback`
   - For development (port 3001): `http://localhost:3001/auth/callback`
   - For production: `https://yourdomain.com/auth/callback`

7. You'll get:
   - **Client ID** (looks like: `xxxxx.apps.googleusercontent.com`)
   - **Client Secret** (looks like: `GOCSPX-xxxxx`)

---

### **Step 2: Configure Supabase OAuth Provider**

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project: **konnekt-my-city** (ID: `xtcxmhecspvuttdjknmh`)
3. Go to **Authentication** → **Providers**
4. Find **Google** provider
5. Toggle it **ON**
6. Enter:
   - **Client ID:** Your Google Client ID
   - **Client Secret:** Your Google Client Secret
7. Click **Save**

---

### **Step 3: Update Your `.env.local`** (Optional - for reference only)

While not required (Supabase handles it), you can add to `.env.local`:

```bash
# Google OAuth (configured in Supabase)
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
# Note: Never put CLIENT_SECRET in public env vars
```

---

### **Step 4: Update Your Redirect URL**

In `app/auth/callback/route.ts`:

```typescript
// This should already be correct, but verify:
const redirectUrl = `${window.location.origin}/auth/callback`
```

Current redirect in code:
- `localhost:3000/auth/callback` (local dev)
- `localhost:3001/auth/callback` (alternate port)
- Production URL (when deployed)

---

## ✅ **Verification Steps**

After setting up Google OAuth:

1. **Local Testing:**
   ```bash
   npm run dev
   # Navigate to http://localhost:3000/auth/login
   # Click "Continue with Google"
   # You should be redirected to Google login
   ```

2. **Check for Errors:**
   - Open browser DevTools (F12)
   - Look for errors in Console tab
   - Should see redirect to Google, not an error

3. **Verify Callback:**
   - After Google login, should redirect back to your app
   - Should create user in Supabase `auth.users` table
   - Should create profile in `profiles` table

---

## 📋 **Current OAuth Configuration Checklist**

- ❌ Google API credentials obtained
- ❌ Google Client ID configured
- ❌ Google Client Secret configured
- ❌ Supabase OAuth provider enabled
- ❌ Redirect URLs configured in Google Console
- ✅ Code implementation (already done)
- ✅ Buttons in UI (already done)
- ✅ Error handling (already done)

---

## 🚀 **Optional: Add Google Auth to Municipal Sign-up**

Currently `/app/auth/municipal-sign-up/page.tsx` does NOT have a Google OAuth button.

If you want officials to also be able to sign up with Google, add:

```tsx
// Add to municipal-sign-up/page.tsx
const handleGoogleSignUp = async () => {
  setIsGoogleLoading(true)
  setError(null)

  try {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        data: {
          user_type: "municipal_official",
        }
      },
    })
    if (error) throw error
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("Supabase is not configured")) {
      setError("Database connection not configured. Please contact the administrator or check the setup guide.")
    } else {
      setError(error instanceof Error ? error.message : "An error occurred")
    }
    setIsGoogleLoading(false)
  }
}
```

---

## 📊 **Summary**

| Item | Status | Notes |
|------|--------|-------|
| Google OAuth Code | ✅ Present | Login & Sign-up pages ready |
| Google API Keys | ❌ Missing | Need to generate |
| Supabase Config | ❌ Not Enabled | Need to enable provider |
| Environment Variables | ❌ Not Set | Optional but recommended |
| Redirect URLs | ✅ Correct | Properly configured in code |
| Error Handling | ✅ Good | User-friendly error messages |

---

## 🎯 **Next Steps**

1. **Get Google OAuth credentials** from Google Cloud Console
2. **Enable Google provider** in Supabase dashboard
3. **Test locally** with `npm run dev`
4. **Deploy changes** (no code changes needed, just Supabase config)

---

## 💡 **Important Notes**

- **Client ID** can be public (it's already in web apps)
- **Client Secret** must be kept secret (Supabase stores it securely)
- **Redirect URL** must match exactly in Google Console and code
- **localhost domains** work in dev, but production needs HTTPS URL
- **Different OAuth per domain** - you may need different credentials for dev/production

---

## 🔗 **Useful Resources**

- [Google OAuth Setup Guide](https://cloud.google.com/docs/authentication/oauth-2d)
- [Supabase Google Auth Docs](https://supabase.com/docs/guides/auth/oauth-2)
- [Supabase Dashboard](https://app.supabase.com/project/xtcxmhecspvuttdjknmh/auth/providers)

