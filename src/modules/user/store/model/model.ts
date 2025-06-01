import { AxiosError } from "axios";
import { create } from "zustand";
import UserService from "../api";
import type { ISettings, IUser } from "../api/model";

interface UserStoreState {
  meUser: IUser | null;
  whoAmI: () => void;
  refreshAccessToken: () => Promise<void>;
  settings: ISettings | null;
  auctionBidConfirmationRequired: boolean;
  auctionBidModerationRequired: boolean;
  isLoading: boolean;
}

const useUsersStore = create<UserStoreState>((set, get) => ({
  meUser: null,
  settings: null,
  auctionBidModerationRequired: true,
  auctionBidConfirmationRequired: true,
  isLoading: true,
  whoAmI: async () => {
    try {
      set({ isLoading: true });
      const response = await UserService.whoAmI();
      set({
        meUser: response.data.user,
        settings: response.data.settings,
        auctionBidConfirmationRequired:
          response.data.auctionBidConfirmationRequired,
        auctionBidModerationRequired:
          response.data.auctionBidModerationRequired,
        isLoading: false,
      });
    } catch (error) {
      if ((error as AxiosError).response?.status === 401) {
        if (import.meta.env.VITE_IS_CHINA_TRACKING === "false") {
          await get().refreshAccessToken();
          // После обновления токена можно снова вызвать whoAmI
          await get().whoAmI();
        } else {
        }
      } else {
        /*         console.error("Ошибка при получении пользователя:", error);*/
      }
      set({ isLoading: false });
    }
  },

  refreshAccessToken: async () => {
    try {
      const responseCookie = await UserService.refreshToken();
      const newAccessToken = responseCookie.data.access_token;
      localStorage.setItem("accessToken", newAccessToken);
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.code === "ERR_NETWORK") {
        /*         console.error("Ошибка сети. Проверьте подключение к интернету.");*/
      } else if (axiosError.response) {
        if (axiosError.response.status === 401) {
          /*           console.error("Неавторизован, требуется повторная авторизация.");*/
          localStorage.removeItem("accessToken");
        }
        if (axiosError.response.status === 404) {
          console.log("axiosError.response.status", axiosError.response.status);
          import.meta.env.VITE_BACK_ADDRESS == "https://yokozuna.sumotori.jp/"
            ? (window.location.href = "/auth/sumotori") //"https://auto.sumotori.jp/account"
            : (window.location.href = "/auth");
        } else {
          /*           console.error(
            "Ошибка при обновлении токена:",
            axiosError.response.status
          );*/
        }
      } else if (axiosError.request) {
        /*         console.error("Не удалось получить ответ от сервера.");*/
      } else {
        /*         console.error("Ошибка при настройке запроса:", axiosError.message);*/
      }
    }
  },
}));

export default useUsersStore;
