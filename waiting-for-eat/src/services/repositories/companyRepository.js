import { addDoc, collection, doc, getDoc } from "firebase/firestore";
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

export { createCompany, getCompanyById };
