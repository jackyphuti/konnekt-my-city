# 🚀 APK Build Guide - Konnekt My City

## ⚠️ Important: Web Server Required

Since your app uses **dynamic server-side rendering** (for real-time data and APIs), the APK approach requires a running web server. Here are your options:

---

## 🎯 Option 1: APK with Local Dev Server (Fastest) ⭐ RECOMMENDED

This is the quickest way to test on Android.

### **Step 1: Start the production server**
```bash
npm run build
npm start
```
This starts the Next.js server on `http://localhost:3000`

### **Step 2: Get your computer's IP**
```bash
hostname -I
# Example output: 192.168.1.100
```

### **Step 3: Update Capacitor config**
Edit `capacitor.config.ts`:
```typescript
const config: CapacitorConfig = {
  appId: 'com.konnektmycity.app',
  appName: 'Konnekt My City',
  server: {
    url: 'http://192.168.1.100:3000',  // Your computer's IP
    cleartext: true  // Allow HTTP (development only)
  }
};
```

### **Step 4: Build and sync**
```bash
npx cap copy
npx cap open android
```

### **Step 5: Build APK in Android Studio**
- Click: **Build** → **Build Bundle(s)/APK(s)** → **Build APK(s)**
- Wait for build to complete
- APK saved at: `android/app/release/app-release.apk`

### **Step 6: Install on phone**
```bash
adb install android/app/release/app-release.apk
```

---

## 🎯 Option 2: Static Export APK (More Complex)

For a true standalone APK that doesn't need a server:

### **Update next.config.mjs:**
```javascript
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};
```

### **Remove dynamic routes:**
- Remove dynamic route `/issues/[id]`  
- Use static pages instead

### **Then build:**
```bash
npm run build
npx cap copy
npx cap open android
```

**Pros:** No server needed
**Cons:** Loses real-time features, more complex

---

## 🎯 Option 3: Firebase Hosting (Production) ⭐ BEST FOR PRODUCTION

For production, host on Firebase or similar and point the APK there.

```typescript
const config: CapacitorConfig = {
  appId: 'com.konnektmycity.app',
  appName: 'Konnekt My City',
  server: {
    url: 'https://your-app.firebase.com',
  }
};
```

---

## 🔄 Let's Build Using Option 1 (Fastest)

### **Step-by-Step:**

1. **Update capacitor.config.ts:**

```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.konnektmycity.app',
  appName: 'Konnekt My City',
  webDir: 'public',  // PWA files
  server: {
    url: 'http://192.168.1.100:3000',  // 🚨 CHANGE THIS TO YOUR IP
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

export default config;
```

2. **Copy web assets:**
```bash
npx cap copy
```

3. **Open Android Studio:**
```bash
npx cap open android
```

4. **In Android Studio, build APK:**
- Connect Android device (USB debugging enabled)
- Or start Android emulator
- Click: **Build** → **Build Bundle(s)/APK(s)** → **Build APK(s)**
- Select **Release**
- Wait 5-10 minutes

5. **Install APK:**
```bash
adb install android/app/release/app-release.apk
```

6. **On phone:**
- App will load from your computer's web server
- Make sure phone is on same WiFi as computer
- Server must be running (`npm start`)

---

## 📱 Android Studio Setup

### **If Android Studio not installed:**

For Linux:
```bash
# Install Android Studio
sudo snap install android-studio --classic

# Or download from:
# https://developer.android.com/studio
```

### **If Android SDK not set up:**

1. Open Android Studio
2. Go to: **Tools** → **SDK Manager**
3. Install:
   - Android SDK Platform 33+ (or latest)
   - Android SDK Build-Tools
   - Android Emulator
   - Android SDK Platform-Tools

---

## 🔑 Prerequisites Check

```bash
# 1. Check Java
java -version

# 2. Check Android SDK
ls -la ~/Android/Sdk/

# 3. Check Node.js
node --version
npm --version

# 4. Check Capacitor
npx cap --version
```

If any are missing, install them first.

---

## 📋 Complete APK Build Workflow

```bash
# 1. Install dependencies
npm install @capacitor/core @capacitor/cli --save --legacy-peer-deps

# 2. Initialize Capacitor
npx cap init "Konnekt My City" "com.konnektmycity.app"

# 3. Install Android
npm install @capacitor/android --save --legacy-peer-deps

# 4. Add Android platform
npx cap add android

# 5. Build Next.js app
npm run build

# 6. Copy web assets to Android
npx cap copy

# 7. Sync and open Android Studio
npx cap open android

# 8. In Android Studio:
# - Click Build → Build APK(s)
# - Select your phone from device list
# - Wait for build to complete

# 9. Install on phone (from terminal):
adb install android/app/release/app-release.apk

# 10. Done! 🎉
```

---

## 🐛 Troubleshooting

### **APK won't install**
```bash
# First uninstall old version
adb uninstall com.konnektmycity.app

# Then install new APK
adb install android/app/release/app-release.apk
```

### **App won't connect to server**
- Check computer's IP: `hostname -I`
- Update capacitor.config.ts with correct IP
- Make sure phone on same WiFi
- Ensure `npm start` is running on computer
- Check: `adb logcat | grep konnekt`

### **Build fails in Android Studio**
- Update Android SDK Platform
- Update Gradle
- Check Java version (should be 11+)
- Clean build: **Build** → **Clean Project**

### **No permission to build**
```bash
# Give execute permission
chmod +x gradlew
chmod +x android/gradlew
```

---

## 📊 Build Time Estimates

- Build Next.js: 2-3 minutes
- Android Studio build: 5-10 minutes
- Install on phone: 1-2 minutes
- **Total: 10-15 minutes**

---

## 🚀 Next Steps After APK

1. **Test on phone** (all features)
2. **Sign APK** for Play Store
3. **Upload to Google Play Store**

### **To sign APK:**

```bash
# 1. Create keystore (one time)
keytool -genkey -v -keystore konnekt-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias konnekt

# 2. Sign APK
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore konnekt-key.jks android/app/release/app-release-unsigned.apk konnekt

# 3. Align APK
zipalign -v 4 android/app/release/app-release-unsigned.apk konnekt-my-city-release.apk

# Now you have: konnekt-my-city-release.apk
# Ready for Play Store! 🎉
```

---

## 💡 Pro Tips

1. **Keep server running** - App needs to connect while testing
2. **Use emulator first** - Test before installing on real phone
3. **Monitor logs** - `adb logcat` shows errors
4. **Clear cache** - If app behaves strangely
5. **Use same WiFi** - Phone and computer must be on same network

---

## ✅ Checklist Before Building

- [ ] Java JDK installed
- [ ] Android Studio installed
- [ ] Android SDK configured
- [ ] Capacitor initialized
- [ ] Android platform added
- [ ] Next.js built
- [ ] Computer IP known
- [ ] capacitor.config.ts updated with IP
- [ ] npm start ready to run

---

## 🎯 Ready to Build?

Let's do this! 🚀

**First, make sure you have:**
1. ✅ Java installed
2. ✅ Android Studio installed
3. ✅ All Capacitor packages installed

Then run the workflow above!

---

**Status:** Ready to build APK! 📱
**Date:** November 13, 2025
