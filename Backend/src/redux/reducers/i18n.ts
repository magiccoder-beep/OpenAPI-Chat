"use client";

import { SET_LNG, RELOAD_LNG } from "@/redux/actions/i18n";
import en from "@/lng/en.json";
import de from "@/lng/de.json";

export type I18nState = {
  lng: "en" | "de";
  data: any;
};

const initialState: I18nState = {
  lng: "de",
  data: de,
};

const i18nReducer = (
  state: I18nState = initialState,
  action: any
): I18nState => {
  switch (action.type) {
    case SET_LNG:
      const choosenLng: I18nState["lng"] = action.lng.toLowerCase();
      const tempLng: I18nState["data"] = choosenLng === "de" ? de : en;
      return { lng: choosenLng, data: tempLng };
    case RELOAD_LNG:
      const reloadLng: I18nState["lng"] =
        state.lng.toLowerCase() as I18nState["lng"];
      const reloadTempLng: I18nState["data"] = reloadLng === "de" ? de : en;
      return { lng: reloadLng, data: reloadTempLng };
    default:
      return state;
  }
};

export default i18nReducer;
