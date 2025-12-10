import React, { useState, useEffect, useRef } from 'react';
import { CryptoInfo } from '../types';
import { searchCryptos, getTopCryptos } from '../services/cryptoService';

interface CryptoSearchProps {
  selectedCryptos: string[];
  onSelect: (cryptoIds: string[]) => void;
}

const CryptoSearch: React.FC<CryptoSearchProps> = ({ selectedCryptos, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<CryptoInfo[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [topCryptos, setTopCryptos] = useState<CryptoInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load top cryptos on mount
    getTopCryptos(20).then(setTopCryptos);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const run = async () => {
      if (!searchQuery.trim()) {
        setResults(topCryptos);
        return;
      }
      setLoading(true);
      setIsOpen(true);
      try {
        const searchResults = await searchCryptos(searchQuery);
        setResults(searchResults.length > 0 ? searchResults : topCryptos);
      } catch (error) {
        console.error('Search failed:', error);
        setResults(topCryptos);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(run, 400);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, topCryptos]);

  const toggleCrypto = (cryptoId: string) => {
    if (selectedCryptos.includes(cryptoId)) {
      onSelect(selectedCryptos.filter(id => id !== cryptoId));
    } else {
      onSelect([...selectedCryptos, cryptoId]);
    }
  };

  const displayResults = results.length > 0 ? results : topCryptos;

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative z-10">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search cryptocurrencies (BTC, ETH, SOL...)"
          className="w-full glass-card rounded-2xl px-6 py-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 smooth-transition"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute z-[100] w-full mt-2 glass-card rounded-2xl overflow-hidden max-h-96 overflow-y-auto animate-fade-in shadow-2xl border border-white/10">
          {loading ? (
            <div className="p-8 text-center text-white/60">Searching...</div>
          ) : displayResults.length === 0 ? (
            <div className="p-8 text-center text-white/60">No results found</div>
          ) : (
            <div className="py-2">
              {displayResults.map((crypto) => {
                const isSelected = selectedCryptos.includes(crypto.id);
                const isPositive = crypto.price_change_percentage_24h >= 0;
                
                return (
                  <button
                    key={crypto.id}
                    onClick={() => toggleCrypto(crypto.id)}
                    className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 smooth-transition ${
                      isSelected ? 'bg-blue-500/10 border-l-2 border-blue-500' : ''
                    }`}
                  >
                    <img src={crypto.image} alt={crypto.name} className="w-8 h-8 rounded-full" />
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{crypto.name}</span>
                        <span className="text-xs text-white/40 uppercase">{crypto.symbol}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-white/80">
                          ${crypto.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className={`text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                          {isPositive ? '+' : ''}{crypto.price_change_percentage_24h.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Selected Cryptos */}
      {selectedCryptos.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedCryptos.map((id) => {
            const crypto = [...topCryptos, ...results].find(c => c.id === id);
            if (!crypto) return null;
            
            return (
              <div
                key={id}
                className="glass-card px-4 py-2 rounded-xl flex items-center gap-2 group"
              >
                <img src={crypto.image} alt={crypto.name} className="w-5 h-5 rounded-full" />
                <span className="text-sm text-white">{crypto.symbol}</span>
                <button
                  onClick={() => toggleCrypto(id)}
                  className="text-white/40 hover:text-white smooth-transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CryptoSearch;

