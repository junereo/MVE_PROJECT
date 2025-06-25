import { create } from "zustand";
import {
  SurveyTypeEnum,
  SurveyCategoryEnum,
  QuestionTypeEnum,
} from "../types/enums";

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
  survey_title: string;
  is_released: boolean;
  release_date: string;
  genre: string;
};

// Step3Type
export type SurveyStep3 = {
  surveyType: SurveyTypeEnum;
  reward_amount: number;
  reward: number;
  expert_reward: number;
};

// Step4Default
export type SurveyStep4 = {
  questions: Record<
    SurveyCategoryEnum,
    {
      question: string;
      options: string[];
    }
  >;
};

// Step5Custom
export type CustomQuestion = {
  id: number;
  question_text: string;
  question_type: QuestionTypeEnum;
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
    survey_title: "",
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
    surveyType: SurveyTypeEnum.OFFICIAL,
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
    questions: {
      [SurveyCategoryEnum.ORIGINALITY]: { question: "", options: [] },
      [SurveyCategoryEnum.POPULARITY]: { question: "", options: [] },
      [SurveyCategoryEnum.SUSTAINABILITY]: { question: "", options: [] },
      [SurveyCategoryEnum.EXPANDABILITY]: { question: "", options: [] },
      [SurveyCategoryEnum.STARDOM]: { question: "", options: [] },
    },
  },
  setStep4: (data: Partial<SurveyStep4>) =>
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
