import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCmuyz0CPJr9fTtrAhSctEkvzzBLAumpQc",
  authDomain: "meharoli-travels.firebaseapp.com",
  projectId: "meharoli-travels",
  storageBucket: "meharoli-travels.firebasestorage.app",
  messagingSenderId: "593024516857",
  appId: "1:593024516857:web:469240f248b469ea7c1828",
  measurementId: "G-Q5GBY8PTKS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
