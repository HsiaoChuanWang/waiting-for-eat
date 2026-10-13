import { getApp, getApps, initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "project-fire-6a02f.firebaseapp.com",
  projectId: "project-fire-6a02f",
  storageBucket: "project-fire-6a02f.appspot.com",
  messagingSenderId: "938279563215",
  appId: "1:938279563215:web:19960404f8ca45f41bacba",
  measurementId: "G-MLHM03JQLJ",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleAuthProvider = new GoogleAuthProvider();

export { app, auth, db, googleAuthProvider, storage };
