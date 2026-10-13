import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase/firebaseClient.js";
import { mapDocumentSnapshot } from "../services/firebase/firestoreMappers.js";

export async function getUserInfoFromFirestore(userId) {
  const userRef = doc(db, "user", userId);
  const UserSnap = await getDoc(userRef);

  return mapDocumentSnapshot(UserSnap);
}

export async function getCompanyInfoFromFirestore(companyId) {
  const companyRef = doc(db, "company", companyId);
  const companySnap = await getDoc(companyRef);

  return mapDocumentSnapshot(companySnap);
}
