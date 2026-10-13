import { ScrollShadow } from "@nextui-org/react";
import { useLoadScript } from "@react-google-maps/api";
import { Rate } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { IconContext } from "react-icons";
import { FaSearch } from "react-icons/fa";
import {
  HiOutlineThumbDown,
  HiOutlineThumbUp,
  HiThumbDown,
  HiThumbUp,
} from "react-icons/hi";
import {
  IoIosArrowDropdownCircle,
  IoIosArrowDropupCircle,
  IoIosList,
} from "react-icons/io";
import { useNavigate } from "react-router-dom";
import IsLoading from "../../components/IsLoading";
import NoItem from "../../components/NoItem";
import {
  DEFAULT_MAP_CENTER,
  GOOGLE_MAP_LIBRARIES,
  SEARCH_FIELDS,
} from "../../features/search/searchConstants.js";
import { createSearchOptions } from "../../features/search/searchModel.js";
import { prepareSearchResults } from "../../features/search/searchResultService.js";
import SearchControls from "../../features/search/components/SearchControls.jsx";
import {
  findCompaniesByCategory,
  findCompaniesByCity,
  findCompaniesByName,
  getCompanies,
} from "../../services/repositories/searchRepository.js";
import useSearchStore from "../../stores/searchStore.js";
import useUserStore from "../../stores/userStore.js";
import MyGoogleMaps from "./MyGoogleMaps";
import tasty from "./tasty.jpg";

