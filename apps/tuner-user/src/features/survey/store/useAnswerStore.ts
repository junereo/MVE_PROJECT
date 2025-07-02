import { create } from "zustand";

type Answer = string | string[]; // 단일 선택 or 복수 선택

interface SurveyAnswers {
  [categoryKey: string]: {
    [questionIndex: number]: Answer;
  };
}

interface SurveyAnswerState {
  answers: SurveyAnswers;

  // 답변 저장
  setAnswer: (
    categoryKey: string, // 카테고리
    questionIndex: number, // 질문 index
    value: Answer // 선택 답변
  ) => void;
  resetAnswers: () => void; // 응답 초기화

  surveySubmitStatus?: "success" | "error"; // 에러 상태 추가
  setSubmitStatus: (status: "success" | "error") => void;
}

export const useAnswerStore = create<SurveyAnswerState>((set) => ({
  answers: {},
  setAnswer: (categoryKey, questionIndex, value) =>
    set((state) => ({
      answers: {
        ...state.answers, // 기존 전체 상태 유지
        [categoryKey]: {
          ...state.answers[categoryKey], // 해당 카테고리 유지
          [questionIndex]: value, // 해당 질문 인덱스에 새 답변 저장
        },
      },
    })),
  resetAnswers: () => set({ answers: {} }), // 설문 다시 시작 시 모든 답변 초기화

  surveySubmitStatus: undefined, // 초기 상태
  setSubmitStatus: (status) => set({ surveySubmitStatus: status }),
}));
