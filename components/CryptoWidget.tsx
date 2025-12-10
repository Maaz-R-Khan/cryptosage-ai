import React from 'react';
import { CryptoData } from '../types';
import { BitcoinIcon, TrendingUp } from './Icons';

interface CryptoWidgetProps {
  data: CryptoData | null;
  loading: boolean;
  onRefresh: () => void;
}

const CryptoWidget: React.FC<CryptoWidgetProps> = ({ data, loading, onRefresh }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 animate-pulse">
        <div className="h-24 bg-slate-800 rounded-xl"></div>
        <div className="h-24 bg-slate-800 rounded-xl"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      {/* Bitcoin Card */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-500/10 rounded-full">
            <BitcoinIcon className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Bitcoin</p>
            <p className="text-xl font-bold text-slate-100">${data.bitcoin.usd.toLocaleString()}</p>
          </div>
        </div>
        <div className="text-emerald-400">
           <TrendingUp className="w-5 h-5" />
        </div>
      </div>

      {/* Ethereum Card */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 rounded-full">
            <svg className="w-6 h-6 text-indigo-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
            </svg>
          </div>
          <div>
            <p className="text-sm text-slate-400 font-medium">Ethereum</p>
            <p className="text-xl font-bold text-slate-100">${data.ethereum.usd.toLocaleString()}</p>
          </div>
        </div>
        <div className="text-emerald-400">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>
      
      <div className="col-span-1 sm:col-span-2 flex justify-end">
         <button onClick={onRefresh} className="text-xs text-indigo-400 hover:text-indigo-300 underline">
            Refresh Prices
         </button>
      </div>
    </div>
  );
};

export default CryptoWidget;
