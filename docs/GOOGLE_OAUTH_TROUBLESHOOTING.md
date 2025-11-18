# Google OAuth Issue Diagnosis & Fix

## The Problem You're Experiencing

**When you tap "Continue with Google" on your phone:**
1. ✅ Google login appears
2. ✅ You select your Google account
3. ❌ After selection → "This site can't be reached"

---

## Root Causes

### 1. **Google OAuth Not Enabled in Supabase** (MOST LIKELY)
Your Supabase project doesn't have Google provider configured.

**How to check:**
1. Go to: https://app.supabase.com/project/[project-id]/auth/providers
2. Look for "Google"
3. If it's GRAY/OFF → This is your problem!

**Solution:** See **GOOGLE_OAUTH_SETUP.md** for step-by-step instructions

---

### 2. **Redirect URL Mismatch** (SECOND MOST LIKELY)
Even if Google OAuth is enabled, the redirect URL might not match what Google expects.

**Where this happens:**
- Google OAuth Console expects: `https://xtcxmhecspvuttdjknmh.supabase.co/auth/v1/callback?provider=google`
- Your phone is using: `http://10.127.40.216:3000/auth/callback`
- These don't match → Google rejects the callback

**Solution:**
- For **production**: Add `https://xtcxmhecspvuttdjknmh.supabase.co/auth/v1/callback?provider=google` to Google OAuth
- For **phone dev**: Add your phone's IP + port to Google OAuth redirect URLs

---

### 3. **Missing or Wrong Credentials**
The Client ID or Client Secret is missing/wrong in Supabase.

**How to check:**
1. Go to: https://app.supabase.com/project/[project-id]/auth/providers
2. Click Google
3. Look at the Client ID and Client Secret fields
4. If empty or showing errors → This is your problem!

---

## What I Fixed in This Update

✅ **Better error handling in callback route** (`/app/auth/callback/route.ts`)
- Now catches OAuth errors from Google
- Shows user-friendly error messages
- Redirects back to sign-up WITH error message instead of failing silently

✅ **Error display on all auth pages**
- Sign-up page: Now shows OAuth errors from URL
- Municipal sign-up: Now shows OAuth errors from URL  
- Login page: Now shows OAuth errors from URL

✅ **Comprehensive setup guide** (`/GOOGLE_OAUTH_SETUP.md`)
- Complete step-by-step Supabase OAuth configuration
- Google Cloud Console credential setup
- Testing instructions for web & phone
- Troubleshooting for common issues

---

## What Still Needs to Be Done

### 1. **CRITICAL: Enable Google OAuth in Supabase**

**Go here NOW:**
```
https://app.supabase.com/project/xtcxmhecspvuttdjknmh/auth/providers
```

**Then:**
1. Click **Google**
2. Toggle to **ON** (if it's OFF)
3. If already ON, check if Client ID is filled
4. If empty, go to Google Cloud Console to get credentials
5. See **GOOGLE_OAUTH_SETUP.md** for detailed steps

### 2. **Get Google OAuth Credentials**

**Go here:**
```
https://console.cloud.google.com/apis/credentials
```

**Create OAuth 2.0 Client ID:**
- Type: Web application
- Add redirect URL: `https://xtcxmhecspvuttdjknmh.supabase.co/auth/v1/callback?provider=google`
- For phone testing, also add: `http://10.127.40.216:3000/auth/callback`
- Copy Client ID and Client Secret

### 3. **Add Credentials to Supabase**

1. Go to: https://app.supabase.com/project/xtcxmhecspvuttdjknmh/auth/providers
2. Click Google
3. Paste Client ID
4. Paste Client Secret
5. Click Save
6. ✅ Done!

---

## Testing After Setup

### Test 1: Web Browser (Easiest)
```bash
# Start dev server
npm run dev

# Open browser to
http://localhost:3003/auth/sign-up

# Click "Continue with Google"
```

**What should happen:**
1. Redirected to Google login
2. Select account
3. Redirected back to dashboard
4. ✅ Logged in!

### Test 2: Phone (What You Want to Test)
```bash
# Make sure phone is on same network

# Phone opens:
http://10.127.40.216:3003/auth/sign-up

# Click "Continue with Google"
```

**What should happen:**
- Same as web browser but on phone

---

## Error Messages After My Fix

If you still get an error, it will now show WHAT the error is:

| Error Message | Cause | Fix |
|---|---|---|
| "Authentication failed" | Code exchange failed | Check Supabase callback route |
| "OAuth2 error" | Google rejected request | Check redirect URL in Google |
| "Invalid client" | Wrong Client ID | Verify Client ID in Supabase |
| "Invalid client secret" | Wrong Client Secret | Verify Client Secret in Supabase |
| "Redirect URI mismatch" | URL not in Google approved list | Add full URL to Google OAuth |

---

## Quick Checklist

Before saying "it still doesn't work", verify:

- [ ] Went to https://app.supabase.com/project/xtcxmhecspvuttdjknmh/auth/providers
- [ ] Clicked Google provider
- [ ] Saw the toggle was ON (blue)
- [ ] Saw Client ID was filled in
- [ ] Saw Client Secret was filled in
- [ ] Went to Google Cloud Console
- [ ] Found OAuth 2.0 Client ID
- [ ] Added redirect URL: `https://xtcxmhecspvuttdjknmh.supabase.co/auth/v1/callback?provider=google`
- [ ] Tested on web browser first (easier to debug)
- [ ] Checked browser console for error details
- [ ] Read the error message that now appears on sign-up page

---

## What My Code Changes Do

### New Error Handling in Callback Route
```typescript
// Before: Just failed silently
// After: Shows error message to user
if (error) {
  return NextResponse.redirect(
    `${origin}/auth/sign-up?error=${encodeURIComponent(errorDescription || error)}`
  )
}
```

### New Error Detection on All Auth Pages
```typescript
// Detects error in URL query params
useEffect(() => {
  const errorParam = searchParams.get("error")
  if (errorParam) {
    setError(decodeURIComponent(errorParam))
  }
}, [searchParams])
```

### Role-Based Redirect After OAuth
```typescript
// Check if municipal official or citizen
if (profile?.user_type === "municipal_official") {
  return redirect to /municipal
} else {
  return redirect to /dashboard
}
```

---

## Next Steps

1. **If Google OAuth not enabled yet:**
   - Follow steps in **GOOGLE_OAUTH_SETUP.md**
   - Enable provider in Supabase
   - Add credentials
   - Test on web first

2. **If Google OAuth already enabled:**
   - Test on web to see if error message appears
   - Report what error message you see
   - We can debug from there

3. **If it works on web but not phone:**
   - Add phone IP to Google OAuth redirect URLs
   - Or deploy to Vercel (easier than managing IPs)

---

## Files Modified in This Update

1. `/app/auth/callback/route.ts` - Better error handling
2. `/app/auth/sign-up/page.tsx` - Error detection from URL
3. `/app/auth/municipal-sign-up/page.tsx` - Error detection from URL
4. `/app/auth/login/page.tsx` - Error detection from URL
5. `/GOOGLE_OAUTH_SETUP.md` - New comprehensive guide

---

**Status:** ✅ Code ready for Google OAuth  
**What's blocking:** Supabase Google provider configuration  
**Action Required:** Follow GOOGLE_OAUTH_SETUP.md steps
