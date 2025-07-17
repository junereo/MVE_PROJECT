export interface SurveyResultResponse {
  success: boolean;
  data: SurveyResultData;
}

export interface SurveyResultData {
  created_at: string;
  id: number;
  is_public: boolean;
  metadata_ipfs: string | null;
  respondents: number;
  reward_claimed: number;
  reward_claimed_amount: number;
  survey_id: number;
  survey_statistics: { [key: string]: QuestionStat | DemographicData }; // 설문 문항별 통계
}

export interface QuestionStat {
  id: number;
  average: number[]; // 옵션별 응답 수
}

export interface Demographics {
  demographics: DemographicData;
}

export interface DemographicData {
  age: Record<AgeGroup, number>;
  gender: Record<Gender, number>;
  genre: Record<Genre, number>;
  job_domain: Record<"yes" | "no", number>;
}

export type AgeGroup =
  | "teen"
  | "twenties"
  | "thirties"
  | "forties"
  | "fifties"
  | "sixties";
export type Gender = "male" | "female";
export type Genre =
  | "ballad"
  | "hiphop"
  | "rnb"
  | "rock"
  | "dance"
  | "jazz"
  | "classical"
  | "edm"
  | "gukak"
  | "ccm"
  | "pop"
  | "trot";
