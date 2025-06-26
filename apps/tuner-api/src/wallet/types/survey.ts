export type SurveyType = "general" | "reward";

export interface SurveyStep1 extends SurveyStep2 {
  youtubeVideoId: string; // 유튜브 영상 ID
  youtubeTitle: string; // 유튜브 영상 제목
  youtubeThumbnail: string; // 유튜브 영상 썸네일
  artist: string; // 아티스트명
  title: string; // 곡 제목
  channelTitle: string; // 채널명
  url: string; // 유튜브 URL
  updated_at?: string; // 마지막 수정일
  isReleased: boolean; // 발매 여부
  releaseDate: string; // 발매일
  genre: string; // 장르
  respondent: string[]; // 응답자 (응답자 ID로 수정 필요)
  start_at: string; // 설문 시작일 (start_at 으로 수정 )
  end_at: string; // 설문 종료일 (end_at 으로 수정)
  is_active?: string; // 설문 활성화 여부
  surveyType: SurveyType; // 설문 타입 (일반, 리워드) (type 으로 수정)
  reward_amount?: number; // 리워드 총량 (리워드 타입일 때)
  reward?: number; // 일반 유저 리워드 (리워드 타입일 때)
  expertReward?: number; // Expert 유저 리워드 (리워드 타입일 때)
  value: string;
  totalNumber : string;
  totalReward : string;
}

export interface SurveyStep2 {
  answers: {
    originality?: number; // 작품성
    popularity?: number; // 대중성
    sustainability?: number; // 지속성
    expandability?: number; // 확장성
    stardom?: number; // 스타성
  };
  hashtags: string[];
  customQuestions: {
    id: number; // 질문 ID
    text: string; // 질문 내용
    options: string[]; // 선택지 (서술형 질문은 빈 배열)
  }[];
}

export interface SurveyState {
  step1: SurveyStep1;
  setStep1: (data: Partial<SurveyStep1>) => void;

  step2: SurveyStep2;
  setStep2: (data: Partial<SurveyStep2>) => void;
}

export interface SubmitSurveyBody {
  uid: string;
  surveyId: string;
  data: SurveyStep1; // 또는 명확한 타입 지정 (예: Record<string, number>)
}