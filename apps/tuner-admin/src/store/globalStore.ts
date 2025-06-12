// src/features/user/home/store/useHomeStore.ts
import { create } from "zustand"; // ✅ 여기서 1번만 불러옴

type HomeState = {
    activeTab: string;
    setActiveTab: (tab: string) => void;
};

export const useHomeStore = create<HomeState>((set) => ({
    activeTab: "recommend",
    setActiveTab: (tab) => set({ activeTab: tab }),
}));
