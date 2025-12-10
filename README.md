# CryptoSage AI - AI-Powered Crypto Market Analysis

An AI-powered web application that uses Google Gemini AI and Firebase to provide real-time cryptocurrency market analysis and insights.

## Features

- 🔐 **Firebase Authentication** - Secure user authentication with email/password
- 🤖 **Gemini AI Integration** - Powered by Google's Gemini 2.5 Flash model
- 📊 **Real-time Crypto Data** - Fetches live Bitcoin and Ethereum prices from CoinGecko API
- 📝 **Session History** - Stores and retrieves all AI interactions in Firestore
- 📈 **Sentiment Analysis** - Visual sentiment trend charts
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Firebase (Auth, Firestore, Hosting)
- **AI**: Google Gemini API
- **External API**: CoinGecko (crypto prices)
- **Charts**: Recharts

## Quick Start

### Prerequisites

- Node.js LTS (v18 or higher)
- Firebase account
- Google AI Studio account (for Gemini API key)

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   - The `.env` file is already created with your Gemini API key
   - Firebase configuration is already set in `services/firebase.ts`

3. **Run locally:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Navigate to `http://localhost:3000`

## Firebase Setup Required

**⚠️ IMPORTANT:** Before the app will work, you need to complete these steps in Firebase Console:

1. **Enable Authentication:**
   - Go to Firebase Console > Authentication > Sign-in method
   - Enable "Email/Password"

2. **Enable Firestore:**
   - Go to Firebase Console > Firestore Database
   - Create database (choose location)

3. **Deploy Security Rules:**
   ```bash
   firebase login
   firebase deploy --only firestore:rules
   ```

4. **Deploy to Hosting:**
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

📖 **See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed step-by-step instructions.**

## Project Structure

```
cryptosage-ai/
├── components/          # React components
│   ├── Auth.tsx        # Authentication UI
│   ├── AnalysisView.tsx # AI analysis display
│   ├── CryptoWidget.tsx # Crypto price widget
│   └── HistoryItem.tsx  # History list item
├── pages/              # Page components
│   ├── InteractionPage.tsx # Main AI interaction page
│   └── HistoryPage.tsx    # History view page
├── services/           # Service layer
│   ├── firebase.ts     # Firebase initialization
│   ├── storageService.ts # Firestore operations
│   ├── geminiService.ts  # Gemini AI integration
│   └── cryptoService.ts  # CoinGecko API
├── firebase.json       # Firebase config
├── firestore.rules     # Security rules
└── .env                # Environment variables
```

## Environment Variables

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your API key from: https://aistudio.google.com/app/apikey

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `firebase deploy` - Deploy to Firebase Hosting

## Security

- Firestore security rules ensure users can only access their own data
- API keys are stored in environment variables (not committed to git)
- Authentication required for all data operations

## License

This project is part of an educational assignment demonstrating AI integration with Firebase.
