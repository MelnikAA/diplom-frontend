import { create } from "zustand";
import { getPatients, getPredictions } from "../api";
import type { Prediction } from "../../../analysisPage/predictionModel";

interface GetPredictionsParams {
  page?: number;
  size?: number;
  has_tumor?: boolean;
  created_from?: string;
  created_to?: string;
  patient_id?: string;
  owner_id?: string;
}
export interface Patient {
  id: number;
  full_name: string;
  birth_date: string;
  external_id: string;
}

interface HistoryState {
  predictions: Prediction[];
  patients: Patient[];
  total: number;
  page: number;
  size: number;
  pages: number;
  isLoading: boolean;
  error: string | null;
  filters: GetPredictionsParams;
  fetchPredictions: () => Promise<void>;
  fetchPatient: () => Promise<void>;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  setFilters: (filters: Partial<GetPredictionsParams>) => void;
  resetFilters: () => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  predictions: [],
  patients: [],

  total: 0,
  page: 1,
  size: 10,
  pages: 0,
  isLoading: false,
  error: null,
  filters: {
    has_tumor: undefined,
    created_from: undefined,
    created_to: undefined,
    patient_id: undefined,
  },
  fetchPredictions: async () => {
    set({ isLoading: true, error: null });
    const { page, size, filters } = get();
    try {
      const response = await getPredictions({
        page,
        size,
        ...filters,
      });
      set({
        predictions: response.items,
        total: response.total,
        pages: response.pages,
      });
    } catch (err: any) {
      set({
        error:
          err.message || "Произошла ошибка при загрузке истории предсказаний.",
      });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchPatient: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getPatients();
      set({
        patients: response,
      });
    } catch (err: any) {
      set({
        error: err.message || "Произошла ошибка при загрузке пациентов.",
      });
    } finally {
      set({ isLoading: false });
    }
  },
  setPage: (page) => set({ page }),
  setSize: (size) => set({ size }),
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      page: 1, // Сбрасываем на первую страницу при изменении фильтров
    })),
  resetFilters: () =>
    set({
      filters: {
        has_tumor: undefined,
        created_from: undefined,
        created_to: undefined,
        patient_id: undefined,
      },
      page: 1,
    }),
}));
