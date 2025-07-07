import { create } from "zustand";
import {
  SurveyTypeEnum,
  QuestionTypeEnum,
  InputTypeEnum,
} from "../types/enums";

// YouTube
export type SelectedVideo = {
  artist: string;
  music_title: string;
  thumbnail_uri: string;
  music_uri: string;
  channelTitle: string;
  select_url: string;
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

// Step5Custom
export type CustomQuestion = {
  id: number;
  question_type: QuestionTypeEnum.CUSTOM;
  question_text: string;
  type: InputTypeEnum;
  options: string[];
};

export interface SurveyStep5 {
  customQuestions: CustomQuestion[];
}

// 설문 생성 성공 / 에러 / 임시저장 성공 / 에러
type SurveySubmitStatus = "success" | "error" | "saved" | "save-error" | null;

interface SurveyState {
  selectedVideo: SelectedVideo | null;
  setSelectedVideo: (video: SelectedVideo | null) => void;
  step1: SurveyStep1;
  setStep1: (data: Partial<SurveyStep1>) => void;
  step2: SurveyStep2;
  setStep2: (data: Partial<SurveyStep2>) => void;
  step3: SurveyStep3;
  setStep3: (data: Partial<SurveyStep3>) => void;
  step5: SurveyStep5;
  setStep5: (data: SurveyStep5) => void;
  createdSurveyId: number | null;
  setCreatedSurveyId: (id: number) => void;

  surveySubmitStatus: SurveySubmitStatus;
  setSurveySubmitStatus: (status: SurveySubmitStatus) => void;

  resetSurvey: () => void;
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
  step5: {
    customQuestions: [],
  },
  setStep5: (data) =>
    set(() => ({
      step5: data,
    })),
  createdSurveyId: null,
  setCreatedSurveyId: (id) => set(() => ({ createdSurveyId: id })),

  surveySubmitStatus: null,
  setSurveySubmitStatus: (status) =>
    set(() => ({ surveySubmitStatus: status })),

  resetSurvey: () =>
    set(() => ({
      selectedVideo: null,
      step1: {
        video: null,
        start_at: "",
        end_at: "",
      },
      step2: {
        survey_title: "",
        is_released: true,
        release_date: "",
        genre: "",
      },
      step3: {
        surveyType: SurveyTypeEnum.OFFICIAL,
        reward_amount: 0,
        reward: 0,
        expert_reward: 0,
      },
      step5: {
        customQuestions: [],
      },
    })),
}));
