# JKH Opulence Studio — AI-Powered Interior Design

JKH Opulence Studio is a premium, client-side application that enables users to upload photos of their rooms and generate custom interior designs in seconds using advanced AI. Built with premium dark-mode aesthetics, smooth Framer Motion animations, and local on-device database storage, it is fully optimized for web and mobile platforms.

---

## Key Features

- 🛠 **Zero-Host Costs Architecture**: Completely backendless client-side architecture (all logic runs directly in the browser or mobile container, eliminating API server hosting costs).
- ⚡ **Pollinations AI Direct Integration**: Media uploading to Pollinations storage and direct client-side call to Flux image-to-image edit endpoint.
- 🗄 **On-Device IndexedDB Storage**: Stores generated designs as base64 strings locally on the device, allowing users to keep hundreds of megabytes of creation history without crashing browser space.
- 📱 **iOS Native Packaging (Capacitor)**: Configured with native iOS wrapper files, camera upload access, and gallery permission dialogs pre-set.
- ✉️ **Validated Web3Forms Contact Integration**: Immediate email delivery from client forms directly to your inbox without requiring custom mail server infrastructure.
- 🌟 **Premium Aesthetic Experience**: Gold styling gradients, custom Outfit/Playfair typography, animated mesh backgrounds, and interactive comparative before-after sliders.

---

## Technology Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion (micro-animations) + Shadcn UI
- **Local DB**: IndexedDB API (`src/lib/db.ts`)
- **AI Integrations**: Pollinations.ai (Image-to-Image API)
- **Email Gateway**: Web3Forms client-side submission
- **Mobile Container**: Capacitor Core + iOS Platform Wrapper

---

## Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm or bun

### 1. Installation
Install project dependencies:
```bash
npm install
```

### 2. Configure Credentials (Optional)
Create a `.env` file in the root directory and add your Web3Forms access key if you wish to receive inquiries directly in your inbox:
```env
VITE_WEB3FORMS_ACCESS_KEY=your-web3forms-access-key-here
```
*(If no key is provided, the contact section operates in a realistic simulation mode).*

### 3. Run Development Server
Start the local server on port `8080`:
```bash
npm run dev
```

### 4. Build for Production
Create a highly optimized, minified production build inside the `/dist` directory:
```bash
npm run build
```

---

## iOS Compilation & Deployment Guide

The workspace includes a Capacitor configuration and native Xcode project directory. Follow these steps to build and run the app on an iOS device or simulator.

### Prerequisites for iOS Building
- A macOS computer
- Xcode (latest version) installed
- CocoaPods (`sudo gem install cocoapods` or installed via Homebrew)

### Step 1: Synchronize Web Assets
Whenever you update code in the React application, rebuild the project and sync files with Xcode:
```bash
npm run build
npx cap sync
```

### Step 2: Open in Xcode
Open the iOS workspace file (`ios/App/App.xcworkspace`) natively in Xcode:
```bash
npx cap open ios
```

### Step 3: Configure Permissions & Profile
Within Xcode:
1. Select the **App** project root in the left navigator bar.
2. Go to **Signing & Capabilities**.
3. Under **Development Team**, select your Apple Developer account profile.
4. **Permissions**: The project already comes pre-configured with keys inside `Info.plist` for Camera Access (`NSCameraUsageDescription`), Photo Gallery Uploads (`NSPhotoLibraryUsageDescription`), and Photo Saving (`NSPhotoLibraryAddUsageDescription`). You do not need to configure them manually.

### Step 4: Run the Application
1. Select your target device (e.g., an iPhone simulator or a physically connected iOS device).
2. Click the **Play** button (Run) in the top-left corner of Xcode.
3. The app will compile and launch directly on the device!
