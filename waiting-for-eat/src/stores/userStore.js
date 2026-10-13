import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  createCompany,
  getCompanyById,
} from "../services/repositories/companyRepository.js";
import {
  getUserById,
  saveUser,
} from "../services/repositories/userRepository.js";

const useUserStore = create(
  immer((set, get) => ({
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

    sendUserInfoToFirestore: () => {
      const detailInfo = get().detailInfo;
      const userId = get().userId;

      saveUser(userId, detailInfo);
    },

    getUserInfoFromFirestoreAndSave: (userId) => {
      return getUserById(userId).then((userInfo) => {
        set((state) => {
          state.detailInfo = userInfo;
        });
        return userInfo;
      });
    },

    setCompanyInfo: (data) => {
      set((state) => {
        state.companyInfo = data;
      });
    },

    sendCompanyInfoToFirestore: () => {
      const companyInfo = get().companyInfo;
      const sendUserInfoToFirestore = get().sendUserInfoToFirestore;

      async function sendToFirestore(data) {
        const companyId = await createCompany(data);
        set((state) => {
          state.detailInfo.companyId = companyId;
        });
        sendUserInfoToFirestore();
      }
      sendToFirestore(companyInfo);
    },

    getCompanyInfoFromFirestoreAndSave: (companyId) => {
      getCompanyById(companyId).then((companyInfo) => {
        set((state) => {
          state.companyInfo = companyInfo;
        });
      });
    },
  })),
);

export default useUserStore;
