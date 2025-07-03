import { create } from "zustand";
import { InputTypeEnum } from "../types/enums";

export type QuestionItem = {
  category: string;
  question_text: string;
  type: InputTypeEnum;
  question_type: "fixed";
  options?: string[];
};

interface DefaultQuestionState {
  questions: QuestionItem[];
  setQuestions: (qs: QuestionItem[]) => void;
  resetQuestions: () => void;
}

export const useDefaultQuestionStore = create<DefaultQuestionState>((set) => ({
  questions: [],
  setQuestions: (qs) => set({ questions: qs }),
  resetQuestions: () => set({ questions: [] }),
}));
