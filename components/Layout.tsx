import React from 'react';
import { User, AppRoute } from '../types';
import { BrainCircuit, HistoryIcon, LogOut } from './Icons';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, currentRoute, onNavigate, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans">
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate(AppRoute.DASHBOARD)}>
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <BrainCircuit className="w-6 h-6 text-indigo-400" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                CryptoSage AI
              </span>
            </div>

            {user && (
              <div className="flex items-center gap-2 sm:gap-6">
                 <button
                  onClick={() => onNavigate(AppRoute.DASHBOARD)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentRoute === AppRoute.DASHBOARD ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => onNavigate(AppRoute.HISTORY)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentRoute === AppRoute.HISTORY ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <HistoryIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">History</span>
                </button>
                <div className="h-6 w-px bg-slate-700 mx-2 hidden sm:block"></div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-medium text-slate-200">{user.displayName}</span>
                    <span className="text-xs text-slate-500">{user.email}</span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-full transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="border-t border-slate-800 bg-slate-950 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} CryptoSage AI. Powered by Google Gemini & CoinGecko.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
