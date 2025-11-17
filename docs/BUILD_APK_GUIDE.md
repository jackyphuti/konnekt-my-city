# 🎯 Build APK for Your Phone

## ✅ Build Steps in Android Studio

The app is working! Now let's build the APK file to install on your phone.

### **Step 1: In Android Studio**

1. Click: **Build** (top menu)
2. Select: **Build Bundle(s)/APK(s)**
3. Click: **Build APK(s)**

### **Step 2: Select Release Type**

A dialog will appear. Select:
- **app** (should be highlighted)
- Click: **Build APK(s)** button

### **Step 3: Wait for Build**

⏱️ **Build takes 5-10 minutes**

You'll see:
- Build progress bar at bottom
- Status messages in the build window
- Eventually: ✅ **"BUILD SUCCESSFUL"**

### **Step 4: Find Your APK**

Android Studio shows notification:
```
App release APK has been generated successfully.
Click to open in folder.
```

Or find it manually at:
```
android/app/release/app-release.apk
```

---

## 📱 Install APK on Your Phone

### **Method 1: Using ADB (Easiest)**

```bash
# Connect phone via USB
# Enable USB Debugging on phone

# Then run:
adb install android/app/release/app-release.apk
```

### **Method 2: Manual Transfer**

1. Copy `android/app/release/app-release.apk` to phone
2. Use file manager on phone to navigate to the file
3. Tap the APK file
4. Click: **Install**
5. Confirm installation

---

## ⚙️ Phone Setup (Before Installing)

### **Enable USB Debugging:**
1. Go to: **Settings** → **About Phone**
2. Tap "Build Number" 7 times (until "Developer Mode" message)
3. Go to: **Settings** → **Developer Options**
4. Enable: **USB Debugging**
5. Connect phone via USB to computer

### **Authorize Connection:**
- Look for authorization prompt on phone
- Tap: **Allow** or **OK**

---

## 🚀 After Installation

### **On Your Phone:**
1. Open **App Drawer**
2. Find: **"Konnekt My City"**
3. Tap to launch
4. First load may take 10-15 seconds

### **Important:**
- **Keep Next.js server running** - `npm start` must stay on
- **Phone must be on same WiFi** as your computer
- **Firewall must allow port 3000** - Check if needed

---

## 📊 Build Information

| Item | Value |
|------|-------|
| APK Location | `android/app/release/app-release.apk` |
| App ID | com.konnektmycity.app |
| App Name | Konnekt My City |
| Build Type | Release |
| Expected Build Time | 5-10 minutes |

---

## 🐛 Troubleshooting

### **Build Fails:**
1. In Android Studio: **Build** → **Clean Project**
2. Wait for clean to finish
3. Then: **Build** → **Build APK(s)** again

### **ADB Installation Fails:**
```bash
# First uninstall old version
adb uninstall com.konnektmycity.app

# Then install new APK
adb install android/app/release/app-release.apk
```

### **Phone Not Recognized:**
```bash
# Check connected devices
adb devices

# If empty:
# 1. Enable USB Debugging on phone
# 2. Tap Allow on authorization prompt
# 3. Try: adb devices again
```

### **App Won't Load on Phone:**
1. Check phone is on **same WiFi** as computer
2. Check `npm start` is **still running**
3. Check IP address in capacitor.config.ts matches your computer IP
4. Try turning WiFi off/on on phone

---

## ✅ Checklist

- [ ] Android Studio opened with android project
- [ ] Build → Build APK(s) clicked
- [ ] Build completed successfully
- [ ] APK file created at `android/app/release/app-release.apk`
- [ ] Phone connected via USB
- [ ] USB Debugging enabled
- [ ] ADB install command run
- [ ] App installed on phone
- [ ] npm start still running
- [ ] App launches on phone
- [ ] Features working on phone

---

## 🎉 You're Ready!

Just follow the steps above and you'll have your APK ready to test on your phone!

**Let me know when the build is complete or if you hit any issues.** 🚀

---

**Date:** November 13, 2025
**Status:** Ready to Build APK
