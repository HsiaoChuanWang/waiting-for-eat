import { Button } from "@nextui-org/react";
import { Form, Select } from "antd";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import IsLoading from "../../components/IsLoading/index.jsx";
import useRestaurantSearch from "../../features/search/useRestaurantSearch.js";
import CategoryGrid from "./CategoryGrid.jsx";
import Carousel from "./Carousel";
import boss from "./homepagePictures/boss.png";
import diner from "./homepagePictures/diner.png";

function HomePage() {
  const [searchName, setSearchName] = useState("");
  const [searchPlace, setSearchPlace] = useState("");
  const {
    cityOptions,
    isOptionsLoading,
    nameOptions,
    searchByCategory,
    searchByCity,
    searchByName,
  } = useRestaurantSearch();
  const navigate = useNavigate();
  const scrollRef = useRef();

  async function handleRestaurant() {
    await searchByName(searchName);
    navigate("/search");
  }

  async function handlePlace() {
    await searchByCity(searchPlace);
    navigate("/search");
  }

  async function handleCategory(category) {
    await searchByCategory(category);
    navigate("/search");
  }

  const handleClick = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (isOptionsLoading) {
    return <IsLoading />;
  }

  return (
    <div>
      <div className="relative">
        <Carousel />
        <div className="absolute bottom-0 h-[400px] w-full bg-black/30"></div>
        <div className="absolute bottom-12 right-48 items-center justify-center phone:right-12 tablet:right-20">
          <div className="text-white/90">
            <h1 className="text-right text-5xl font-bold phone:text-3xl">
              痴吃等待
            </h1>
            <h1 className="text-right text-2xl font-bold phone:text-base">
              Waiting for eat
            </h1>
            <h1 className="text-right text-xl font-black phone:text-xs">
              這個世界除了筷子，什麼都可以放下
            </h1>

            <div
              className="mt-2 flex cursor-pointer justify-end"
              onClick={handleClick}
            >
              <IoIosArrowDropdownCircle className="animate-[bounce_1s_infinite] text-3xl text-white phone:text-2xl" />
              <h1 className="ml-2 text-lg font-bold phone:text-base">
                開始查詢餐廳
              </h1>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        whileInView={{ y: 0, opacity: 1 }}
        transition={{
          ease: "linear",
          duration: 0.5,
        }}
        initial={{ y: -50, opacity: 0 }}
        className="mt-24 flex items-center justify-center phone:flex-col"
      >
        <div>
          <img
            className="h-[240px] phone:mb-8 phone:h-36 tablet:h-36"
            src={diner}
            alt="食客"
          ></img>
        </div>

        <div className="ml-16 leading-8 phone:ml-0 tablet:ml-4">
          <div className="mb-2 text-2xl font-bold phone:flex phone:flex-col phone:text-center phone:text-lg tablet:mb-0 tablet:text-lg">
            <span>動動手指，</span>
            <span className="text-[#ff6e06]">探索你所不知道的熱門美食。</span>
          </div>

          <div className="text-gray-600 phone:text-center phone:text-xs tablet:text-sm">
            <h1>以店名、地區、食物種類快速搜尋餐廳，</h1>
            <h1>查看相關評論及食記，準確下訂感興趣的餐廳，</h1>
            <h1>記錄每間吃過的餐廳，避免再度光臨不合口味的餐廳。</h1>
          </div>
        </div>
      </motion.div>

      <motion.div
        whileInView={{ y: 0, opacity: 1 }}
        transition={{
          ease: "linear",
          duration: 0.5,
        }}
        initial={{ y: 50, opacity: 0 }}
        className="mt-24 flex items-center justify-center phone:flex-col-reverse tablet:mt-12"
      >
        <div className="mr-16 leading-8 phone:mr-0 tablet:mr-4">
          <div className="mb-2 text-2xl font-bold phone:flex phone:flex-col phone:text-center phone:text-lg tablet:mb-0 tablet:text-lg">
            <span>敲敲鍵盤，</span>
            <span className="text-[#ff6e06]">輕鬆上架你的餐廳。</span>
          </div>

          <div className="text-gray-600 phone:text-center phone:text-xs tablet:text-sm">
            <h1>編輯相關資訊、菜單、活動，</h1>
            <h1>指定各時段可訂位人數，</h1>
            <h1>使用日曆查看每天預約狀況。</h1>
          </div>
        </div>

        <div>
          <img
            className="h-[240px] phone:mb-8 phone:h-36 tablet:h-36"
            src={boss}
            alt="餐廳業者"
          ></img>
        </div>
      </motion.div>

      <div className="h-24" ref={scrollRef}></div>

      <div className="py-8">
        <div className="flex justify-center">
          <h1 className="text-4xl font-bold">Waiting for Eat?</h1>
        </div>

        <div className="flex justify-center">
          <h1 className="text-xl font-bold">註冊會員 訂位想要的餐廳</h1>
        </div>
      </div>

      <div className="flex w-full justify-center">
        <div className="flex phone:flex-col tablet:flex-col laptop:flex-col">
          <div className="mx-8">
            <Form className="flex">
              <Form.Item className="rounded-lg border-2 border-solid border-[#ff6e06]">
                <Select
                  placeholder="搜尋餐廳"
                  className="h-10"
                  onChange={(e) => {
                    setSearchName(e);
                    setSearchPlace("");
                  }}
                  value={searchName}
                  showSearch
                  style={{
                    width: 200,
                  }}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "").includes(input)
                  }
                  options={nameOptions}
                />
              </Form.Item>
              <Button
                className="ml-1 h-11 rounded-lg border bg-[#ff6e06] px-4 py-1 text-center text-xl font-semibold text-white phone:text-base"
                onClick={handleRestaurant}
              >
                餐廳搜尋
              </Button>
            </Form>
          </div>

          <div className="mx-8">
            <Form className="flex">
              <Form.Item className="rounded-lg border-2 border-solid border-[#ff6e06]">
                <Select
                  className="h-10"
                  name="category"
                  onChange={(e) => {
                    setSearchPlace(e);
                    setSearchName("");
                  }}
                  value={searchPlace}
                  showSearch
                  style={{
                    width: 200,
                  }}
                  placeholder="搜尋餐廳"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "").includes(input)
                  }
                  options={cityOptions}
                />
              </Form.Item>
              <Button
                className="ml-1 h-11 rounded-lg border bg-[#ff6e06] px-4 py-1 text-center text-xl font-semibold text-white phone:text-base"
                onClick={handlePlace}
              >
                搜尋地區
              </Button>
            </Form>
          </div>
        </div>
      </div>

      <CategoryGrid onSelect={handleCategory} />
    </div>
  );
}

export default HomePage;
