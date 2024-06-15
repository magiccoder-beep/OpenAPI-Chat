"use client";

import {
  REFRESHING_TOKEN,
  SET_VALIDITY_TOKEN,
  UPDATE_REFRESH_TOKEN_TIME,
  RESET_AUTH,
} from "@/redux/actions/auth";
import { deleteState, getState, saveState } from "@/util";

export type AuthState = {
  valid_token: boolean;
  access_token_last_date: number;
  refreshTokenPromise: boolean | Promise<any>;
};

const initialState: AuthState = (getState("auth") as AuthState) || {
  valid_token: false,
  access_token_last_date: Date.now(),
  refreshTokenPromise: false,
};

const authReducer = (
  state: AuthState = initialState,
  action: any
): AuthState => {
  switch (action.type) {
    case REFRESHING_TOKEN:
      saveState("auth", { ...state, refreshTokenPromise: action.promise });
      return { ...state, refreshTokenPromise: action.promise };
    case SET_VALIDITY_TOKEN:
      saveState("auth", { ...state, valid_token: action.valid_token });
      return { ...state, valid_token: action.valid_token };
    case UPDATE_REFRESH_TOKEN_TIME:
      saveState("auth", { ...state, access_token_last_date: Date.now() });
      return { ...state, access_token_last_date: Date.now() };
    case RESET_AUTH:
      deleteState("auth");
      return initialState;
    default:
      return state;
  }
};

export default authReducer;
