import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmail,
  signInWithGoogle,
} from "../../../services/auth/authenticationService.js";
import { getUserById } from "../../../services/repositories/userRepository.js";
import useLoginStore from "../../../stores/loginStore.js";
import useUserStore from "../../../stores/userStore.js";

function useLoginFlow() {
  const navigate = useNavigate();
  const setLoginIdentity = useLoginStore((state) => state.setLoginIdentity);
  const setPresetEmail = useLoginStore((state) => state.setPresetEmail);
  const setPresetPassword = useLoginStore((state) => state.setPresetPassword);
  const setUserId = useUserStore((state) => state.setUserId);
  const setDetailInfo = useUserStore((state) => state.setDetailInfo);

  function clearLoginFormState() {
    setLoginIdentity("");
    setPresetEmail("");
    setPresetPassword("");
  }

  async function completeLogin(userCredential) {
    const user = userCredential.user;
    const userInfo = await getUserById(user.uid);

    setUserId(user.uid);
    setDetailInfo(userInfo);
    clearLoginFormState();
    toast.success("登入成功");

    if (userInfo.companyId === "") {
      navigate("/");
    } else {
      navigate(`/boss/bossInfo/${userInfo.companyId}`);
    }
  }

  async function runLogin(authenticate) {
    try {
      const userCredential = await authenticate();
      await completeLogin(userCredential);
    } catch {
      toast.error("請確認email及密碼是否輸入正確");
    }
  }

  function loginWithEmail(email, password) {
    return runLogin(() => signInWithEmail(email, password));
  }

  function loginWithGoogle() {
    return runLogin(signInWithGoogle);
  }

  return { loginWithEmail, loginWithGoogle };
}

export default useLoginFlow;
