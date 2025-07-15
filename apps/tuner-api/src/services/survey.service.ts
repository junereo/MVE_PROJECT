import {
  PrismaClient,
  SurveyActive,
  QuestionType,
  SurveyType,
  SurveyStatus,
  Survey,
  Genre,
  Survey_Question,
} from "@prisma/client";
import { AnswerItem } from "../types/survey.types";
import { calculateSurveyResult } from "./survey.result.service";
import { DateTime } from "luxon";
// import { FIXED_SURVEY_QUESTIONS } from '../constants/fixedSurveyQuestions';

const prisma = new PrismaClient();

// 상태 계산 (한국시간 기준)
export const checkSurveyActive = (
  _start: Date | string,
  _end: Date | string
): SurveyActive => {
  const kstNow = DateTime.now().setZone("Asia/Seoul");
  const start = DateTime.fromJSDate(new Date(_start)).setZone("Asia/Seoul");
  const end = DateTime.fromJSDate(new Date(_end)).setZone("Asia/Seoul");

  if (kstNow < start) return "upcoming";
  if (kstNow >= start && kstNow <= end) return "ongoing";
  return "closed";
};

// 설문 수정
export const editSurvey = ({
  status,
  is_active,
}: {
  status: SurveyStatus;
  is_active: SurveyActive;
}): boolean => {
  if (status === "draft") return true;
  if (status === "complete" && is_active === "upcoming") return true;
  return false;
};

// 설문참여 가능 여부
export const createSurveyParticipant = async ({
  user_id,
  survey_id,
  answers,
  status,
  user_info,
}: {
  user_id: number;
  survey_id: number;
  answers: AnswerItem[];
  status?: SurveyStatus;
  user_info?: {
    gender?: boolean | null;
    age?: string | null;
    genre?: string[] | null;
    job_domain?: boolean | null;
  };
}) => {
  const survey = await prisma.survey.findUnique({
    where: { id: survey_id },
    select: { status: true, is_active: true, reward: true, expert_reward: true },
  });
  if (!survey) throw new Error("해당 설문이 존재하지 않습니다.");

  const user = await prisma.user.findUnique({
    where: { id: user_id },
    select: {
      gender: true,
      age: true,
      genre: true,
      job_domain: true,
      role: true,
      badge_issued_at: true,
    },
  });
  if (!user) throw new Error("해당 유저가 존재하지 않습니다.");

  const needsUpdate =
    user.gender === null ||
    user.age === null ||
    !user.genre || user.genre.length === 0 ||
    user.job_domain === null;

  if (needsUpdate) {
    if (!user_info) throw new Error("최초 참여: user_info 필요!");

    await prisma.user.update({
      where: { id: user_id },
      data: {
        gender: user_info.gender,
        age: user_info.age as any,
        genre: Array.isArray(user_info.genre) && user_info.genre.length > 0
          ? user_info.genre[0] as Genre
          : null,
        job_domain: user_info.job_domain,
      },
    });
  }

  const existing = await prisma.survey_Participants.findFirst({
    where: { user_id, survey_id },
  });

  // 지급 리워드 결정
  let rewardAmount = 0;
  if (user.role === 'expert') {
    rewardAmount = survey.expert_reward ?? 0;
  } else if (user.role === 'ordinary') {
    rewardAmount = survey.reward ?? 0;
  }

  let participantStatus: SurveyStatus = SurveyStatus.draft;
  if (status === SurveyStatus.complete) {
    participantStatus = SurveyStatus.complete;
  }

  if (existing) {
    return await prisma.survey_Participants.update({
      where: { id: existing.id },
      data: {
        answers,
        status: participantStatus,
        rewarded: rewardAmount,
      },
    });
  }

  return await prisma.survey_Participants.create({
    data: {
      user_id,
      survey_id,
      answers,
      status: participantStatus,
      rewarded: rewardAmount,
    },
  });
};


// 설문 타입 유효성 검사
const isSurveyType = (value: any): value is SurveyType => {
  return Object.values(SurveyType).includes(value);
};

