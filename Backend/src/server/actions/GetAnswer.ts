"use server";

import axios from "axios";
import constants from "@/constants/general";
import { machineIdSync } from "node-machine-id";

export const GetAnswer = async (
  token: string,
  messages: any[],
  main_question_id: number,
  is_tablet: string,
  downvoted: boolean
): Promise<any> => {
  const uniqueId: string = machineIdSync(true);
  try {
    const response = await axios.post(
      constants.urlBase + "/questions/askQuestion",
      {
        messages,
        main_question_id,
        device_id: "",
        is_tablet,
        downvoted,
        appversion: 3,
        web: true
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
    return error;
  }
};
