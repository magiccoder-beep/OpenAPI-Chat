"use client";

import Cookies from "js-cookie";
import { GetToken } from "@/server";
import { AppDispatch, authActions, RootState } from "@/redux";

export const getAccessToken = async (
  dispatch: AppDispatch,
  selector: RootState
) => {
  const { access_token_last_date: previousTime } = selector.auth;
  const diffTime: number = Math.abs(Date.now() - previousTime);
  const diffSeconds: number = Math.ceil(diffTime / 1000);
  const refreshToken = Cookies.get("REFRESH_TOKEN");
  if (!refreshToken) {
    const accessToken = Cookies.get("ACCESS_TOKEN");
    return accessToken ?? "";
  }
  if (diffSeconds > 600) {
    const accessToken = await GetToken(refreshToken);
    if (accessToken) {
      dispatch(authActions.updateRefreshTokenTime());
      Cookies.set("ACCESS_TOKEN", accessToken, {
        expires: 1 / 96,
        path: "/",
      });
      return accessToken;
    }
  } else {
    const accessToken = Cookies.get("ACCESS_TOKEN");
    return accessToken ?? "";
  }
  return "";
};
