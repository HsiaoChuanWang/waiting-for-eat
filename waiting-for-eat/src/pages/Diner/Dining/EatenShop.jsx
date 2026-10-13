import { useNavigate, useParams } from "react-router-dom";
import ErrorState from "../../../components/ErrorState/index.jsx";
import IsLoading from "../../../components/IsLoading/index.jsx";
import useDinerRecordList from "../../../features/diner/useDinerRecordList.js";
import { getCompanyById } from "../../../services/repositories/companyRepository.js";
import {
  subscribeEatenFavorites,
  updateFavoriteStatus,
} from "../../../services/repositories/favoriteRepository.js";
import { hasPostForOrder } from "../../../services/repositories/postRepository.js";
import { hasReviewForOrder } from "../../../services/repositories/reviewRepository.js";
import useStarStore from "../../../stores/starStore.js";
import DinerRecordListLayout from "../../../features/diner/components/DinerRecordListLayout.jsx";
import EatenShopCard from "./EatenShopCard.jsx";

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
    <DinerRecordListLayout isEmpty={records.length === 0}>
      {[...records]
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
        ))}
    </DinerRecordListLayout>
  );
}

export default EatenShop;
