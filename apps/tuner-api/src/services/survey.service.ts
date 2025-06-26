import {
    PrismaClient,
    SurveyTags,
    SurveyActive,
    QuestionType,
    SurveyType,
    Prisma,
} from '@prisma/client';

const prisma = new PrismaClient();

// QuestionType 매핑
const convertType = (t: string): QuestionType => {
    if (t === 'multiple' || t === 'checkbox') return 'multiple_choice';
    if (t === 'subjective') return 'text';
    if (t === 'likert') return 'likert';
    if (t === 'ranking') return 'ranking';
    return 'text';
};

// 상태 계산 (KST 기준)
const checkSurveyActive = (_start: Date | string, _end: Date | string): SurveyActive => {
    const now = new Date();
    const start = new Date(_start);
    const end = new Date(_end);

    const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);

    if (kstNow < start) return 'upcoming';
    if (kstNow >= start && kstNow <= end) return 'ongoing';
    return 'closed';
};

// SurveyType 유효성 검사
const isValidSurveyType = (value: any): value is SurveyType => {
    return Object.values(SurveyType).includes(value);
};

// 설문 생성
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
        if (!userId && !adminId) {
            throw new Error("User 또는 Admin 중 하나는 반드시 존재해야 합니다.");
        }

        if (userId && adminId) {
            throw new Error("User와 Admin은 동시에 생성자로 들어올 수 없습니다.");
        }

        // 타입 유효성 검사
        if (!isValidSurveyType(body.type)) {
            throw new Error(`잘못된 SurveyType입니다: ${body.type}`);
        }

        // 타입 캐스팅
        const surveyType = body.type as SurveyType;

        return await prisma.$transaction(async (tx) => {
            //  Music 저장
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

            // SurveyTags 추출 및 필터링
            const tagValues: SurveyTags[] = (Object.values(body.tags || {}) as string[])
                .filter((v): v is SurveyTags =>
                    Object.values(SurveyTags).includes(v as SurveyTags)
                );

            //  reward 필수 검증 (공식 설문일 경우)
            if (surveyType === SurveyType.official) {
                if (
                    body.reward == null ||
                    body.expert_reward == null ||
                    body.reward_amount == null
                ) {
                    throw new Error("공식 설문에는 reward, expert_reward, reward_amount 모두 필요합니다.");
                }
            }

            const startDate = new Date(body.start_at);
            const endDate = new Date(body.end_at);

            // Survey 생성
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
                    status: 'draft',
                    ...(surveyType === SurveyType.official && {
                        reward: body.reward,
                        expert_reward: body.expert_reward,
                        reward_amount: body.reward_amount,
                    }),
                },
            });

            //  Survey_Custom 저장
            const questions = Array.isArray(body.allQuestions)
                ? body.allQuestions
                : JSON.parse(body.allQuestions);

            await Promise.all(
                questions.map((q: any, idx: number) => {
                    return tx.survey_Custom.create({
                        data: {
                            survey_id: survey.id,
                            question_text: q.text?.trim() || '(비어 있는 질문)',
                            question_type: convertType(q.type),
                            options: JSON.stringify(q.options ?? []),
                            is_required: true,
                            question_order: idx + 1,
                        },
                    });
                })
            );

            console.log('설문 생성 완료:', survey.id);
            return survey;
        });
    } catch (error) {
        console.error("survey 생성 에러:", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.error("Prisma Error Code:", error.code);
            console.error("Meta:", error.meta);
        }
        throw error;
    }
};
