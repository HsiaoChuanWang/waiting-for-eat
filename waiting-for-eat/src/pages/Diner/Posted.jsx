import { Button, Card, ScrollShadow } from "@nextui-org/react";
import dateFormat from "dateformat";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { FaPenToSquare } from "react-icons/fa6";
import { IoRestaurant, IoTimeSharp } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import IsLoading from "../../components/IsLoading/index.jsx";
import ErrorState from "../../components/ErrorState/index.jsx";
import useDinerRecordList from "../../features/diner/useDinerRecordList.js";
import { db } from "../../services/firebase/firebaseClient.js";
import { getCompanyById } from "../../services/repositories/companyRepository.js";
import {
  deletePost,
  subscribePostsByUserId,
} from "../../services/repositories/postRepository.js";
import noData from "./noData.png";

async function getOrderInfo(orderId) {
  const snapshot = await getDoc(doc(db, "order", orderId));
  return snapshot.data();
}

const enrichPosts = (posts) =>
  Promise.all(
    posts.map(async (post) => ({
      ...post,
      ...(await getCompanyById(post.companyId)),
      ...(await getOrderInfo(post.orderId)),
    })),
  );

function Posted() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const {
    error,
    isLoading,
    records: combineData,
  } = useDinerRecordList(userId, subscribePostsByUserId, enrichPosts);

  const handleDelete = (postId) => deletePost(postId);

  const printDatas =
    combineData.length > 0 ? (
      combineData
        .sort((a, b) => (a.createTime > b.createTime ? -1 : 1))
        .map((data, i) => {
          return (
            <motion.div
              animate={{ x: 0, opacity: 1, transition: { delay: 0.1 * i } }}
              initial={{ x: -50, opacity: 0 }}
              key={data.postId}
            >
              <Card className="border-2 shadow-xl">
                <div className="relative flex items-center phone:flex-col">
                  <div className="bg-amber-800/30 p-6 py-8 phone:w-full">
                    <div className="flex h-48 w-64 items-center justify-center phone:h-40 phone:w-full tablet:w-44">
                      <img
                        className="h-full w-full cursor-pointer rounded-lg object-cover object-center"
                        src={data.mainPicture}
                        alt={data.title ?? "文章主圖"}
                        onClick={() => {
                          navigate(`/post/${data.postId}`);
                        }}
                      />
                    </div>
                  </div>

                  <div className="ml-4 pr-4 phone:mx-4 phone:mb-16 phone:mt-4 phone:pr-0 tablet:mb-12 laptop:mx-4">
                    <div>
                      <p
                        className="my-4 cursor-pointer text-2xl font-black text-[#134f6c] phone:text-xl"
                        onClick={() => {
                          navigate(`/post/${data.postId}`);
                        }}
                      >
                        {data.title}
                      </p>
                    </div>

                    <div className="flex items-center">
                      <IoRestaurant className="mr-2 text-2xl phone:text-base tablet:text-base" />
                      <p className="text-lg font-bold phone:text-sm tablet:text-sm">
                        {data.name}
                      </p>
                    </div>

                    <div className="flex items-center">
                      <IoTimeSharp className="mr-2 text-2xl phone:text-base tablet:text-base" />
                      <p className="text-lg font-bold phone:text-sm tablet:text-sm">
                        {data.date}
                      </p>
                      <p className="my-4  ml-2 text-lg font-bold phone:text-sm tablet:text-sm">
                        {data.start}
                      </p>
                    </div>

                    <div className="mb-4 flex items-center">
                      <FaPenToSquare className="mr-2 text-2xl phone:text-base tablet:text-base" />
                      <p className="mr-2 text-lg font-bold phone:text-sm tablet:text-sm">
                        {dateFormat(data.createTime.toDate(), "yyyy/mm/dd")}
                      </p>
                      <p className="text-lg font-bold phone:text-sm tablet:text-sm">
                        {dateFormat(data.createTime.toDate(), "HH:MM")}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      navigate(`/postedEdit/${data.postId}`);
                    }}
                    className=" absolute bottom-16 right-4 mt-6 block h-10 rounded-lg bg-[#ff850e] px-4 text-center text-lg font-black text-white shadow-lg phone:bottom-4 phone:right-28 phone:text-base tablet:bottom-4 tablet:right-28 tablet:text-base"
                  >
                    編輯
                  </Button>

                  <Button
                    onClick={() => handleDelete(data.postId)}
                    className=" absolute bottom-4 right-4 mt-6 block h-10 rounded-lg bg-[#b0aba5] px-4 text-center text-lg font-black text-white shadow-lg phone:text-base tablet:text-base"
                  >
                    刪除
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })
    ) : (
      <div key="no" className="mr-8 flex h-full items-center justify-center">
        <img className="w-72" src={noData} alt="" />
        <h1 className="text-2xl font-bold text-gray-600">尚無相關資訊</h1>
      </div>
    );

  if (isLoading) {
    return <IsLoading />;
  }
  if (error) return <ErrorState message={error} />;

  return (
    <div className="justify-cente flex h-full items-center">
      <ScrollShadow
        size={0}
        hideScrollBar
        className="flex h-[calc(100vh-300px)] w-full justify-center"
      >
        <div className="flex h-full w-3/4 flex-col gap-12 phone:mt-12 phone:w-[90%] tablet:w-[90%] laptop:w-5/6">
          {printDatas}
        </div>
      </ScrollShadow>
    </div>
  );
}

export default Posted;
