// ./tx/fixedQuestions.ts
import { QuestionTypeEnum } from '@/app/survey/create/complete/type';
import { Question_type } from '@/types';

// export enum Question_type {
//   fixed = 0,
//   customQuestions = 1,
// }

// export enum QuestionTypeEnum {
//   MULTIPLE = "multiple",
//   CHECKBOX = "checkbox",
//   SUBJECTIVE = "subjective",
// }

export interface FixedQuestion {
    category: string;
    question_text: string;
    question_type: Question_type;
    type: QuestionTypeEnum;
    options: string[];
    max_num?: number;
}

const fixedQuestions: FixedQuestion[] = [
    {
        category: 'step1',
        question_text: '이 음원에 대한 첫인상은 어땠나요?',
        question_type: Question_type.fixed,
        type: QuestionTypeEnum.MULTIPLE,
        options: ['매우 좋다', '보통이다', '아니다', '잘 모르겠다'],
    },
    {
        category: 'step1',
        question_text: '이 음원의 기억에 남는 포인트가 있다면 무엇인가요?',
        question_type: Question_type.fixed,
        type: QuestionTypeEnum.MULTIPLE,
        options: ['보컬', '편곡/사운드', '리듬/비트', '잘 모르겠다'],
    },
    {
        category: 'step1',
        question_text: '이 음원을 노래방에서 부르고 싶으신가요?',
        question_type: Question_type.fixed,
        type: QuestionTypeEnum.MULTIPLE,
        options: ['매우 그렇다', '그렇다', '보통이다', '그렇지 않다'],
    },
    {
        category: 'step2',
        question_text: '이 음원의 장르를 선택해주세요.',
        question_type: Question_type.fixed,
        type: QuestionTypeEnum.CHECKBOX,
        options: [
            '발라드',
            '힙합',
            'R&B',
            '댄스',
            '재즈',
            '클래식',
            'EDM',
            '국악',
        ],
    },
    {
        category: 'step2',
        question_text: '이 음원을 자주 들을 것 같으신가요?',
        question_type: Question_type.fixed,
        type: QuestionTypeEnum.MULTIPLE,
        options: [
            '매우 그렇다',
            '가끔 들을 것 같다',
            '잘 모르겠다',
            '전혀 아니다',
        ],
    },
    {
        category: 'step2',
        question_text: '이 음원이 오랫동안 인기를 유지할 수 있을까요?',
        question_type: Question_type.fixed,
        type: QuestionTypeEnum.MULTIPLE,
        options: ['매우 그렇다', '그렇다', '보통이다', '그렇지 않다'],
    },
    {
        category: 'step2',
        question_text:
            '이 음원의 활용 가능성은 어디에 있다고 생각하시나요? (복수선택 가능)',
        question_type: Question_type.fixed,
        type: QuestionTypeEnum.CHECKBOX,
        options: ['광고', '영화/드라마', '무대 공연', 'SNS 배경음', '없음'],
        max_num: 3,
    },
    {
        category: 'step3',
        question_text:
            '이 음원을 리메이크하면 어울릴 것 같은 아티스트는 누구인가요?',
        question_type: Question_type.fixed,
        type: QuestionTypeEnum.SUBJECTIVE,
        options: [],
    },
    {
        category: 'step3',
        question_text: '이 음원을 장기자랑 무대에서 사용할 의향이 있으신가요?',
        question_type: Question_type.fixed,
        type: QuestionTypeEnum.MULTIPLE,
        options: ['예', '아니오'],
    },
    {
        category: 'step3',
        question_text: '이 음원의 라이브 공연에 참여하고 싶으신가요?',
        question_type: Question_type.fixed,
        type: QuestionTypeEnum.MULTIPLE,
        options: ['예', '아니오'],
    },
];

export default fixedQuestions;
