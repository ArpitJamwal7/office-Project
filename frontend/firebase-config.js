import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your actual Firebase configuration
// 1. Go to Firebase Console -> Project Settings
// 2. Add a Web App and copy the config below
const firebaseConfig = {
  apiKey: "AIzaSyBOHBcO2i32jjuYogk1zpPX0L4ZiRENnQI",
  authDomain: "office-project-20fc1.firebaseapp.com",
  projectId: "office-project-20fc1",
  storageBucket: "office-project-20fc1.firebasestorage.app",
  messagingSenderId: "843440005577",
  appId: "1:843440005577:web:6a12785d203faf62d80818",
  measurementId: "G-R20VT8CFG1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
