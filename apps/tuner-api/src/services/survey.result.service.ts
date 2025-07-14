import { PrismaClient } from "@prisma/client";
import { JsonObject } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export const calculateSurveyResult = async (surveyId: number) => {
    try {
        // 참여자 불러오기 (참여자 + 유저 정보)
        const participants = await prisma.survey_Participants.findMany({
            where: { survey_id: surveyId, status: "complete" },
            select: {
                answers: true,
                user: {
                    select: {
                        gender: true,
                        age: true,
                        genre: true,
                        job_domain: true,
                    },
                },
            },
        });

        if (participants.length === 0) {
            console.log(`[SURVEY_RESULT] 참여자 없음: surveyId=${surveyId}`);
            return null;
        }

        // 그룹별 집계 컨테이너
        const statsByGroup: Record<string, any> = {};

        participants.forEach(({ answers, user }) => {
            if (!answers || typeof answers !== "object") return;

            const parsedAnswers = answers as JsonObject;

            // 그룹 키: 성별 + 연령대
            const groupKey = `gender_${user?.gender}_age_${user?.age}`;

            if (!statsByGroup[groupKey]) {
                statsByGroup[groupKey] = {
                    totalScores: {},
                    countScores: {},
                    choiceCounts: {},
                    freeAnswers: {},
                    count: 0,
                };
            }

            const group = statsByGroup[groupKey];
            group.count += 1;

            const submittedAnswers = (parsedAnswers.answers as any[]) || [];

            submittedAnswers.forEach((item: any) => {
                const questionId = item.id;
                const answer = item.answer;

                if (typeof answer === "number") {
                    group.totalScores[questionId] = (group.totalScores[questionId] || 0) + answer;
                    group.countScores[questionId] = (group.countScores[questionId] || 0) + 1;
                } else if (Array.isArray(answer)) {
                    answer.forEach((option: string) => {
                        const key = `${questionId}-${option}`;
                        group.choiceCounts[key] = (group.choiceCounts[key] || 0) + 1;
                    });
                } else if (typeof answer === "string") {
                    if (!group.freeAnswers[questionId]) group.freeAnswers[questionId] = [];
                    group.freeAnswers[questionId].push(answer);
                }
            });

            if (parsedAnswers.user_info) {
                Object.entries(parsedAnswers.user_info as Record<string, any>).forEach(
                    ([key, value]) => {
                        if (!group.freeAnswers[key]) group.freeAnswers[key] = [];
                        group.freeAnswers[key].push(value);
                    }
                );
            }
        });

        // 그룹별 평균 계산
        const survey_statistics: Record<string, any> = {};

        Object.entries(statsByGroup).forEach(([groupKey, group]) => {
            const averages: Record<string, number> = {};
            Object.keys(group.totalScores).forEach(questionId => {
                averages[questionId] = group.totalScores[questionId] / group.countScores[questionId];
            });

            survey_statistics[groupKey] = {
                averages,
                choiceCounts: group.choiceCounts,
                freeAnswers: group.freeAnswers,
                respondents: group.count,
            };
        });

        // Survey_Result upsert
        const result = await prisma.survey_Result.upsert({
            where: { survey_id: surveyId },
            update: {
                survey_statistics,
                respondents: participants.length,
            },
            create: {
                survey_id: surveyId,
                survey_statistics,
                respondents: participants.length,
                reward_claimed_amount: 0,
                reward_claimed: 0,
                created_at: new Date(),
            },
        });

        console.log(`[SURVEY_RESULT] 계산 완료: surveyId=${surveyId}`);
        return result;
    } catch (err) {
        console.error(`[SURVEY_RESULT] 오류:`, err);
        throw err;
    }
};
