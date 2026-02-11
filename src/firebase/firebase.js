// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCQJFDwMOMxmOqDeF6Scwlnm4JveTdidtE",
  authDomain: "student-portal-f3ee8.firebaseapp.com",
  projectId: "student-portal-f3ee8",
  storageBucket: "student-portal-f3ee8.firebasestorage.app",
  messagingSenderId: "1039522295742",
  appId: "1:1039522295742:web:b0f23515859c39e97513ef",
  measurementId: "G-8EXY2321HB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
