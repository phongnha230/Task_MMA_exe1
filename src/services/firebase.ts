import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase Configuration for Task Management App
 */
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDMJG0Z9xw-hCUFkQ_dGPathWvpc2hx_lM',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'todo-19cde.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'todo-19cde',
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'todo-19cde.firebasestorage.app',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '399499739623',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:399499739623:web:b210212af4be4471b9fd42',
  measurementId: 'G-TQNJMH7F1G',
};

// Initialize Firebase App singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore
export const firestore = getFirestore(app);

export default app;
