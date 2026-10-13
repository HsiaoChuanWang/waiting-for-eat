import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseClient.js";
import { mapQuerySnapshot } from "../firebase/firestoreMappers.js";
import { getCompanyById } from "./companyRepository.js";
import { getUserById } from "./userRepository.js";

const POST_COLLECTION = "post";

const getRestaurantById = (companyId) => getCompanyById(companyId);

async function getRestaurantPosts(companyId) {
  const postQuery = query(
    collection(db, POST_COLLECTION),
    where("companyId", "==", companyId),
  );
  const snapshot = await getDocs(postQuery);
  const posts = mapQuerySnapshot(snapshot, "postId");

  return Promise.all(
    posts.map(async (post) => {
      const author = await getUserById(post.userId);

      return {
        ...post,
        userName: author?.userName ?? "",
        picture: author?.picture ?? "",
      };
    }),
  );
}

async function getRestaurantPageData(companyId) {
  const [restaurant, posts] = await Promise.all([
    getRestaurantById(companyId),
    getRestaurantPosts(companyId),
  ]);

  return {
    restaurant,
    menu: restaurant?.menu ?? [],
    activity: restaurant?.description ?? "",
    posts,
  };
}

export { getRestaurantById, getRestaurantPageData, getRestaurantPosts };
