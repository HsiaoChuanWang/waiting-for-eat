/* eslint-disable react/prop-types */
import Like from "../Like.jsx";
import tasty from "../../Search/tasty.jpg";

function RestaurantInfoSection({ restaurant, showFavorite }) {
  return (
    <div className="pb-6">
      <div>
        <img
          src={restaurant.picture !== "" ? restaurant.picture : tasty}
          alt={`${restaurant.name ?? "餐廳"}店面`}
          className="h-96 w-full object-cover object-center"
        />
      </div>

      <div className="flex justify-between">
        <div className="mt-8">
          <h2 className="text-4xl font-black">{restaurant.name}</h2>
          <h4 className="mt-2">
            {restaurant.city}
            {restaurant.district}
            {restaurant.address}
          </h4>
          <h2 className="mt-2">{restaurant.phone}</h2>
        </div>

        <div className={`mt-8 flex ${!showFavorite && "hidden"}`}>
          <Like />
        </div>
      </div>
    </div>
  );
}

export default RestaurantInfoSection;
