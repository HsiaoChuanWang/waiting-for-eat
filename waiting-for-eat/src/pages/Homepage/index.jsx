import { Button } from "@nextui-org/react";
import { Form, Select } from "antd";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import IsLoading from "../../components/IsLoading/index.jsx";
import { RESTAURANT_CATEGORIES } from "../../constants/restaurant.js";
import { SEARCH_FIELDS } from "../../features/search/searchConstants.js";
import {
  createSearchOptions,
  withFavoriteStatus,
} from "../../features/search/searchModel.js";
import {
  findCompaniesByCategory,
  findCompaniesByCity,
  findCompaniesByName,
  getCompanies,
  getFavoriteStatus,
} from "../../services/repositories/searchRepository.js";
import useSearchStore from "../../stores/searchStore.js";
import useUserStore from "../../stores/userStore.js";
import Carousel from "./Carousel";
import bbq from "./homepagePictures/bbq.jpg";
import boss from "./homepagePictures/boss.png";
import breakfast from "./homepagePictures/breakfast.jpg";
import diner from "./homepagePictures/diner.png";
import hotpot from "./homepagePictures/hotpot.jpg";
import steak from "./homepagePictures/steak.jpg";
import streetFood from "./homepagePictures/streetFood.jpg";
import sweet from "./homepagePictures/sweet.jpg";

