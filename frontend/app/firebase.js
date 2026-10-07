import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDummyKeyForStaticHostingOnly",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "projetoogus.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "projetoogus",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "projetoogus.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "220819399262",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:220819399262:web:abcdef123456"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_USE_EMULATOR === 'true') {
  if (!window.__firestoreEmulatorConnected) {
    try {
      connectFirestoreEmulator(db, '127.0.0.1', 8080);
      window.__firestoreEmulatorConnected = true;
      console.log('Conectado ao Firestore Emulator em 127.0.0.1:8080');
    } catch (err) {
      console.warn('Erro ao conectar ao Firestore Emulator:', err);
    }
  }
}

export { app, db };
