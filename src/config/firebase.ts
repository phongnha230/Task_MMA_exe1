import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

/**
 * CẤU HÌNH FIREBASE DỰ ÁN: todo-19cde
 * Tự động ưu tiên đọc từ biến môi trường (EXPO_PUBLIC_*),
 * và luôn có giá trị fallback an toàn để app không bao giờ bị crash khi thiếu key.
 */
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDMJG0Z9xw-hCUFkQ_dGPathWvpc2hx_lM',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'todo-19cde.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'todo-19cde',
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'todo-19cde.firebasestorage.app',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '399499739623',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:399499739623:web:b210212af4be4471b9fd42',
  databaseURL:
    process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL ||
    'https://todo-19cde-default-rtdb.firebaseio.com',
};

// Khởi tạo Firebase App an toàn (Tránh duplicate app khi reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Khởi tạo Cloud Firestore
export const firestore = getFirestore(app);

// Khởi tạo Firebase Authentication
export const auth = getAuth(app);

export default app;
