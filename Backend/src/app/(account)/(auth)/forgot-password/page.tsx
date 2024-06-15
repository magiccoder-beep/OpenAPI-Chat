"use client";

import { useLayoutEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppSelector } from "@/redux";
import { i18n } from "@/lng/logic";
import { ActivityIndicator, Modal } from "@/components";
import { SendResetToken } from "@/server";

type Props = {};

const ForgotPassword: NextPage<Props> = (props: Props) => {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.users);
  const { data: translation } = useAppSelector((state) => state.i18n);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [dialogMessage, setDialogMessage] = useState<string>("");
  const [dialogTitle, setDialogTitle] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [text, setText] = useState<{
    noValidEmail: string;
    noValidEmailTitle: string;
    resetEmail: string;
    resetEmailTitle: string;
    email: string;
    sendEmail: string;
    forgotPassword: string;
    keineEmailErhalten: string;
  }>({
    noValidEmail: "",
    noValidEmailTitle: "",
    resetEmail: "",
    resetEmailTitle: "",
    email: "",
    sendEmail: "",
    forgotPassword: "",
    keineEmailErhalten: "",
  });

  useLayoutEffect(() => {
    setText({
      noValidEmail: i18n(translation, "dialog", "noValidEmail"),
      noValidEmailTitle: i18n(translation, "dialog", "noValidEmailTitle"),
      resetEmail: i18n(translation, "dialog", "resetEmail"),
      resetEmailTitle: i18n(translation, "dialog", "resetEmailTitle"),
      email: i18n(translation, "general", "email"),
      sendEmail: i18n(translation, "general", "sendEmail"),
      forgotPassword: i18n(translation, "signup", "forgotPassword"),
      keineEmailErhalten: i18n(translation, "general", "keineEmailErhalten"),
    });
  }, [translation]);

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputText: string = event.target.value;
    setEmail(inputText);
  };

  const isValidEmail = () => {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const actionUponForgotPassword = (success: Boolean) => {
    if (success) {
      sessionStorage.setItem("email", email);
      router.push("/forgot-password/verify");
    } else {
      setDialogMessage(text.resetEmail);
      setDialogTitle(text.resetEmailTitle);
      setShowDialog(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail()) {
      setDialogMessage(text.noValidEmail);
      setDialogTitle(text.noValidEmailTitle);
      setShowDialog(true);
    } else {
      setIsSubmitting(true);
      const res: boolean = await SendResetToken(email);
      actionUponForgotPassword(res);
      setIsSubmitting(false);
    }
  };

  if (user && user.loggedIn) {
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
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full px-4 py-3 rounded-custom bg-secondary hover:bg-[#158c78] text-white font-fontBold font-bold text-lg"
          >
            <span>
              {isSubmitting ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <span>{text.sendEmail}</span>
              )}
            </span>
          </button>
          <button
            type="button"
            onClick={() =>
              window.open(
                `mailto:support@pharmazing.de?subject=Support email:${email}`,
                "_blank"
              )
            }
            className="mt-6 w-full px-4 py-3 rounded-custom bg-secondary hover:bg-[#158c78] text-white font-fontBold font-bold text-lg"
          >
            {text.keineEmailErhalten}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
