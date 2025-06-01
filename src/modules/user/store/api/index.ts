import $api from "../../../../shared/api";
import type { AxiosResponse } from "axios";
import type { IUsers, whoAmI, IAuthResponse } from "./model";

export default class UserService {
  static async getUsers(role?: string): Promise<AxiosResponse<IUsers>> {
    const basicAuthHeader = {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    };
    const params = role ? { role } : {};
    return $api.get<IUsers>("tracking-api/tracking/users", {
      headers: { ...basicAuthHeader },
      params,
    });
  }

  static async whoAmI(): Promise<AxiosResponse<whoAmI>> {
    const basicAuthHeader = {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    };

    // Проверяем значение VITE_BACK_ADDRESS
    // const baseURL =
    //   import.meta.env.VITE_BACK_ADDRESS === "https://yokozuna.sumotori.jp/api"
    //     ? "/api"
    //     : "/tracking-api";
    const baseURL = "/api";

    return $api.get<whoAmI>(`${baseURL}/whoami`, {
      headers: { ...basicAuthHeader },
    });
  }

  static async refreshToken(): Promise<AxiosResponse<IAuthResponse>> {
    return $api.post(
      "api/oauth/cookie-token",
      {},
      {
        withCredentials: true,
      }
    );
  }
}
