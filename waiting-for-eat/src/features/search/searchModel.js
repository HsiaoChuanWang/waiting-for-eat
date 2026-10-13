function createSearchResult(company, companyId, status = "") {
  return { ...company, companyId, status };
}

function withFavoriteStatus(searchResult, status) {
  return { ...searchResult, status };
}

function createSearchOptions(companies, field) {
  const values = companies.map((company) => company[field]).filter(Boolean);
  const uniqueValues = [...new Set(values)];

  return uniqueValues.map((value) => ({ label: value, value }));
}

export { createSearchOptions, createSearchResult, withFavoriteStatus };
