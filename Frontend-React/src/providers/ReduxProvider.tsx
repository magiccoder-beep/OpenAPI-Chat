"use client";

import { Provider } from "react-redux";
import { store } from "@/redux";

type Props = {
  children: React.ReactNode;
};

const ReduxProvider: React.FC<Props> = ({ children }: Props) => (
  <Provider store={store}>{children}</Provider>
);

export default ReduxProvider;
