import type { UserInfo } from "@/features/users/types/userInfo";
import { InputTypeEnum, SurveyStatusEnum } from "./enums";

export type Answer = string | string[];

export interface SurveyAnswers {
  [categoryKey: string]: {
    [questionIndex: number]: Answer;
  };
}

export interface SurveyAnswerState {
  answers: SurveyAnswers;
  setAnswer: (
    categoryKey: string,
    questionIndex: number,
    value: Answer
  ) => void;
  resetAnswers: () => void;
  surveySubmitStatus?: "success" | "error";
  setSubmitStatus: (status: "success" | "error") => void;
}

export interface FormattedAnswer {
  id: number;
  question_text: string;
  type: InputTypeEnum;
  options: string[];
  max_num: number;
  answer: string | string[] | null;
}

export interface SurveySubmitPayload {
  user_id: string;
  survey_id: number;
  answers: FormattedAnswer[];
  status: SurveyStatusEnum;
}
