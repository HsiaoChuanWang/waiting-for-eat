import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebaseClient.js";
import { mapQuerySnapshot } from "../firebase/firestoreMappers.js";

const FAVORITE_COLLECTION = "favorite";

const FAVORITE_STATUS = Object.freeze({
  DISLIKE: "dislike",
  EATEN: "eaten",
  LIKE: "like",
});

function createUserCompanyQuery(userId, companyId) {
  return query(
    collection(db, FAVORITE_COLLECTION),
    where("userId", "==", userId),
    where("companyId", "==", companyId),
  );
}

function subscribeToQuery(favoriteQuery, onChange) {
  return onSnapshot(favoriteQuery, (snapshot) => {
    onChange(mapQuerySnapshot(snapshot, "favoriteId"));
  });
}

async function getFavoriteStatus(companyId, userId) {
  const favorite = await getFavoriteByUserAndCompany(companyId, userId);
  return favorite?.status ?? "";
}

async function getFavoriteByUserAndCompany(companyId, userId) {
  const snapshot = await getDocs(createUserCompanyQuery(userId, companyId));
  const favorites = mapQuerySnapshot(snapshot, "favoriteId");

  return favorites[0];
}

function subscribeFavoriteByUserAndCompany(userId, companyId, onChange) {
  return subscribeToQuery(createUserCompanyQuery(userId, companyId), (items) =>
    onChange(items[0]),
  );
}

function subscribeFavoritesByStatus(userId, status, onChange) {
  const favoriteQuery = query(
    collection(db, FAVORITE_COLLECTION),
    where("userId", "==", userId),
    where("status", "==", status),
  );

  return subscribeToQuery(favoriteQuery, onChange);
}

function subscribeEatenFavorites(userId, onChange) {
  const favoriteQuery = query(
    collection(db, FAVORITE_COLLECTION),
    where("userId", "==", userId),
    where("postId", "==", ""),
  );

  return subscribeToQuery(favoriteQuery, onChange);
}

function updateFavoriteStatus(favoriteId, status) {
  return updateDoc(doc(db, FAVORITE_COLLECTION, favoriteId), { status });
}

function saveEatenFavorite({ companyId, orderId, userId }) {
  return setDoc(doc(db, FAVORITE_COLLECTION, orderId), {
    companyId,
    orderId,
    postId: "",
    status: FAVORITE_STATUS.EATEN,
    userId,
  });
}

export {
  FAVORITE_STATUS,
  getFavoriteByUserAndCompany,
  getFavoriteStatus,
  saveEatenFavorite,
  subscribeEatenFavorites,
  subscribeFavoriteByUserAndCompany,
  subscribeFavoritesByStatus,
  updateFavoriteStatus,
};
