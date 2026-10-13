import { useLoadScript } from "@react-google-maps/api";
import toast from "react-hot-toast";
import { geocodeAddress } from "../../services/maps/geocodingService.js";
import { createCompany } from "../../services/repositories/companyRepository.js";
import { saveUser } from "../../services/repositories/userRepository.js";
import { uploadImage } from "../../services/storage/imageStorage.js";
import useSignupStore from "../../stores/signupStore.js";
import useUserStore from "../../stores/userStore.js";
import { getCompanyAddress, isBossFormComplete } from "./bossRegistration.js";
import { SIGNUP_STEPS } from "../../constants/signup.js";

function useBossRegistration() {
  useLoadScript({ googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY });

  const userId = useUserStore((state) => state.userId);
  const setDetailInfo = useUserStore((state) => state.setDetailInfo);
  const setCompanyInfo = useUserStore((state) => state.setCompanyInfo);
  const userForm = useSignupStore((state) => state.userForm);
  const companyForm = useSignupStore((state) => state.companyForm);
  const updateUserForm = useSignupStore((state) => state.updateUserForm);
  const updateCompanyForm = useSignupStore((state) => state.updateCompanyForm);
  const setActiveStep = useSignupStore((state) => state.setActiveStep);

  function updateUserField(event) {
    const { name, value } = event.target;
    updateUserForm(name, value);
  }

  function updateCompanyField(event) {
    const { name, value } = event.target;
    updateCompanyForm(name === "telephone" ? "phone" : name, value);
  }

  async function uploadProfilePicture(file) {
    const downloadUrl = await uploadImage(userId, file);
    updateUserForm("picture", downloadUrl);
  }

  async function submitBossRegistration() {
    if (!isBossFormComplete(userForm, companyForm)) {
      toast.error("請填寫完整資訊");
      return;
    }

    const coordinates = await geocodeAddress(getCompanyAddress(companyForm));
    if (!coordinates) {
      toast.error("請確認地址已填寫且地址正確");
      return;
    }

    const companyInfo = { ...companyForm, ...coordinates };
    const companyId = await createCompany(companyInfo);
    const userInfo = { ...userForm, companyId };

    setCompanyInfo(companyInfo);
    setDetailInfo(userInfo);
    await saveUser(userId, userInfo);
    setActiveStep(SIGNUP_STEPS.BOSS_COMPLETE);
  }

  return {
    companyForm,
    submitBossRegistration,
    updateCompanyField,
    updateCompanyForm,
    updateUserField,
    uploadProfilePicture,
    userForm,
  };
}

export default useBossRegistration;
