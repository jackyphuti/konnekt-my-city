# 🔧 APK Installation Issue - Solution

## ⚠️ Problem

The APK is marked as "test-only" and cannot be installed directly on a device.

**Error:** `Failure [INSTALL_FAILED_TEST_ONLY: installPackageLI]`

---

## ✅ Solution: Rebuild APK for Release

The current APK is a **debug test build**. We need to build a **release APK** instead.

### **Option 1: Build Release APK in Android Studio (Recommended)**

1. **In Android Studio**, go to: **Build** → **Build Bundle(s)/APK(s)** → **Build APK(s)**
2. A dialog appears asking for build variant
3. **Select: release** (NOT debug)
4. Click: **Build APK(s)**
5. Wait 5-10 minutes for build

Once complete, the APK will be at:
```
android/app/release/app-release.apk
```

Then install:
```bash
adb install android/app/release/app-release.apk
```

---

### **Option 2: Force Install Debug APK (Workaround)**

If you want to test the debug APK:

```bash
adb install -r /home/jacky-mpoka/Documents/Dev/konnekt\ my\ city\ app/my-app/android/app/build/intermediates/apk/debug/app-debug.apk
```

**This may not work** because of the test-only flag, but worth trying.

---

### **Option 3: Modify Build to Allow Installation**

Edit the Android build file to allow test APK installation:

**File:** `android/app/build.gradle`

Find this section:
```gradle
buildTypes {
    release {
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    }
}
```

And change it to:
```gradle
buildTypes {
    debug {
        debuggable true
        testOnly false
    }
    release {
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    }
}
```

Then rebuild in Android Studio: **Build** → **Clean Project** → **Build** → **Build APK(s)**

---

## 🎯 Recommended Path

**Build Release APK** (Best for phone testing):

1. In Android Studio: **Build** → **Build Bundle(s)/APK(s)** → **Build APK(s)**
2. Select: **release**
3. Wait for build
4. Once done, use command:
   ```bash
   adb install android/app/release/app-release.apk
   ```

---

## 📱 Phone Requirements

Make sure your phone is:
- ✅ Connected via USB
- ✅ File transfer mode enabled (drag & drop works)
- ✅ OR USB Debugging enabled (for `adb install` command)

---

## 🔍 Verification

After building, verify APK exists:

```bash
# For release APK
ls -lh android/app/release/app-release.apk

# For debug APK
ls -lh android/app/build/intermediates/apk/debug/app-debug.apk
```

---

## 💡 Next Steps

1. **In Android Studio:** Build → Build APK(s) → Select **release**
2. **Wait** for build (5-10 minutes)
3. **Notify me** when build is complete
4. **Then run:** `adb install android/app/release/app-release.apk`

---

**Which option would you like to try?**

1. **Build release APK** (Recommended) - Takes 5-10 minutes but works perfectly
2. **Try force install** of debug APK (may not work)
3. **Manual transfer** - Copy APK to phone via USB file transfer

---

**Date:** November 13, 2025
**Status:** Ready to Build Release APK
