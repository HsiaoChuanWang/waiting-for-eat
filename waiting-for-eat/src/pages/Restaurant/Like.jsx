import { useEffect, useState } from "react";
import { IconContext } from "react-icons";
import {
  HiOutlineThumbDown,
  HiOutlineThumbUp,
  HiThumbDown,
  HiThumbUp,
} from "react-icons/hi";
import { useParams } from "react-router-dom";
import {
  FAVORITE_STATUS,
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
    <div className="flex h-10 w-28 items-center justify-center rounded-xl border border-solid bg-gray-200">
      <div className="mr-1">
        <IconContext.Provider value={{ size: "30px" }}>
          {favorite?.status === FAVORITE_STATUS.LIKE ? (
            <HiThumbUp onClick={() => handleLike(FAVORITE_STATUS.EATEN)} />
          ) : (
            <HiOutlineThumbUp
              onClick={() => handleLike(FAVORITE_STATUS.LIKE)}
            />
          )}
        </IconContext.Provider>
      </div>
      <p className="mr-1">|</p>
      <IconContext.Provider value={{ size: "30px" }}>
        {favorite?.status === FAVORITE_STATUS.DISLIKE ? (
          <HiThumbDown onClick={() => handleLike(FAVORITE_STATUS.EATEN)} />
        ) : (
          <HiOutlineThumbDown
            onClick={() => handleLike(FAVORITE_STATUS.DISLIKE)}
          />
        )}
      </IconContext.Provider>
    </div>
  );
}

export default Like;
