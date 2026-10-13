import { signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/firebase/firebaseClient.js";
import useTestStore from "../../stores/testStore.js";
import useUserStore from "../../stores/userStore.js";

function useHeaderNavigation() {
  const navigate = useNavigate();
  const setIsLogout = useUserStore((state) => state.setIsLogout);
  const setLoginIdentity = useTestStore((state) => state.setLoginIdentity);
  const setTestAccount = useTestStore((state) => state.setTestAccount);
  const setTestPassword = useTestStore((state) => state.setTestPassword);

  async function selectNavigationItem(item) {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (item.action === "logout") {
      await signOut(auth);
      setIsLogout();
      setLoginIdentity("");
      setTestAccount("");
      setTestPassword("");
      toast.success("登出成功");
    }

    navigate(item.to);
  }

  return selectNavigationItem;
}

export default useHeaderNavigation;
