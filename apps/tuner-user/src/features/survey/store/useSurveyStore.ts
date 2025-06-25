import { create } from "zustand";

export type SurveyStep2 = {
  title: string;
  isReleased: boolean;
  releaseDate: string;
  genre: string;
};

interface SurveyState {
  step2: SurveyStep2;
  setStep2: (data: Partial<SurveyStep2>) => void;
}

export const useSurveyStore = create<SurveyState>((set) => ({
  step2: {
    title: "",
    isReleased: true,
    releaseDate: "",
    genre: "",
  },
  setStep2: (data) =>
    set((state) => ({
      step2: {
        ...state.step2,
        ...data,
      },
    })),
}));
