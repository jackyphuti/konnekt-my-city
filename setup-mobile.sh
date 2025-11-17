#!/bin/bash

# Konnekt My City - Mobile App Setup Script
# This script helps set up Capacitor for building APK

echo "🚀 Konnekt My City - Mobile App Setup"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm found: $(npm --version)"
echo ""

# Install Capacitor globally (optional but recommended)
echo "📦 Installing Capacitor CLI..."
npm install -g @capacitor/cli

echo ""
echo "📦 Installing Capacitor packages locally..."
npm install @capacitor/core @capacitor/cli

# Check if Java is installed (required for Android)
if command -v java &> /dev/null; then
    echo "✅ Java found: $(java -version 2>&1 | head -n 1)"
else
    echo "⚠️  Java not found. You'll need it to build APK."
    echo "   Download from: https://www.oracle.com/java/technologies/downloads/"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Build the app: npm run build"
echo "2. Initialize Capacitor: npx cap init"
echo "3. Add Android: npm install @capacitor/android && npx cap add android"
echo "4. Copy assets: npx cap copy"
echo "5. Open Android Studio: npx cap open android"
echo "6. Build APK from Android Studio"
echo ""
echo "For detailed guide, see MOBILE_APP_GUIDE.md"
