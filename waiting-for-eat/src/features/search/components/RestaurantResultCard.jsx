/* eslint-disable react/prop-types */
import { Rate } from "antd";
import { useNavigate } from "react-router-dom";
import fallbackPicture from "../../../pages/Search/tasty.jpg";
import FavoriteStatus from "./FavoriteStatus.jsx";

function RestaurantResultCard({ index, isVisible, restaurant }) {
  const navigate = useNavigate();
  const openRestaurant = () => navigate(`/restaurant/${restaurant.companyId}`);

  return (
    <div
      className={`${
        !isVisible && "hidden"
      } flex items-center justify-between border-b border-solid border-black p-4 map:m-4 map:rounded-2xl map:border-none map:bg-white`}
    >
      <div className="map:w-72">
        <div>
          <div className="cursor-pointer" onClick={openRestaurant}>
            <div className="mr-1 inline border border-solid border-gray-400 bg-gray-200 px-1 font-bold map:text-sm">
              {index + 1}
            </div>
            <h3 className="inline text-lg font-bold map:text-base">
              {restaurant.name}
            </h3>
          </div>
          <div>
            <h3 className="ml-6 mr-2 inline text-sm text-gray-600 map:text-xs">
              {restaurant.totalStar.toFixed(1)}
            </h3>
            <Rate
              className="text-sm map:text-xs"
              disabled
              allowHalf
              defaultValue={restaurant.totalStar}
            />
          </div>
        </div>

        <p className="mb-1 ml-6 pr-2 text-sm text-gray-600 map:text-xs">
          {restaurant.city}
          {restaurant.district}
          {restaurant.address}
        </p>
        <p className="mb-1 ml-6 text-sm text-gray-600 map:text-xs">
          {restaurant.phone}
        </p>
        <div className="ml-6">
          <FavoriteStatus status={restaurant.status} />
        </div>
      </div>

      <div className="cursor-pointer phone:hidden" onClick={openRestaurant}>
        <div className="flex justify-center map:w-20">
          <img
            className="min-h-24 min-w-24 map:min-h-20 map:min-w-20 h-24 w-24 rounded-2xl object-cover object-center map:h-20 map:w-20"
            src={restaurant.picture || fallbackPicture}
            alt={`${restaurant.name}餐廳`}
          />
        </div>
      </div>
    </div>
  );
}

export default RestaurantResultCard;
