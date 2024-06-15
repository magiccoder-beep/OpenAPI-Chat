"use client";

import { NextPage } from "next";
import { useLayoutEffect, useState } from "react";
import Flag from "react-country-flag";
import { i18nActions, useAppDispatch, useAppSelector } from "@/redux";
import { i18n } from "@/lng/logic";

type Props = {};

const Language: NextPage<Props> = (props: Props) => {
  const dispatch = useAppDispatch();
  const { data: translation } = useAppSelector((state) => state.i18n);
  const [text, setText] = useState<{
    DE: string;
    EN: string;
  }>({
    DE: "",
    EN: "",
  });

  useLayoutEffect(() => {
    setText({
      DE: i18n(translation, "languages", "DE"),
      EN: i18n(translation, "languages", "EN"),
    });
  }, [translation]);

  return (
    <div className="flex-1 bg-inherit h-screen">
      <div className="flex flex-col items-center justify-around w-full h-1/4 mt-4 lg:mt-8">
        <button
          type="button"
          className="w-3/4 lg:w-1/2 xl:w-2/6 px-8 p-4 flex justify-start items-center rounded-2xl bg-secondary hover:bg-[#158c78]"
          onClick={() => dispatch(i18nActions.setLng("de"))}
        >
          <Flag
            countryCode="DE"
            svg
            style={{
              width: "32px",
              height: "32px",
            }}
            title="US"
          />
          <span className="text-white font-MathJaxRegular font-semibold w-full">
            {text.DE}
          </span>
        </button>
        <button
          type="button"
          className="w-3/4 lg:w-1/2 xl:w-2/6 px-8 p-4 flex justify-start items-center rounded-2xl bg-secondary hover:bg-[#158c78]"
          onClick={() => dispatch(i18nActions.setLng("en"))}
        >
          <Flag
            countryCode="GB"
            svg
            style={{
              width: "32px",
              height: "32px",
            }}
            title="US"
          />
          <span className="text-white font-MathJaxRegular font-semibold w-full">
            {text.EN}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Language;
