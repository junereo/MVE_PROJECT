// 전역으로 관리되는 로그인 사용자 상태
import { create } from "zustand"; // 

type HomeState = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export const useHomeStore = create<HomeState>((set) => ({
  activeTab: "recommend",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));

// 전역 로그인 input
type OauthState = {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  phone_number: string;
  role: string;
  setValue: (key: keyof OauthState, value: string) => void;
  reset: () => void;
};

const initialState = {
  name: '',
  email: '',
  password: '',
  confirm_password: '',
  phone_number: '',
  role: ''
};

export const useOauth = create<OauthState>((set) => ({
  ...initialState,

  setValue: (key, value) =>
    set((state) => ({
      ...state,
      [key]: value,
    })),

  reset: () => set(initialState),
}));