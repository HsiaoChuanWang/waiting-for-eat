import { describe, expect, it } from "vitest";
import { getRouteRedirect } from "./useRouteAccessGuard.js";

const diner = { uid: "diner-1" };
const dinerInfo = { companyId: "" };
const boss = { uid: "boss-1" };
const bossInfo = { companyId: "company-1" };

describe("getRouteRedirect", () => {
  it("does not redirect while authentication is loading", () => {
    expect(
      getRouteRedirect({
        isLoading: true,
        pathname: "/diner/dinerInfo/diner-1",
        user: null,
        userInfo: null,
      }),
    ).toBeNull();
  });

  it.each([
    "/reserve/company-1",
    "/diner/dinerInfo/diner-1",
    "/boss/bossInfo/company-1",
  ])(
    "redirects a signed-out visitor away from protected route %s",
    (pathname) => {
      expect(
        getRouteRedirect({
          isLoading: false,
          pathname,
          user: null,
          userInfo: null,
        }),
      ).toBe("/");
    },
  );

  it("allows a signed-out visitor to browse public routes", () => {
    expect(
      getRouteRedirect({
        isLoading: false,
        pathname: "/restaurant/company-1",
        user: null,
        userInfo: null,
      }),
    ).toBeNull();
  });

  it("does not redirect before the signed-in user profile is available", () => {
    expect(
      getRouteRedirect({
        isLoading: false,
        pathname: "/signup",
        user: diner,
        userInfo: null,
      }),
    ).toBeNull();
  });

  it("redirects diners away from the boss dashboard", () => {
    expect(
      getRouteRedirect({
        isLoading: false,
        pathname: "/boss/bossInfo/company-1",
        user: diner,
        userInfo: dinerInfo,
      }),
    ).toBe("/");
  });

  it("allows diners to access their own dashboard", () => {
    expect(
      getRouteRedirect({
        isLoading: false,
        pathname: "/diner/dinerInfo/diner-1",
        user: diner,
        userInfo: dinerInfo,
      }),
    ).toBeNull();
  });

  it("redirects diners away from another user's dashboard", () => {
    expect(
      getRouteRedirect({
        isLoading: false,
        pathname: "/diner/dinerInfo/diner-2",
        user: diner,
        userInfo: dinerInfo,
      }),
    ).toBe("/");
  });

  it("redirects bosses to their own company dashboard", () => {
    expect(
      getRouteRedirect({
        isLoading: false,
        pathname: "/boss/bossInfo/company-2",
        user: boss,
        userInfo: bossInfo,
      }),
    ).toBe("/boss/bossInfo/company-1");
  });

  it("allows bosses to access their own company dashboard", () => {
    expect(
      getRouteRedirect({
        isLoading: false,
        pathname: "/boss/schedule/company-1",
        user: boss,
        userInfo: bossInfo,
      }),
    ).toBeNull();
  });
});
