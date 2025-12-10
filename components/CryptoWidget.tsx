import React from 'react';
import { CryptoData, CryptoInfo } from '../types';
import { BitcoinIcon, TrendingUp, TrendingDown } from './Icons';

interface CryptoWidgetProps {
  data: CryptoData | null;
  cryptos: CryptoInfo[];
  loading: boolean;
  onRefresh: () => void;
}

const CryptoWidget: React.FC<CryptoWidgetProps> = ({ data, cryptos, loading, onRefresh }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="glass-card h-32 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  if (!data || Object.keys(data).length === 0) return null;

  const getCryptoInfo = (id: string): CryptoInfo | undefined => {
    return cryptos.find(c => c.id === id);
  };

  const displayCryptos = Object.keys(data).filter(id => data[id]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Market Overview</h2>
        <button
          onClick={onRefresh}
          className="glass-card px-4 py-2 rounded-xl text-sm text-white/80 hover:text-white hover:bg-white/10 smooth-transition flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayCryptos.map((cryptoId) => {
          const price = data[cryptoId]?.usd || 0;
          const info = getCryptoInfo(cryptoId);
          const change = info?.price_change_percentage_24h || 0;
          const isPositive = change >= 0;
          const isBitcoin = cryptoId === 'bitcoin';
          const isEthereum = cryptoId === 'ethereum';

          return (
            <div
              key={cryptoId}
              className="glass-card rounded-2xl p-6 hover:bg-white/5 smooth-transition group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {info?.image ? (
                    <img 
                      src={info.image} 
                      alt={info.name} 
                      className="w-10 h-10 rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className={`p-3 rounded-xl ${
                      isBitcoin 
                        ? 'bg-orange-500/20 group-hover:bg-orange-500/30' 
                        : isEthereum
                        ? 'bg-indigo-500/20 group-hover:bg-indigo-500/30'
                        : 'bg-blue-500/20 group-hover:bg-blue-500/30'
                    } smooth-transition`}>
                      {isBitcoin ? (
                        <BitcoinIcon className="w-6 h-6 text-orange-400" />
                      ) : (
                        <svg className="w-6 h-6 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
                        </svg>
                      )}
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-white/60 font-medium">
                      {info?.name || cryptoId.charAt(0).toUpperCase() + cryptoId.slice(1)}
                    </p>
                    <p className="text-xs text-white/40">{info?.symbol || cryptoId.toUpperCase()}</p>
                  </div>
                </div>
                {isPositive ? (
                  <TrendingUp className="w-5 h-5 text-green-400" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-400" />
                )}
              </div>
              
              <div className="space-y-1">
                <p className="text-2xl font-bold text-white">
                  ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${
                    isPositive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {isPositive ? '+' : ''}{change.toFixed(2)}%
                  </span>
                  <span className="text-xs text-white/40">24h</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CryptoWidget;
