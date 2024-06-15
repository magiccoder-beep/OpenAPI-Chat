"use server";

import axios from "axios";
import constants from "@/constants/general";
import { machineIdSync } from "node-machine-id";

export const LoginEmail = async (
  email: string,
  password: string,
  is_tablet: string,
  platform: string
): Promise<{
  success: boolean;
  error_code: any;
  admin?: boolean;
  name?: string;
  studies?: string;
  accessToken?: string;
  refreshToken?: string;
}> => {
  try {
    const uniqueId: string = machineIdSync(true);
    const response = await axios.post(
      constants.urlBase + "/users/loginEmail",
      {
        email,
        password,
        device_id: "",
        is_tablet,
        platform,
        web: true
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const json = response.data;
    if (json.success == 0) {
      return {
        success: false,
        error_code: json.error_code,
      };
    }
    if (json.success > 0) {
      return {
        success: true,
        error_code: "NONE",
        admin: json.admin,
        name: json.name,
        studies: json.studies,
        accessToken: json.accessToken,
        refreshToken: json.refreshToken,
      };
    }
    return {
      success: false,
      error_code: "ERROR_OCCURED",
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};
