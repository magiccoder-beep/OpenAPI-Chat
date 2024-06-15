export const SET_USER_LOADING: string = "SET_USER_LOADING";
export const SET_USER: string = "SET_USER";
export const RESET_USER: string = "RESET_USER";
export const SET_TUTORIAL_SEEN: string = "SET_TUTORIAL_SEEN";
export const UPDATE_LAST_ACTIVITY: string = "UPDATE_LAST_ACTIVITY";
export const SET_IS_PHONE: string = "SET_IS_PHONE";

export type SetUserLoadingAction = {
  type: typeof SET_USER_LOADING;
  loading: boolean;
};

export type SetUserAction = {
  type: typeof SET_USER;
  admin: boolean;
  name: string;
  studies: string;
};

export type ResetUserAction = {
  type: typeof RESET_USER;
};

export type SetIsPhoneAction = {
  type: typeof SET_IS_PHONE;
  isPhone: boolean;
};

export type SetTutorialSeenAction = {
  type: typeof SET_TUTORIAL_SEEN;
  seen: boolean;
};

export type UpdateLastActivityAction = {
  type: typeof UPDATE_LAST_ACTIVITY;
};

export const setUserLoading = (loading: boolean): SetUserLoadingAction => ({
  type: SET_USER_LOADING,
  loading,
});

export const setUser = (
  admin: boolean,
  name: string,
  studies: string
): SetUserAction => ({
  type: SET_USER,
  admin,
  name,
  studies,
});

export const resetUser = (): ResetUserAction => ({
  type: RESET_USER,
});

export const setIsPhone = (isPhone: boolean): SetIsPhoneAction => ({
  type: SET_IS_PHONE,
  isPhone,
});

export const setTutorialSeen = (seen: boolean): SetTutorialSeenAction => ({
  type: SET_TUTORIAL_SEEN,
  seen,
});

export const updateLastActivity = (): UpdateLastActivityAction => ({
  type: UPDATE_LAST_ACTIVITY,
});
