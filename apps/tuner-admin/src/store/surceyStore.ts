import { create } from "zustand";

type SurveyType = "general" | "reward";

interface SurveyStep1 {
  youtubeVideoId: string;
  youtubeTitle: string;
  youtubeThumbnail: string;
  artist: string;
  title: string;
  isReleased: boolean;
  releaseDate: string;
  url: string;
  genre: string;
  startDate: string;
  endDate: string;
  surveyType: SurveyType;
  channelTitle: string;
  totalReward?: number;
  normalReward?: number;
  expertReward?: number;
}

interface SurveyStep2 {
  answers: {
    originality?: string;
    popularity?: string;
    sustainability?: string;
    expandability?: string;
    stardom?: string;
  };
  hashtags: string[];
}

interface SurveyState {
  step1: SurveyStep1;
  setStep1: (data: Partial<SurveyStep1>) => void;

  step2: SurveyStep2;
  setStep2: (data: Partial<SurveyStep2>) => void;
}

export const useSurveyStore = create<SurveyState>((set) => ({
  step1: {
    youtubeVideoId: "",
    youtubeTitle: "",
    youtubeThumbnail: "",
    artist: "",
    title: "",
    isReleased: true,
    releaseDate: "",
    url: "",
    genre: "",
    startDate: "",
    endDate: "",
    surveyType: "general",
    channelTitle: "",
    totalReward: 0,
    normalReward: 0,
    expertReward: 0,
  },
  setStep1: (data) =>
    set((state) => ({
      step1: {
        ...state.step1,
        ...data,
      },
    })),

  // ✅ step2 추가
  step2: {
    answers: {},
    hashtags: [],
  },
  setStep2: (data) =>
    set((state) => ({
      step2: {
        ...state.step2,
        ...data,
      },
    })),
}));
