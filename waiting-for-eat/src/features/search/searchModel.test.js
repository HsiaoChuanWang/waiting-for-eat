import { describe, expect, it, vi } from "vitest";
import {
  createSearchOptions,
  enrichSearchResults,
  sortSearchResults,
  withFavoriteStatus,
} from "./searchModel.js";

describe("餐廳搜尋模型", () => {
  describe("建立搜尋選項", () => {
    it("removes duplicate and empty values", () => {
      const companies = [
        { city: "台北市" },
        { city: "台中市" },
        { city: "台北市" },
        { city: "" },
        {},
      ];

      expect(createSearchOptions(companies, "city")).toEqual([
        { label: "台北市", value: "台北市" },
        { label: "台中市", value: "台中市" },
      ]);
    });
  });

  describe("排序搜尋結果", () => {
    const results = [
      { companyId: "company-a", totalStar: 3 },
      { companyId: "company-b", totalStar: 5 },
      { companyId: "company-c", totalStar: 5 },
    ];

    it("sorts restaurants by rating without mutating the source array", () => {
      const sorted = sortSearchResults(results);

      expect(sorted.map(({ companyId }) => companyId)).toEqual([
        "company-b",
        "company-c",
        "company-a",
      ]);
      expect(results.map(({ companyId }) => companyId)).toEqual([
        "company-a",
        "company-b",
        "company-c",
      ]);
    });

    it("can use company id as the tie breaker", () => {
      const sorted = sortSearchResults(results, true);

      expect(sorted.map(({ companyId }) => companyId)).toEqual([
        "company-c",
        "company-b",
        "company-a",
      ]);
    });
  });

  describe("收藏狀態", () => {
    it("adds a favorite status without mutating the search result", () => {
      const result = { companyId: "company-a", name: "測試餐廳" };

      expect(withFavoriteStatus(result, "like")).toEqual({
        ...result,
        status: "like",
      });
      expect(result).not.toHaveProperty("status");
    });

    it("loads and combines the status for every search result", async () => {
      const loadFavoriteStatus = vi
        .fn()
        .mockResolvedValueOnce("like")
        .mockResolvedValueOnce("");
      const results = [{ companyId: "company-a" }, { companyId: "company-b" }];

      await expect(
        enrichSearchResults(results, loadFavoriteStatus),
      ).resolves.toEqual([
        { companyId: "company-a", status: "like" },
        { companyId: "company-b", status: "" },
      ]);
      expect(loadFavoriteStatus).toHaveBeenNthCalledWith(1, "company-a");
      expect(loadFavoriteStatus).toHaveBeenNthCalledWith(2, "company-b");
    });
  });
});