function HomePage() {
  const setSearchArray = useSearchStore((state) => state.setSearchArray);
  const [isLoading, setIsLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [searchPlace, setSearchPlace] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [city, setCity] = useState([]);
  const userId = useUserStore((state) => state.userId);
  const navigate = useNavigate();
  const scrollRef = useRef();

  useEffect(() => {
    getCompanies().then((companyList) => {
      setRestaurants(createSearchOptions(companyList, SEARCH_FIELDS.NAME));
      setCity(createSearchOptions(companyList, SEARCH_FIELDS.CITY));
      setIsLoading(false);
    });
  }, []);

  async function getRestaurant(searchitem) {
    const dataList = await findCompaniesByName(searchitem);

    let resultArray = [];
    dataList.forEach((item) => {
      getFavoriteStatus(item.companyId, userId)
        .then((result) => {
          const newData = withFavoriteStatus(item, result);
          resultArray.push(newData);
          return resultArray;
        })
        .then((resultArray) => {
          const finalArray = resultArray.sort((a, b) =>
            a.totalStar > b.totalStar ? -1 : 1,
          );
          setSearchArray([...finalArray]);
        });
    });
    navigate(`/search`);
  }

  function handleRestaurant() {
    setSearchArray([]);
    getRestaurant(searchName);
  }

  async function getPlace(searchitem) {
    const dataList = await findCompaniesByCity(searchitem);

    let resultArray = [];
    dataList.forEach((item) => {
      getFavoriteStatus(item.companyId, userId)
        .then((result) => {
          const newData = withFavoriteStatus(item, result);
          resultArray.push(newData);
          return resultArray;
        })
        .then((resultArray) => {
          const finalArray = resultArray.sort((a, b) =>
            a.totalStar > b.totalStar ? -1 : 1,
          );
          setSearchArray([...finalArray]);
        });
    });
    navigate(`/search`);
  }

  function handlePlace() {
    setSearchArray([]);
    getPlace(searchPlace);
  }

  function handleCategory(name) {
    setSearchArray([]);
    getCategory(name);
  }

  async function getCategory(item) {
    const dataList = await findCompaniesByCategory(item);

    let resultArray = [];
    dataList.forEach((item) => {
      getFavoriteStatus(item.companyId, userId)
        .then((result) => {
          const newData = withFavoriteStatus(item, result);
          resultArray.push(newData);
          return resultArray;
        })
        .then((resultArray) => {
          const finalArray = resultArray.sort((a, b) => {
            if (a.totalStar === b.totalStar) {
              return a.companyId > b.companyId ? -1 : 1;
            } else {
              return a.totalStar > b.totalStar ? -1 : 1;
            }
          });
          setSearchArray([...finalArray]);
        });
    });
    navigate(`/search`);
  }

  const handleClick = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (isLoading) {
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
                  options={restaurants}
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
                  options={city}
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

      <div className="flex justify-center">
        <div className="mb-8 flex w-[1440px] max-w-[1440px] flex-wrap justify-center tablet:w-[768px] laptop:w-[1024px]">
          <div
            onClick={() => handleCategory(RESTAURANT_CATEGORIES.HOT_POT)}
            className="card-zoom relative mx-8 my-8 flex h-72 w-96 cursor-pointer items-center justify-center overflow-hidden rounded-2xl shadow-xl phone:h-36 phone:w-3/4 tablet:h-48 tablet:w-64 laptop:mx-4 laptop:h-48 laptop:w-64"
          >
            <img
              className="card-zoom-image absolute h-full w-full transform transition-all duration-500 ease-in-out phone:w-full phone:object-cover phone:object-center"
              src={hotpot}
            />
            <div className="absolute h-full w-full bg-black/30"></div>
            <div className="card-zoom-text absolute scale-150 transform text-center text-white transition-all duration-500 ease-in-out">
              <h1 className="text-4xl font-black">火鍋</h1>
              <h2 className="text-lg font-black">HOTPOT</h2>
            </div>
          </div>

          <div
            onClick={() => handleCategory(RESTAURANT_CATEGORIES.BARBECUE)}
            className="card-zoom relative mx-8 my-8 flex h-72 w-96 cursor-pointer items-center justify-center overflow-hidden rounded-2xl shadow-xl phone:h-36 phone:w-3/4 tablet:h-48 tablet:w-64 laptop:mx-4 laptop:h-48 laptop:w-64"
          >
            <img
              className="card-zoom-image absolute h-full w-full transform transition-all duration-500 ease-in-out phone:w-full phone:object-cover phone:object-center"
              src={bbq}
            />
            <div className="absolute h-full w-full bg-black/30"></div>
            <div className="card-zoom-text absolute scale-150 transform text-center text-white transition-all duration-500 ease-in-out">
              <h1 className="text-4xl font-black">燒烤</h1>
              <h2 className="text-lg font-black">BARBECUE</h2>
            </div>
          </div>

          <div
            onClick={() => handleCategory(RESTAURANT_CATEGORIES.STEAK)}
            className="card-zoom relative mx-8 my-8 flex h-72 w-96 cursor-pointer items-center justify-center overflow-hidden rounded-2xl shadow-xl phone:h-36 phone:w-3/4 tablet:h-48 tablet:w-64 laptop:mx-4 laptop:h-48 laptop:w-64"
          >
            <img
              className="card-zoom-image absolute h-full w-full transform transition-all duration-500 ease-in-out phone:w-full phone:object-cover phone:object-center"
              src={steak}
            />
            <div className="absolute h-full w-full bg-black/40"></div>
            <div className="card-zoom-text absolute scale-150 transform text-center text-white transition-all duration-500 ease-in-out">
              <h1 className="text-4xl font-black">牛排</h1>
              <h2 className="text-lg font-black">STEAKHOUSE</h2>
            </div>
          </div>

          <div
            onClick={() => handleCategory(RESTAURANT_CATEGORIES.DESSERT)}
            className="card-zoom relative mx-8 my-8 flex h-72 w-96 cursor-pointer items-center justify-center overflow-hidden rounded-2xl shadow-xl phone:h-36 phone:w-3/4 tablet:h-48 tablet:w-64 laptop:mx-4 laptop:h-48 laptop:w-64"
          >
            <img
              className="card-zoom-image absolute h-full w-full transform transition-all duration-500 ease-in-out phone:w-full phone:object-cover phone:object-center"
              src={sweet}
            />
            <div className="absolute h-full w-full bg-black/40"></div>
            <div className="card-zoom-text absolute scale-150 transform text-center text-white transition-all duration-500 ease-in-out">
              <h1 className="text-4xl font-black">甜點</h1>
              <h2 className="text-lg font-black">DESSERT</h2>
            </div>
          </div>

          <div
            onClick={() => handleCategory(RESTAURANT_CATEGORIES.STREET_FOOD)}
            className="card-zoom relative mx-8 my-8 flex h-72 w-96 cursor-pointer items-center justify-center overflow-hidden rounded-2xl shadow-xl phone:h-36 phone:w-3/4 tablet:h-48 tablet:w-64 laptop:mx-4 laptop:h-48 laptop:w-64"
          >
            <img
              className="card-zoom-image absolute h-full w-full transform transition-all duration-500 ease-in-out phone:w-full phone:object-cover phone:object-center"
              src={streetFood}
            />
            <div className="absolute h-full w-full bg-black/40"></div>
            <div className="card-zoom-text absolute scale-150 transform text-center text-white transition-all duration-500 ease-in-out">
              <h1 className="text-4xl font-black">小吃</h1>
              <h2 className="text-lg font-black">STREET FOOD</h2>
            </div>
          </div>

          <div
            onClick={() => handleCategory(RESTAURANT_CATEGORIES.BREAKFAST)}
            className="card-zoom relative mx-8 my-8 flex h-72 w-96 cursor-pointer items-center justify-center overflow-hidden rounded-2xl shadow-xl phone:h-36 phone:w-3/4 tablet:h-48 tablet:w-64 laptop:mx-4 laptop:h-48 laptop:w-64"
          >
            <img
              className="card-zoom-image absolute h-full w-full transform transition-all duration-500 ease-in-out phone:w-full phone:object-cover phone:object-center"
              src={breakfast}
            />
            <div className="absolute h-full w-full bg-black/40"></div>
            <div className="card-zoom-text absolute scale-150 transform text-center text-white transition-all duration-500 ease-in-out">
              <h1 className="text-4xl font-black">早餐</h1>
              <h2 className="text-lg font-black">BREAKFAST</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
