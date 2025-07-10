import { create } from "zustand";

interface User {
  id: string;
  nickname: string;
  role: "ordinary" | "expert" | "admin";
}

interface AuthState {
  user: User | null; // 로그인 한 사용자
  isInitialized: boolean; // 로그인 체크 여부
  setUser: (user: User | null) => void;
  logout: () => void;
  setInitialized: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  isInitialized: false,
  logout: () => set({ user: null }),
  setInitialized: (value: boolean) => set({ isInitialized: value }),
}));
