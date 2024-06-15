"use client";

import {
  SET_USER_LOADING,
  SET_USER,
  RESET_USER,
  SET_TUTORIAL_SEEN,
  UPDATE_LAST_ACTIVITY,
  SET_IS_PHONE,
} from "@/redux/actions/users";
import { getState, saveState, deleteState } from "@/util";

export type SetUserAction = {
  admin: boolean;
  name: string;
  studies: string;
};

export type SetIsLoadingAction = {
  loading: boolean;
};

export type SetIsPhoneAction = {
  isPhone: boolean;
};

export type SetTutorialSeenAction = {
  seen: boolean;
};

type UserState = {
  loading: boolean;
  isPhone: boolean;
  user: {
    loggedIn: boolean;
    admin: boolean;
    name: string;
    studies: string;
  };
  tutorialSeen: boolean;
  lastActivity: number;
};

const initialState: UserState = ({
  ...getState("user"),
  loading: true,
} as UserState) || {
  loading: true,
  isPhone: true,
  user: {
    loggedIn: false,
    admin: false,
    name: "",
    studies: "OTHER",
  },
  tutorialSeen: false,
  lastActivity: Date.now(),
};

const usersReducer = (
  state: UserState = initialState,
  action: any
): UserState => {
  switch (action.type) {
    case SET_USER_LOADING:
      const setIsLoadingAction = action as SetIsLoadingAction;
      saveState("user", { ...state, isPhone: setIsLoadingAction.loading });
      return {
        ...state,
        loading: setIsLoadingAction.loading,
      };
    case SET_USER:
      const setUserAction = action as SetUserAction;
      saveState("user", {
        ...state,
        user: {
          loggedIn: true,
          admin: setUserAction.admin,
          name: setUserAction.name,
          studies: setUserAction.studies,
        },
      });
      return {
        ...state,
        user: {
          loggedIn: true,
          admin: setUserAction.admin,
          name: setUserAction.name,
          studies: setUserAction.studies,
        },
      };
    case SET_IS_PHONE:
      const setIsPhoneAction = action as SetIsPhoneAction;
      saveState("user", { ...state, isPhone: setIsPhoneAction.isPhone });
      return {
        ...state,
        isPhone: setIsPhoneAction.isPhone,
      };
    case SET_TUTORIAL_SEEN:
      const setTutorialSeenAction = action as SetTutorialSeenAction;
      saveState("user", { ...state, tutorialSeen: setTutorialSeenAction.seen });
      return {
        ...state,
        tutorialSeen: setTutorialSeenAction.seen,
      };
    case UPDATE_LAST_ACTIVITY:
      saveState("user", { ...state, lastActivity: Date.now() });
      return {
        ...state,
        lastActivity: Date.now(),
      };
    case RESET_USER:
      deleteState("user");
      return {
        ...state,
        user: {
          loggedIn: false,
          admin: false,
          name: "",
          studies: "OTHER",
        },
        tutorialSeen: false,
      };
    default:
      return state;
  }
};

export default usersReducer;