//  설문 생성
export const createSurvey = async ({
  userId,
  body,
}: {
  userId?: number;
  body: any;
}) => {
  try {
    if (!userId) throw new Error("유저 필요");

    // 타입 검사
    if (!Object.values(SurveyType).includes(body.type)) {
      throw new Error(`잘못된 설문 타입: ${body.type}`);
    }

    const kstNow = DateTime.now().setZone("Asia/Seoul");

    const startDate = body.start_at ? new Date(body.start_at) : kstNow.toJSDate();

    const endDate = kstNow.endOf("day").toJSDate();

    if (startDate >= endDate) {
      throw new Error("종료일은 시작일 이후여야 합니다.");
    }

    const releasedDate = body.released_date
      ? new Date(body.released_date)
      : kstNow.toJSDate();

    return await prisma.$transaction(async (tx) => {
      const survey = await tx.survey.create({
        data: {
          user_id: userId,
          survey_title: body.survey_title ?? "",
          music_title: body.music_title ?? "",
          artist: body.artist ?? "",
          music_uri: body.music_uri ?? "",
          thumbnail_uri: body.thumbnail_uri ?? "",
          genre: body.genre ?? null,
          is_released: !!body.is_released,
          released_date: releasedDate,
          type: body.type,
          start_at: startDate,
          end_at: endDate,
          is_active: checkSurveyActive(startDate, endDate),
          status: body.status ?? "draft",
          reward: body.reward ?? 0,
          expert_reward: body.expert_reward ?? 0,
          reward_amount: body.reward_amount ?? 0,
          questions: body.questions ?? 0,
          survey_question: body.survey_question ?? [],
        },
      });
      // //  고정 질문 삽입
      // const fixedQuestions = FIXED_SURVEY_QUESTIONS.map((q, idx) => ({
      //   survey_id: survey.id,
      //   question_text: q.question_text,
      //   question_type: q.question_type,
      //   options: JSON.stringify(q.options ?? []),
      //   is_required: true,
      //   question_order: idx + 1,
      // }));

      // // 커스텀 질문 삽입
      // const additionalQuestions = Array.isArray(body.additionalQuestions)
      //   ? body.additionalQuestions
      //   : JSON.parse(body.additionalQuestions || '[]');

      // const customQuestions = additionalQuestions.map((q: any, idx: number) => ({
      //   survey_id: survey.id,
      //   question_text: q.text?.trim() || '(비어 있는 질문)',
      //   question_type: convertType(q.type),
      //   options: JSON.stringify(q.options ?? []),
      //   is_required: q.is_required ?? true,
      //   question_order: FIXED_SURVEY_QUESTIONS.length + idx + 1,
      // }));

      // const surveyCustoms = [...fixedQuestions, ...customQuestions];
      // if (surveyCustoms.length > 0) {
      //   await tx.survey_Custom.createMany({ data: surveyCustoms });
      // }

      console.log("설문 생성 완료:", survey.id);
      return survey;
    });
  } catch (err) {
    console.error("설문 생성 실패:", err);
    throw err;
  }
};

//  설문 불러오기
export const getSurveyListService = async () => {
  const surveys = await prisma.survey.findMany({
    include: {
      creator: { select: { id: true } },
    },
    orderBy: { start_at: "desc" },
  });

  const kstNow = DateTime.now().setZone("Asia/Seoul");

  // 상태 동기화
  for (const survey of surveys) {
    const start = DateTime.fromJSDate(new Date(survey.start_at)).setZone("Asia/Seoul");
    const end = DateTime.fromJSDate(new Date(survey.end_at)).setZone("Asia/Seoul");

    const newState = checkSurveyActive(start.toJSDate(), end.toJSDate());

    if (survey.is_active !== newState) {
      await prisma.survey.update({
        where: { id: survey.id },
        data: { is_active: newState },
      });
    }
  }

  return surveys;
};


// 질문지 생성 또는 업데이트
export const setSurveyQuestion = async ({
  surveyQuestionId,
  questionType,
  question,
  order,
}: {
  surveyQuestionId: number;
  questionType: QuestionType;
  question: object;
  order: number;
}) => {
  return await prisma.survey_Question.upsert({
    where: { id: surveyQuestionId },
    update: {
      question_type: questionType,
      question: question,
      question_order: order,
    },
    create: {
      question_type: questionType,
      question: question,
      question_order: order,
    },
  });
};

