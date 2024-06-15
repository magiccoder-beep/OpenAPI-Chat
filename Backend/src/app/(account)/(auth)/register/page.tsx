"use client";

import { useState, useLayoutEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppSelector } from "@/redux";
import { i18n } from "@/lng/logic";
import constants from "@/constants/general";
import { ActivityIndicator, Modal } from "@/components";
import { RegisterUser } from "@/server";
import { SendVerificationSMS } from "@/server";

type Props = {};

const Register: NextPage<Props> = (props: Props) => {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.users);
  const { data: translation, lng } = useAppSelector((state) => state.i18n);
  const [telephone, setTelephone] = useState<string>("+49");
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showDialogError, setShowDialogError] = useState<boolean>(false);
  const [showDialogRegistered, setShowDialogRegistered] =
    useState<boolean>(false);
  const [showDialogWait, setShowDialogWait] = useState<boolean>(false);
  const [hasSentSMS, setHasSentSMS] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [text, setText] = useState<{
    noValidPhoneNumber: string;
    enterValidPhone: string;
    errorOccured: string;
    errorOccuredDescription: string;
    alreadyRegistered: string;
    alreadyRegisteredDescription: string;
    waitTitle: string;
    waitDescription: string;
    myNumber: string;
    datenschutz: string;
    datenschutzLink1: string;
    datenschutz2: string;
    datenschutzLink2: string;
    datenschutz3: string;
    telephoneNumber: string;
    sendSecCode: string;
  }>({
    noValidPhoneNumber: "",
    enterValidPhone: "",
    errorOccured: "",
    errorOccuredDescription: "",
    alreadyRegistered: "",
    alreadyRegisteredDescription: "",
    waitTitle: "",
    waitDescription: "",
    myNumber: "",
    datenschutz: "",
    datenschutzLink1: "",
    datenschutz2: "",
    datenschutzLink2: "",
    datenschutz3: "",
    telephoneNumber: "",
    sendSecCode: "",
  });

  useLayoutEffect(() => {
    setText({
      noValidPhoneNumber: i18n(
        translation,
        "phoneRegistration",
        "noValidPhoneNumber"
      ),
      enterValidPhone: i18n(
        translation,
        "phoneRegistration",
        "enterValidPhone"
      ),
      errorOccured: i18n(translation, "phoneRegistration", "errorOccured"),
      errorOccuredDescription: i18n(
        translation,
        "phoneRegistration",
        "errorOccuredDescription"
      ),
      alreadyRegistered: i18n(
        translation,
        "phoneRegistration",
        "alreadyRegistered"
      ),
      alreadyRegisteredDescription: i18n(
        translation,
        "phoneRegistration",
        "alreadyRegisteredDescription"
      ),
      waitTitle: i18n(translation, "phoneRegistration", "waitTitle"),
      waitDescription: i18n(
        translation,
        "phoneRegistration",
        "waitDescription"
      ),
      myNumber: i18n(translation, "phoneRegistration", "myNumber"),
      datenschutz: i18n(translation, "phoneRegistration", "datenschutz"),
      datenschutzLink1: i18n(
        translation,
        "phoneRegistration",
        "datenschutzLink1"
      ),
      datenschutz2: i18n(translation, "phoneRegistration", "datenschutz2"),
      datenschutzLink2: i18n(
        translation,
        "phoneRegistration",
        "datenschutzLink2"
      ),
      datenschutz3: i18n(translation, "phoneRegistration", "datenschutz3"),
      telephoneNumber: i18n(
        translation,
        "phoneRegistration",
        "telephoneNumber"
      ),
      sendSecCode: i18n(translation, "phoneRegistration", "sendSecCode"),
    });
  }, [translation]);

  const onChangeTelephone = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputText: string = event.target.value;
    let newText: string = "";
    for (let i = 0; i < inputText.length; i++) {
      if (!isNaN(parseInt(inputText[i], 10))) {
        newText += inputText[i];
      }
    }
    if (newText.length > 3) {
      newText = newText.substring(0, 3) + " " + newText.substring(3);
    }
    if (newText.length > 7) {
      newText = newText.substring(0, 7) + " " + newText.substring(7);
    }
    setTelephone("+" + newText);
  };

  const validPhoneNumber = () => {
    const regex = /^\+[\d ]{7,}$/;
    return regex.test(telephone);
  };

  const registeredAction = async () => {
    setShowDialogRegistered(true);
  };

  const notRegisteredAction = async () => {
    const token = Math.floor(100000 + Math.random() * 900000);
    let tempTelephone = telephone.replace(/\s+/g, "");
    const res: boolean = await SendVerificationSMS(tempTelephone, token, lng);
    if (res) {
      setHasSentSMS(true);
      router.replace("/verify");
      sessionStorage.setItem("phoneNumber", tempTelephone);
      sessionStorage.setItem("token", token.toString());
      setTimeout(function () {
        setHasSentSMS(false);
      }, 12000);
    } else {
      setShowDialogError(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validPhoneNumber()) {
      if (hasSentSMS) {
        setShowDialogWait(true);
      } else {
        setIsSubmitting(true);
        const res: boolean = await RegisterUser(telephone.replace(/\s+/g, ""));
        if (res) {
          registeredAction();
        } else {
          notRegisteredAction();
        }
        setIsSubmitting(false);
      }
    } else {
      setShowDialog(true);
    }
  };

  if (user && user.loggedIn) {
    return;
  }

  return (
    <div className="flex flex-col justify-center bg-black items-center w-screen h-screen">
      <Modal
        showModal={showDialog}
        title={text.noValidPhoneNumber}
        description={text.enterValidPhone}
        submitButtonText="Ok"
        submitHandler={() => setShowDialog(false)}
      />
      <Modal
        showModal={showDialogError}
        title={text.errorOccured}
        description={text.errorOccuredDescription}
        submitButtonText="Ok"
        submitHandler={() => setShowDialogError(false)}
      />
      <Modal
        showModal={showDialogRegistered}
        title={text.alreadyRegistered}
        description={text.alreadyRegisteredDescription}
        submitButtonText="Ok"
        submitHandler={() => setShowDialogRegistered(false)}
      />
      <Modal
        showModal={showDialogWait}
        title={text.waitTitle}
        description={text.waitDescription}
        submitButtonText="Ok"
        submitHandler={() => setShowDialogWait(false)}
      />
      <div className="absolute top-5 left-5 md:top-10 md:left-10">
        <FontAwesomeIcon
          className="w-8 h-8 cursor-pointer"
          icon={faArrowLeft}
          color="#ffffff"
          onClick={() => router.replace("/auth")}
        />
      </div>
      <div className="flex flex-col w-[90%] md:w-[50%] lg:w-[30%] items-start text-white">
        <h1 className="font-fontBold text-4xl font-bold">{text.myNumber}</h1>
        <p className="mt-12 font-fontBold text-lg font-bold">
          {text.datenschutz}{" "}
          <Link
            href={`${constants.urlBase}/de/termsConditions`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {text.datenschutzLink1}
          </Link>
          {text.datenschutz2}{" "}
          <Link
            href={`${constants.urlBase}/de/privacyPolicy`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {text.datenschutzLink2}
          </Link>
          {text.datenschutz3}
        </p>
        <p className="mt-10 font-fontBold text-lg font-bold">
          {text.telephoneNumber}
        </p>
        <form className="mt-10 w-full" onSubmit={handleSubmit}>
          <input
            type="tel"
            value={telephone}
            onChange={onChangeTelephone}
            disabled={isSubmitting}
            className="bg-transparent border-secondary border-b caret-secondary px-1 pb-2 w-full"
            autoFocus
          />
          <br />
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 px-4 py-3 w-full rounded-custom bg-white hover:bg-gray-300 text-black font-fontBold font-bold text-lg"
          >
            <span>
              {isSubmitting ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <span>{text.sendSecCode}</span>
              )}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
