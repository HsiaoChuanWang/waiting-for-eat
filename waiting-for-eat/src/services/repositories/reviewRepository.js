import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebaseClient.js";
import {
  mapDocumentSnapshot,
  mapQuerySnapshot,
} from "../firebase/firestoreMappers.js";

const REVIEW_COLLECTION = "star";
const COMPANY_COLLECTION = "company";

const mapReviewSnapshot = (snapshot) => mapDocumentSnapshot(snapshot, "starId");
const mapReviewQuerySnapshot = (snapshot) =>
  mapQuerySnapshot(snapshot, "starId");

async function getReviewById(starId) {
  const snapshot = await getDoc(doc(db, REVIEW_COLLECTION, starId));
  return mapReviewSnapshot(snapshot);
}

async function getReviewsByCompanyId(companyId) {
  const reviewQuery = query(
    collection(db, REVIEW_COLLECTION),
    where("companyId", "==", companyId),
  );
  const snapshot = await getDocs(reviewQuery);
  return mapReviewQuerySnapshot(snapshot);
}

async function hasReviewForOrder(orderId) {
  const reviewQuery = query(
    collection(db, REVIEW_COLLECTION),
    where("orderId", "==", orderId),
  );
  const snapshot = await getDocs(reviewQuery);
  return !snapshot.empty;
}

function subscribeReviewsByUserId(userId, onChange) {
  const reviewQuery = query(
    collection(db, REVIEW_COLLECTION),
    where("userId", "==", userId),
  );

  return onSnapshot(reviewQuery, (snapshot) => {
    onChange(mapReviewQuerySnapshot(snapshot));
  });
}

async function updateCompanyRating(companyId) {
  const reviews = await getReviewsByCompanyId(companyId);
  const total = reviews.reduce((sum, review) => sum + review.star, 0);
  const totalStar = reviews.length > 0 ? total / reviews.length : 0;

  await updateDoc(doc(db, COMPANY_COLLECTION, companyId), { totalStar });
  return totalStar;
}

async function createReview(reviewData) {
  const documentReference = await addDoc(collection(db, REVIEW_COLLECTION), {
    ...reviewData,
    createTime: serverTimestamp(),
  });
  await updateCompanyRating(reviewData.companyId);
  return documentReference.id;
}

async function updateReview(starId, companyId, reviewData) {
  await updateDoc(doc(db, REVIEW_COLLECTION, starId), reviewData);
  return updateCompanyRating(companyId);
}

async function deleteReview(starId, companyId) {
  await deleteDoc(doc(db, REVIEW_COLLECTION, starId));
  return updateCompanyRating(companyId);
}

export {
  createReview,
  deleteReview,
  getReviewById,
  getReviewsByCompanyId,
  hasReviewForOrder,
  subscribeReviewsByUserId,
  updateCompanyRating,
  updateReview,
};
