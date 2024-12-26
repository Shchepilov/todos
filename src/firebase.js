// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider  } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const API_KEY = import.meta.env.FIREBASE_API_KEY;
const AUTH_DOMAIN = import.meta.env.FIREBASE_AUTH_DOMAIN;
const PROJECT_ID = import.meta.env.FIREBASE_PROJECT_ID;
const STORAGE_BUCKET = import.meta.env.FIREBASE_STORAGE_BUCKET;
const MESSAGING_SENDER_ID = import.meta.env.FIREBASE_MESSAGING_SENDER_ID;
const APP_ID = import.meta.env.FIREBASE_APP_ID;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };