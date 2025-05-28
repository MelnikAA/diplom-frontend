import { create } from 'zustand';

interface HistoryItem {
  id: string;
  date: string;
  result: string;
}

interface HistoryState {
  items: HistoryItem[];
  setItems: (items: HistoryItem[]) => void;
}

export const useHistoryStore = create<HistoryState>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
})); 