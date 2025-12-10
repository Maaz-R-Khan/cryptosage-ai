import { CryptoData, CryptoInfo, CryptoPriceHistory } from '../types';

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://cors.isomorphic-git.org/',
  'https://thingproxy.freeboard.io/fetch/',
];

// Helper: fetch with optional proxy fallback to avoid CORS issues in browser
const fetchJson = async (url: string) => {
  // Try direct first
  try {
    const res = await fetch(url);
    if (res.ok) return res.json();
    throw new Error(`HTTP ${res.status}`);
  } catch (err) {
    // Try proxies
    for (const proxy of CORS_PROXIES) {
      try {
        const proxied = await fetch(`${proxy}${encodeURIComponent(url)}`);
        if (proxied.ok) return proxied.json();
      } catch (_) {
        // continue to next proxy
      }
    }
    throw err;
  }
};

// Fetch multiple cryptocurrencies
export const fetchCryptoPrices = async (cryptoIds: string[] = ['bitcoin', 'ethereum']): Promise<CryptoData> => {
  try {
    const ids = Array.from(new Set(cryptoIds)).join(',');
    const data = await fetchJson(`${COINGECKO_BASE}/simple/price?ids=${ids}&vs_currencies=usd`);
    return data as CryptoData;
  } catch (error) {
    console.warn('Using fallback data due to API limit or error', error);
    // Fallback data
    const fallback: CryptoData = {
      bitcoin: { usd: 64230 + Math.random() * 100 },
      ethereum: { usd: 3450 + Math.random() * 50 },
    };
    cryptoIds.forEach(id => {
      if (!fallback[id]) {
        fallback[id] = { usd: 1000 + Math.random() * 500 };
      }
    });
    return fallback;
  }
};

// Search cryptocurrencies with proxy fallback
export const searchCryptos = async (query: string): Promise<CryptoInfo[]> => {
  if (!query || query.trim().length < 1) {
    return [];
  }

  try {
    const searchData = await fetchJson(`${COINGECKO_BASE}/search?query=${encodeURIComponent(query.trim())}`);
    if (!searchData.coins || searchData.coins.length === 0) return [];

    const topCoins = searchData.coins.slice(0, 15).map((coin: any) => coin.id);
    if (topCoins.length === 0) return [];

    const details = await fetchJson(
      `${COINGECKO_BASE}/coins/markets?vs_currency=usd&ids=${topCoins.join(',')}&order=market_cap_desc&per_page=15&page=1&sparkline=false&price_change_percentage=24h`
    );

    if (!details || details.length === 0) return [];

    return details.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol?.toUpperCase() || coin.id.toUpperCase(),
      name: coin.name,
      image: coin.image,
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h || 0,
      market_cap: coin.market_cap,
      total_volume: coin.total_volume,
    }));
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};

// Get top cryptocurrencies
export const getTopCryptos = async (limit: number = 50): Promise<CryptoInfo[]> => {
  try {
    const data = await fetchJson(
      `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`
    );

    return data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      image: coin.image,
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h || 0,
      market_cap: coin.market_cap,
      total_volume: coin.total_volume,
    }));
  } catch (error) {
    console.error('Top cryptos error:', error);
    return [];
  }
};

// Get price history for charts
export const getCryptoHistory = async (cryptoId: string, days: number = 7): Promise<CryptoPriceHistory> => {
  try {
    const data = await fetchJson(
      `${COINGECKO_BASE}/coins/${cryptoId}/market_chart?vs_currency=usd&days=${days}&interval=${days <= 1 ? 'hourly' : 'daily'}`
    );

    return {
      prices: data.prices || [],
      market_caps: data.market_caps || [],
      total_volumes: data.total_volumes || [],
    };
  } catch (error) {
    console.error('History error:', error);
    // Generate mock data
    const now = Date.now();
    const prices: [number, number][] = [];
    for (let i = days; i >= 0; i--) {
      prices.push([now - i * 24 * 60 * 60 * 1000, 50000 + Math.random() * 20000]);
    }
    return { prices, market_caps: [], total_volumes: [] };
  }
};
