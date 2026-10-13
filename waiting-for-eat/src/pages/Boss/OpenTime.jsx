import { Button, Card, ScrollShadow } from "@nextui-org/react";
import { Form, Select, TimePicker } from "antd";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
} from "firebase/firestore";
import { default as React, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsDashLg } from "react-icons/bs";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import Alert from "../../components/Alert/index.jsx";
import IsLoading from "../../components/IsLoading/index.jsx";
import { db } from "../../services/firebase/firebaseClient.js";
import "./openTime.css";

function OpenTime() {
  const { companyId } = useParams();
  const [openTime, setOpenTime] = useState([]);
  const [addTime, setAddTime] = useState({ day: "", start: "", end: "" });
  const [isLoading, setIsLoading] = useState(true);
  const companyRef = collection(db, "company");
  const openTimeRef = query(collection(companyRef, companyId, "openTime"));
  const format = "HH:mm";
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isNeedPlusBtn, setIsNeedPlusBtn] = useState(false);
  const [isShowPlus, setIsShowPlus] = useState(true);

  useEffect(() => {
    onSnapshot(openTimeRef, (querySnapshot) => {
      let openTimes = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const dataId = doc.id;
        const combine = { ...data, timeId: dataId };
        openTimes.push(combine);
      });
      setOpenTime(openTimes);
      setIsLoading(false);
    });
  }, []);

  function compareTime(a, b) {
    if (a.start < b.start) {
      return -1;
    }
    if (a.start > b.start) {
      return 1;
    }
    return 0;
  }

  function dayFilter(day) {
    const result = openTime.filter((obj) => obj.day === day);
    result.sort(compareTime);
    return result;
  }

  const Mon = dayFilter("星期一");
  const Tue = dayFilter("星期二");
  const Wed = dayFilter("星期三");
  const Thr = dayFilter("星期四");
  const Fri = dayFilter("星期五");
  const Sat = dayFilter("星期六");
  const Sun = dayFilter("星期日");

  const MonList = Mon.map((item) => {
    return (
      <div key={item.timeId} className="mt-2 flex items-center">
        <h1 className="mr-2 text-lg font-black">{item.start}</h1>
        <BsDashLg className="text-xl" />
        <h1 className="ml-2 mr-6 text-lg font-black">{item.end}</h1>
        <FaTrashCan
          className="my-4 cursor-pointer"
          onClick={() => handleDelete(item.timeId)}
        />
      </div>
    );
  });

  const TueList = Tue.map((item) => {
    return (
      <div key={item.timeId} className="mt-2 flex items-center">
        <h1 className="mr-2 text-lg font-black">{item.start}</h1>
        <BsDashLg className="text-xl" />
        <h1 className="ml-2 mr-6 text-lg font-black">{item.end}</h1>
        <FaTrashCan
          className="my-4 cursor-pointer"
          onClick={() => handleDelete(item.timeId)}
        />
      </div>
    );
  });

  const WedList = Wed.map((item) => {
    return (
      <div key={item.timeId} className="mt-2 flex items-center">
        <h1 className="mr-2 text-lg font-black">{item.start}</h1>
        <BsDashLg className="text-xl" />
        <h1 className="ml-2 mr-6 text-lg font-black">{item.end}</h1>
        <FaTrashCan
          className="my-4 cursor-pointer"
          onClick={() => handleDelete(item.timeId)}
        />
      </div>
    );
  });

  const ThrList = Thr.map((item) => {
    return (
      <div key={item.timeId} className="mt-2 flex items-center">
        <h1 className="mr-2 text-lg font-black">{item.start}</h1>
        <BsDashLg className="text-xl" />
        <h1 className="ml-2 mr-6 text-lg font-black">{item.end}</h1>
        <FaTrashCan
          className="my-4 cursor-pointer"
          onClick={() => handleDelete(item.timeId)}
        />
      </div>
    );
  });

  const FriList = Fri.map((item) => {
    return (
      <div key={item.timeId} className="mt-2 flex items-center">
        <h1 className="mr-2 text-lg font-black">{item.start}</h1>
        <BsDashLg className="text-xl" />
        <h1 className="ml-2 mr-6 text-lg font-black">{item.end}</h1>
        <FaTrashCan
          className="my-4 cursor-pointer"
          onClick={() => handleDelete(item.timeId)}
        />
      </div>
    );
  });

  const SatList = Sat.map((item) => {
    return (
      <div key={item.timeId} className="mt-2 flex items-center">
        <h1 className="mr-2 text-lg font-black">{item.start}</h1>
        <BsDashLg className="text-xl" />
        <h1 className="ml-2 mr-6 text-lg font-black">{item.end}</h1>
        <FaTrashCan
          className="my-4 cursor-pointer"
          onClick={() => handleDelete(item.timeId)}
        />
      </div>
    );
  });

  const SunList = Sun.map((item) => {
    return (
      <div key={item.timeId} className="mt-2 flex items-center">
        <h1 className="mr-2 text-lg font-black">{item.start}</h1>
        <BsDashLg className="text-xl" />
        <h1 className="ml-2 mr-6 text-lg font-black">{item.end}</h1>
        <FaTrashCan
          className="my-4 cursor-pointer"
          onClick={() => handleDelete(item.timeId)}
        />
      </div>
    );
  });

  async function handleDelete(timeId) {
    await deleteDoc(doc(openTimeRef, timeId));
  }

  async function handleAddTime() {
    if (!Object.values(addTime).includes("")) {
      await addDoc(openTimeRef, addTime);
      setAddTime({ day: "", start: "", end: "" });
      setStartTime("");
      setEndTime("");
    } else {
      toast.error("請填寫完整資訊");
    }
  }

  const handleNeedPlusBtn = () => {
    setIsShowPlus(!isShowPlus);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.matchMedia("(max-width: 1023px)").matches) {
        setIsNeedPlusBtn(true);
        setIsShowPlus(false);
      } else {
        setIsNeedPlusBtn(false);
        setIsShowPlus(true);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isLoading) {
    return <IsLoading />;
  }

  return (
    <div className="my-12 flex justify-center phone:my-8 tablet:my-8">
      <Alert />
      <div className="flex w-full justify-center phone:flex-col phone:items-center tablet:flex-col tablet:items-center">
        <div
          className={`${
            (isNeedPlusBtn === false || isShowPlus === false) && "hidden"
          } flex w-80 cursor-pointer items-center font-bold phone:w-5/6`}
          onClick={handleNeedPlusBtn}
        >
          <FaMinusCircle className="mr-1" />
          <h1>結束新增</h1>
        </div>

        <Card
          className={`${
            isShowPlus === false && "hidden"
          } ml-12 h-80 w-1/3 border-2 border-solid border-gray-400 shadow-[-4px_4px_4px_2px_rgba(0,0,0,0.2)] phone:ml-0 phone:h-96 phone:w-5/6 tablet:mb-8 tablet:h-72 tablet:w-96 laptop:h-[400px]`}
        >
          <div className="relative">
            <div className="flex h-16 items-center justify-center bg-[#292D4F] phone:h-12">
              <h1 className="text-2xl font-black text-white phone:text-xl">
                新增用餐時段
              </h1>
            </div>

            <Form>
              <div className="m-6 flex items-center phone:flex-col phone:items-start laptop:flex-col laptop:items-start">
                <h1 className="mr-4 w-16 text-base font-bold [text-align-last:justify]">
                  星期
                </h1>

                <Select
                  name="week"
                  onChange={(e) => setAddTime({ ...addTime, day: e })}
                  showSearch
                  style={{
                    width: "142px",
                  }}
                  value={addTime.day}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "").includes(input)
                  }
                  options={[
                    {
                      value: "星期一",
                      label: "星期一",
                    },
                    {
                      value: "星期二",
                      label: "星期二",
                    },
                    {
                      value: "星期三",
                      label: "星期三",
                    },
                    {
                      value: "星期四",
                      label: "星期四",
                    },
                    {
                      value: "星期五",
                      label: "星期五",
                    },
                    {
                      value: "星期六",
                      label: "星期六",
                    },
                    {
                      value: "星期日",
                      label: "星期日",
                    },
                  ]}
                />
              </div>

              <div className="mx-6 mb-6 flex items-center phone:flex-col phone:items-start laptop:flex-col laptop:items-start">
                <h1 className="mr-4 w-16 text-base font-bold [text-align-last:justify]">
                  開始時間
                </h1>
                <TimePicker
                  value={startTime}
                  placeholder=""
                  minuteStep={30}
                  format={format}
                  onChange={(e) => {
                    setAddTime({ ...addTime, start: e.format("HH:mm") });
                    setStartTime(e);
                  }}
                />
              </div>

              <div className="mx-6 mb-4 flex items-center phone:flex-col phone:items-start laptop:flex-col laptop:items-start ">
                <h1 className="mr-4 w-16 text-base font-bold [text-align-last:justify]">
                  結束時間
                </h1>
                <TimePicker
                  value={endTime}
                  placeholder=""
                  minuteStep={30}
                  format={format}
                  onChange={(e) => {
                    setAddTime({ ...addTime, end: e.format("HH:mm") });
                    setEndTime(e);
                  }}
                />
              </div>
            </Form>
          </div>

          <Button
            className="absolute bottom-6 right-4 mt-6 block h-10 rounded-lg bg-[#ff850e] px-4 text-center text-lg font-black text-white shadow-lg phone:static phone:mr-4 phone:mt-2 phone:self-end tablet:bottom-4"
            onClick={handleAddTime}
            type="primary"
            htmlType="button"
          >
            新增
          </Button>
        </Card>

        <div
          className={`${
            isShowPlus === true && "hidden"
          } flex w-5/6 cursor-pointer items-center font-bold`}
          onClick={handleNeedPlusBtn}
        >
          <FaPlusCircle className="mr-1" />
          <h1>新增用餐時段</h1>
        </div>

        <Card
          className={`${
            isShowPlus === true && isNeedPlusBtn === true && "hidden"
          } mx-10 w-[500px] border-2 border-solid border-gray-400 pb-6 shadow-[-4px_4px_4px_2px_rgba(0,0,0,0.2)] phone:h-[calc(100vh-360px)] phone:w-5/6 tablet:h-[calc(100vh-270px)] tablet:w-5/6`}
        >
          <div className="mb-4 flex h-16 items-center justify-center bg-[#292D4F] phone:h-12">
            <h1 className="text-2xl font-black text-white phone:text-xl">
              用餐時段
            </h1>
          </div>

          <ScrollShadow
            size={0}
            hideScrollBar
            className="h-[calc(100vh-400px)] w-full justify-center tablet:h-[calc(100%-50px)]"
          >
            <div className="mx-12 flex phone:mx-6 phone:flex-col">
              <h1 className="mr-4 mt-4 h-8 w-24 rounded-md bg-gray-400 text-center text-xl font-bold leading-8 text-white">
                星期一
              </h1>
              <div>
                {MonList.length === 0 ? (
                  <div className="mb-4 mt-4 text-lg font-bold leading-8">
                    無用餐時段
                  </div>
                ) : (
                  <div className="mb-2">{MonList}</div>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <div className="h-4"></div>
            </div>

            <div className="mx-12 flex phone:mx-6 phone:flex-col">
              <h1 className="mr-4 mt-4 h-8 w-24 rounded-md bg-gray-400 text-center text-xl font-bold leading-8 text-white">
                星期二
              </h1>
              <div>
                {TueList.length === 0 ? (
                  <div className="mb-4 mt-4 text-lg font-bold leading-8">
                    無用餐時段
                  </div>
                ) : (
                  <div className="mb-2">{TueList}</div>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <div className="h-4"></div>
            </div>

            <div className="mx-12 flex phone:mx-6 phone:flex-col">
              <h1 className="mr-4 mt-4 h-8 w-24 rounded-md bg-gray-400 text-center text-xl font-bold leading-8 text-white">
                星期三
              </h1>
              <div>
                {WedList.length === 0 ? (
                  <div className="mb-4 mt-4 text-lg font-bold leading-8">
                    無用餐時段
                  </div>
                ) : (
                  <div className="mb-2">{WedList}</div>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <div className="h-4"></div>
            </div>

            <div className="mx-12 flex phone:mx-6 phone:flex-col">
              <h1 className="mr-4 mt-4 h-8 w-24 rounded-md bg-gray-400 text-center text-xl font-bold leading-8 text-white">
                星期四
              </h1>
              <div>
                {ThrList.length === 0 ? (
                  <div className="mb-4 mt-4 text-lg font-bold leading-8">
                    無用餐時段
                  </div>
                ) : (
                  <div className="mb-2">{ThrList}</div>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <div className="h-4"></div>
            </div>

            <div className="mx-12 flex phone:mx-6 phone:flex-col">
              <h1 className="mr-4 mt-4 h-8 w-24 rounded-md bg-gray-400 text-center text-xl font-bold leading-8 text-white">
                星期五
              </h1>
              <div>
                {FriList.length === 0 ? (
                  <div className="mb-4 mt-4 text-lg font-bold leading-8">
                    無用餐時段
                  </div>
                ) : (
                  <div className="mb-2">{FriList}</div>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <div className="h-4"></div>
            </div>

            <div className="mx-12 flex phone:mx-6 phone:flex-col">
              <h1 className="mr-4 mt-4 h-8 w-24 rounded-md bg-gray-400 text-center text-xl font-bold leading-8 text-white">
                星期六
              </h1>
              <div>
                {SatList.length === 0 ? (
                  <div className="mb-4 mt-4 text-lg font-bold leading-8">
                    無用餐時段
                  </div>
                ) : (
                  <div className="mb-2">{SatList}</div>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <div className="h-4"></div>
            </div>

            <div className="mx-12 flex phone:mx-6 phone:flex-col">
              <h1 className="mr-4 mt-4 h-8 w-24 rounded-md bg-gray-400 text-center text-xl font-bold leading-8 text-white">
                星期日
              </h1>
              <div>
                {SunList.length === 0 ? (
                  <div className="mb-4 mt-4 text-lg font-bold leading-8">
                    無用餐時段
                  </div>
                ) : (
                  <div className="mb-2">{SunList}</div>
                )}
              </div>
            </div>
          </ScrollShadow>
        </Card>
      </div>
    </div>
  );
}

export default OpenTime;
