import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// --- IMPORTANT: PASTE YOUR FIREBASE CONFIG HERE ---
// You can get this from the Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: "AIzaSyAnzwQczSM1myOIzfvGYwgJShv2MsTjc6I",
  authDomain: "cryptosage-ai-5f959.firebaseapp.com",
  projectId: "cryptosage-ai-5f959",
  storageBucket: "cryptosage-ai-5f959.firebasestorage.app",
  messagingSenderId: "765504895512",
  appId: "1:765504895512:web:73b3ff7769858eeca3a16d"
};

// Initialize Firebase with error handling
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  throw error;
}

export { auth, db };
