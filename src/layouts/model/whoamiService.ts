import type { whoami } from "./model";
import axios from "axios";

export async function fetchWhoami(): Promise<whoami> {
  try {
    const baseUrl = import.meta.env.VITE_BACK_ADDRESS;
    const accessToken = localStorage.getItem("accessToken");
    console.log("baseUrl", baseUrl);

    if (!accessToken) {
      handleLogout();
      throw new Error("Access token not found in localStorage");
    }

    const response = await axios.get(`${baseUrl}api/v1/whoami`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 401 || response.status === 403) {
      handleLogout();
      throw new Error("Unauthorized access");
    }

    return response.data;
  } catch (error) {
    console.error("Ошибка при получении данных whoami:", error);
    if (
      axios.isAxiosError(error) &&
      (error.response?.status === 401 || error.response?.status === 403)
    ) {
      handleLogout();
    }
    throw error;
  }
}

function handleLogout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
}
