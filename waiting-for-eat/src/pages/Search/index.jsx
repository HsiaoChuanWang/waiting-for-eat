import { useLoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import {
  IoIosArrowDropdownCircle,
  IoIosArrowDropupCircle,
  IoIosList,
} from "react-icons/io";
import IsLoading from "../../components/IsLoading";
import {
  DEFAULT_MAP_CENTER,
  GOOGLE_MAP_LIBRARIES,
  SEARCH_FIELDS,
} from "../../features/search/searchConstants.js";
import SearchControls from "../../features/search/components/SearchControls.jsx";
import SearchMap from "../../features/search/components/SearchMap.jsx";
import SearchResultList from "../../features/search/components/SearchResultList.jsx";
import useRestaurantSearch from "../../features/search/useRestaurantSearch.js";

function Search() {
  const {
    cityOptions,
    nameOptions,
    results,
    searchByCategory,
    searchByCity,
    searchByName,
  } = useRestaurantSearch();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries: GOOGLE_MAP_LIBRARIES,
  });

  const [searchName, setSearchName] = useState("");
  const [searchPlace, setSearchPlace] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [currentPosition, setCurrentPosition] = useState(DEFAULT_MAP_CENTER);
  const [isShowSearchbar, setIsShowSearchbar] = useState(true);
  const [isShowResultbar, setIsShowResultbar] = useState(true);
  async function handleRestaurant() {
    const results = await searchByName(searchName);
    results.forEach((data) => {
      setCurrentPosition({
        lat: data.lat,
        lng: data.lng,
      });
    });
  }

  async function handlePlace() {
    const results = await searchByCity(searchPlace);
    const first = results[0];

    if (first) {
      setCurrentPosition({ lat: first.lat, lng: first.lng });
    }
  }

  function selectSearchCriterion(criterion, value) {
    setSearchName(criterion === SEARCH_FIELDS.NAME ? value : "");
    setSearchPlace(criterion === SEARCH_FIELDS.CITY ? value : "");
    setSearchCategory(criterion === SEARCH_FIELDS.CATEGORY ? value : "");
  }

  async function handleCategory() {
    const results = await searchByCategory(searchCategory);
    const first = results[0];

    if (first) {
      setCurrentPosition({ lat: first.lat, lng: first.lng });
    }
  }

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
        cityOptions={cityOptions}
        isVisible={isShowSearchbar}
        nameOptions={nameOptions}
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
        <SearchResultList isVisible={isShowResultbar} results={results} />

        <div className="w-[72%] map:h-full map:w-full">
          <SearchMap center={currentPosition} results={results} />
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
