import { create } from "zustand";
import { InputTypeEnum, QuestionTypeEnum } from "../types/enums";

export type QuestionItem = {
  id: string;
  category: string;
  question_text: string;
  type: InputTypeEnum;
  question_type: QuestionTypeEnum.FIXED;
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
