// import { QuestionTypeEnum } from '@/app/survey/create/complete/type';
// 로그인
export interface LoginFormData {
    email: string;
    password: string;
}
// 유튜브 타입
export interface YoutubeVideo {
    videoId: string;
    title: string;
    thumbnail: string;
    channelTitle: string;
}

export enum AdminRole {
    superadmin = 0,
    admin = 1,
}
// 질문 타입
export enum Question_type {
    fixed = 'fixed',
    custom = 'custom',
}
// 설문 상태 임시저장 or 생성
export enum SurveyStatus {
    draft = 'draft', // 임시저장
    complete = 'complete', // 생성 완료
}
// 설문 타입 enum
export type SurveyType = 'general' | 'official';

// 설문 생성 페이로드
export interface SurveyCreatePayload {
    //  음원 정보
    title: string; // 음원 제목
    artist: string; // 아티스트명
    release_date?: string; // 발매일 (YYYY-MM-DD 형식)
    thumbnail_uri: string | undefined; // 유튜브 썸네일 이미지
    music_uri: string; // 유튜브 URL
    genre: string; // 장르 (예: hiphop, ballad 등)
    // is_released: boolean; // 발매 여부

    // 설문 정보
    status: SurveyStatus; // 설문 상태 (임시저장 | 생성 완료)
    survey_title: string; // 설문 제목
    start_at: string; // 설문 시작일
    end_at: string; // 설문 종료일
    type: SurveyType; // 설문 유형 (general | official)
    reward_amount: number; // 총 리워드량
    reward: number; // 일반 사용자 리워드
    expert_reward: number; // Expert 사용자 리워드
    question_type: Question_type; // 질문 타입 구분 enum (기본 0 = fix)
    questions: number; // 고정 질문 id
    // templateSetKey: string; // 템플릿 질문 키
    //  평가 점수
    evaluationScores?: Record<string, number>;
    // 예시: { originality: 3, popularity: 2, ... }
    allQuestions?: string;
    // 해시태그 정보
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
export interface BackendQuestionPayload {
    question_text: string;
    question_type: Question_type;
    type: 'multiple' | 'checkbox' | 'subjective';
    options: string[];
    category: string;
    max_num?: number;
}

export interface SurveyQuestionPayload {
    survey_id: string | number;
    Survey_question: string;
    question: Record<string, BackendQuestionPayload[]>;
    question_type: Question_type;
    question_order: number;
}
// types/survey.ts

// 설문 상세 get 데이터
export interface SurveyData {
    id: number;
    survey_title: string;
    music_title: string;
    artist: string;
    music_uri: string;
    thumbnail_uri: string;
    is_released: boolean;
    released_date: string;
    user_id: number;
    type: 'general' | 'official';
    genre: string;
    start_at: string;
    end_at: string;
    reward_amount: number;
    reward: number;
    expert_reward: number;
    is_active: 'upcoming' | 'ongoing' | 'closed';
    ended_by: number | null;
    status: 'draft' | 'complete';
    created_at: string;
    updated_at: string;
    questions: number;
    creator: {
        id: number;
        nickname: string;
        role: string;
    };
    result: unknown;
}
