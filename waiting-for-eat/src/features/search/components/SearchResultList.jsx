/* eslint-disable react/prop-types */
import { ScrollShadow } from "@nextui-org/react";
import NoItem from "../../../components/NoItem/index.jsx";
import RestaurantResultCard from "./RestaurantResultCard.jsx";

function SearchResultList({ isVisible, onFavoriteChange, results }) {
  return (
    <div className="shadow-4xl w-[28%] map:absolute map:bottom-0 map:z-10 map:w-full">
      <ScrollShadow className="h-full w-full map:flex" size={0}>
        {results.length === 0 ? (
          <NoItem
            content="尚無相關餐廳進駐"
            distance="w-[calc(100%-36px)] map:w-72"
            pictureWidth="w-44 map:w-32"
            textSize="text-lg map:text-sm"
            optional={`${!isVisible && "hidden"}`}
          />
        ) : (
          results.map((restaurant, index) => (
            <RestaurantResultCard
              key={restaurant.companyId}
              index={index}
              isVisible={isVisible}
              onFavoriteChange={onFavoriteChange}
              restaurant={restaurant}
            />
          ))
        )}
      </ScrollShadow>
    </div>
  );
}

export default SearchResultList;
