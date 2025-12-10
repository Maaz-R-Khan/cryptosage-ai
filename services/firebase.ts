import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = {
  currentUser: null
};

export const db = {};
