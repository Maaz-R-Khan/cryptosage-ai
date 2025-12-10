export interface User {
  uid: string;
  email: string;
  displayName: string;
}

export interface CryptoData {
  bitcoin: { usd: number };
  ethereum: { usd: number };
  [key: string]: { usd: number };
}

export interface CryptoInfo {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
}

export interface CryptoPriceHistory {
  prices: [number, number][]; // [timestamp, price]
  market_caps: [number, number][];
  total_volumes: [number, number][];
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
