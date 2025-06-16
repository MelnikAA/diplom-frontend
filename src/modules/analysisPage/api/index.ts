import axios from "axios";
import type { Prediction } from "../predictionModel";

const API_BASE_URL = import.meta.env.VITE_BACK_ADDRESS;

export const uploadPredictionFile = async (file: File): Promise<Prediction> => {
  const formData = new FormData();
  formData.append("file", file);

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Access token not found in localStorage");
  }

  try {
    const response = await axios.post<Prediction>(
      `${API_BASE_URL}api/v1/predictions/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Ошибка Axios при загрузке файла:",
        error.response?.status,
        error.response?.data
      );
      throw new Error(
        error.response?.data.detail || "Произошла ошибка при загрузке файла"
      );
    } else {
      console.error("Неизвестная ошибка при загрузке файла:", error);
      throw new Error("Произошла неизвестная ошибка при загрузке файла");
    }
  }
};

export const getPredictionById = async (id: string): Promise<Prediction> => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Access token not found in localStorage");
  }

  try {
    const response = await axios.get<Prediction>(
      `${API_BASE_URL}api/v1/predictions/${id}/`,
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
        `Ошибка Axios при получении предсказания с ID ${id}:`,
        error.response?.status,
        error.response?.data
      );
      throw new Error(
        error.response?.data.detail ||
          `Произошла ошибка при получении предсказания с ID ${id}`
      );
    } else {
      console.error(
        `Неизвестная ошибка при получении предсказания с ID ${id}:`,
        error
      );
      throw new Error(
        `Произошла неизвестная ошибка при получении предсказания с ID ${id}`
      );
    }
  }
};
