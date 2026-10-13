import { Button, Card } from "@nextui-org/react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import {
  HiOutlineThumbDown,
  HiOutlineThumbUp,
  HiThumbDown,
  HiThumbUp,
} from "react-icons/hi";
import { IoMdPin } from "react-icons/io";
import { IoRestaurant } from "react-icons/io5";
import { PiPhoneCallFill } from "react-icons/pi";
import { FAVORITE_STATUS } from "../../../services/repositories/favoriteRepository.js";

function FavoriteActions({ favoriteId, status, onChange }) {
  const liked = status === FAVORITE_STATUS.LIKE;
  const disliked = status === FAVORITE_STATUS.DISLIKE;

  return (
    <div className="flex h-10 w-28 items-center justify-center rounded-xl border border-solid bg-gray-200">
      <div className="mr-1 text-[30px] phone:text-xl">
        {liked ? (
          <HiThumbUp
            className="cursor-pointer"
            onClick={() => onChange(favoriteId, FAVORITE_STATUS.EATEN)}
          />
        ) : (
          <HiOutlineThumbUp
            className="cursor-pointer"
            onClick={() => onChange(favoriteId, FAVORITE_STATUS.LIKE)}
          />
        )}
      </div>
      <p className="mr-1">|</p>
      <div className="mr-1 text-[30px] phone:text-xl">
        {disliked ? (
          <HiThumbDown
            className="cursor-pointer"
            onClick={() => onChange(favoriteId, FAVORITE_STATUS.EATEN)}
          />
        ) : (
          <HiOutlineThumbDown
            className="cursor-pointer"
            onClick={() => onChange(favoriteId, FAVORITE_STATUS.DISLIKE)}
          />
        )}
      </div>
    </div>
  );
}

FavoriteActions.propTypes = {
  favoriteId: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
};

function EatenShopCard({
  data,
  index,
  onFavoriteChange,
  onOpen,
  onPost,
  onReview,
}) {
  return (
    <motion.div
      animate={{ x: 0, opacity: 1, transition: { delay: 0.1 * index } }}
      initial={{ x: -50, opacity: 0 }}
    >
      <Card className="border-2 shadow-xl">
        <div className="relative flex items-center phone:flex-col">
          <div className="bg-amber-800/30 p-6 py-8 phone:w-full">
            <div className="flex h-44 w-64 items-center justify-center phone:w-full tablet:w-44">
              <img
                className="h-full w-full cursor-pointer rounded-lg object-cover object-center"
                src={data.picture}
                alt={`${data.name}餐廳`}
                onClick={onOpen}
              />
            </div>
          </div>
          <div className="ml-4 phone:mx-2 phone:mb-20 phone:mt-4 laptop:w-[calc(100%-440px)]">
            <div className="flex items-center">
              <IoRestaurant className="mr-2 text-2xl phone:text-base tablet:text-base laptop:self-start" />
              <p className="text-lg font-bold phone:text-sm tablet:text-sm">
                {data.name}
              </p>
            </div>
            <div className="mt-4 flex items-center">
              <PiPhoneCallFill className="mr-2 text-2xl phone:text-base tablet:text-base" />
              <p className="text-lg font-bold phone:text-sm tablet:text-sm">
                {data.phone}
              </p>
            </div>
            <div className="mt-4 flex items-center">
              <IoMdPin className="mr-2 text-2xl phone:self-start phone:text-base tablet:self-start tablet:text-base" />
              <p className="text-lg font-bold phone:text-sm tablet:text-sm">
                {data.city}
                {data.district}
                {data.address}
              </p>
            </div>
          </div>
          <div className="absolute right-4 top-4 flex w-24 items-center justify-between phone:right-9 phone:top-12 phone:h-8 phone:w-16 phone:overflow-y-hidden phone:rounded-lg">
            <FavoriteActions
              favoriteId={data.favoriteId}
              status={data.status}
              onChange={onFavoriteChange}
            />
          </div>
          {data.canWriteComment && (
            <Button
              onClick={onReview}
              className="absolute bottom-16 right-4 mt-6 block h-10 rounded-lg bg-[#ff850e] px-4 text-center text-lg font-black text-white shadow-lg phone:bottom-4 phone:right-28 phone:text-base tablet:bottom-4 tablet:right-28 tablet:text-base"
            >
              寫評論
            </Button>
          )}
          {data.canWritePost && (
            <Button
              onClick={onPost}
              className="absolute bottom-4 right-4 mt-6 block h-10 rounded-lg bg-[#ff850e] px-4 text-center text-lg font-black text-white shadow-lg phone:text-base tablet:text-base"
            >
              寫食記
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

EatenShopCard.propTypes = {
  data: PropTypes.shape({
    address: PropTypes.string,
    canWriteComment: PropTypes.bool.isRequired,
    canWritePost: PropTypes.bool.isRequired,
    city: PropTypes.string,
    district: PropTypes.string,
    favoriteId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    phone: PropTypes.string,
    picture: PropTypes.string,
    status: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  onFavoriteChange: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
  onPost: PropTypes.func.isRequired,
  onReview: PropTypes.func.isRequired,
};

export default EatenShopCard;
