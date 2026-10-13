function withFavoriteStatus(searchResult, status) {
  return { ...searchResult, status };
}

function createSearchOptions(companies, field) {
  const values = companies.map((company) => company[field]).filter(Boolean);
  const uniqueValues = [...new Set(values)];

  return uniqueValues.map((value) => ({ label: value, value }));
}

async function enrichSearchResults(searchResults, loadFavoriteStatus) {
  return Promise.all(
    searchResults.map(async (searchResult) => {
      const status = await loadFavoriteStatus(searchResult.companyId);
      return withFavoriteStatus(searchResult, status);
    }),
  );
}

function sortSearchResults(searchResults, tieBreakByCompanyId = false) {
  return [...searchResults].sort((first, second) => {
    if (first.totalStar !== second.totalStar) {
      return second.totalStar - first.totalStar;
    }

    if (tieBreakByCompanyId) {
      return String(second.companyId).localeCompare(String(first.companyId));
    }

    return 0;
  });
}

export {
  createSearchOptions,
  enrichSearchResults,
  sortSearchResults,
  withFavoriteStatus,
};
