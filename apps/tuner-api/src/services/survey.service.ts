import {
  PrismaClient,
  SurveyActive,
  QuestionType,
  SurveyType,
  SurveyStatus,
  Survey,
  Survey_Question,
} from "@prisma/client";
// import { FIXED_SURVEY_QUESTIONS } from '../constants/fixedSurveyQuestions';

const prisma = new PrismaClient();

// 상태 계산 (한국시간 기준)
const checkSurveyActive = (
  _start: Date | string,
  _end: Date | string
): SurveyActive => {
  const now = new Date();
  const start = new Date(_start);
  const end = new Date(_end);
  const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);

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
  if (status === "complete" && is_active === "ongoing") return true;
  return false;
};

// 설문참여 가능 여부
export const canParticipateSurvey = ({
  status,
  is_active,
}: {
  status: SurveyStatus;
  is_active: SurveyActive;
}): boolean => {
  return status === "complete" && is_active === "ongoing";
};

// 참여 저장 (임시저장/제출)
export const createSurveyParticipant = async ({
  user_id,
  survey_id,
  answers,
  isSubmit = false, // false: 임시저장, true: 제출
}: {
  user_id: number;
  survey_id: number;
  answers: any;
  isSubmit?: boolean;
}) => {
  // 참여 가능 상태 확인
  const survey = await prisma.survey.findUnique({
    where: { id: survey_id },
    select: { status: true, is_active: true },
  });

  console.log(user_id, survey_id);

  if (!survey) throw new Error("설문 없음");
  if (!canParticipateSurvey(survey)) {
    throw new Error("참여할 수 없는 상태입니다.");
  }

  // 기존 참여 내역 확인 (있으면 수정, 없으면 새로 생성)
  const existing = await prisma.survey_Participants.findFirst({
    where: { user_id, survey_id },
  });

  if (existing) {
    return await prisma.survey_Participants.update({
      where: { id: existing.id },
      data: {
        answers,
        status: isSubmit ? "complete" : "draft",
        rewarded: false,
      },
    });
  }

  const result = await prisma.survey_Participants.create({
    data: {
      user_id,
      survey_id,
      answers,
      status: isSubmit ? "complete" : "draft",
      rewarded: false,
    },
  });

  console.log("existing", result)

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
    if (!isSurveyType(body.type)) {
      throw new Error(`잘못된 설문 타입: ${body.type}`);
    }

    const surveyType = body.type as SurveyType;
    const startDate = new Date(body.start_at);
    const endDate = new Date(body.end_at);
    const releasedDate = body.released_date
      ? new Date(body.released_date)
      : new Date();

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error("유효하지 않은 시작일 또는 종료일입니다.");
    }
    if (isNaN(releasedDate.getTime())) {
      throw new Error("유효하지 않은 발매일입니다.");
    }

    return await prisma.$transaction(async (tx) => {
      const survey: Survey = await tx.survey.create({
        data: {
          user_id: userId,
          music_title: body.music_title ?? null,
          artist: body.artist ?? null,
          music_uri: body.music_uri ?? null,
          thumbnail_uri: body.thumbnail_uri ?? null,
          genre: body.genre ?? null,
          is_released: !!body.is_released,
          released_date: releasedDate,
          type: surveyType,
          start_at: startDate,
          end_at: endDate,
          is_active: checkSurveyActive(startDate, endDate),
          survey_title: body.survey_title ?? "",
          survey_question: body.survey_question ?? [],
          status: body.status ?? "draft",
          reward: body.reward ?? 0,
          expert_reward: body.expert_reward ?? 0,
          reward_amount: body.reward_amount ?? 0,
          questions: body.questions ?? 0,
          ...(surveyType === SurveyType.official && {
            reward: body.reward,
            expert_reward: body.expert_reward,
            reward_amount: body.reward_amount,
          }),
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
  return await prisma.survey.findMany({
    include: {
      creator: { select: { id: true } },
    },
    orderBy: { start_at: "desc" },
  });
};

// 질문지 생성 또는 업데이트
export const setSurveyQuestion = async ({
  surveyId,
  questionType,
  question,
  order,
}: {
  surveyId: number;
  questionType: QuestionType;
  question: object;
  order: number;
}) => {
  return await prisma.survey_Question.upsert({
    where: { id: surveyId },
    update: {
      question_type: questionType,
      question: question,
      question_order: order,
    },
    create: {
      survey_id: surveyId,
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
  if (!editSurvey(survey)) {
    throw new Error("설문이 종료되어 수정할 수 없습니다.");
  }

  const updatedSurvey = await prisma.survey.update({
    where: { id: surveyId },
    data: {
      survey_title: body.survey_title,
      start_at: new Date(body.start_at),
      end_at: new Date(body.end_at),
      status: body.status,
      is_active: checkSurveyActive(body.start_at, body.end_at),
    },
  });

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
