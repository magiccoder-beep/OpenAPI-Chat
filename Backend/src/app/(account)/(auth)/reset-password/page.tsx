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
  authActions,
  useAppDispatch,
  useAppSelector,
  userActions,
} from "@/redux";
import { i18n } from "@/lng/logic";
import { ActivityIndicator, Modal } from "@/components";
import { useDeviceDetection } from "@/hooks";
import { LoginEmail, ResetPassword } from "@/server";

type Props = {};

const ResetUserPassword: NextPage<Props> = (props: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { device, os } = useDeviceDetection();
  const { data: translation } = useAppSelector((state) => state.i18n);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [dialogMessage, setDialogMessage] = useState<string>("");
  const [dialogTitle, setDialogTitle] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [text, setText] = useState<{
    noValidPassword: string;
    noValidPasswordTitle: string;
    notValidRepeatPassword: string;
    notValidRepeatPasswordTitle: string;
    passwordsShouldMatch: string;
    passwordsShouldMatchTitle: string;
    EMAIL_PASSWORD_NOMATCH: string;
    ERROR_OCCURED: string;
    EMAIL_NOT_REGISTERED: string;
    errorOccured: string;
    passwordResetNotSuccess: string;
    loginNotSuccess: string;
    newPassword: string;
    repeatPassword: string;
    continue: string;
  }>({
    noValidPassword: "",
    noValidPasswordTitle: "",
    notValidRepeatPassword: "",
    notValidRepeatPasswordTitle: "",
    passwordsShouldMatch: "",
    passwordsShouldMatchTitle: "",
    EMAIL_PASSWORD_NOMATCH: "",
    ERROR_OCCURED: "",
    EMAIL_NOT_REGISTERED: "",
    errorOccured: "",
    passwordResetNotSuccess: "",
    loginNotSuccess: "",
    newPassword: "",
    repeatPassword: "",
    continue: "",
  });

  useLayoutEffect(() => {
    setText({
      noValidPassword: i18n(translation, "dialog", "noValidPassword"),
      noValidPasswordTitle: i18n(translation, "dialog", "noValidPasswordTitle"),
      notValidRepeatPassword: i18n(
        translation,
        "dialog",
        "notValidRepeatPassword"
      ),
      notValidRepeatPasswordTitle: i18n(
        translation,
        "dialog",
        "notValidRepeatPasswordTitle"
      ),
      passwordsShouldMatch: i18n(translation, "dialog", "passwordsShouldMatch"),
      passwordsShouldMatchTitle: i18n(
        translation,
        "dialog",
        "passwordsShouldMatchTitle"
      ),
      EMAIL_PASSWORD_NOMATCH: i18n(
        translation,
        "dialog",
        "EMAIL_PASSWORD_NOMATCH"
      ),
      ERROR_OCCURED: i18n(translation, "dialog", "ERROR_OCCURED"),
      EMAIL_NOT_REGISTERED: i18n(translation, "dialog", "EMAIL_NOT_REGISTERED"),
      errorOccured: i18n(translation, "dialog", "errorOccured"),
      passwordResetNotSuccess: i18n(
        translation,
        "dialog",
        "passwordResetNotSuccess"
      ),
      loginNotSuccess: i18n(translation, "dialog", "loginNotSuccess"),
      newPassword: i18n(translation, "signup", "newPassword"),
      repeatPassword: i18n(translation, "signup", "repeatPassword"),
      continue: i18n(translation, "general", "continue"),
    });
  }, [translation]);

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("email");
    const savedCode = sessionStorage.getItem("code");
    if (savedEmail && savedCode) {
      setEmail(savedEmail);
      setCode(savedCode);
      setTimeout(() => sessionStorage.removeItem("email"), 1000);
      setTimeout(() => sessionStorage.removeItem("code"), 1000);
    } else {
      router.replace("/");
    }
  }, [router]);

  const onChangePassword2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputText: string = event.target.value;
    setPassword2(inputText);
  };

  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputText: string = event.target.value;
    setPassword(inputText);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const isValidPassword = (password: string) => {
    return password.length > 0;
  };

  const errorCodes: {
    EMAIL_PASSWORD_NOMATCH: string;
    ERROR_OCCURED: string;
    EMAIL_NOT_REGISTERED: string;
  } = {
    EMAIL_PASSWORD_NOMATCH: text.EMAIL_PASSWORD_NOMATCH,
    ERROR_OCCURED: text.ERROR_OCCURED,
    EMAIL_NOT_REGISTERED: text.EMAIL_NOT_REGISTERED,
  };

  const actionUponCompletion = async (success: boolean) => {
    if (success) {
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
      }
    } else {
      setDialogMessage(text.errorOccured);
      setDialogTitle(text.passwordResetNotSuccess);
      setShowDialog(true);
    }
  };

  const actionUponLogin = (
    success: boolean,
    errorCode:
      | "EMAIL_PASSWORD_NOMATCH"
      | "ERROR_OCCURED"
      | "EMAIL_NOT_REGISTERED"
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
    setPasswordVisible(false);
    if (!isValidPassword(password)) {
      setDialogMessage(text.noValidPassword);
      setDialogTitle(text.noValidPasswordTitle);
      setShowDialog(true);
      setPasswordVisible(true);
    } else if (!isValidPassword(password2)) {
      setDialogMessage(text.notValidRepeatPassword);
      setDialogTitle(text.notValidRepeatPasswordTitle);
      setShowDialog(true);
      setPasswordVisible(true);
    } else if (password !== password2) {
      setDialogMessage(text.passwordsShouldMatch);
      setDialogTitle(text.passwordsShouldMatchTitle);
      setShowDialog(true);
      setPasswordVisible(true);
    } else {
      setIsSubmitting(true);
      const res: boolean = await ResetPassword(email, password, code);
      await actionUponCompletion(res);
      setIsSubmitting(false);
    }
  };

  if (!email || !code) {
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
            <p className="font-fontBold text-2xl font-bold mb-2">
              {text.newPassword}
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
          <div className="w-full mb-4">
            <p className="font-fontBold text-2xl font-bold mb-2">
              {text.repeatPassword}
            </p>
            <span className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                value={password2}
                onChange={onChangePassword2}
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
                <span>{text.continue}</span>
              )}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetUserPassword;
