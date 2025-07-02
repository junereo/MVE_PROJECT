// 설문 유형, 공식/일반

export enum SurveyTypeEnum {
  GENERAL = "general",
  OFFICIAL = "official",
}

// 커스텀 설문 타입, 객관식/체크박스/서술형
export enum QuestionTypeEnum {
  MULTIPLE = "multiple",
  CHECKBOX = "checkbox",
  SUBJECTIVE = "subjective",
}

export interface SurveyResponse {
  id: number;
  create_at: string;
  survey_title: string;
  type: SurveyTypeEnum;
  start_at: string;
  end_at: string;
  is_active: "upcoming" | "ongoing" | "closed";
  questions: number;
  reward_amount: number;
  reward: number;
  expert_reward: number;
  thumbnail_uri: string;
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
