import { create } from 'zustand';

type SurveyType = 'general' | 'official';

// 설문 생성 1단계 정보 구조 정의
export type SurveyStep1 = {
    survey_title: string; //설문 제목
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
    start_at: string; // 설문 시작일 (start_at 으로 수정)
    end_at: string; // 설문 종료일 (end_at 으로 수정)
    is_active?: string; // 설문 활성화 여부
    surveyType: SurveyType; // 설문 타입 (일반, 리워드)
    reward_amount?: number; // 리워드 총량 (리워드 타입일 때)
    reward?: number; // 일반 유저 리워드 (리워드 타입일 때)
    expertReward?: number; // Expert 유저 리워드 (리워드 타입일 때)
    templateSetKey: string; // 선택된 템플릿 키
};

// 설문 생성 2단계 정보 구조 정의
type SurveyStep2 = {
    answers: {
        originality?: number;
        popularity?: number;
        sustainability?: number;
        expandability?: number;
        stardom?: number;
    };
    tags: { [key: string]: string };
    selectedTags: string[];
    template_id?: number;
    customQuestions: {
        id: number;
        question_text: string;
        options: string[];
        question_type: string;
        category?: string;
        max_num?: number;
        type: string;
    }[];
    categoryQuestions: Record<string, unknown[]>; // 템플릿에서 자동 주입된 기본 설문 문항들
    survey_question?: string;
};

// 상태 구조 정의
interface SurveyState {
    step1: SurveyStep1;
    setStep1: (
        update: Partial<SurveyStep1> | ((prev: SurveyStep1) => SurveyStep1),
    ) => void;

    step2: SurveyStep2;
    setStep2: (data: Partial<SurveyStep2>) => void;

    setCategoryQuestions: (data: Record<string, unknown[]>) => void;
    setTemplateSetKey: (key: string) => void;

    resetSurvey: () => void; // 상태 초기화 함수
}

// Zustand 스토어 생성
export const useSurveyStore = create<SurveyState>((set) => ({
    step1: {
        survey_title: '',
        youtubeVideoId: '',
        youtubeTitle: '',
        youtubeThumbnail: '',
        artist: '',
        title: '',
        isReleased: true,
        releaseDate: '',
        url: '',
        genre: '',
        start_at: '',
        end_at: '',
        surveyType: 'general',
        channelTitle: '',
        reward_amount: 0,
        reward: 0,
        expertReward: 0,
        respondent: [''],
        templateSetKey: '',
    },
    setStep1: (data) =>
        set((state) => ({
            step1: {
                ...state.step1,
                ...data,
            },
        })),

    step2: {
        answers: {},
        tags: {},
        customQuestions: [],
        categoryQuestions: {},
        selectedTags: [],
    },
    setStep2: (data) =>
        set((state) => ({
            step2: {
                ...state.step2,
                ...data,
            },
        })),

    // 템플릿 키 저장
    setTemplateSetKey: (key: string) =>
        set((state) => ({
            step1: {
                ...state.step1,
                templateSetKey: key,
            },
        })),

    // 기본 설문 문항 저장
    setCategoryQuestions: (data: Record<string, unknown[]>) =>
        set((state) => ({
            step2: {
                ...state.step2,
                categoryQuestions: data,
            },
        })),

    // 상태 초기화
    resetSurvey: () =>
        set(() => ({
            step1: {
                survey_title: '',
                youtubeVideoId: '',
                youtubeTitle: '',
                youtubeThumbnail: '',
                artist: '',
                title: '',
                isReleased: true,
                releaseDate: '',
                url: '',
                genre: '',
                start_at: '',
                end_at: '',
                surveyType: 'general',
                channelTitle: '',
                reward_amount: 0,
                reward: 0,
                expertReward: 0,
                respondent: [''],
                templateSetKey: '',
            },
            step2: {
                answers: {},
                tags: {},
                customQuestions: [],
                categoryQuestions: {},
                selectedTags: [],
            },
        })),
}));
