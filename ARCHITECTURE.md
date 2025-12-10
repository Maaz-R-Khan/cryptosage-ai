# CryptoSage AI - Architecture Document

## System Overview

CryptoSage AI is a full-stack web application that provides AI-powered cryptocurrency market analysis using Google Gemini AI, Firebase, and real-time crypto price data.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │   Auth   │  │Dashboard  │  │ History  │                  │
│  │   Page   │  │   Page    │  │   Page   │                  │
│  └────┬─────┘  └─────┬─────┘  └────┬─────┘                  │
│       │             │              │                         │
│       └─────────────┼──────────────┘                         │
│                    │                                          │
│              ┌─────▼─────┐                                   │
│              │  Services │                                   │
│              │  Layer    │                                   │
│              └─────┬─────┘                                   │
└────────────────────┼─────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
┌───────▼────┐ ┌─────▼─────┐ ┌───▼──────────┐
│  Firebase  │ │  Gemini   │ │  CoinGecko  │
│            │ │    API    │ │     API     │
│ ┌────────┐│ │            │ │             │
│ │  Auth   ││ │  AI Studio │ │  Crypto     │
│ └────────┘│ │  Prompt    │ │  Prices     │
│            │ │  Design    │ │             │
│ ┌────────┐│ └────────────┘ └─────────────┘
│ │Firestore││
│ │         ││
│ │ users   ││
│ │ sessions││
│ └────────┘│
└───────────┘
```

## Component Architecture

### Frontend Structure

```
cryptosage-ai/
├── components/          # Reusable UI components
│   ├── Auth.tsx        # Authentication UI
│   ├── Layout.tsx      # App layout with navigation
│   ├── AnalysisView.tsx # AI analysis results display
│   ├── CryptoWidget.tsx # Real-time crypto price widget
│   └── HistoryItem.tsx # History list item component
│
├── pages/              # Page components
│   ├── InteractionPage.tsx # Main AI interaction page
│   └── HistoryPage.tsx    # Session history page
│
├── services/           # Business logic layer
│   ├── firebase.ts     # Firebase initialization
│   ├── storageService.ts # Firestore operations
│   ├── geminiService.ts  # Gemini AI integration
│   └── cryptoService.ts  # CoinGecko API integration
│
└── types.ts           # TypeScript type definitions
```

## Data Flow

### 1. Authentication Flow
```
User → Auth Page → Firebase Auth → Firestore (users collection)
                                    ↓
                              User Document Created
```

### 2. AI Analysis Flow
```
User Input → InteractionPage
              ↓
         Fetch Crypto Prices (CoinGecko)
              ↓
         Generate Analysis (Gemini API)
              ↓
         Save Session (Firestore)
              ↓
         Display Results (AnalysisView)
```

### 3. History Flow
```
User → HistoryPage → Firestore Query (sessions collection)
                      ↓
                 Filter by userId
                      ↓
                 Display with Charts
                      ↓
                 Re-use Prompt Feature
```

## Technology Stack

### Frontend
- **React 19.2** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization

### Backend Services
- **Firebase Authentication** - User management
- **Cloud Firestore** - NoSQL database
- **Firebase Hosting** - Static hosting

### External APIs
- **Google Gemini API** - AI analysis (Gemini 2.5 Flash)
- **CoinGecko API** - Cryptocurrency price data

## Security Architecture

### Firestore Security Rules
```javascript
// Users: Can only access their own document
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
}

// Sessions: Can only access their own sessions
match /sessions/{sessionId} {
  allow read: if request.auth.uid == resource.data.userId;
  allow create: if request.auth.uid == request.resource.data.userId;
}
```

### Environment Variables
- API keys stored in `.env` (not committed to git)
- Firebase config in code (public, safe to expose)
- Gemini API key injected at build time

## AI Tools Used at Each Stage

### 1. AI Studio (Google AI Studio)
- **Purpose**: Designed the structured prompt for crypto analysis
- **Output**: JSON schema with sentiment scoring, recommendations
- **Location**: `services/geminiService.ts` - ANALYSIS_SCHEMA

### 2. AI Code Assistants (Cursor/Auto)
- **Purpose**: Code generation, debugging, architecture design
- **Used For**:
  - Component structure
  - Firebase integration
  - Error handling
  - TypeScript types
  - Deployment scripts

### 3. Firebase Console
- **Purpose**: Project setup, authentication, Firestore configuration
- **Used For**:
  - Project creation
  - Enabling services
  - Security rules deployment

## Database Schema

### Users Collection
```typescript
{
  uid: string;           // Firebase Auth UID
  email: string;
  displayName: string;
  createdAt: Timestamp;
}
```

### Sessions Collection
```typescript
{
  id: string;            // Document ID
  userId: string;         // Reference to user
  prompt: string;         // User's question
  response: {            // Gemini AI response
    summary: string;
    sentimentScore: number;
    keyInsights: string[];
    recommendation: "BUY" | "SELL" | "HOLD";
  };
  cryptoContext: {       // Market data at time of analysis
    bitcoin: { usd: number };
    ethereum: { usd: number };
  };
  timestamp: Timestamp;
  createdAt: Timestamp;
}
```

## API Integration

### Gemini API
- **Endpoint**: Client-side via `@google/genai` SDK
- **Model**: `gemini-2.5-flash`
- **Response Format**: Structured JSON
- **Authentication**: API key from environment variables

### CoinGecko API
- **Endpoint**: `https://api.coingecko.com/api/v3/simple/price`
- **Data**: Bitcoin and Ethereum USD prices
- **Fallback**: Mock data if API rate limited

## Deployment Architecture

```
Developer Machine
    ↓
npm run build (Vite)
    ↓
dist/ folder (static files)
    ↓
firebase deploy --only hosting
    ↓
Firebase Hosting (CDN)
    ↓
Users (via HTTPS)
```

## Performance Considerations

- **Code Splitting**: Vite automatically splits chunks
- **Firestore Indexes**: Composite index on (userId, timestamp)
- **Caching**: Firebase Hosting CDN caching
- **Error Handling**: Graceful fallbacks for API failures

## Future Enhancements

- Real-time price updates via WebSocket
- More cryptocurrency pairs
- Advanced charting
- Export history to CSV
- Email notifications for price alerts

