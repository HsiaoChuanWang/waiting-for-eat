import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  addDoc,
  deleteDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  createReview,
  deleteReview,
  hasReviewForOrder,
  updateCompanyRating,
  updateReview,
} from "./reviewRepository.js";
import { mapQuerySnapshot } from "../firebase/firestoreMappers.js";

vi.mock("firebase/firestore", () => ({
  addDoc: vi.fn(),
  collection: vi.fn((database, name) => ({ database, name })),
  deleteDoc: vi.fn(),
  doc: vi.fn((database, collectionName, id) => ({
    collectionName,
    database,
    id,
  })),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  onSnapshot: vi.fn(),
  query: vi.fn((...constraints) => constraints),
  serverTimestamp: vi.fn(() => "server-time"),
  updateDoc: vi.fn(),
  where: vi.fn((...parts) => parts),
}));

vi.mock("../firebase/firebaseClient.js", () => ({ db: { name: "database" } }));

vi.mock("../firebase/firestoreMappers.js", () => ({
  mapDocumentSnapshot: vi.fn(),
  mapQuerySnapshot: vi.fn(),
}));

describe("reviewRepository", () => {
  beforeEach(() => vi.clearAllMocks());

  it("reports whether an order already has a review", async () => {
    getDocs
      .mockResolvedValueOnce({ empty: false })
      .mockResolvedValueOnce({ empty: true });

    await expect(hasReviewForOrder("order-1")).resolves.toBe(true);
    await expect(hasReviewForOrder("order-2")).resolves.toBe(false);
  });

  it("calculates and stores the average company rating", async () => {
    getDocs.mockResolvedValue({ docs: [] });
    mapQuerySnapshot.mockReturnValue([{ star: 5 }, { star: 3 }]);

    await expect(updateCompanyRating("company-1")).resolves.toBe(4);
    expect(updateDoc).toHaveBeenCalledWith(
      expect.objectContaining({ collectionName: "company", id: "company-1" }),
      { totalStar: 4 },
    );
  });

  it("creates a review with a server timestamp and refreshes the rating", async () => {
    addDoc.mockResolvedValue({ id: "review-1" });
    getDocs.mockResolvedValue({ docs: [] });
    mapQuerySnapshot.mockReturnValue([{ star: 5 }]);
    const review = { companyId: "company-1", content: "好吃", star: 5 };

    await expect(createReview(review)).resolves.toBe("review-1");
    expect(serverTimestamp).toHaveBeenCalled();
    expect(addDoc).toHaveBeenCalledWith(expect.anything(), {
      ...review,
      createTime: "server-time",
    });
  });

  it("updates and deletes reviews before refreshing the company rating", async () => {
    getDocs.mockResolvedValue({ docs: [] });
    mapQuerySnapshot.mockReturnValue([]);

    await updateReview("review-1", "company-1", { content: "更新" });
    expect(updateDoc).toHaveBeenCalledWith(
      expect.objectContaining({ collectionName: "star", id: "review-1" }),
      { content: "更新" },
    );

    await deleteReview("review-1", "company-1");
    expect(deleteDoc).toHaveBeenCalledWith(
      expect.objectContaining({ collectionName: "star", id: "review-1" }),
    );
  });
});
