# 🇿🇦 Luma SA - South African Event Platform

A modern event management platform built specifically for South Africa, featuring real-time updates, weather integration, load shedding awareness, and local payment solutions.

## 🎯 Overview

Luma SA is a comprehensive event platform consisting of two main applications:
1. **User App** - Public-facing platform for event discovery and registration
2. **Backoffice Admin Portal** - Administrative dashboard for event management and analytics

Both apps feature real-time synchronization through Firebase Firestore, ensuring instant updates across the platform.

## 🏗️ Project Structure

```
luma-sa/
├── user-app/          # Public-facing event discovery and registration app (port 3000)
├── backoffice-app/    # Admin dashboard for analytics and management (port 3001)
├── shared/            # Shared types, utilities, and Firebase configuration
└── README.md          # This file
```

## ✨ Features Built

### User App Features
- **Event Discovery**
  - Browse all events with real-time updates
  - Featured events section on homepage
  - Search and filter by category, location, and date
  - Empty states when no events exist
  
- **Event Details & Registration**
  - Detailed event pages with venue information
  - Multiple ticket types support
  - Real-time ticket availability
  - User authentication (sign up/sign in)
  - Complete registration flow with attendee information
  - Payment processing (free and paid events)
  
- **User Account Management**
  - Sign up with email and password
  - User profile creation
  - Authentication state persistence
  - Sign out functionality
  
- **South African Integrations**
  - Weather indicators on events
  - Load shedding status display
  - PayFast payment integration (mock)
  - SMS confirmations via Clickatell (mock)
  - Email confirmations via SendGrid (mock)

### Backoffice Admin Portal Features
- **Dashboard with Real-time Analytics**
  - Total events count (live)
  - Active users count (live)
  - Total revenue tracking (live)
  - Tickets sold count (live)
  - Visual charts for trends
  
- **Event Management**
  - Create new events with full details
  - Edit existing events
  - Delete events
  - Toggle featured status
  - Toggle published/unpublished
  - Manage ticket types and pricing
  - Track ticket sales per event
  
- **User Management**
  - View all registered users
  - User statistics and metrics
  - Search functionality
  - Verification status tracking
  
- **Registration Tracking**
  - Real-time registration monitoring
  - Live updates indicator
  - Registration statistics
  - Revenue per registration
  - Search and filter by status
  
- **Payment Management**
  - Real-time payment tracking
  - Payment status monitoring
  - Revenue analytics
  - Transaction details with user info
  - Success rate tracking
  
- **API Testing**
  - PayFast payment testing
  - Clickatell SMS testing
  - SendGrid email testing
  - Weather API testing
  - EskomSePush load shedding testing

### Shared Features
- **Firebase Integration**
  - Real-time data synchronization
  - User authentication
  - Firestore for data storage
  - Secure rules for production
  
- **TypeScript Types**
  - Shared type definitions
  - Type safety across both apps
  
- **Mock APIs**
  - South African payment providers
  - SMS services
  - Weather data
  - Load shedding information
  - Email services

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project (using provided keys)

### Installation

1. Clone the repository and install dependencies:

```bash
cd luma-sa
npm install
cd user-app && npm install
cd ../backoffice-app && npm install
cd ../shared && npm install
cd ..
```

2. Set up environment variables:

Create `.env.local` in both `user-app` and `backoffice-app` directories:

```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDMeKHXX5UxZ3B5hrZzmu83uDkVvrAcMLk
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=vibecodepoc.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=vibecodepoc
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=vibecodepoc.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=672659810845
NEXT_PUBLIC_FIREBASE_APP_ID=1:672659810845:web:1eac070c8f92f28d8eb4f4

# Feature flags
NEXT_PUBLIC_USE_MOCK_APIS=true
```

3. Set up Firestore Security Rules:

For demo/development (open access):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

For production (secure):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Events - public read, authenticated write
    match /events/{eventId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Registrations - authenticated users can read/write their own
    match /registrations/{registrationId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
    
    // Users - authenticated users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId;
    }
    
    // Payments - authenticated users can read their own
    match /payments/{paymentId} {
      allow read: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow write: if false; // Only server-side
    }
  }
}
```

4. Start development servers:

```bash
# Terminal 1 - User App
cd user-app
npm run dev

# Terminal 2 - Backoffice App
cd backoffice-app
npm run dev
```

This will start:
- **User App**: http://localhost:3000
- **Backoffice App**: http://localhost:3001

## 🚀 Deployment to Vercel

### Deploy User App

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy the user app:
```bash
cd user-app
vercel

