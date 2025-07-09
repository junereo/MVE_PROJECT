// 설문 유형, 공식/일반

import { Question_type } from '@/types';

export enum SurveyTypeEnum {
    GENERAL = 'general',
    OFFICIAL = 'official',
}

// 커스텀 설문 타입, 객관식/체크박스/서술형
export enum QuestionTypeEnum {
    MULTIPLE = 'multiple',
    CHECKBOX = 'checkbox',
    SUBJECTIVE = 'subjective',
}

export interface SurveyResponse {
    id: number;
    create_at: string;
    survey_title: string;
    type: SurveyTypeEnum;
    start_at: string;
    end_at: string;
    is_active: 'upcoming' | 'ongoing' | 'closed';
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
}

// 모든 질문 통합 타입
export interface AllQuestion {
    question_text: string;
    question_type: Question_type;
    type: QuestionTypeEnum;
    category: string;
    options: string[];
    max_num?: number;
}

//템플릿 문자열
export interface ParsedTemplateQuestion {
    question_text: string;
    question_type: string;
    options: string[];
    type: string;
    max_num?: number;
}
