import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebaseClient.js";
import { mapQuerySnapshot } from "../firebase/firestoreMappers.js";

const ORDER_COLLECTION = "order";

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
  deleteOrder,
  markOrderAttended,
  subscribeOrdersByCompanyId,
  updateOrderSchedule,
};
