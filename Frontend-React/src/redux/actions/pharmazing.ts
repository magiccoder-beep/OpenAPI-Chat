export const RESET_MESSAGES: string = "RESET_MESSAGES";
export const ADD_TO_MESSAGES: string = "ADD_TO_MESSAGES";
export const SET_LOADING: string = "SET_LOADING";
export const SET_ANSWER_ID: string = "SET_ANSWER_ID";
export const SET_QUESTION_ID: string = "SET_QUESTION_ID";
export const SET_VOTED: string = "SET_VOTED";
export const SET_DOWNVOTED: string = "SET_DOWNVOTED";
export const SET_HISTORY: string = "SET_HISTORY";
export const RESET_USER: string = "RESET_USER";
export const SET_NOT_RELATED: string = "SET_NOT_RELATED";
export const SET_HISTORY_LOADING: string = "SET_HISTORY_LOADING";
export const NOT_LOADING_LAST_ANSWER: string = "NOT_LOADING_LAST_ANSWER";
export const INCREMENT_NB_QUESTION: string = "INCREMENT_NB_QUESTION";
export const SET_MESSAGESHISTORY: string = "SET_MESSAGESHISTORY";
export const SET_MESSAGESHISTORY_LOADING: string =
  "SET_MESSAGESHISTORY_LOADING";
export const SET_LOADING_IMAGE: string = "SET_LOADING_IMAGE";
export const SET_HAS_VOTED: string = "SET_HAS_VOTED";
export const SET_ICON_ACTION: string = "SET_ICON_ACTION";
export const REINIT_MESSAGES: string = "REINIT_MESSAGES";
export const SET_MESSAGES: string = "SET_MESSAGES";

export type Message = {
  content: string;
  hasVoted: boolean;
  iconAction: string;
  id: number;
  images: any[];
  loading: boolean;
  role: "user" | "system";
  textParts: {
    idx: number;
    word: string;
    cid: number;
  }[];
  contentImages: string;
};

export type SetMessagesHistoryAction = {
  type: typeof SET_MESSAGESHISTORY;
  messages: Message[];
};

export type SetMessagesHistoryLoadingAction = {
  type: typeof SET_MESSAGESHISTORY_LOADING;
  loading: boolean;
};

export type SetLoadingImageAction = {
  type: typeof SET_LOADING_IMAGE;
  loading: boolean;
};

export type ResetMessagesAction = {
  type: typeof RESET_MESSAGES;
};

export type NotLoadingLastAnswerAction = {
  type: typeof NOT_LOADING_LAST_ANSWER;
};

export type IncrementNbQuestionAction = {
  type: typeof INCREMENT_NB_QUESTION;
};

export type ResetUserAction = {
  type: typeof RESET_USER;
};

export type SetHistoryLoadingAction = {
  type: typeof SET_HISTORY_LOADING;
  loading: boolean;
};

export type SetNotRelatedAction = {
  type: typeof SET_NOT_RELATED;
  not_related: boolean;
};

export type SetHistoryAction = {
  type: typeof SET_HISTORY;
  history: any[];
};

export type SetLoadingAction = {
  type: typeof SET_LOADING;
  loading: boolean;
};

export type SetVotedAction = {
  type: typeof SET_VOTED;
  voted: boolean;
};

export type SetDownvotedAction = {
  type: typeof SET_DOWNVOTED;
};

export type SetAnswerIdAction = {
  type: typeof SET_ANSWER_ID;
  answer_id: number;
};

export type SetQuestionIdAction = {
  type: typeof SET_QUESTION_ID;
  question_id: number;
};

export type AddToMessagesAction = {
  type: typeof ADD_TO_MESSAGES;
  role: string;
  content: string;
  insertNew: boolean;
  nb_question: number;
  textParts: any[];
  images?: any[];
};

export type SetHasVotedAction = {
  type: typeof SET_HAS_VOTED;
  idx: number;
};

export type ReinitMessagesAction = {
  type: typeof REINIT_MESSAGES;
};

export type SetMessagesAction = {
  type: typeof SET_MESSAGES;
  messages: any[];
};

export type SetIconAction = {
  type: typeof SET_ICON_ACTION;
  idx: number;
  iconAction: string;
};

export const setMessagesHistory = (
  messages: Message[]
): SetMessagesHistoryAction => ({
  type: SET_MESSAGESHISTORY,
  messages,
});

export const setMessagesHistoryLoading = (
  loading: boolean
): SetMessagesHistoryLoadingAction => ({
  type: SET_MESSAGESHISTORY_LOADING,
  loading,
});

export const setLoadingImage = (loading: boolean): SetLoadingImageAction => ({
  type: SET_LOADING_IMAGE,
  loading,
});

export const resetMessages = (): ResetMessagesAction => ({
  type: RESET_MESSAGES,
});

export const notLoadingLastAnswer = (): NotLoadingLastAnswerAction => ({
  type: NOT_LOADING_LAST_ANSWER,
});

export const incrementNbQuestion = (): IncrementNbQuestionAction => ({
  type: INCREMENT_NB_QUESTION,
});

export const resetUser = (): ResetUserAction => ({
  type: RESET_USER,
});

export const setHistoryLoading = (
  loading: boolean
): SetHistoryLoadingAction => ({
  type: SET_HISTORY_LOADING,
  loading,
});

export const setNotRelated = (not_related: boolean): SetNotRelatedAction => ({
  type: SET_NOT_RELATED,
  not_related,
});

export const setHistory = (history: any): SetHistoryAction => ({
  type: SET_HISTORY,
  history,
});

export const setLoading = (loading: boolean): SetLoadingAction => ({
  type: SET_LOADING,
  loading,
});

export const setVoted = (voted: boolean): SetVotedAction => ({
  type: SET_VOTED,
  voted,
});

export const setDownvoted = (): SetDownvotedAction => ({
  type: SET_DOWNVOTED,
});

export const setAnswerId = (answer_id: number): SetAnswerIdAction => ({
  type: SET_ANSWER_ID,
  answer_id,
});

export const setQuestionId = (question_id: number): SetQuestionIdAction => ({
  type: SET_QUESTION_ID,
  question_id,
});

export const addToMessages = (
  role: string,
  content: string,
  insertNew: boolean,
  nb_question: number,
  textParts: any[],
  images: any[] = []
): AddToMessagesAction => ({
  type: ADD_TO_MESSAGES,
  role,
  content,
  insertNew,
  nb_question,
  textParts,
  images,
});

export const setHasVoted = (idx: number): SetHasVotedAction => {
  return { type: SET_HAS_VOTED, idx: idx };
};

export const reinitMessages = (): ReinitMessagesAction => {
  return { type: REINIT_MESSAGES };
};

export const setMessages = (messages: any[]): SetMessagesAction => {
  return { type: SET_MESSAGES, messages: messages };
};

export const setIconAction = (
  idx: number,
  iconAction: string
): SetIconAction => {
  return { type: SET_ICON_ACTION, idx: idx, iconAction: iconAction };
};
