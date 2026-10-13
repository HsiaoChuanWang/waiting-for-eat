import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const useSearchStore = create(
  immer((set) => ({
    searchArray: [],

    setSearchArray: (searchArray) => {
      set((state) => {
        state.searchArray = searchArray;
      });
    },
    updateFavoriteStatus: (favoriteId, status) => {
      set((state) => {
        const result = state.searchArray.find(
          (item) => item.favoriteId === favoriteId,
        );
        if (result) result.status = status;
      });
    },
  })),
);
export default useSearchStore;
