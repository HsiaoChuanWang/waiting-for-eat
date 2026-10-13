import { beforeEach, describe, expect, it, vi } from "vitest";
import { doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import {
  FAVORITE_STATUS,
  getFavoriteStatus,
  saveEatenFavorite,
  updateFavoriteStatus,
} from "./favoriteRepository.js";
import { mapQuerySnapshot } from "../firebase/firestoreMappers.js";

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(() => "favorite-collection"),
  doc: vi.fn((database, collectionName, id) => ({
    collectionName,
    database,
    id,
  })),
  getDocs: vi.fn(),
  onSnapshot: vi.fn(),
  query: vi.fn((...constraints) => constraints),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  where: vi.fn((...parts) => parts),
}));

vi.mock("../firebase/firebaseClient.js", () => ({ db: { name: "database" } }));

vi.mock("../firebase/firestoreMappers.js", () => ({
  mapQuerySnapshot: vi.fn(),
}));

describe("favoriteRepository", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns the stored favorite status or an empty status", async () => {
    getDocs.mockResolvedValue({ docs: [] });
    mapQuerySnapshot.mockReturnValueOnce([{ status: FAVORITE_STATUS.LIKE }]);
    await expect(getFavoriteStatus("company-1", "user-1")).resolves.toBe(
      FAVORITE_STATUS.LIKE,
    );

    mapQuerySnapshot.mockReturnValueOnce([]);
    await expect(getFavoriteStatus("company-1", "user-1")).resolves.toBe("");
  });

  it("updates only the selected favorite status", async () => {
    await updateFavoriteStatus("favorite-1", FAVORITE_STATUS.DISLIKE);

    expect(updateDoc).toHaveBeenCalledWith(
      expect.objectContaining({ id: "favorite-1" }),
      { status: FAVORITE_STATUS.DISLIKE },
    );
  });

  it("saves a completed order as an eaten favorite", async () => {
    await saveEatenFavorite({
      companyId: "company-1",
      orderId: "order-1",
      userId: "user-1",
    });

    expect(doc).toHaveBeenCalledWith(expect.anything(), "favorite", "order-1");
    expect(setDoc).toHaveBeenCalledWith(expect.anything(), {
      companyId: "company-1",
      orderId: "order-1",
      postId: "",
      status: FAVORITE_STATUS.EATEN,
      userId: "user-1",
    });
  });
});
