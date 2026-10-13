import { ConfigProvider } from "antd";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useHeaderStore from "../src/stores/headerStore.js";
import Header from "./components/Header";
import useAuthSession from "./hooks/useAuthSession.js";
// import RwdWarning from "./components/RwdWarning";

function App() {
  const setHeader = useHeaderStore((state) => state.setHeader);
  const navigate = useNavigate();
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const firstParam = pathParts[1];
  const thirdParam = pathParts[3];
  const { isLoading, user, userInfo } = useAuthSession({
    loadProfile: firstParam !== "signup",
  });

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      setHeader("LogOut");
      const logOutCannotEnterPath = ["reserve", "diner", "boss"];
      if (logOutCannotEnterPath.some((path) => firstParam?.includes(path))) {
        navigate("/");
      }
      return;
    }

    if (firstParam === "signup") {
      setHeader("SignUp");
      return;
    }

    if (!userInfo) return;

    if (userInfo.companyId === "") {
      setHeader("DinerLogIn");
      firstParam?.includes("boss") && navigate("/");

      if (thirdParam) {
        !thirdParam.includes(user.uid) && navigate("/");
      }
    } else {
      setHeader("BossLogIn");

      !thirdParam?.includes(userInfo.companyId) &&
        navigate(`/boss/bossInfo/${userInfo.companyId}`);
    }
  }, [firstParam, isLoading, navigate, setHeader, thirdParam, user, userInfo]);

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
