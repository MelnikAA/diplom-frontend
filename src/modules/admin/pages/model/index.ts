import { create } from "zustand";
import { createUser, getUsers, updateUser, deleteUser } from "../api";
import type { CreateUserPayload, User, UsersResponse } from "../api";

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  createUser: (userData: CreateUserPayload) => Promise<void>;
  updateUser: (id: number, userData: CreateUserPayload) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  loading: false,
  error: null,
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const response: UsersResponse = await getUsers();
      set({ users: response.items });
    } catch (error: any) {
      set({ error: error.message || "Ошибка при загрузке пользователей" });
    } finally {
      set({ loading: false });
    }
  },
  createUser: async (userData: CreateUserPayload) => {
    set({ loading: true, error: null });
    try {
      const newUser = await createUser(userData);
      set((state) => ({
        users: [...state.users, newUser],
      }));
    } catch (error: any) {
      set({ error: error.message || "Ошибка при создании пользователя" });
    } finally {
      set({ loading: false });
    }
  },
  updateUser: async (id: number, userData: CreateUserPayload) => {
    set({ loading: true, error: null });
    try {
      const updatedUser = await updateUser(id, userData);
      set((state) => ({
        users: state.users.map((user) => (user.id === id ? updatedUser : user)),
      }));
    } catch (error: any) {
      set({ error: error.message || "Ошибка при обновлении пользователя" });
    } finally {
      set({ loading: false });
    }
  },
  deleteUser: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await deleteUser(id);
      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message || "Ошибка при удалении пользователя" });
    } finally {
      set({ loading: false });
    }
  },
}));
