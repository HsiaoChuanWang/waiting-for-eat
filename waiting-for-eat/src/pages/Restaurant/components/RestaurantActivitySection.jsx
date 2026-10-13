/* eslint-disable react/prop-types */
import noActivity from "../restaurantPictures/noActivity.png";

function RestaurantActivitySection({ activity }) {
  return (
    <div className="mt-2 border-t-2 border-solid border-gray-300 pb-6">
      <h1 className="text-2xl font-bold text-[#ff6e06]">現熱活動</h1>
      {activity ? (
        <div
          className="mx-4 mt-4"
          dangerouslySetInnerHTML={{ __html: activity }}
        ></div>
      ) : (
        <div className="mx-4 mb-2 mt-8 flex h-32 items-center">
          <img src={noActivity} alt="" className="h-28" />
          <h1 className="text-lg font-bold text-gray-600">暫無活動</h1>
        </div>
      )}
    </div>
  );
}

export default RestaurantActivitySection;
