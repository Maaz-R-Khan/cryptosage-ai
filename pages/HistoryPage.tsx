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
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
           <h1 className="text-4xl font-bold gradient-text mb-2">Interaction History</h1>
           <p className="text-white/60">Review your past market queries and AI insights.</p>
        </div>
        <div className="text-right hidden sm:block glass-card rounded-xl p-4">
            <div className="text-2xl font-bold text-white">{sessions.length}</div>
            <div className="text-xs text-white/40 uppercase tracking-wider">Total Sessions</div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl border border-dashed border-white/10">
           <p className="text-white/60">No history found. Start a new analysis!</p>
        </div>
      ) : (
        <>
            {/* Sentiment Trend Chart */}
            <div className="glass-card rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-white/60 mb-4 uppercase tracking-wider">Sentiment Trend</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <XAxis
                                dataKey="time"
                                stroke="rgba(255, 255, 255, 0.4)"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                domain={[0, 100]}
                                stroke="rgba(255, 255, 255, 0.4)"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                  borderColor: 'rgba(255, 255, 255, 0.1)',
                                  color: '#ffffff',
                                  backdropFilter: 'blur(10px)'
                                }}
                                itemStyle={{ color: '#60a5fa' }}
                            />
                            <ReferenceLine y={50} stroke="rgba(255, 255, 255, 0.2)" strokeDasharray="3 3" />
                            <Line
                                type="monotone"
                                dataKey="sentiment"
                                stroke="#60a5fa"
                                strokeWidth={3}
                                dot={{ fill: '#60a5fa', r: 5, strokeWidth: 2, stroke: '#1e40af' }}
                                activeDot={{ r: 7, fill: '#3b82f6' }}
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
