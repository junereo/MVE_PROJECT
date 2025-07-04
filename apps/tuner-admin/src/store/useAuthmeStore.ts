// 전역 으로 관리 되는 로그인 상태관리
import { create } from "zustand";

type AdminType = {
  id: number;
  email: string;
  nickname: string;
  role: "admin" | "superadmin";
  balance: number;
};

type SessionState = {
  user: AdminType | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  setAdmin: (user: AdminType) => void;
  logout: () => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  isLoading: true,
  isLoggedIn: false,

  setAdmin: (user) =>
    set({
      user,
      isLoading: false,
      isLoggedIn: true,
    }),
  logout: () =>
    set({
      user: null,
      isLoading: false,
      isLoggedIn: false,
    }),
}));
