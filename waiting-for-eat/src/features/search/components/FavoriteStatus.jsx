/* eslint-disable react/prop-types */
import { IconContext } from "react-icons";
import {
  HiOutlineThumbDown,
  HiOutlineThumbUp,
  HiThumbDown,
  HiThumbUp,
} from "react-icons/hi";

function FavoriteStatus({ status }) {
  const isLiked = status === "like";
  const isDisliked = status === "dislike";

  if (!isLiked && !isDisliked && status !== "eaten") return null;

  return (
    <div className="flex h-8 w-20 items-center justify-center rounded-xl border border-solid bg-gray-200">
      <IconContext.Provider value={{ size: "20px" }}>
        <div className="mr-1">
          {isLiked ? <HiThumbUp /> : <HiOutlineThumbUp title="noLike" />}
        </div>
        <p className="mr-1">|</p>
        <div className={isDisliked ? "mr-1" : ""}>
          {isDisliked ? <HiThumbDown /> : <HiOutlineThumbDown />}
        </div>
      </IconContext.Provider>
    </div>
  );
}

export default FavoriteStatus;
