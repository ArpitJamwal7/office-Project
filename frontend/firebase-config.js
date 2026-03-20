import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBOHBcO2i32jjuYogk1zpPX0L4ZiRENnQI",
  authDomain: "office-project-20fc1.firebaseapp.com",
  projectId: "office-project-20fc1",
  storageBucket: "office-project-20fc1.appspot.com",
  messagingSenderId: "843440005577",
  appId: "1:843440005577:web:6a12785d203faf62d80818"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

console.log("✅ Firebase Connected");