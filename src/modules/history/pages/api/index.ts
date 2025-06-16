import axios from "axios";
import type { Prediction } from "../../../analysisPage/predictionModel";
import type { Patient } from "../model";

const API_BASE_URL = import.meta.env.VITE_BACK_ADDRESS;

interface GetPredictionsParams {
  page?: number;
  size?: number;
  has_tumor?: boolean;
  created_from?: string;
  created_to?: string;
  patient_id?: string;
}

interface PredictionsResponse {
  items: Prediction[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export const getPredictions = async (
  params: GetPredictionsParams = {}
): Promise<PredictionsResponse> => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Access token not found in localStorage");
  }

  try {
    const response = await axios.get<PredictionsResponse>(
      `${API_BASE_URL}api/v1/predictions/`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: params,
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Ошибка Axios при получении предсказаний:",
        error.response?.status,
        error.response?.data
      );
      throw new Error(
        error.response?.data.detail ||
          "Произошла ошибка при получении предсказаний"
      );
    } else {
      console.error("Неизвестная ошибка при получении предсказаний:", error);
      throw new Error(
        "Произошла неизвестная ошибка при получении предсказаний"
      );
    }
  }
};
export const getPatients = async (): Promise<Patient[]> => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Access token not found in localStorage");
  }

  try {
    const response = await axios.get<Patient[]>(
      `${API_BASE_URL}api/v1/patients/`,
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
        "Ошибка Axios при получении пациентов:",
        error.response?.status,
        error.response?.data
      );
      throw new Error(
        error.response?.data.detail ||
          "Произошла ошибка при получении пациентов"
      );
    } else {
      console.error("Неизвестная ошибка при получении пациентов:", error);
      throw new Error("Произошла неизвестная ошибка при получении пациентов");
    }
  }
};
