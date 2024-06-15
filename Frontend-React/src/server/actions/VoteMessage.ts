"use server";

import axios from "axios";
import constants from "@/constants/general";

export const VoteMessage = async (
  token: string,
  upvote: boolean,
  downvote: boolean,
  answer_id: number
) => {
  try {
    const response = await axios.post(
      constants.urlBase + "/votes/vote",
      {
        answer_id,
        upvote,
        downvote,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
