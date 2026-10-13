import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PROTECTED_ROUTE_PREFIXES = ["reserve", "diner", "boss"];

function getRouteRedirect({ isLoading, pathname, user, userInfo }) {
  if (isLoading) return null;

  const pathParts = pathname.split("/");
  const firstParam = pathParts[1];
  const thirdParam = pathParts[3];

  if (!user) {
    const isProtectedRoute = PROTECTED_ROUTE_PREFIXES.some((path) =>
      firstParam?.includes(path),
    );

    return isProtectedRoute ? "/" : null;
  }

  if (firstParam === "signup" || !userInfo) return null;

  if (userInfo.companyId === "") {
    if (firstParam?.includes("boss")) return "/";
    if (thirdParam && !thirdParam.includes(user.uid)) return "/";
    return null;
  }

  if (!thirdParam?.includes(userInfo.companyId)) {
    return `/boss/bossInfo/${userInfo.companyId}`;
  }

  return null;
}

function useRouteAccessGuard(session) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const redirectTo = getRouteRedirect({
      ...session,
      pathname: location.pathname,
    });

    if (redirectTo) navigate(redirectTo);
  }, [location.pathname, navigate, session]);
}

export { getRouteRedirect, useRouteAccessGuard };
