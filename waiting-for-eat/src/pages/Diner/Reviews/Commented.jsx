import { Button, Card } from "@nextui-org/react";
import { Rate } from "antd";
import dateFormat from "dateformat";
import { motion } from "framer-motion";
import { FaPenToSquare } from "react-icons/fa6";
import { IoRestaurant, IoTimeSharp } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import IsLoading from "../../../components/IsLoading/index.jsx";
import ErrorState from "../../../components/ErrorState/index.jsx";
import useDinerRecordList from "../../../features/diner/useDinerRecordList.js";
import DinerRecordListLayout from "../../../features/diner/components/DinerRecordListLayout.jsx";
import { getCompanyById } from "../../../services/repositories/companyRepository.js";
import { getOrderById } from "../../../services/repositories/orderRepository.js";
import {
  deleteReview,
  subscribeReviewsByUserId,
} from "../../../services/repositories/reviewRepository.js";
import useStarStore from "../../../stores/starStore.js";

const enrichReviews = (reviews) =>
  Promise.all(
    reviews.map(async (review) => ({
      ...review,
      ...(await getCompanyById(review.companyId)),
      ...(await getOrderById(review.orderId)),
    })),
  );

function Commented() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const {
    error,
    isLoading,
    records: combineData,
  } = useDinerRecordList(userId, subscribeReviewsByUserId, enrichReviews);
  const setStarId = useStarStore((state) => state.setStarId);
  const setCompanyName = useStarStore((state) => state.setCompanyName);
  const setCompanyId = useStarStore((state) => state.setCompanyId);

  const handleDelete = (starId, companyId) => deleteReview(starId, companyId);

  const printDatas =
    combineData.length > 0
      ? combineData
          .sort((a, b) => (a.createTime > b.createTime ? -1 : 1))
          .map((data, i) => {
            return (
              <motion.div
                animate={{ x: 0, opacity: 1, transition: { delay: 0.1 * i } }}
                initial={{ x: -50, opacity: 0 }}
                key={data.starId}
              >
                <Card className="border-2 shadow-xl">
                  <div className="relative flex items-center phone:flex-col">
                    <div className="bg-amber-800/30 p-6 py-8 phone:w-full phone:py-4 tablet:w-[198px]">
                      <div className="flex h-40 w-64 items-center justify-center phone:w-full tablet:w-[150px]">
                        <img
                          className="h-full w-full cursor-pointer rounded-lg object-cover object-center"
                          src={data.picture}
                          alt={`${data.name}餐廳`}
                          onClick={() => {
                            navigate(`/restaurant/${data.companyId}`);
                          }}
                        />
                      </div>

                      <div className="mt-4 flex items-center text-amber-900">
                        <IoRestaurant className="mr-2 text-xl phone:text-base tablet:self-start tablet:text-base" />
                        <p className="text-lg font-bold phone:text-sm tablet:text-sm">
                          {data.name}
                        </p>
                      </div>

                      <div className="mt-2 flex items-center text-amber-900">
                        <IoTimeSharp className="mr-2 text-2xl phone:text-base tablet:text-base" />
                        <p className="text-lg font-bold phone:text-sm tablet:text-sm">
                          {data.date}
                        </p>
                        <p className="ml-2 text-lg font-bold phone:text-sm tablet:text-sm">
                          {data.start}
                        </p>
                      </div>
                    </div>

                    <div className="ml-4 phone:mx-4 phone:mb-16 phone:mt-4 phone:w-[calc(100%-32px)] tablet:mb-6">
                      <div className="mb-4 flex items-center">
                        <FaPenToSquare className="mr-2 text-2xl phone:text-base" />
                        <p className="mr-2 text-lg font-bold phone:text-sm">
                          {dateFormat(data.createTime.toDate(), "yyyy/mm/dd")}
                        </p>
                        <p className="text-lg font-bold phone:text-sm">
                          {dateFormat(data.createTime.toDate(), "HH:MM")}
                        </p>
                      </div>

                      <div className="flex">
                        <Rate
                          className="text-2xl phone:text-lg"
                          disabled
                          defaultValue={data.star}
                        />
                      </div>

                      <div className="mr-32 phone:mr-0 tablet:mr-4">
                        <p className="my-4 text-lg phone:text-base">
                          {data.content}
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        setCompanyId(data.companyId);
                        setCompanyName(data.name);
                        setStarId(data.starId);
                        navigate(`/diner/starEdit/${userId}`);
                      }}
                      className="absolute bottom-16 right-4 mt-6 block h-10 rounded-lg bg-[#ff850e] px-4 text-center text-lg font-black text-white shadow-lg phone:bottom-4 phone:right-28 phone:text-base tablet:bottom-4 tablet:right-28 tablet:text-base"
                    >
                      編輯
                    </Button>

                    <Button
                      onClick={() => {
                        handleDelete(data.starId, data.companyId);
                      }}
                      className="absolute bottom-4 right-4 mt-6 block h-10 rounded-lg bg-[#b0aba5] px-4 text-center text-lg font-black text-white shadow-lg phone:text-base tablet:text-base"
                    >
                      刪除
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })
      : null;

  if (isLoading) {
    return <IsLoading />;
  }
  if (error) return <ErrorState message={error} />;

  return (
    <DinerRecordListLayout isEmpty={combineData.length === 0}>
      {printDatas}
    </DinerRecordListLayout>
  );
}

export default Commented;
