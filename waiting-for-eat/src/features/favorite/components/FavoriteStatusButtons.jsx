import PropTypes from "prop-types";
import { IconContext } from "react-icons";
import {
  HiOutlineThumbDown,
  HiOutlineThumbUp,
  HiThumbDown,
  HiThumbUp,
} from "react-icons/hi";
import { FAVORITE_STATUS } from "../../../services/repositories/favoriteRepository.js";

function FavoriteStatusButtons({ compact = false, onChange, status }) {
  if (!status) return null;

  const isLiked = status === FAVORITE_STATUS.LIKE;
  const isDisliked = status === FAVORITE_STATUS.DISLIKE;
  const toggleLike = () =>
    onChange(isLiked ? FAVORITE_STATUS.EATEN : FAVORITE_STATUS.LIKE);
  const toggleDislike = () =>
    onChange(isDisliked ? FAVORITE_STATUS.EATEN : FAVORITE_STATUS.DISLIKE);

  return (
    <div
      className={`flex items-center justify-center rounded-xl border border-solid bg-gray-200 ${
        compact ? "h-8 w-20" : "h-10 w-28"
      }`}
    >
      <IconContext.Provider value={{ size: compact ? "20px" : "30px" }}>
        <button
          type="button"
          aria-label={isLiked ? "取消讚" : "按讚"}
          className="mr-1 cursor-pointer"
          onClick={toggleLike}
        >
          {isLiked ? <HiThumbUp /> : <HiOutlineThumbUp />}
        </button>
        <span className="mr-1">|</span>
        <button
          type="button"
          aria-label={isDisliked ? "取消倒讚" : "倒讚"}
          className="cursor-pointer"
          onClick={toggleDislike}
        >
          {isDisliked ? <HiThumbDown /> : <HiOutlineThumbDown />}
        </button>
      </IconContext.Provider>
    </div>
  );
}

FavoriteStatusButtons.propTypes = {
  compact: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  status: PropTypes.string,
};

export default FavoriteStatusButtons;
