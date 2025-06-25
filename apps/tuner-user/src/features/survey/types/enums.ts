// 설문 유형, 공식/일반
export enum SurveyTypeEnum {
  GENERAL = "general",
  OFFICIAL = "official",
}

/*
숫자로 보낼 시

export enum SurveyTypeEnum {
  GENERAL = 0,
  OFFICIAL = 1,
}
*/

// 설문 카테고리, 작품성/대중성/지속성/확장성/스타성
export enum SurveyCategoryEnum {
  ORIGINALITY = "originality",
  POPULARITY = "popularity",
  SUSTAINABILITY = "sustainability",
  EXPANDABILITY = "expandability",
  STARDOM = "stardom",
}

// 커스텀 설문 타입, 객관식/체크박스/서술형
export enum QuestionTypeEnum {
  MULTIPLE = "multiple",
  CHECKBOX = "checkbox",
  SUBJECTIVE = "subjective",
}

/*
숫자로 보낼 시

export enum QuestionTypeEnum {
  MULTIPLE = 0,
  CHECKBOX = 1,
  SUBJECTIVE = 2
}
*/
