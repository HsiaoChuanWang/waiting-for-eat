import { Button, Card, ScrollShadow } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  HiOutlineThumbDown,
  HiOutlineThumbUp,
  HiThumbDown,
  HiThumbUp,
} from "react-icons/hi";
import { IoMdPin } from "react-icons/io";
import { IoRestaurant } from "react-icons/io5";
import { PiPhoneCallFill } from "react-icons/pi";
import { useNavigate, useParams } from "react-router-dom";
import IsLoading from "../../components/IsLoading/index.jsx";
import { getCompanyById } from "../../services/repositories/companyRepository.js";
import {
  FAVORITE_STATUS,
  subscribeEatenFavorites,
  updateFavoriteStatus,
} from "../../services/repositories/favoriteRepository.js";
import { hasPostForOrder } from "../../services/repositories/postRepository.js";
import { hasReviewForOrder } from "../../services/repositories/reviewRepository.js";
import useStarStore from "../../stores/starStore.js";
import noData from "./noData.png";

function EatenShop() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [combineData, setCombineData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const setCompanyName = useStarStore((state) => state.setCompanyName);
  const setCompanyId = useStarStore((state) => state.setCompanyId);
  const setOrderId = useStarStore((state) => state.setOrderId);
  useEffect(() => {
    return subscribeEatenFavorites(userId, (items) => {
      Promise.all(
        items.map((item) => {
          return Promise.all([
            getCompanyById(item.companyId),
            hasPostForOrder(item.orderId).then((hasPost) => !hasPost),
            hasReviewForOrder(item.orderId).then((hasReview) => !hasReview),
          ]).then(([companyInfo, postInfo, commentInfo]) => {
            const newItem = {
              ...item,
              ...companyInfo,
              canWritePost: postInfo,
              canWriteComment: commentInfo,
            };
            return newItem;
          });
        }),
      ).then((value) => {
        setCombineData(value);
        setIsLoading(false);
      });
    });
  }, [userId]);

  const handleLike = (favoriteId, status) =>
    updateFavoriteStatus(favoriteId, status);

  const favoriteState = (favoriteId, status) => {
    switch (status) {
      case FAVORITE_STATUS.LIKE:
        return (
          <div className="flex h-10 w-28 items-center justify-center rounded-xl border border-solid bg-gray-200">
            <div className="mr-1 text-[30px] phone:text-xl">
              <HiThumbUp
                className="cursor-pointer"
                onClick={() => handleLike(favoriteId, FAVORITE_STATUS.EATEN)}
              />
            </div>
            <p className="mr-1">|</p>
            <div>
              <HiOutlineThumbDown
                className="cursor-pointer text-[30px] phone:text-lg"
                onClick={() => handleLike(favoriteId, FAVORITE_STATUS.DISLIKE)}
              />
            </div>
          </div>
        );

      case FAVORITE_STATUS.DISLIKE:
        return (
          <div className="flex h-10 w-28 items-center justify-center rounded-xl border border-solid bg-gray-200">
            <div className="mr-1 text-[30px] phone:text-xl">
              <HiOutlineThumbUp
                className="cursor-pointer"
                title="noLike"
                onClick={() => handleLike(favoriteId, FAVORITE_STATUS.LIKE)}
              />
            </div>
            <p className="mr-1">|</p>
            <div className="mr-1 text-[30px] phone:text-xl">
              <HiThumbDown
                className="cursor-pointer"
                onClick={() => handleLike(favoriteId, FAVORITE_STATUS.EATEN)}
              />
            </div>
          </div>
        );

      case FAVORITE_STATUS.EATEN:
        return (
          <>
            <div className="flex h-10 w-28 items-center justify-center rounded-xl border border-solid bg-gray-200">
              <div className="flex items-center justify-center">
                <div className="mr-1 text-[30px] phone:text-xl">
                  <HiOutlineThumbUp
                    className="cursor-pointer"
                    title="noLike"
                    onClick={() => handleLike(favoriteId, FAVORITE_STATUS.LIKE)}
                  />
                </div>
                <p className="mr-1">|</p>
                <div>
                  <HiOutlineThumbDown
                    className="cursor-pointer text-[30px] phone:text-xl"
                    onClick={() =>
                      handleLike(favoriteId, FAVORITE_STATUS.DISLIKE)
                    }
                  />
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  const companyDatas =
    combineData.length > 0 ? (
      combineData
        .sort((a, b) => (a.favoriteId > b.favoriteId ? 1 : -1))
        .map((data, i) => {
          return (
            <motion.div
              animate={{ x: 0, opacity: 1, transition: { delay: 0.1 * i } }}
              initial={{ x: -50, opacity: 0 }}
              key={data.favoriteId}
            >
              <Card className="border-2 shadow-xl">
                <div className="relative flex items-center phone:flex-col">
                  <div className="bg-amber-800/30 p-6 py-8 phone:w-full">
                    <div className="flex h-44 w-64 items-center justify-center phone:w-full tablet:w-44">
                      <img
                        className="h-full w-full cursor-pointer rounded-lg object-cover object-center"
                        src={data.picture}
                        onClick={() => {
                          navigate(`/restaurant/${data.companyId}`);
                        }}
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
                    {favoriteState(data.favoriteId, data.status)}
                  </div>

                  <div
                    className={` ${
                      data.canWriteComment === false && "hidden"
                    } absolute bottom-12 right-8 h-8 `}
                  ></div>

                  <div
                    className={` ${data.canWriteComment === false && "hidden"}`}
                  >
                    <Button
                      onClick={() => {
                        setCompanyName(data.name);
                        setOrderId(data.orderId);
                        setCompanyId(data.companyId);
                        navigate(`/diner/addStar/${userId}`);
                      }}
                      className={` ${
                        data.canWriteComment === false && "hidden"
                      } absolute bottom-16 right-4 mt-6 block h-10 rounded-lg bg-[#ff850e] px-4 text-center text-lg font-black text-white shadow-lg phone:bottom-4 phone:right-28 phone:text-base tablet:bottom-4 tablet:right-28 tablet:text-base`}
                    >
                      寫評論
                    </Button>
                  </div>

                  <div
                    className={` ${data.canWritePost === false && "hidden"}`}
                  >
                    <Button
                      onClick={() => navigate(`/textEditor/${data.orderId}`)}
                      className={` ${
                        data.canWritePost === false && "hidden"
                      } absolute bottom-4 right-4 mt-6 block h-10 rounded-lg bg-[#ff850e] px-4 text-center text-lg font-black text-white shadow-lg phone:text-base tablet:text-base`}
                    >
                      寫食記
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })
    ) : (
      <div key="no" className="mr-8 flex h-full items-center justify-center">
        <img className="w-72" src={noData} />
        <h1 className="text-2xl font-bold text-gray-600">尚無相關資訊</h1>
      </div>
    );

  if (isLoading) {
    return <IsLoading />;
  }

  return (
    <div className="flex h-full items-center justify-center">
      <ScrollShadow
        size={0}
        hideScrollBar
        className="flex h-[calc(100vh-300px)] w-full justify-center"
      >
        <div className="flex h-full w-3/4 flex-col gap-12 phone:mt-12 phone:w-[90%] tablet:w-[90%] laptop:w-5/6">
          {companyDatas}
        </div>
      </ScrollShadow>
    </div>
  );
}

export default EatenShop;
