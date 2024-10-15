// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUyZwqGfEFsSycrCJOA2m_N1PQWvbsU1k",
  authDomain: "makeit-c8c9b.firebaseapp.com",
  databaseURL: "https://makeit-c8c9b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "makeit-c8c9b",
  storageBucket: "makeit-c8c9b.appspot.com",
  messagingSenderId: "616985108840",
  appId: "1:616985108840:web:d5feae1aa1c223ed1e36dd"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const realtimeDb = getDatabase(app);