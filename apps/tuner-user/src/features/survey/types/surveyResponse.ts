import { GenreKey } from "@/features/users/constants/userInfoMap";
import { FormattedAnswer } from "./answer";
import { SurveyTypeEnum, QuestionTypeEnum, InputTypeEnum } from "./enums";

export interface SurveyResponse {
  user_id?: number;

  id: number;
  created_at: string;

  music_title: string;
  artist: string;
  music_uri: string;
  thumbnail_uri: string;

  genre?: string;

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

  status: "draft" | "complete";

  participants?: {
    id: number;
    survey_id: number;
    user_id: number;
    status: "draft" | "complete";
    rewarded: boolean;
    answers: FormattedAnswer[];
    created_at: string;
    updated_at: string;
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
