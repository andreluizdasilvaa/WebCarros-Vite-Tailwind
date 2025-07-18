
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_PUBLIC_APIKEY,
  authDomain: import.meta.env.VITE_PUBLIC_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PUBLIC_PROJECTID,
  storageBucket: import.meta.env.VITE_PUBLIC_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_PUBLIC_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_PUBLIC_APPID
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp) // Sistema de auth
const db = getFirestore(firebaseApp) // Nosso banco

export { auth, db }