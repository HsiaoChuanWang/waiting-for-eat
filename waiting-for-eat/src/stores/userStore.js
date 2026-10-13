import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { db } from "../services/firebase/firebaseClient.js";
import {
  getCompanyInfoFromFirestore,
  getUserInfoFromFirestore,
} from "../utils/fireStore";

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
      async function sendfirestore(data) {
        await setDoc(doc(db, "user", userId), data);
      }
      sendfirestore(detailInfo);
    },

    getUserInfoFromFirestoreAndSave: (userId) => {
      return getUserInfoFromFirestore(userId).then((userInfo) => {
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

      async function sendfirestore(data) {
        const docRef = await addDoc(collection(db, "company"), data);
        const companyId = docRef.id;
        set((state) => {
          state.detailInfo.companyId = companyId;
        });
        sendUserInfoToFirestore();
      }
      sendfirestore(companyInfo);
    },

    getCompanyInfoFromFirestoreAndSave: (companyId) => {
      getCompanyInfoFromFirestore(companyId).then((companyInfo) => {
        set((state) => {
          state.companyInfo = companyInfo;
        });
      });
    },
  })),
);

export default useUserStore;
