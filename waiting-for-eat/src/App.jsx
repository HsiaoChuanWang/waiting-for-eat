import { ConfigProvider } from "antd";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header";
import useAuthSession from "./hooks/useAuthSession.js";
import useHeaderStatus from "./hooks/useHeaderStatus.js";
import { useRouteAccessGuard } from "./router/useRouteAccessGuard.js";
// import RwdWarning from "./components/RwdWarning";

function App() {
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const firstParam = pathParts[1];
  const session = useAuthSession({
    loadProfile: firstParam !== "signup",
  });

  useRouteAccessGuard(session);
  useHeaderStatus({ ...session, isSignupRoute: firstParam === "signup" });

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
