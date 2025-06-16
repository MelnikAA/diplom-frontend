import { create } from "zustand";
import type { FileWithPath } from "@mantine/dropzone";
import type { Prediction } from "../predictionModel";
import {
  uploadPredictionFile,
  getPredictionById,
} from "../../../api/predictions";

interface AnalysisState {
  selectedFile: FileWithPath | null;
  predictionResult: Prediction | null;
  isLoading: boolean;
  error: string | null;
  setSelectedFile: (file: FileWithPath | null) => void;
  uploadFile: (payload: {
    file: File;
    patient_id?: number;
    notes?: string;
  }) => Promise<void>;
  fetchPredictionById: (id: string) => Promise<void>;
  resetState: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  selectedFile: null,
  predictionResult: null,
  isLoading: false,
  error: null,
  setSelectedFile: (file) => {
    set({ selectedFile: file });
  },
  uploadFile: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const result = await uploadPredictionFile(payload);
      set({ predictionResult: result });
    } catch (err: any) {
      set({ error: err.message || "Произошла ошибка при отправке файла." });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchPredictionById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await getPredictionById(id);
      set({ predictionResult: result });
    } catch (err: any) {
      set({
        error:
          err.message ||
          `Произошла ошибка при получении предсказания с ID ${id}.`,
      });
    } finally {
      set({ isLoading: false });
    }
  },
  resetState: () => {
    set({
      selectedFile: null,
      predictionResult: null,
      isLoading: false,
      error: null,
    });
  },
}));
