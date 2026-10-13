import { getFavoriteByUserAndCompany } from "../../services/repositories/favoriteRepository.js";
import { sortSearchResults } from "./searchModel.js";

async function prepareSearchResults(
  searchResults,
  userId,
  { tieBreakByCompanyId = false } = {},
) {
  const enrichedResults = await Promise.all(
    searchResults.map(async (searchResult) => {
      if (!userId) return { ...searchResult, favoriteId: "", status: "" };

      const favorite = await getFavoriteByUserAndCompany(
        searchResult.companyId,
        userId,
      );

      return {
        ...searchResult,
        favoriteId: favorite?.favoriteId ?? "",
        status: favorite?.status ?? "",
      };
    }),
  );

  return sortSearchResults(enrichedResults, tieBreakByCompanyId);
}

export { prepareSearchResults };
