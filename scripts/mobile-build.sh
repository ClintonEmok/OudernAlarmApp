
#!/bin/bash

echo "=========================================="
echo "Building Ouderen Alarm for App Store Deployment"
echo "=========================================="

# Ensure we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if this is a production build
echo "🔍 Checking environment..."
if [ -z "$NODE_ENV" ]; then
    export NODE_ENV=production
    echo "✅ Set NODE_ENV to production"
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -rf android/app/src/main/assets/public/
rm -rf ios/App/public/

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to install dependencies"
    exit 1
fi

# Build the web app for production
echo "🏗️ Building web app for production..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error: Web build failed"
    exit 1
fi

# Verify build output
if [ ! -d "dist" ]; then
    echo "❌ Error: Build output directory 'dist' not found"
    exit 1
fi

echo "✅ Build output verified"

# Update Capacitor platforms
echo "🔄 Updating Capacitor platforms..."
npx cap update

if [ $? -ne 0 ]; then
    echo "❌ Error: Capacitor update failed"
    exit 1
fi

# Sync with Capacitor
echo "🔄 Syncing with Capacitor..."
npx cap sync

if [ $? -ne 0 ]; then
    echo "❌ Error: Capacitor sync failed"
    exit 1
fi

# Copy assets for mobile
echo "📋 Copying mobile assets..."
npx cap copy

echo ""
echo "🎉 SUCCESS! Mobile build preparation complete!"
echo ""
echo "=========================================="
echo "📱 DEPLOYMENT INSTRUCTIONS"
echo "=========================================="
echo ""
echo "For App Store Deployment:"
echo ""
echo "1️⃣ iOS Deployment:"
echo "   • Run: npx cap open ios (requires macOS with Xcode)"
echo "   • In Xcode: Set signing team and bundle identifier"
echo "   • Archive for distribution: Product > Archive"
echo "   • Upload to App Store Connect"
echo "   • Submit for review in App Store Connect"
echo ""
echo "2️⃣ Google Play Deployment:"
echo "   • Run: npx cap open android"
echo "   • In Android Studio: Generate signed AAB"
echo "   • Build > Generate Signed Bundle/APK > Android App Bundle"
echo "   • Upload AAB to Google Play Console"
echo "   • Complete store listing and submit for review"
echo ""
echo "3️⃣ Testing on Device:"
echo "   • Android: npx cap run android --target=device"
echo "   • iOS: npx cap run ios --target=device"
echo ""
echo "=========================================="
echo "📋 APP INFORMATION"
echo "=========================================="
echo "• App ID: app.lovable.20e6451330784d2184e7e778b8320a52"
echo "• App Name: Ouderen Alarm"
echo "• Version: 1.0.0"
echo "• Target: Production Release"
echo "• Platforms: iOS 13.0+, Android 7.0+ (API 24+)"
echo "• Required Permissions: Location, Notifications"
echo ""
echo "⚠️  IMPORTANT NOTES:"
echo "• Ensure proper code signing certificates are configured"
echo "• Test thoroughly on physical devices before submission"
echo "• Prepare app store screenshots and metadata"
echo "• Review Apple/Google store guidelines before submission"
echo ""
