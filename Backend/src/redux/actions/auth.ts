export const REFRESHING_TOKEN: string = "REFRESHING_TOKEN";
export const SET_VALIDITY_TOKEN: string = "SET_VALIDITY_TOKEN";
export const UPDATE_REFRESH_TOKEN_TIME: string = "UPDATE_REFRESH_TOKEN_TIME";
export const RESET_AUTH: string = "RESET_AUTH";

export type UpdateRefreshTokenTimeAction = {
  type: typeof UPDATE_REFRESH_TOKEN_TIME;
};

export type RefreshingTokenAction = {
  type: typeof REFRESHING_TOKEN;
  promise: Promise<any>;
};

export type SetValidityTokenAction = {
  type: typeof SET_VALIDITY_TOKEN;
  valid_token: boolean;
};

export type ResetAuthAction = {
  type: typeof RESET_AUTH;
};

export const updateRefreshTokenTime = (): UpdateRefreshTokenTimeAction => ({
  type: UPDATE_REFRESH_TOKEN_TIME,
});

export const refreshingToken = (
  promise: Promise<any>
): RefreshingTokenAction => ({
  type: REFRESHING_TOKEN,
  promise,
});

export const setValidityToken = (
  valid_token: boolean
): SetValidityTokenAction => ({
  type: SET_VALIDITY_TOKEN,
  valid_token,
});

export const resetAuth = (): ResetAuthAction => ({
  type: RESET_AUTH,
});
