function getHeaderNavigation(loginStatus, { companyId, userId }) {
  const navigationByStatus = {
    SignUp: [{ label: "回到首頁", to: "/" }],
    LogOut: [
      { label: "登入", to: "/login" },
      { label: "註冊", to: "/signup" },
    ],
    DinerLogIn: [
      { label: "食客專區", to: `/diner/dinerInfo/${userId}` },
      { action: "logout", label: "登出", to: "/" },
    ],
    BossLogIn: [
      { label: "業者專區", to: `/boss/bossInfo/${companyId}` },
      { action: "logout", label: "登出", to: "/" },
    ],
  };

  return navigationByStatus[loginStatus] ?? [];
}

export { getHeaderNavigation };
