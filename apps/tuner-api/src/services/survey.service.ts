import {
    PrismaClient,
    SurveyTags,
    SurveyActive,
    QuestionType,
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

// 상태 계산
const checkSurveyActive = (start: Date, end: Date): SurveyActive => {
    const now = new Date();
    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'ongoing';
    return 'closed';
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

        return await prisma.$transaction(async (tx) => {
            // 1. Music 저장
            const music = await tx.music.create({
                data: {
                    title: body.title,
                    artist: body.artist,
                    release_date: body.release_date ? new Date(body.release_date) : undefined,
                    is_released: body.is_released,
                    thumbnailUrl: body.thumbnailUrl,
                    sample_url: body.sample_url,
                    agency: '',
                    description: '',
                    nft_token_id: '',
                },
            });

            //  태그 필터링
            const tagValues: SurveyTags[] = (Object.values(body.tags || {}) as string[])
                .filter((v): v is SurveyTags =>
                    Object.values(SurveyTags).includes(v as SurveyTags)
                );

            //  설문 생성
            const startDate = new Date(body.start_at);
            const endDate = new Date(body.end_at);

            const survey = await tx.survey.create({
                data: {
                    ...(userId ? { create_userId: userId } : {}),
                    ...(adminId ? { create_adminId: adminId } : {}),
                    music_id: music.id,
                    type: body.type,
                    start_at: startDate,
                    end_at: endDate,
                    reward_amount: body.reward_amount,
                    reward: body.reward,
                    expert_reward: body.expert_reward,
                    is_active: checkSurveyActive(startDate, endDate),
                    tags: { set: tagValues },
                    status: 'draft',
                },
            });

            // 설문 저장
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
