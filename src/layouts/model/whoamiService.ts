import type { whoami } from "./model";

export async function fetchWhoami(): Promise<whoami> {
  try {
    const baseUrl = import.meta.env.VITE_BACK_ADDRESS;
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      handleLogout();
      throw new Error("Access token not found in localStorage");
    }

    const response = await fetch(`${baseUrl}api/v1/whoami`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 401 || response.status === 403) {
      handleLogout();
      throw new Error("Unauthorized access");
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: whoami = await response.json();
    return data;
  } catch (error) {
    console.error("Ошибка при получении данных whoami:", error);
    throw error;
  }
}

function handleLogout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
}
