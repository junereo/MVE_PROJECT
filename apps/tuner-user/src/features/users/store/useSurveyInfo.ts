import { create } from "zustand";
import type { UserInfo } from "../types/userInfo";

interface UserInfoState extends UserInfo {
  setUserInfo: (info: UserInfo) => void;
  resetUserInfo: () => void;
}

export const useSurveyInfo = create<UserInfoState>((set) => ({
  gender: "",
  age: "",
  genres: [],
  isMusicRelated: "",

  setUserInfo: (info) => set(info),
  resetUserInfo: () =>
    set({ gender: "", age: "", genres: [], isMusicRelated: "" }),
}));
