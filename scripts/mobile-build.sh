
#!/bin/bash

echo "Building Ouderen Alarm Mobile App..."

# Build the web app
echo "Building web app..."
npm run build

# Sync with Capacitor
echo "Syncing with Capacitor..."
npx cap sync

echo "Mobile build preparation complete!"
echo ""
echo "Next steps:"
echo "1. For Android: npx cap open android"
echo "2. For iOS: npx cap open ios (requires Mac)"
echo "3. Or run on device: npx cap run android/ios"
