import FavoriteRestaurantList from "../../features/diner/components/FavoriteRestaurantList.jsx";
import { FAVORITE_STATUS } from "../../services/repositories/favoriteRepository.js";

function DislikeShop() {
  return <FavoriteRestaurantList status={FAVORITE_STATUS.DISLIKE} />;
}

export default DislikeShop;
