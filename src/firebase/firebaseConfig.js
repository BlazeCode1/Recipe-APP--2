// firebaseConfig.js
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const { getAuth } = require('firebase/auth');

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUyZwqGfEFsSycrCJOA2m_N1PQWvbsU1k",
  authDomain: "makeit-c8c9b.firebaseapp.com",
  projectId: "makeit-c8c9b",
  storageBucket: "makeit-c8c9b.appspot.com",
  messagingSenderId: "616985108840",
  appId: "1:616985108840:web:970ea805327ad5a91e36dd"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

module.exports = { db, auth };