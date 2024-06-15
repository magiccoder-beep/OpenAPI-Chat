"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import {
  faArrowLeft,
  faEyeSlash,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "js-cookie";
import {
  useAppSelector,
  useAppDispatch,
  userActions,
  authActions,
} from "@/redux";
import { i18n } from "@/lng/logic";
import { ActivityIndicator, Modal } from "@/components";
import { useDeviceDetection } from "@/hooks";
import { RegisterEmail } from "@/server";

type Props = {};

const UserInfo: NextPage<Props> = (props: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { device, os, country } = useDeviceDetection();
  const { data: translation } = useAppSelector((state) => state.i18n);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [dialogMessage, setDialogMessage] = useState<string>("");
  const [dialogTitle, setDialogTitle] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<{
    phoneNumber: string;
    university: string;
    studies: string;
    country: string;
    occupation: string;
  }>({
    phoneNumber: "",
    university: "",
    studies: "",
    country: "",
    occupation: "",
  });
  const [text, setText] = useState<{
    noValidName: string;
    noValidNameTitle: string;
    noValidLastName: string;
    noValidLastNameTitle: string;
    noValidEmail: string;
    noValidEmailTitle: string;
    noValidPassword: string;
    noValidPasswordTitle: string;
    EMAIL_TAKEN: string;
    ERROR_OCCURED: string;
    INVALID_PASSWORD: string;
    INVALID_EMAIL: string;
    errorOccured: string;
    registrationNotSuccess: string;
    name: string;
    lastName: string;
    email: string;
    password: string;
    register: string;
  }>({
    noValidName: "",
    noValidNameTitle: "",
    noValidLastName: "",
    noValidLastNameTitle: "",
    noValidEmail: "",
    noValidEmailTitle: "",
    noValidPassword: "",
    noValidPasswordTitle: "",
    EMAIL_TAKEN: "",
    ERROR_OCCURED: "",
    INVALID_PASSWORD: "",
    INVALID_EMAIL: "",
    errorOccured: "",
    registrationNotSuccess: "",
    name: "",
    lastName: "",
    email: "",
    password: "",
    register: "",
  });

  useLayoutEffect(() => {
    setText({
      noValidName: i18n(translation, "dialog", "noValidName"),
      noValidNameTitle: i18n(translation, "dialog", "noValidNameTitle"),
      noValidLastName: i18n(translation, "dialog", "noValidLastName"),
      noValidLastNameTitle: i18n(translation, "dialog", "noValidLastNameTitle"),
      noValidEmail: i18n(translation, "dialog", "noValidEmail"),
      noValidEmailTitle: i18n(translation, "dialog", "noValidEmailTitle"),
      noValidPassword: i18n(translation, "dialog", "noValidPassword"),
      noValidPasswordTitle: i18n(translation, "dialog", "noValidPasswordTitle"),
      EMAIL_TAKEN: i18n(translation, "dialog", "EMAIL_TAKEN"),
      ERROR_OCCURED: i18n(translation, "dialog", "ERROR_OCCURED"),
      INVALID_PASSWORD: i18n(translation, "dialog", "INVALID_PASSWORD"),
      INVALID_EMAIL: i18n(translation, "dialog", "INVALID_EMAIL"),
      errorOccured: i18n(translation, "dialog", "errorOccured"),
      registrationNotSuccess: i18n(
        translation,
        "dialog",
        "registrationNotSuccess"
      ),
      name: i18n(translation, "signup", "name"),
      lastName: i18n(translation, "signup", "lastName"),
      email: i18n(translation, "general", "email"),
      password: i18n(translation, "general", "password"),
      register: i18n(translation, "userInfo", "register"),
    });
  }, [translation]);

  useEffect(() => {
    const savedUserProfile = sessionStorage.getItem("userProfile");
    if (savedUserProfile) {
      const parsedJson = JSON.parse(savedUserProfile);
      setUserProfile(parsedJson);
      setTimeout(() => sessionStorage.removeItem("userProfile"), 1000);
    } else {
      router.replace("/user-profile");
    }
  }, [router]);

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputText: string = event.target.value;
    setName(inputText);
  };

  const onChangeLastName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputText: string = event.target.value;
    setLastName(inputText);
  };

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputText: string = event.target.value;
    setEmail(inputText);
  };

  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputText: string = event.target.value;
    setPassword(inputText);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const isValidEmail = () => {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const isValidName = () => {
    return name.length > 0;
  };
  const isValidLastName = () => {
    return lastName.length > 0;
  };

  const isValidPassword = () => {
    return password.length > 0;
  };

  const errorCodes: {
    EMAIL_TAKEN: string;
    ERROR_OCCURED: string;
    INVALID_PASSWORD: string;
    INVALID_EMAIL: string;
  } = {
    EMAIL_TAKEN: text.EMAIL_TAKEN,
    ERROR_OCCURED: text.ERROR_OCCURED,
    INVALID_PASSWORD: text.INVALID_PASSWORD,
    INVALID_EMAIL: text.INVALID_EMAIL,
  };

  const actionUponRegistration = (
    success: boolean,
    errorCode:
      | "EMAIL_TAKEN"
      | "ERROR_OCCURED"
      | "INVALID_PASSWORD"
      | "INVALID_EMAIL"
  ) => {
    if (success) {
      sessionStorage.setItem(
        "userData",
        JSON.stringify({
          phoneNumber: userProfile.phoneNumber,
          name: name,
          password: password,
          email: email,
          university: userProfile.university,
          studies: userProfile.studies,
          country: userProfile.country,
          occupation: userProfile.occupation,
        })
      );
      router.replace("/user-profile/loading");
    } else {
      let errorMessage: string = text.errorOccured;
      if (errorCode in errorCodes) {
        errorMessage = errorCodes[errorCode];
      }
      setDialogMessage(errorMessage);
      setDialogTitle(text.registrationNotSuccess);
      setShowDialog(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidName()) {
      setDialogMessage(text.noValidName);
      setDialogTitle(text.noValidNameTitle);
      setShowDialog(true);
    } else if (!isValidLastName()) {
      setDialogMessage(text.noValidLastName);
      setDialogTitle(text.noValidLastNameTitle);
      setShowDialog(true);
    } else if (!isValidEmail()) {
      setDialogMessage(text.noValidEmail);
      setDialogTitle(text.noValidEmailTitle);
      setShowDialog(true);
    } else if (!isValidPassword()) {
      setDialogMessage(text.noValidPassword);
      setDialogTitle(text.noValidPasswordTitle);
      setShowDialog(true);
    } else {
      setIsSubmitting(true);
      const res: {
        success: boolean;
        error_code?: any;
        admin?: boolean;
        accessToken?: string;
        refreshToken?: string;
      } = await RegisterEmail(
        email,
        password,
        userProfile.phoneNumber,
        name,
        lastName,
        userProfile.university,
        userProfile.studies,
        userProfile.country,
        os,
        country,
        device,
        userProfile.occupation
      );
      if (res.success && res.accessToken && res.refreshToken) {
        actionUponRegistration(true, res.error_code);
        dispatch(
          userActions.setUser(res.admin || false, name, userProfile.studies)
        );
        dispatch(authActions.setValidityToken(true));
        dispatch(authActions.updateRefreshTokenTime());
        Cookies.set("ACCESS_TOKEN", res.accessToken, {
          expires: 1 / 96,
          path: "/",
        }); // 15 minutes
        Cookies.set("REFRESH_TOKEN", res.refreshToken, {
          expires: 7,
          path: "/",
        });
      } else {
        actionUponRegistration(false, res.error_code);
      }
      setIsSubmitting(false);
    }
  };

  if (
    !userProfile.phoneNumber ||
    !userProfile.country ||
    !userProfile.occupation ||
    !userProfile.studies ||
    !userProfile.university
  ) {
    return;
  }

  return (
    <div className="flex flex-col justify-center bg-black items-center w-screen h-screen">
      <Modal
        showModal={showDialog}
        title={dialogTitle}
        description={dialogMessage}
        submitButtonText="Ok"
        submitHandler={() => setShowDialog(false)}
      />
      <div className="absolute top-10 left-10">
        <FontAwesomeIcon
          className="w-8 h-8 cursor-pointer"
          icon={faArrowLeft}
          color="#ffffff"
          onClick={() => router.back()}
        />
      </div>
      <div className="flex flex-col w-[90%] md:w-[60%] lg:w-[30%] items-start text-white">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="w-full mb-4">
            <p className="font-fontBold text-2xl font-bold mb-2">{text.name}</p>
            <input
              type="text"
              value={name}
              onChange={onChangeName}
              disabled={isSubmitting}
              className="text-lg bg-transparent border-secondary border-b caret-secondary px-1 w-full"
            />
          </div>
          <div className="w-full mb-4">
            <p className="font-fontBold text-2xl font-bold mb-2">
              {text.lastName}
            </p>
            <input
              type="text"
              value={lastName}
              onChange={onChangeLastName}
              disabled={isSubmitting}
              className="text-lg bg-transparent border-secondary border-b caret-secondary px-1 w-full"
            />
          </div>
          <div className="w-full mb-4">
            <p className="font-fontBold text-2xl font-bold mb-2">
              {text.email}
            </p>
            <input
              type="email"
              value={email}
              onChange={onChangeEmail}
              disabled={isSubmitting}
              className="text-lg bg-transparent border-secondary border-b caret-secondary px-1 w-full"
            />
          </div>
          <div className="w-full mb-4">
            <p className="font-fontBold text-2xl font-bold mb-2">
              {text.password}
            </p>
            <span className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={onChangePassword}
                disabled={isSubmitting}
                className="text-lg bg-transparent border-secondary border-b caret-secondary px-1 w-full"
              />
              <FontAwesomeIcon
                className="w-4 h-4 cursor-pointer absolute top-0 right-0"
                icon={passwordVisible ? faEyeSlash : faEye}
                color="#20AD96"
                onClick={togglePasswordVisibility}
              />
            </span>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full px-4 py-3 rounded-custom bg-secondary hover:bg-[#158c78] text-white font-fontBold font-bold text-lg"
          >
            <span>
              {isSubmitting ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <span>{text.register}</span>
              )}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserInfo;
