import { ConfigProvider } from "antd";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import useHeaderStore from "../src/stores/headerStore.js";
import Header from "./components/Header";
import useAuthSession from "./hooks/useAuthSession.js";
import { useRouteAccessGuard } from "./router/useRouteAccessGuard.js";
// import RwdWarning from "./components/RwdWarning";

function App() {
  const setHeader = useHeaderStore((state) => state.setHeader);
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const firstParam = pathParts[1];
  const session = useAuthSession({
    loadProfile: firstParam !== "signup",
  });
  const { isLoading, user, userInfo } = session;

  useRouteAccessGuard(session);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      setHeader("LogOut");
      return;
    }

    if (firstParam === "signup") {
      setHeader("SignUp");
      return;
    }

    if (!userInfo) return;

    if (userInfo.companyId === "") {
      setHeader("DinerLogIn");
    } else {
      setHeader("BossLogIn");
    }
  }, [firstParam, isLoading, setHeader, user, userInfo]);

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
