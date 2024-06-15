"use server";

import axios from "axios";
import constants from "@/constants/general";

export const ResetPassword = async (
  email: string,
  code: string,
  password: string
) => {
  try {
    const response = await axios.post(
      `${constants.urlBase}/users/resetPassword`,
      { email, code, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const json = response.data;
    if (json.success > 0) {
      return true;
    }
    return false;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
