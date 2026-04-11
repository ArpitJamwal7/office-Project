import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// UPDATED configuration for project: office-project-fe76d-39edb
const firebaseConfig = {
  apiKey: "AIzaSyA_ydnErG0VyN1NYNAX_sgD_YUZr31qEkQ",
  authDomain: "office-project-fe76d-39edb.firebaseapp.com",
  projectId: "office-project-fe76d-39edb",
  storageBucket: "office-project-fe76d-39edb.firebasestorage.app",
  messagingSenderId: "45198425191",
  appId: "1:45198425191:web:15db3e99c76ffe7407e8c2",
  measurementId: "G-DSQQVGPB7C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);

console.log("✅ Firebase Connected to: office-project-fe76d-39edb");