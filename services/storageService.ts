import { User, Session } from '../types';

const USERS_KEY = 'cs_users';
const SESSIONS_KEY = 'cs_sessions';
const CURRENT_USER_KEY = 'cs_current_user';

// --- Auth Simulation ---

export const getStoredUser = (): User | null => {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const signIn = async (email: string): Promise<User> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const usersStr = localStorage.getItem(USERS_KEY);
  const users: User[] = usersStr ? JSON.parse(usersStr) : [];
  
  let user = users.find((u) => u.email === email);
  
  if (!user) {
    // Auto-register for this demo if not found
    user = {
      uid: crypto.randomUUID(),
      email,
      displayName: email.split('@')[0],
    };
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
};

export const signOut = async (): Promise<void> => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

// --- Firestore Simulation ---

export const saveSession = async (session: Session): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const sessionsStr = localStorage.getItem(SESSIONS_KEY);
  const sessions: Session[] = sessionsStr ? JSON.parse(sessionsStr) : [];
  sessions.unshift(session); // Add to top
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};

export const getSessions = async (userId: string): Promise<Session[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const sessionsStr = localStorage.getItem(SESSIONS_KEY);
  const sessions: Session[] = sessionsStr ? JSON.parse(sessionsStr) : [];
  return sessions.filter((s) => s.userId === userId);
};
