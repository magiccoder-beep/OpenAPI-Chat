"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppSelector } from "@/redux";
import { i18n } from "@/lng/logic";
import { ActivityIndicator, Modal } from "@/components";
import { SendVerificationSMS } from "@/server";

type Props = {};

const Verify: NextPage<Props> = (props: Props) => {
  const router = useRouter();
  const { data: translation, lng } = useAppSelector((state) => state.i18n);
  const [telephone, setTelephone] = useState<string>("");
  const [code, setCode] = useState<number>();
  const [token, setToken] = useState<number>();
  const [hasSentSMS, setHasSentSMS] = useState<boolean>(false);
  const [showDialogWait, setShowDialogWait] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [text, setText] = useState<{
    noValidVerification: string;
    noValidVerificationDescription: string;
    waitTitle: string;
    waitDescription: string;
    securityCode: string;
    continue: string;
    requestNewCode: string;
  }>({
    noValidVerification: "",
    noValidVerificationDescription: "",
    waitTitle: "",
    waitDescription: "",
    securityCode: "",
    continue: "",
    requestNewCode: "",
  });

  useLayoutEffect(() => {
    setText({
      noValidVerification: i18n(
        translation,
        "phoneRegistration",
        "noValidVerification"
      ),
      noValidVerificationDescription: i18n(
        translation,
        "phoneRegistration",
        "noValidVerificationDescription"
      ),
      waitTitle: i18n(translation, "phoneRegistration", "waitTitle"),
      waitDescription: i18n(
        translation,
        "phoneRegistration",
        "waitDescription"
      ),
      securityCode: i18n(translation, "general", "securityCode"),
      continue: i18n(translation, "general", "continue"),
      requestNewCode: i18n(translation, "general", "requestNewCode"),
    });
  }, [translation]);

  useEffect(() => {
    const savedToken = sessionStorage.getItem("token");
    const savedTelephone = sessionStorage.getItem("phoneNumber");
    if (savedToken && savedTelephone) {
      setToken(parseInt(savedToken));
      setTelephone(savedTelephone);
      setTimeout(() => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("phoneNumber");
      }, 1000);
    } else {
      router.replace("/register");
    }
  }, [router]);

  const onChangeCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text: string = event.target.value;
    if (text.length <= 6) {
      setCode(parseInt(text));
      if (parseInt(text) === token) {
        sessionStorage.setItem("phoneNumber", telephone);
        router.replace("/user-profile");
      }
    }
  };

  const newCode = async () => {
    if (!hasSentSMS) {
      const token = Math.floor(100000 + Math.random() * 900000);
      await SendVerificationSMS(telephone, token, lng);
      setToken(token);
      setHasSentSMS(true);
      setTimeout(function () {
        setHasSentSMS(false);
      }, 12000);
    } else {
      setShowDialogWait(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (code === token) {
      sessionStorage.setItem("phoneNumber", telephone);
      router.replace("/user-profile");
    } else {
      setShowDialog(true);
    }
    setIsSubmitting(false);
  };

  if (!token || !telephone) {
    return;
  }

  return (
    <div className="flex flex-col justify-center bg-black items-center w-screen h-screen">
      <Modal
        showModal={showDialog}
        title={text.noValidVerification}
        description={text.noValidVerificationDescription}
        submitButtonText="Ok"
        submitHandler={() => setShowDialog(false)}
      />
      <Modal
        showModal={showDialogWait}
        title={text.waitTitle}
        description={text.waitDescription}
        submitButtonText="Ok"
        submitHandler={() => setShowDialogWait(false)}
      />
      <div className="absolute top-10 left-10">
        <FontAwesomeIcon
          className="w-8 h-8 cursor-pointer"
          icon={faArrowLeft}
          color="#ffffff"
          onClick={() => router.replace("/register")}
        />
      </div>
      <div className="flex flex-col w-[90%] items-center text-white">
        <h1 className="font-fontBold text-4xl font-bold">
          {text.securityCode}
        </h1>
        <form className="mt-10" onSubmit={handleSubmit}>
          <input
            type="number"
            minLength={6}
            maxLength={6}
            value={code}
            onChange={onChangeCode}
            disabled={isSubmitting}
            className="bg-transparent border-secondary border-b caret-secondary p-1 text-2xl tracking-[10px] w-full"
            autoFocus
          />
          <br />
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full px-4 py-3 rounded-custom bg-secondary hover:bg-[#158c78] text-white font-fontBold font-bold text-lg"
          >
            <span>
              {isSubmitting ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <span>{text.continue}</span>
              )}
            </span>
          </button>
          <button
            type="button"
            onClick={newCode}
            className="mt-6 w-full px-4 py-3 rounded-custom bg-secondary hover:bg-[#158c78] text-white font-fontBold font-bold text-lg"
          >
            {text.requestNewCode}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verify;
