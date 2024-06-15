"use client";

import { useLayoutEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { LoginEmail } from "@/server";

type Props = {};

const Login: NextPage<Props> = (props: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { device, os } = useDeviceDetection();
  const { user } = useAppSelector((state) => state.users);
  const { data: translation } = useAppSelector((state) => state.i18n);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState<string>("");
  const [dialogTitle, setDialogTitle] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isFormButtonClicked, setIsFormButtonClicked] =
    useState<boolean>(false);
  const [text, setText] = useState<{
    noValidEmail: string;
    noValidEmailTitle: string;
    noValidPassword: string;
    noValidPasswordTitle: string;
    EMAIL_PASSWORD_NOMATCH: string;
    ERROR_OCCURED: string;
    EMAIL_NOT_REGISTERED: string;
    CANNOT_CHANGE_DEVICE: string;
    errorOccured: string;
    loginNotSuccess: string;
    email: string;
    password: string;
    forgotPassword: string;
    continue: string;
  }>({
    noValidEmail: "",
    noValidEmailTitle: "",
    noValidPassword: "",
    noValidPasswordTitle: "",
    EMAIL_PASSWORD_NOMATCH: "",
    ERROR_OCCURED: "",
    EMAIL_NOT_REGISTERED: "",
    CANNOT_CHANGE_DEVICE: "",
    errorOccured: "",
    loginNotSuccess: "",
    email: "",
    password: "",
    forgotPassword: "",
    continue: "",
  });

  useLayoutEffect(() => {
    setText({
      noValidEmail: i18n(translation, "dialog", "noValidEmail"),
      noValidEmailTitle: i18n(translation, "dialog", "noValidEmailTitle"),
      noValidPassword: i18n(translation, "dialog", "noValidPassword"),
      noValidPasswordTitle: i18n(translation, "dialog", "noValidPasswordTitle"),
      EMAIL_PASSWORD_NOMATCH: i18n(
        translation,
        "dialog",
        "EMAIL_PASSWORD_NOMATCH"
      ),
      ERROR_OCCURED: i18n(translation, "dialog", "ERROR_OCCURED"),
      EMAIL_NOT_REGISTERED: i18n(translation, "dialog", "EMAIL_NOT_REGISTERED"),
      CANNOT_CHANGE_DEVICE: i18n(translation, "dialog", "CANNOT_CHANGE_DEVICE"),
      errorOccured: i18n(translation, "dialog", "errorOccured"),
      loginNotSuccess: i18n(translation, "dialog", "loginNotSuccess"),
      email: i18n(translation, "general", "email"),
      password: i18n(translation, "general", "password"),
      forgotPassword: i18n(translation, "signup", "forgotPassword"),
      continue: i18n(translation, "general", "continue"),
    });
  }, [translation]);

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

  const isValidPassword = () => {
    return password.length > 0;
  };

  const errorCodes: {
    EMAIL_PASSWORD_NOMATCH: string;
    ERROR_OCCURED: string;
    EMAIL_NOT_REGISTERED: string;
    CANNOT_CHANGE_DEVICE: string;
  } = {
    EMAIL_PASSWORD_NOMATCH: text.EMAIL_PASSWORD_NOMATCH,
    ERROR_OCCURED: text.ERROR_OCCURED,
    EMAIL_NOT_REGISTERED: text.EMAIL_NOT_REGISTERED,
    CANNOT_CHANGE_DEVICE: text.CANNOT_CHANGE_DEVICE,
  };

  const actionUponLogin = (
    success: boolean,
    errorCode:
      | "EMAIL_PASSWORD_NOMATCH"
      | "ERROR_OCCURED"
      | "EMAIL_NOT_REGISTERED"
      | "CANNOT_CHANGE_DEVICE"
  ) => {
    if (success) {
      router.replace("/tutorial");
    } else {
      let errorMessage: string = text.errorOccured;
      if (errorCode in errorCodes) {
        errorMessage = errorCodes[errorCode];
      }
      setDialogMessage(errorMessage);
      setDialogTitle(text.loginNotSuccess);
      setShowDialog(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormButtonClicked(true);
    setPasswordVisible(false);
    if (!isValidEmail()) {
      setDialogMessage(i18n(translation, "dialog", "noValidEmail"));
      setDialogTitle(i18n(translation, "dialog", "noValidEmailTitle"));
      setShowDialog(true);
    } else if (!isValidPassword()) {
      setDialogMessage(i18n(translation, "dialog", "noValidPassword"));
      setDialogTitle(i18n(translation, "dialog", "noValidPasswordTitle"));
      setShowDialog(true);
    } else {
      setIsSubmitting(true);
      const res: {
        success: boolean;
        error_code?: any;
        admin?: boolean;
        name?: string;
        studies?: string;
        accessToken?: string;
        refreshToken?: string;
      } = await LoginEmail(email, password, device, os);
      if (
        res.success &&
        res.name &&
        res.studies &&
        res.accessToken &&
        res.refreshToken
      ) {
        actionUponLogin(true, res.error_code);
        dispatch(
          userActions.setUser(res.admin || false, res.name, res.studies)
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
        actionUponLogin(false, res.error_code);
        setIsSubmitting(false);
      }
    }
  };

  if (user && user.loggedIn && !isFormButtonClicked) {
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
          onClick={() => router.replace("/")}
        />
      </div>
      <div className="flex flex-col w-[90%] md:w-[60%] lg:w-[30%] items-start text-white">
        <form onSubmit={handleSubmit} className="w-full">
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
          <div className="mb-4">
            <Link
              href="/forgot-password"
              className="font-fontBold text-lg font-bold"
            >
              {text.forgotPassword}
            </Link>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full flex justify-center items-center px-4 py-3 rounded-custom bg-secondary hover:bg-[#158c78] text-white font-fontBold font-bold text-lg"
          >
            <span>
              {isSubmitting ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <span>{text.continue}</span>
              )}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
