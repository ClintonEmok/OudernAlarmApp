
# Ouderen Alarm - App Store Deployment Guide

## 📱 App Information
- **App Name:** Ouderen Alarm
- **Bundle ID/Package Name:** app.lovable.20e6451330784d2184e7e778b8320a52
- **Version:** 1.0.0
- **Category:** Health & Medical
- **Target Platforms:** iOS 13.0+, Android 7.0+ (API 24+)

## 🚀 Pre-Deployment Checklist

### Required Files & Assets
- [ ] App icons (1024x1024 for App Store, various sizes for Android)
- [ ] Screenshots for all device sizes
- [ ] Privacy Policy (included: `/public/privacy-policy.html`)
- [ ] App description and keywords
- [ ] Code signing certificates (iOS) / Keystore (Android)

### Required Permissions
- [ ] Location Services (for GPS tracking)
- [ ] Push Notifications (for alarm alerts)
- [ ] Camera (if QR code scanning is needed)

## 🔧 Build Instructions

### 1. Prepare Environment
```bash
# Export project to GitHub first
git clone [your-github-repo]
cd [project-directory]
npm install
```

### 2. Add Mobile Platforms
```bash
npx cap add ios     # macOS only
npx cap add android
```

### 3. Build for Production
```bash
chmod +x scripts/mobile-build.sh
./scripts/mobile-build.sh
```

## 📱 iOS App Store Deployment

### Prerequisites
- macOS with Xcode 14+
- Apple Developer Account ($99/year)
- Valid iOS Distribution Certificate

### Steps
1. **Open iOS Project**
   ```bash
   npx cap open ios
   ```

2. **Configure Signing**
   - Select your development team
   - Set bundle identifier
   - Enable automatic signing or configure manual signing

3. **Update Info.plist**
   - Add usage descriptions for Location and Notifications
   - Configure URL schemes if needed

4. **Archive & Upload**
   - Product → Archive
   - Upload to App Store Connect
   - Complete app metadata in App Store Connect
   - Submit for review

### Required App Store Information
- **App Description:** Professional alarm and monitoring app for elderly care
- **Keywords:** elderly, alarm, monitoring, safety, gps, emergency
- **Category:** Medical
- **Age Rating:** 4+ (suitable for all ages)

## 🤖 Google Play Store Deployment

### Prerequisites
- Android Studio
- Google Play Developer Account ($25 one-time fee)
- Keystore for app signing

### Steps
1. **Open Android Project**
   ```bash
   npx cap open android
   ```

2. **Configure Signing**
   - Create or use existing keystore
   - Configure signing in `android/app/build.gradle`

3. **Build AAB**
   - Build → Generate Signed Bundle/APK
   - Select Android App Bundle (AAB)
   - Use your keystore credentials

4. **Upload to Play Console**
   - Create new app in Google Play Console
   - Upload AAB file
   - Complete store listing
   - Submit for review

### Required Play Store Information
- **Short Description:** Veiligheids- en monitoring app voor ouderen
- **Full Description:** Professional alarm and monitoring application for elderly care with GPS tracking, emergency alerts, and caregiver notifications
- **Category:** Medical

## 🔒 Security & Privacy

### Privacy Policy
- Hosted at: `/public/privacy-policy.html`
- Must be accessible from app settings
- Complies with GDPR and local privacy laws

### Data Handling
- Location data encrypted in transit
- User consent required for location tracking
- Data retention policies clearly defined

## 📊 App Store Optimization (ASO)

### Keywords (Dutch)
- ouderen alarm
- noodknop
- gps tracking
- veiligheid ouderen
- monitoring app
- verzorging app

### Keywords (English)
- elderly alarm
- emergency button
- senior safety
- gps tracking
- care monitoring
- health app

## ❗ Important Notes

1. **Testing Requirements**
   - Test on physical devices before submission
   - Verify all permissions work correctly
   - Test offline functionality
   - Validate emergency scenarios

2. **Store Guidelines**
   - Review Apple App Store Guidelines
   - Review Google Play Policy
   - Ensure compliance with medical app requirements

3. **Post-Launch**
   - Monitor crash reports
   - Respond to user reviews
   - Plan update cycle for bug fixes and features

## 🆘 Support & Resources

- **Technical Issues:** Check Capacitor documentation
- **Store Rejections:** Review platform-specific guidelines
- **Privacy Compliance:** Consult legal experts for GDPR compliance

---

**Important:** This guide provides general deployment instructions. Always refer to the latest Apple and Google documentation for current requirements and procedures.
