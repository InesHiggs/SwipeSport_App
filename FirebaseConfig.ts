// Import the functions you need from the SDKs you need
import { initializeApp} from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA32t0SW6fLKLzL59SK2IsvmH479aexUrY",
  authDomain: "swipesport-9c704.firebaseapp.com",
  projectId: "swipesport-9c704",
  storageBucket: "swipesport-9c704.firebasestorage.app",
  messagingSenderId: "141299660032",
  appId: "1:141299660032:web:315ed5555a1c49c8d86fe5",
  measurementId: "G-3NTF99VT75"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(app);
export const FIRESTORE_DB = getFirestore(app);
export default app;

//const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);