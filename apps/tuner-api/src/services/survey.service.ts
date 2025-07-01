import {
  PrismaClient,
  SurveyTags,
  SurveyActive,
  QuestionType,
  SurveyType,
  SurveyStatus,
} from '@prisma/client';
// import { FIXED_SURVEY_QUESTIONS } from '../constants/fixedSurveyQuestions';

const prisma = new PrismaClient();

// 설문 맵핑
const convertType = (t: string): QuestionType => {
  if (t === 'multiple_choice') return 'multiple_choice';
  if (t === 'check_box') return 'check_box';
  if (t === 'text') return 'text';
  if (t === 'ranking') return 'ranking';
  if (t === 'likert') return 'likert';
  return 'text';
};

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

// ✅ 설문 생성 (템플릿 제거 버전)
export const createSurvey = async ({
  userId,
  adminId,
  body,
}: {
  userId?: string;
  adminId?: string;
  body: any;
}) => {
  try {
    if (!userId && !adminId) throw new Error('유저 또는 관리자 필요');
    if (userId && adminId) throw new Error('둘 다 있을 수 없음');
    if (!isSurveyType(body.type)) throw new Error(`잘못된 설문 타입: ${body.type}`);

    const surveyType = body.type as SurveyType;

    return await prisma.$transaction(async (tx) => {
      // 음악 저장
      const music = await tx.music.create({
        data: {
          title: body.title,
          artist: body.artist,
          release_date: body.release_date ? new Date(body.release_date) : undefined,
          is_released: body.is_released,
          thumbnail_url: body.thumbnail_url,
          sample_url: body.sample_url,
          agency: '',
          description: '',
          nft_token_id: '',
        },
      });

      // 태그 파싱
      const tagValues: SurveyTags[] = (Object.values(body.tags || {}) as string[])
        .filter((v): v is SurveyTags =>
          Object.values(SurveyTags).includes(v as SurveyTags)
        );

      const startDate = new Date(body.start_at);
      const endDate = new Date(body.end_at);

      // 설문 생성
      const survey = await tx.survey.create({
        data: {
          ...(userId ? { create_userId: userId } : {}),
          ...(adminId ? { create_adminId: adminId } : {}),
          music_id: music.id,
          type: surveyType,
          start_at: startDate,
          end_at: endDate,
          is_active: checkSurveyActive(startDate, endDate),
          tags: { set: tagValues },
          status: body.status ?? 'draft',
          survey_title: body.survey_title,

          ...(surveyType === SurveyType.official && {
            reward: body.reward,
            expert_reward: body.expert_reward,
            reward_amount: body.reward_amount,
          }),
        },
      });

      // // ✅ 고정 질문 삽입
      // const fixedQuestions = FIXED_SURVEY_QUESTIONS.map((q, idx) => ({
      //   survey_id: survey.id,
      //   question_text: q.question_text,
      //   question_type: q.question_type,
      //   options: JSON.stringify(q.options ?? []),
      //   is_required: true,
      //   question_order: idx + 1,
      // }));

      // // ✅ 커스텀 질문 삽입
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

      // ✅ 전체 질문 저장
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

// ✅ 설문 불러오기
export const getSurveyListService = async () => {
  return await prisma.survey.findMany({
    include: {
      music: true,
      creator: { select: { id: true } },
      director: { select: { id: true } },
      survey_custom: true,
    },
    orderBy: { start_at: 'desc' },
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
        tags: {
          set: (Object.values(body.tags || {}) as string[]).filter(
            (v): v is SurveyTags => Object.values(SurveyTags).includes(v as SurveyTags)
          ),
        },
        reward: body.reward,
        reward_amount: body.reward_amount,
        expert_reward: body.expert_reward,
      },
    });

    // 기존 커스텀 문항 가져오기
    const existingQuestions = await tx.survey_Custom.findMany({
      where: { survey_id: surveyId },
    });
    const existingIds = new Set(existingQuestions.map((q) => q.id));

    const incomingQuestions = Array.isArray(body.allQuestions)
      ? body.allQuestions
      : JSON.parse(body.allQuestions);

    const incomingIds = new Set<number>();

    await Promise.all(
      incomingQuestions.map(async (q: any, idx: number) => {
        const questionData = {
          question_text: q.text?.trim() || '(비어 있는 질문)',
          question_type: convertType(q.type),
          options: JSON.stringify(q.options ?? []),
          is_required: q.is_required ?? true,
          question_order: q.question_order ?? idx + 1,
        };

        if (q.id && existingIds.has(q.id)) {
          incomingIds.add(q.id);
          await tx.survey_Custom.update({
            where: { id: q.id },
            data: questionData,
          });
        } else {
          const created = await tx.survey_Custom.create({
            data: {
              survey_id: surveyId,
              ...questionData,
            },
          });
          incomingIds.add(created.id);
        }
      })
    );

    const idsToDelete = [...existingIds].filter((id) => !incomingIds.has(id));
    if (idsToDelete.length > 0) {
      await tx.survey_Custom.deleteMany({
        where: { id: { in: idsToDelete } },
      });
    }

    return updatedSurvey;
  });
};
