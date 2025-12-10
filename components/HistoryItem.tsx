import React, { useState } from 'react';
import { Session } from '../types';

interface HistoryItemProps {
  session: Session;
  onResend: (prompt: string) => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ session, onResend }) => {
  const [expanded, setExpanded] = useState(false);
  
  const dateStr = new Date(session.timestamp).toLocaleString();
  const sentiment = session.response.sentimentScore;
  const sentimentColor = sentiment >= 60 ? 'text-emerald-400' : sentiment >= 40 ? 'text-yellow-400' : 'text-rose-400';

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden transition-all hover:border-slate-600">
      <div 
        className="p-4 cursor-pointer flex justify-between items-center"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0 pr-4">
          <p className="text-slate-200 font-medium truncate">{session.prompt}</p>
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
            <span>{dateStr}</span>
            <span>•</span>
            <span>BTC: ${session.cryptoContext.bitcoin.usd.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
             <div className={`text-sm font-bold ${sentimentColor}`}>
                {session.response.recommendation}
             </div>
             <svg 
                className={`w-5 h-5 text-slate-500 transition-transform ${expanded ? 'rotate-180' : ''}`} 
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
             >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
             </svg>
        </div>
      </div>

      {expanded && (
        <div className="p-4 border-t border-slate-700 bg-slate-900/30">
          <div className="mb-4">
             <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">Summary</h4>
             <p className="text-sm text-slate-300">{session.response.summary}</p>
          </div>
          <div className="flex justify-end">
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onResend(session.prompt);
                }}
                className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md transition-colors"
            >
                Edit & Resend
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryItem;
