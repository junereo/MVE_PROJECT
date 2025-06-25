// 로그인
export interface LoginFormData {
  email: string;
  password: string;
}

// 설문 생성 페이로드
export interface SurveyCreatePayload {
  // 음원 정보
  title: string;
  artist: string;
  release_date: string;
  is_released: boolean;
  thumbnailUrl: string;
  sample_url: string;
  channelTitle: string;
  genre: string;

  // 설문 정보
  start_at: string;
  end_at: string;
  type: string;
  reward_amount: number;
  reward: number;
  expert_reward: number;
  templateSetKey: string;

  // 질문 관련
  evaluationScores: Record<string, number>; // 여기 타입 구체적으로 정의 가능함 (예: Record<string, number>)
  allQuestions: string; // JSON.stringify 된 문자열

  // 해시태그
  tags: { [key: string]: string };
}

// 로그인 데이터 에러
export type LoginFormErrors = Partial<Record<keyof LoginFormData, string>>;

// 회원가입
export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone_number: string;
  role: string | number;
}
// 회원가입 데이터 에러
export type SignupFormErrors = Partial<Record<keyof SignupFormData, string>>;
