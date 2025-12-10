import { CryptoData } from '../types';

const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd';

export const fetchCryptoPrices = async (): Promise<CryptoData> => {
  try {
    const response = await fetch(COINGECKO_API);
    if (!response.ok) {
      throw new Error('Failed to fetch crypto prices');
    }
    const data = await response.json();
    return data as CryptoData;
  } catch (error) {
    console.warn('Using fallback data due to API limit or error', error);
    // Fallback data if API rate limits (CoinGecko is strict)
    return {
      bitcoin: { usd: 64230 + Math.random() * 100 },
      ethereum: { usd: 3450 + Math.random() * 50 },
    };
  }
};
