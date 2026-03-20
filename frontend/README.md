# Office Spaces - Chandigarh & Mohali 🏢

A premium, highly responsive real estate directory and lead generation portal designed specifically for commercial office spaces, coworking environments, and IT parks in the Chandigarh and Mohali region.

## ✨ Features
- **Modern Glassmorphism UI**: Inspired by an "Apple-style" minimalist aesthetic, utilizing smooth blur filters and high-contrast typography.
- **Dynamic Property Engine**: Properties are rendered instantly via Firebase Firestore. Includes real-time filtering by city, budget range slider, and text search.
- **Lead Generation Funnel**: 
  - Integrated WhatsApp floating button with pre-filled enquiry text.
  - Native phone-dialer "Call Now" buttons.
  - Secure property enquiry modals that instantly ping the database.
- **Secure Admin Dashboard**: 
  - Authenticated admin portal to manage inventory.
  - Full CRUD operations (Create, Read, Update, Delete) for property listings.
  - Direct integration with **Cloudinary** for seamless image uploading.
  - A comprehensive Leads tracker (New / Contacted / Closed) statuses.
- **Zero-Build Architecture**: Uses Native CDN ES Modules. This means the HTML/JS files can be hosted strictly static—no NPM bundler required in production!
- **PWA Ready**: Completely configured with Android Manifests and Apple Touch Icons for native-like home screen installation.

## 🛠️ Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla ES6 JavaScript
- **Backend / Database**: Google Firebase (Firestore)
- **Asset Hosting**: Cloudinary API

## 🚀 Deployment Instructions

### Method 1: Netlify Drag-and-Drop (Recommended for Static Files)
1. Register for a free Netlify account.
2. Go to [Netlify Drop](https://app.netlify.com/drop).
3. Drag the entire folder containing `index.html` into the circle. It will deploy worldwide in seconds.

### Method 2: Standard Hosting (cPanel / Hostinger)
Simply upload all files in this directory (including `.html`, `.css`, `.js`, and image folders) directly to your `public_html` directory.

> **Note**: For security, ensure that `credentials.js` (containing your admin passwords) and `firebase-config.js` are manually uploaded to your server if you have added them to `.gitignore` to protect them on GitHub.

## 🔐 Security Notice
This project utilizes a static frontend. Do not commit sensitive passwords to public version control systems. Admin credentials have been decoupled to a gitignored `credentials.js` file to protect the administrative dashboard from unauthorized public access.
