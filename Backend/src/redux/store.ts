"use client";

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import { useStore, useDispatch, useSelector } from "react-redux";

import {
  usersReducer,
  authReducer,
  pharmazingReducer,
  i18nReducer,
} from "@/redux";

const rootReducer = combineReducers({
  users: usersReducer,
  auth: authReducer,
  pharmazing: pharmazingReducer,
  i18n: i18nReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
