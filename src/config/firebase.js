
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB411jG9bHhRtVBm-XVzPNReFUP4KbtFao",
  authDomain: "shopy-8c630.firebaseapp.com",
  projectId: "shopy-8c630",
  storageBucket: "shopy-8c630.firebasestorage.app",
  messagingSenderId: "421477677564",
  appId: "1:421477677564:web:e09a11997f08783d031a79"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
