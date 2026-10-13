import { Button, Card } from "@nextui-org/react";
import { Form, Select, TimePicker } from "antd";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Alert from "../../../components/Alert/index.jsx";
import IsLoading from "../../../components/IsLoading/index.jsx";
import OpeningTimeSchedule from "./OpeningTimeSchedule.jsx";
import {
  createOpeningTime,
  deleteOpeningTime,
  subscribeOpeningTimes,
} from "../../../services/repositories/openingTimeRepository.js";
import "./OpenTime.css";

function OpenTime() {
  const { companyId } = useParams();
  const [openTime, setOpenTime] = useState([]);
  const [addTime, setAddTime] = useState({ day: "", start: "", end: "" });
  const [isLoading, setIsLoading] = useState(true);
  const format = "HH:mm";
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isNeedPlusBtn, setIsNeedPlusBtn] = useState(false);
  const [isShowPlus, setIsShowPlus] = useState(true);

  useEffect(() => {
    return subscribeOpeningTimes(companyId, (openTimes) => {
      setOpenTime(openTimes);
      setIsLoading(false);
    });
  }, [companyId]);

  async function handleDelete(timeId) {
    await deleteOpeningTime(companyId, timeId);
  }

  async function handleAddTime() {
    if (!Object.values(addTime).includes("")) {
      await createOpeningTime(companyId, addTime);
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

          <OpeningTimeSchedule openTimes={openTime} onDelete={handleDelete} />
        </Card>
      </div>
    </div>
  );
}

export default OpenTime;
