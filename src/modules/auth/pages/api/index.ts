import axios, { AxiosError, type AxiosResponse } from "axios";

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
  static async authorizationSumotori(
    tel: string,
    pass: string
  ): Promise<AxiosResponse> {
    // Возвращаем только authResponse
    const timestamp = Date.now();

    // 1. Очистка и валидация номера
    const cleanedTel = tel.replace(/\D/g, "");
    if (!/^7\d{10}$/.test(cleanedTel)) {
      throw new Error("Неверный формат номера телефона");
    }

    // 2. Форматирование телефона
    const formattedTel = `+${cleanedTel.substring(
      0,
      1
    )} (${cleanedTel.substring(1, 4)}) ${cleanedTel.substring(
      4,
      7
    )}-${cleanedTel.substring(7, 11)}`;
    const encodedTel = encodeURIComponent(formattedTel)
      .replace(/%20/g, " ")
      .replace(/%28/g, "(")
      .replace(/%29/g, ")")
      .replace(/%2D/g, "-");

    try {
      // 3. Авторизация в Sumotori (основной запрос)
      const authUrl = `load.php?file=auth&tel=${encodedTel}&pass=${encodeURIComponent(
        pass
      )}&_=${timestamp}`;
      const authResponse = await $api.get(`sumotori-api/${authUrl}`, {
        withCredentials: true,
      });

      if (authResponse.data[0]?.cnt !== "1") {
        throw new Error("Ошибка авторизации в Sumotori");
      }

      const userId = authResponse.data[0]?.user;

      // 4. Пытаемся сделать POST запрос, но не прерываем выполнение при ошибке
      try {
        const postData = new URLSearchParams();
        postData.append("phone", formattedTel);
        postData.append("pass", pass);
        postData.append("f_reg", "1");
        postData.append("user_auth", userId);

        await axios.post("https://auto.sumotori.jp/main", postData.toString(), {
          withCredentials: true,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
      } catch (postError) {
        console.warn(
          "POST запрос на /main не выполнен, но куки уже установлены:",
          postError
        );
      }

      return authResponse;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(
          `Sumotori auth failed: ${
            error.response?.data?.message || error.message
          }`
        );
      }
      throw new Error("Sumotori auth failed: Unknown error");
    }
  }
  static async authorization(
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
