import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const useLoginStore = create(
  immer((set) => ({
    isQuickLoginOpen: true,

    setIsQuickLoginOpen: (status) => {
      set((state) => {
        state.isQuickLoginOpen = status;
      });
    },

    loginIdentity: "",
    setLoginIdentity: (identity) => {
      set((state) => {
        state.loginIdentity = identity;
      });
    },

    presetEmail: "",
    presetPassword: "",
    setPresetEmail: (email) => {
      set((state) => {
        state.presetEmail = email;
      });
    },

    setPresetPassword: (password) => {
      set((state) => {
        state.presetPassword = password;
      });
    },
  })),
);

export default useLoginStore;
