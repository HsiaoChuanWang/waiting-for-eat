import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase/firebaseClient.js";

export async function getUserInfoFromFirestore(userId) {
  const userRef = doc(db, "user", userId);
  const UserSnap = await getDoc(userRef);

  const userInfo = UserSnap.data();
  return userInfo;
}

export async function getCompanyInfoFromFirestore(companyId) {
  const companyRef = doc(db, "company", companyId);
  const companySnap = await getDoc(companyRef);

  const companyInfo = companySnap.data();
  return companyInfo;
}
