#!/bin/bash

# 🚀 Konnekt My City - APK BUILD SCRIPT
# Quick reference for building the APK

echo "
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║         🚀 APK BUILD - QUICK START GUIDE 🚀                       ║
║                                                                    ║
║              Konnekt My City Mobile App                           ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
"

echo "📱 YOUR APK BUILD INFORMATION"
echo "═══════════════════════════════════════════════════════════════════"
echo "Computer IP:        $(hostname -I | awk '{print $1}')"
echo "App Name:           Konnekt My City"
echo "App ID:             com.konnektmycity.app"
echo "Server Port:        3000"
echo ""

echo "🎯 QUICK START (2 TERMINALS)"
echo "═══════════════════════════════════════════════════════════════════"
echo ""
echo "TERMINAL 1 - Start Web Server:"
echo "  $ npm start"
echo ""
echo "TERMINAL 2 - Open Android Studio:"
echo "  $ npx cap open android"
echo ""

echo "📋 BUILD STEPS IN ANDROID STUDIO"
echo "═══════════════════════════════════════════════════════════════════"
echo "1. Connect Android phone with USB cable"
echo "2. Enable USB Debugging: Phone Settings → Developer Options"
echo "3. Click: Build → Build Bundle(s)/APK(s) → Build APK(s)"
echo "4. Wait 5-10 minutes for build"
echo "5. Android Studio will show success message"
echo ""

echo "💾 INSTALL APK ON PHONE"
echo "═══════════════════════════════════════════════════════════════════"
echo "$ adb install android/app/release/app-release.apk"
echo ""

echo "✅ VERIFY SETUP"
echo "═══════════════════════════════════════════════════════════════════"
echo ""
echo -n "Java JDK:        "
java -version 2>&1 | head -1
echo ""
echo -n "Node.js:         "
node --version
echo ""
echo -n "npm:             "
npm --version
echo ""
echo -n "Capacitor CLI:   "
npx cap --version 2>/dev/null || echo "Not installed"
echo ""

echo "📚 HELP DOCS"
echo "═══════════════════════════════════════════════════════════════════"
echo "Read these for more help:"
echo "  • APK_BUILD_READY.md - Next steps"
echo "  • APK_BUILD_GUIDE.md - Detailed guide"
echo "  • MOBILE_APP_GUIDE.md - Full mobile development guide"
echo ""

echo "🎊 READY TO BUILD!"
echo "═══════════════════════════════════════════════════════════════════"
echo ""
echo "Open 2 terminals and follow the quick start above."
echo ""
echo "Terminal 1: npm start"
echo "Terminal 2: npx cap open android"
echo ""
echo "Then build the APK in Android Studio!"
echo ""
echo "🚀 Let's go! 🚀"
echo ""
