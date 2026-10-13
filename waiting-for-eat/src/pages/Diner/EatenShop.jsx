import { ScrollShadow } from "@nextui-org/react";
import { useNavigate, useParams } from "react-router-dom";
import ErrorState from "../../components/ErrorState/index.jsx";
import IsLoading from "../../components/IsLoading/index.jsx";
import useDinerRecordList from "../../features/diner/useDinerRecordList.js";
import { getCompanyById } from "../../services/repositories/companyRepository.js";
import {
  subscribeEatenFavorites,
  updateFavoriteStatus,
} from "../../services/repositories/favoriteRepository.js";
import { hasPostForOrder } from "../../services/repositories/postRepository.js";
import { hasReviewForOrder } from "../../services/repositories/reviewRepository.js";
import useStarStore from "../../stores/starStore.js";
import noData from "../../assets/placeholders/no-data.png";
import EatenShopCard from "./components/EatenShopCard.jsx";

const enrichEatenRecords = (items) =>
  Promise.all(
    items.map(async (item) => {
      const [companyInfo, hasPost, hasReview] = await Promise.all([
        getCompanyById(item.companyId),
        hasPostForOrder(item.orderId),
        hasReviewForOrder(item.orderId),
      ]);

      return {
        ...item,
        ...companyInfo,
        canWritePost: !hasPost,
        canWriteComment: !hasReview,
      };
    }),
  );

function EatenShop() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { error, isLoading, records } = useDinerRecordList(
    userId,
    subscribeEatenFavorites,
    enrichEatenRecords,
  );
  const setCompanyName = useStarStore((state) => state.setCompanyName);
  const setCompanyId = useStarStore((state) => state.setCompanyId);
  const setOrderId = useStarStore((state) => state.setOrderId);

  const handleReview = (record) => {
    setCompanyName(record.name);
    setOrderId(record.orderId);
    setCompanyId(record.companyId);
    navigate(`/diner/addStar/${userId}`);
  };

  if (isLoading) return <IsLoading />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="flex h-full items-center justify-center">
      <ScrollShadow
        size={0}
        hideScrollBar
        className="flex h-[calc(100vh-300px)] w-full justify-center"
      >
        <div className="flex h-full w-3/4 flex-col gap-12 phone:mt-12 phone:w-[90%] tablet:w-[90%] laptop:w-5/6">
          {records.length === 0 ? (
            <div className="mr-8 flex h-full items-center justify-center">
              <img className="w-72" src={noData} alt="" />
              <h1 className="text-2xl font-bold text-gray-600">尚無相關資訊</h1>
            </div>
          ) : (
            [...records]
              .sort((a, b) => (a.favoriteId > b.favoriteId ? 1 : -1))
              .map((record, index) => (
                <EatenShopCard
                  key={record.favoriteId}
                  data={record}
                  index={index}
                  onFavoriteChange={updateFavoriteStatus}
                  onOpen={() => navigate(`/restaurant/${record.companyId}`)}
                  onPost={() => navigate(`/textEditor/${record.orderId}`)}
                  onReview={() => handleReview(record)}
                />
              ))
          )}
        </div>
      </ScrollShadow>
    </div>
  );
}

export default EatenShop;
