import FavoriteRestaurantList from "../../features/diner/components/FavoriteRestaurantList.jsx";
import { FAVORITE_STATUS } from "../../services/repositories/favoriteRepository.js";

function LikeShop() {
  return <FavoriteRestaurantList status={FAVORITE_STATUS.LIKE} />;
}

export default LikeShop;
