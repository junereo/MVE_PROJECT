// 설문 유형, 공식/일반
export enum SurveyTypeEnum {
  GENERAL = "general",
  OFFICIAL = "official",
}

// 설문 상태
export enum SurveyStatusEnum {
  DRAFT = "draft",
  COMPLETE = "complete",
}

// 커스텀 설문 타입, 객관식/체크박스/서술형
export enum InputTypeEnum {
  MULTIPLE = "multiple",
  CHECKBOX = "checkbox",
  SUBJECTIVE = "subjective",
}

// 질문 타입
export enum QuestionTypeEnum {
  FIXED = "fixed",
  CUSTOM = "custom",
}
