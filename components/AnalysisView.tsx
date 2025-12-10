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

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-2xl animate-fade-in-up">
      <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/80">
        <h2 className="text-lg font-semibold text-slate-100">Market Analysis</h2>
        <span className={`px-4 py-1 rounded-full text-sm font-bold border ${getSentimentColor(result.sentimentScore)}`}>
          {getSentimentLabel(result.sentimentScore)} ({result.sentimentScore}/100)
        </span>
      </div>
      
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-2">Executive Summary</h3>
          <p className="text-slate-300 leading-relaxed">{result.summary}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-slate-900/50 rounded-lg p-4">
              <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-3">Key Insights</h3>
              <ul className="space-y-2">
                {result.keyInsights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0"></span>
                    {insight}
                  </li>
                ))}
              </ul>
           </div>
           
           <div className="bg-slate-900/50 rounded-lg p-4 flex flex-col justify-center items-center text-center">
              <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-2">Recommendation</h3>
              <div className={`text-3xl font-black tracking-widest ${
                  result.recommendation === 'BUY' ? 'text-emerald-400' : 
                  result.recommendation === 'SELL' ? 'text-rose-400' : 'text-yellow-400'
              }`}>
                  {result.recommendation}
              </div>
              <p className="text-xs text-slate-500 mt-2 max-w-xs">
                Based on current indicators. Not financial advice.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;
