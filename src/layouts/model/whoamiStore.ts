import { create } from "zustand";
import { fetchWhoami } from "./whoamiService";
import type { whoami } from "./model";

interface WhoamiState {
  user: whoami | null;

  loading: boolean;
  error: Error | null;
  fetchUser: () => Promise<void>;
  resetUser: () => void;
}

export const useWhoamiStore = create<WhoamiState>((set) => ({
  user: null,
  loading: false,
  error: null,
  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchWhoami();
      set({ user: data, loading: false });
    } catch (error: any) {
      if (error?.response?.status === 401) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
      set({ error, loading: false });
    }
  },
  resetUser: () => {
    set({ user: null, loading: false, error: null });
  },
}));
