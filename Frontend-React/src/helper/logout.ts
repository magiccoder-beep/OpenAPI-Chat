"use client";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Cookies from "js-cookie";
import { AppDispatch, authActions, pharmazingActions, userActions } from "@/redux";
import { deleteState } from "@/util";

export const logout = (router: AppRouterInstance, dispatch: AppDispatch) => {
  Cookies.remove("ACCESS_TOKEN");
  Cookies.remove("REFRESH_TOKEN");
  dispatch(userActions.resetUser());
  dispatch(authActions.resetAuth());
  dispatch(pharmazingActions.resetMessages());
  dispatch(pharmazingActions.resetUser());
  deleteState("auth");
  deleteState("user");
  deleteState("ai");
  router.replace("/");
};
