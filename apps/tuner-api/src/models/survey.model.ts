import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface Survey {
  id: number;
  title: string;
  description: string;
  questions: Question[];
  created_at: Date;
  updated_at: Date;
}

export interface Question {
  id: number;
  survey_id: number;
  question_text: string;
  question_type: string;
  options?: string[];
  required: boolean;
}

// TODO: Prisma 스키마에 Survey와 Question 모델이 아직 정의되지 않았습니다.
// 스키마에 모델이 추가되면 아래 주석을 해제하고 사용하세요.
// export const SurveyModel = prisma.survey;
// export const QuestionModel = prisma.question;
