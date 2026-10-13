import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebaseClient.js";
import { mapQuerySnapshot } from "../firebase/firestoreMappers.js";

const ORDER_COLLECTION = "order";

function createOrder(order) {
  return addDoc(collection(db, ORDER_COLLECTION), order);
}

async function getOrdersByCompanyAndDate(companyId, date) {
  const orderQuery = query(
    collection(db, ORDER_COLLECTION),
    where("companyId", "==", companyId),
    where("date", "==", date),
  );
  const snapshot = await getDocs(orderQuery);

  return mapQuerySnapshot(snapshot, "orderId");
}

function subscribeOrdersByCompanyId(companyId, onChange) {
  const orderQuery = query(
    collection(db, ORDER_COLLECTION),
    where("companyId", "==", companyId),
  );

  return onSnapshot(orderQuery, (snapshot) => {
    onChange(mapQuerySnapshot(snapshot, "orderId"));
  });
}

function updateOrderSchedule(orderId, { end, start, tableNumber }) {
  return updateDoc(doc(db, ORDER_COLLECTION, orderId), {
    end,
    start,
    tableNumber,
  });
}

function markOrderAttended(orderId) {
  return updateDoc(doc(db, ORDER_COLLECTION, orderId), { attend: "yes" });
}

function deleteOrder(orderId) {
  return deleteDoc(doc(db, ORDER_COLLECTION, orderId));
}

export {
  createOrder,
  deleteOrder,
  getOrdersByCompanyAndDate,
  markOrderAttended,
  subscribeOrdersByCompanyId,
  updateOrderSchedule,
};
