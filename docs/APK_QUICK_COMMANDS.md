# 🚀 Quick APK Build & Install Commands

## Build APK in Android Studio

```
Build → Build Bundle(s)/APK(s) → Build APK(s) → Select release
```

⏱️ Wait 5-10 minutes for build to complete.

---

## Install APK on Phone

### Option 1: Using ADB (Fastest)

```bash
# After build completes
adb install android/app/release/app-release.apk
```

**Output should show:**
```
Success
```

### Option 2: Manual Install

1. Connect phone via USB
2. Copy: `android/app/release/app-release.apk`
3. Open on phone from file manager
4. Tap: Install
5. Confirm

---

## Check APK Location

```bash
# Verify APK was created
ls -lh android/app/release/app-release.apk
```

**Should show file size like:** `app-release.apk (15-25 MB)`

---

## Phone Setup

```bash
# Enable USB Debugging on phone:
# Settings → About Phone → Tap Build Number 7 times
# Settings → Developer Options → USB Debugging → ON

# Check if phone is recognized
adb devices
```

**Should show your phone listed.**

---

## Uninstall Old Version (If Needed)

```bash
adb uninstall com.konnektmycity.app
adb install android/app/release/app-release.apk
```

---

## Keep Server Running

In a separate terminal, keep this running:

```bash
cd ~/Documents/Dev/konnekt\ my\ city\ app/my-app
npm start
```

Your phone connects to: `http://10.127.40.216:3000`

---

## Test on Phone

1. **Tap app** in app drawer
2. **Wait 10-15 seconds** for first load
3. **Phone must be on same WiFi** as computer
4. **Server must keep running**

---

## Status Check

```bash
# Check if npm start is running
ps aux | grep "npm start"

# Check if port 3000 is open
netstat -an | grep 3000
```

---

**When build is complete, run:** `adb install android/app/release/app-release.apk`
