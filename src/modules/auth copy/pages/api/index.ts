import { AxiosError, type AxiosResponse } from "axios";

import $apiWithHeaders from "../../../../shared/api/apiWithHeaders";
import type {
  AuthorizationResponse,
  GuestAuthorizationError,
  GuestAuthResponse,
  GuestVerificationResponse,
  IAuth,
  IRefresh,
} from "./model";
import $api from "../../../../shared/api";

const clientId = "client";
const clientSecret = "b3251795-5d6a-47ae-8667-0a268246e33a";

export default class AuthService {
  static async setPassword(
    Auth: IAuth
  ): Promise<AxiosResponse<AuthorizationResponse>> {
    const formData = new FormData();
    formData.append("username", Auth.username);
    formData.append("password", Auth.password);
    formData.append("grant_type", Auth.grant_type);
    formData.append("scope", Auth.scope);

    const basicAuthHeader = {
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    };

    try {
      const response = await $api.post("api/v1/auth/login", formData, {
        headers: {
          ...basicAuthHeader,
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      /*       console.error("Authorization error:", error);*/

      if (error instanceof Error) {
        if ((error as any).response) {
          throw new Error(
            `Authorization failed: ${
              (error as any).response.data.error_description ||
              (error as any).response.data.error
            }`
          );
        } else if ((error as any).request) {
          throw new Error("Authorization failed: No response from server.");
        } else {
          throw new Error(`Authorization failed: ${error.message}`);
        }
      } else {
        throw new Error("Authorization failed: Unknown error occurred.");
      }
    }
  }

  static async authorizationRefresh(
    Refresh: IRefresh
  ): Promise<AxiosResponse<AuthorizationResponse>> {
    const formData = new FormData();

    formData.append("grant_type", Refresh.grant_type);
    formData.append("scope", Refresh.scope);
    formData.append("refresh_token", Refresh.refresh_token);
    const basicAuthHeader = {
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    };

    return $api.post("api/v1/auth/login", formData, {
      headers: {
        ...basicAuthHeader,
        "Content-Type": "multipart/form-data",
      },
    });
  }
  static async authorizationByEmail(
    credential: string
  ): Promise<AxiosResponse<GuestAuthResponse>> {
    return $apiWithHeaders.post<GuestAuthResponse>(
      "/api/authorization/flow/begin-by-email",
      { credential },
      {
        headers: {},
      }
    );
  }

  static async authorizationTelegram(
    credential: string
  ): Promise<AxiosResponse<GuestAuthResponse>> {
    return $apiWithHeaders.post<GuestAuthResponse>(
      "/api/authorization/flow/begin-by-telegram",
      { credential },
      {
        headers: {},
      }
    );
  }

  static async authorizationSMS(
    credential: string
  ): Promise<AxiosResponse<GuestAuthResponse>> {
    return $apiWithHeaders.post<GuestAuthResponse>(
      "/api/authorization/flow/begin-by-sms",
      { credential },
      {
        headers: {},
      }
    );
  }

  static async emailVerification(
    completeCode: string,
    id: string
  ): Promise<AxiosResponse<GuestVerificationResponse>> {
    try {
      return await $apiWithHeaders.post<GuestVerificationResponse>(
        `/api/authorization/flow/${id}/complete`,
        { completeCode },
        {
          headers: {},
        }
      );
    } catch (error) {
      const err = error as AxiosError;
      if (err.response && err.response.data) {
        const errorData = err.response.data as GuestAuthorizationError;
        throw new Error(errorData.message);
      } else {
        throw error;
      }
    }
  }

  static async ResendCode(
    id: string
  ): Promise<AxiosResponse<GuestAuthResponse>> {
    return $apiWithHeaders.post<GuestAuthResponse>(
      `/api/authorization/flow/${id}/resend`,
      { id },
      {
        headers: {},
      }
    );
  }
}