# Follow prompts:
# - Link to existing project or create new
# - Project name: luma-sa-user
# - Framework: Next.js
# - Build command: npm run build
# - Output directory: .next
# - Install command: npm install
```

3. Set environment variables in Vercel:
- Go to Vercel Dashboard → Project → Settings → Environment Variables
- Add all variables from `.env.local`

### Deploy Backoffice App

1. Deploy the backoffice app:
```bash
cd ../backoffice-app
vercel

# Follow prompts:
# - Create new project
# - Project name: luma-sa-admin
# - Framework: Next.js
# - Build command: npm run build
# - Output directory: .next
# - Install command: npm install
```

2. Set environment variables in Vercel (same as user app)

### Important Deployment Notes

1. **Shared Package**: Both apps reference the shared package. Ensure the build process includes it:
   - Update `package.json` in each app to copy shared files during build if needed
   - Or publish the shared package to npm (private registry)

2. **Firebase Configuration**: Ensure Firebase project allows your Vercel domains

3. **CORS**: Configure Firebase to accept requests from your Vercel domains

## 🏢 Detailed Features Documentation

### User App Pages
- `/` - Homepage with featured and upcoming events
- `/events` - Browse all events with search and filters
- `/events/[slug]` - Event detail and registration page
- `/create-event` - Create new event (requires auth)
- `/profile` - User profile page
- `/my-events` - User's registered events

### Backoffice App Pages
- `/` - Dashboard with real-time analytics
- `/events` - Event management (CRUD operations)
- `/create-event` - Create new event form
- `/edit-event/[id]` - Edit existing event
- `/users` - User management
- `/registrations` - Real-time registration tracking
- `/payments` - Payment processing and analytics
- `/analytics` - Detailed analytics charts
- `/settings` - Platform settings
- `/api-demo` - Test mock APIs

## 🎨 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with South African color palette
- **Backend**: Firebase (Firestore, Auth, Storage)
- **UI Components**: Radix UI, Lucide Icons, Custom components
- **Charts**: Recharts
- **Real-time**: Firestore onSnapshot listeners
- **Development**: ESLint, TypeScript

## 🇿🇦 South African Features

- **Weather Integration**: Real-time weather with event impact
- **Load Shedding**: EskomSePush integration for outage warnings
- **Local Payments**: PayFast integration with ZAR support
- **SMS**: Clickatell for South African mobile numbers
- **Currency**: Proper ZAR formatting throughout
- **Timezone**: SAST (UTC+2) handling

## 💡 Development Prompt for Recreation

To recreate this project, use the following prompt:

```
Build a South African event platform with two Next.js apps:

1. User App (port 3000):
- Event browsing with real-time updates from Firestore
- User authentication (signup/signin)
- Event registration with payment processing
- Weather and load shedding indicators
- Mobile responsive design

2. Backoffice Admin (port 3001):
- Real-time dashboard with event, user, and revenue stats
- Full CRUD for events with featured flag
- User management with registration counts
- Payment tracking with user details
- Registration monitoring with live updates

Shared requirements:
- TypeScript with shared types package
- Firebase Firestore for real-time data
- Tailwind CSS with SA colors (green: #00866e, gold: #f7b500)
- Mock APIs for PayFast, Clickatell, SendGrid, Weather, EskomSePush
- Empty states when no data exists
- No static/mock data in production views

Key implementation details:
- Remove orderBy clauses from Firestore queries (sort in JS)
- Use onSnapshot for real-time updates
- Implement proper date conversions for Firestore timestamps
- Add console logging for debugging real-time connections
- Create comprehensive event creation/edit forms
- Implement proper authentication flow with user profiles
```

## 📝 Environment Variables Reference

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Feature Flags
NEXT_PUBLIC_USE_MOCK_APIS=true

# Optional: External API Keys (when not using mocks)
PAYFAST_MERCHANT_ID=
PAYFAST_MERCHANT_KEY=
CLICKATELL_API_KEY=
SENDGRID_API_KEY=
WEATHER_API_KEY=
ESKOMSEPUSH_API_KEY=
```

## 🧪 Testing

1. **Create Admin User**:
   - Sign up in the user app first
   - Use the same credentials to sign in to backoffice

2. **Test Event Flow**:
   - Create event in backoffice
   - View event in user app
   - Register for event as user
   - See registration appear in backoffice

3. **Test Real-time Updates**:
   - Open both apps side by side
   - Create/edit events and watch updates
   - Register for events and see instant updates

## 🔧 Troubleshooting

1. **Events not showing**: Check Firestore rules and indexes
2. **Real-time updates not working**: Check browser console for errors
3. **Authentication issues**: Verify Firebase configuration
4. **Payment errors**: Ensure mock APIs are enabled

## 📄 License

MIT License - see LICENSE file for details.

---

**Made with ❤️ in South Africa** 🇿🇦