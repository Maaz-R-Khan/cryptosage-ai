import React from 'react';
import { AnalysisResult } from '../types';

interface AnalysisViewProps {
  result: AnalysisResult;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ result }) => {
  const getSentimentColor = (score: number) => {
    if (score >= 70) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 40) return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  const getSentimentLabel = (score: number) => {
    if (score >= 70) return 'Bullish';
    if (score >= 40) return 'Neutral';
    return 'Bearish';
  };

  const getRecommendationColor = (rec: string) => {
    if (rec === 'BUY') return 'from-emerald-500 to-green-600';
    if (rec === 'SELL') return 'from-rose-500 to-red-600';
    return 'from-yellow-500 to-orange-600';
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">AI Market Analysis</h2>
        <div className={`px-6 py-2 rounded-xl text-sm font-bold border ${getSentimentColor(result.sentimentScore)}`}>
          {getSentimentLabel(result.sentimentScore)} • {result.sentimentScore}/100
        </div>
      </div>
      
      <div className="p-6 space-y-8">
        {/* Summary */}
        <div className="space-y-3">
          <h3 className="text-sm uppercase tracking-wider text-white/60 font-semibold">Executive Summary</h3>
          <p className="text-white/90 leading-relaxed text-lg">{result.summary}</p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Key Insights */}
          <div className="glass rounded-xl p-6">
            <h3 className="text-sm uppercase tracking-wider text-white/60 font-semibold mb-4">Key Insights</h3>
            <ul className="space-y-4">
              {result.keyInsights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-3 text-white/90">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex-shrink-0"></div>
                  <span className="leading-relaxed">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Recommendation */}
          <div className="glass rounded-xl p-6 flex flex-col justify-center items-center text-center">
            <h3 className="text-sm uppercase tracking-wider text-white/60 font-semibold mb-4">Recommendation</h3>
            <div className={`text-5xl font-black tracking-widest bg-gradient-to-r ${getRecommendationColor(result.recommendation)} bg-clip-text text-transparent mb-3`}>
              {result.recommendation}
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mb-3"></div>
            <p className="text-xs text-white/50 max-w-xs">
              Based on current market indicators and AI analysis. Not financial advice.
            </p>
          </div>
        </div>

        {/* Sentiment Meter */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-sm uppercase tracking-wider text-white/60 font-semibold mb-4">Market Sentiment</h3>
          <div className="relative">
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  result.sentimentScore >= 70 ? 'bg-gradient-to-r from-emerald-500 to-green-500' :
                  result.sentimentScore >= 40 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                  'bg-gradient-to-r from-rose-500 to-red-500'
                }`}
                style={{ width: `${result.sentimentScore}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-white/50">
              <span>Bearish (0)</span>
              <span>Neutral (50)</span>
              <span>Bullish (100)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;
