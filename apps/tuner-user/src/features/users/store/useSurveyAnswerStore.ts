import { create } from "zustand";
import type { MySurveyAnswer } from "@/features/users/types/MySurveyAnswer";

interface SurveyAnswerState {
  answers: MySurveyAnswer[];
  setAnswers: (data: MySurveyAnswer[]) => void;
  clearAnswers: () => void;
}

export const useSurveyAnswerStore = create<SurveyAnswerState>((set) => ({
  answers: [],
  setAnswers: (data) => set({ answers: data }),
  clearAnswers: () => set({ answers: [] }),
}));
