import { InputTypeEnum } from "../types/enums";

export interface DefaultQuestion {
  question_text: string;
  question_type: number;
  type: InputTypeEnum;
  options: string[];
  category: string;
  max_num: number;
}

export const fixedSurveyQuestions = {
  step1: [
    {
      question_text: "이 음원에 대한 첫인상은 어땠나요? (1개 선택)",
      type: "multiple",
      question_type: "fixed",
      category: "step1",
      options: ["매우 좋다", "보통이다", "아니다", "잘 모르겠다"],
      max_num: 1,
    },
    {
      question_text: "이 음원에 어울리는 분위기는 무엇인가요? (최대 3개)",
      type: "checkbox",
      question_type: "fixed",
      category: "step1",
      options: [
        "신나는",
        "재밌는",
        "우울한",
        "웅장한",
        "슬픈",
        "신비로운",
        "사랑스러운",
      ],
      max_num: 3,
    },
    {
      question_text:
        "이 음원의 가장 기억에 남는 포인트가 무엇인가요? (1개 선택)",
      type: "multiple",
      question_type: "fixed",
      category: "step1",
      options: ["가사", "보컬", "멜로디", "편곡", "사운드"],
      max_num: 1,
    },
  ],
  step2: [
    {
      question_text: "이 음원이 노래방에서 자주 불릴 수 있을까요? (1개 선택)",
      type: "multiple",
      question_type: "fixed",
      category: "step2",
      options: ["예", "아니오"],
      max_num: 1,
    },
    {
      question_text:
        "이 음원이 장기자랑 무대에서 사용될 수 있을까요? (1개 선택)",
      type: "multiple",
      question_type: "fixed",
      category: "step2",
      options: ["예", "아니오"],
      max_num: 1,
    },
    {
      question_text:
        "이 음원의 라이브 공연이 열린다면 참여하고 싶으신가요? (1개 선택)",
      type: "multiple",
      question_type: "fixed",
      category: "step2",
      options: ["예", "아니오"],
      max_num: 1,
    },
    {
      question_text: "이 음원이 듣기 좋은 장소는 어디인가요? (최대 3개)",
      type: "checkbox",
      question_type: "fixed",
      category: "step2",
      options: [
        "드라이브",
        "카페/음식점",
        "운동/헬스",
        "집에서 휴식할 때",
        "여행/야외",
        "스터디",
        "공부할 때",
      ],
      max_num: 3,
    },
  ],
  step3: [
    {
      question_text:
        "다른 가수가 리메이크 한다면 어울릴 것 같은 아티스트는? (1개 선택)",
      type: "subjective",
      question_type: "fixed",
      category: "step3",
      options: [],
      max_num: 1,
    },
    {
      question_text: "이 음원의 한줄평",
      type: "subjective",
      question_type: "fixed",
      category: "step3",
      options: [],
      max_num: 1,
    },
  ],
};
