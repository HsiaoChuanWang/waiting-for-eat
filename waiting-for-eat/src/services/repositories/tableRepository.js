import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/firebaseClient.js";
import { mapQuerySnapshot } from "../firebase/firestoreMappers.js";

const getTableCollection = (companyId) =>
  collection(db, "company", companyId, "table");

function subscribeTables(companyId, onChange) {
  return onSnapshot(getTableCollection(companyId), (snapshot) => {
    onChange(mapQuerySnapshot(snapshot, "tableId"));
  });
}

function createTable(companyId, table) {
  return addDoc(getTableCollection(companyId), table);
}

function deleteTable(companyId, tableId) {
  return deleteDoc(doc(getTableCollection(companyId), tableId));
}

export { createTable, deleteTable, subscribeTables };
