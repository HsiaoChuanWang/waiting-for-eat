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

const POST_COLLECTION = "post";

function mapPostSnapshot(snapshot) {
  return mapDocumentSnapshot(snapshot, "postId");
}

function mapPostQuerySnapshot(snapshot) {
  return mapQuerySnapshot(snapshot, "postId");
}

async function getPostById(postId) {
  const snapshot = await getDoc(doc(db, POST_COLLECTION, postId));
  return mapPostSnapshot(snapshot);
}

async function getPostsByCompanyId(companyId) {
  const postQuery = query(
    collection(db, POST_COLLECTION),
    where("companyId", "==", companyId),
  );
  const snapshot = await getDocs(postQuery);
  return mapPostQuerySnapshot(snapshot);
}

async function hasPostForOrder(orderId) {
  const postQuery = query(
    collection(db, POST_COLLECTION),
    where("orderId", "==", orderId),
  );
  const snapshot = await getDocs(postQuery);
  return !snapshot.empty;
}

function subscribePostById(postId, onChange) {
  return onSnapshot(doc(db, POST_COLLECTION, postId), (snapshot) => {
    onChange(mapPostSnapshot(snapshot));
  });
}

function subscribePostsByUserId(userId, onChange) {
  const postQuery = query(
    collection(db, POST_COLLECTION),
    where("userId", "==", userId),
  );

  return onSnapshot(postQuery, (snapshot) => {
    onChange(mapPostQuerySnapshot(snapshot));
  });
}

async function createPost(postData) {
  const documentReference = await addDoc(collection(db, POST_COLLECTION), {
    ...postData,
    createTime: serverTimestamp(),
  });

  return documentReference.id;
}

function updatePost(postId, postData) {
  return updateDoc(doc(db, POST_COLLECTION, postId), {
    ...postData,
    createTime: serverTimestamp(),
  });
}

function deletePost(postId) {
  return deleteDoc(doc(db, POST_COLLECTION, postId));
}

export {
  createPost,
  deletePost,
  getPostById,
  getPostsByCompanyId,
  hasPostForOrder,
  subscribePostById,
  subscribePostsByUserId,
  updatePost,
};
