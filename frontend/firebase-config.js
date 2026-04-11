import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your new web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkLhVUkKyTpDsiuWeYgKcB5cfA9w8xDTU",
  authDomain: "office-project-fe76d.firebaseapp.com",
  projectId: "office-project-fe76d",
  storageBucket: "office-project-fe76d.firebasestorage.app",
  messagingSenderId: "930957679615",
  appId: "1:930957679615:web:6b9ed96c72bf24c0a3e5ca",
  measurementId: "G-GB69TSWHR7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services for use in script.js and admin.js
export const auth = getAuth(app);
export const db = getFirestore(app);

console.log("✅ Firebase Connected to New Project: office-project-fe76d");