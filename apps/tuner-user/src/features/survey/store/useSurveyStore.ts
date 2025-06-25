import { create } from "zustand";

type SurveyType = "common" | "official";

type BaseAnswerKey =
  | "originality"
  | "popularity"
  | "sustainability"
  | "expandability"
  | "stardom";

// Step2Meta
export type SurveyStep2 = {
  title: string;
  isReleased: boolean;
  releaseDate: string;
  genre: string;
};

// Step3Type
export type SurveyStep3 = {
  surveyType: SurveyType;
  reward_amount: number;
  reward: number;
  expertReward: number;
};

// Step4Default
export type SurveyStep4 = {
  answers: Partial<Record<BaseAnswerKey, number>>;
  tags: { [key in BaseAnswerKey]?: string };
  selectedTags: BaseAnswerKey[];
};

interface SurveyState {
  step2: SurveyStep2;
  setStep2: (data: Partial<SurveyStep2>) => void;
  step3: SurveyStep3;
  setStep3: (data: Partial<SurveyStep3>) => void;
  step4: SurveyStep4;
  setStep4: (data: Partial<SurveyStep4>) => void;
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
  step4: {
    answers: {},
    tags: {},
    selectedTags: [],
  },
  setStep4: (data) =>
    set((state) => ({
      step4: {
        ...state.step4,
        ...data,
      },
    })),
}));
