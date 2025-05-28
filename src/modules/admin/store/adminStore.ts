import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  attempts: number;
  blocked: boolean;
}

interface AdminState {
  users: User[];
  setUsers: (users: User[]) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
})); 