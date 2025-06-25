import { SurveyTypeEnum, QuestionTypeEnum } from "./enums";

export type SurveyPayload = {
  step1: {
    video: {
      artist: string;
      title: string;
      thumbnail_url: string;
      sample_url: string;
    };
    start_at: string;
    end_at: string;
  };
  step2: {
    survey_title: string;
    is_released: boolean;
    release_date: string;
    genre: string;
  };
  step3: {
    surveyType: SurveyTypeEnum;
    reward_amount: number;
    reward: number;
    expert_reward: number;
  };
  step4: {
    answers: Partial<Record<string, number>>;
    tags: Record<string, string>;
  };
  step5: {
    customQuestions: {
      id: number;
      question_text: string;
      question_type: QuestionTypeEnum;
      options: string[];
    }[];
  };
};
