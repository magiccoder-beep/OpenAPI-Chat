"use client";

import { NextPage } from "next";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux";
import { i18n } from "@/lng/logic";
import { Modal } from "@/components";
import constants from "@/constants/general";
import { DeleteAccount } from "@/server";
import { getAccessToken, logout } from "@/helper";

type Props = {};

const Profile: NextPage<Props> = (props: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const selector = useAppSelector((state) => state);
  const { data: translation } = selector.i18n;
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [text, setText] = useState<{
    deleteAccount: string;
    wantToDelete: string;
    waitTitle: string;
    cancel: string;
    delete: string;
    chooseLanguage: string;
    privacyPolicy: string;
  }>({
    deleteAccount: "",
    wantToDelete: "",
    waitTitle: "",
    cancel: "",
    delete: "",
    chooseLanguage: "",
    privacyPolicy: "",
  });

  useLayoutEffect(() => {
    setText({
      deleteAccount: i18n(translation, "account", "deleteAccount"),
      wantToDelete: i18n(translation, "account", "wantToDelete"),
      waitTitle: i18n(translation, "phoneRegistration", "waitTitle"),
      cancel: i18n(translation, "general", "cancel"),
      delete: i18n(translation, "general", "delete"),
      chooseLanguage: i18n(translation, "drawer", "chooseLanguage"),
      privacyPolicy: i18n(translation, "account", "privacyPolicy"),
    });
  }, [translation]);

  const handleDeleteAccount = async () => {
    const token: string = await getAccessToken(dispatch, selector);
    const res: boolean = await DeleteAccount(token);
    if (res) {
      logout(router, dispatch);
    }
  };

  return (
    <div className="flex-1 bg-inherit">
      <Modal
        theme="light"
        showModal={showDialog}
        title={text.deleteAccount}
        description={text.wantToDelete}
        submitButtonText={text.delete}
        submitHandler={handleDeleteAccount}
        closeButtonText={text.cancel}
        closeHandler={() => setShowDialog(false)}
      />
      <div className="flex flex-col w-full">
        <div className="w-full p-4 border-b border-b-gray-600 hover:bg-black transition-all duration-500 ease-in-out hover:bg-opacity-5">
          <Link
            href={`${constants.urlBase}/privacyPolicy`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-MathJaxRegular text-lg capitalize font-semibold no-underline"
          >
            {text.privacyPolicy}
          </Link>
        </div>
        <div className="w-full p-4 border-b border-b-gray-600 hover:bg-black transition-all duration-500 ease-in-out hover:bg-opacity-5">
          <button
            type="button"
            onClick={() => setShowDialog(true)}
            className="font-MathJaxRegular text-lg text-left capitalize font-semibold"
          >
            {text.deleteAccount}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