//질문지 검색
export const getSurveyQuestions = async (surveyId: number) => {
  if (surveyId === 0) {
    // 전체 설문 질문 조회
    return await prisma.survey_Question.findMany({
      orderBy: { question_order: "asc" },
    });
  }

  // 특정 설문에 대한 질문만 조회
  return await prisma.survey_Question.findMany({
    where: { id: surveyId },
    orderBy: { question_order: "asc" },
  });
};

// 전체 조회
export const getAllSurveyParticipants = async () => {
  return await prisma.survey_Participants.findMany({
    orderBy: { created_at: "desc" },
    include: {
      user: {
        select: {
          id: true,
          nickname: true,
          role: true,
        },
      },
      survey: true,
    },
  });
};

// 설문 정보 수정
export const updateSurveyService = async (surveyId: number, body: any) => {
  const survey = await prisma.survey.findUnique({
    where: { id: surveyId },
    select: { status: true, is_active: true },
  });
  if (!survey) throw new Error("설문 없음");

  const kstNow = DateTime.now().setZone("Asia/Seoul");

  const start_at = body.start_at ? new Date(body.start_at) : kstNow.toJSDate();
  const end_at = kstNow.endOf("day").toJSDate();

  if (start_at >= end_at) {
    throw new Error("종료일은 시작일 이후여야 합니다.");
  }

  const updatedSurvey = await prisma.survey.update({
    where: { id: surveyId },
    data: {
      survey_title: body.survey_title ?? "",
      start_at,
      end_at,
      status: body.status ?? survey.status,
      is_active: checkSurveyActive(start_at, end_at),
    },
  });

  if (updatedSurvey.status === "complete" || updatedSurvey.is_active === "closed") {
    await calculateSurveyResult(surveyId);
  }

  return updatedSurvey;
};


export const createSurveyResult = async ({
  survey_id,
  survey_statistics,
  is_public = false,
  metadata_ipfs,
  respondents,
  reward_claimed_amount,
  reward_claimed,
}: {
  survey_id: number;
  survey_statistics: any;
  is_public?: boolean;
  version?: number;
  metadata_ipfs?: string;
  respondents: number;
  reward_claimed_amount: number;
  reward_claimed: number;
}) => {
  return await prisma.survey_Result.create({
    data: {
      survey_id,
      survey_statistics,
      is_public,
      metadata_ipfs,
      respondents,
      reward_claimed_amount,
      reward_claimed,
      created_at: new Date(),
    },
  });
};

export const getSurveyResult = async (surveyId: number) => {
  return await prisma.survey_Result.findUnique({
    where: { survey_id: surveyId },
  });
};

export const getSurveyQuestion = async ({
  surveyId,
  userId,
}: {
  surveyId: number;
  userId: number;
}) => {
  const survey = await prisma.survey.findUnique({
    where: { id: surveyId },
    select: {
      id: true,
      survey_title: true,
      survey_question: true,
      is_active: true,
      status: true,
    },
  });

  if (!survey) throw new Error("설문 없음");

  //
  let groupedQuestions: Record<string, any[]> = {};

  if (Array.isArray(survey.survey_question)) {
    groupedQuestions = survey.survey_question.reduce((acc, item) => {
      const question = item as any;
      const category = question.category || "step1";
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {} as Record<string, any[]>);
  }

  const participant = await prisma.survey_Participants.findFirst({
    where: { user_id: userId, survey_id: surveyId },
  });

  return [
    {
      id: survey.id,
      survey_title: survey.survey_title,
      questions: groupedQuestions,
      participant,
    },
  ];
};

export const updateSurveyResponse = async ({
  userId,
  surveyId,
  answers,
  status = SurveyStatus.draft,
}: {
  userId: number;
  surveyId: number;
  answers: any;
  status?: SurveyStatus;
}) => {
  const updated = await prisma.survey_Participants.updateMany({
    where: {
      user_id: userId,
      survey_id: surveyId,
    },
    data: {
      answers: answers,
      status: status,
    },
  });

  return updated;
};
