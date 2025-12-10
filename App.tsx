
import React, { useState, useEffect } from 'react';
// import { onAuthStateChanged } from 'firebase/auth'; // Removed broken import
import { onAuthStateChanged } from './services/storageService'; // Use mock implementation
import { auth } from './services/firebase';
import Layout from './components/Layout';
import Auth from './components/Auth';
import InteractionPage from './pages/InteractionPage';
import HistoryPage from './pages/HistoryPage';
import { User, AppRoute } from './types';
import { signOut } from './services/storageService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.AUTH);
  const [init, setInit] = useState(true);
  const [reusePrompt, setReusePrompt] = useState<string>('');

  useEffect(() => {
    // Real-time listener for Auth state using the mock service
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: any) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User'
        });
        // If we are on the Auth screen and user is detected, move to Dashboard
        if (currentRoute === AppRoute.AUTH) {
            setCurrentRoute(AppRoute.DASHBOARD);
        }
      } else {
        setUser(null);
        setCurrentRoute(AppRoute.AUTH);
      }
      setInit(false);
    });

    return () => unsubscribe();
  }, [currentRoute]);

  const handleLogin = (newUser: User) => {
    // onAuthStateChanged will handle the state update automatically
  };

  const handleLogout = async () => {
    await signOut();
  };

  const handleResend = (prompt: string) => {
    setReusePrompt(prompt);
    setCurrentRoute(AppRoute.DASHBOARD);
  };

  if (init) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
        </div>
      );
  }

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
