import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/firebaseClient.js";
import { mapQuerySnapshot } from "../firebase/firestoreMappers.js";

const getOpeningTimeCollection = (companyId) =>
  collection(db, "company", companyId, "openTime");

function subscribeOpeningTimes(companyId, onChange) {
  return onSnapshot(getOpeningTimeCollection(companyId), (snapshot) => {
    onChange(mapQuerySnapshot(snapshot, "timeId"));
  });
}

function createOpeningTime(companyId, openingTime) {
  return addDoc(getOpeningTimeCollection(companyId), openingTime);
}

function deleteOpeningTime(companyId, timeId) {
  return deleteDoc(doc(getOpeningTimeCollection(companyId), timeId));
}

export { createOpeningTime, deleteOpeningTime, subscribeOpeningTimes };
