
import { User, Session } from '../types';

// Mock Constants
const USERS_KEY = 'cs_users';
const SESSIONS_KEY = 'cs_sessions';
const CURRENT_USER_KEY = 'cs_current_user';

// Helper to create Firebase-like errors
const createError = (code: string, message: string) => {
  const error: any = new Error(message);
  error.code = code;
  return error;
};

// --- Mock Auth ---

// Event system for auth changes
const authListeners: Set<(user: User | null) => void> = new Set();

const notifyAuthChange = (user: User | null) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
  
  // Notify subscribers in this tab
  authListeners.forEach(listener => listener(user));
  
  // Dispatch event for other parts of the app if needed
  window.dispatchEvent(new CustomEvent('auth-state-change', { detail: user }));
};

// Mock onAuthStateChanged to replace Firebase's version
export const onAuthStateChanged = (auth: any, callback: (user: User | null) => void) => {
  // Register listener
  authListeners.add(callback);

  // Initial state check
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  if (stored) {
    try {
      callback(JSON.parse(stored));
    } catch (e) {
      callback(null);
    }
  } else {
    callback(null);
  }

  // Return unsubscribe function
  return () => {
    authListeners.delete(callback);
  };
};

export const signIn = async (email: string, password: string): Promise<User> => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 500));

  const usersStr = localStorage.getItem(USERS_KEY);
  const users: any[] = usersStr ? JSON.parse(usersStr) : [];
  
  const foundUser = users.find(u => u.email === email && u.password === password);

  if (foundUser) {
    const user: User = {
      uid: foundUser.uid,
      email: foundUser.email,
      displayName: foundUser.displayName
    };
    notifyAuthChange(user);
    return user;
  }

  throw createError('auth/invalid-credential', 'Invalid email or password.');
};

export const signUp = async (email: string, password: string): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  if (password.length < 6) {
    throw createError('auth/weak-password', 'Password should be at least 6 characters.');
  }

  const usersStr = localStorage.getItem(USERS_KEY);
  const users: any[] = usersStr ? JSON.parse(usersStr) : [];

  if (users.some(u => u.email === email)) {
    throw createError('auth/email-already-in-use', 'Email is already registered.');
  }

  const newUser = {
    uid: crypto.randomUUID(),
    email,
    password, // Storing plain text for mock/demo purposes only
    displayName: email.split('@')[0],
    createdAt: Date.now()
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  const userResult: User = {
    uid: newUser.uid,
    email: newUser.email,
    displayName: newUser.displayName
  };
  
  notifyAuthChange(userResult);
  return userResult;
};

export const signOut = async (): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  notifyAuthChange(null);
};

// --- Mock Firestore (LocalStorage) ---

export const saveSession = async (session: Session): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const sessionsStr = localStorage.getItem(SESSIONS_KEY);
  const sessions: Session[] = sessionsStr ? JSON.parse(sessionsStr) : [];
  
  sessions.push(session);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};

export const getSessions = async (userId: string): Promise<Session[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const sessionsStr = localStorage.getItem(SESSIONS_KEY);
  const sessions: Session[] = sessionsStr ? JSON.parse(sessionsStr) : [];
  
  return sessions
    .filter(s => s.userId === userId)
    .sort((a, b) => b.timestamp - a.timestamp);
};
