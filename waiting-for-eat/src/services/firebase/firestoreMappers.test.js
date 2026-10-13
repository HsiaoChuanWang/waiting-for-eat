import { describe, expect, it, vi } from "vitest";
import { mapDocumentSnapshot, mapQuerySnapshot } from "./firestoreMappers.js";

function createSnapshot({ data, exists = true, id = "document-1" }) {
  return {
    data: vi.fn(() => data),
    exists: vi.fn(() => exists),
    id,
  };
}

describe("Firestore 資料轉換工具", () => {
  describe("轉換單一文件快照", () => {
    it("returns undefined when the document does not exist", () => {
      const snapshot = createSnapshot({
        data: { name: "餐廳" },
        exists: false,
      });

      expect(mapDocumentSnapshot(snapshot, "companyId")).toBeUndefined();
      expect(snapshot.data).not.toHaveBeenCalled();
    });

    it("returns document data when no id field is requested", () => {
      const data = { name: "餐廳" };
      const snapshot = createSnapshot({ data });

      expect(mapDocumentSnapshot(snapshot)).toBe(data);
    });

    it("merges the document id into a requested field", () => {
      const data = { name: "餐廳" };
      const snapshot = createSnapshot({ data, id: "company-1" });

      expect(mapDocumentSnapshot(snapshot, "companyId")).toEqual({
        companyId: "company-1",
        name: "餐廳",
      });
      expect(data).toEqual({ name: "餐廳" });
    });
  });

  describe("轉換查詢快照", () => {
    it("maps every document and includes its id", () => {
      const querySnapshot = {
        docs: [
          createSnapshot({ data: { name: "餐廳 A" }, id: "company-a" }),
          createSnapshot({ data: { name: "餐廳 B" }, id: "company-b" }),
        ],
      };

      expect(mapQuerySnapshot(querySnapshot, "companyId")).toEqual([
        { companyId: "company-a", name: "餐廳 A" },
        { companyId: "company-b", name: "餐廳 B" },
      ]);
    });

    it("returns an empty array for an empty query snapshot", () => {
      expect(mapQuerySnapshot({ docs: [] }, "companyId")).toEqual([]);
    });
  });
});
