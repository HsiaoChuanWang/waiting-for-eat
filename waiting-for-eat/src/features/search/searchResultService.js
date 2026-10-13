import { getFavoriteStatus } from "../../services/repositories/favoriteRepository.js";
import { enrichSearchResults, sortSearchResults } from "./searchModel.js";

async function prepareSearchResults(
  searchResults,
  userId,
  { tieBreakByCompanyId = false } = {},
) {
  const enrichedResults = await enrichSearchResults(
    searchResults,
    (companyId) => getFavoriteStatus(companyId, userId),
  );

  return sortSearchResults(enrichedResults, tieBreakByCompanyId);
}

export { prepareSearchResults };
