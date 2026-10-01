import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

/**
 * CẤU HÌNH FIREBASE DỰ ÁN
 * Expo tự động đọc các biến có tiền tố EXPO_PUBLIC_* từ file .env hoặc EAS Environment Variables
 */
const firebaseConfig = {
  apiKey:
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ,
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  databaseURL:
    process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
};

// Khởi tạo Firebase App (Tránh khởi tạo nhiều lần khi hot reload trên React Native)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Khởi tạo Cloud Firestore
export const firestore = getFirestore(app);

// Khởi tạo Realtime Database
export const realtimeDb = getDatabase(app);

export default app;
