import toast from "react-hot-toast";
import { saveUser } from "../../../services/repositories/userRepository.js";
import { uploadImage } from "../../../services/storage/imageStorage.js";
import useSignupStore from "../../../stores/signupStore.js";
import useUserStore from "../../../stores/userStore.js";
import { isDinerFormComplete } from "../registration/dinerRegistration.js";
import { SIGNUP_STEPS } from "../../../constants/signup.js";

function useDinerRegistration() {
  const userId = useUserStore((state) => state.userId);
  const setDetailInfo = useUserStore((state) => state.setDetailInfo);
  const userForm = useSignupStore((state) => state.userForm);
  const updateUserForm = useSignupStore((state) => state.updateUserForm);
  const setActiveStep = useSignupStore((state) => state.setActiveStep);

  function updateField(event) {
    const { name, value } = event.target;
    updateUserForm(name, value);
  }

  async function uploadProfilePicture(file) {
    const downloadUrl = await uploadImage(userId, file);
    updateUserForm("picture", downloadUrl);
  }

  async function submitDinerRegistration() {
    if (!isDinerFormComplete(userForm)) {
      toast.error("請填寫完整資訊");
      return;
    }

    setDetailInfo(userForm);
    await saveUser(userId, userForm);
    setActiveStep(SIGNUP_STEPS.DINER_COMPLETE);
  }

  return {
    submitDinerRegistration,
    updateField,
    uploadProfilePicture,
    userForm,
  };
}

export default useDinerRegistration;
