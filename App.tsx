import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Auth from './components/Auth';
import InteractionPage from './pages/InteractionPage';
import HistoryPage from './pages/HistoryPage';
import { User, AppRoute } from './types';
import { getStoredUser, signOut } from './services/storageService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.AUTH);
  const [init, setInit] = useState(true);
  const [reusePrompt, setReusePrompt] = useState<string>('');

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
      setCurrentRoute(AppRoute.DASHBOARD);
    }
    setInit(false);
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    setCurrentRoute(AppRoute.DASHBOARD);
  };

  const handleLogout = async () => {
    await signOut();
    setUser(null);
    setCurrentRoute(AppRoute.AUTH);
  };

  const handleResend = (prompt: string) => {
    setReusePrompt(prompt);
    setCurrentRoute(AppRoute.DASHBOARD);
  };

  if (init) return null; // Or a loading spinner

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Layout 
      user={user} 
      currentRoute={currentRoute} 
      onNavigate={setCurrentRoute} 
      onLogout={handleLogout}
    >
      {currentRoute === AppRoute.DASHBOARD && (
        <InteractionPage 
            userId={user.uid} 
            initialPrompt={reusePrompt} 
            onClearInitialPrompt={() => setReusePrompt('')}
        />
      )}
      {currentRoute === AppRoute.HISTORY && (
        <HistoryPage 
            userId={user.uid} 
            onResend={handleResend}
        />
      )}
    </Layout>
  );
};

export default App;
