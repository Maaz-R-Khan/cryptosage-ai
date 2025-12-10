import React, { useState, useEffect } from 'react';
import { CryptoData, AnalysisResult, Session } from '../types';
import { fetchCryptoPrices } from '../services/cryptoService';
import { generateCryptoAnalysis } from '../services/geminiService';
import { saveSession } from '../services/storageService';
import CryptoWidget from '../components/CryptoWidget';
import AnalysisView from '../components/AnalysisView';

interface InteractionPageProps {
  userId: string;
  initialPrompt?: string;
  onClearInitialPrompt: () => void;
}

const InteractionPage: React.FC<InteractionPageProps> = ({ userId, initialPrompt, onClearInitialPrompt }) => {
  const [prompt, setPrompt] = useState('');
  const [cryptoData, setCryptoData] = useState<CryptoData | null>(null);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load prices on mount
  const loadPrices = async () => {
    setLoadingPrices(true);
    try {
      const data = await fetchCryptoPrices();
      setCryptoData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPrices(false);
    }
  };

  useEffect(() => {
    loadPrices();
  }, []);

  // Handle initial prompt from history re-use
  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
      onClearInitialPrompt();
      // Scroll to input
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [initialPrompt, onClearInitialPrompt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !cryptoData) return;

    setAnalyzing(true);
    setError(null);
    setCurrentResult(null);

    try {
      const result = await generateCryptoAnalysis(prompt, cryptoData);
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

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Market Intelligence</h1>
        <p className="text-slate-400">Real-time crypto insights powered by Gemini 2.5 Flash.</p>
      </div>

      <CryptoWidget 
        data={cryptoData} 
        loading={loadingPrices} 
        onRefresh={loadPrices} 
      />

      <form onSubmit={handleSubmit} className="mb-10">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask about market trends, specific coins, or investment strategies..."
            className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl p-4 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-0 transition-colors min-h-[120px] resize-none"
            disabled={analyzing}
          />
          <div className="absolute bottom-4 right-4">
            <button
              type="submit"
              disabled={analyzing || !prompt.trim() || !cryptoData}
              className={`
                px-6 py-2 rounded-lg font-medium shadow-lg transition-all flex items-center gap-2
                ${analyzing || !prompt.trim() 
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:scale-105'}
              `}
            >
              {analyzing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                'Generate Analysis'
              )}
            </button>
          </div>
        </div>
        {error && (
            <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-lg text-sm">
                {error}
            </div>
        )}
      </form>

      {currentResult && <AnalysisView result={currentResult} />}
    </div>
  );
};

export default InteractionPage;
