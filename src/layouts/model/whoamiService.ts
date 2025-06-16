import type { whoami } from "./model";

export async function fetchWhoami(): Promise<whoami> {
  try {
    const baseUrl = import.meta.env.VITE_BACK_ADDRESS;
    // Здесь нужно будет указать реальный эндпоинт API
    const accessToken = localStorage.getItem("accessToken"); // Получаем токен из локального хранилища
    if (!accessToken) {
      // Обработайте случай, если токен отсутствует (пользователь не авторизован)
      throw new Error("Access token not found in localStorage");
    }
    const response = await fetch(`${baseUrl}api/v1/whoami`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: whoami = await response.json();
    return data;
  } catch (error) {
    console.error("Ошибка при получении данных whoami:", error);
    // В реальном приложении здесь может быть более сложная обработка ошибок
    throw error;
  }
}
