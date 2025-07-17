import { QuestionTypeEnum } from '@/app/survey/create/complete/type';
import { Question_type } from '@/types';

export interface FixedQuestion {
    category: string;
    question_text: string;
    question_type: Question_type;
    type: QuestionTypeEnum;
    options: string[];
    max_num?: number;
}

const fixedQuestions: FixedQuestion[] = [
    // step1
    {
        category: 'step1',
        question_text: '이 음원에 대한 첫인상은 어땠나요? (1개 선택)',
        question_type: Question_type.fixed,
        type: QuestionTypeEnum.MULTIPLE,
        options: ['매우 좋다', '보통이다', '아니다', '잘 모르겠다'],
        max_num: 1,
    },
    {
        category: 'step1',
        question_text: '이 음원에 어울리는 분위기는 무엇인가요? (최대 3개)',
        question_type: Question_type.fixed,
        type: QuestionTypeEnum.CHECKBOX,
        options: [
            '신나는',
            '재밌는',
            '우울한',
            '웅장한',
            '슬픈',
            '신비로운',
            '사랑스러운',
        ],
        max_num: 3,
    },
    {
        category: 'step1',
        question_text:
            '이 음원의 가장 기억에 남는 포인트가 무엇인가요? (1개 선택)',
        question_type: Question_type.fixed,
        type: QuestionTypeEnum.MULTIPLE,
        options: ['가사', '보컬', '멜로디', '편곡', '사운드'],
        max_num: 1,
    },

    // step2
    {
        category: 'step2',
        question_text: '이 음원이 노래방에서 자주 불릴 수 있을까요? (1개 선택)',
        question_type: Question_type.fixed,
        type: QuestionTypeEnum.MULTIPLE,
        options: ['예', '아니오'],
        max_num: 1,
    },
    {
        category: 'step2',
        question_text:
            '이 음원이 장기자랑 무대에서 사용될 수 있을까요? (1개 선택)',
        question_type: Question_type.fixed,
        type: QuestionTypeEnum.MULTIPLE,
        options: ['예', '아니오'],
        max_num: 1,
    },
    {
        category: 'step2',
        question_text:
            '이 음원의 라이브 공연이 열린다면 참여하고 싶으신가요? (1개 선택)',
        question_type: Question_type.fixed,
        type: QuestionTypeEnum.MULTIPLE,
        options: ['예', '아니오'],
        max_num: 1,
    },
    {
        category: 'step2',
        question_text: '이 음원이 듣기 좋은 장소는 어디인가요? (최대 3개)',
        question_type: Question_type.fixed,
        type: QuestionTypeEnum.CHECKBOX,
        options: [
            '드라이브',
            '카페/음식점',
            '운동/헬스',
            '집에서 휴식할 때',
            '여행/야외',
            '스터디',
            '공부할 때',
        ],
        max_num: 3,
    },

    // step3
    {
        category: 'step3',
        question_text:
            '이 음원이 오랫동안 인기를 유지할 수 있을까요? (1개 선택)',
        question_type: Question_type.fixed,
        type: QuestionTypeEnum.MULTIPLE,
        options: ['매우 그렇다', '그렇다', '보통이다', '그렇지 않다'],
        max_num: 1,
    },
    {
        category: 'step3',
        question_text: '다른 가수가 리메이크 한다면 어울릴 것 같은 아티스트는?',
        question_type: Question_type.fixed,
        type: QuestionTypeEnum.SUBJECTIVE,
        options: [],
        max_num: 1,
    },
    {
        category: 'step3',
        question_text: '이 음원의 한줄평',
        question_type: Question_type.fixed,
        type: QuestionTypeEnum.SUBJECTIVE,
        options: [],
        max_num: 1,
    },
];

export default fixedQuestions;
