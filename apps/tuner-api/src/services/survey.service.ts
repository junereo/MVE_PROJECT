import { PrismaClient, SurveyTags, SurveyActive, QuestionType } from '@prisma/client';

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
const determineSurveyActive = (start: Date, end: Date): SurveyActive => {
    const now = new Date();
    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'ongoing';
    return 'closed';
};

// 설문 생성
export const createSurvey = async (userId: number, body: any) => {
    return await prisma.$transaction(async (tx) => {
        //  Music 저장
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

        // 태그 최대 4개(SurveyTags enum 배열)
        const tagValues: SurveyTags[] = (Object.values(body.tags || {}) as string[])
            .filter((v): v is SurveyTags => Object.values(SurveyTags).includes(v as SurveyTags))
            .slice(0, 4);


        // Survey 생성
        const startDate = new Date(body.start_at);
        const endDate = new Date(body.end_at);

        const survey = await tx.survey.create({
            data: {
                create_id: userId,
                music_id: music.id,
                type: body.type,
                start_at: startDate,
                end_at: endDate,
                reward_amount: body.reward_amount,
                reward: body.reward,
                expert_reward: body.expert_reward,
                is_active: determineSurveyActive(startDate, endDate),
                tags: tagValues,
                status: 'draft',
            },
        });

        // 질문 저장 
        const questions = JSON.parse(body.allQuestions);

        await Promise.all(
            questions.map((q: any, idx: number) =>
                tx.survey_Customer.create({
                    data: {
                        survey_id: survey.id,
                        question_text: q.text,
                        question_type: convertType(q.type),
                        options: q.options?.length ? JSON.stringify(q.options) : undefined,
                        is_required: true,
                        question_order: idx + 1,
                    },
                })
            )
        );

        return survey;
    });
};
