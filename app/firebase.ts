import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDQTmmz-exJhG5BAyZ47ba6rpbdHpDbIXM",
  authDomain: "projectboard-a2f67.firebaseapp.com",
  projectId: "projectboard-a2f67",
  storageBucket: "projectboard-a2f67.firebasestorage.app",
  messagingSenderId: "730404636736",
  appId: "1:730404636736:web:15aabc83dbd0d54302b7a5",
  measurementId: "G-Z8M0MWS0QX"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});
