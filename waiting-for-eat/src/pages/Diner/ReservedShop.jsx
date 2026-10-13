import { Button, Card, ScrollShadow } from "@nextui-org/react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { motion } from "framer-motion";
import { BiSolidBookmarkAlt } from "react-icons/bi";
import { IoMdPin } from "react-icons/io";
import { IoRestaurant } from "react-icons/io5";
import { PiPhoneCallFill } from "react-icons/pi";
import { useNavigate, useParams } from "react-router-dom";
import IsLoading from "../../components/IsLoading/index.jsx";
import ErrorState from "../../components/ErrorState/index.jsx";
import useDinerRecordList from "../../features/diner/useDinerRecordList.js";
import { db } from "../../services/firebase/firebaseClient.js";
import { mapQuerySnapshot } from "../../services/firebase/firestoreMappers.js";
import { getCompanyById } from "../../services/repositories/companyRepository.js";
import noData from "./noData.png";

function subscribeReservedOrders(userId, onChange) {
  const orderQuery = query(
    collection(db, "order"),
    where("userId", "==", userId),
    where("attend", "==", "no"),
  );

  return onSnapshot(orderQuery, (snapshot) => {
    onChange(mapQuerySnapshot(snapshot, "orderId"));
  });
}

const enrichOrders = (orders) =>
  Promise.all(
    orders.map(async (order) => ({
      ...order,
      ...(await getCompanyById(order.companyId)),
    })),
  );

function ReservedShop() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const {
    error,
    isLoading,
    records: combineData,
  } = useDinerRecordList(userId, subscribeReservedOrders, enrichOrders);

  async function handleDelete(orderId) {
    await deleteDoc(doc(db, "order", orderId));
  }

  if (isLoading) {
    return <IsLoading />;
  }
  if (error) return <ErrorState message={error} />;

  const companyDatas =
    combineData.length > 0 ? (
      combineData
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((data, i) => {
          return (
            <motion.div
              animate={{ x: 0, opacity: 1, transition: { delay: 0.1 * i } }}
              initial={{ x: -50, opacity: 0 }}
              key={data.orderId}
            >
              <Card className="border-2 shadow-xl">
                <div className="relative flex items-center phone:flex-col">
                  <div className="bg-amber-800/30 p-4 py-6 phone:w-full">
                    <div className="h-[150px] w-[300px] object-cover object-center phone:w-full tablet:w-[150px]">
                      <img
                        className="h-full w-full rounded-lg object-cover object-center"
                        src={data.picture}
                        alt={`${data.name}餐廳`}
                        onClick={() => {
                          navigate(`/restaurant/${data.companyId}`);
                        }}
                      />
                    </div>

                    <div className="mt-4 flex items-center text-amber-900">
                      <IoRestaurant className="mr-2 text-xl phone:text-base tablet:text-base" />
                      <p className="text-lg font-bold phone:text-sm tablet:text-sm">
                        {data.name}
                      </p>
                    </div>

                    <div className="mt-1 flex items-center text-amber-900">
                      <PiPhoneCallFill className="mr-2 text-xl phone:text-base tablet:text-base" />
                      <p className="text-lg font-bold phone:text-sm tablet:text-sm">
                        {data.phone}
                      </p>
                    </div>

                    <div className="mt-1 flex items-center text-amber-900 phone:w-full tablet:w-[150px]">
                      <IoMdPin className="mr-2 text-xl phone:self-start tablet:self-start" />
                      <p className="text-lg font-bold phone:text-sm tablet:text-sm">
                        {data.city}
                        {data.district}
                        {data.address}
                      </p>
                    </div>
                  </div>

                  <div className="ml-4 phone:mx-2 phone:h-[210px]">
                    <div className="mt-6 flex phone:mt-4">
                      <p className="text-xl font-bold phone:text-base">
                        用餐時間
                      </p>
                      <p className="mx-4 text-xl font-bold phone:text-base">
                        |
                      </p>
                      <p className="text-xl phone:text-base">{data.date}</p>
                      <p className="ml-4 text-xl phone:text-base">
                        {data.start}
                      </p>
                    </div>

                    <div className="mt-6 flex phone:mt-4">
                      <p className="text-xl font-bold phone:text-base">
                        訂位人數
                      </p>
                      <p className="mx-4 text-xl font-bold phone:text-base">
                        |
                      </p>
                      <p className="text-xl phone:text-base">{data.people}</p>
                    </div>

                    <div className="mt-6 flex items-center phone:mt-4">
                      <p className="text-xl font-bold phone:text-base">
                        排定桌號
                      </p>
                      <p className="mx-4 text-xl font-bold phone:text-base">
                        |
                      </p>
                      {data.tableNumber.map((number) => {
                        return (
                          <div
                            key={number}
                            className="flex h-10 w-12 items-center justify-center bg-[#ff850e] font-bold text-white phone:h-9 phone:w-10 phone:text-sm"
                          >
                            {number}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="absolute right-4 top-4 flex h-10 w-28 items-center justify-center rounded-xl border border-solid bg-gray-200 phone:right-7 phone:top-10 phone:h-8 phone:w-24 phone:rounded-lg">
                    <div className="flex items-center justify-center">
                      <div className="mr-1 text-[30px] phone:text-xl">
                        <BiSolidBookmarkAlt />
                      </div>
                      <p className="mr-1 font-bold">|</p>
                      <div>
                        <p className="font-black phone:text-sm">已預約</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    radius="full"
                    className="absolute bottom-4 right-4 mt-6 block h-10 rounded-lg bg-[#b0aba5] px-4 text-center text-lg font-black text-white shadow-lg phone:text-base"
                    onClick={() => handleDelete(data.orderId)}
                  >
                    取消
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

  return (
    <div className="justify-cente flex h-full items-center">
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

export default ReservedShop;
