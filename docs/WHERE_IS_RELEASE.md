# 📍 Where to Find "Release" in Android Studio

## 🎯 Build Release APK - Step by Step

### **Step 1: Click Build Menu**
In Android Studio, click: **Build** (top menu bar)

You'll see a dropdown menu appear.

---

### **Step 2: Find "Generate App Bundles or APKs"**

In the Build menu, look for:
```
Generate App Bundles or APKs
```

Hover over it (there's an arrow ►), it will expand to show:

```
├─ Generate Signed Bundle/APK...
└─ Generate App Bundles or APKs (with submenu)
```

---

### **Step 3: Click the Right Option**

You have two options:

**Option A: Build Signed Release APK (Recommended for Play Store)**
```
Build → Generate Signed Bundle/APK...
```
- Asks for signing key
- Produces production APK
- Can be uploaded to Play Store

**Option B: Build Unsigned Release APK (For Testing)**
```
Build → Generate App Bundles or APKs → APK (not Bundle)
```
- No signing needed
- Can be installed on phone immediately
- Best for testing

---

## 🔍 Visual Map of Android Studio Build Menu

```
Build (top menu)
├─ Compile All Sources
├─ Assemble (No Modules Selected) - grayed out
├─ Assemble Project
├─ Assemble Project with Tests
├─ Generate App Bundles or APKs ► (hover to expand)
│  └─ Build APK(s)
│     └─ You can select build variant here
├─ Analyze APK...
├─ Analyze Build Performance
├─ Clean Project
├─ Clean and Assemble Project with Tests
└─ Select Build Variant...
```

---

## 📋 For Testing on Your Phone

### **Fastest Method:**

1. Click: **Build**
2. Look for: **Build Bundle(s)/APK(s)** or **Generate App Bundles or APKs**
3. Click: **Build APK(s)**
4. A dialog appears asking for **build variant**
5. **Select: release** from the list
6. Click: **Build APK(s)** button
7. Wait 5-10 minutes

---

## 🖼️ Dialog That Appears

When you click "Build APK(s)", you'll see a dialog:

```
┌─────────────────────────────────────┐
│ Select Modules to Build             │
├─────────────────────────────────────┤
│ ☑ app                               │
│                                     │
│ Variants:                           │
│ ○ debug                             │
│ ◉ release  ← SELECT THIS            │
│                                     │
│ [Build APK(s)]  [Cancel]            │
└─────────────────────────────────────┘
```

**Select the "release" radio button**, then click **Build APK(s)**.

---

## ✅ Checklist

- [ ] Android Studio is open
- [ ] Click: Build (top menu)
- [ ] Find: "Build Bundle(s)/APK(s)" or "Generate App Bundles or APKs"
- [ ] Click: "Build APK(s)"
- [ ] Dialog appears
- [ ] Select: "release" (radio button)
- [ ] Click: "Build APK(s)" button
- [ ] Wait for build to complete

---

## 💡 If You're Confused

Look for these keywords in the Build menu:
- ✅ "Build APK(s)" - This is what you want
- ✅ "release" - This is the variant to select
- ❌ Don't use "debug" - That's what's failing

---

## 🚀 After Build Completes

Android Studio will show:
```
Build completed successfully for 1 module
Module 'app': locate or analyze
```

Then the APK is at:
```
android/app/release/app-release.apk
```

And install with:
```bash
adb install android/app/release/app-release.apk
```

---

**Let me know which option you see in your Build menu!** 📱

---

**Date:** November 13, 2025
