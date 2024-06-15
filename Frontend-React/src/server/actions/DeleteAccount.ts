"use server";

import axios from "axios";
import constants from "@/constants/general";

export const DeleteAccount = async (token: string): Promise<boolean> => {
  try {
    const response = await axios.post(
      `${constants.urlBase}/users/deleteAccount`,
      {},
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: "Bearer " + token,
        },
      }
    );

    if (response.data) {
      return true;
    } else {
      return false;
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};
