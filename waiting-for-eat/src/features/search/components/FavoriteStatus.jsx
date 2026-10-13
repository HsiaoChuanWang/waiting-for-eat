/* eslint-disable react/prop-types */
import { IconContext } from "react-icons";
import {
  HiOutlineThumbDown,
  HiOutlineThumbUp,
  HiThumbDown,
  HiThumbUp,
} from "react-icons/hi";
import { FAVORITE_STATUS } from "../../../services/repositories/favoriteRepository.js";

function FavoriteStatus({ favoriteId, onChange, status }) {
  const isLiked = status === FAVORITE_STATUS.LIKE;
  const isDisliked = status === FAVORITE_STATUS.DISLIKE;

  if (!favoriteId || status === "") return null;

  const toggleLike = () =>
    onChange(
      favoriteId,
      isLiked ? FAVORITE_STATUS.EATEN : FAVORITE_STATUS.LIKE,
    );
  const toggleDislike = () =>
    onChange(
      favoriteId,
      isDisliked ? FAVORITE_STATUS.EATEN : FAVORITE_STATUS.DISLIKE,
    );

  return (
    <div className="flex h-8 w-20 items-center justify-center rounded-xl border border-solid bg-gray-200">
      <IconContext.Provider value={{ size: "20px" }}>
        <button type="button" className="mr-1" onClick={toggleLike}>
          {isLiked ? <HiThumbUp /> : <HiOutlineThumbUp title="按讚" />}
        </button>
        <p className="mr-1">|</p>
        <button
          type="button"
          aria-label="倒讚"
          className={isDisliked ? "mr-1" : ""}
          onClick={toggleDislike}
        >
          {isDisliked ? <HiThumbDown /> : <HiOutlineThumbDown />}
        </button>
      </IconContext.Provider>
    </div>
  );
}

export default FavoriteStatus;
