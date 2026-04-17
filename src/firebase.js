// src/firebase.js - الإصدار المعدل
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, serverTimestamp } from "firebase/firestore"; // أعد serverTimestamp هنا
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBAibtWaULf5uqhCNx2ASdvhmYgsxWj8zA",
  authDomain: "demore-d3c07.firebaseapp.com",
  projectId: "demore-d3c07",
  storageBucket: "demore-d3c07.firebasestorage.app",
  messagingSenderId: "410562840678",
  appId: "1:410562840678:web:73c7af8db69efdd53c05a7",
  measurementId: "G-X8GLNXW2KM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// تصدير جميع الخدمات المطلوبة
export { 
  auth, 
  db, 
  storage,
  serverTimestamp // ✅ أعد هذا السطر
};

export default app;