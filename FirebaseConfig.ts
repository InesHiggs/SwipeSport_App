// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA32t0SW6fLKLzL59SK2IsvmH479aexUrY",
  authDomain: "swipesport-9c704.firebaseapp.com",
  projectId: "swipesport-9c704",
  storageBucket: "swipesport-9c704.firebasestorage.app",
  messagingSenderId: "141299660032",
  appId: "1:141299660032:web:315ed5555a1c49c8d86fe5",
  measurementId: "G-3NTF99VT75",
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
