import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

/**
 * CẤU HÌNH FIREBASE DỰ ÁN: todo-19cde
 */
const firebaseConfig = {
  apiKey: 'AIzaSyDMJG0Z9xw-hCUFkQ_dGPathWvpc2hx_lM',
  authDomain: 'todo-19cde.firebaseapp.com',
  projectId: 'todo-19cde',
  storageBucket: 'todo-19cde.firebasestorage.app',
  messagingSenderId: '399499739623',
  appId: '1:399499739623:web:b210212af4be4471b9fd42',
  measurementId: 'G-TQNJMH7F1G',
  // Hỗ trợ sẵn nếu bạn muốn dùng Realtime Database
  databaseURL: 'https://todo-19cde-default-rtdb.firebaseio.com',
};

// Khởi tạo Firebase App (Tránh khởi tạo nhiều lần khi hot reload trên React Native)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Khởi tạo Cloud Firestore
export const firestore = getFirestore(app);

// Khởi tạo Realtime Database
export const realtimeDb = getDatabase(app);

export default app;
