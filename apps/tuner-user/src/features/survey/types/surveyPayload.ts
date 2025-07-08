import { SurveyTypeEnum, SurveyStatusEnum, QuestionTypeEnum } from "./enums";

export type SurveyPayload = {
  // step1 youtube
  music_title: string;
  artist: string;
  music_uri: string;
  thumbnail_uri: string;

  // 시작, 종료 날짜 / ISO 8601 string
  start_at: string;
  end_at: string;

  // step2 설문 정보
  survey_title: string;
  is_released: boolean;
  release_date: string; // ISO 8601 string
  genre: string;

  // step3 타입
  type: SurveyTypeEnum;
  reward_amount: number;
  reward: number;
  expert_reward: number;

  // 질문
  question_type: QuestionTypeEnum;
  questions: number; // 고정 질문 id
  allQuestions?: string; // 고정 + 커스텀 질문 JSON.stringify 문자열

  // 상태
  status: SurveyStatusEnum;
};
