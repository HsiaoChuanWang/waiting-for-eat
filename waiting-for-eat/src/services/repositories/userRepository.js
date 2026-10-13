import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseClient.js";
import { mapDocumentSnapshot } from "../firebase/firestoreMappers.js";

const USER_COLLECTION = "user";

async function getUserById(userId) {
  const snapshot = await getDoc(doc(db, USER_COLLECTION, userId));

  return mapDocumentSnapshot(snapshot);
}

function saveUser(userId, userData) {
  return setDoc(doc(db, USER_COLLECTION, userId), userData);
}

export { getUserById, saveUser };
