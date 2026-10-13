import { ConfigProvider } from "antd";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useHeaderStore from "../src/stores/headerStore.js";
import useUserStore from "../src/stores/userStore.js";
import Header from "./components/Header";
import { auth } from "./services/firebase/firebaseClient.js";
// import RwdWarning from "./components/RwdWarning";

function App() {
  const setUserId = useUserStore((state) => state.setUserId);
  const getUserInfoFromFirestoreAndSave = useUserStore(
    (state) => state.getUserInfoFromFirestoreAndSave,
  );
  const getCompanyInfoFromFirestoreAndSave = useUserStore(
    (state) => state.getCompanyInfoFromFirestoreAndSave,
  );
  const setHeader = useHeaderStore((state) => state.setHeader);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const pathParts = location.pathname.split("/");
    const firstParam = pathParts[1];
    const thirdParam = pathParts[3];

    onAuthStateChanged(auth, (user) => {
      if (user === null) {
        setHeader("LogOut");
        const logOutCannotEnterPath = ["reserve", "diner", "boss"];
        if (logOutCannotEnterPath.some((path) => firstParam?.includes(path))) {
          navigate("/");
        }
      }

      if (user) {
        const user = auth.currentUser;
        const userId = user.uid;

        firstParam === "signup"
          ? setHeader("SignUp")
          : Promise.all([
              setUserId(userId),
              getUserInfoFromFirestoreAndSave(userId),
            ]).then(([_, userInfo]) => {
              if (userInfo.companyId === "") {
                setHeader("DinerLogIn");
                firstParam?.includes("boss") && navigate("/");

                if (thirdParam) {
                  !thirdParam.includes(userId) && navigate("/");
                }
              } else if (userInfo.companyId !== "") {
                setHeader("BossLogIn");
                getCompanyInfoFromFirestoreAndSave(userInfo.companyId);

                !thirdParam?.includes(userInfo.companyId) &&
                  navigate(`/boss/bossInfo/${userInfo.companyId}`);
              }
            });
      }
    });
  }, [location.pathname]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#ff850e",
          algorithm: true,
        },
        components: {
          Menu: {
            colorPrimary: "#ff850e",
            itemBg: "#e5e7eb",
            subMenuItemBg: "#f3f4f6",
            algorithm: true,
          },
        },
      }}
    >
      <Header />
      {/* <RwdWarning /> */}
      <Outlet />
    </ConfigProvider>
  );
}

export default App;
