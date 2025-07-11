import { SurveyTypeEnum, QuestionTypeEnum, InputTypeEnum } from "./enums";

export interface SurveyResponse {
  id: number;
  user_id: number;
  created_at: string;

  music_title: string;
  artist: string;
  music_uri: string;
  thumbnail_uri: string;

  survey_title: string;
  type: SurveyTypeEnum;
  start_at: string;
  end_at: string;
  is_active: "upcoming" | "ongoing" | "closed";

  is_released: boolean;
  released_date: string;

  reward_amount: number;
  reward: number;
  expert_reward: number;

  genre: string;
  participants: {
    user: {
      id: number;
      nickname: string;
      role: "ordinary" | "expert" | "admin";
    };
  }[];

  survey_question: {
    id?: number;
    category: string;
    question_type: QuestionTypeEnum;
    question_text: string;
    type: InputTypeEnum;
    options: string[];
    max_num: number | "";
  }[];
}
