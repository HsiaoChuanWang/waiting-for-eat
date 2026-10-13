import { signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../services/firebase/firebaseClient.js";
import useHeaderStore from "../../stores/headerStore.js";
import useTestStore from "../../stores/testStore.js";
import useUserStore from "../../stores/userStore.js";
import Alert from "../Alert/index.jsx";
import logo from "./logo.png";

function Header() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const setIsLogout = useUserStore((state) => state.setIsLogout);
  const setLoginIdentity = useTestStore((state) => state.setLoginIdentity);
  const setTestAccount = useTestStore((state) => state.setTestAccount);
  const setTestPassword = useTestStore((state) => state.setTestPassword);
  const userId = useUserStore((state) => state.userId);
  const detailInfo = useUserStore((state) => state.detailInfo);
  const loginStatus = useHeaderStore((state) => state.loginStatus);
  const setHeader = useHeaderStore((state) => state.setHeader);

  useEffect(() => {
    if (userId) {
      const userSnap = onSnapshot(doc(db, "user", userId), (doc) => {
        const data = doc.data();
        setUserData(data);
      });
      return userSnap;
    }
  }, [userId]);

  function logOut() {
    signOut(auth).then(() => {
      setIsLogout();
      setLoginIdentity("");
      setTestAccount("");
      setTestPassword("");
      toast.success("登出成功");
      navigate("/");
    });
  }

  const buttonSignUp = [
    { link: "", displayText: "回到首頁", status: "LogOut" },
  ];

  const buttonLogOut = [
    { link: "login", displayText: "登入", status: "SignUp" },
    { link: "signup", displayText: "註冊", status: "SignUp" },
  ];

  const buttonDiner = [
    {
      link: `diner/dinerInfo/${userId}`,
      displayText: "食客專區",
      status: "DinerLogIn",
    },
    { link: "", displayText: "登出", status: "LogOut" },
  ];

  const buttonBoss = [
    {
      link: `boss/bossInfo/${detailInfo?.companyId}`,
      displayText: "業者專區",
      status: "BossLogIn",
    },
    { link: "", displayText: "登出", status: "LogOut" },
  ];

  const renderSwitch = () => {
    switch (loginStatus) {
      case "SignUp":
        return buttonSignUp.map((item) => (
          <button
            key={item.displayText}
            className="m-3 cursor-pointer text-lg font-medium text-gray-600 hover:text-[#ff6e06]"
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
              setHeader(item.status);
              navigate(`/${item.link}`);
            }}
          >
            {item.displayText}
          </button>
        ));

      case "LogOut":
        return buttonLogOut.map((item) => (
          <button
            key={item.displayText}
            className="m-3 cursor-pointer text-lg font-medium text-gray-600 hover:text-[#ff6e06]"
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
              setHeader(item.status);
              navigate(`/${item.link}`);
            }}
          >
            {item.displayText}
          </button>
        ));
      case "DinerLogIn":
        return buttonDiner.map((item) => (
          <div
            key={item.displayText}
            className="m-3 cursor-pointer text-lg font-medium text-gray-600 hover:text-[#ff6e06]"
            onClick={() => {
              if (item.displayText === "登出") {
                logOut();
              }
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
              setHeader(item.status);
              navigate(`/${item.link}`);
            }}
          >
            {item.displayText}
          </div>
        ));
      case "BossLogIn":
        return buttonBoss.map((item) => (
          <button
            key={item.displayText}
            className="m-3 cursor-pointer text-lg font-medium text-gray-600 hover:text-[#ff6e06]"
            onClick={() => {
              if (item.displayText === "登出") {
                logOut();
              }
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
              setHeader(item.status);
              navigate(`/${item.link}`);
            }}
          >
            {item.displayText}
          </button>
        ));
    }
  };

  return (
    <div className="sticky top-0 z-10 flex h-24 w-full items-center justify-between bg-white shadow-[0_0_4px_2px_rgba(0,0,0,0.16)]">
      <Alert />
      <Link to="/">
        <img src={logo} className="ml-16 h-24 w-auto phone:ml-4" />
      </Link>
      <div className="mr-16 flex phone:mr-4">{renderSwitch("LogOut")}</div>
    </div>
  );
}

export default Header;
