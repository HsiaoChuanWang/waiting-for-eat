/* eslint-disable react/prop-types */
import { Card } from "@nextui-org/react";
import { motion } from "framer-motion";
import { HiThumbDown, HiThumbUp } from "react-icons/hi";
import { IoMdPin } from "react-icons/io";
import { IoRestaurant } from "react-icons/io5";
import { PiPhoneCallFill } from "react-icons/pi";
import { useNavigate, useParams } from "react-router-dom";
import IsLoading from "../../../components/IsLoading/index.jsx";
import ErrorState from "../../../components/ErrorState/index.jsx";
import { getCompanyById } from "../../../services/repositories/companyRepository.js";
import {
  FAVORITE_STATUS,
  subscribeFavoritesByStatus,
} from "../../../services/repositories/favoriteRepository.js";
import useDinerRecordList from "../useDinerRecordList.js";
import DinerRecordListLayout from "./DinerRecordListLayout.jsx";

const enrichWithCompanies = (favorites) =>
  Promise.all(
    favorites.map(async (favorite) => ({
      ...favorite,
      ...(await getCompanyById(favorite.companyId)),
    })),
  );

const subscribeLikedRestaurants = (userId, onChange) =>
  subscribeFavoritesByStatus(userId, FAVORITE_STATUS.LIKE, onChange);

const subscribeDislikedRestaurants = (userId, onChange) =>
  subscribeFavoritesByStatus(userId, FAVORITE_STATUS.DISLIKE, onChange);

function FavoriteRestaurantList({ status }) {
  const navigate = useNavigate();
  const { userId } = useParams();
  const isLiked = status === FAVORITE_STATUS.LIKE;
  const subscribeToRecords = isLiked
    ? subscribeLikedRestaurants
    : subscribeDislikedRestaurants;
  const { error, isLoading, records } = useDinerRecordList(
    userId,
    subscribeToRecords,
    enrichWithCompanies,
  );
  const StatusIcon = isLiked ? HiThumbUp : HiThumbDown;
  const statusLabel = isLiked ? "Like" : "Bad";

  if (isLoading) return <IsLoading />;
  if (error) return <ErrorState message={error} />;

  const content = records.map((restaurant, index) => (
    <motion.div
      animate={{ x: 0, opacity: 1, transition: { delay: 0.1 * index } }}
      initial={{ x: -50, opacity: 0 }}
      key={restaurant.favoriteId}
    >
      <Card className="border-2 shadow-xl">
        <div className="relative flex items-center phone:flex-col">
          <div className="bg-amber-800/30 p-6 py-8 phone:w-full">
            <div className="flex h-44 w-64 items-center justify-center phone:w-full tablet:w-44">
              <img
                className="h-full w-full cursor-pointer rounded-lg object-cover object-center"
                src={restaurant.picture}
                alt={`${restaurant.name}餐廳`}
                onClick={() => navigate(`/restaurant/${restaurant.companyId}`)}
              />
            </div>
          </div>

          <div className="ml-4 phone:mx-4 phone:mb-4 phone:mt-4 laptop:mx-4">
            <div className="flex items-center">
              <IoRestaurant className="mr-2 text-2xl phone:text-base tablet:text-base laptop:self-start" />
              <p className="text-lg font-bold phone:text-sm tablet:text-sm">
                {restaurant.name}
              </p>
            </div>
            <div className="mt-4 flex items-center">
              <PiPhoneCallFill className="mr-2 text-2xl phone:text-base tablet:text-base" />
              <p className="text-lg font-bold phone:text-sm tablet:text-sm">
                {restaurant.phone}
              </p>
            </div>
            <div className="mt-4 flex items-center">
              <IoMdPin className="mr-2 text-2xl phone:self-start phone:text-base tablet:self-start tablet:text-base" />
              <p className="text-lg font-bold phone:text-sm tablet:text-sm">
                {restaurant.city}
                {restaurant.district}
                {restaurant.address}
              </p>
            </div>
          </div>

          <div className="absolute right-4 top-4 flex w-24 items-center justify-between phone:right-9 phone:top-12 phone:h-8 phone:w-20 phone:overflow-y-hidden phone:rounded-lg">
            <div className="flex h-10 w-28 items-center justify-center rounded-xl border border-solid bg-gray-200">
              <div className="mr-1 text-[30px] phone:text-xl">
                <StatusIcon />
              </div>
              <p className="mr-1">|</p>
              <p className="font-semibold">{statusLabel}</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  ));

  return (
    <DinerRecordListLayout
      isEmpty={records.length === 0}
      scrollClassName={!isLiked ? "py-2" : ""}
    >
      {content}
    </DinerRecordListLayout>
  );
}

export default FavoriteRestaurantList;
