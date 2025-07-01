import { SurveyTypeEnum, QuestionTypeEnum } from "./enums";

export interface SurveyResponse {
  id: number;
  create_at: string;

  survey_title: string;
  type: SurveyTypeEnum;
  start_at: string;
  end_at: string;
  is_active: "upcoming" | "ongoing" | "closed";
  template_id: number;

  reward_amount: number;
  reward: number;
  expert_reward: number;

  music: {
    title: string;
    artist: string;
    sample_url: string;
    thumbnail_url: string;
  };

  survey_custom: {
    id: number;
    question_type: QuestionTypeEnum;
    question_text: string;
    options: string[];
  }[];
}
