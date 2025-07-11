import { create } from "zustand";
import { FullUserInfo } from "@/features/users/types/userInfo";

interface UserStore {
  userInfo: FullUserInfo | null;
  setUserInfo: (info: FullUserInfo) => void;
  clearUserInfo: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userInfo: null,
  setUserInfo: (info) => set({ userInfo: info }),
  clearUserInfo: () => set({ userInfo: null }),
}));
