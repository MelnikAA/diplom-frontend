import { create } from 'zustand';

interface UserState {
  attempts: number;
  setAttempts: (attempts: number) => void;
}

export const useUserStore = create<UserState>((set) => ({
  attempts: 0,
  setAttempts: (attempts) => set({ attempts }),
})); 