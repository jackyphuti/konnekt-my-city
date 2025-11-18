# iOS App Build Guide for Konnekt My City

## Prerequisites

Before you can build an iOS app, you need:

### 1. **Mac Computer** (Required)
- Xcode can only run on macOS
- Minimum: macOS 11 (Big Sur)
- Recommended: macOS 12+ (Monterey or later)

### 2. **Xcode** (Free from App Store)
```bash
# Install from Mac App Store or run:
xcode-select --install

# Verify installation:
xcode-select -p
# Should output: /Applications/Xcode.app/Contents/Developer
```

### 3. **CocoaPods** (Dependency Manager for iOS)
```bash
# Install CocoaPods
sudo gem install cocoapods

# Verify:
pod --version
```

### 4. **Node.js & npm** (Already have on your Linux machine)
- You'll need to do iOS build on Mac, not Linux
- Transfer project to Mac OR use remote Mac if available

### 5. **Apple Developer Account** (For App Store)
- Free account: Build for testing on your device
- Paid account ($99/year): Distribute on App Store
- Visit: https://developer.apple.com/

---

## Step 1: Build Next.js for Production

Run this on your Linux machine:

```bash
cd /home/jacky-mpoka/Documents/Dev/konnekt\ my\ city\ app/my-app

# Build the web version
npm run build

# This creates optimized files for the app
```

✅ **Output**: `/public` and `.next` folders ready for Capacitor

---

## Step 2: Update Capacitor Configuration

Before transferring to Mac, update `capacitor.config.ts`:

```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.konnektmycity.app',
  appName: 'Konnekt My City',
  webDir: 'public',
  // For production, use HTTPS and your actual domain
  // For testing, use local server
  server: {
    // Option 1: Local development
    // url: 'http://192.168.x.x:3000',  // Your Mac's WiFi IP
    // cleartext: true,
    
    // Option 2: Production (when deployed)
    // Remove this block to use the app's own static files
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

export default config;
```

---

## Step 3: Transfer Project to Mac

### Option A: Clone from GitHub (Easiest)
```bash
# On your Mac, clone the project:
git clone https://github.com/jackyphuti/konnekt-my-city.git
cd konnekt-my-city/my-app
npm install
```

### Option B: Copy Files Manually
```bash
# On Mac, copy the project folder from Linux to Mac via:
# - USB drive
# - Cloud storage (Google Drive, Dropbox)
# - SCP (if you have SSH access between machines)

scp -r user@linux-machine:/path/to/my-app ~/Desktop/my-app
```

---

## Step 4: Prepare iOS Project (On Mac)

```bash
# Navigate to project
cd ~/Desktop/my-app  # or wherever you copied it

# Install Node dependencies
npm install

# Build the Next.js app
npm run build

# Initialize Capacitor for iOS (if not done)
npx cap init

# Add iOS platform
npx cap add ios

# Copy web files to iOS
npx cap copy

# Sync all changes
npx cap sync ios
```

---

## Step 5: Open in Xcode

```bash
# Open the iOS project in Xcode
npx cap open ios
```

**OR** manually open:
```bash
open ios/App/App.xcworkspace
# Note: Open .xcworkspace, NOT .xcodeproj
```

---

## Step 6: Configure in Xcode

### 6a. Select Your Team (Required for App Store)
1. In Xcode, select **App** target (left sidebar)
2. Go to **Signing & Capabilities** tab
3. Under **Team**, select your Apple Developer account
4. If none, select **"None"** for local testing

### 6b. Set App Version & Build Number
1. Still in **App** target
2. Go to **General** tab
3. Set **Version**: `1.0.0` (or your version)
4. Set **Build**: `1`

### 6c. Configure Bundle Identifier (Optional, if needed)
1. Display Name: **Konnekt My City**
2. Bundle Identifier: `com.konnektmycity.app`

### 6d. Select Device or Simulator
1. Top toolbar, click on **iPhone 15** (or your device)
2. Or select **Any iOS Device (arm64)** for building for distribution

---

## Step 7: Build the App

### Option A: Build for Testing on Simulator
```bash
# In Xcode, press Cmd + B to build
# Or: Product → Build
```

### Option B: Build for Testing on Real Device
1. Connect iPhone to Mac with USB cable
2. Trust the developer certificate on iPhone
3. In Xcode, select your iPhone in device picker
4. Press Cmd + B to build

### Option C: Build for App Store
```bash
# In Xcode:
# 1. Select "Generic iOS Device" (or your team)
# 2. Product → Archive
# 3. This creates an archive for App Store submission
```

---

## Step 8: Run on Device or Simulator

### Run on Simulator
```bash
# In Xcode, press Cmd + R (Run)
# Or: Product → Run
# App will launch in simulator
```

### Run on Real Device
1. Connect iPhone
2. Select your iPhone in device picker (top toolbar)
3. Press Cmd + R (Run)
4. App will install and run on phone

---

## Step 9: Test the App

