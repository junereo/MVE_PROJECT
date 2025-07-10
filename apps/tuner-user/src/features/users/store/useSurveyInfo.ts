import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserInfo } from "../types/userInfo";

interface UserInfoState extends UserInfo {
  setUserInfo: (info: Partial<UserInfo>) => void;
  resetUserInfo: () => void;
}

export const useSurveyInfo = create<UserInfoState>()(
  persist(
    (set) => ({
      gender: "남성",
      age: "",
      genres: [],
      jobDomain: false,

      setUserInfo: (info) => set((prev) => ({ ...prev, ...info })),
      // 상태 초기화
      resetUserInfo: () => {
        set({ gender: "남성", age: "", genres: [], jobDomain: false });

        // localStorage에서도 제거
        if (typeof window !== "undefined") {
          localStorage.removeItem("survey-user-info");
        }
      },
    }),
    {
      name: "survey-user-info", // localStorage key
    }
  )
);
