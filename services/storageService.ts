import { 
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { User, Session } from '../types';

// Convert Firebase User to our User type
const firebaseUserToUser = (firebaseUser: FirebaseUser | null): User | null => {
  if (!firebaseUser) return null;
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User'
  };
};

// --- Real Firebase Auth ---

export const onAuthStateChanged = (
  authInstance: typeof auth, 
  callback: (user: User | null) => void
) => {
  return firebaseOnAuthStateChanged(authInstance, (firebaseUser) => {
    callback(firebaseUserToUser(firebaseUser));
  });
};

export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return firebaseUserToUser(userCredential.user)!;
  } catch (error: any) {
    // Map Firebase errors to our error format
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      const err: any = new Error('Invalid email or password.');
      err.code = 'auth/invalid-credential';
      throw err;
    }
    throw error;
  }
};

export const signUp = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = firebaseUserToUser(userCredential.user)!;
    
    // Create user document in Firestore
    await addDoc(collection(db, 'users'), {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      createdAt: Timestamp.now()
    });
    
    return user;
  } catch (error: any) {
    // Map Firebase errors
    if (error.code === 'auth/weak-password') {
      const err: any = new Error('Password should be at least 6 characters.');
      err.code = 'auth/weak-password';
      throw err;
    }
    if (error.code === 'auth/email-already-in-use') {
      const err: any = new Error('Email is already registered.');
      err.code = 'auth/email-already-in-use';
      throw err;
    }
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};

// --- Real Firestore Operations ---

export const saveSession = async (session: Session): Promise<void> => {
  try {
    await addDoc(collection(db, 'sessions'), {
      userId: session.userId,
      prompt: session.prompt,
      response: session.response,
      cryptoContext: session.cryptoContext,
      timestamp: Timestamp.fromMillis(session.timestamp),
      createdAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error saving session:', error);
    throw error;
  }
};

export const getSessions = async (userId: string): Promise<Session[]> => {
  try {
    const sessionsRef = collection(db, 'sessions');
    const q = query(
      sessionsRef,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const sessions: Session[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      sessions.push({
        id: doc.id,
        userId: data.userId,
        prompt: data.prompt,
        response: data.response,
        cryptoContext: data.cryptoContext,
        timestamp: data.timestamp.toMillis()
      });
    });
    
    return sessions;
  } catch (error) {
    console.error('Error fetching sessions:', error);
    throw error;
  }
};
