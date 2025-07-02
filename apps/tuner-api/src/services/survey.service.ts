import {
  PrismaClient,
  SurveyActive,
  QuestionType,
  SurveyType,
  SurveyStatus,
  Survey,
  Survey_Question,
} from '@prisma/client';
// import { FIXED_SURVEY_QUESTIONS } from '../constants/fixedSurveyQuestions';

const prisma = new PrismaClient();

// 상태 계산 (한국시간 기준)
const checkSurveyActive = (_start: Date | string, _end: Date | string): SurveyActive => {
  const now = new Date();
  const start = new Date(_start);
  const end = new Date(_end);
  const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);

  if (kstNow < start) return 'upcoming';
  if (kstNow >= start && kstNow <= end) return 'ongoing';
  return 'closed';
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
    if (!userId) throw new Error('유저 필요');
    if (!isSurveyType(body.type)) throw new Error(`잘못된 설문 타입: ${body.type}`);

    const surveyType = body.type as SurveyType;

    return await prisma.$transaction(async (tx) => {
      // 설문 생성

      const startDate = new Date(body.start_at);
      const endDate = new Date(body.end_at);

      const survey: Survey = await tx.survey.create({
        data: {
          //  필수 외래키: 사용자 ID
          user_id: userId ?? 0, // 적절한 fallback 설정

          //  음악 정보
          music_title: body.music_title ?? null,
          artist: body.artist ?? null,
          music_uri: body.music_uri, // music 객체의 sample_url 사용
          thumbnail_uri: body.thumbnail_uri,
          genre: body.genre, //장르
          // 기본 필드
          type: surveyType,
          start_at: startDate,
          end_at: endDate,
          is_active: checkSurveyActive(startDate, endDate),
          survey_title: body.survey_title,
          status: body.status ?? 'draft',
          reward: body.reward ?? 0,
          expert_reward: body.expert_reward ?? 0,
          reward_amount: body.reward_amount ?? 0,
          questions: body.questions ?? 0,

          // 보상 정보 (official 설문에만)
          ...(surveyType === SurveyType.official && {
            reward: body.reward,
            expert_reward: body.expert_reward,
            reward_amount: body.reward_amount,
          }),
        },
      });

      console.log(survey);

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

      // 전체 질문 저장
      // const surveyCustoms = [...fixedQuestions, ...customQuestions];
      // if (surveyCustoms.length > 0) {
      //   await tx.survey_Custom.createMany({ data: surveyCustoms });
      // }

      console.log('설문 생성 완료:', survey.id);
      return survey;
    });
  } catch (err) {
    console.error('설문 생성 실패:', err);
    throw err;
  }
};

//  설문 불러오기
export const getSurveyListService = async () => {
  return await prisma.survey.findMany({
    include: {
      creator: { select: { id: true } },
    },
    orderBy: { start_at: 'desc' },
  });
};

//질문지 생성
export const setSurveyQuestion = async ({
  surveyId,
  questionType,
  question,
  order
}: {
  surveyId: number;
  questionType: QuestionType;
  question: object;
  order: number;
}) => {
  return await prisma.survey_Question.create({
    data: {
      question_type: questionType,
      question: question,
      question_order: order
    }
  });
};

//질문지 검색
export const getSurveyQuestions = async (surveyId: number) => {
  if (surveyId === 0) {
    // 전체 설문 질문 조회
    return await prisma.survey_Question.findMany({
      orderBy: { question_order: 'asc' }
    });
  }

  // 특정 설문에 대한 질문만 조회
  return await prisma.survey_Question.findMany({
    where: { id: surveyId },
    orderBy: { question_order: 'asc' }
  });
};

// 생성 (POST)
export const createSurveyParticipant = async ({
  user_id,
  survey_id,
  answers,
  status = 'complete',
  rewarded = true
}: {
  user_id: number;
  survey_id: number;
  answers: any;
  status?: SurveyStatus;
  rewarded?: boolean;
}) => {
  return await prisma.survey_Participants.create({
    data: {
      user_id,
      survey_id,
      answers,
      status,
      rewarded
    }
  });
};

// 전체 조회 (GET)
export const getAllSurveyParticipants = async () => {
  return await prisma.survey_Participants.findMany({
    orderBy: { created_at: 'desc' },
    include: {
      user: true,
      survey: true
    }
  });
};

// 설문 정보 수정
export const updateSurveyService = async (surveyId: number, body: any) => {
  return await prisma.$transaction(async (tx) => {
    const updatedSurvey = await tx.survey.update({
      where: { id: surveyId },
      data: {
        survey_title: body.survey_title,
        start_at: new Date(body.start_at),
        end_at: new Date(body.end_at),
        status: body.status,
        is_active: checkSurveyActive(body.start_at, body.end_at),
        reward: body.reward,
        reward_amount: body.reward_amount,
        expert_reward: body.expert_reward,
      },
    });

    // 기존 커스텀 문항 가져오기
    const existingQuestions = await tx.survey_Question.findMany({
      orderBy: { question_order: 'asc' },
    });
    const existingIds = new Set(existingQuestions.map((q) => q.id));

    const incomingQuestions = Array.isArray(body.allQuestions)
      ? body.allQuestions
      : JSON.parse(body.allQuestions);

    const incomingIds = new Set<number>();

    await Promise.all(
      incomingQuestions.map(async (q: any, idx: number) => {
        const questionData = {
          question: {
            text: q.text?.trim() || '(비어 있는 질문)',
            options: q.options ?? [],
          },
          question_type: q.type,
          question_order: q.question_order ?? idx + 1,
        };

        if (q.id && existingIds.has(q.id)) {
          incomingIds.add(q.id);
          await tx.survey_Question.update({
            where: { id: q.id },
            data: questionData,
          });
        } else {
          const created = await tx.survey_Question.create({
            data: {
              ...questionData,
            },
          });
          incomingIds.add(created.id);
        }
      })
    );

    const idsToDelete = [...existingIds].filter((id) => !incomingIds.has(id));
    if (idsToDelete.length > 0) {
      await tx.survey_Question.deleteMany({
        where: { id: { in: idsToDelete } },
      });
    }

    return updatedSurvey;
  });
};


export const createSurveyResult = async ({
  survey_id,
  survey_statistics,
  is_public = false,
  metadata_ipfs,
  respondents,
  reward_claimed_amount,
  reward_claimed
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
      created_at: new Date()
    }
  });
};

export const getSurveyResult = async (surveyId: number) => {
  return await prisma.survey_Result.findUnique({
    where: { survey_id: surveyId }
  });
};