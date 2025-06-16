import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACK_ADDRESS;

export interface User {
  id: number;
  full_name: string;
  email: string;
  is_superuser: boolean;
  is_active: boolean;
}

export interface UsersResponse {
  items: User[];
  total_count: number;
}

export interface CreateUserPayload {
  email: string;
  full_name: string;
  is_superuser?: boolean;
}

export interface UpdateUserPayload {
  id: number;
  email: string;
  full_name: string;
}

export const getUsers = async (): Promise<UsersResponse> => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Access token not found in localStorage");
  }

  try {
    const response = await axios.get<UsersResponse>(
      `${API_BASE_URL}api/v1/users/`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Ошибка Axios при получении пользователей:",
        error.response?.status,
        error.response?.data
      );
      throw new Error(
        error.response?.data.detail ||
          "Произошла ошибка при получении пользователей"
      );
    } else {
      console.error("Неизвестная ошибка при получении пользователей:", error);
      throw new Error(
        "Произошла неизвестная ошибка при получении пользователей"
      );
    }
  }
};

export const createUser = async (
  userData: CreateUserPayload
): Promise<User> => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Access token not found in localStorage");
  }

  try {
    const response = await axios.post<User>(
      `${API_BASE_URL}api/v1/users/`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Ошибка Axios при создании пользователя:",
        error.response?.status,
        error.response?.data
      );
      throw new Error(
        error.response?.data.detail ||
          "Произошла ошибка при создании пользователя"
      );
    } else {
      console.error("Неизвестная ошибка при создании пользователя:", error);
      throw new Error("Произошла неизвестная ошибка при создании пользователя");
    }
  }
};

export const updateUser = async (
  id: number,
  userData: CreateUserPayload
): Promise<User> => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Access token not found in localStorage");
  }

  try {
    const response = await axios.put<User>(
      `${API_BASE_URL}api/v1/users/${id}/`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Ошибка Axios при обновлении пользователя:",
        error.response?.status,
        error.response?.data
      );
      throw new Error(
        error.response?.data.detail ||
          "Произошла ошибка при обновлении пользователя"
      );
    } else {
      console.error("Неизвестная ошибка при обновлении пользователя:", error);
      throw new Error(
        "Произошла неизвестная ошибка при обновлении пользователя"
      );
    }
  }
};

export const deleteUser = async (id: number): Promise<void> => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Access token not found in localStorage");
  }

  try {
    await axios.delete(`${API_BASE_URL}api/v1/users/${id}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Ошибка Axios при удалении пользователя:",
        error.response?.status,
        error.response?.data
      );
      throw new Error(
        error.response?.data.detail ||
          "Произошла ошибка при удалении пользователя"
      );
    } else {
      console.error("Неизвестная ошибка при удалении пользователя:", error);
      throw new Error("Произошла неизвестная ошибка при удалении пользователя");
    }
  }
};

export const resetUserPassword = async (userId: number): Promise<void> => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Access token not found in localStorage");
  }

  try {
    await axios.post(
      `${API_BASE_URL}api/v1/users/${userId}/reset-password-request`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Ошибка при запросе сброса пароля:",
        error.response?.status,
        error.response?.data
      );
      throw new Error(
        error.response?.data.detail ||
          "Произошла ошибка при запросе сброса пароля"
      );
    } else {
      console.error("Неизвестная ошибка при запросе сброса пароля:", error);
      throw new Error("Произошла неизвестная ошибка при запросе сброса пароля");
    }
  }
};
