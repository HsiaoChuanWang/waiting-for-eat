import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FavoriteStatusButtons from "../../features/favorite/components/FavoriteStatusButtons.jsx";
import {
  subscribeFavoriteByUserAndCompany,
  updateFavoriteStatus,
} from "../../services/repositories/favoriteRepository.js";
import useUserStore from "../../stores/userStore.js";

function Like() {
  const { companyId } = useParams();
  const [favorite, setFavorite] = useState();
  const userId = useUserStore((state) => state.userId);

  useEffect(() => {
    if (!userId) return undefined;

    return subscribeFavoriteByUserAndCompany(userId, companyId, setFavorite);
  }, [companyId, userId]);

  const handleLike = (status) => {
    if (!favorite?.favoriteId) return;
    return updateFavoriteStatus(favorite.favoriteId, status);
  };

  return (
    <FavoriteStatusButtons status={favorite?.status} onChange={handleLike} />
  );
}

export default Like;
