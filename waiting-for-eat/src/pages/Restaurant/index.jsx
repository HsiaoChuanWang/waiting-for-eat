import { Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "../../components/Alert/index.jsx";
import IsLoading from "../../components/IsLoading/index.jsx";
import { getRestaurantPageData } from "../../services/repositories/restaurantRepository.js";
import useUserStore from "../../stores/userStore.js";
import RestaurantActivitySection from "./components/RestaurantActivitySection.jsx";
import RestaurantInfoSection from "./components/RestaurantInfoSection.jsx";
import RestaurantMenuSection from "./components/RestaurantMenuSection.jsx";
import RestaurantPostList from "./components/RestaurantPostList.jsx";
import RestaurantReviewSection from "./components/RestaurantReviewSection.jsx";

function Restaurant() {
  const navigation = useNavigate();
  const { companyId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [restaurant, setRestaurant] = useState({});
  const [posts, setPosts] = useState([]);
  const userId = useUserStore((state) => state.userId);

  useEffect(() => {
    let isActive = true;

    getRestaurantPageData(companyId)
      .then(({ restaurant: restaurantData, posts: restaurantPosts }) => {
        if (!isActive) return;
        setRestaurant(restaurantData ?? {});
        setPosts(restaurantPosts);
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [companyId]);

  if (isLoading) {
    return <IsLoading />;
  }

  return (
    <div className=" mb-4 flex justify-center">
      <Alert />
      <div className="m-8 flex w-full max-w-[1400px] justify-between phone:block phone:px-8 tablet:block tablet:px-8">
        <div className="mr-8 w-3/4 phone:w-full tablet:w-full">
          <RestaurantInfoSection
            restaurant={restaurant}
            showFavorite={userId !== ""}
          />
          <RestaurantMenuSection images={restaurant.menu} />
          <RestaurantActivitySection activity={restaurant.description} />
          <RestaurantReviewSection />
        </div>

        <RestaurantPostList
          posts={posts}
          onPostSelect={(postId) => navigation(`/post/${postId}`)}
        />
      </div>

      <div className="fixed bottom-4 w-full max-w-[1400px] phone:flex phone:justify-center tablet:flex tablet:justify-center">
        <div className="h-12 w-[calc(75%-24px)] bg-white phone:w-5/6 tablet:w-5/6">
          <Button
            onClick={() => {
              if (userId === "") {
                toast.error("請登入以進行預約");
              } else {
                navigation(`/reserve/${companyId}`);
              }
            }}
            radius="full"
            className=" h-12 w-full rounded-lg bg-[#ff850e] text-center text-2xl font-black text-white shadow-lg"
          >
            線上預約
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Restaurant;
