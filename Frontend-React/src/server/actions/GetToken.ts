"use server";

import axios from "axios";
import constants from "@/constants/general";

export const GetToken = async (refreshToken: string): Promise<string> => {
  try {
    const response = await axios.post(
      `${constants.urlBase}/users/token`,
      { refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data) {
      return response.data.accessToken;
    }
    return "";
  } catch (error: any) {
    throw new Error(error.message);
  }
};
