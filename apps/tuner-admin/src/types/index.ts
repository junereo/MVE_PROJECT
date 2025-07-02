import { QuestionTypeEnum } from "@/app/survey/create/complete/type";

export type SurveyType = "general" | "official";

export enum AdminRole {
  superadmin = 0,
  admin = 1,
}
export enum Question_type {
  fix = 0,
  customQuestions = 1,
}
// 로그인
export interface LoginFormData {
  email: string;
  password: string;
}

// 설문 생성 페이로드
export interface SurveyCreatePayload {
  // 🎵 음원 정보
  title: string; // 음원 제목
  artist: string; // 아티스트명
  release_date: string; // 발매일 (YYYY-MM-DD 형식)
  // is_released: boolean; // 발매 여부
  thumbnail_uri: string; // 유튜브 썸네일 이미지
  music_uri: string; // 유튜브 URL
  genre: string; // 장르 (예: hiphop, ballad 등)

  // 📅 설문 정보
  survey_title: string; // 설문 제목
  start_at: string; // 설문 시작일
  end_at: string; // 설문 종료일
  type: SurveyType; // 설문 유형 (general | official)
  reward_amount: number; // 총 리워드량
  reward: number; // 일반 사용자 리워드
  expert_reward: number; // Expert 사용자 리워드
  templateSetKey: string; // 템플릿 질문 키
  question_type: Question_type; // 질문 타입 구분 enum (기본 0 = fix)
  questions: number; // 고정 질문 id
  // 📊 평가 점수
  evaluationScores?: Record<string, number>;
  // 예시: { originality: 3, popularity: 2, ... }

  allQuestions?: string;

  // 🏷️ 해시태그 정보
  tags?: { [key: string]: string };
  // 예시: { emotional: "감성적인", retro: "복고풍" }
}

// 로그인 데이터 에러
export type LoginFormErrors = Partial<Record<keyof LoginFormData, string>>;

// 회원가입
export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  phone_number: string;
  role: AdminRole;
}
// 회원가입 데이터 에러
export type SignupFormErrors = Partial<Record<keyof SignupFormData, string>>;

// 고정 질문  데이터
export interface FixedQuestion {
  question_text: string;
  question_type: Question_type;
  type: QuestionTypeEnum;
  options: string[];
}
export interface SurveyQuestion {
  Survey_question: string;
  question: Record<string, FixedQuestion[]>;
}
// types/survey.ts
