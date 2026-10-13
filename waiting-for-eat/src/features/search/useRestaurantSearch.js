import { useEffect, useState } from "react";
import useSearchStore from "../../stores/searchStore.js";
import useUserStore from "../../stores/userStore.js";
import { SEARCH_FIELDS } from "./searchConstants.js";
import { createSearchOptions } from "./searchModel.js";
import { prepareSearchResults } from "./searchResultService.js";
import {
  findCompaniesByCategory,
  findCompaniesByCity,
  findCompaniesByName,
  getCompanies,
} from "../../services/repositories/searchRepository.js";
import { updateFavoriteStatus as saveFavoriteStatus } from "../../services/repositories/favoriteRepository.js";

function useRestaurantSearch() {
  const userId = useUserStore((state) => state.userId);
  const results = useSearchStore((state) => state.searchArray);
  const setResults = useSearchStore((state) => state.setSearchArray);
  const updateResultFavoriteStatus = useSearchStore(
    (state) => state.updateFavoriteStatus,
  );
  const [nameOptions, setNameOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [isOptionsLoading, setIsOptionsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    getCompanies().then((companies) => {
      if (!isActive) return;
      setNameOptions(createSearchOptions(companies, SEARCH_FIELDS.NAME));
      setCityOptions(createSearchOptions(companies, SEARCH_FIELDS.CITY));
      setIsOptionsLoading(false);
    });

    return () => {
      isActive = false;
    };
  }, []);

  async function runSearch(findCompanies, value, options) {
    setResults([]);
    const companies = await findCompanies(value);
    const searchResults = await prepareSearchResults(
      companies,
      userId,
      options,
    );
    setResults(searchResults);
    return searchResults;
  }

  const searchByName = (name) => runSearch(findCompaniesByName, name);
  const searchByCity = (city) => runSearch(findCompaniesByCity, city);
  const searchByCategory = (category) =>
    runSearch(findCompaniesByCategory, category, {
      tieBreakByCompanyId: true,
    });

  async function updateFavoriteStatus(favoriteId, status) {
    if (!favoriteId) return;
    await saveFavoriteStatus(favoriteId, status);
    updateResultFavoriteStatus(favoriteId, status);
  }

  return {
    cityOptions,
    isOptionsLoading,
    nameOptions,
    results,
    searchByCategory,
    searchByCity,
    searchByName,
    updateFavoriteStatus,
  };
}

export default useRestaurantSearch;
