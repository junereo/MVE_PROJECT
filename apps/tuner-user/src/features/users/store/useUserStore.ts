import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FullUserInfo } from "@/features/users/types/userInfo";

interface UserStore {
  userInfo: FullUserInfo | null;
  setUserInfo: (info: FullUserInfo) => void;
  clearUserInfo: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userInfo: null,
      setUserInfo: (info) => set({ userInfo: info }),
      clearUserInfo: () => set({ userInfo: null }),
    }),
    {
      name: "user-storage", // localStorage key 이름
      partialize: (state) => ({ userInfo: state.userInfo }), // 필요한 정보만 저장
    }
  )
);
