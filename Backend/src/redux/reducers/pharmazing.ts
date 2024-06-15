"use client";

import {
  Message,
  RESET_MESSAGES,
  ADD_TO_MESSAGES,
  SET_LOADING,
  SET_ANSWER_ID,
  SET_VOTED,
  SET_DOWNVOTED,
  SET_QUESTION_ID,
  SET_HISTORY,
  RESET_USER,
  SET_NOT_RELATED,
  SET_HISTORY_LOADING,
  NOT_LOADING_LAST_ANSWER,
  INCREMENT_NB_QUESTION,
  SET_MESSAGESHISTORY,
  SET_MESSAGESHISTORY_LOADING,
  SET_LOADING_IMAGE,
  SET_MESSAGES,
  REINIT_MESSAGES,
  SET_ICON_ACTION,
  SET_HAS_VOTED,
} from "@/redux/actions/pharmazing";
import { deleteState, getState, saveState } from "@/util";

export type ChatGPTState = {
  messages: Message[];
  messagesHistory: Array<any>;
  messagesHistory_loading: boolean;
  history: Array<any>;
  questions: Array<any>;
  history_loading: boolean;
  loading: boolean;
  loadingImage: boolean;
  answer_id: number;
  voted: boolean;
  downvoted: boolean;
  question_id: number;
  not_related: boolean;
  nb_question: number;
};

const initialState: ChatGPTState = (getState("ai") as ChatGPTState) || {
  messages: [],
  messagesHistory: [],
  messagesHistory_loading: true,
  history: [],
  questions: [],
  history_loading: true,
  loading: false,
  loadingImage: false,
  answer_id: -1,
  voted: false,
  downvoted: false,
  question_id: -1,
  not_related: false,
  nb_question: 0,
};

const pharmazingReducer = (
  state: ChatGPTState = initialState,
  action: any
): ChatGPTState => {
  switch (action.type) {
    case SET_LOADING_IMAGE:
      saveState("ai", { ...state, loadingImage: action.loading });
      return { ...state, loadingImage: action.loading };
    case INCREMENT_NB_QUESTION:
      saveState("ai", { ...state, nb_question: state.nb_question + 1 });
      return { ...state, nb_question: state.nb_question + 1 };
    case SET_VOTED:
      saveState("ai", { ...state, voted: action.voted });
      return { ...state, voted: action.voted };
    case SET_HISTORY_LOADING:
      saveState("ai", { ...state, history_loading: action.loading });
      return { ...state, history_loading: action.loading };
    case SET_MESSAGESHISTORY:
      saveState("ai", { ...state, messagesHistory: action.messages });
      return { ...state, messagesHistory: action.messages };
    case SET_MESSAGESHISTORY_LOADING:
      saveState("ai", {
        ...state,
        messagesHistory_loading: action.loading,
      });
      return { ...state, messagesHistory_loading: action.loading };
    case SET_NOT_RELATED:
      saveState("ai", { ...state, not_related: action.not_related });
      return { ...state, not_related: action.not_related };
    case SET_DOWNVOTED:
      saveState("ai", { ...state, downvoted: true });
      return { ...state, downvoted: true };
    case SET_ANSWER_ID:
      saveState("ai", { ...state, answer_id: action.answer_id });
      return { ...state, answer_id: action.answer_id };
    case SET_QUESTION_ID:
      saveState("ai", { ...state, question_id: action.question_id });
      return { ...state, question_id: action.question_id };
    case SET_HISTORY:
      saveState("ai", { ...state, history: action.history });
      return { ...state, history: action.history };
    case SET_LOADING:
      saveState("ai", { ...state, loading: action.loading });
      return { ...state, loading: action.loading };
    case RESET_MESSAGES:
      deleteState("ai");
      return {...initialState, messages: []};
    case RESET_USER:
      deleteState("ai");
      return {
        messages: [],
        messagesHistory: [],
        messagesHistory_loading: true,
        history: [],
        questions: [],
        history_loading: true,
        loading: false,
        loadingImage: false,
        answer_id: -1,
        voted: false,
        downvoted: false,
        question_id: -1,
        not_related: false,
        nb_question: 0,
      };
    case NOT_LOADING_LAST_ANSWER:
      const copyMessages = JSON.parse(JSON.stringify(state.messages));
      copyMessages[copyMessages.length - 1].loading = false;
      saveState("ai", { ...state, messages: copyMessages });
      return { ...state, messages: copyMessages };
    case SET_HAS_VOTED:
      const copyMessages1 = JSON.parse(JSON.stringify(state.messages));
      copyMessages1[action.idx].hasVoted = true;
      saveState("ai", { ...state, messages: copyMessages1 });
      return { ...state, messages: copyMessages1 };
    case SET_ICON_ACTION:
      const copyMessages2 = JSON.parse(JSON.stringify(state.messages));
      copyMessages2[action.idx].iconAction = action.iconAction;
      saveState("ai", { ...state, messages: copyMessages2 });
      return { ...state, messages: copyMessages2 };
    case REINIT_MESSAGES:
      const copyMessages3 = JSON.parse(JSON.stringify(state.messages));
      saveState("ai", { ...state, messages: copyMessages3 });
      return { ...state, messages: copyMessages3 };
    case SET_MESSAGES:
      const copyMessages4 = [...action.messages];
      saveState("ai", { ...state, messages: copyMessages4 });
      return { ...state, messages: copyMessages4 };
    case ADD_TO_MESSAGES:
      if (action.nb_question === state.nb_question) {
        const updatedMessages = JSON.parse(JSON.stringify(state.messages));
        const { role, content, insertNew, textParts, images } = action;
        if (insertNew) {
          updatedMessages.push({
            role,
            content,
            id: updatedMessages.length + 1,
            loading: true,
            textParts,
            images,
            hasVoted: false,
            iconAction: "NONE",
          });
        } else {
          const lastMessageIndex = updatedMessages.length - 1;
          updatedMessages[lastMessageIndex] = {
            ...updatedMessages[lastMessageIndex],
            loading: false,
            role,
            content,
            textParts,
            images,
          };
        }
        saveState("ai", { ...state, messages: updatedMessages });
        return { ...state, messages: updatedMessages };
      } else {
        saveState("ai", state);
        return state;
      }
    default:
      return state;
  }
};

export default pharmazingReducer;
