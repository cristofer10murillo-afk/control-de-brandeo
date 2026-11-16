import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBSdiVpgstJrbBq5KdRoEvMNoKNK9O_VRA',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'gestor-de-equipos-pro-3ed23.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'gestor-de-equipos-pro-3ed23',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'gestor-de-equipos-pro-3ed23.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '474923440909',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:474923440909:web:1b3103e793bf4a19512e44'
};

let app = null;
let db = null;

try {
  const currentApps = getApps();
  app = currentApps.length > 0 ? currentApps[0] : initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.error('Firebase initialization error in Control de Brandeo:', error);
}

export { app, db };
