import React, { useState } from 'react';
import { signIn, signUp } from '../services/storageService';
import { User } from '../types';
import { BrainCircuit } from './Icons';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
        setError("Please enter both email and password.");
        return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      let user: User;
      if (isRegistering) {
        user = await signUp(email, password);
      } else {
        user = await signIn(email, password);
      }
      onLogin(user);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential') {
          setError("Invalid email or password.");
      } else if (err.code === 'auth/email-already-in-use') {
          setError("Email is already registered.");
      } else if (err.code === 'auth/weak-password') {
          setError("Password should be at least 6 characters.");
      } else {
          setError(err.message || "Authentication failed. Check console.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md glass-card rounded-3xl p-10 shadow-2xl animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl mb-6 glow-blue">
             <BrainCircuit className="w-12 h-12 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-3">Welcome to CryptoSage</h1>
          <p className="text-white/60">
             {isRegistering ? 'Create an account to start your AI-powered crypto journey' : 'Sign in to access your dashboard'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full glass rounded-xl px-4 py-3.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 smooth-transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full glass rounded-xl px-4 py-3.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 smooth-transition"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          {error && (
            <div className="glass bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-300">
                {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3.5 rounded-xl smooth-transition flex justify-center items-center gap-2 glow-blue disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : (
               isRegistering ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => {
                setIsRegistering(!isRegistering);
                setError(null);
            }}
            className="text-sm text-white/60 hover:text-white smooth-transition"
          >
            {isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
