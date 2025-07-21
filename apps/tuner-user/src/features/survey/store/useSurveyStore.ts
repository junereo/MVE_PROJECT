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
  thumbnail_uri?: string;
  start_at: Date | null;
  end_at: Date | null;
}

// Step2Meta
export type SurveyStep2 = {
  survey_title: string;
  is_released: boolean;
  released_date: string;
  genre: string;
};

// Step3Type
export type SurveyStep3 = {
  surveyType: SurveyTypeEnum;
  reward_amount: number;
  reward: number;
  expert_reward: number;
};

// 기본 설문 + 커스텀 설문
export type Questions = {
  id: number;
  category: string;
  question_text: string;
  type: InputTypeEnum;
  question_type: QuestionTypeEnum;
  options?: string[];
  max_num?: number;
};

// Step4Question
export interface SurveyStep4 {
  questions: Questions[]; // 기본 질문
  customQuestions: Questions[]; // 커스텀 질문
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

  step4: SurveyStep4;
  setStep4: (data: SurveyStep4) => void;
  addCustomQuestion: (question: Questions) => void; // 커스텀 질문 추가
  updateCustomQuestion: (id: number, updated: Questions) => void; // 커스텀 질문 수정
  removeCustomQuestion: (id: number) => void; // 커스텀 질문 삭제

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
    thumbnail_uri: "",
    start_at: null,
    end_at: null,
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
    released_date: "",
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
    questions: [],
    customQuestions: [],
  },
  setStep4: (data) => set({ step4: data }),

  addCustomQuestion: (question) =>
    set((state) => ({
      step4: {
        ...state.step4,
        customQuestions: [...state.step4.customQuestions, question],
      },
    })),

  updateCustomQuestion: (id, updated) =>
    set((state) => ({
      step4: {
        ...state.step4,
        customQuestions: state.step4.customQuestions.map((q) =>
          q.id === id ? updated : q
        ),
      },
    })),

  removeCustomQuestion: (id) =>
    set((state) => ({
      step4: {
        ...state.step4,
        customQuestions: state.step4.customQuestions.filter((q) => q.id !== id),
      },
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
        thumbnail_uri: "",
        start_at: null,
        end_at: null,
      },
      step2: {
        survey_title: "",
        is_released: true,
        released_date: "",
        genre: "",
      },
      step3: {
        surveyType: SurveyTypeEnum.OFFICIAL,
        reward_amount: 0,
        reward: 0,
        expert_reward: 0,
      },
      step4: {
        questions: [],
        customQuestions: [],
      },
    })),
}));
