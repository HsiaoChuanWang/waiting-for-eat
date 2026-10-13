import { Button, Card, ScrollShadow } from "@nextui-org/react";
import { Rate } from "antd";
import dateFormat from "dateformat";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FaPenToSquare } from "react-icons/fa6";
import { IoRestaurant, IoTimeSharp } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import IsLoading from "../../components/IsLoading/index.jsx";
import { db } from "../../services/firebase/firebaseClient.js";
import useStarStore from "../../stores/starStore.js";
import noData from "./noData.png";

function Commented() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [combineData, setCombineData] = useState([]);
  const [starArray, setStarArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const starq = query(collection(db, "star"), where("userId", "==", userId));
  const setStarId = useStarStore((state) => state.setStarId);
  const setCompanyName = useStarStore((state) => state.setCompanyName);
  const setCompanyId = useStarStore((state) => state.setCompanyId);

  async function getCompanyInfo(companyId) {
    const docRef = doc(db, "company", companyId);
    const docSnap = await getDoc(docRef);

    const resultUser = docSnap.data();
    return resultUser;
  }

  async function getOrderInfo(orderId) {
    const docRef = doc(db, "order", orderId);
    const docSnap = await getDoc(docRef);

    const resultUser = docSnap.data();
    return resultUser;
  }

  useEffect(() => {
    const starSnap = onSnapshot(starq, (result) => {
      let starList = [];
      result.forEach((doc) => {
        const data = doc.data();
        const dataId = doc.id;
        const combine = { ...data, starId: dataId };
        starList.push(combine);
      });

      let orderList = [];
      starList.length === 0
        ? setIsLoading(false)
        : starList.forEach((item) => {
            getCompanyInfo(item.companyId).then((data) => {
              const newItem = Object.assign(item, data);
              getOrderInfo(newItem.orderId).then((data) => {
                const newnewItem = Object.assign(newItem, data);
                orderList.push(newnewItem);
                setCombineData([...orderList]);
                setIsLoading(false);
              });
            });
          });
    });

    return starSnap;
  }, []);

  async function getStarArray(companyId) {
    const starq = query(
      collection(db, "star"),
      where("companyId", "==", companyId),
    );

    let starList = [];
    await getDocs(starq).then((result) => {
      result.forEach((doc) => {
        const result = doc.data();
        const resultStar = result.star;
        const resultId = doc.id;
        const combine = { ...result, starId: resultId };
        starList.push(resultStar);
      });
      setStarArray(starList);
    });
  }

  async function UpdateTotalStar(companyId) {
    await getStarArray(companyId);

    const sumStar = starArray.reduce((a, c) => a + c, 0);
    let avg;
    if (sumStar === 0) {
      avg = 0;
    } else {
      avg = sumStar / starArray.length;
    }

    const companyRef = doc(db, "company", companyId);
    await updateDoc(companyRef, {
      totalStar: avg,
    });
  }

  async function handleDelete(starId, companyId) {
    await deleteDoc(doc(db, "star", starId));

    UpdateTotalStar(companyId);
  }

  const printDatas =
    combineData.length > 0 ? (
      combineData
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

export default Commented;
