"use server";

import axios from "axios";
import constants from "@/constants/general";

export const SendVerificationSMS = async (
  phonenumber: string,
  token: number,
  lng: "en" | "de"
): Promise<boolean> => {
  try {
    const response = await axios.post(
      `${constants.urlBase}/users/sendVerificationSMS`,
      { phonenumber, token, lng },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const { data } = response;
    if (data.success) {
      return true;
    }
    return false;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
