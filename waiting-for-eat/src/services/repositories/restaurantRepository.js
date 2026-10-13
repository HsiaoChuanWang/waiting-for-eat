import { getCompanyById } from "./companyRepository.js";
import { getPostsByCompanyId } from "./postRepository.js";
import { getUserById } from "./userRepository.js";

const getRestaurantById = (companyId) => getCompanyById(companyId);

async function getRestaurantPosts(companyId) {
  const posts = await getPostsByCompanyId(companyId);

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
