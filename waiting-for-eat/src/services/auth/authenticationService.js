import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleAuthProvider } from "../firebase/firebaseClient.js";

function createAccountWithEmail(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

function signInWithEmail(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

function signInWithGoogle() {
  return signInWithPopup(auth, googleAuthProvider);
}

function signOutCurrentUser() {
  return signOut(auth);
}

function subscribeAuthState(onChange) {
  return onAuthStateChanged(auth, onChange);
}

export {
  createAccountWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signOutCurrentUser,
  subscribeAuthState,
};
