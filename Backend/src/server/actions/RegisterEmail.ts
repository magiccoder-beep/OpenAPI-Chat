"use server";

import axios from "axios";
import constants from "@/constants/general";
import { machineIdSync } from "node-machine-id";

export const RegisterEmail = async (
  email: string,
  password: string,
  phonenumber: string,
  name: string,
  surname: string,
  university: string,
  studies: string,
  country: string,
  platform: string,
  country_device: string,
  is_tablet: string,
  occupation: string
): Promise<{
  success: boolean;
  error_code: any;
  admin?: boolean;
  accessToken?: string;
  refreshToken?: string;
}> => {
  try {
    const uniqueId: string = machineIdSync(true);
    const response = await axios.post(
      constants.urlBase + "/users/registerEmail",
      {
        email,
        password,
        phonenumber,
        name,
        surname,
        university,
        studies,
        country,
        platform,
        trial: 1,
        country_device,
        device_id: "",
        is_tablet,
        occupation: occupation,
        web: true
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const json = response.data;
    if (json.success === 0) {
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
