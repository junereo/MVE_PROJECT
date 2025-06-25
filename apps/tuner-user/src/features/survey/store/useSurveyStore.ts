import { create } from "zustand";

// YouTube
export type SelectedVideo = {
  artist: string;
  title: string;
  thumbnail_url: string;
  channelTitle: string;
};

// Step1YouTube
export interface SurveyStep1 {
  video: SelectedVideo | null;
  start_at: string;
  end_at: string;
}

// Step2Meta
export type SurveyStep2 = {
  title: string;
  is_released: boolean;
  release_date: string;
  genre: string;
};

// Step3Type
type SurveyType = "general" | "official";

export type SurveyStep3 = {
  surveyType: SurveyType;
  reward_amount: number;
  reward: number;
  expert_reward: number;
};

// Step4Default
type BaseAnswerKey =
  | "originality"
  | "popularity"
  | "sustainability"
  | "expandability"
  | "stardom";

export type SurveyStep4 = {
  answers: Partial<Record<BaseAnswerKey, number>>;
  tags: { [key in BaseAnswerKey]?: string };
  selectedTags: BaseAnswerKey[];
};

// Step5Custom
export type QuestionType = "multiple" | "checkbox" | "subjective";

export type CustomQuestion = {
  id: number;
  text: string;
  type: QuestionType;
  options: string[];
};

export interface SurveyStep5 {
  customQuestions: CustomQuestion[];
}

interface SurveyState {
  selectedVideo: SelectedVideo | null;
  setSelectedVideo: (video: SelectedVideo | null) => void;
  step1: SurveyStep1;
  setStep1: (data: Partial<SurveyStep1>) => void;
  step2: SurveyStep2;
  setStep2: (data: Partial<SurveyStep2>) => void;
  step3: SurveyStep3;
  setStep3: (data: Partial<SurveyStep3>) => void;
  step4: SurveyStep4;
  setStep4: (data: Partial<SurveyStep4>) => void;
  step5: SurveyStep5;
  setStep5: (data: SurveyStep5) => void;
}

export const useSurveyStore = create<SurveyState>((set) => ({
  selectedVideo: null,
  setSelectedVideo: (video) => set(() => ({ selectedVideo: video })),
  step1: {
    video: null,
    start_at: "",
    end_at: "",
  },
  setStep1: (data) =>
    set((state) => ({
      step1: {
        ...state.step1,
        ...data,
      },
    })),
  step2: {
    title: "",
    is_released: true,
    release_date: "",
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
    surveyType: "general",
    reward_amount: 0,
    reward: 0,
    expert_reward: 0,
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
  step5: {
    customQuestions: [],
  },
  setStep5: (data) =>
    set(() => ({
      step5: data,
    })),
}));
