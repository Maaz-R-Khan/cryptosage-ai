import React, { useEffect, useState } from 'react';
import { Session } from '../types';
import { getSessions } from '../services/storageService';
import HistoryItem from '../components/HistoryItem';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface HistoryPageProps {
  userId: string;
  onResend: (prompt: string) => void;
}

const HistoryPage: React.FC<HistoryPageProps> = ({ userId, onResend }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      const data = await getSessions(userId);
      setSessions(data);
      setLoading(false);
    };
    loadHistory();
  }, [userId]);

  // Prepare chart data (reverse to show chronological order left-to-right)
  const chartData = [...sessions].reverse().map(s => ({
    time: new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sentiment: s.response.sentimentScore
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
           <h1 className="text-3xl font-bold mb-2">Interaction History</h1>
           <p className="text-slate-400">Review your past market queries and AI insights.</p>
        </div>
        <div className="text-right hidden sm:block">
            <div className="text-2xl font-bold text-slate-100">{sessions.length}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider">Total Sessions</div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-16 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
           <p className="text-slate-500">No history found. Start a new analysis!</p>
        </div>
      ) : (
        <>
            {/* Sentiment Trend Chart */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Sentiment Trend</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <XAxis 
                                dataKey="time" 
                                stroke="#64748b" 
                                fontSize={12} 
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis 
                                domain={[0, 100]} 
                                stroke="#64748b" 
                                fontSize={12} 
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                itemStyle={{ color: '#818cf8' }}
                            />
                            <ReferenceLine y={50} stroke="#475569" strokeDasharray="3 3" />
                            <Line 
                                type="monotone" 
                                dataKey="sentiment" 
                                stroke="#818cf8" 
                                strokeWidth={2} 
                                dot={{ fill: '#818cf8', r: 4 }} 
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                {sessions.map((session) => (
                <HistoryItem 
                    key={session.id} 
                    session={session} 
                    onResend={onResend} 
                />
                ))}
            </div>
        </>
      )}
    </div>
  );
};

export default HistoryPage;
