import { useWhoamiStore } from "../../../layouts/model/whoamiStore";

export const useAuth = () => {
  const { user, loading } = useWhoamiStore();

  return { user, loading };
};
