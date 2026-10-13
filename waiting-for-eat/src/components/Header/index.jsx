import { Link } from "react-router-dom";
import useHeaderStore from "../../stores/headerStore.js";
import useUserStore from "../../stores/userStore.js";
import Alert from "../Alert/index.jsx";
import { getHeaderNavigation } from "./headerNavigation.js";
import logo from "./logo.png";
import useHeaderNavigation from "./useHeaderNavigation.js";

function Header() {
  const loginStatus = useHeaderStore((state) => state.loginStatus);
  const userId = useUserStore((state) => state.userId);
  const companyId = useUserStore((state) => state.detailInfo.companyId);
  const selectNavigationItem = useHeaderNavigation();
  const navigationItems = getHeaderNavigation(loginStatus, {
    companyId,
    userId,
  });

  return (
    <div className="sticky top-0 z-10 flex h-24 w-full items-center justify-between bg-white shadow-[0_0_4px_2px_rgba(0,0,0,0.16)]">
      <Alert />
      <Link to="/">
        <img
          src={logo}
          alt="Waiting for Eat 首頁"
          className="ml-16 h-24 w-auto phone:ml-4"
        />
      </Link>
      <div className="mr-16 flex phone:mr-4">
        {navigationItems.map((item) => (
          <button
            key={item.label}
            className="m-3 cursor-pointer text-lg font-medium text-gray-600 hover:text-[#ff6e06]"
            onClick={() => selectNavigationItem(item)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Header;
