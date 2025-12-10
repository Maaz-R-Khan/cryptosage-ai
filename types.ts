export interface User {
  uid: string;
  email: string;
  displayName: string;
}

export interface CryptoData {
  bitcoin: { usd: number };
  ethereum: { usd: number };
}

export interface AnalysisResult {
  summary: string;
  sentimentScore: number; // 0 to 100
  keyInsights: string[];
  recommendation: 'BUY' | 'SELL' | 'HOLD';
}

export interface Session {
  id: string;
  userId: string;
  prompt: string;
  response: AnalysisResult;
  cryptoContext: CryptoData;
  timestamp: number;
}

export enum AppRoute {
  AUTH = 'auth',
  DASHBOARD = 'dashboard',
  HISTORY = 'history',
}
