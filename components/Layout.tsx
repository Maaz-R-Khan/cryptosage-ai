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
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Modern Glassmorphic Navbar */}
      <nav className="sticky top-0 z-50 glass-strong border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer group smooth-transition"
              onClick={() => onNavigate(AppRoute.DASHBOARD)}
            >
              <div className="p-2.5 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl group-hover:from-blue-500/30 group-hover:to-purple-500/30 smooth-transition glow-blue">
                <BrainCircuit className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <span className="text-2xl font-bold gradient-text">
                  CryptoSage AI
                </span>
                <p className="text-xs text-white/40 -mt-1">Powered by Gemini</p>
              </div>
            </div>

            {user && (
              <div className="flex items-center gap-1 sm:gap-4">
                {/* Navigation Buttons */}
                <button
                  onClick={() => onNavigate(AppRoute.DASHBOARD)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium smooth-transition ${
                    currentRoute === AppRoute.DASHBOARD
                      ? 'glass-strong text-white glow-blue'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => onNavigate(AppRoute.HISTORY)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium smooth-transition ${
                    currentRoute === AppRoute.HISTORY
                      ? 'glass-strong text-white glow-purple'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <HistoryIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">History</span>
                </button>
                
                {/* Divider */}
                <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block"></div>
                
                {/* User Info */}
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-sm font-medium text-white">{user.displayName}</span>
                    <span className="text-xs text-white/40">{user.email}</span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-2.5 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-xl smooth-transition"
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
      
      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Modern Footer */}
      <footer className="border-t border-white/10 glass mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} CryptoSage AI. Powered by{' '}
            <span className="text-blue-400">Google Gemini</span> &{' '}
            <span className="text-purple-400">CoinGecko</span>.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
