import { PrismaClient } from "@prisma/client";
import { AnswerItem } from "../types/survey.types";

const prisma = new PrismaClient();

export const calculateSurveyResult = async (surveyId: number) => {
    try {
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

        const statsByGroup: Record<string, any> = {};

        // GLOBAL 버킷 초기화
        statsByGroup['GLOBAL'] = {
            totalScores: {},
            countScores: {},
            choiceCounts: {},
            freeAnswers: {},
            count: 0,
        };

        participants.forEach(({ answers, user }) => {
            let parsedAnswers: AnswerItem[] = [];

            if (Array.isArray(answers)) {
                parsedAnswers = answers as AnswerItem[];
            } else if (answers && Array.isArray((answers as any).answers)) {
                parsedAnswers = (answers as any).answers as AnswerItem[];
            } else {
                console.warn("유효한 answers 구조 아님:", answers);
                return;
            }

            const groupKey = `gender_${user?.gender ?? "unknown"}_age_${user?.age ?? "unknown"}_job_${user?.job_domain ?? "unknown"}`;

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
            const global = statsByGroup['GLOBAL'];

            [group, global].forEach(bucket => {
                bucket.count += 1;

                parsedAnswers.forEach(({ id, type, answer }) => {
                    switch (type) {
                        case "multiple":
                            if (typeof answer === "string") {
                                const key = `${id}-${answer}`;
                                bucket.choiceCounts[key] = (bucket.choiceCounts[key] || 0) + 1;
                            }
                            break;

                        case "checkbox":
                            if (Array.isArray(answer)) {
                                answer.forEach(option => {
                                    const key = `${id}-${option}`;
                                    bucket.choiceCounts[key] = (bucket.choiceCounts[key] || 0) + 1;
                                });
                            }
                            break;

                        case "subjective":
                            if (typeof answer === "string") {
                                if (!bucket.freeAnswers[id]) bucket.freeAnswers[id] = [];
                                bucket.freeAnswers[id].push(answer);
                            }
                            break;

                        default:
                            if (typeof answer === "number") {
                                bucket.totalScores[id] = (bucket.totalScores[id] || 0) + answer;
                                bucket.countScores[id] = (bucket.countScores[id] || 0) + 1;
                            }
                            break;
                    }
                });
            });
        });

        const survey_statistics: Record<string, any> = { groups: {} };

        // 그룹별 평균 & 퍼센트
        Object.entries(statsByGroup).forEach(([groupKey, bucket]) => {
            if (groupKey === 'GLOBAL') return;

            const averages: Record<string, number> = {};
            Object.keys(bucket.totalScores).forEach(qid => {
                averages[qid] = bucket.totalScores[qid] / bucket.countScores[qid];
            });

            const choicePercentages: Record<string, number> = {};
            Object.entries(bucket.choiceCounts as Record<string, number>).forEach(([key, count]) => {
                choicePercentages[key] = Math.round((count / bucket.count) * 1000) / 10;
            });

            survey_statistics.groups[groupKey] = {
                averages,
                choiceCounts: bucket.choiceCounts,
                choicePercentages,
                freeAnswers: bucket.freeAnswers,
                respondents: bucket.count,
            };
        });

        //  GLOBAL
        const global = statsByGroup['GLOBAL'];
        const globalAverages: Record<string, number> = {};
        Object.keys(global.totalScores).forEach(qid => {
            globalAverages[qid] = global.totalScores[qid] / global.countScores[qid];
        });

        const globalChoicePercentages: Record<string, number> = {};
        Object.entries(global.choiceCounts as Record<string, number>).forEach(([key, count]) => {
            globalChoicePercentages[key] = Math.round((count / global.count) * 1000) / 10;
        });

        const topChoices = (Object.entries(global.choiceCounts) as [string, number][])
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([key, count]) => ({
                key,
                count,
                percentage: Math.round((count / global.count) * 1000) / 10,
            }));

        survey_statistics.global = {
            averages: globalAverages,
            choiceCounts: global.choiceCounts,
            choicePercentages: globalChoicePercentages,
            topChoices,
            freeAnswers: global.freeAnswers,
            respondents: global.count,
        };

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
