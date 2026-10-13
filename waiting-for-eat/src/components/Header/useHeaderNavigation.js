import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { signOutCurrentUser } from "../../services/auth/authenticationService.js";
import useLoginStore from "../../stores/loginStore.js";
import useUserStore from "../../stores/userStore.js";

function useHeaderNavigation() {
  const navigate = useNavigate();
  const setIsLogout = useUserStore((state) => state.setIsLogout);
  const setLoginIdentity = useLoginStore((state) => state.setLoginIdentity);
  const setPresetEmail = useLoginStore((state) => state.setPresetEmail);
  const setPresetPassword = useLoginStore((state) => state.setPresetPassword);

  async function selectNavigationItem(item) {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (item.action === "logout") {
      await signOutCurrentUser();
      setIsLogout();
      setLoginIdentity("");
      setPresetEmail("");
      setPresetPassword("");
      toast.success("登出成功");
    }

    navigate(item.to);
  }

  return selectNavigationItem;
}

export default useHeaderNavigation;
