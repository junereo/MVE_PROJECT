import { SurveyResponse } from "@/features/survey/types/surveyResponse";
import { GenreKey } from "../constants/userInfoMap";

export type UserRole = "ordinary" | "expert";

export interface UserSurveyInfo {
  gender: "남성" | "여성" | "";
  age: "" | "10대" | "20대" | "30대" | "40대" | "50대" | "60대 이상";
  genre: GenreKey | "";
  jobDomain: boolean | undefined;
}

// 백엔드 전송용
export interface UserUpdatePayload {
  gender: boolean;
  age: "teen" | "twenties" | "thirties" | "forties" | "fifties" | "sixties";
  genre: GenreKey;
  job_domain: boolean;
}

// 기본 프로필 수정
export interface UserProfileUpdatePayload {
  nickname?: string;
  phone_number?: string;
  email?: string;
}

// 간편비밀번호 수정
export interface WalletUpdatePayload {
  simple_password: string;
}

export interface UserProfileProps {
  nickname: string;
  role: UserRole;
}

export interface withdrawalProps {
  balance: number;
}

// 마이페이지 전체 사용자 정보용
export interface FullUserInfo {
  id: number;
  nickname: string;
  email: string;
  role: UserRole;
  wallet_address: string | null;
  genre: string;
  age: string;
  gender: boolean;
  job_domain: boolean;
  surveys: SurveyResponse[];
  surveyResponses: SurveyResponse[];
  phone_number: string;
  simple_password: string;
  balance: number;
}
