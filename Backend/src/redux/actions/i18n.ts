export const SET_LNG: string = "SET_LNG";
export const RELOAD_LNG: string = "RELOAD_LNG";

export type SetLngAction = {
  type: typeof SET_LNG;
  lng: "en" | "de";
};

export type ReloadLngAction = {
  type: typeof RELOAD_LNG;
};

export const setLng = (lng: "en" | "de"): SetLngAction => ({
  type: SET_LNG,
  lng,
});

export const reloadLng = (): ReloadLngAction => ({
  type: RELOAD_LNG,
});
