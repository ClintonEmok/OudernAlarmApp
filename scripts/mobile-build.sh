
#!/bin/bash

echo "Building Ouderen Alarm Mobile App for Production..."

# Ensure we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Clean previous builds
echo "Cleaning previous builds..."
rm -rf dist/
rm -rf android/app/src/main/assets/public/
rm -rf ios/App/public/

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the web app
echo "Building web app for production..."
NODE_ENV=production npm run build

if [ $? -ne 0 ]; then
    echo "Error: Web build failed"
    exit 1
fi

# Sync with Capacitor
echo "Syncing with Capacitor..."
npx cap sync

if [ $? -ne 0 ]; then
    echo "Error: Capacitor sync failed"
    exit 1
fi

# Copy assets for mobile
echo "Copying mobile assets..."
npx cap copy

echo "Mobile build preparation complete!"
echo ""
echo "Production build completed successfully!"
echo ""
echo "Next steps for deployment:"
echo "1. For Android production: npx cap open android"
echo "   - Build signed APK/AAB in Android Studio"
echo "   - Upload to Google Play Console"
echo ""
echo "2. For iOS production: npx cap open ios (requires Mac)"
echo "   - Archive and upload to App Store Connect"
echo ""
echo "3. For testing on device:"
echo "   - Android: npx cap run android --target=device"
echo "   - iOS: npx cap run ios --target=device"
echo ""
echo "App configuration:"
echo "- App ID: app.lovable.20e6451330784d2184e7e778b8320a52"
echo "- App Name: Ouderen Alarm"
echo "- Logo: Included and configured"
echo "- Notifications: Configured with permissions"
echo "- Location: Configured with permissions"
