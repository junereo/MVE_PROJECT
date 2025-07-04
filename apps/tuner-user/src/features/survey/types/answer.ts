import type { UserInfo } from "@/features/users/types/userInfo";

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
  question_id: number;
  answer: string | number | string[];
}

export interface SurveySubmitPayload {
  user_id: string;
  survey_id: number;
  user_info: UserInfo;
  answers: FormattedAnswer[];
}
