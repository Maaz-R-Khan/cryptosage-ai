import React, { useState, useEffect } from 'react';
import { CryptoData, AnalysisResult, Session, CryptoInfo } from '../types';
import { fetchCryptoPrices, getTopCryptos, getCryptoHistory } from '../services/cryptoService';
import { generateCryptoAnalysis } from '../services/geminiService';
import { saveSession } from '../services/storageService';
import CryptoWidget from '../components/CryptoWidget';
import CryptoSearch from '../components/CryptoSearch';
import CryptoChart from '../components/CryptoChart';
import AnalysisView from '../components/AnalysisView';

interface InteractionPageProps {
  userId: string;
  initialPrompt?: string;
  onClearInitialPrompt: () => void;
}

const InteractionPage: React.FC<InteractionPageProps> = ({ userId, initialPrompt, onClearInitialPrompt }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedCryptos, setSelectedCryptos] = useState<string[]>(['bitcoin', 'ethereum']);
  const [cryptoData, setCryptoData] = useState<CryptoData | null>(null);
  const [topCryptos, setTopCryptos] = useState<CryptoInfo[]>([]);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chartDataMap, setChartDataMap] = useState<Record<string, any>>({});
  const [loadingCharts, setLoadingCharts] = useState<Record<string, boolean>>({});

  // Load top cryptos and prices
  useEffect(() => {
    const loadData = async () => {
      setLoadingPrices(true);
      try {
        const uniqueSelection = Array.from(new Set(selectedCryptos));
        const [cryptos, prices] = await Promise.all([
          getTopCryptos(50),
          fetchCryptoPrices(uniqueSelection)
        ]);
        setTopCryptos(cryptos);
        setCryptoData(prices);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingPrices(false);
      }
    };
    loadData();
  }, [selectedCryptos]);

  // Load chart data for all selected cryptos
  useEffect(() => {
    const loadCharts = async () => {
      if (selectedCryptos.length === 0) return;
      const loadingState: Record<string, boolean> = {};
      const newData: Record<string, any> = { ...chartDataMap };

      await Promise.all(selectedCryptos.map(async (id) => {
        loadingState[id] = true;
        try {
          newData[id] = await getCryptoHistory(id, 7);
        } catch (err) {
          console.error('Chart load error', err);
          newData[id] = { prices: [], market_caps: [], total_volumes: [] };
        } finally {
          loadingState[id] = false;
        }
      }));

      setChartDataMap(newData);
      setLoadingCharts(loadingState);
    };

    loadCharts();
  }, [selectedCryptos]);

  // Handle initial prompt from history re-use
  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
      onClearInitialPrompt();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [initialPrompt, onClearInitialPrompt]);

  const loadPrices = async () => {
    setLoadingPrices(true);
    try {
      const uniqueSelection = Array.from(new Set(selectedCryptos));
      const data = await fetchCryptoPrices(uniqueSelection);
      setCryptoData(data);
      // refresh charts with latest
      const newData: Record<string, any> = { ...chartDataMap };
      await Promise.all(uniqueSelection.map(async (id) => {
        newData[id] = await getCryptoHistory(id, 7);
      }));
      setChartDataMap(newData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPrices(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError("Please enter a question or prompt for the AI.");
      return;
    }
    if (!cryptoData || Object.keys(cryptoData).length === 0) {
      setError("No market data available. Please refresh prices and try again.");
      return;
    }

    setAnalyzing(true);
    setError(null);
    setCurrentResult(null);

    try {
      // Only send the selected cryptos data to the AI for clarity
      const filteredContext: CryptoData = {};
      const uniqueSelection = Array.from(new Set(selectedCryptos));
      uniqueSelection.forEach((id) => {
        if (cryptoData[id]) filteredContext[id] = cryptoData[id];
      });

      if (Object.keys(filteredContext).length === 0) {
        throw new Error("No selected crypto data available. Please refresh and try again.");
      }

      const result = await generateCryptoAnalysis(prompt, filteredContext);
      setCurrentResult(result);
      
      // Save session
      const newSession: Session = {
        id: crypto.randomUUID(),
        userId,
        prompt,
        response: result,
        cryptoContext: cryptoData,
        timestamp: Date.now(),
      };
      await saveSession(newSession);

    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setAnalyzing(false);
    }
  };

  const getCryptoInfo = (id: string): CryptoInfo | undefined => {
    return topCryptos.find(c => c.id === id);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 animate-fade-in">
        <h1 className="text-5xl font-bold gradient-text">
          Market Intelligence
        </h1>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          Real-time cryptocurrency insights powered by Google Gemini AI. Analyze trends, get recommendations, and make informed decisions.
        </p>
      </div>

      {/* Crypto Search */}
      <div className="glass-card rounded-2xl p-6 animate-fade-in">
        <h2 className="text-xl font-bold text-white mb-4">Select Cryptocurrencies</h2>
        <CryptoSearch
          selectedCryptos={selectedCryptos}
          onSelect={setSelectedCryptos}
        />
      </div>

      {/* Market Overview */}
      <CryptoWidget 
        data={cryptoData} 
        cryptos={topCryptos}
        loading={loadingPrices} 
        onRefresh={loadPrices} 
      />

      {/* Charts Section - show all selected cryptos */}
      {selectedCryptos.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Price Charts</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {selectedCryptos.map((cryptoId) => {
              const info = getCryptoInfo(cryptoId);
              if (!info || !cryptoData?.[cryptoId]) return null;
              const chart = chartDataMap[cryptoId];
              const isLoading = loadingCharts[cryptoId];

              if (isLoading || !chart) {
                return (
                  <div key={cryptoId} className="glass-card rounded-2xl p-6 animate-pulse">
                    <div className="h-8 bg-white/10 rounded mb-4"></div>
                    <div className="h-64 bg-white/5 rounded"></div>
                  </div>
                );
              }

              return (
                <div key={cryptoId}>
                  <CryptoChart
                    data={chart}
                    cryptoName={info.name}
                    currentPrice={cryptoData[cryptoId].usd}
                    priceChange={info.price_change_percentage_24h}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Analysis Form */}
      <div className="glass-card rounded-2xl p-8 animate-fade-in">
        <h2 className="text-2xl font-bold text-white mb-6">Ask AI Analyst</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask about market trends, specific coins, investment strategies, or get analysis on selected cryptocurrencies..."
              className="w-full glass rounded-2xl p-6 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 smooth-transition min-h-[150px] resize-none text-lg"
              disabled={analyzing}
            />
            <div className="absolute bottom-6 right-6">
              <button
                type="submit"
                disabled={analyzing || !prompt.trim() || !cryptoData}
                className={`px-8 py-3 rounded-xl font-semibold shadow-lg smooth-transition flex items-center gap-3 ${
                  analyzing || !prompt.trim() 
                    ? 'glass text-white/40 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 hover:scale-105 glow-blue'
                }`}
              >
                {analyzing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Generate Analysis</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="glass bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-300">
              {error}
            </div>
          )}
        </form>
      </div>

      {/* Analysis Results */}
      {currentResult && (
        <div className="animate-fade-in">
          <AnalysisView result={currentResult} />
        </div>
      )}
    </div>
  );
};

export default InteractionPage;
