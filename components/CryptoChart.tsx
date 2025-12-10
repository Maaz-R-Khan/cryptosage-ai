import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, CartesianGrid } from 'recharts';
import { CryptoPriceHistory } from '../types';

interface CryptoChartProps {
  data: CryptoPriceHistory;
  cryptoName: string;
  currentPrice: number;
  priceChange: number;
}

const CryptoChart: React.FC<CryptoChartProps> = ({ data, cryptoName, currentPrice, priceChange }) => {
  const hasData = data && data.prices && data.prices.length > 0;
  const isPositive = priceChange >= 0;
  const gradientId = `gradient-${cryptoName.replace(/\s+/g, '-')}`;

  const chartData = hasData
    ? data.prices.map(([timestamp, price]) => ({
        time: new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: Number(price.toFixed(price < 1 ? 6 : 2)),
        fullTime: new Date(timestamp).toLocaleString(),
      }))
    : [];

  if (!hasData) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{cryptoName}</h3>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-white">
                ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
              </span>
              <span className={`text-sm font-semibold px-2 py-1 rounded-lg ${
                isPositive 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center text-white/40">Chart data loading...</div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{cryptoName}</h3>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-white">
              ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={`text-sm font-semibold px-2 py-1 rounded-lg ${
              isPositive 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="time" 
            stroke="rgba(255,255,255,0.4)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.4)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: 'white',
            }}
            labelStyle={{ color: 'rgba(255, 255, 255, 0.6)' }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={isPositive ? '#10b981' : '#ef4444'}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CryptoChart;

