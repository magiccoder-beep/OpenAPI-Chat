"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
  pharmazingActions,
  RootState,
} from "@/redux";
import { GetHistory, GetQuestions } from "@/server";
import { i18n } from "@/lng/logic";
import { useScrollDetector, useWindowSize } from "@/hooks";
import { ActivityIndicator } from "@/components";
import { getDate } from "@/util";
import { getAccessToken } from "@/helper";
import { useImages } from "@/context/imagesContext";

type Props = {};

const ChatSidebar: React.FC<Props> = (props: Props) => {
  const router = useRouter();
  const { isDesktop } = useWindowSize();
  const dispatch = useAppDispatch();
  const selector: RootState = useAppSelector((state) => state);
  const { data: translation } = selector.i18n;
  const { history, history_loading } = selector.pharmazing;
  const { setShowImages } = useImages();
  const divRef = useRef<HTMLDivElement>(null);
  const { isScrolling } = useScrollDetector(divRef);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(true);
  const [scrollbarVisible, setScrollbarVisible] = useState<boolean>(false);

  useEffect(() => {
    const timeout: NodeJS.Timeout = setTimeout(() => {
      setLoadingHistory(history_loading);
    }, 100);
    return () => clearTimeout(timeout);
  }, [history_loading]);

  useEffect(() => {
    setTimeout(() => {
      if (divRef.current) {
        setScrollbarVisible(
          divRef.current.scrollHeight > divRef.current.clientHeight
        );
      }
    }, 200);
  }, [history, history_loading]);

  const fetchMessagesHistory = async () => {
    dispatch(pharmazingActions.setMessagesHistoryLoading(false));
    dispatch(pharmazingActions.setHistoryLoading(true));
    const token: string = await getAccessToken(dispatch, selector);
    const res: any[][] = await GetHistory(token);
    const serializedHistory = res.map((innerArray) =>
      innerArray.map((item) =>
        item.created_at instanceof Date
          ? { ...item, created_at: item.created_at.toISOString() }
          : item
      )
    );
    dispatch(pharmazingActions.setHistory(serializedHistory));
    dispatch(pharmazingActions.setHistoryLoading(false));
  };

  useEffect(() => {
    fetchMessagesHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMessagesQuestion = async (question_id: number) => {
    const token: string = await getAccessToken(dispatch, selector);
    const res: { success: boolean; messages: any[] } = await GetQuestions(
      token,
      question_id
    );
    if (res.success) {
      dispatch(pharmazingActions.setMessagesHistory(res.messages));
    }
    dispatch(pharmazingActions.setMessagesHistoryLoading(false));
  };

  const goToMessage = async (question_id: number) => {
    setTimeout(() => setShowImages(false), 500);
    dispatch(pharmazingActions.setMessagesHistoryLoading(true));
    dispatch(pharmazingActions.setMessagesHistory([]));
    await fetchMessagesQuestion(question_id);
    if (isDesktop) {
      router.push("/history");
    } else {
      router.push("/history/chat");
    }
  };

  return (
    <div className="w-full lg:w-1/4 xl:w-1/5 h-full border-r border-gray-300">
      {/* History List */}
      <div
        ref={divRef}
        className={`h-full py-3 ${
          scrollbarVisible && isScrolling ? "pl-4" : "pl-4 pr-4"
        } ${!isScrolling && "transparent-scrollbar"}`}
        style={{ overflowY: "auto", zIndex: -1 }}
      >
        <div
          className={`${
            loadingHistory
              ? "flex justify-center items-center w-full h-full"
              : "flex items-center"
          } ${history.length === 0 && "w-full"}`}
        >
          <div
            className={`${!loadingHistory && history.length !== 0 && "flex-1"}`}
          >
            {loadingHistory ? (
              <ActivityIndicator size="small" color="primary" />
            ) : (
              <>
                {history.length === 0 ? (
                  <p className="text-lg font-MathJaxRegular py-2 px-3 cursor-pointer border-b border-b-gray-400 rounded-md">
                    {i18n(translation, "general", "noQuestionsAsked")}
                  </p>
                ) : (
                  <>
                    {history.map((item: any, index: number) => (
                      <span key={index}>
                        {item[0].role === "date" && (
                          <p className="text-lg font-MathJaxRegular bg-primary text-white capitalize py-2 px-3 rounded-md">
                            {getDate(item[0].offset, translation)}
                          </p>
                        )}
                        {item[0].role === "user" && (
                          <p
                            className="text-lg font-MathJaxRegular py-2 px-3 shadow-sm cursor-pointer border-b border-b-gray-400 rounded-md text-black hover:bg-black transition-all duration-500 ease-in-out hover:bg-opacity-5"
                            onClick={() => {
                              item[0].role === "user"
                                ? goToMessage(item[0].question_id)
                                : {};
                            }}
                          >
                            {item[0].content}
                          </p>
                        )}
                      </span>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
