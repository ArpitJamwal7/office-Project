import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
// TODO: Replace with your actual Firebase configuration
// 1. Go to Firebase Console -> Project Settings
// 2. Add a Web App and copy the config below
const firebaseConfig = {
  apiKey: "AIzaSyBOHBcO2i32jjuYogk1zpPX0L4ZiRENnQI",
  authDomain: "office-project-20fc1.firebaseapp.com",
  projectId: "office-project-20fc1",
  storageBucket: "office-project-20fc1.appspot.com", // FIXED
  messagingSenderId: "843440005577",
  appId: "1:843440005577:web:6a12785d203faf62d80818"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

console.log("✅ Firebase Connected");