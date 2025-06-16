import { create } from "zustand";
import Cookies from "js-cookie";
import AuthService from "../api";
import useUsersStore from "../../../user/store/model/model";

interface AuthStore {
  accessToken: string | null;
  refreshToken: string | null;
  error: string | null;
  setError: (error: string | null) => void;
  // isIntroModalShown: boolean;
  // setIntroModalShown: (value: boolean) => void;
  // isFirstBetMade: boolean;
  // setFirstBetMade: (value: boolean) => void;

  refresh: () => Promise<void>;
  logout: () => void; // New logout action
  loading: boolean;

  //Авторизация для гостя (с клиентского калькулятора)
  selectedMethod: string | null;
  email: string;
  ttl: number | null;
  timerId: number | NodeJS.Timeout | null;
  isButtonsDisabled: boolean;
  code: string;
  verificationId: string;

  startTtlTimer: () => void;
  setEmail: (value: string) => void;
  setCode: (value: string) => void;
  setVerificationId: (value: string) => void;
  setTtl: (value: number) => void;
  setSelectedMethod: (method: string | null) => void;
  setIsButtonsDisabled: (value: boolean) => void;

  handleCodeSubmit: () => Promise<void>;
  emailSubmit: (email: string) => Promise<void>;
  handlePhoneSubmit: (
    phone: string,
    method: "SMS" | "Telegram"
  ) => Promise<void>;
}

const useAuthStore = create<AuthStore>((set) => ({
  username: "",
  password: "",
  accessToken: null,
  refreshToken: Cookies.get("refreshToken") || null,
  loading: false,
  error: null,
  selectedMethod: null,

  setError: (error: string | null) => {
    set({ error });
  },

  refresh: async () => {
    set({ loading: true });

    const response = await AuthService.authorizationRefresh({
      refresh_token: Cookies.get("refreshToken")!,
      grant_type: "refresh_token",
      scope: "web",
    });

    set({
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
    });
    Cookies.set("refreshToken", response.data.refresh_token, { expires: 7 });

    set({ loading: false });
  },

  logout: () => {
    Cookies.remove("refreshToken");
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("isFirstBetMade");
  },

  // isIntroModalShown: JSON.parse(localStorage.getItem("isIntroModalShown") || "false"),
  // setIntroModalShown: (value: boolean) => {
  //   localStorage.setItem("isIntroModalShown", JSON.stringify(value));
  //   set({ isIntroModalShown: value });
  // },

  // isFirstBetMade: JSON.parse(sessionStorage.getItem("isFirstBetMade") || "false"),
  // setFirstBetMade: (value: boolean) => {
  //   sessionStorage.setItem("isFirstBetMade", JSON.stringify(value));
  //   set({ isFirstBetMade: value });
  // },

  //Авторизация для гостя (с клиентского калькулятора)
  ttl: null,
  timerId: null,
  isButtonsDisabled: true,
  code: "",
  verificationId: "",
  email: "",

  setEmail: (value: string) => set({ email: value }),
  setCode: (value: string) => set({ code: value }),
  setVerificationId: (value: string) => set({ verificationId: value }),
  setTtl: (value: number) => set({ ttl: value }),
  setAccessToken: (value: string | "") => set({ accessToken: value }),
  setSelectedMethod: (method: string | null) => set({ selectedMethod: method }),
  setIsButtonsDisabled: (value: boolean) => set({ isButtonsDisabled: value }),

  handlePhoneSubmit: async (phone: string, method: "SMS" | "Telegram") => {
    const cleanedPhone = phone.replace(/[\s+\-().]/g, "");

    try {
      set({ error: null });
      let response;
      if (method === "SMS") {
        response = await AuthService.authorizationSMS(cleanedPhone);
      } else if (method === "Telegram") {
        response = await AuthService.authorizationTelegram(cleanedPhone);
        window.location.href = response.data.url;
      }
      set({ verificationId: response?.data.id, ttl: response?.data.ttl });
      useAuthStore.getState().startTtlTimer();
    } catch (error) {
      /*             console.error("Error during code submission:", error);*/
      set({ error: "Произошла ошибка при отправке запроса." });
    }
  },
  emailSubmit: async (email: string) => {
    try {
      set({ error: null });

      const response = await AuthService.authorizationByEmail(email);

      set({ verificationId: response?.data.id, ttl: response?.data.ttl });
      useAuthStore.getState().startTtlTimer();
    } catch (error) {
      /*             console.error("Error during code submission:", error);*/
      set({ error: "Произошла ошибка при отправке запроса." });
    }
  },
  handleCodeSubmit: async () => {
    try {
      set({ error: null });
      const response = await AuthService.emailVerification(
        useAuthStore.getState().code,
        useAuthStore.getState().verificationId
      );
      set({ accessToken: response.data.access_token });

      localStorage.setItem("accessToken", response.data.access_token);
      Cookies.set("refreshToken", response.data.refresh_token, { expires: 7 });
      useUsersStore.getState().whoAmI();
    } catch (error) {
      /*             console.error("Error during code verification:", error);*/
      set({ error: (error as Error).message });
      throw error;
    }
  },
  resendCode: async () => {
    try {
      set({ error: null });
      const response = await AuthService.ResendCode(
        useAuthStore.getState().verificationId
      );
      set({ verificationId: response.data.id, ttl: response.data.ttl });
      useAuthStore.getState().startTtlTimer();
    } catch (error) {
      /*             console.error("Error during code submission:", error);*/
      set({ error: "Произошла ошибка при отправке запроса." });
    }
  },
  startTtlTimer: () => {
    const ttl = useAuthStore.getState().ttl;
    if (ttl !== null && ttl > 0) {
      const timerId = setInterval(() => {
        set((state) => ({ ttl: state.ttl! - 1 }));

        const currentTtl = useAuthStore.getState().ttl;
        if (currentTtl !== null && currentTtl <= 0) {
          clearInterval(timerId);
          set({ timerId: null, isButtonsDisabled: false });
        }
      }, 1000);
      set({ timerId });
    }
  },
}));

export default useAuthStore;