When app opens:
- ✅ Should show your Konnekt My City home page
- ✅ All buttons should work
- ✅ Navigation should work
- ✅ Can report issues
- ✅ Can view issues on map
- ✅ Can sign up / login

### Debug Issues
```bash
# In Xcode, press Cmd + Shift + C for Console
# Watch for errors in red
# Common issues:
# - "Cannot connect to server" → Check network
# - "JavaScript error" → Check browser console
# - "Network request failed" → Check Supabase URL
```

---

## Step 10: Distribute on App Store (Optional)

### 10a. Create App Store Listing
1. Go to: https://appstoreconnect.apple.com/
2. Click **My Apps** → **Create New App**
3. Fill in:
   - Platform: iOS
   - App Name: **Konnekt My City**
   - Bundle ID: `com.konnektmycity.app`
   - SKU: (auto-generated)
   - User Access: Select access level

### 10b. Complete App Information
1. Fill in **App Information**:
   - Category: Navigation or Utilities
   - Privacy Policy URL (required)
   - Contact Email

2. Fill in **Pricing and Availability**:
   - Price: Free or paid
   - Availability: Select countries

3. Add **Screenshots** (required):
   - 5-6 screenshots showing main features
   - Resolution: 1170x2532 px (iPhone 15 Pro Max)
   - Or use AppMockUp tools

4. Add **Description**:
   - Write compelling description (up to 1000 characters)
   - Highlight: Report issues, track fixes, municipal updates

5. Add **Keywords** (up to 100 characters):
   - "civic engagement, local issues, municipality, infrastructure"

6. Add **Support URL** (optional but recommended)

### 10c. Build and Submit
1. In Xcode, select **Product → Archive**
2. Click **Distribute App**
3. Select **App Store Connect**
4. Follow upload process
5. Review in App Store Connect
6. Submit for review

**Apple reviews in 24-48 hours** ✅

---

## Common Issues & Fixes

### Issue 1: "Team required to run on device"
**Fix:**
```
Xcode → App target → Signing & Capabilities
Select your Apple account as Team
```

### Issue 2: "Cannot connect to Supabase on device"
**Fix:**
```typescript
// Make sure capacitor.config.ts has:
server: {
  url: 'http://YOUR_MAC_IP:3000', // Your Mac's IP on WiFi
  cleartext: true,
}
// Run: npm run build && npx cap sync
```

### Issue 3: "Pod install failed"
**Fix:**
```bash
cd ios/App
rm -rf Pods Podfile.lock
pod install
```

### Issue 4: "App crashes on startup"
**Fix:**
```bash
# In Xcode Console (Cmd + Shift + C), look for errors
# Common causes:
# 1. Missing env variables
# 2. Supabase not reachable
# 3. JavaScript error in React code
```

### Issue 5: "Provisioning profile error"
**Fix:**
```
Xcode → App target → Signing & Capabilities
Change Team or create new provisioning profile automatically
```

---

## Development vs Production

### Development Build
```bash
# Run on simulator or local device
npm run build
npx cap sync ios
# Change capacitor.config.ts to point to your Mac's local server
```

### Production Build
```bash
# For App Store submission
npm run build
npx cap sync ios
# Remove 'server' from capacitor.config.ts (uses built-in files)
# Product → Archive in Xcode
# Distribute to App Store
```

---

## Quick Reference: Commands on Mac

```bash
# Initial setup
npm install
npm run build
npx cap add ios
npx cap sync ios

# Development
npx cap open ios              # Open in Xcode
npx cap copy                  # Copy web files
npx cap sync ios              # Sync all changes

# After making changes to React code
npm run build
npx cap copy
# Then refresh in Xcode/simulator (Cmd + R)

# Troubleshooting
npx cap doctor                # Check setup
pod repo update               # Update CocoaPods
```

---

## Timeline Estimate

- **Setup on Mac**: 30 minutes (first time only)
- **Build for simulator**: 5-10 minutes
- **Build for device**: 10-15 minutes
- **App Store submission**: 30 minutes setup + 24-48 hours review

---

## Next Steps

1. ✅ Get a Mac (requirement for iOS)
2. ✅ Install Xcode and CocoaPods
3. ✅ Transfer project to Mac
4. ✅ Run `npm install && npm run build`
5. ✅ Run `npx cap add ios && npx cap sync ios`
6. ✅ Open in Xcode: `npx cap open ios`
7. ✅ Press Cmd + R to run
8. ✅ Test on simulator or device
9. ✅ Prepare for App Store (if distributing)

---

## Resources

- **Capacitor iOS Docs**: https://capacitorjs.com/docs/ios
- **Xcode Tutorial**: https://developer.apple.com/xcode/
- **App Store Connect**: https://appstoreconnect.apple.com/
- **Apple Developer**: https://developer.apple.com/

---

## Support

If you run into issues:

1. **Check Xcode build output** - Look for detailed errors
2. **Run `npx cap doctor`** - Checks your environment
3. **Check Capacitor docs** - Most issues are covered
4. **Check Apple forums** - Search error messages

---

**Last Updated**: Nov 18, 2025  
**For**: Konnekt My City iOS Build
