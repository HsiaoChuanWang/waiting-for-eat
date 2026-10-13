import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleAuthProvider } from "../firebase/firebaseClient.js";

function signInWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

function signInWithGoogle() {
  return signInWithPopup(auth, googleAuthProvider);
}

export { signInWithEmail, signInWithGoogle };
