"use server";

import axios from "axios";
import constants from "@/constants/general";

export const RegisterUser = async (phonenumber: string): Promise<boolean> => {
  try {
    const response = await axios.post(
      constants.urlBase + "/users/phonenumberRegistered",
      {
        phonenumber,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const { data } = response;
    if (data.registered === 1) {
      return true;
    }
    return false;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
