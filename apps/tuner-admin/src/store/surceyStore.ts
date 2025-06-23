import { create } from "zustand";

type SurveyType = "general" | "reward";

interface SurveyStep1 {
  youtubeVideoId: string; // 유튜브 영상 ID
  youtubeTitle: string; // 유튜브 영상 제목
  youtubeThumbnail: string; // 유튜브 영상 썸네일
  artist: string; // 아티스트명
  title: string; // 곡 제목
  isReleased: boolean; // 발매 여부
  releaseDate: string; // 발매일
  url: string; // 유튜브 URL
  genre: string; // 장르
  startDate: string; // 설문 시작일
  endDate: string; // 설문 종료일
  surveyType: SurveyType; // 설문 타입 (일반, 리워드)
  channelTitle: string; // 채널명
  totalReward?: number; // 리워드 총량 (리워드 타입일 때)
  normalReward?: number; // 일반 유저 리워드 (리워드 타입일 때)
  expertReward?: number; // Expert 유저 리워드 (리워드 타입일 때)
}

interface SurveyStep2 {
  answers: {
    originality?: number; // 작품성
    popularity?: number; // 대중성
    sustainability?: number; // 지속성
    expandability?: number; // 확장성
    stardom?: number; // 스타성
  };
  hashtags: string[];
  customQuestions: {
    id: number; // 질문 ID
    text: string; // 질문 내용
    options: string[]; // 선택지 (서술형 질문은 빈 배열)
  }[];
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
    customQuestions: [],
  },
  setStep2: (data) =>
    set((state) => ({
      step2: {
        ...state.step2,
        ...data,
      },
    })),
}));
