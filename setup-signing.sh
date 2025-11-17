#!/bin/bash

# Konnekt My City - Google Play Signing Setup
# This script generates a keystore and configures signing

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     Konnekt My City - Google Play Signing Setup                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if keystore already exists
if [ -f "konnekt-keystore.jks" ]; then
    echo "⚠️  Keystore already exists!"
    read -p "Overwrite? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cancelled."
        exit 1
    fi
fi

echo "🔐 Generating signing keystore..."
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "You'll be asked to provide information for your certificate."
echo "Answer the prompts below:"
echo ""

keytool -genkey -v -keystore konnekt-keystore.jks \
    -keyalg RSA -keysize 2048 -validity 10000 \
    -alias konnekt_key

echo ""
echo "✅ Keystore created: konnekt-keystore.jks"
echo ""
echo "🔒 IMPORTANT - Save this information:"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Keystore file: konnekt-keystore.jks"
echo "Key alias: konnekt_key"
echo ""
echo "⚠️  NEVER commit this file to git!"
echo "⚠️  Keep your password safe!"
echo ""
echo "📝 Adding to .gitignore..."
echo "konnekt-keystore.jks" >> .gitignore
echo "✅ Done!"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "🚀 NEXT STEP: Build signed release APK"
echo "Run: ./build-release.sh"
echo ""
