import { create } from "zustand";

// Step2Meta
export type SurveyStep2 = {
  title: string;
  isReleased: boolean;
  releaseDate: string;
  genre: string;
};

type SurveyType = "common" | "official";

// Step3Type
export type SurveyStep3 = {
  surveyType: SurveyType;
  reward_amount: number;
  reward: number;
  expertReward: number;
};

interface SurveyState {
  step2: SurveyStep2;
  setStep2: (data: Partial<SurveyStep2>) => void;
  step3: SurveyStep3;
  setStep3: (data: Partial<SurveyStep3>) => void;
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
  step3: {
    surveyType: "common",
    reward_amount: 0,
    reward: 0,
    expertReward: 0,
  },
  setStep3: (data) =>
    set((state) => ({
      step3: {
        ...state.step3,
        ...data,
      },
    })),
}));
