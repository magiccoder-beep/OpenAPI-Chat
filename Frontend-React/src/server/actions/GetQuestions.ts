"use server";

import axios from "axios";
import constants from "@/constants/general";

export const GetQuestions = async (
  token: string,
  question_id: number
): Promise<{ success: boolean; messages: any[] }> => {
  try {
    const response = await axios.post(
      constants.urlBase + "/users/fetchMessagesQuestion",
      { question_id },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    const json = response.data;
    return {
      success: json.success,
      messages: json.messages,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};
