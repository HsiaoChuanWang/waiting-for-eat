import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const useUserStore = create(
  immer((set) => ({
    setIsLogout: () => {
      set((state) => {
        state.userId = "";
      });
      set((state) => {
        state.detailInfo = {
          userName: "",
          address: "",
          companyId: "",
          gender: "",
          phone: "",
          picture: "",
          status: "active",
        };
      });
      set((state) => {
        state.companyInfo = {
          name: "",
          city: "",
          district: "",
          address: "",
          lat: "",
          lng: "",
          phone: "",
          category: "",
          picture: "",
          totalStar: 0,
          menu: [],
        };
      });
    },

    userId: "",

    detailInfo: {
      userName: "",
      address: "",
      companyId: "",
      gender: "",
      phone: "",
      picture: "",
      status: "active",
    },

    companyInfo: {
      name: "",
      city: "",
      district: "",
      address: "",
      lat: "",
      lng: "",
      phone: "",
      category: "",
      picture: "",
      totalStar: 0,
      menu: [],
    },

    setUserId: (userId) => {
      set((state) => {
        state.userId = userId;
      });
    },

    setDetailInfo: (data) => {
      set((state) => {
        state.detailInfo = data;
      });
    },

    setCompanyInfo: (data) => {
      set((state) => {
        state.companyInfo = data;
      });
    },
  })),
);

export default useUserStore;
