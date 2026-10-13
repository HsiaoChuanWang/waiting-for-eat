import PropTypes from "prop-types";
import { RESTAURANT_CATEGORIES } from "../../constants/restaurant.js";
import bbq from "./homepagePictures/bbq.jpg";
import breakfast from "./homepagePictures/breakfast.jpg";
import hotpot from "./homepagePictures/hotpot.jpg";
import steak from "./homepagePictures/steak.jpg";
import streetFood from "./homepagePictures/streetFood.jpg";
import sweet from "./homepagePictures/sweet.jpg";

const categories = [
  {
    category: RESTAURANT_CATEGORIES.HOT_POT,
    image: hotpot,
    label: "火鍋",
    english: "HOTPOT",
  },
  {
    category: RESTAURANT_CATEGORIES.BARBECUE,
    image: bbq,
    label: "燒烤",
    english: "BARBECUE",
  },
  {
    category: RESTAURANT_CATEGORIES.STEAK,
    image: steak,
    label: "牛排",
    english: "STEAKHOUSE",
  },
  {
    category: RESTAURANT_CATEGORIES.DESSERT,
    image: sweet,
    label: "甜點",
    english: "DESSERT",
  },
  {
    category: RESTAURANT_CATEGORIES.STREET_FOOD,
    image: streetFood,
    label: "小吃",
    english: "STREET FOOD",
  },
  {
    category: RESTAURANT_CATEGORIES.BREAKFAST,
    image: breakfast,
    label: "早餐",
    english: "BREAKFAST",
  },
];

function CategoryGrid({ onSelect }) {
  return (
    <div className="flex justify-center">
      <div className="mb-8 flex w-[1440px] max-w-[1440px] flex-wrap justify-center tablet:w-[768px] laptop:w-[1024px]">
        {categories.map(({ category, image, label, english }) => (
          <div
            key={category}
            onClick={() => onSelect(category)}
            className="card-zoom relative mx-8 my-8 flex h-72 w-96 cursor-pointer items-center justify-center overflow-hidden rounded-2xl shadow-xl phone:h-36 phone:w-3/4 tablet:h-48 tablet:w-64 laptop:mx-4 laptop:h-48 laptop:w-64"
          >
            <img
              className="card-zoom-image absolute h-full w-full transform object-cover transition-all duration-500 ease-in-out"
              src={image}
              alt={label}
            />
            <div className="absolute h-full w-full bg-black/40" />
            <div className="card-zoom-text absolute scale-150 transform text-center text-white transition-all duration-500 ease-in-out">
              <h1 className="text-4xl font-black">{label}</h1>
              <h2 className="text-lg font-black">{english}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

CategoryGrid.propTypes = { onSelect: PropTypes.func.isRequired };

export default CategoryGrid;
