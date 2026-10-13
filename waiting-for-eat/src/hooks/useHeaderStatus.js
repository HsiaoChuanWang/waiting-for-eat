import { useEffect } from "react";
import useHeaderStore from "../stores/headerStore.js";

function useHeaderStatus({ isLoading, isSignupRoute, user, userInfo }) {
  const setLoginStatus = useHeaderStore((state) => state.setLoginStatus);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      setLoginStatus("LogOut");
    } else if (isSignupRoute) {
      setLoginStatus("SignUp");
    } else if (userInfo?.companyId === "") {
      setLoginStatus("DinerLogIn");
    } else if (userInfo?.companyId) {
      setLoginStatus("BossLogIn");
    }
  }, [isLoading, isSignupRoute, setLoginStatus, user, userInfo]);
}

export default useHeaderStatus;
