import { create } from "zustand";
import {
  INITIAL_COMPANY_FORM,
  INITIAL_USER_FORM,
  SIGNUP_STEPS,
} from "../pages/SignUp/signupConstants.js";

const initialSignupState = {
  activeStep: SIGNUP_STEPS.ROLE,
  role: "",
  userForm: { ...INITIAL_USER_FORM },
  companyForm: { ...INITIAL_COMPANY_FORM },
};

const useSignupStore = create((set) => ({
  ...initialSignupState,
  setActiveStep: (activeStep) => set({ activeStep }),
  setRole: (role) => set({ role }),
  updateUserForm: (field, value) =>
    set((state) => ({ userForm: { ...state.userForm, [field]: value } })),
  updateCompanyForm: (field, value) =>
    set((state) => ({
      companyForm: { ...state.companyForm, [field]: value },
    })),
  resetSignup: () =>
    set({
      ...initialSignupState,
      userForm: { ...INITIAL_USER_FORM },
      companyForm: { ...INITIAL_COMPANY_FORM },
    }),
}));

export default useSignupStore;