function Search() {
  const userId = useUserStore((state) => state.userId);
  const searchArray = useSearchStore((state) => state.searchArray);
  const setSearchArray = useSearchStore((state) => state.setSearchArray);
  const navigation = useNavigate();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries: GOOGLE_MAP_LIBRARIES,
  });

  const mapRef = useRef();
  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const [searchName, setSearchName] = useState("");
  const [searchPlace, setSearchPlace] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [map, setMap] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(DEFAULT_MAP_CENTER);
  const [restaurants, setRestaurants] = useState([]);
  const [city, setCity] = useState([]);
  const [isShowSearchbar, setIsShowSearchbar] = useState(true);
  const [isShowResultbar, setIsShowResultbar] = useState(true);
  useEffect(() => {
    getCompanies().then((companyList) => {
      setRestaurants(createSearchOptions(companyList, SEARCH_FIELDS.NAME));
      setCity(createSearchOptions(companyList, SEARCH_FIELDS.CITY));
    });
  }, []);

  async function getRestaurant(searchitem) {
    const dataList = await findCompaniesByName(searchitem);
    const results = await prepareSearchResults(dataList, userId);

    results.forEach((data) => {
      setCurrentPosition({
        lat: data.lat,
        lng: data.lng,
      });
    });
    setSearchArray(results);
  }

  function handleRestaurant() {
    setSearchArray([]);
    getRestaurant(searchName);
  }

  async function getPlace(searchitem) {
    const dataList = await findCompaniesByCity(searchitem);
    const results = await prepareSearchResults(dataList, userId);
    const first = results[0];

    if (first) {
      setCurrentPosition({ lat: first.lat, lng: first.lng });
    }
    setSearchArray(results);
  }

  function handlePlace() {
    setSearchArray([]);
    getPlace(searchPlace);
  }

  function handleCategory() {
    setSearchArray([]);
    getCategory(searchCategory);
  }

  function selectSearchCriterion(criterion, value) {
    setSearchName(criterion === SEARCH_FIELDS.NAME ? value : "");
    setSearchPlace(criterion === SEARCH_FIELDS.CITY ? value : "");
    setSearchCategory(criterion === SEARCH_FIELDS.CATEGORY ? value : "");
  }

  async function getCategory(item) {
    const dataList = await findCompaniesByCategory(item);
    const results = await prepareSearchResults(dataList, userId, {
      tieBreakByCompanyId: true,
    });
    const first = results[0];

    if (first) {
      setCurrentPosition({ lat: first.lat, lng: first.lng });
    }
    setSearchArray(results);
  }

  const favoriteState = (status) => {
    switch (status) {
      case "like":
        return (
          <div className="flex h-8 w-20 items-center justify-center rounded-xl border border-solid bg-gray-200">
            <div className="mr-1">
              <IconContext.Provider value={{ size: "20px" }}>
                <HiThumbUp />
              </IconContext.Provider>
            </div>
            <p className="mr-1">|</p>
            <div>
              <IconContext.Provider value={{ size: "20px" }}>
                <HiOutlineThumbDown />
              </IconContext.Provider>
            </div>
          </div>
        );

      case "dislike":
        return (
          <div className="flex h-8 w-20 items-center justify-center rounded-xl border border-solid bg-gray-200">
            <div className="mr-1">
              <IconContext.Provider value={{ size: "20px" }}>
                <HiOutlineThumbUp title="noLike" />
              </IconContext.Provider>
            </div>
            <p className="mr-1">|</p>
            <div className="mr-1">
              <IconContext.Provider
                value={{ size: "20px", backgroundColor: "black" }}
              >
                <HiThumbDown />
              </IconContext.Provider>
            </div>
          </div>
        );

      case "eaten":
        return (
          <div className="flex h-8 w-20 items-center justify-center rounded-xl border border-solid bg-gray-200">
            <div className="flex items-center justify-center">
              <div className="mr-1">
                <IconContext.Provider value={{ size: "20px" }}>
                  <HiOutlineThumbUp title="noLike" />
                </IconContext.Provider>
              </div>
              <p className="mr-1">|</p>
              <div>
                <IconContext.Provider value={{ size: "20px" }}>
                  <HiOutlineThumbDown />
                </IconContext.Provider>
              </div>
            </div>
          </div>
        );
    }
  };

  const handleShowSearchbar = () => {
    setIsShowSearchbar(!isShowSearchbar);
  };

  const handleShowResultbar = () => {
    setIsShowResultbar(!isShowResultbar);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1280) {
        setIsShowSearchbar(true);
        setIsShowResultbar(true);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!isLoaded) {
    return <IsLoading />;
  }

  return (
    <div className="map:relative">
      <SearchControls
        cityOptions={city}
        isVisible={isShowSearchbar}
        nameOptions={restaurants}
        onCategoryChange={(value) =>
          selectSearchCriterion(SEARCH_FIELDS.CATEGORY, value)
        }
        onCategorySubmit={handleCategory}
        onCityChange={(value) =>
          selectSearchCriterion(SEARCH_FIELDS.CITY, value)
        }
        onCitySubmit={handlePlace}
        onNameChange={(value) =>
          selectSearchCriterion(SEARCH_FIELDS.NAME, value)
        }
        onNameSubmit={handleRestaurant}
        values={{
          category: searchCategory,
          city: searchPlace,
          name: searchName,
        }}
      />

      <div className="flex h-[calc(100vh-200px)] justify-center shadow-[0px_0px_0px_1px_rgba(0,0,0,0.16)] map:h-[calc(100vh-104px)]">
        <div className="shadow-4xl w-[28%] map:absolute map:bottom-0 map:z-10 map:w-full">
          <ScrollShadow className="h-full w-full map:flex" size={0}>
            {searchArray.length === 0 ? (
              <NoItem
                content="尚無相關餐廳進駐"
                distance="w-[calc(100%-36px)] map:w-72"
                pictureWidth="w-44 map:w-32"
                textSize="text-lg map:text-sm"
                optional={`${isShowResultbar === false && "hidden"}`}
              />
            ) : (
              [...searchArray].map((info, index) => {
                return (
                  <div
                    key={info.companyId}
                    className={`${
                      isShowResultbar === false && "hidden"
                    }  flex items-center justify-between border-b border-solid border-black p-4 map:m-4 map:rounded-2xl map:border-none map:bg-white`}
                  >
                    <div className="map:w-72">
                      <div>
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            navigation(`/restaurant/${info.companyId}`);
                          }}
                        >
                          <div className="mr-1 inline border border-solid border-gray-400 bg-gray-200 px-1 font-bold map:text-sm">
                            {index + 1}
                          </div>
                          <h3 className="inline text-lg font-bold map:text-base">
                            {info.name}
                          </h3>
                        </div>
                        <div>
                          <h3 className="ml-6 mr-2 inline text-sm text-gray-600 map:text-xs">
                            {info.totalStar.toFixed(1)}
                          </h3>
                          <Rate
                            className="text-sm map:text-xs"
                            disabled
                            allowHalf
                            defaultValue={info.totalStar}
                          />
                        </div>
                      </div>

                      <p className="mb-1 ml-6 pr-2 text-sm text-gray-600 map:text-xs">
                        {info.city}
                        {info.district}
                        {info.address}
                      </p>
                      <p className="mb-1 ml-6 text-sm text-gray-600 map:text-xs">
                        {info.phone}
                      </p>
                      <div className="ml-6">{favoriteState(info.status)}</div>
                    </div>

                    <div
                      className="cursor-pointer phone:hidden"
                      onClick={() => {
                        navigation(`/restaurant/${info.companyId}`);
                      }}
                    >
                      <div className="flex justify-center map:w-20">
                        <img
                          className="min-h-24 min-w-24 map:min-h-20 map:min-w-20 h-24 w-24 rounded-2xl object-cover object-center map:h-20 map:w-20"
                          src={info.picture ? info.picture : tasty}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </ScrollShadow>
        </div>

        <div className="w-[72%] map:h-full map:w-full">
          <MyGoogleMaps
            currentPosition={currentPosition}
            mapRef={mapRef}
            onLoad={onLoad}
            map={map}
            setMap={setMap}
          />
        </div>

        <div
          className={`${
            isShowSearchbar === true && "hidden"
          } absolute left-4 top-4 z-20 h-8 w-28 cursor-pointer rounded-lg border border-solid border-gray-400 bg-white text-center font-black leading-7`}
          onClick={handleShowSearchbar}
        >
          <FaSearch className="inline text-xl" />
          <span className="ml-1 text-xs">顯示搜尋欄</span>
        </div>

        <div
          className={`${
            isShowSearchbar === false && "hidden"
          } absolute left-4 top-[200px] z-20 h-8 w-28 cursor-pointer rounded-lg border border-solid border-gray-500 bg-gray-500 text-center font-black leading-7 text-white desktop:hidden`}
          onClick={handleShowSearchbar}
        >
          <IoIosArrowDropupCircle className="inline text-xl" />
          <span className="ml-1 text-xs">隱藏搜尋欄</span>
        </div>

        <div
          className={`${
            isShowResultbar === true && "hidden"
          } absolute bottom-4 right-16 z-20 h-8 w-24 cursor-pointer rounded-lg border border-solid border-gray-400 bg-white text-center font-black leading-7`}
          onClick={handleShowResultbar}
        >
          <IoIosList className="inline text-xl" />
          <span className="ml-1 text-xs">顯示清單</span>
        </div>

        <div
          className={`${
            isShowResultbar === false && "hidden"
          } absolute bottom-36 right-2 z-20 h-8 w-24 cursor-pointer rounded-lg border border-solid border-gray-500 bg-gray-500 text-center font-black leading-7 text-white desktop:hidden`}
          onClick={handleShowResultbar}
        >
          <IoIosArrowDropdownCircle className="inline text-xl" />
          <span className="ml-1 text-xs">隱藏清單</span>
        </div>
      </div>
    </div>
  );
}

export default Search;
