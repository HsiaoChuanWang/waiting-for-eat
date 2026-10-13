import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../services/firebase/firebaseClient.js";
import { getCompanyById } from "../services/repositories/companyRepository.js";
import { getUserById } from "../services/repositories/userRepository.js";
import useUserStore from "../stores/userStore.js";

function useAuthSession({ loadProfile = true } = {}) {
  const [session, setSession] = useState({
    isLoading: true,
    user: null,
    userInfo: null,
  });
  const setIsLogout = useUserStore((state) => state.setIsLogout);
  const setUserId = useUserStore((state) => state.setUserId);
  const setDetailInfo = useUserStore((state) => state.setDetailInfo);
  const setCompanyInfo = useUserStore((state) => state.setCompanyInfo);

  useEffect(() => {
    let isActive = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsLogout();
        if (isActive) {
          setSession({ isLoading: false, user: null, userInfo: null });
        }
        return;
      }

      setUserId(user.uid);

      if (!loadProfile) {
        if (isActive) {
          setSession({ isLoading: false, user, userInfo: null });
        }
        return;
      }

      const userInfo = await getUserById(user.uid);
      if (!isActive) return;

      setDetailInfo(userInfo);

      if (userInfo.companyId) {
        const companyInfo = await getCompanyById(userInfo.companyId);
        if (!isActive) return;
        setCompanyInfo(companyInfo);
      }

      setSession({ isLoading: false, user, userInfo });
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, [loadProfile, setCompanyInfo, setDetailInfo, setIsLogout, setUserId]);

  return session;
}

export default useAuthSession;
