import { Card, ScrollShadow } from "@nextui-org/react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { HiThumbDown } from "react-icons/hi";
import { IoMdPin } from "react-icons/io";
import { IoRestaurant } from "react-icons/io5";
import { PiPhoneCallFill } from "react-icons/pi";
import { useNavigate, useParams } from "react-router-dom";
import IsLoading from "../../components/IsLoading/index.jsx";
import { db } from "../../services/firebase/firebaseClient.js";
import noData from "./noData.png";

function DislikeShop() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [favorites, setFavorites] = useState([]);
  const [combineData, setCombineData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const favoriteq = query(
    collection(db, "favorite"),
    where("userId", "==", userId),
    where("status", "==", "dislike"),
  );

  async function getCompanyInfo(companyId) {
    const docRef = doc(db, "company", companyId);
    const docSnap = await getDoc(docRef);

    const resultUser = docSnap.data();
    return resultUser;
  }

  useEffect(() => {
    const favoriteSnap = onSnapshot(favoriteq, (result) => {
      let favoriteList = [];
      result.forEach((doc) => {
        const data = doc.data();
        const dataId = doc.id;
        const combine = { ...data, favoriteId: dataId };
        favoriteList.push(combine);
      });
      setFavorites(favoriteList);

      Promise.all(
        favoriteList.map((item) => {
          return Promise.all([getCompanyInfo(item.companyId)]).then(
            ([companyInfo]) => {
              const newItem = {
                ...item,
                ...companyInfo,
              };
              return newItem;
            },
          );
        }),
      ).then((value) => {
        setCombineData(value);
        setIsLoading(false);
      });
    });

    return favoriteSnap;
  }, []);

  const companyDatas =
    combineData.length > 0 ? (
      combineData.map((data, i) => {
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

                <div className="ml-4 phone:mx-4 phone:mb-4 phone:mt-4 laptop:mx-4">
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

                <div className="absolute right-4 top-4 flex w-24 items-center justify-between phone:right-9 phone:top-12 phone:h-8 phone:w-20 phone:overflow-y-hidden phone:rounded-lg">
                  <div className="flex h-10 w-28 items-center justify-center rounded-xl border border-solid bg-gray-200">
                    <div className="mr-1 text-[30px] phone:text-xl">
                      <HiThumbDown />
                    </div>
                    <p className="mr-1">|</p>
                    <p className="font-semibold">Bad</p>
                  </div>
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
    <div className="justify-cente flex h-full items-center">
      <ScrollShadow
        size={0}
        hideScrollBar
        className="flex h-[calc(100vh-300px)] w-full justify-center py-2"
      >
        <div className="flex h-full w-3/4 flex-col gap-12 phone:mt-12 phone:w-[90%] tablet:w-[90%] laptop:w-5/6">
          {companyDatas}
        </div>
      </ScrollShadow>
    </div>
  );
}

export default DislikeShop;
