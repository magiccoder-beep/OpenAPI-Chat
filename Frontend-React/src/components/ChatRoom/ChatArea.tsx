"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Send from "react-ionicons/lib/Send";
import Lottie from "lottie-react";
import bigLoadingAnimation from "@/assets/animations/bigLoading.json";
import {
  useAppDispatch,
  useAppSelector,
  pharmazingActions,
  userActions,
  i18nActions,
  pharmazingActionsTypes,
  RootState,
} from "@/redux";
import { useDeviceDetection, useScrollDetector } from "@/hooks";
import { GetAnswer, GetHistory } from "@/server";
import { i18n } from "@/lng/logic";
import {
  Modal,
  ActivityIndicator,
  MessageBox,
  PreviewImages,
} from "@/components";
import { getAccessToken, logout } from "@/helper";
import { useImages } from "@/context/imagesContext";

type Props = {
  isHistory: boolean;
};

const ChatArea: React.FC<Props> = ({ isHistory }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const selector: RootState = useAppSelector((state) => state);
  const { lastActivity, user } = selector.users;
  const { data: translation } = selector.i18n;
  const {
    messages,
    loading,
    downvoted,
    question_id,
    nb_question,
    not_related,
    messagesHistory,
    messagesHistory_loading,
    history_loading,
  } = selector.pharmazing;
  const { device } = useDeviceDetection();
  const { showImages } = useImages();
  const scrollDivRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);
  const { isScrolling } = useScrollDetector(scrollDivRef);
  const [footerHeight, setFooterHeight] = useState<number>(0);
  const [userMessages, setUserMessages] = useState<
    pharmazingActionsTypes.Message[]
  >([]);
  const [followupQuestionAllowed, setFollowupQuestionAllowed] =
    useState<boolean>(true);
  const [inputQuestion, setInputQuestion] = useState<string>("");
  const [showNoFollowup, setShowNoFollowup] = useState<boolean>(false);
  const [showNotLogin, setShowNotLogin] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalText, setModalText] = useState<string>("");
  const [loadingHistory, setLoadingHistory] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [scrollbarVisible, setScrollbarVisible] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  
  useEffect(() => {
    setIndex((prev) => prev + 1);
  }, [showImages]);

  useEffect(() => {
    if (pathname !== "/history/chat") {
      dispatch(pharmazingActions.setMessagesHistory([]));
    }
  }, [dispatch, pathname]);

  // useEffect(() => {
  //   dispatch(pharmazingActions.resetMessages());
  // }, []);

  useLayoutEffect(() => {
    if (footerRef.current) {
      setFooterHeight(footerRef.current.clientHeight);
    }
  }, []);

  useEffect(() => {
    if (isHistory) {
      setUserMessages(messagesHistory);
    } else {
      setUserMessages(messages);
    }
  }, [isHistory, messages, messagesHistory]);

  useEffect(() => {
    setTimeout(() => {
      if (scrollDivRef.current) {
        setScrollbarVisible(
          scrollDivRef.current.scrollHeight > scrollDivRef.current.clientHeight
        );
      }
    }, 200);
  }, [userMessages, footerHeight]);

  useEffect(() => {
    const timeout: NodeJS.Timeout = setTimeout(() => {
      setLoadingHistory(
        history_loading ? history_loading : messagesHistory_loading
      );
    }, 100);
    return () => clearTimeout(timeout);
  }, [messagesHistory_loading, history_loading]);

  const showModal = (modalTrigger: string) => {
    if (modalTrigger === "question") {
      setModalText(i18n(translation, "question", "questionCopied"));
    } else {
      setModalText(i18n(translation, "question", "answerCopied"));
    }
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
      setModalText("");
    }, 3000);
  };

  const onChangeInputQuestion = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputText: string = event.target.value;
    if (followupQuestionAllowed || userMessages.length === 0) {
      setInputQuestion(inputText);
    } else {
      setShowNoFollowup(true);
    }
  };

  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "active") {
        dispatch(i18nActions.reloadLng());
        const diffTime = Math.abs(Date.now() - lastActivity);
        if (diffTime >= 10 * 60 * 1000 && userMessages.length > 0) {
          setFollowupQuestionAllowed(false);
        }
        if (diffTime >= 60 * 60 * 1000 && userMessages.length > 0) {
          const copyMessages = [...userMessages];
          dispatch(pharmazingActions.setMessages([]));
          setTimeout(() => {
            dispatch(pharmazingActions.setMessages(copyMessages));
          }, 50);
        }
      }
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        handleAppStateChange("active");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [lastActivity, userMessages, dispatch]);

  const sendQuestion = async (retry: number, messagesRetry: any[] = []) => {
    dispatch(userActions.updateLastActivity());
    if (followupQuestionAllowed || userMessages.length === 0) {
      setFollowupQuestionAllowed(true);
      if (!loading && setInputQuestion.length > 0) {
        setInputQuestion("");
        dispatch(pharmazingActions.setLoading(true));
        const token = await getAccessToken(dispatch, selector);
        let messagesCopy = [];
        for (let i = 0; i < userMessages.length; i++) {
          messagesCopy.push({
            role: userMessages[i].role,
            content: userMessages[i].content,
          });
        }
        messagesCopy.push({ role: "user", content: inputQuestion });
        if (retry === 2) {
          dispatch(
            pharmazingActions.addToMessages(
              "user",
              inputQuestion,
              true,
              nb_question,
              []
            )
          );
          dispatch(
            pharmazingActions.addToMessages("system", "", true, nb_question, [])
          );
        }
        try {
          const res: {
            answer: string;
            answerImages: string;
            answer_id: number;
            expiredSubscription: boolean;
            images: any[];
            isTrialSubscription: boolean;
            isValidSubscription: boolean;
            question_id: number;
            success: number;
            textParts: any[];
            voted: boolean;
          } = await GetAnswer(
            token,
            retry != 2 ? messagesRetry : messagesCopy,
            question_id,
            device,
            downvoted
          );
          if (res.success === 0 && retry > 0) {
            retry = retry - 1;
            setTimeout(() => {
              sendQuestion(retry, messagesCopy);
            }, 5000);
            return;
          } else if (res.success === 0 && retry <= 0) {
            dispatch(pharmazingActions.setLoading(false));
            dispatch(
              pharmazingActions.addToMessages(
                "system",
                i18n(translation, "question", "unableProcess"),
                false,
                nb_question,
                [
                  {
                    word: i18n(translation, "question", "unableProcess"),
                    idx: -1,
                  },
                ]
              )
            );
          } else if (res.success === 1) {
            dispatch(userActions.updateLastActivity());
            dispatch(pharmazingActions.setLoading(false));
            if (res.answer === "CANNOT_ANSWER") {
              dispatch(
                pharmazingActions.addToMessages(
                  "system",
                  i18n(translation, "general", "CANNOT_ANSWER"),
                  false,
                  nb_question,
                  [
                    {
                      word: i18n(translation, "general", "CANNOT_ANSWER"),
                      idx: -1,
                    },
                  ]
                )
              );
              dispatch(pharmazingActions.setNotRelated(true));
            } else {
              if (res.voted) {
                dispatch(pharmazingActions.setVoted(true));
              }
              dispatch(
                pharmazingActions.addToMessages(
                  "system",
                  res.answerImages,
                  false,
                  nb_question,
                  res.textParts,
                  res.images
                )
              );
              if (res.answer_id >= 0) {
                dispatch(pharmazingActions.setAnswerId(res.answer_id));
              }
              dispatch(pharmazingActions.setQuestionId(res.question_id));
            }
          } else if (res.success === 2) {
            setShowNotLogin(true);
            setTimeout(() => logout(router, dispatch), 5000);
            return;
          } else if (res.success === 3) {
            dispatch(pharmazingActions.setLoading(false));
            dispatch(
              pharmazingActions.addToMessages(
                "system",
                i18n(translation, "question", "pleaseUpdate"),
                false,
                nb_question,
                [
                  {
                    word: i18n(translation, "question", "pleaseUpdate"),
                    idx: -1,
                  },
                ]
              )
            );
          } else {
            dispatch(userActions.updateLastActivity());
            dispatch(pharmazingActions.setLoading(false));
            dispatch(
              pharmazingActions.addToMessages(
                "system",
                i18n(translation, "question", "unableProcess") + " .",
                false,
                nb_question,
                [
                  {
                    word: i18n(translation, "question", "unableProcess") + " .",
                    idx: -1,
                  },
                ]
              )
            );
          }
        } catch (error: any) {
          if (retry > 0) {
            retry = retry - 1;
            sendQuestion(retry, messagesCopy);
          } else {
            dispatch(pharmazingActions.setLoading(false));
            dispatch(
              pharmazingActions.addToMessages(
                "system",
                i18n(translation, "question", "unableProcess") + ".",
                false,
                nb_question,
                [
                  {
                    word: i18n(translation, "question", "unableProcess") + ".",
                    idx: -1,
                  },
                ]
              )
            );
          }
        }
      }
    } else {
      setShowNoFollowup(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isHistory) {
      if (inputQuestion.length === 0) {
        return;
      }
      setIsSubmitting(true);
      setTimeout(() => {
        if (scrollDivRef.current) {
          scrollDivRef.current.scrollTop =
            scrollDivRef.current.scrollHeight * 4;
        }
      }, 500);
      await sendQuestion(2);
      // const token: string = await getAccessToken(dispatch, selector);
      // const res: any[][] = await GetHistory(token);
      // const serializedHistory = res.map((innerArray) =>
      //   innerArray.map((item) =>
      //     item.created_at instanceof Date
      //       ? { ...item, created_at: item.created_at.toISOString() }
      //       : item
      //   )
      // );
      // dispatch(pharmazingActions.setHistory(serializedHistory));
      setIsSubmitting(false);
      setTimeout(() => {
        if (scrollDivRef.current) {
          scrollDivRef.current.scrollTop = scrollDivRef.current.scrollHeight * 2;
        }
      }, 25);
    }
  };

  return (
    <div className="flex-1 bg-[#f5f5f5] relative">
      <Modal
        theme="light"
        showModal={not_related}
        title={i18n(translation, "question", "notRelatedTitle")}
        description={i18n(translation, "question", "notRelatedDialog")}
        submitButtonText={i18n(translation, "question", "askNewQuestion")}
        submitHandler={() => {
          dispatch(pharmazingActions.setNotRelated(false));
          setFollowupQuestionAllowed(true);
          dispatch(pharmazingActions.resetMessages());
        }}
      />
      <Modal
        theme="light"
        showModal={showNoFollowup && userMessages.length > 0}
        title={i18n(translation, "question", "noFollowupTitle")}
        description={i18n(translation, "question", "noFollowupDescription")}
        submitButtonText={i18n(translation, "question", "askNewQuestion")}
        submitHandler={() => {
          setShowNoFollowup(false);
          setFollowupQuestionAllowed(true);
          dispatch(pharmazingActions.resetMessages());
        }}
        closeButtonText={i18n(translation, "general", "cancel")}
        closeHandler={() => setShowNoFollowup(false)}
      />
      <Modal
        theme="light"
        showModal={showNotLogin}
        title={i18n(translation, "general", "deviceNotLoggedIn")}
        submitButtonText="Ok"
        submitHandler={() => logout(router, dispatch)}
      />
      {/* Chat Messages */}
      <div
        ref={scrollDivRef}
        className={`mt-0 pt-4 ${
          scrollbarVisible && isScrolling ? "pl-4" : "px-4"
        } ${isHistory ? "pb-2" : "pb-0 mb-2 md:mb-4"} ${
          !isScrolling && "transparent-scrollbar"
        } ${
          showImages && "blur-[2px]"
        }`}
        style={{
          overflowY: "auto",
          height: isHistory ? "100%" : `calc(100% - ${footerHeight}px)`,
        }}
      >
        {isHistory && loadingHistory ? (
          <div className="flex justify-center items-center w-full h-full -mt-6">
            <ActivityIndicator size="medium" color="secondary" />
          </div>
        ) : (
          <>
            {isHistory ? (
              <>
                {!messagesHistory_loading && userMessages.length === 0 && (
                  <div className="flex justify-center items-center w-full h-full -mt-6">
                    <div className="w-20 lg:w-32">
                      <Lottie
                        animationData={bigLoadingAnimation}
                        loop={true}
                        autoPlay={true}
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {userMessages.length === 0 && (
                  <div className="flex justify-center items-center w-full h-full -mt-6">
                    <div className="w-20 lg:w-32">
                      <Lottie
                        animationData={bigLoadingAnimation}
                        loop={true}
                        autoPlay={true}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
            {userMessages.length > 0 &&
              userMessages.map((message: any, idx: number) => {
                return (
                  <div
                    key={idx}
                    className={`flex ${
                      message.role === "user" && "justify-end"
                    } mb-2`}
                  >
                    <MessageBox
                      message={message}
                      messagesLength={userMessages.length}
                      isHistory={isHistory}
                      idx={idx}
                      showModal={showModal}
                    />
                  </div>
                );
              })}
          </>
        )}
      </div>
      {/* Chat Input */}
      {modalVisible ? (
        <footer
          className={`bg-primary p-4 absolute bottom-0 ${
            isHistory && "lg:w-3/4 xl:w-4/5"
          } w-full ${showImages ? "-z-10" : "z-10"}`}
        >
          <p className="text-white font-MathJaxRegular text-lg text-center">
            {modalText}
          </p>
        </footer>
      ) : (
        <>
          {!isHistory && (
            <footer
              ref={footerRef}
              className={`bg-[#f5f5f5] pt-1 pb-2 px-2 lg:pb-4 lg:px-4 absolute bottom-0 w-full ${
                showImages ? "-z-10" : "z-10"
              }`}
            >
              <form onSubmit={handleSubmit} className="flex items-center">
                <input
                  type="text"
                  onChange={onChangeInputQuestion}
                  value={inputQuestion}
                  placeholder={
                    i18n(translation, "question", "askMeSomething") +
                    " " +
                    user.name +
                    " :)"
                  }
                  className="w-full px-4 py-2 border border-[#ddd] rounded-xl lg:rounded-3xl bg-white"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${
                    isSubmitting ? "bg-primary" : "bg-secondary"
                  } p-2 rounded-full ml-2`}
                >
                  <Send color="white" height="20px" width="20px" />
                </button>
              </form>
            </footer>
          )}
        </>
      )}
      <PreviewImages index={index} />
    </div>
  );
};

export default ChatArea;
