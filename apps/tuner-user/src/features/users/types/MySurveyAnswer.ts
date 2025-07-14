import type { FormattedAnswer } from "@/features/survey/types/answer";
import { SurveyTypeEnum } from "@/features/survey/types/enums";

export interface MySurveyAnswer {
  id: number;
  status: "complete" | "draft";
  survey_id: number;
  user_id: number;
  answers: FormattedAnswer[];

  survey: {
    id: number;
    survey_title: string;
    music_title: string;
    artist: string;
    thumbnail_uri: string;
    type: SurveyTypeEnum;
    start_at: string;
    end_at: string;
    reward_amount: number;
    expert_reward: number;
    reward: number;
    creator: {
      id: number;
      nickname: string;
    };
  };
}
