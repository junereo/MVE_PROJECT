import { SurveyTypeEnum } from "./enums";

export type SurveyPayload = {
  artist: string;
  title: string;
  thumbnail_url: string;
  sample_url: string;
  start_at: string;
  end_at: string;

  survey_title: string;
  release_date: string;
  is_released: boolean;
  genre: string;

  survey_type: SurveyTypeEnum;
  reward_amount: number;
  reward: number;
  expert_reward: number;

  customQuestions: string; //JSON.stringify 문자열
};
