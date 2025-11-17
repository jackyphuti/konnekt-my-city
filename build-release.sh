#!/bin/bash

# Konnekt My City - Build Signed Release APK
# This script builds a signed release APK for Google Play

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     Konnekt My City - Building Signed Release APK              ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if keystore exists
if [ ! -f "konnekt-keystore.jks" ]; then
    echo "❌ Error: konnekt-keystore.jks not found!"
    echo ""
    echo "Run this first:"
    echo "  ./setup-signing.sh"
    exit 1
fi

# Check if Android project exists
if [ ! -d "android" ]; then
    echo "❌ Error: android/ directory not found!"
    echo "Run from project root directory"
    exit 1
fi

echo "📱 Building Next.js app..."
echo "═══════════════════════════════════════════════════════════════"
npm run build
echo "✅ Next.js build complete"
echo ""

echo "🔄 Syncing to Capacitor..."
echo "═══════════════════════════════════════════════════════════════"
npx cap sync android
echo "✅ Synced"
echo ""

# Get password from user
echo "🔐 Signing Configuration"
echo "═══════════════════════════════════════════════════════════════"
read -sp "Enter keystore password: " KEYSTORE_PASS
echo ""
read -sp "Confirm password: " KEYSTORE_PASS_CONFIRM
echo ""

if [ "$KEYSTORE_PASS" != "$KEYSTORE_PASS_CONFIRM" ]; then
    echo "❌ Passwords don't match!"
    exit 1
fi

# Update gradle.properties with signing config
echo ""
echo "📝 Configuring Android Studio signing..."

cat > android/signing.properties << EOF
storeFile=../konnekt-keystore.jks
storePassword=$KEYSTORE_PASS
keyAlias=konnekt_key
keyPassword=$KEYSTORE_PASS
EOF

echo "✅ Signing configuration created"
echo ""

echo "🔨 Building signed release bundle..."
echo "═══════════════════════════════════════════════════════════════"
cd android

# Clean
./gradlew clean

# Build bundle for Play Store (recommended)
echo ""
echo "Building app bundle for Google Play Store..."
./gradlew bundleRelease

cd ..

echo ""
echo "✅ Build complete!"
echo ""
echo "📦 Your signed app bundle is ready:"
echo "═══════════════════════════════════════════════════════════════"
ls -lh android/app/build/outputs/bundle/release/app-release.aab
echo ""
echo "📂 Location: android/app/build/outputs/bundle/release/app-release.aab"
echo ""
echo "🚀 NEXT STEP: Upload to Google Play Console"
echo "═══════════════════════════════════════════════════════════════"
echo "1. Go to: https://play.google.com/console"
echo "2. Create new app"
echo "3. Upload app-release.aab to \"Release\" section"
echo "4. Add screenshots and description"
echo "5. Submit for review"
echo ""
echo "✅ All done! Ready to submit to Google Play Store!"
echo ""
