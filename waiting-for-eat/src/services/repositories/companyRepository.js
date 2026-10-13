import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseClient.js";
import { mapDocumentSnapshot } from "../firebase/firestoreMappers.js";

const COMPANY_COLLECTION = "company";

async function getCompanyById(companyId) {
  const snapshot = await getDoc(doc(db, COMPANY_COLLECTION, companyId));

  return mapDocumentSnapshot(snapshot);
}

async function createCompany(companyData) {
  const documentReference = await addDoc(
    collection(db, COMPANY_COLLECTION),
    companyData,
  );

  return documentReference.id;
}

function subscribeCompanyById(companyId, onChange) {
  return onSnapshot(doc(db, COMPANY_COLLECTION, companyId), (snapshot) => {
    onChange(mapDocumentSnapshot(snapshot));
  });
}

function updateCompany(companyId, companyData) {
  return updateDoc(doc(db, COMPANY_COLLECTION, companyId), companyData);
}

async function getCompanyCategoryType(categoryId) {
  const snapshot = await getDoc(doc(db, "category", categoryId));
  return mapDocumentSnapshot(snapshot)?.type ?? "";
}

export {
  createCompany,
  getCompanyById,
  getCompanyCategoryType,
  subscribeCompanyById,
  updateCompany,
};
